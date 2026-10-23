// Lecture du catalogue CPU/GPU (données de base + composants ajoutés par
// l'agent + fiches de prix), détection de doublons et contrôles de cohérence.
//
// BASE_CPUS / BASE_GPUS restent écrits à la main (et corrigés par la routine
// de vérification IA) : l'agent ne les modifie JAMAIS. Il lit leurs valeurs
// comme ancrage de référence (voir incident du 2026-09-27) et ajoute ses
// propres découvertes dans src/data/agent/added*.json.

import { readFile } from 'node:fs/promises'
import path from 'node:path'

export const CATEGORIES = {
  cpu: {
    file: 'src/data/cpus.ts',
    arrayName: 'BASE_CPUS',
    overrides: 'src/data/priceOverrides/cpuOverrides.json',
    added: 'src/data/agent/addedCpus.json',
  },
  gpu: {
    file: 'src/data/gpus.ts',
    arrayName: 'BASE_GPUS',
    overrides: 'src/data/priceOverrides/gpuOverrides.json',
    added: 'src/data/agent/addedGpus.json',
  },
}

const BRAND_WORDS = /\b(intel|amd|nvidia|geforce|radeon|core|processeur|processor|graphics)\b/g

/** Clé normalisée : « Intel Core i5-14400F » et « i5 14400f » donnent la même clé. */
export function normalizeKey(name) {
  return String(name)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(BRAND_WORDS, ' ')
    .replace(/[^a-z0-9]/g, '')
}

export function slugify(name) {
  return String(name)
    .toLowerCase()
    .replace(/\b(intel|amd|nvidia|geforce|radeon|processeur)\b/g, ' ')
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const NUM = (block, key) => {
  const v = block.match(new RegExp(`\\b${key}:\\s*([\\d.]+)`))?.[1]
  return v === undefined ? undefined : Number(v)
}
const STR = (block, key) => block.match(new RegExp(`\\b${key}:\\s*'([^']*)'`))?.[1]

/**
 * Relit BASE_CPUS / BASE_GPUS depuis le source TypeScript. Les objets de ces
 * tableaux ne s'imbriquent pas : `{[^{}]*}` isole chaque fiche. Une fiche
 * incomplète est IGNORÉE mais comptée (renvoyée dans `skipped`) pour que
 * l'agent la signale au lieu de la perdre silencieusement.
 */
export function parseBaseSource(src, arrayName, category) {
  const startIdx = src.indexOf(`const ${arrayName}`)
  if (startIdx === -1) throw new Error(`${arrayName} introuvable dans le fichier source`)
  const endIdx = src.indexOf('\nexport', startIdx)
  const slice = src.slice(startIdx, endIdx === -1 ? undefined : endIdx)
  const blocks = slice.match(/\{[^{}]*\}/g) ?? []
  const entries = []
  const skipped = []
  for (const block of blocks) {
    const id = STR(block, 'id')
    const nom = STR(block, 'nom')
    if (!id && !nom) continue // ex. interface PriceOverride { ... }
    const baseMin = NUM(block, 'min')
    const baseMoyen = NUM(block, 'moyen')
    const baseMax = NUM(block, 'max')
    if (!id || !nom || baseMin === undefined || baseMoyen === undefined || baseMax === undefined) {
      skipped.push(id ?? nom ?? '(sans identifiant)')
      continue
    }
    entries.push({
      id,
      nom,
      category,
      origin: 'base',
      marque: STR(block, 'marque'),
      socket: STR(block, 'socket'),
      vramGo: NUM(block, 'vramGo'),
      baseMin,
      baseMoyen,
      baseMax,
      baseDateMaj: STR(block, 'dateMaj'),
      faciliteRevente: NUM(block, 'faciliteRevente'),
      decoteAnciennete: NUM(block, 'decoteAnciennete'),
      tier: NUM(block, 'tier'),
    })
  }
  return { entries, skipped }
}

async function readJson(file, fallback) {
  try {
    return JSON.parse(await readFile(file, 'utf8'))
  } catch (err) {
    if (err.code === 'ENOENT') return fallback
    throw new Error(`Fichier JSON illisible ou corrompu : ${file} (${err.message})`)
  }
}

/**
 * Charge tout le catalogue. Une erreur de lecture/parse est FATALE (l'agent
 * ne doit jamais travailler sur un catalogue partiellement lu).
 */
export async function loadCatalogue(root) {
  const entries = []
  const overrides = {}
  const added = {}
  const skipped = []
  for (const [category, conf] of Object.entries(CATEGORIES)) {
    const src = await readFile(path.join(root, conf.file), 'utf8')
    const parsed = parseBaseSource(src, conf.arrayName, category)
    skipped.push(...parsed.skipped)
    entries.push(...parsed.entries)
    overrides[category] = await readJson(path.join(root, conf.overrides), {})
    added[category] = await readJson(path.join(root, conf.added), [])
    if (!Array.isArray(added[category])) throw new Error(`${conf.added} doit contenir un tableau`)
    for (const a of added[category]) {
      entries.push({
        id: a.id,
        nom: a.nom,
        category,
        origin: 'agent',
        marque: a.marque,
        socket: a.socket,
        vramGo: a.vramGo,
        baseMin: a.min,
        baseMoyen: a.moyen,
        baseMax: a.max,
        baseDateMaj: a.dateMaj,
        faciliteRevente: a.faciliteRevente,
        decoteAnciennete: a.decoteAnciennete,
        tier: a.tier,
      })
    }
  }
  return { entries, overrides, added, skipped }
}

/** Clé de dossier unique : « cpu:ryzen-5-5600 ». */
export const itemKey = (entry) => `${entry.category}:${entry.id}`

/**
 * Doublons : même identifiant, ou même nom normalisé sous deux identifiants.
 * Renvoie la liste des groupes en conflit (jamais de suppression automatique).
 */
export function findDuplicates(entries) {
  const byId = new Map()
  const byName = new Map()
  for (const e of entries) {
    const idKey = `${e.category}:${e.id}`
    byId.set(idKey, [...(byId.get(idKey) ?? []), e])
    const nameKey = `${e.category}:${normalizeKey(e.nom)}`
    byName.set(nameKey, [...(byName.get(nameKey) ?? []), e])
  }
  const dups = []
  for (const [key, list] of byId) if (list.length > 1) dups.push({ type: 'id', key, ids: list.map((e) => `${e.origin}:${e.id}`) })
  for (const [key, list] of byName) {
    const distinctIds = new Set(list.map((e) => e.id))
    if (distinctIds.size > 1) dups.push({ type: 'nom', key, ids: list.map((e) => `${e.origin}:${e.id}`) })
  }
  return dups
}

/**
 * Contrôles de cohérence des fiches (valeurs seules, sans réseau).
 * `today` : AAAA-MM-JJ. `staleDays` : âge au-delà duquel un prix est obsolète.
 */
export function checkEntries(entries, overrides, { today, staleDays = 45 }) {
  const issues = []
  const todayMs = Date.parse(`${today}T00:00:00Z`)
  for (const e of entries) {
    const eff = overrides[e.category]?.[e.id]
    const min = eff?.min ?? e.baseMin
    const moyen = eff?.moyen ?? e.baseMoyen
    const max = eff?.max ?? e.baseMax
    const dateMaj = eff?.dateMaj ?? e.baseDateMaj
    const key = itemKey(e)
    if (![min, moyen, max].every((v) => Number.isFinite(v) && v > 0)) {
      issues.push({ key, nom: e.nom, kind: 'prix-absent', detail: 'prix manquant ou nul' })
      continue
    }
    if (!(min <= moyen && moyen <= max)) {
      issues.push({ key, nom: e.nom, kind: 'prix-incoherent', detail: `min ${min} / moyen ${moyen} / max ${max} non ordonnés` })
    }
    if (max / min > 4) {
      issues.push({ key, nom: e.nom, kind: 'prix-incoherent', detail: `fourchette trop large (${min}–${max} €)` })
    }
    const age = dateMaj ? Math.floor((todayMs - Date.parse(`${dateMaj}T00:00:00Z`)) / 86400000) : NaN
    if (!Number.isFinite(age)) {
      issues.push({ key, nom: e.nom, kind: 'prix-obsolete', detail: 'date de mise à jour absente ou illisible' })
    } else if (age > staleDays) {
      issues.push({ key, nom: e.nom, kind: 'prix-obsolete', detail: `prix vieux de ${age} jours (${dateMaj})` })
    }
    if (e.tier !== undefined && !(e.tier >= 1 && e.tier <= 5)) {
      issues.push({ key, nom: e.nom, kind: 'fiche-incoherente', detail: `tier ${e.tier} hors de 1..5` })
    }
  }
  // Fiches de prix orphelines : un identifiant de override sans composant.
  for (const [category, map] of Object.entries(overrides)) {
    const ids = new Set(entries.filter((e) => e.category === category).map((e) => e.id))
    for (const id of Object.keys(map)) {
      if (!ids.has(id)) issues.push({ key: `${category}:${id}`, nom: id, kind: 'override-orphelin', detail: 'fiche de prix sans composant correspondant' })
    }
  }
  return issues
}

/** Voisin le plus proche (même marque, prix proche) pour hériter d'attributs. */
export function nearestNeighbor(entries, { category, marque, moyen }, effectiveMoyen = (e) => e.baseMoyen) {
  const pool = entries.filter((e) => e.category === category && e.marque === marque && e.tier !== undefined)
  let best = null
  for (const e of pool) {
    const d = Math.abs(Math.log(effectiveMoyen(e) / moyen))
    if (!best || d < best.d) best = { e, d }
  }
  return best?.e ?? null
}
