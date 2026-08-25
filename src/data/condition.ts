import type { Condition } from '../types'

export const CONDITION_LABELS: Record<Condition, string> = {
  mauvais: 'Mauvais',
  correct: 'Correct',
  bon: 'Bon',
  'tres-bon': 'Très bon',
}

// Multiplicateur appliqué à l'ensemble de la valeur estimée des
// composants selon l'état général déclaré du PC.
export const CONDITION_MULTIPLIER: Record<Condition, number> = {
  mauvais: 0.75,
  correct: 0.9,
  bon: 1.0,
  'tres-bon': 1.08,
}

// Bonus/malus forfaitaires (en euros, appliqués sur la fourchette totale)
// pour les critères secondaires facultatifs — volontairement plus légers
// que l'ajustement d'état, qui porte sur l'ensemble de la config.
export const ASSEMBLY_BONUS = 15
export const WINDOWS_ACTIVATED_BONUS = { min: 15, moyen: 30, max: 45 }
