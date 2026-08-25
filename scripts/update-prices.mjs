#!/usr/bin/env node
// Rafraîchit les prix occasion CPU/GPU/RAM/stockage via l'API eBay Browse,
// une fois par jour via GitHub Actions (.github/workflows/update-prices.yml).
// Écrit le résultat dans src/data/priceOverrides/*.json, que cpus.ts/gpus.ts
// fusionnent par-dessus la donnée de base vérifiée à la main (voir le
// commentaire d'en-tête de ces fichiers) -- BASE_CPUS/BASE_GPUS ne sont
// jamais modifiés par ce script.
//
// Garde-fous (pour un usage pro, une automatisation aveugle est un risque,
// pas une garantie de fiabilité -- ces règles empêchent qu'une recherche qui
// remonte n'importe quoi corrompe silencieusement toute la base) :
// - Rejette les annonces individuelles hors de [0,4x, 2,5x] de la médiane
//   brute avant de calculer les stats finales (élimine les mauvais
//   modèles/mauvaises variantes remontés par une recherche trop large).
// - Exige au moins MIN_SAMPLES annonces valides après filtrage, sinon
//   n'écrit rien pour cette fiche ce jour-là (garde la dernière valeur
//   connue plutôt que d'écraser avec une donnée pauvre).
// - Consigne dans PRICE_REVIEW.md toute fiche dont le prix moyen change de
//   plus de FLAG_THRESHOLD_PCT par rapport à la veille -- l'automatisation
//   rafraîchit les chiffres, elle ne remplace pas un contrôle humain
//   périodique sur les gros écarts (voir aussi le rappel hebdomadaire dans
//   le même workflow).

import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const OVERRIDES_DIR = path.join(ROOT, 'src/data/priceOverrides')

const MIN_SAMPLES = 4
const OUTLIER_LOW_MULT = 0.4
const OUTLIER_HIGH_MULT = 2.5
const FLAG_THRESHOLD_PCT = 0.25
const REQUEST_DELAY_MS = 250 // reste raisonnable vis-à-vis des quotas eBay

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

async function searchUsedPrices(query, token) {
  const url = new URL('https://api.ebay.com/buy/browse/v1/item_summary/search')
  url.searchParams.set('q', query)
  // 3000-6000 = toutes les variantes "occasion" (Used, Very Good, Good...),
  // jamais 1000 (New) -- l'outil est explicitement occasion, pas neuf.
  url.searchParams.set('filter', 'conditionIds:{3000|4000|5000|6000}')
  url.searchParams.set('limit', '30')
  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_FR',
      },
    })
    if (!res.ok) return []
    const data = await res.json()
    return (data.itemSummaries ?? [])
      .map((item) => Number(item.price?.value))
      .filter((v) => Number.isFinite(v) && v > 0)
  } catch {
    return []
  }
}

async function priceEntry(nom, token) {
  const raw = await searchUsedPrices(nom, token)
  const filtered = filterOutliers(raw)
  if (filtered.length < MIN_SAMPLES) return null
  const sorted = [...filtered].sort((a, b) => a - b)
  return {
    min: round2(sorted[0]),
    moyen: round2(median(filtered)),
    max: round2(sorted[sorted.length - 1]),
    dateMaj: new Date().toISOString().slice(0, 10),
    sampleCount: filtered.length,
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

async function main() {
  const token = await getEbayToken()
  const manifest = await loadJson(path.join(OVERRIDES_DIR, 'manifest.json'), [])
  if (manifest.length === 0) {
    throw new Error('manifest.json est vide ou introuvable -- rien à mettre à jour.')
  }

  const cpuOverrides = await loadJson(path.join(OVERRIDES_DIR, 'cpuOverrides.json'), {})
  const gpuOverrides = await loadJson(path.join(OVERRIDES_DIR, 'gpuOverrides.json'), {})

  const flagged = []
  let updated = 0
  let skipped = 0

  for (const { id, nom, category } of manifest) {
    const overrides = category === 'cpu' ? cpuOverrides : gpuOverrides
    const result = await priceEntry(nom, token)
    await sleep(REQUEST_DELAY_MS)

    if (!result) {
      skipped += 1
      continue
    }

    const previous = overrides[id]
    if (previous) {
      const changePct = Math.abs(result.moyen - previous.moyen) / previous.moyen
      if (changePct > FLAG_THRESHOLD_PCT) {
        flagged.push({
          id,
          nom,
          category,
          ancienMoyen: previous.moyen,
          nouveauMoyen: result.moyen,
          changePct: round2(changePct * 100),
        })
      }
    }

    overrides[id] = result
    updated += 1
  }

  await writeFile(path.join(OVERRIDES_DIR, 'cpuOverrides.json'), JSON.stringify(cpuOverrides, null, 2) + '\n')
  await writeFile(path.join(OVERRIDES_DIR, 'gpuOverrides.json'), JSON.stringify(gpuOverrides, null, 2) + '\n')

  console.log(`Mis à jour : ${updated}, ignorés (données insuffisantes) : ${skipped}`)

  if (flagged.length > 0) {
    const today = new Date().toISOString().slice(0, 10)
    const lines = [
      `## ${today}`,
      '',
      ...flagged.map(
        (f) =>
          `- **${f.nom}** (${f.category}) : ${f.ancienMoyen}€ → ${f.nouveauMoyen}€ (${f.changePct > 0 ? '+' : ''}${f.changePct}%)`,
      ),
      '',
    ]
    const reviewPath = path.join(ROOT, 'PRICE_REVIEW.md')
    const existing = await readFile(reviewPath, 'utf8').catch(() => '# Écarts de prix à vérifier\n\n')
    await writeFile(reviewPath, existing + lines.join('\n'))
    console.log(`${flagged.length} écart(s) > ${FLAG_THRESHOLD_PCT * 100}% consigné(s) dans PRICE_REVIEW.md`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
