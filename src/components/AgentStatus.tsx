import agentStatus from '../data/agent/status.json'

interface AgentStatusData {
  date: string | null
  status: string
  finishedAt?: string
  catalogue?: number
  verified?: number
  updated?: number
  added?: number
}

const LABELS: Record<string, string> = {
  termine: 'terminée',
  termine_avec_avertissements: 'terminée avec avertissements',
  partiel: 'partielle',
}

/** Ligne discrète : dernière vérification automatique des prix (agent quotidien). */
export function AgentStatus() {
  const s = agentStatus as AgentStatusData
  if (!s.date) return null
  const dateFr = new Date(`${s.date}T00:00:00`).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  return (
    <p className="mx-auto max-w-6xl px-4 pb-2 text-center text-xs text-slate-500" data-testid="agent-status">
      Vérification automatique des prix du {dateFr} {LABELS[s.status] ?? s.status} — {s.verified ?? 0}/{s.catalogue ?? 0}{' '}
      composants contrôlés, {s.updated ?? 0} mis à jour
      {s.added ? `, ${s.added} ajouté${s.added > 1 ? 's' : ''}` : ''}.
    </p>
  )
}
