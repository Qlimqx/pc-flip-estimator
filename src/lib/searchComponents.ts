import type { ComponentPricing } from '../types'

const normalize = (s: string) => s.toLowerCase().replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim()

export interface SearchResult {
  results: ComponentPricing[]
  /** Vrai si aucun nom ne contient la saisie telle quelle : on propose des modèles proches. */
  approximate: boolean
}

/**
 * Recherche tolérante dans le catalogue.
 * 1. nom contenant la saisie (comportement historique) ;
 * 2. sinon tous les mots de la saisie présents dans le nom, dans n'importe quel ordre ;
 * 3. sinon le numéro de modèle seul (« 5700x » pour « Ryzen 5 5700X », qui s'appelle
 *    en réalité « Ryzen 7 5700X ») : résultats signalés comme approximatifs.
 */
export function searchComponents(items: ComponentPricing[], query: string, limit = 8): SearchResult {
  const q = normalize(query)
  if (!q) return { results: items.slice(0, limit), approximate: false }

  const exact = items.filter((i) => normalize(i.nom).includes(q))
  if (exact.length > 0) return { results: exact.slice(0, limit), approximate: false }

  const tokens = q.split(' ')
  const allTokens = items.filter((i) => {
    const name = normalize(i.nom)
    return tokens.every((t) => name.includes(t))
  })
  if (allTokens.length > 0) return { results: allTokens.slice(0, limit), approximate: true }

  const modelToken = tokens.find((t) => /\d{3,}/.test(t))
  if (modelToken) {
    const byModel = items.filter((i) => normalize(i.nom).split(' ').includes(modelToken))
    if (byModel.length > 0) return { results: byModel.slice(0, limit), approximate: true }
  }
  return { results: [], approximate: false }
}
