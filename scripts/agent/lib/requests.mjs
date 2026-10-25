// Demandes d'ajout de composants faites depuis l'application (issues GitHub
// portant le libellé `composant-demande`, voir src/lib/componentRequest.ts).
//
// Le dépôt est public : n'importe qui peut ouvrir une issue. Seules les
// demandes de OWNER / MEMBER / COLLABORATOR sont traitées, et le nom du
// composant n'est JAMAIS recopié du texte libre : il est reconstruit par
// extraction du modèle (mêmes motifs que la découverte). Une demande ne
// dispense pas des preuves de prix (≥ 4 annonces valides, cohérence neuf,
// confirmation indépendante) ; elle dispense seulement du minimum d'annonces
// vues dans la découverte générale, puisque l'utilisateur affirme l'intérêt.

import { extractModels } from './discovery.mjs'
import { ghCli } from './github.mjs'

export const REQUEST_LABEL = 'composant-demande'
export const TRUSTED_ASSOCIATIONS = new Set(['OWNER', 'MEMBER', 'COLLABORATOR'])
export const MAX_REQUESTS_PER_RUN = 10
export const MAX_ATTEMPTS = 7 // au-delà, la demande est close avec explication

/** Liste les demandes ouvertes ; vide si le CLI `gh` n'est pas utilisable. */
export async function loadRequests(env = process.env, gh = ghCli) {
  if (!env.GH_TOKEN && !env.GITHUB_TOKEN) return { requests: [], note: 'pas de jeton GitHub : demandes non lues' }
  // API REST (le CLI `gh issue list` n'expose pas author_association). Les pull requests
  // apparaissent aussi dans /issues : écartées.
  const out = await gh(['api', `repos/{owner}/{repo}/issues?labels=${REQUEST_LABEL}&state=open&per_page=30`])
  const requests = JSON.parse(out || '[]')
    .filter((i) => !i.pull_request)
    .map((i) => ({ number: i.number, title: i.title, body: i.body ?? '', authorAssociation: i.author_association }))
  return { requests, note: null }
}

/** Extrait le modèle demandé : { model } ou { error }. */
export function parseRequest({ title = '', body = '' }) {
  const fromTitle = extractModels(String(title).replace(/^\s*\[demande\]\s*/i, ''))
  const models = fromTitle.length ? fromTitle : extractModels(String(body))
  if (models.length === 0) {
    return { error: 'modèle non reconnu : formats acceptés ex. « Ryzen 5 5700 », « i5-14400F », « RTX 4070 Ti Super », « RX 7600 XT », « Arc B580 »' }
  }
  if (new Set(models.map((m) => m.nom)).size > 1) {
    return { error: `plusieurs modèles dans la demande (${[...new Set(models.map((m) => m.nom))].join(', ')}) : une demande par modèle` }
  }
  return { model: models[0] }
}

/** Texte du commentaire laissé sur l'issue, selon l'issue de la demande. */
export function buildRequestComment(r) {
  switch (r.outcome) {
    case 'ajoute':
      return `✅ **${r.nom}** a été ajouté au catalogue (${r.detail}). Il est visible dans la recherche dès le prochain déploiement.`
    case 'deja-present':
      return `ℹ️ **${r.nom}** est déjà dans le catalogue : rien à ajouter.`
    case 'abandonne':
      return `⏹️ Après ${MAX_ATTEMPTS} jours d'essais, **${r.nom}** n'a pas pu être confirmé : ${r.reason}. Demande close ; rouvrez-la ou ouvrez-en une nouvelle si le modèle devient disponible.`
    case 'non-reconnu':
      return `❓ Je n'ai pas pu identifier de modèle dans cette demande : ${r.reason}. Modifiez le titre ou ouvrez une nouvelle demande.`
    default:
      return `⏳ **${r.nom}** n'est pas encore ajouté : ${r.reason}. Je réessaie chaque jour pendant ${MAX_ATTEMPTS} jours.`
  }
}

export const CLOSING_OUTCOMES = new Set(['ajoute', 'deja-present', 'abandonne'])
