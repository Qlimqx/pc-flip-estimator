import type { RamCapacity } from '../types'

/** Classe grossièrement une quantité de RAM sur la même échelle 1-5 que les tiers CPU/GPU. */
export function ramCapacityTier(capacite: RamCapacity): 1 | 2 | 3 | 4 | 5 {
  if (capacite <= 8) return 1
  if (capacite === 16) return 2
  if (capacite === 32) return 3
  if (capacite === 64) return 4
  return 5
}

/**
 * Petit bonus (ou malus) appliqué à la fourchette totale selon la
 * cohérence de la config : un PC "équilibré" (CPU/GPU de même gamme, RAM
 * assortie) se revend plus facilement et un peu mieux qu'un assemblage
 * disparate (ex : CPU haut de gamme + GPU d'entrée de gamme, ou 8 Go de
 * RAM avec une carte graphique récente) qui rebute les acheteurs ou laisse
 * penser à un "reste de pièces". Volontairement plafonné pour rester un
 * ajustement léger, pas un facteur dominant.
 */
export function computeBalancedConfigBonusPct(
  cpuTier: number,
  gpuTier: number | null,
  ramTier: number,
): number {
  if (gpuTier === null) {
    const diff = Math.abs(cpuTier - ramTier)
    const bonus = diff <= 1 ? 0.01 : -0.01 * (diff - 1)
    return clamp(bonus, -0.06, 0.03)
  }

  const coreTier = (cpuTier + gpuTier) / 2
  const cpuGpuDiff = Math.abs(cpuTier - gpuTier)
  const ramDiff = Math.abs(coreTier - ramTier)

  let bonus = 0
  bonus += cpuGpuDiff <= 1 ? 0.02 : -0.015 * (cpuGpuDiff - 1)
  bonus += ramDiff <= 1 ? 0.015 : -0.01 * (ramDiff - 1)

  return clamp(bonus, -0.08, 0.05)
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}
