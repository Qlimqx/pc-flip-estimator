// Fine couche autour du CLI `gh` (préinstallé sur les runners GitHub) pour les
// alertes : issues dédupliquées, création idempotente du libellé, relance du
// workflow. Les fonctions prennent `gh` en paramètre pour rester testables.

import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

/** Exécute `gh` ; renvoie la sortie standard. */
export async function ghCli(args) {
  const { stdout } = await execFileAsync('gh', args, { maxBuffer: 5 * 1024 * 1024 })
  return stdout
}

export async function ensureLabel(gh, name, color, description) {
  try {
    await gh(['label', 'create', name, '--color', color, '--description', description])
  } catch {
    // déjà existant : c'est le cas normal
  }
}

/** Crée l'issue sauf s'il en existe déjà une (ouverte) avec ce titre exact. */
export async function openIssueOnce(gh, { title, body, label, color = 'd93f0b', description = 'Alerte automatique' }) {
  await ensureLabel(gh, label, color, description)
  const out = await gh(['issue', 'list', '--state', 'open', '--label', label, '--json', 'title', '--limit', '100'])
  const existing = JSON.parse(out || '[]')
  if (existing.some((i) => i.title === title)) return { created: false }
  await gh(['issue', 'create', '--title', title, '--body', body, '--label', label])
  return { created: true }
}

/** Nombre d'exécutions de l'agent en cours ou en file d'attente. */
export async function activeAgentRuns(gh) {
  let total = 0
  for (const status of ['in_progress', 'queued']) {
    const out = await gh(['run', 'list', '--workflow', 'daily-agent.yml', '--status', status, '--json', 'databaseId', '--limit', '20'])
    total += JSON.parse(out || '[]').length
  }
  return total
}

export async function dispatchAgent(gh) {
  await gh(['workflow', 'run', 'daily-agent.yml'])
}
