import type { PriceBand } from '../types'

export function round2(value: number): number {
  return Math.round(value * 100) / 100
}

export function scaleBand(band: PriceBand, factor: number): PriceBand {
  return {
    min: round2(band.min * factor),
    moyen: round2(band.moyen * factor),
    max: round2(band.max * factor),
  }
}

export function addBands(a: PriceBand, b: PriceBand): PriceBand {
  return {
    min: round2(a.min + b.min),
    moyen: round2(a.moyen + b.moyen),
    max: round2(a.max + b.max),
  }
}

export function sumBands(bands: PriceBand[]): PriceBand {
  return bands.reduce(addBands, { min: 0, moyen: 0, max: 0 })
}

export function clampBandAtZero(band: PriceBand): PriceBand {
  return {
    min: Math.max(band.min, 0),
    moyen: Math.max(band.moyen, 0),
    max: Math.max(band.max, 0),
  }
}

/**
 * Remet min <= moyen <= max en triant les trois valeurs. Nécessaire pour
 * les fourchettes saisies en mode manuel : rien n'empêche l'utilisateur de
 * modifier un seul des trois champs (ex : ne changer que "moyen" sans
 * ajuster "max" en conséquence), ce qui produirait sinon un "prix haut"
 * inférieur au "prix moyen" à l'affichage.
 */
export function normalizeBand(band: PriceBand): PriceBand {
  const [min, moyen, max] = [band.min, band.moyen, band.max].sort((a, b) => a - b)
  return { min, moyen, max }
}
