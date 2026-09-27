#!/usr/bin/env node
// Rafraîchit les prix occasion CPU/GPU via l'API eBay Browse, une fois par
// jour via GitHub Actions (.github/workflows/update-prices.yml). Écrit le
// résultat dans src/data/priceOverrides/*.json, que cpus.ts/gpus.ts
// fusionnent par-dessus la donnée de base vérifiée à la main (voir le
// commentaire d'en-tête de ces fichiers) -- BASE_CPUS/BASE_GPUS ne sont
// jamais modifiés par ce script.
//
// INCIDENT DU 2026-08-26 (pour mémoire, ne pas régresser) : le premier run
// en production a écrasé la base avec des prix jusqu'à x5-7 trop élevés
// (Ryzen 5 5600 : 110€ -> 595€, RTX 4060 : 272€ -> 747€). Cause : une
// recherche eBay par simple mot-clé (`q=nom`) remonte massivement des PC
// complets ("PC Gamer RTX 3080 / Ryzen 5 5600 / 32Go RAM..." à 1375€) et des
// mauvaises variantes (5600G/5600X/5600GT/5600H/5600X3D matchés par une
// recherche floue sur "5600") -- vérifié en direct : sur 30 résultats pour
// "AMD Ryzen 5 5600", seuls 2 étaient vraiment ce CPU seul. Exactement le
// même bug de fond que celui trouvé et corrigé sur ldlc.js dans le projet
// pc-rachat (recherche sans filtrage de titre = confiance aveugle dans le
// classement "pertinence" du moteur de recherche). Corrigé ici en portant
// le même filtrage par titre (titleMatchesModel + exclusion des bundles).
// Données corrompues révoquées via `git revert` avant que ça n'atteigne les
// utilisateurs -- voir l'historique git pour le détail.
//
// INCIDENT DU 2026-09-27 (pour mémoire, ne pas régresser) : malgré le
// filtrage par titre, ~40 fiches CPU/GPU avaient dérivé de 30% à +320% au
// fil des runs quotidiens (RTX 4060 : 272€ -> 1144€ en un mois), chacune
// avec une fourchette interne aberrante (jusqu'à 3990-4x entre min et max).
// Cause : le garde-fou HARD_REJECT_PCT comparait au prix de la veille (déjà
// dérivé), pas à la donnée de base vérifiée -- une hausse de +30-50%/jour
// passe sous le seuil de 60% à chaque run individuel mais compose sans
// limite sur plusieurs jours (effet "grenouille dans l'eau qui chauffe").
// Le filtre d'outliers (0,4x-2,5x la médiane) était aussi trop permissif :
// il laissait passer un nuage de points jusqu'à 6x d'écart interne. Données
// corrompues remises à la base vérifiée via reset des fichiers overrides.
// Corrigé ici par : (1) ancrage de TOUTE décision (rejet ET flag) sur la
// donnée de base -- jamais sur l'override de la veille, la dérive ne peut
// plus s'accumuler d'un run à l'autre ; (2) base reparsée à chaque run
// directement depuis cpus.ts/gpus.ts (plus de manifest.json statique qui
// pouvait devenir obsolète si l'agent de vérification IA corrige la base
// entre-temps) ; (3) filtre d'outliers resserré (0,6x-1,8x) et garde-fou
// MAX_SPREAD_RATIO qui resserre la fourchette autour de la médiane quand le
// nuage de points retenu reste anormalement large.
//
// Garde-fous (pour un usage pro, une automatisation aveugle est un risque,
// pas une garantie de fiabilité) :
// - Filtrage par titre AVANT tout calcul de prix (voir titleMatchesModel /
//   looksLikeBundle) -- élimine les mauvaises variantes et les PC
//   complets/laptops à la source, pas juste par un seuil de prix a
//   posteriori.
// - Rejette les annonces individuelles restantes hors de [0,6x, 1,8x] de la
//   médiane du lot filtré (garde-fou statistique en plus du filtrage par
//   titre, pas à sa place).
// - Si le nuage retenu reste malgré tout étalé (max/min > MAX_SPREAD_RATIO),
//   la fourchette écrite n'est pas les extrêmes bruts mais une bande
//   resserrée autour de la médiane -- un écart énorme entre le plus bas et
//   le plus haut est un signal de bruit, pas une fourchette de marché
//   réelle à restituer telle quelle.
// - Exige au moins MIN_SAMPLES annonces valides après filtrage, sinon
//   n'écrit rien pour cette fiche ce jour-là (garde la dernière valeur
//   connue plutôt que d'écraser avec une donnée pauvre) -- attendu pour une
//   bonne partie des composants anciens/rares, ce n'est pas un
//   dysfonctionnement.
// - Compare le nouveau prix moyen à la donnée de BASE vérifiée à la main
//   (jamais à l'override de la veille, voir incident du 2026-09-27) --
//   reparsée à chaque run depuis cpus.ts/gpus.ts pour rester à jour même si
//   la base a été corrigée entre-temps. Un écart > HARD_REJECT_PCT est
//   REJETÉ (la fiche n'est pas mise à jour) ; un écart > FLAG_THRESHOLD_PCT
//   est accepté mais consigné dans PRICE_REVIEW.md pour relecture humaine.

import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const OVERRIDES_DIR = path.join(ROOT, 'src/data/priceOverrides')

const MIN_SAMPLES = 4
const OUTLIER_LOW_MULT = 0.6
const OUTLIER_HIGH_MULT = 1.8
// Au-delà, le nuage de points retenu (même après filtrage d'outliers) est
// jugé trop dispersé pour faire confiance aux extrêmes bruts -- la
// fourchette écrite est resserrée autour de la médiane à la place.
const MAX_SPREAD_RATIO = 2.2
const TIGHT_BAND_HALF_WIDTH_PCT = 0.15
const FLAG_THRESHOLD_PCT = 0.25
const HARD_REJECT_PCT = 0.6
const REQUEST_DELAY_MS = 250 // reste raisonnable vis-à-vis des quotas eBay

// Suffixes qui, accolés à un modèle, désignent une variante différente --
// ex: chercher "Ryzen 5 5600" ne doit pas matcher "5600G"/"5600X"/"5600H".
// Couvre les suffixes AMD (desktop/APU/mobile/3D-cache) et GPU (Ti/Super/XT)
// au cas où un modèle les utilise en toute fin de recherche.
const SUFFIX_QUALIFIERS = new Set(['g', 'ge', 'gt', 'h', 'x', 'xt', 'xtx', 'x3d', 'ti', 'super'])

// Titres qui trahissent un PC complet / laptop plutôt qu'un composant seul
// -- vérifié en direct contre le vrai bruit remonté par l'API (voir
// l'incident ci-dessus).
const BUNDLE_KEYWORDS = [
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

function round2(v) {
  return Math.round(v * 100) / 100
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

function filterOutliers(prices) {
  if (prices.length === 0) return []
  const med = median(prices)
  return prices.filter((p) => p >= med * OUTLIER_LOW_MULT && p <= med * OUTLIER_HIGH_MULT)
}

function looksLikeBundle(title) {
  const t = title.toLowerCase()
  return BUNDLE_KEYWORDS.some((kw) => t.includes(kw))
}

function titleMatchesModel(title, model) {
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

async function getEbayToken() {
  const clientId = process.env.EBAY_CLIENT_ID
  const clientSecret = process.env.EBAY_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    throw new Error(
      'EBAY_CLIENT_ID / EBAY_CLIENT_SECRET manquants -- à configurer comme secrets GitHub Actions (voir README).',
    )
  }
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  const res = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${basic}`,
    },
    body: 'grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope',
  })
  if (!res.ok) throw new Error(`eBay OAuth a échoué : ${res.status} ${await res.text()}`)
  const data = await res.json()
  return data.access_token
}

async function searchUsedListings(query, token) {
  const url = new URL('https://api.ebay.com/buy/browse/v1/item_summary/search')
  url.searchParams.set('q', query)
  // 3000-6000 = toutes les variantes "occasion" (Used, Very Good, Good...),
  // jamais 1000 (New) -- l'outil est explicitement occasion, pas neuf.
  url.searchParams.set('filter', 'conditionIds:{3000|4000|5000|6000}')
  url.searchParams.set('limit', '50')
  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_FR',
      },
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.itemSummaries ?? []
  } catch {
    return []
  }
}

async function priceEntry(nom, token) {
  const listings = await searchUsedListings(nom, token)
  const genuine = listings.filter(
    (item) => typeof item.title === 'string' && titleMatchesModel(item.title, nom) && !looksLikeBundle(item.title),
  )
  const prices = genuine
    .map((item) => Number(item.price?.value))
    .filter((v) => Number.isFinite(v) && v > 0)
  const filtered = filterOutliers(prices)
  if (filtered.length < MIN_SAMPLES) return null
  const sorted = [...filtered].sort((a, b) => a - b)
  const moyen = round2(median(filtered))
  const rawMin = sorted[0]
  const rawMax = sorted[sorted.length - 1]
  // Même après le filtre d'outliers, un nuage encore trop étalé n'est pas
  // une vraie fourchette de marché -- on resserre autour de la médiane
  // plutôt que d'écrire des extrêmes bruités (voir incident du 2026-09-27).
  const spreadTooWide = rawMin > 0 && rawMax / rawMin > MAX_SPREAD_RATIO
  const min = spreadTooWide ? round2(moyen * (1 - TIGHT_BAND_HALF_WIDTH_PCT)) : round2(rawMin)
  const max = spreadTooWide ? round2(moyen * (1 + TIGHT_BAND_HALF_WIDTH_PCT)) : round2(rawMax)
  return {
    min,
    moyen,
    max,
    dateMaj: new Date().toISOString().slice(0, 10),
    sampleCount: filtered.length,
    rawCount: listings.length,
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function loadJson(file, fallback) {
  try {
    return JSON.parse(await readFile(file, 'utf8'))
  } catch {
    return fallback
  }
}

/**
 * Reparse BASE_CPUS/BASE_GPUS directement depuis les fichiers source à
 * chaque run -- pas de manifest.json statique qui pourrait devenir obsolète
 * si l'agent de vérification IA corrige la base entre deux runs de ce
 * script (voir incident du 2026-09-27). Les objets de ces tableaux ne
 * s'imbriquent pas, donc un simple `{[^{}]*}` suffit à isoler chaque entrée.
 */
async function parseBaseArray(filePath, arrayName, category) {
  const src = await readFile(filePath, 'utf8')
  const startIdx = src.indexOf(`const ${arrayName}`)
  if (startIdx === -1) throw new Error(`${arrayName} introuvable dans ${filePath}`)
  const endIdx = src.indexOf('\nexport', startIdx)
  const slice = src.slice(startIdx, endIdx === -1 ? undefined : endIdx)
  const blocks = slice.match(/\{[^{}]*\}/g) ?? []
  const entries = []
  for (const block of blocks) {
    const id = block.match(/id:\s*'([^']+)'/)?.[1]
    const nom = block.match(/nom:\s*'([^']+)'/)?.[1]
    const baseMin = block.match(/\bmin:\s*([\d.]+)/)?.[1]
    const baseMoyen = block.match(/\bmoyen:\s*([\d.]+)/)?.[1]
    const baseMax = block.match(/\bmax:\s*([\d.]+)/)?.[1]
    if (!id || !nom || baseMin === undefined || baseMoyen === undefined || baseMax === undefined) continue
    entries.push({
      id,
      nom,
      category,
      baseMin: Number(baseMin),
      baseMoyen: Number(baseMoyen),
      baseMax: Number(baseMax),
    })
  }
  return entries
}

async function main() {
  const token = await getEbayToken()
  const manifest = [
    ...(await parseBaseArray(path.join(ROOT, 'src/data/cpus.ts'), 'BASE_CPUS', 'cpu')),
    ...(await parseBaseArray(path.join(ROOT, 'src/data/gpus.ts'), 'BASE_GPUS', 'gpu')),
  ]
  if (manifest.length === 0) {
    throw new Error('Aucune entrée trouvée dans BASE_CPUS/BASE_GPUS -- rien à mettre à jour.')
  }

  const cpuOverrides = await loadJson(path.join(OVERRIDES_DIR, 'cpuOverrides.json'), {})
  const gpuOverrides = await loadJson(path.join(OVERRIDES_DIR, 'gpuOverrides.json'), {})

  const flagged = []
  const rejected = []
  let updated = 0
  let skipped = 0

  for (const { id, nom, category, baseMoyen } of manifest) {
    const overrides = category === 'cpu' ? cpuOverrides : gpuOverrides
    const result = await priceEntry(nom, token)
    await sleep(REQUEST_DELAY_MS)

    if (!result) {
      skipped += 1
      continue
    }

    // La décision (rejet / flag) est ancrée sur la donnée de BASE vérifiée à
    // la main -- jamais sur l'override de la veille (voir incident du
    // 2026-09-27 : comparer à la veille laisse une dérive de +30-50%/jour
    // s'accumuler sans limite sur plusieurs jours, chaque saut individuel
    // restant sous le seuil). currentEffective ne sert plus qu'à l'affichage
    // (ce qui est réellement visible dans l'app aujourd'hui).
    const currentEffective = overrides[id]?.moyen ?? baseMoyen
    const changePctFromBase = Math.abs(result.moyen - baseMoyen) / baseMoyen

    if (changePctFromBase > HARD_REJECT_PCT) {
      rejected.push({
        id,
        nom,
        category,
        valeurActuelle: currentEffective,
        valeurProposee: result.moyen,
        changePct: round2(changePctFromBase * 100),
      })
      continue
    }

    if (changePctFromBase > FLAG_THRESHOLD_PCT) {
      flagged.push({
        id,
        nom,
        category,
        ancienMoyen: currentEffective,
        nouveauMoyen: result.moyen,
        changePct: round2(changePctFromBase * 100),
      })
    }

    overrides[id] = result
    updated += 1
  }

  await writeFile(path.join(OVERRIDES_DIR, 'cpuOverrides.json'), JSON.stringify(cpuOverrides, null, 2) + '\n')
  await writeFile(path.join(OVERRIDES_DIR, 'gpuOverrides.json'), JSON.stringify(gpuOverrides, null, 2) + '\n')

  console.log(
    `Mis à jour : ${updated}, ignorés (données insuffisantes) : ${skipped}, rejetés (écart > ${HARD_REJECT_PCT * 100}%) : ${rejected.length}`,
  )

  if (flagged.length > 0 || rejected.length > 0) {
    const today = new Date().toISOString().slice(0, 10)
    const lines = [`## ${today}`, '']
    if (rejected.length > 0) {
      lines.push('### Rejetés (écart trop important, valeur inchangée)', '')
      lines.push(
        ...rejected.map(
          (f) =>
            `- **${f.nom}** (${f.category}) : ${f.valeurActuelle}€ conservé, eBay proposait ${f.valeurProposee}€ (${f.changePct > 0 ? '+' : ''}${f.changePct}%)`,
        ),
      )
      lines.push('')
    }
    if (flagged.length > 0) {
      lines.push('### Écarts notables acceptés (à vérifier)', '')
      lines.push(
        ...flagged.map(
          (f) =>
            `- **${f.nom}** (${f.category}) : ${f.ancienMoyen}€ → ${f.nouveauMoyen}€ (${f.changePct > 0 ? '+' : ''}${f.changePct}%)`,
        ),
      )
      lines.push('')
    }
    const reviewPath = path.join(ROOT, 'PRICE_REVIEW.md')
    const existing = await readFile(reviewPath, 'utf8').catch(() => '# Écarts de prix à vérifier\n\n')
    await writeFile(reviewPath, existing + lines.join('\n'))
    console.log(`${flagged.length} écart(s) accepté(s) + ${rejected.length} rejeté(s) consigné(s) dans PRICE_REVIEW.md`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
