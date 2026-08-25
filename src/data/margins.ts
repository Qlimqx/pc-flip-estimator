import type { MarginTier } from '../types'

// Config centrale des paliers de marge — modifie ces pourcentages pour
// ajuster tout le moteur sans toucher au code de calcul.
export const MARGIN_TIERS: MarginTier[] = [
  { key: 'minimale', label: 'Marge minimale', pct: 0.1 },
  { key: 'bonne', label: 'Bonne marge', pct: 0.175 },
  { key: 'tres-bonne', label: 'Très bonne marge', pct: 0.25 },
]

// Le "prix d'achat conseillé" affiché en tête de résultat est celui du
// palier "bonne marge", appliqué sur le bas de la fourchette de revente
// (hypothèse prudente : on doit rester rentable même si la revente se fait
// au prix bas).
export const RECOMMENDED_BUY_TIER: MarginTier['key'] = 'bonne'

// Seuils de verdict, exprimés en % de marge réelle (bénéfice / prix
// d'achat) une fois qu'un prix d'achat est saisi.
export const VERDICT_THRESHOLDS = {
  tresBonneAffairePct: MARGIN_TIERS.find((t) => t.key === 'tres-bonne')!.pct,
  bonneAffairePct: MARGIN_TIERS.find((t) => t.key === 'bonne')!.pct,
  margeFaiblePct: MARGIN_TIERS.find((t) => t.key === 'minimale')!.pct,
  // En dessous de 0%, l'opération est déficitaire (À ÉVITER). Entre 0% et
  // margeFaiblePct, la marge est positive mais ne couvre pas le minimum
  // visé (TROP CHER).
}
