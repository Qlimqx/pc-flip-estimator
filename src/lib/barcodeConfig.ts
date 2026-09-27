import { CONDITION_LABELS } from '../data/condition'
import { CPUS } from '../data/cpus'
import { GPUS } from '../data/gpus'
import type { PcConfiguration } from '../types'

/**
 * Construit la désignation lisible d'une config -- catégorie + config
 * complète, volontairement SANS aucun prix. Destinée à être collée telle
 * quelle dans le champ "désignation" d'un logiciel de caisse (Athena) lors
 * de la création de l'article associé au code EAN généré pour cette unité.
 */
export function buildConfigLabel(config: PcConfiguration): string {
  const cpu = config.cpu.id ? CPUS.find((c) => c.id === config.cpu.id) : undefined
  const cpuLabel = cpu?.nom ?? (config.cpu.overrideBand ? 'CPU personnalisé' : 'CPU non renseigné')

  const hasGpu = config.gpu !== null && (config.gpu.id !== null || config.gpu.overrideBand !== null)
  const gpu = hasGpu && config.gpu?.id ? GPUS.find((g) => g.id === config.gpu!.id) : undefined
  const gpuLabel = hasGpu ? (gpu?.nom ?? 'GPU personnalisé') : null

  const ramLabel = `${config.ramCapacite} Go ${config.ramType.toUpperCase()}`

  const storageLabel =
    config.disques.length > 0
      ? config.disques.map((d) => `${d.type.toUpperCase()} ${d.capacite} Go`).join(' + ')
      : 'aucun stockage'

  const categorie = hasGpu ? 'PC Gamer' : 'PC Bureautique'

  const parts = [categorie, cpuLabel, gpuLabel, ramLabel, storageLabel, CONDITION_LABELS[config.condition]].filter(
    (p): p is string => p !== null,
  )

  return parts.join(' | ')
}
