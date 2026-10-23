// Outils de test : faux dépôt temporaire, fausse API eBay, horloge contrôlée.
import { cp, mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const REAL_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')

const entryTs = (e) => `  {
    id: '${e.id}',
    nom: '${e.nom}',
    marque: '${e.marque}',${e.socket ? `\n    socket: '${e.socket}',` : ''}${e.vramGo ? `\n    vramGo: ${e.vramGo},` : ''}
    min: ${e.min},
    moyen: ${e.moyen},
    max: ${e.max},
    dateMaj: '${e.dateMaj ?? '2026-10-01'}',
    faciliteRevente: ${e.faciliteRevente ?? 0.7},
    decoteAnciennete: ${e.decoteAnciennete ?? 1},
    tier: ${e.tier ?? 3},
  },`

export const CPU_FIXTURE = [
  { id: 'ryzen-5-5600', nom: 'AMD Ryzen 5 5600', marque: 'AMD', socket: 'AM4', min: 90, moyen: 110, max: 130, tier: 3 },
  { id: 'ryzen-5-7600', nom: 'AMD Ryzen 5 7600', marque: 'AMD', socket: 'AM5', min: 170, moyen: 200, max: 230, tier: 4 },
  { id: 'ryzen-7-7700', nom: 'AMD Ryzen 7 7700', marque: 'AMD', socket: 'AM5', min: 230, moyen: 260, max: 290, tier: 4 },
  { id: 'i5-12400f', nom: 'Intel Core i5-12400F', marque: 'Intel', socket: 'LGA1700', min: 90, moyen: 110, max: 130, tier: 3 },
]
export const GPU_FIXTURE = [
  { id: 'rtx-3060', nom: 'RTX 3060', marque: 'NVIDIA', vramGo: 12, min: 200, moyen: 230, max: 260, tier: 3 },
  { id: 'rx-6600', nom: 'RX 6600', marque: 'AMD', vramGo: 8, min: 130, moyen: 150, max: 170, tier: 3 },
]

/** Crée un faux dépôt avec un petit catalogue (les autres fichiers viennent du vrai dépôt). */
export async function makeRepo({ cpus = CPU_FIXTURE, gpus = GPU_FIXTURE, cpuOverrides = {}, gpuOverrides = {} } = {}) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'pcflip-agent-'))
  for (const rel of [
    'src/types/index.ts',
    'src/components/RamFields.tsx',
    'src/components/StorageList.tsx',
    'src/data/ram.ts',
    'src/data/storage.ts',
  ]) {
    await mkdir(path.dirname(path.join(root, rel)), { recursive: true })
    await cp(path.join(REAL_ROOT, rel), path.join(root, rel))
  }
  const ts = (name, list) => `const ${name}: X[] = [\n${list.map(entryTs).join('\n')}\n]\n\ninterface PriceOverride {\n  min: number\n}\n\nexport const Y = ${name}.map((c) => c)\n`
  await mkdir(path.join(root, 'src/data/priceOverrides'), { recursive: true })
  await writeFile(path.join(root, 'src/data/cpus.ts'), ts('BASE_CPUS', cpus))
  await writeFile(path.join(root, 'src/data/gpus.ts'), ts('BASE_GPUS', gpus))
  await writeFile(path.join(root, 'src/data/priceOverrides/cpuOverrides.json'), JSON.stringify(cpuOverrides, null, 2) + '\n')
  await writeFile(path.join(root, 'src/data/priceOverrides/gpuOverrides.json'), JSON.stringify(gpuOverrides, null, 2) + '\n')
  return root
}

export const read = (root, rel) => readFile(path.join(root, rel), 'utf8')
export const readJson = async (root, rel) => JSON.parse(await read(root, rel))

/** Snapshot de tous les fichiers de données (pour prouver « rien n'a changé »). */
export async function snapshot(root, rels) {
  const out = {}
  for (const rel of rels) out[rel] = await readFile(path.join(root, rel), 'utf8').catch(() => null)
  return out
}

export const DATA_FILES = [
  'src/data/priceOverrides/cpuOverrides.json',
  'src/data/priceOverrides/gpuOverrides.json',
  'src/data/agent/addedCpus.json',
  'src/data/agent/addedGpus.json',
  'src/data/agent/ramOverrides.json',
  'src/data/agent/storageOverrides.json',
  'src/data/agent/status.json',
  'PRICE_REVIEW.md',
]

/** Annonces pour un nom de composant : une par prix, vendeurs distincts. */
export function listings(nom, prices, { prefix = 'Processeur', seller = 's' } = {}) {
  return prices.map((price, i) => ({
    id: `${nom}-${i}`,
    title: `${prefix} ${nom} occasion`,
    price,
    currency: 'EUR',
    seller: `${seller}${i}`,
  }))
}

/**
 * Fausse API eBay. `table[query]` = { used: [...], new: [...] }, ou une
 * fonction (query, opts) => résultat. Compte les appels par requête.
 */
export function fakeEbay({ table = {}, pingOk = true, failAll = false, onSearch } = {}) {
  const calls = []
  const stats = { calls: 0, retries: 0, failures: 0, circuitOpen: false }
  return {
    calls,
    stats,
    async ping() {
      return pingOk ? { ok: true } : { ok: false, error: 'authentification eBay refusée (HTTP 401)', kind: 'auth' }
    },
    async search(query, opts = {}) {
      calls.push({ query, ...opts })
      stats.calls += 1
      if (onSearch) onSearch(query, opts)
      if (failAll) {
        stats.failures += 1
        return { ok: false, items: [], total: 0, error: 'HTTP 503', kind: 'http' }
      }
      const entry = table[query]
      const cond = opts.condition ?? 'used'
      const items = typeof entry === 'function' ? entry(query, opts) : (entry?.[cond] ?? [])
      return { ok: true, items, total: items.length }
    },
  }
}

/** Horloge contrôlée : chaque lecture avance de `stepMs`. */
export function fakeClock(iso, stepMs = 0) {
  let t = Date.parse(iso)
  return {
    now: () => {
      const d = new Date(t)
      t += stepMs
      return d
    },
    set: (nextIso) => {
      t = Date.parse(nextIso)
    },
    advance: (ms) => {
      t += ms
    },
  }
}

/** Prix de catalogue stables : un lot de 6 annonces proches de `moyen`. */
export const around = (moyen, n = 6) => Array.from({ length: n }, (_, i) => Math.round(moyen * (0.94 + i * 0.024)))
