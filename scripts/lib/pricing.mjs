// Logique de prix pure, partagée par scripts/update-prices.mjs (ancien
// pipeline, lancement manuel) et par l'agent quotidien (scripts/agent/).
// Aucune entrée/sortie ici : uniquement des fonctions testables.
//
// Les garde-fous viennent des incidents des 2026-08-26 et 2026-09-27
// (voir l'en-tête de scripts/update-prices.mjs) : filtrage par titre AVANT
// tout calcul, filtre d'outliers, resserrage d'une fourchette trop large,
// minimum d'échantillons.

export const MIN_SAMPLES = 4
export const OUTLIER_LOW_MULT = 0.6
export const OUTLIER_HIGH_MULT = 1.8
// Au-delà, le nuage retenu est jugé trop dispersé pour faire confiance aux
// extrêmes bruts : la fourchette est resserrée autour de la médiane.
export const MAX_SPREAD_RATIO = 2.2
export const TIGHT_BAND_HALF_WIDTH_PCT = 0.15

// Suffixes qui, accolés à un modèle, désignent une variante différente --
// ex: chercher "Ryzen 5 5600" ne doit pas matcher "5600G"/"5600X"/"5600H".
export const SUFFIX_QUALIFIERS = new Set(['g', 'ge', 'gt', 'h', 'x', 'xt', 'xtx', 'x3d', 'ti', 'super'])

// Titres qui trahissent un PC complet / laptop plutôt qu'un composant seul.
export const BUNDLE_KEYWORDS = [
  'pc gamer',
  'pc gaming',
  'ordinateur',
  'unité centrale',
  'unite centrale',
  'tour de pc',
  'portable',
  'laptop',
  'ideapad',
  'thinkcentre',
  'thinkpad',
  'macbook',
  'victus',
  'nitro',
  'magicbook',
  'zephyrus',
  'legion',
]

export function round2(v) {
  return Math.round(v * 100) / 100
}

export function median(values) {
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

export function filterOutliers(prices) {
  if (prices.length === 0) return []
  const med = median(prices)
  return prices.filter((p) => p >= med * OUTLIER_LOW_MULT && p <= med * OUTLIER_HIGH_MULT)
}

export function looksLikeBundle(title) {
  const t = title.toLowerCase()
  return BUNDLE_KEYWORDS.some((kw) => t.includes(kw))
}

export function titleMatchesModel(title, model) {
  const titleNorm = title.toLowerCase()
  const modelNorm = model.toLowerCase().trim()
  const start = titleNorm.indexOf(modelNorm)
  if (start === -1) return false
  const tail = titleNorm.slice(start + modelNorm.length)
  // Suffixe collé directement (ex: "5600g", "5600x3d") -> mauvaise variante.
  if (tail && /^[a-z0-9]/.test(tail)) return false
  // Suffixe séparé par un espace (ex: "5070 Ti") -> mauvaise variante.
  const nextWord = tail.match(/^\s+([a-z0-9]+)/)
  if (nextWord && SUFFIX_QUALIFIERS.has(nextWord[1])) return false
  return true
}

/**
 * Transforme une liste de prix d'annonces déjà filtrées par titre en une
 * fiche de prix { min, moyen, max, sampleCount }, ou null si les données sont
 * insuffisantes (jamais d'écriture sur une donnée pauvre).
 */
export function summarizePrices(rawPrices) {
  const prices = rawPrices.filter((v) => Number.isFinite(v) && v > 0)
  const filtered = filterOutliers(prices)
  if (filtered.length < MIN_SAMPLES) return null
  const sorted = [...filtered].sort((a, b) => a - b)
  const moyen = round2(median(filtered))
  const rawMin = sorted[0]
  const rawMax = sorted[sorted.length - 1]
  const spreadTooWide = rawMin > 0 && rawMax / rawMin > MAX_SPREAD_RATIO
  return {
    min: spreadTooWide ? round2(moyen * (1 - TIGHT_BAND_HALF_WIDTH_PCT)) : round2(rawMin),
    moyen,
    max: spreadTooWide ? round2(moyen * (1 + TIGHT_BAND_HALF_WIDTH_PCT)) : round2(rawMax),
    sampleCount: filtered.length,
    spreadTightened: spreadTooWide,
  }
}

/** Annonces d'un composant seul dont le titre correspond exactement au modèle. */
export function genuineListings(listings, model) {
  return listings.filter(
    (item) => typeof item.title === 'string' && titleMatchesModel(item.title, model) && !looksLikeBundle(item.title),
  )
}
