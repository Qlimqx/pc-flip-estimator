import { VERDICT_THRESHOLDS } from '../data/margins'
import type { Verdict } from '../types'

export const VERDICT_LABELS: Record<Verdict, string> = {
  'tres-bonne-affaire': 'TRÈS BONNE AFFAIRE',
  'bonne-affaire': 'BONNE AFFAIRE',
  'marge-faible': 'MARGE FAIBLE',
  'trop-cher': 'TROP CHER',
  'a-eviter': 'À ÉVITER',
}

/** margePct = bénéfice / prix d'achat (ROI du flip), pas une marge sur le prix de vente. */
export function computeVerdict(margePct: number): Verdict {
  if (margePct < 0) return 'a-eviter'
  if (margePct < VERDICT_THRESHOLDS.margeFaiblePct) return 'trop-cher'
  if (margePct < VERDICT_THRESHOLDS.bonneAffairePct) return 'marge-faible'
  if (margePct < VERDICT_THRESHOLDS.tresBonneAffairePct) return 'bonne-affaire'
  return 'tres-bonne-affaire'
}

export function explainVerdict(
  verdict: Verdict,
  margePct: number,
  composantsForts: string[],
): string {
  const pct = Math.round(margePct * 100)
  const noms = composantsForts.length > 0 ? composantsForts.join(' et ') : 'cette configuration'

  switch (verdict) {
    case 'tres-bonne-affaire':
      return `Excellente opération : marge estimée autour de ${pct}%, largement au-dessus du seuil visé. ${noms} sont des composants recherchés en occasion.`
    case 'bonne-affaire':
      return `Le prix d'achat est intéressant par rapport à la valeur estimée du marché (marge ~${pct}%). ${noms} se revendent bien en occasion.`
    case 'marge-faible':
      return `La marge estimée (~${pct}%) est positive mais reste sous le seuil d'une bonne affaire — elle risque de ne pas couvrir le temps de revente et les imprévus.`
    case 'trop-cher':
      return `La marge estimée (~${pct}%) est trop faible pour couvrir les risques, le temps de revente et les éventuels frais.`
    case 'a-eviter':
      return `Le prix d'achat dépasse la valeur de revente estimée : l'opération serait déficitaire (marge ~${pct}%).`
  }
}
