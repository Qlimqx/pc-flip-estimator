import { CONDITION_MULTIPLIER } from '../data/condition'
import { RAM_TYPE_PRICING } from '../data/ram'
import { STORAGE_TYPE_PRICING } from '../data/storage'
import type { Condition, PriceBand, RamCapacity, RamType, StorageCapacity, StorageType } from '../types'
import { round2, scaleBand } from './priceBand'

/**
 * Convertit la facilité de revente (0 = difficile, 1 = très recherché) en
 * multiplicateur : un composant liquide/désirable se négocie un peu mieux,
 * un composant qui stagne sur le marché se brade un peu. L'effet reste
 * volontairement modéré (±10%) — la facilité de revente sert surtout à
 * qualifier la confiance dans le prix, pas à le faire varier fortement.
 */
export function faciliteReventeMultiplier(faciliteRevente: number): number {
  return 0.9 + faciliteRevente * 0.2
}

/**
 * Ajuste la fourchette de prix brute d'un composant (CPU/GPU) selon l'état
 * général du PC, la décote propre à l'ancienneté de sa génération, et sa
 * facilité de revente. C'est le point d'entrée que la config de la config
 * (condition, etc.) traverse pour chaque composant identifiable.
 */
export function adjustComponentBand(
  band: PriceBand,
  condition: Condition,
  decoteAnciennete: number,
  faciliteRevente: number,
): PriceBand {
  const facteur =
    CONDITION_MULTIPLIER[condition] * decoteAnciennete * faciliteReventeMultiplier(faciliteRevente)
  return scaleBand(band, facteur)
}

function ramOrStorageBaseBand(
  quantite: number,
  prixParGo: number,
  plancher: number,
): PriceBand {
  const moyen = Math.max(quantite * prixParGo, plancher)
  return {
    min: round2(moyen * 0.85),
    moyen: round2(moyen),
    max: round2(moyen * 1.15),
  }
}

export function estimateRamValue(
  capacite: RamCapacity,
  type: RamType,
  condition: Condition,
): PriceBand {
  const pricing = RAM_TYPE_PRICING[type]
  const base = ramOrStorageBaseBand(capacite, pricing.prixParGo, pricing.plancher)
  return adjustComponentBand(base, condition, pricing.decoteAnciennete, pricing.faciliteRevente)
}

export function estimateStorageDriveValue(
  capacite: StorageCapacity,
  type: StorageType,
  condition: Condition,
): PriceBand {
  const pricing = STORAGE_TYPE_PRICING[type]
  const base = ramOrStorageBaseBand(capacite, pricing.prixParGo, pricing.plancher)
  return adjustComponentBand(base, condition, pricing.decoteAnciennete, pricing.faciliteRevente)
}
