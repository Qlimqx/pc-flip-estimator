import { useEffect } from 'react'
import { formatEuro } from '../lib/format'
import { useEstimatorStore } from '../store/useEstimatorStore'
import { VERDICT_LABELS } from '../engine/verdict'

export function HistoryPanel() {
  const history = useEstimatorStore((s) => s.history)
  const historyLoaded = useEstimatorStore((s) => s.historyLoaded)
  const refreshHistory = useEstimatorStore((s) => s.refreshHistory)
  const loadFromHistory = useEstimatorStore((s) => s.loadFromHistory)
  const deleteFromHistory = useEstimatorStore((s) => s.deleteFromHistory)
  const duplicateFromHistory = useEstimatorStore((s) => s.duplicateFromHistory)

  useEffect(() => {
    if (!historyLoaded) void refreshHistory()
  }, [historyLoaded, refreshHistory])

  if (historyLoaded && history.length === 0) {
    return <p className="text-sm text-slate-500">Aucune estimation sauvegardée pour l'instant.</p>
  }

  return (
    <div className="space-y-3">
      {history.map((entry) => (
        <div
          key={entry.id}
          className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/50 p-4"
        >
          <div>
            <div className="text-sm font-medium text-slate-100">{entry.nom}</div>
            <div className="text-xs text-slate-500">
              {new Date(entry.dateCreation).toLocaleDateString('fr-FR')} — revente{' '}
              {formatEuro(entry.resultat.revente.moyen)}
              {entry.resultat.prixAchatSaisi !== null && (
                <> — achat {formatEuro(entry.resultat.prixAchatSaisi)}</>
              )}
              {entry.resultat.verdict && <> — {VERDICT_LABELS[entry.resultat.verdict]}</>}
            </div>
          </div>
          <div className="flex gap-3 text-xs">
            <button
              type="button"
              onClick={() => loadFromHistory(entry)}
              className="text-emerald-400 hover:text-emerald-300"
            >
              Ouvrir
            </button>
            <button
              type="button"
              onClick={() => void duplicateFromHistory(entry.id)}
              className="text-slate-400 hover:text-slate-200"
            >
              Dupliquer
            </button>
            <button
              type="button"
              onClick={() => void deleteFromHistory(entry.id)}
              className="text-red-400 hover:text-red-300"
            >
              Supprimer
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
