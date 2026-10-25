// Détection des composants absents du catalogue.
//
// Règle d'or : on n'ajoute JAMAIS un composant sur une simple supposition.
// Un modèle est ajouté automatiquement seulement si TOUTES les preuves sont
// réunies :
//   - il est absent du catalogue (clé normalisée inconnue, aucun doublon) ;
//   - il apparaît dans au moins MIN_LISTINGS annonces « composant seul » de
//     MIN_SELLERS vendeurs distincts (pas un seul vendeur ni une coquille) ;
//   - une recherche ciblée donne un prix d'occasion exploitable (≥ 4 annonces
//     valides après filtrage, même pipeline que la vérification des prix) ;
//   - le prix d'occasion n'excède pas le prix neuf demandé constaté ;
//   - le modèle est confirmé par une source indépendante (Wikipédia).
// Sinon il va dans la liste « à vérifier manuellement » avec la raison exacte.
// Les attributs qu'aucune source ne donne (tier, facilité de revente, décote,
// socket) sont HÉRITÉS d'un voisin du catalogue et explicitement marqués
// « estimés » dans la fiche.

import { genuineListings, round2, summarizePrices, median } from '../../lib/pricing.mjs'
import { nearestNeighbor, normalizeKey } from './catalogue.mjs'
import { EBAY_CATEGORIES } from './ebay.mjs'

export const MIN_LISTINGS = 6
export const MIN_SELLERS = 3
export const MAX_ADDS_PER_RUN = 5

const upper = (s) => (s ?? '').toUpperCase()
const title = (s) => (s ? s[0].toUpperCase() + s.slice(1).toLowerCase() : '')

const INTEL_SUFFIXES = new Set(['', 'K', 'KF', 'KS', 'F'])
const AMD_SUFFIXES = new Set(['', 'X', 'XT', 'X3D', 'G', 'GE', 'GT', 'F'])

/**
 * Extrait les modèles de composants desktop cités dans un titre d'annonce.
 * Les variantes portables (H, HX, U…) ne correspondent à aucun motif et sont
 * ignorées. Renvoie [{ category, marque, nom, modelCore }].
 */
export function extractModels(rawTitle) {
  const t = String(rawTitle)
  const found = []
  const push = (category, marque, nom, modelCore) => found.push({ category, marque, nom, modelCore })

  for (const m of t.matchAll(/\b(?:core\s*)?(i[3579])[-\s]?(\d{4,5})(k[fs]?|f)?(?![a-z0-9])/gi)) {
    const suffix = upper(m[3])
    if (!INTEL_SUFFIXES.has(suffix)) continue
    const core = `${m[1].toLowerCase()}-${m[2]}${suffix}`
    push('cpu', 'Intel', `Intel Core ${core}`, core)
  }
  for (const m of t.matchAll(/\bcore\s*ultra\s*([3579])\s*(\d{3})(k[f]?)?(?![a-z0-9])/gi)) {
    const suffix = upper(m[3])
    const core = `Ultra ${m[1]} ${m[2]}${suffix}`
    push('cpu', 'Intel', `Intel Core ${core}`, core)
  }
  for (const m of t.matchAll(/\bryzen\s*([3579])\s*(\d{4})(x3d|xt|x|gt|ge|g|f)?(?![a-z0-9])/gi)) {
    const suffix = upper(m[3])
    if (!AMD_SUFFIXES.has(suffix)) continue
    const core = `Ryzen ${m[1]} ${m[2]}${suffix}`
    push('cpu', 'AMD', `AMD ${core}`, core)
  }
  for (const m of t.matchAll(/\b(rtx|gtx)\s*(\d{3,4})(?:\s*(ti\s*super|super|ti))?(?![a-z0-9])/gi)) {
    const sfx = m[3] ? ` ${m[3].replace(/\s+/g, ' ').split(' ').map(title).join(' ')}` : ''
    const core = `${upper(m[1])} ${m[2]}${sfx}`
    push('gpu', 'NVIDIA', core, core)
  }
  for (const m of t.matchAll(/\brx\s*(\d{3,4})(?:\s*(xtx|xt|gre))?(?![a-z0-9])/gi)) {
    const core = `RX ${m[1]}${m[2] ? ` ${upper(m[2])}` : ''}`
    push('gpu', 'AMD', core, core)
  }
  for (const m of t.matchAll(/\barc\s*([ab])\s*(\d{3})(?![a-z0-9])/gi)) {
    const core = `Arc ${upper(m[1])}${m[2]}`
    push('gpu', 'Intel', `Intel ${core}`, core)
  }
  return found
}

export function makeId(nom) {
  return String(nom)
    .toLowerCase()
    .replace(/\b(intel|amd|nvidia|geforce|radeon)\b/g, ' ')
    .replace(/^\s*core\s+(?=i[3579])/, '')
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Motif tolérant (« i5 14400f », « i5-14400F ») pour retrouver un modèle dans un texte. */
export function modelRegex(modelCore) {
  const body = modelCore
    .toLowerCase()
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/[\s-]+/g, '[\\s-]*')
  return new RegExp(`(?<![a-z0-9])${body}(?![a-z0-9])`, 'i')
}

const stripTags = (html) =>
  html
    .replace(/<[^>]*>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&#?\w+;/g, ' ')

/**
 * Confirmation d'existence par une source indépendante : l'API de recherche
 * MediaWiki de Wikipédia. Vrai seulement si un extrait contient le modèle
 * EXACT (suffixe compris). `ok:false` = source injoignable (≠ « pas trouvé »).
 */
export async function confirmOnWikipedia(modelCore, { fetchImpl = globalThis.fetch, timeoutMs = 10000 } = {}) {
  const re = modelRegex(modelCore)
  let reachable = false
  for (const lang of ['en', 'fr']) {
    const url = new URL(`https://${lang}.wikipedia.org/w/api.php`)
    url.searchParams.set('action', 'query')
    url.searchParams.set('list', 'search')
    url.searchParams.set('srsearch', `"${modelCore}"`)
    url.searchParams.set('srlimit', '10')
    url.searchParams.set('srprop', 'snippet')
    url.searchParams.set('format', 'json')
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const res = await fetchImpl(url, {
        signal: controller.signal,
        headers: { 'User-Agent': 'pc-flip-estimator-agent/1.0 (https://github.com/Qlimqx/pc-flip-estimator)' },
      })
      if (!res.ok) continue
      reachable = true
      const data = await res.json()
      for (const hit of data.query?.search ?? []) {
        if (re.test(stripTags(hit.snippet ?? '')) || re.test(hit.title ?? '')) {
          return { ok: true, confirmed: true, source: `${lang}.wikipedia.org`, page: hit.title }
        }
      }
    } catch {
      // essai suivant
    } finally {
      clearTimeout(timer)
    }
  }
  return { ok: reachable, confirmed: false }
}

/**
 * Variante d'un composant déjà au catalogue : « GTX 1060 » face à « GTX 1060 6Go »
 * (la clé du catalogue prolonge celle du candidat par une capacité). Un suffixe de
 * gamme (Ti, Super, XT, F, K…) désigne au contraire un modèle distinct.
 */
export function nearDuplicateOf(key, known) {
  const [category, bare] = key.split(':')
  for (const [otherKey, nom] of known) {
    const [otherCategory, otherBare] = otherKey.split(':')
    if (otherCategory !== category || otherBare === bare) continue
    const [shorter, longer] = bare.length < otherBare.length ? [bare, otherBare] : [otherBare, bare]
    if (longer.startsWith(shorter) && /^\d+(go|gb)$/.test(longer.slice(shorter.length))) return nom
  }
  return null
}

/**
 * Compte, par modèle absent du catalogue, les annonces vues dans des titres.
 * `known` : Map « catégorie:clé normalisée » -> nom du composant du catalogue.
 */
export function tallyCandidates(items, known) {
  const knownKeys = known instanceof Map ? known : new Map([...known].map((k) => [k, k]))
  const tally = new Map()
  for (const item of items) {
    if (typeof item.title !== 'string') continue
    for (const model of extractModels(item.title)) {
      const key = `${model.category}:${normalizeKey(model.nom)}`
      if (knownKeys.has(key)) continue
      const entry = tally.get(key) ?? { ...model, key, ids: new Set(), sellers: new Set(), titles: [] }
      entry.ids.add(item.id ?? item.title)
      if (item.seller) entry.sellers.add(item.seller)
      if (entry.titles.length < 40) entry.titles.push(item.title)
      tally.set(key, entry)
    }
  }
  return [...tally.values()].map((c) => ({
    ...c,
    listingCount: c.ids.size,
    sellerCount: c.sellers.size,
    nearDuplicateOf: nearDuplicateOf(c.key, knownKeys),
  }))
}

const GENERATION = (entry) => {
  const digits = entry.nom.match(/(\d{3,5})[A-Za-z0-9]*$/)?.[1]
  if (!digits) return null
  if (/ryzen/i.test(entry.nom)) return `ryzen${digits[0]}`
  if (/ultra/i.test(entry.nom)) return 'ultra'
  return `i${digits.length === 5 ? digits.slice(0, 2) : digits[0]}`
}

/** Socket hérité seulement si TOUS les voisins de même génération s'accordent. */
export function inheritSocket(candidate, entries) {
  const gen = GENERATION({ nom: candidate.nom })
  if (!gen) return undefined
  const sockets = new Set(
    entries
      .filter((e) => e.category === 'cpu' && e.marque === candidate.marque && e.socket && GENERATION(e) === gen)
      .map((e) => e.socket),
  )
  return sockets.size === 1 ? [...sockets][0] : undefined
}

/** VRAM retenue seulement si ≥ 3 titres la citent et ≥ 60 % s'accordent. */
export function consensusVram(titles) {
  const votes = new Map()
  let total = 0
  for (const t of titles) {
    const m = t.match(/\b(\d{1,2})\s?(?:go|gb|g)\b/i)
    if (!m) continue
    const v = Number(m[1])
    if (![1, 2, 3, 4, 6, 8, 10, 11, 12, 16, 20, 24, 32].includes(v)) continue
    votes.set(v, (votes.get(v) ?? 0) + 1)
    total += 1
  }
  if (total < 3) return undefined
  const [best, n] = [...votes.entries()].sort((a, b) => b[1] - a[1])[0]
  return n / total >= 0.6 ? best : undefined
}

/**
 * Évalue un candidat et décide : ajout automatique ou liste de vérification.
 * `search` : (query, opts) => résultat du client eBay ; `confirm` : confirmOnWikipedia.
 */
export async function evaluateCandidate(candidate, { search, confirm, entries, today, neufRatio = null }) {
  const reasons = []
  if (candidate.nearDuplicateOf) {
    return { verdict: 'verifier', reasons: [`variante proche d'un composant déjà au catalogue (« ${candidate.nearDuplicateOf} ») : doublon possible`] }
  }
  // Une demande explicite de l'utilisateur dispense du minimum d'annonces vues dans la
  // découverte générale, pas des preuves de prix ni de la confirmation indépendante.
  if (!candidate.requested && candidate.listingCount < MIN_LISTINGS) reasons.push(`seulement ${candidate.listingCount} annonce(s) (minimum ${MIN_LISTINGS})`)
  if (!candidate.requested && candidate.sellerCount < MIN_SELLERS) reasons.push(`seulement ${candidate.sellerCount} vendeur(s) distinct(s) (minimum ${MIN_SELLERS})`)
  if (reasons.length) return { verdict: 'verifier', reasons }

  const categoryId = EBAY_CATEGORIES[candidate.category]
  const used = await search(candidate.nom, { condition: 'used', categoryId })
  if (!used.ok) return { verdict: 'verifier', reasons: [`recherche ciblée impossible : ${used.error}`], retryable: true }
  const genuine = genuineListings(used.items, candidate.nom)
  let stats = summarizePrices(genuine.map((i) => i.price))
  const usedTitles = used.items.length
    ? ` ; titres vus : ${used.items.slice(0, 3).map((i) => `« ${String(i.title).slice(0, 60)} »`).join(', ')}`
    : ''

  const neu = await search(candidate.nom, { condition: 'new', categoryId })
  const newStats = neu.ok ? summarizePrices(genuineListings(neu.items, candidate.nom).map((i) => i.price)) : null

  // Repli réservé aux composants DEMANDÉS par l'utilisateur et sans annonce d'occasion
  // exploitable : prix d'occasion estimé = prix neuf demandé × ratio occasion/neuf de
  // l'application (src/data/neufRatio.ts). Confiance « faible », signalé dans la fiche.
  let estimatedFromNew = false
  if (!stats && candidate.requested && newStats && neufRatio) {
    const moyen = round2(newStats.moyen * neufRatio)
    stats = { min: round2(moyen * 0.85), moyen, max: round2(moyen * 1.15), sampleCount: newStats.sampleCount, spreadTightened: true }
    estimatedFromNew = true
  }
  if (!stats) {
    return { verdict: 'verifier', reasons: [`prix d'occasion inexploitable : ${genuine.length} annonce(s) valide(s) sur ${used.items.length} (minimum 4)${usedTitles}`] }
  }

  if (!estimatedFromNew && newStats && stats.moyen > newStats.moyen * 1.05) {
    return { verdict: 'verifier', reasons: [`prix d'occasion (${stats.moyen} €) supérieur au prix neuf demandé (${newStats.moyen} €)`] }
  }

  const wiki = await confirm(candidate.modelCore)
  if (!wiki.ok) return { verdict: 'verifier', reasons: ['confirmation indépendante impossible (Wikipédia injoignable)'], retryable: true }
  if (!wiki.confirmed) return { verdict: 'verifier', reasons: ['modèle non confirmé par une source indépendante (Wikipédia)'] }

  const pool = [...entries]
  const neighbor = nearestNeighbor(pool, { category: candidate.category, marque: candidate.marque, moyen: stats.moyen })
  if (!neighbor) return { verdict: 'verifier', reasons: ['aucun composant voisin dans le catalogue pour estimer tier/décote'] }

  const estimated = ['tier', 'faciliteRevente', 'decoteAnciennete']
  const record = {
    id: makeId(candidate.nom),
    nom: candidate.nom.replace(/^NVIDIA /, ''),
    marque: candidate.marque,
    min: stats.min,
    moyen: stats.moyen,
    max: stats.max,
    dateMaj: today,
    faciliteRevente: neighbor.faciliteRevente,
    decoteAnciennete: neighbor.decoteAnciennete,
    tier: neighbor.tier,
  }
  if (candidate.category === 'cpu') {
    const socket = inheritSocket(candidate, entries)
    if (socket) {
      record.socket = socket
      estimated.push('socket')
    }
  } else {
    const vram = consensusVram(genuine.map((i) => i.title))
    if (vram) record.vramGo = vram
  }
  record.agent = {
    ajouteLe: today,
    confiance: !estimatedFromNew && stats.sampleCount >= 8 ? 'moyenne' : 'faible',
    sources: [estimatedFromNew ? `eBay Browse FR (annonces NEUVES, prix demandés) × ratio occasion/neuf ${neufRatio}` : 'eBay Browse FR (annonces d\'occasion, prix demandés)', wiki.source],
    prixEstimeDepuisNeuf: estimatedFromNew,
    attributsEstimes: estimated,
    voisinReference: neighbor.id,
    echantillons: stats.sampleCount,
    prixNeufIndicatif: newStats ? newStats.moyen : null,
    annoncesVues: candidate.listingCount,
    vendeursDistincts: candidate.sellerCount,
  }
  return { verdict: 'ajouter', record, stats: { ...stats, moyen: round2(stats.moyen) }, medianListing: median(genuine.map((i) => i.price)) }
}
