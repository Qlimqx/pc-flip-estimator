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
      "L'agent quotidien vérifiera ce modèle (annonces, prix, source indépendante) et l'ajoutera au catalogue s'il est confirmé. Cette issue sera commentée et fermée une fois traitée.",
    ].join('\n'),
  })
  return `${REPO_URL}/issues/new?${params.toString()}`
}
