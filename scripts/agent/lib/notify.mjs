// Notification facultative et gratuite : un webhook entrant (Discord, Slack,
// ntfy.sh…) dont l'URL est fournie par la variable d'environnement
// AGENT_WEBHOOK_URL (secret GitHub). Sans URL, rien n'est envoyé : le rapport
// et l'issue GitHub (workflow) restent les canaux. Un échec de notification
// ne fait JAMAIS échouer le run.

export function summaryLine(r) {
  const c = r.counts
  return `Agent prix ${r.date} — ${r.status} : ${c.verified}/${c.catalogue} vérifiés, ${c.updated} mis à jour, ${c.added} ajoutés, ${r.warnings.length} avertissement(s), fin ${r.finishedParis}`
}

export async function notify(report, { env = process.env, fetchImpl = globalThis.fetch } = {}) {
  const url = env.AGENT_WEBHOOK_URL
  if (!url) return { sent: false, reason: 'AGENT_WEBHOOK_URL non défini' }
  try {
    const text = summaryLine(report)
    const res = await fetchImpl(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // `text` (Slack, Mattermost) et `content` (Discord) : un seul corps pour les deux.
      body: JSON.stringify({ text, content: text }),
    })
    return res.ok ? { sent: true } : { sent: false, reason: `HTTP ${res.status}` }
  } catch (err) {
    return { sent: false, reason: String(err?.message ?? err) }
  }
}
