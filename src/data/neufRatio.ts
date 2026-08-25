// Ratio occasion/neuf approximatif par catégorie, utilisé uniquement pour
// afficher un repère "prix neuf" à côté de l'estimation occasion -- ça ne
// sert PAS au calcul de revente (l'outil reste basé occasion de bout en
// bout, voir la note de conception dans engine/estimate.ts), juste à éviter
// la confusion entre les deux marchés quand on compare avec une annonce
// trouvée en ligne.
//
// Ratios déduits des vérifications réelles faites cette session
// (2026-08-24) : CPU/GPU autour de 70% (mais très variable -- un modèle
// discontinué comme l'i5-10400F est tombé à ~44% à cause d'un prix neuf
// gonflé par la pénurie de stock, quand un modèle encore en production
// reste plus proche de 75-80%), RAM/stockage plutôt 78-80% (confirmé sur
// plusieurs SSD/RAM PNY et Corsair). Ce sont des ratios GLOBAUX, pas
// vérifiés modèle par modèle -- le repère "neuf" affiché est donc lui-même
// une estimation, pas une donnée fiable au même titre que le prix occasion.
export const NEUF_OCCASION_RATIO = {
  cpu: 0.7,
  gpu: 0.7,
  ram: 0.78,
  storage: 0.8,
} as const

export function estimateNeufFromOccasion(
  occasionMoyen: number,
  categorie: keyof typeof NEUF_OCCASION_RATIO,
): number {
  return Math.round((occasionMoyen / NEUF_OCCASION_RATIO[categorie]) * 100) / 100
}
