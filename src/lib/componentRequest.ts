// Demande d'ajout d'un composant absent du catalogue.
//
// L'application est 100 % statique (aucun serveur) : la demande passe par une
// issue GitHub préremplie, ouverte par l'utilisateur dans son navigateur. Le
// lendemain, l'agent quotidien (scripts/agent/) lit les issues ouvertes portant
// le libellé `composant-demande`, vérifie le modèle (annonces, prix, source
// indépendante) et l'ajoute au catalogue s'il est prouvé.

export const REPO_URL = 'https://github.com/Qlimqx/pc-flip-estimator'
export const REQUEST_LABEL = 'composant-demande'

export type RequestKind = 'cpu' | 'gpu'

const KIND_LABEL: Record<RequestKind, string> = {
  cpu: 'Processeur',
  gpu: 'Carte graphique',
}

/** Préfixe du titre de l'issue : l'agent ne lit que la partie qui suit. */
export const REQUEST_TITLE_PREFIX = '[Demande]'

export function buildRequestUrl(kind: RequestKind, query: string): string {
  const name = query.trim()
  const params = new URLSearchParams({
    labels: REQUEST_LABEL,
    title: `${REQUEST_TITLE_PREFIX} ${KIND_LABEL[kind]} ${name}`.trim(),
    body: [
      `Composant demandé : **${name || '(à préciser)'}**`,
      `Catégorie : ${KIND_LABEL[kind]}`,
      '',
      "Prix d'occasion indicatif (facultatif, utilisé seulement si aucune annonce n'est exploitable) : … €",
      '',
      "L'agent quotidien vérifiera ce modèle (annonces, prix, source indépendante) et l'ajoutera au catalogue s'il est confirmé. Cette issue sera commentée et fermée une fois traitée.",
    ].join('\n'),
  })
  return `${REPO_URL}/issues/new?${params.toString()}`
}

export type SendResult =
  | { ok: true; message: string }
  | { ok: false; message: string; fallback: boolean }

/**
 * Envoie la demande à la fonction du site (POST /api/request-component), qui crée
 * l'issue pour l'agent sans que le visiteur ait besoin d'un compte GitHub.
 * `fallback: true` = l'envoi direct est indisponible (non configuré, réseau, absent
 * en développement local) : l'interface propose alors le lien GitHub.
 */
export async function sendComponentRequest(
  kind: RequestKind,
  name: string,
  fetchImpl: typeof fetch = (...args) => fetch(...args),
): Promise<SendResult> {
  try {
    const res = await fetchImpl('/api/request-component', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind, name: name.trim(), website: '' }),
    })
    let data: { ok?: boolean; message?: string; error?: string } = {}
    try {
      data = await res.json()
    } catch {
      return { ok: false, message: 'Réponse inattendue du serveur.', fallback: true }
    }
    if (res.ok && data.ok) return { ok: true, message: data.message ?? 'Demande envoyée.' }
    const fallback = res.status === 404 || res.status >= 500 || data.error === 'not-configured' || data.error === 'upstream'
    return { ok: false, message: data.message ?? 'Envoi impossible.', fallback }
  } catch {
    return { ok: false, message: 'Envoi impossible (réseau).', fallback: true }
  }
}
