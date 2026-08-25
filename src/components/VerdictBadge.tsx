import { VERDICT_LABELS } from '../engine/verdict'
import type { Verdict } from '../types'

const VERDICT_STYLES: Record<Verdict, string> = {
  'tres-bonne-affaire': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40',
  'bonne-affaire': 'bg-lime-500/15 text-lime-400 border-lime-500/40',
  'marge-faible': 'bg-amber-500/15 text-amber-400 border-amber-500/40',
  'trop-cher': 'bg-orange-500/15 text-orange-400 border-orange-500/40',
  'a-eviter': 'bg-red-500/15 text-red-400 border-red-500/40',
}

export function VerdictBadge({ verdict }: { verdict: Verdict }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-bold tracking-wide ${VERDICT_STYLES[verdict]}`}
    >
      {VERDICT_LABELS[verdict]}
    </span>
  )
}
