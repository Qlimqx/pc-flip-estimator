import type { PriceBand } from '../types'

// Valeurs forfaitaires pour les composants secondaires — volontairement
// approximatives (pas de base par modèle pour l'instant, voir section
// "évolutions futures"). Cochés "connu" dans le formulaire, ils ajoutent
// cette fourchette au total ; leur poids reste faible par construction
// (valeurs basses face au CPU/GPU), conformément à la demande.
export const SECONDARY_COMPONENT_VALUE: Record<'carteMere' | 'alimentation' | 'boitier', PriceBand> = {
  carteMere: { min: 15, moyen: 32, max: 55 },
  alimentation: { min: 10, moyen: 24, max: 45 },
  boitier: { min: 5, moyen: 15, max: 35 },
}
