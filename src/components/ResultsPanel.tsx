import { MARGIN_TIERS } from '../data/margins'
import { formatEuro, formatEuroPrecise, formatPct } from '../lib/format'
import type { EstimationResult } from '../types'
import { VerdictBadge } from './VerdictBadge'

interface Props {
  result: EstimationResult
}

export function ResultsPanel({ result }: Props) {
  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Estimation de revente
        </h2>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-xs text-slate-500">Prix bas</div>
            <div className="text-lg font-bold text-slate-100">{formatEuro(result.revente.min)}</div>
          </div>
          <div className="rounded-lg bg-slate-800/60 py-1">
            <div className="text-xs text-slate-500">Prix moyen</div>
            <div className="text-xl font-extrabold text-emerald-400">
              {formatEuro(result.revente.moyen)}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Prix haut</div>
            <div className="text-lg font-bold text-slate-100">{formatEuro(result.revente.max)}</div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Prix d'achat conseillé
        </h2>
        <div className="space-y-2">
          {MARGIN_TIERS.map((tier) => (
            <div key={tier.key} className="flex items-center justify-between text-sm">
              <span className="text-slate-400">
                {tier.label} ({formatPct(tier.pct)})
              </span>
              <span className="font-semibold text-slate-100">
                ≤ {formatEuro(result.achatConseille[tier.key])}
              </span>
            </div>
          ))}
        </div>
      </section>

      {result.prixAchatSaisi !== null && result.verdict && (
        <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
            Analyse achat-revente
          </h2>
          <div className="mb-4 space-y-1.5 text-sm">
            <Row label="Prix d'achat saisi" value={formatEuro(result.prixAchatSaisi)} />
            <Row
              label="Bénéfice min / moyen / max"
              value={`${formatEuro(result.benefice!.min)} / ${formatEuro(result.benefice!.moyen)} / ${formatEuro(result.benefice!.max)}`}
            />
            <Row label="Marge" value={formatPct(result.margePct!)} />
            <Row
              label="Écart au prix conseillé"
              value={
                result.ecartPrixConseille! > 0
                  ? `+${formatEuroPrecise(result.ecartPrixConseille!)} au-dessus`
                  : `${formatEuroPrecise(Math.abs(result.ecartPrixConseille!))} en-dessous`
              }
            />
          </div>
          <div className="flex flex-col items-start gap-2">
            <VerdictBadge verdict={result.verdict} />
            <p className="text-sm text-slate-400">{result.explication}</p>
          </div>
        </section>
      )}

      <details open className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
        <summary className="cursor-pointer text-sm font-semibold uppercase tracking-wide text-slate-400">
          Détail du calcul — neuf vs occasion
        </summary>
        <div className="mt-3 space-y-2">
          {result.breakdown.map((line, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="text-slate-400">
                {line.label}
                {line.isManual && <span className="ml-1.5 text-xs text-emerald-500">(manuel)</span>}
              </span>
              <span className="text-right text-slate-200">
                <span className="block">
                  Occasion : {formatEuro(line.band.min)} – {formatEuro(line.band.max)}
                </span>
                {line.neufEstime !== null && (
                  <span className="block text-xs text-slate-500">
                    Neuf ≈ {formatEuro(line.neufEstime)}
                  </span>
                )}
              </span>
            </div>
          ))}
          <div className="flex items-center justify-between border-t border-slate-800 pt-1.5 text-sm">
            <span className="text-slate-400">Bonus config équilibrée</span>
            <span className="text-slate-200">
              {result.configBonusPct >= 0 ? '+' : ''}
              {formatPct(result.configBonusPct)}
            </span>
          </div>
        </div>
      </details>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-400">{label}</span>
      <span className="font-medium text-slate-100">{value}</span>
    </div>
  )
}
