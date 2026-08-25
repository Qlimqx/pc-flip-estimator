import { ASSEMBLY_BONUS, CONDITION_MULTIPLIER, WINDOWS_ACTIVATED_BONUS } from '../data/condition'
import { CPUS } from '../data/cpus'
import { GPUS } from '../data/gpus'
import { MARGIN_TIERS, RECOMMENDED_BUY_TIER } from '../data/margins'
import { estimateNeufFromOccasion } from '../data/neufRatio'
import { ASSEMBLED_PC_PREMIUM } from '../data/premium'
import { SECONDARY_COMPONENT_VALUE } from '../data/secondary'
import type {
  ComponentBreakdownLine,
  EstimationResult,
  MarginTier,
  PcConfiguration,
  PriceBand,
} from '../types'
import { computeBalancedConfigBonusPct, ramCapacityTier } from './balancedConfig'
import { adjustComponentBand, estimateRamValue, estimateStorageDriveValue } from './componentValue'
import { clampBandAtZero, normalizeBand, round2, scaleBand, sumBands } from './priceBand'
import { computeVerdict, explainVerdict } from './verdict'

const ZERO_BAND: PriceBand = { min: 0, moyen: 0, max: 0 }

function findCpu(id: string) {
  return CPUS.find((c) => c.id === id)
}

function findGpu(id: string) {
  return GPUS.find((g) => g.id === id)
}

/**
 * Point d'entrée unique du moteur d'estimation : à partir d'une config PC
 * complète (composants + état + éventuel prix d'achat), calcule la
 * fourchette de revente, le prix d'achat conseillé par palier de marge, et
 * si un prix d'achat a été saisi, le bénéfice/marge/verdict associés.
 *
 * Le détail (breakdown) est renvoyé pour affichage ET pour que le mode
 * manuel puisse cibler chaque ligne — surcharger un composant remplace sa
 * fourchette calculée, le reste de l'agrégation tourne à l'identique.
 */
export function estimate(config: PcConfiguration): EstimationResult {
  const breakdown: ComponentBreakdownLine[] = []
  const conditionMult = CONDITION_MULTIPLIER[config.condition]

  // --- CPU (obligatoire) ---
  const cpuData = config.cpu.id ? findCpu(config.cpu.id) : undefined
  const cpuBand =
    (config.cpu.overrideBand && normalizeBand(config.cpu.overrideBand)) ??
    (cpuData
      ? adjustComponentBand(cpuData, config.condition, cpuData.decoteAnciennete, cpuData.faciliteRevente)
      : ZERO_BAND)
  const cpuTier = cpuData?.tier ?? 3
  breakdown.push({
    label: cpuData?.nom ?? 'Processeur',
    band: cpuBand,
    isManual: config.cpu.overrideBand !== null,
    neufEstime: estimateNeufFromOccasion(cpuBand.moyen, 'cpu'),
  })

  // --- GPU (facultatif -- absent = iGPU) ---
  let gpuBand: PriceBand = ZERO_BAND
  let gpuTier: number | null = null
  if (config.gpu && (config.gpu.id !== null || config.gpu.overrideBand !== null)) {
    const gpuData = config.gpu.id ? findGpu(config.gpu.id) : undefined
    gpuBand =
      (config.gpu.overrideBand && normalizeBand(config.gpu.overrideBand)) ??
      (gpuData
        ? adjustComponentBand(gpuData, config.condition, gpuData.decoteAnciennete, gpuData.faciliteRevente)
        : ZERO_BAND)
    gpuTier = gpuData?.tier ?? null
    breakdown.push({
      label: gpuData?.nom ?? 'Carte graphique',
      band: gpuBand,
      isManual: config.gpu.overrideBand !== null,
      neufEstime: estimateNeufFromOccasion(gpuBand.moyen, 'gpu'),
    })
  }

  // --- RAM ---
  const ramBand = config.ramOverrideBand
    ? normalizeBand(config.ramOverrideBand)
    : estimateRamValue(config.ramCapacite, config.ramType, config.condition)
  breakdown.push({
    label: `RAM ${config.ramCapacite} Go ${config.ramType.toUpperCase()}`,
    band: ramBand,
    isManual: config.ramOverrideBand !== null,
    neufEstime: estimateNeufFromOccasion(ramBand.moyen, 'ram'),
  })

  // --- Stockage (plusieurs disques, sommés) ---
  let storageBand: PriceBand
  if (config.storageOverrideBand) {
    storageBand = normalizeBand(config.storageOverrideBand)
    breakdown.push({
      label: 'Stockage',
      band: storageBand,
      isManual: true,
      neufEstime: estimateNeufFromOccasion(storageBand.moyen, 'storage'),
    })
  } else {
    const disqueBands = config.disques.map((d) =>
      estimateStorageDriveValue(d.capacite, d.type, config.condition),
    )
    storageBand = sumBands(disqueBands)
    config.disques.forEach((d, i) => {
      breakdown.push({
        label: `${d.type.toUpperCase()} ${d.capacite} Go`,
        band: disqueBands[i],
        isManual: false,
        neufEstime: estimateNeufFromOccasion(disqueBands[i].moyen, 'storage'),
      })
    })
  }

  // --- Secondaire (poids réduit par construction : valeurs forfaitaires basses) ---
  const secondaryBands: PriceBand[] = []
  if (config.carteMereConnue) secondaryBands.push(scaleBand(SECONDARY_COMPONENT_VALUE.carteMere, conditionMult))
  if (config.alimentationConnue)
    secondaryBands.push(scaleBand(SECONDARY_COMPONENT_VALUE.alimentation, conditionMult))
  if (config.boitierConnu) secondaryBands.push(scaleBand(SECONDARY_COMPONENT_VALUE.boitier, conditionMult))
  if (secondaryBands.length > 0) {
    const secondaryTotal = sumBands(secondaryBands)
    breakdown.push({
      label: 'Carte mère / alimentation / boîtier',
      band: secondaryTotal,
      isManual: false,
      neufEstime: null,
    })
  }

  const bonusBands: PriceBand[] = []
  if (config.assemblageSoigne) {
    const b: PriceBand = { min: ASSEMBLY_BONUS, moyen: ASSEMBLY_BONUS, max: ASSEMBLY_BONUS }
    bonusBands.push(b)
    breakdown.push({ label: 'PC assemblé proprement', band: b, isManual: false, neufEstime: null })
  }
  if (config.windowsActive) {
    bonusBands.push(WINDOWS_ACTIVATED_BONUS)
    breakdown.push({
      label: 'Windows activé',
      band: WINDOWS_ACTIVATED_BONUS,
      isManual: false,
      neufEstime: null,
    })
  }

  const rawTotal = sumBands([cpuBand, gpuBand, ramBand, storageBand, ...secondaryBands, ...bonusBands])

  const assembledTotal = scaleBand(rawTotal, ASSEMBLED_PC_PREMIUM)
  breakdown.push({
    label: 'Prime PC complet assemblé (vs pièces détachées)',
    band: {
      min: round2(assembledTotal.min - rawTotal.min),
      moyen: round2(assembledTotal.moyen - rawTotal.moyen),
      max: round2(assembledTotal.max - rawTotal.max),
    },
    isManual: false,
    neufEstime: null,
  })

  const ramTier = ramCapacityTier(config.ramCapacite)
  const configBonusPct = computeBalancedConfigBonusPct(cpuTier, gpuTier, ramTier)
  const revente = clampBandAtZero(scaleBand(assembledTotal, 1 + configBonusPct))

  const achatConseille = Object.fromEntries(
    MARGIN_TIERS.map((t) => [t.key, round2(revente.min * (1 - t.pct))]),
  ) as Record<MarginTier['key'], number>

  let benefice: PriceBand | null = null
  let margePct: number | null = null
  let ecartPrixConseille: number | null = null
  let verdict: EstimationResult['verdict'] = null
  let explication = ''

  if (config.prixAchat !== null && config.prixAchat > 0) {
    const prixAchat = config.prixAchat
    benefice = {
      min: round2(revente.min - prixAchat),
      moyen: round2(revente.moyen - prixAchat),
      max: round2(revente.max - prixAchat),
    }
    margePct = round2((benefice.moyen / prixAchat) * 1000) / 1000
    ecartPrixConseille = round2(prixAchat - achatConseille[RECOMMENDED_BUY_TIER])
    verdict = computeVerdict(margePct)

    const composantsForts = [cpuData, gpuData(config)]
      .filter((c): c is NonNullable<typeof c> => !!c && c.faciliteRevente >= 0.8)
      .map((c) => c.nom)
    explication = explainVerdict(verdict, margePct, composantsForts)
  }

  return {
    revente,
    breakdown,
    configBonusPct,
    achatConseille,
    prixAchatSaisi: config.prixAchat,
    benefice,
    margePct,
    ecartPrixConseille,
    verdict,
    explication,
  }
}

function gpuData(config: PcConfiguration) {
  return config.gpu?.id ? findGpu(config.gpu.id) : undefined
}
