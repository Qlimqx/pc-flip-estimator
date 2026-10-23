// Tarifs €/Go de la RAM (DDR3/4/5) et du stockage (HDD, SSD SATA, NVMe).
//
// L'application ne stocke pas une fiche par barrette ou par disque mais un
// tarif au Go par type (src/data/ram.ts, storage.ts). L'agent mesure ce tarif
// sur des annonces eBay d'occasion à capacités repères, en écartant les kits,
// les formats portables/serveur, les disques externes et les lots. Les prix
// sont des prix DEMANDÉS, pas des prix de vente.

import { summarizePrices, round2 } from '../../lib/pricing.mjs'

// Capacités repères par type (Go). Le résultat est la médiane des tarifs au
// Go des capacités pour lesquelles le prix est exploitable.
export const RAM_PROBES = {
  ddr3: [4, 8],
  ddr4: [8, 16, 32],
  ddr5: [16, 32],
}
export const STORAGE_PROBES = {
  hdd: [1000, 2000],
  ssd: [256, 512, 1000],
  nvme: [512, 1000],
}

const RAM_EXCLUDE = /so-?dimm|portable|laptop|notebook|\bmac\b|serveur|server|\becc\b|rdimm|\bregistered|\blot\b|\bkit\b|lot de|\bx\s?\d\b|\d\s?x\s?\d/i
const STORAGE_EXCLUDE = /extern|usb|bo[iî]tier|enclosure|\bmac\b|ps[45]\b|xbox|serveur|server|\bsas\b|raid|\blot\b|lot de|\d\s?x\s?\d|\bx\s?\d\b|portable|laptop|carte m[eè]re/i

const capRegex = (goValue) => {
  if (goValue >= 1000 && goValue % 1000 === 0) {
    const to = goValue / 1000
    return new RegExp(`(?<![\\d.,])${to}\\s?(to|tb)\\b|(?<![\\d.,])${goValue}\\s?(go|gb)\\b`, 'i')
  }
  return new RegExp(`(?<![\\d.,])${goValue}\\s?(go|gb|g)\\b`, 'i')
}

export function ramQuery(type, capacityGo) {
  return `barrette RAM ${type.toUpperCase()} ${capacityGo} Go`
}

export function storageQuery(type, capacityGo) {
  const cap = capacityGo >= 1000 ? `${capacityGo / 1000} To` : `${capacityGo} Go`
  if (type === 'nvme') return `SSD NVMe M.2 ${cap}`
  if (type === 'ssd') return `SSD SATA 2.5 ${cap}`
  return `disque dur HDD 3.5 ${cap}`
}

/** Garde les annonces d'une barrette seule du bon type et de la bonne capacité. */
export function filterRamListings(items, type, capacityGo) {
  const others = ['ddr3', 'ddr4', 'ddr5'].filter((t) => t !== type)
  const cap = capRegex(capacityGo)
  return items.filter((i) => {
    const t = String(i.title ?? '').toLowerCase()
    return t.includes(type) && !others.some((o) => t.includes(o)) && cap.test(t) && !RAM_EXCLUDE.test(t)
  })
}

export function filterStorageListings(items, type, capacityGo) {
  const cap = capRegex(capacityGo)
  return items.filter((i) => {
    const t = String(i.title ?? '').toLowerCase()
    if (!cap.test(t) || STORAGE_EXCLUDE.test(t)) return false
    const nvme = /nvme|m\.?2/.test(t)
    const ssd = /\bssd\b/.test(t)
    const hdd = /\bhdd\b|disque dur|barracuda|\bironwolf\b|\bwd blue\b|3[.,]5/.test(t)
    if (type === 'nvme') return nvme && ssd
    if (type === 'ssd') return ssd && !nvme && !hdd
    return hdd && !ssd && !nvme
  })
}

/**
 * Tarif €/Go pour un type à partir de { capacité -> annonces filtrées }.
 * Exige au moins 2 capacités exploitables (ou 1 s'il n'y en a qu'une sonde).
 */
export function ratePerGo(byCapacity, { minCapacities = 2 } = {}) {
  const perGo = []
  let samples = 0
  for (const [cap, items] of Object.entries(byCapacity)) {
    const stats = summarizePrices(items.map((i) => i.price))
    if (!stats) continue
    perGo.push(stats.moyen / Number(cap))
    samples += stats.sampleCount
  }
  if (perGo.length < minCapacities) return null
  const sorted = [...perGo].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  const med = sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
  return { moyen: Math.round(med * 10000) / 10000, sampleCount: samples, capacities: perGo.length, moyenArrondi: round2(med) }
}

/** Relit les tarifs de base depuis ram.ts / storage.ts (regex sur le source). */
export function parseRates(src, types) {
  const rates = {}
  for (const type of types) {
    const m = src.match(new RegExp(`\\b${type}:\\s*\\{[^}]*?prixParGo:\\s*([\\d.]+)`))
    if (m) rates[type] = Number(m[1])
  }
  return rates
}
