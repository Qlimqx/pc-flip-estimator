// @vitest-environment node
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { checkEntries, findDuplicates, loadCatalogue, normalizeKey, parseBaseSource } from '../lib/catalogue.mjs'
import { checkFormCoverage } from '../lib/forms.mjs'
import { consensusVram, evaluateCandidate, extractModels, inheritSocket, makeId, tallyCandidates, confirmOnWikipedia } from '../lib/discovery.mjs'
import { filterRamListings, filterStorageListings, parseRates, ratePerGo } from '../lib/ramstorage.mjs'
import { REAL_ROOT, around, listings, makeRepo } from './helpers.mjs'

describe('catalogue réel du dépôt', () => {
  it('est lu en entier (aucune fiche ignorée) et sans doublon', async () => {
    const cat = await loadCatalogue(REAL_ROOT)
    expect(cat.skipped).toEqual([])
    expect(cat.entries.filter((e) => e.category === 'cpu').length).toBeGreaterThan(90)
    expect(cat.entries.filter((e) => e.category === 'gpu').length).toBeGreaterThan(100)
    expect(findDuplicates(cat.entries)).toEqual([])
  })

  it('les listes du formulaire correspondent aux types et aux tarifs', async () => {
    const read = (rel) => readFile(path.join(REAL_ROOT, rel), 'utf8')
    const issues = checkFormCoverage({
      types: await read('src/types/index.ts'),
      ramFields: await read('src/components/RamFields.tsx'),
      storageList: await read('src/components/StorageList.tsx'),
      ram: await read('src/data/ram.ts'),
      storage: await read('src/data/storage.ts'),
    })
    expect(issues).toEqual([])
  })

  it('détecte une capacité du type absente du formulaire et un type sans tarif', () => {
    const issues = checkFormCoverage({
      types: "export type RamCapacity = 4 | 8 | 16\nexport type StorageCapacity = 120 | 240\nexport type RamType = 'ddr3' | 'ddr4'\nexport type StorageType = 'hdd' | 'ssd'",
      ramFields: 'const CAPACITIES: RamCapacity[] = [4, 8]',
      storageList: 'const CAPACITIES: StorageCapacity[] = [120, 240]',
      ram: 'export const RAM_TYPE_PRICING = {\n  ddr3: {\n  prixParGo: 1,\n  },\n}',
      storage: 'export const STORAGE_TYPE_PRICING = {\n  hdd: {\n  prixParGo: 1,\n  },\n  ssd: {\n  prixParGo: 1,\n  },\n}',
    })
    const text = issues.map((i) => i.detail).join(' | ')
    expect(text).toMatch(/capacités RAM du type absentes du formulaire : 16/)
    expect(text).toMatch(/types de RAM sans tarif : ddr4/)
  })
})

describe('analyse du catalogue', () => {
  it('normalise les noms de façon stable', () => {
    expect(normalizeKey('Intel Core i5-14400F')).toBe(normalizeKey('i5 14400f'))
    expect(normalizeKey('AMD Ryzen 5 7600X')).toBe('ryzen57600x')
    expect(normalizeKey('RTX 4070 Ti Super')).toBe('rtx4070tisuper')
  })

  it('signale une fiche incomplète au lieu de la perdre', () => {
    const src = "const BASE_CPUS = [\n  { id: 'a', nom: 'A', min: 1, moyen: 2, max: 3 },\n  { id: 'b', nom: 'B', min: 1 },\n]\nexport const X = 1"
    const r = parseBaseSource(src, 'BASE_CPUS', 'cpu')
    expect(r.entries.map((e) => e.id)).toEqual(['a'])
    expect(r.skipped).toEqual(['b'])
  })

  it('détecte les doublons par identifiant et par nom normalisé', () => {
    const e = (id, nom, origin = 'base') => ({ id, nom, category: 'cpu', origin })
    const dups = findDuplicates([e('a', 'Intel Core i5-14400F'), e('b', 'i5 14400f', 'agent'), e('c', 'X'), e('c', 'Y')])
    expect(dups.map((d) => d.type).sort()).toEqual(['id', 'nom'])
  })

  it('repère prix absents, obsolètes, incohérents et fiches de prix orphelines', () => {
    const base = (id, min, moyen, max, dateMaj) => ({ id, nom: id, category: 'cpu', baseMin: min, baseMoyen: moyen, baseMax: max, baseDateMaj: dateMaj, tier: 3 })
    const issues = checkEntries(
      [base('ok', 90, 100, 110, '2026-10-20'), base('vieux', 90, 100, 110, '2026-06-01'), base('zero', 0, 0, 0, '2026-10-20'), base('ordre', 120, 100, 110, '2026-10-20')],
      { cpu: { fantome: { min: 1, moyen: 2, max: 3, dateMaj: '2026-10-20' } }, gpu: {} },
      { today: '2026-10-24' },
    )
    const kinds = issues.map((i) => `${i.key}:${i.kind}`).sort()
    expect(kinds).toEqual(['cpu:fantome:override-orphelin', 'cpu:ordre:prix-incoherent', 'cpu:vieux:prix-obsolete', 'cpu:zero:prix-absent'])
  })

  it('un JSON corrompu est fatal (on ne travaille jamais sur un catalogue partiel)', async () => {
    const root = await makeRepo()
    const { writeFile } = await import('node:fs/promises')
    await writeFile(path.join(root, 'src/data/priceOverrides/cpuOverrides.json'), '{ pas du json')
    await expect(loadCatalogue(root)).rejects.toThrow(/corrompu/)
  })
})

describe('extraction des modèles', () => {
  it('reconnaît les modèles desktop et ignore les variantes portables', () => {
    const names = (t) => extractModels(t).map((m) => m.nom)
    expect(names('Processeur Intel Core i5-14400F LGA1700')).toEqual(['Intel Core i5-14400F'])
    expect(names('AMD Ryzen 7 7800X3D AM5')).toEqual(['AMD Ryzen 7 7800X3D'])
    expect(names('Intel Core Ultra 7 265K')).toEqual(['Intel Core Ultra 7 265K'])
    expect(names('Carte graphique RTX 4070 Ti Super 16Go')).toEqual(['RTX 4070 Ti Super'])
    expect(names('Sapphire RX 7600 XT 16GB')).toEqual(['RX 7600 XT'])
    expect(names('Intel Arc B580 12GB')).toEqual(['Intel Arc B580'])
    expect(names('Portable Core i7-1165G7')).toEqual([]) // mobile
    expect(names('AMD Ryzen 7 7840HS')).toEqual([])
    expect(names('Core i7-12700H')).toEqual([])
  })

  it('génère des identifiants cohérents avec le catalogue', () => {
    expect(makeId('Intel Core i5-14400F')).toBe('i5-14400f')
    expect(makeId('AMD Ryzen 5 7600X')).toBe('ryzen-5-7600x')
    expect(makeId('Intel Core Ultra 5 245K')).toBe('core-ultra-5-245k')
    expect(makeId('RTX 4070 Ti Super')).toBe('rtx-4070-ti-super')
    expect(makeId('Intel Arc B580')).toBe('arc-b580')
  })

  it('un modèle présent sous une autre graphie n\'est pas candidat (pas de doublon)', () => {
    const known = new Set(['cpu:i514400f'])
    const items = [{ id: '1', title: 'i5 14400F boxed', seller: 'a' }, { id: '2', title: 'Core i7-13700K', seller: 'b' }]
    const tally = tallyCandidates(items, known)
    expect(tally.map((c) => c.nom)).toEqual(['Intel Core i7-13700K'])
  })

  it('hérite le socket seulement si les voisins s\'accordent', () => {
    const entries = [
      { category: 'cpu', marque: 'AMD', nom: 'AMD Ryzen 5 7600', socket: 'AM5' },
      { category: 'cpu', marque: 'AMD', nom: 'AMD Ryzen 7 7700', socket: 'AM5' },
      { category: 'cpu', marque: 'Intel', nom: 'Intel Core i5-12400F', socket: 'LGA1700' },
      { category: 'cpu', marque: 'Intel', nom: 'Intel Core i5-12600K', socket: 'LGA1700' },
      { category: 'cpu', marque: 'Intel', nom: 'Intel Core i5-13400F', socket: 'LGA1700' },
      { category: 'cpu', marque: 'Intel', nom: 'Intel Core i7-2600K', socket: 'LGA1155' },
    ]
    expect(inheritSocket({ marque: 'AMD', nom: 'AMD Ryzen 5 7600X' }, entries)).toBe('AM5')
    expect(inheritSocket({ marque: 'Intel', nom: 'Intel Core i5-12500' }, entries)).toBe('LGA1700')
    expect(inheritSocket({ marque: 'AMD', nom: 'AMD Ryzen 5 5600X' }, entries)).toBeUndefined()
  })

  it('ne retient la VRAM que sur consensus', () => {
    expect(consensusVram(['RX 7600 XT 16Go', 'RX 7600 XT 16 GB', 'RX 7600 XT 16GB', 'RX 7600 XT'])).toBe(16)
    expect(consensusVram(['RTX 3060 12Go', 'RTX 3060 8Go', 'RTX 3060 12Go', 'RTX 3060 8GB'])).toBeUndefined()
    expect(consensusVram(['RTX 3060 12Go'])).toBeUndefined()
  })
})

describe('évaluation d\'un composant manquant', () => {
  const nom = 'AMD Ryzen 5 7600X'
  const candidate = { category: 'cpu', marque: 'AMD', nom, modelCore: 'Ryzen 5 7600X', listingCount: 9, sellerCount: 6, titles: [] }
  const entries = [
    { id: 'ryzen-5-7600', nom: 'AMD Ryzen 5 7600', category: 'cpu', marque: 'AMD', socket: 'AM5', baseMoyen: 200, tier: 4, faciliteRevente: 0.8, decoteAnciennete: 1.05 },
    { id: 'ryzen-7-7700', nom: 'AMD Ryzen 7 7700', category: 'cpu', marque: 'AMD', socket: 'AM5', baseMoyen: 260, tier: 4, faciliteRevente: 0.75, decoteAnciennete: 1.05 },
  ]
  const search = (usedPrices, newPrices = []) => async (_q, { condition }) => ({
    ok: true,
    items: listings(nom, condition === 'new' ? newPrices : usedPrices),
    total: 0,
  })
  const wiki = (res) => async () => res
  const run = (over = {}) =>
    evaluateCandidate(over.candidate ?? candidate, {
      search: over.search ?? search(around(210), around(280)),
      confirm: over.confirm ?? wiki({ ok: true, confirmed: true, source: 'en.wikipedia.org' }),
      entries,
      today: '2026-10-24',
    })

  it('ajoute quand toutes les preuves sont réunies, avec attributs estimés signalés', async () => {
    const v = await run()
    expect(v.verdict).toBe('ajouter')
    expect(v.record).toMatchObject({ id: 'ryzen-5-7600x', nom, marque: 'AMD', socket: 'AM5', dateMaj: '2026-10-24' })
    expect(v.record.agent.attributsEstimes).toEqual(expect.arrayContaining(['tier', 'faciliteRevente', 'decoteAnciennete', 'socket']))
    expect(v.record.agent.sources).toHaveLength(2)
  })

  it('refuse sur preuve insuffisante : peu d\'annonces, un seul vendeur, pas de confirmation', async () => {
    expect((await run({ candidate: { ...candidate, listingCount: 3 } })).verdict).toBe('verifier')
    expect((await run({ candidate: { ...candidate, sellerCount: 1 } })).verdict).toBe('verifier')
    const noWiki = await run({ confirm: wiki({ ok: true, confirmed: false }) })
    expect(noWiki.verdict).toBe('verifier')
    expect(noWiki.reasons[0]).toMatch(/non confirmé/)
  })

  it('refuse si la source de confirmation est injoignable (réessayable, jamais ajouté)', async () => {
    const v = await run({ confirm: wiki({ ok: false, confirmed: false }) })
    expect(v.verdict).toBe('verifier')
    expect(v.retryable).toBe(true)
  })

  it('refuse un prix d\'occasion incohérent avec le neuf ou inexploitable', async () => {
    expect((await run({ search: search(around(300), around(200)) })).verdict).toBe('verifier')
    expect((await run({ search: search([200, 210]) })).verdict).toBe('verifier')
  })
})

describe('confirmation Wikipédia', () => {
  const resp = (snippets) => async () => ({ ok: true, json: async () => ({ query: { search: snippets.map((s) => ({ title: 'Page', snippet: s })) } }) })
  it('confirme un modèle exact, pas un modèle voisin', async () => {
    const f = resp(['AMD <span class="searchmatch">Ryzen</span> 5 7600X Review'])
    expect((await confirmOnWikipedia('Ryzen 5 7600X', { fetchImpl: f })).confirmed).toBe(true)
    expect((await confirmOnWikipedia('Ryzen 5 7600', { fetchImpl: f })).confirmed).toBe(false) // suffixe X collé
  })
  it('distingue « introuvable » de « source injoignable »', async () => {
    expect(await confirmOnWikipedia('Ryzen 5 9999Z', { fetchImpl: resp([]) })).toMatchObject({ ok: true, confirmed: false })
    const down = async () => {
      throw new Error('réseau')
    }
    expect(await confirmOnWikipedia('Ryzen 5 7600X', { fetchImpl: down })).toMatchObject({ ok: false, confirmed: false })
  })
})

describe('tarifs RAM et stockage', () => {
  const item = (title, price) => ({ title, price })
  it('écarte kits, portables et barrettes d\'une autre génération', () => {
    const kept = filterRamListings(
      [
        item('Barrette RAM DDR4 16 Go PC4-25600', 50),
        item('Kit RAM DDR4 2x8 Go', 60),
        item('RAM DDR4 16Go SO-DIMM portable', 40),
        item('RAM DDR5 16 Go', 90),
        item('RAM DDR4 32 Go', 80),
      ],
      'ddr4',
      16,
    )
    expect(kept.map((i) => i.price)).toEqual([50])
  })

  it('distingue NVMe, SSD SATA et HDD, et écarte les disques externes', () => {
    const items = [
      item('SSD NVMe M.2 1 To Samsung', 90),
      item('SSD SATA 2.5 1 To Crucial', 70),
      item('Disque dur HDD 3.5 1 To Seagate', 25),
      item('SSD externe USB 1 To', 80),
    ]
    expect(filterStorageListings(items, 'nvme', 1000).map((i) => i.price)).toEqual([90])
    expect(filterStorageListings(items, 'ssd', 1000).map((i) => i.price)).toEqual([70])
    expect(filterStorageListings(items, 'hdd', 1000).map((i) => i.price)).toEqual([25])
  })

  it('calcule un tarif au Go à partir de plusieurs capacités', () => {
    const mk = (prices) => prices.map((price) => ({ price }))
    const r = ratePerGo({ 8: mk([30, 32, 34, 36, 38]), 16: mk([60, 64, 68, 72, 76]) })
    expect(r.moyen).toBeCloseTo(4.25, 1)
    expect(ratePerGo({ 8: mk([30, 32, 34, 36, 38]), 16: mk([60]) })).toBeNull() // une seule capacité exploitable
  })

  it('relit les tarifs de base depuis les sources', async () => {
    const src = await readFile(path.join(REAL_ROOT, 'src/data/ram.ts'), 'utf8')
    const rates = parseRates(src, ['ddr3', 'ddr4', 'ddr5'])
    expect(Object.keys(rates)).toEqual(['ddr3', 'ddr4', 'ddr5'])
    expect(rates.ddr4).toBeGreaterThan(0)
  })
})
