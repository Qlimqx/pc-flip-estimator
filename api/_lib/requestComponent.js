// Logique de la demande d'ajout de composant envoyée depuis le site (sans compte
// GitHub côté visiteur). Appelée par api/request-component.js (fonction Vercel).
//
// Le visiteur envoie { kind, name }. Ce code :
//   - valide et normalise le nom (même extraction de modèle que l'agent) ;
//   - refuse les doublons et plafonne le nombre de demandes ouvertes ;
//   - crée une issue GitHub étiquetée `composant-demande` + `depuis-le-site`
//     avec un jeton GitHub réservé aux issues (variable d'environnement Vercel,
//     jamais dans le code ni côté navigateur).
// L'agent quotidien lit ensuite ces issues (scripts/agent/lib/requests.mjs).
// Le texte libre du visiteur n'est jamais recopié : seul le nom canonique
// reconstruit à partir du modèle reconnu est écrit dans l'issue.

import { extractModels } from '../../scripts/agent/lib/discovery.mjs'

export const REQUEST_LABEL = 'composant-demande'
export const SITE_LABEL = 'depuis-le-site'
export const MAX_OPEN_REQUESTS = 30
const KIND_LABEL = { cpu: 'Processeur', gpu: 'Carte graphique' }

/** Valide l'entrée du visiteur. Renvoie { model } ou { error, status }. */
export function validateInput(input) {
  if (!input || typeof input !== 'object') return { error: 'Requête invalide.', status: 400 }
  if (input.website) return { error: 'Requête refusée.', status: 400 } // champ piège anti-robot
  const kind = input.kind
  if (kind !== 'cpu' && kind !== 'gpu') return { error: 'Type de composant invalide.', status: 400 }
  const name = String(input.name ?? '').replace(/\s+/g, ' ').trim()
  if (name.length < 3 || name.length > 60) return { error: 'Indiquez le nom du modèle (3 à 60 caractères).', status: 400 }
  if (!/^[\p{L}\p{N} .+\-/()]+$/u.test(name)) return { error: 'Le nom contient des caractères non autorisés.', status: 400 }
  const models = extractModels(name).filter((m) => m.category === kind)
  const distinct = [...new Set(models.map((m) => m.nom))]
  if (distinct.length === 0) {
    const example = kind === 'cpu' ? 'Ryzen 5 5700, i5-14400F, Core Ultra 5 245K' : 'RTX 4070 Ti Super, RX 7600 XT, Arc B580'
    return { error: `Modèle non reconnu. Exemples : ${example}.`, status: 422 }
  }
  if (distinct.length > 1) return { error: 'Une demande par modèle, svp.', status: 422 }
  return { model: models[0], kind }
}

export function buildIssue({ model, kind }) {
  return {
    title: `[Demande] ${KIND_LABEL[kind]} ${model.nom}`,
    body: [
      `Composant demandé : **${model.nom}**`,
      `Catégorie : ${KIND_LABEL[kind]}`,
      '',
      "Demande envoyée depuis le site. L'agent quotidien vérifiera ce modèle (annonces, prix, source indépendante) et l'ajoutera au catalogue s'il est confirmé ; cette issue sera commentée et fermée une fois traitée.",
    ].join('\n'),
    labels: [REQUEST_LABEL, SITE_LABEL],
  }
}

/**
 * @param {unknown} input corps de la requête
 * @param {{token?: string, repo?: string, fetchImpl?: typeof fetch}} ctx
 * @returns {Promise<{status:number, body:object}>}
 */
export async function handleRequest(input, { token, repo, fetchImpl = globalThis.fetch }) {
  const checked = validateInput(input)
  if (checked.error) return { status: checked.status, body: { ok: false, error: 'invalid', message: checked.error } }
  if (!token || !repo) {
    return { status: 503, body: { ok: false, error: 'not-configured', message: "L'envoi direct n'est pas encore activé sur ce site." } }
  }
  const issue = buildIssue(checked)
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'pc-flip-estimator-site',
    'Content-Type': 'application/json',
  }
  try {
    const listRes = await fetchImpl(`https://api.github.com/repos/${repo}/issues?labels=${REQUEST_LABEL}&state=open&per_page=100`, { headers })
    if (!listRes.ok) return { status: 502, body: { ok: false, error: 'upstream', message: 'Service momentanément indisponible, réessayez plus tard.' } }
    const open = (await listRes.json()).filter((i) => !i.pull_request)
    if (open.some((i) => i.title === issue.title)) {
      return { status: 200, body: { ok: true, nom: checked.model.nom, duplicate: true, message: `${checked.model.nom} est déjà demandé : l'agent le traitera au prochain passage.` } }
    }
    if (open.length >= MAX_OPEN_REQUESTS) {
      return { status: 429, body: { ok: false, error: 'busy', message: 'Trop de demandes en attente, réessayez demain.' } }
    }
    const createRes = await fetchImpl(`https://api.github.com/repos/${repo}/issues`, { method: 'POST', headers, body: JSON.stringify(issue) })
    if (!createRes.ok) return { status: 502, body: { ok: false, error: 'upstream', message: 'Service momentanément indisponible, réessayez plus tard.' } }
    return { status: 200, body: { ok: true, nom: checked.model.nom, message: `Demande envoyée pour ${checked.model.nom} : l'agent le vérifie et l'ajoute avec son prix au prochain passage (le lendemain matin) s'il est confirmé.` } }
  } catch {
    return { status: 502, body: { ok: false, error: 'upstream', message: 'Service momentanément indisponible, réessayez plus tard.' } }
  }
}
