import { useState } from 'react'
import { ConfigForm } from './components/ConfigForm'
import { HistoryPanel } from './components/HistoryPanel'
import { ManualOverridePanel } from './components/ManualOverridePanel'
import { ResultsPanel } from './components/ResultsPanel'
import { useEstimatorStore } from './store/useEstimatorStore'

type Tab = 'estimation' | 'historique'

function App() {
  const [tab, setTab] = useState<Tab>('estimation')
  const [saveMessage, setSaveMessage] = useState('')
  const config = useEstimatorStore((s) => s.config)
  const result = useEstimatorStore((s) => s.result)
  const saveCurrentAsHistory = useEstimatorStore((s) => s.saveCurrentAsHistory)
  const resetConfiguration = useEstimatorStore((s) => s.resetConfiguration)
  const editingHistoryId = useEstimatorStore((s) => s.editingHistoryId)

  const cpuChosen = config.cpu.id !== null || config.cpu.overrideBand !== null

  async function handleSave() {
    await saveCurrentAsHistory()
    setSaveMessage('Enregistré ✓')
    window.setTimeout(() => setSaveMessage(''), 2000)
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800">
        <div className="mx-auto max-w-6xl px-4 py-5">
          <h1 className="text-xl font-bold text-slate-100">Estimateur achat-revente PC</h1>
          <p className="text-sm text-slate-500">
            Estime la rentabilité d'un PC d'occasion — marché français
          </p>
          <nav className="mt-4 flex gap-1">
            {(
              [
                ['estimation', 'Estimation'],
                ['historique', 'Historique'],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={`rounded-t-lg px-4 py-2 text-sm font-medium ${
                  tab === key
                    ? 'bg-slate-900 text-emerald-400'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {tab === 'estimation' ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-5">
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">
                  Configuration du PC
                </h2>
                <ConfigForm />
              </div>
              <ManualOverridePanel />

              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => void handleSave()}
                    disabled={!cpuChosen}
                    className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {editingHistoryId ? 'Mettre à jour' : 'Sauvegarder dans l\'historique'}
                  </button>
                  <button
                    type="button"
                    onClick={resetConfiguration}
                    className="flex-1 rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-slate-600"
                  >
                    Réinitialiser
                  </button>
                </div>
                {saveMessage && <p className="mt-2 text-sm text-emerald-400">{saveMessage}</p>}
              </div>
            </div>

            <div>
              {cpuChosen ? (
                <ResultsPanel result={result} />
              ) : (
                <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-slate-800 p-10 text-center text-sm text-slate-500">
                  Sélectionne au moins un processeur pour voir l'estimation.
                </div>
              )}
            </div>
          </div>
        ) : (
          <HistoryPanel />
        )}
      </main>
    </div>
  )
}

export default App
