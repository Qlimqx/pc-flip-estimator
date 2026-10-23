// @vitest-environment node
// Tests d'intégration de l'agent complet sur un faux dépôt temporaire, avec une
// fausse API eBay et une horloge contrôlée. Aucun appel réseau réel.
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { runAgent } from '../run.mjs'
import { CPU_FIXTURE, DATA_FILES, GPU_FIXTURE, around, fakeClock, fakeEbay, listings, makeRepo, read, readJson, snapshot } from './helpers.mjs'

const CATALOG = [
  ...CPU_FIXTURE.map((e) => ({ ...e, prefix: 'Processeur' })),
  ...GPU_FIXTURE.map((e) => ({ ...e, prefix: 'Carte graphique' })),
]
const OVERRIDE_FILES = ['src/data/priceOverrides/cpuOverrides.json', 'src/data/priceOverrides/gpuOverrides.json']
const NOT_CONFIRMED = async () => ({ ok: true, confirmed: false })
const START = '2026-10-24T04:30:00Z' // 06:30 à Paris (heure d'été)

/** Annonces d'occasion proches de moyen × factor, annonces neuves à moyen × 1,6. */
function standardTable(factor = 1.05, perId = {}) {
  const t = {}
  for (const e of CATALOG) {
    const f = perId[e.id] ?? factor
    t[e.nom] = {
      used: listings(e.nom, around(e.moyen * f), { prefix: e.prefix }),
      new: listings(e.nom, around(e.moyen * 1.6), { prefix: e.prefix }),
    }
  }
  return t
}

async function run(root, ebay, { iso = START, step = 0, clock, ...opts } = {}) {
  const c = clock ?? fakeClock(iso, step)
  const res = await runAgent({ root, ebay, now: c.now, env: {}, confirm: NOT_CONFIRMED, log: () => {}, ...opts })
  return { res, clock: c }
}

describe('agent : exécution normale', () => {
  it('met à jour les prix, écrit rapport, historique et état, et termine sans avertissement', async () => {
    const root = await makeRepo()
    const { res } = await run(root, fakeEbay({ table: standardTable(1.05) }))
    expect(res.status).toBe('termine')
    expect(res.exitCode).toBe(0)
    const cpu = await readJson(root, 'src/data/priceOverrides/cpuOverrides.json')
    expect(Object.keys(cpu).sort()).toEqual(['i5-12400f', 'ryzen-5-5600', 'ryzen-5-7600', 'ryzen-7-7700'])
    expect(cpu['ryzen-5-5600'].moyen).toBeGreaterThan(110)
    expect(cpu['ryzen-5-5600'].dateMaj).toBe('2026-10-24')
    const report = await readJson(root, 'agent-data/reports/2026-10-24.json')
    expect(report).toMatchObject({ date: '2026-10-24', status: 'termine', finishedBeforeTenParis: true, startedInWindow: true })
    expect(report.counts).toMatchObject({ catalogue: 6, verified: 6, updated: 6, unprocessed: 0, rejected: 0 })
    const md = await read(root, 'agent-data/reports/2026-10-24.md')
    expect(md).toContain('Rapport de l\'agent quotidien — 2026-10-24')
    expect(md).toContain('Terminé avant 10 h (Paris) : oui')
    const history = (await read(root, 'agent-data/history/2026-10.jsonl')).trim().split('\n')
    expect(history).toHaveLength(6)
    const state = await readJson(root, 'agent-data/state.json')
    expect(state.items['cpu:ryzen-5-5600']).toMatchObject({ checkedOn: '2026-10-24', lastVerifiedOn: '2026-10-24', status: 'mis-a-jour' })
    expect(state.items['cpu:ryzen-5-5600'].neuf.moyen).toBeGreaterThan(150)
    expect(await readJson(root, 'src/data/agent/status.json')).toMatchObject({ date: '2026-10-24', status: 'termine', verified: 6 })
  })

  it('ne touche jamais les données de base (cpus.ts / gpus.ts)', async () => {
    const root = await makeRepo()
    const before = await snapshot(root, ['src/data/cpus.ts', 'src/data/gpus.ts'])
    await run(root, fakeEbay({ table: standardTable(1.05) }))
    expect(await snapshot(root, ['src/data/cpus.ts', 'src/data/gpus.ts'])).toEqual(before)
  })

  it('mode simulation (--dry-run) : aucune écriture', async () => {
    const root = await makeRepo()
    const before = await snapshot(root, DATA_FILES)
    const { res } = await run(root, fakeEbay({ table: standardTable(1.05) }), { dryRun: true })
    expect(res.report.counts.updated).toBe(6)
    expect(await snapshot(root, DATA_FILES)).toEqual(before)
    await expect(read(root, 'agent-data/reports/2026-10-24.json')).rejects.toThrow()
  })
})

describe('agent : idempotence et reprise', () => {
  it('une seconde exécution le même jour ne fait rien (aucun appel, aucun fichier modifié)', async () => {
    const root = await makeRepo()
    await run(root, fakeEbay({ table: standardTable(1.05) }))
    const before = await snapshot(root, [...DATA_FILES, 'agent-data/state.json', 'agent-data/history/2026-10.jsonl'])
    const second = fakeEbay({ table: standardTable(1.3) })
    const { res } = await run(root, second, { iso: '2026-10-24T06:00:00Z' })
    expect(res.status).toBe('deja-fait')
    expect(second.calls).toHaveLength(0)
    expect(await snapshot(root, [...DATA_FILES, 'agent-data/state.json', 'agent-data/history/2026-10.jsonl'])).toEqual(before)
  })

  it('un relancement forcé n\'applique pas deux fois les mêmes prix et ne duplique pas l\'historique', async () => {
    const root = await makeRepo()
    await run(root, fakeEbay({ table: standardTable(1.05) }))
    const before = await snapshot(root, [...OVERRIDE_FILES, 'agent-data/history/2026-10.jsonl'])
    const again = fakeEbay({ table: standardTable(1.05) })
    const { res } = await run(root, again, { force: true, iso: '2026-10-24T06:00:00Z' })
    expect(res.status).toBe('termine')
    expect(await snapshot(root, [...OVERRIDE_FILES, 'agent-data/history/2026-10.jsonl'])).toEqual(before)
    expect(again.calls.filter((c) => CATALOG.some((e) => e.nom === c.query))).toHaveLength(0) // déjà vérifiés aujourd'hui
  })

  it('reprise après interruption : seuls les composants restants sont traités', async () => {
    const root = await makeRepo()
    const clock = fakeClock(START)
    let searches = 0
    const interrupted = fakeEbay({
      table: standardTable(1.05),
      onSearch: () => {
        searches += 1
        if (searches === 4) clock.set('2026-10-24T07:40:00Z') // 09:40 Paris : plus de temps pour vérifier
      },
    })
    const first = await run(root, interrupted, { clock })
    expect(first.res.status).toBe('partiel')
    expect(first.res.exitCode).toBe(1)
    expect(first.res.report.counts.unprocessed).toBeGreaterThan(0)
    expect(first.res.report.counts.verified).toBeGreaterThan(0)
    const doneFirst = first.res.report.counts.verified
    const stateAfterFirst = await readJson(root, 'agent-data/state.json')
    expect(Object.values(stateAfterFirst.items).filter((i) => i.checkedOn === '2026-10-24')).toHaveLength(doneFirst)

    const resumed = fakeEbay({ table: standardTable(1.05) })
    const second = await run(root, resumed, { iso: '2026-10-24T05:10:00Z' })
    expect(second.res.status).toBe('termine')
    const queried = new Set(resumed.calls.filter((c) => c.condition === 'used').map((c) => c.query))
    const verifiedFirst = Object.entries(stateAfterFirst.items).filter(([, v]) => v.checkedOn === '2026-10-24').map(([k]) => k.split(':')[1])
    for (const id of verifiedFirst) expect(queried.has(CATALOG.find((e) => e.id === id).nom)).toBe(false)
    expect(second.res.report.counts.catalogue).toBe(6)
    const history = (await read(root, 'agent-data/history/2026-10.jsonl')).trim().split('\n')
    expect(new Set(history).size).toBe(history.length)
    expect(history).toHaveLength(6)
  })

  it('exécution simultanée refusée : le verrou protège les données', async () => {
    const root = await makeRepo()
    await writeFile(path.join(root, '.agent-lock'), JSON.stringify({ owner: 'autre-run', at: Date.parse(START) }))
    const before = await snapshot(root, DATA_FILES)
    const ebay = fakeEbay({ table: standardTable(1.05) })
    const { res } = await run(root, ebay)
    expect(res.status).toBe('deja-en-cours')
    expect(ebay.calls).toHaveLength(0)
    expect(await snapshot(root, DATA_FILES)).toEqual(before)
  })
})

describe('agent : sources indisponibles', () => {
  it('source en panne : aucune donnée modifiée, statut partiel, reprise réussie ensuite', async () => {
    const root = await makeRepo()
    const before = await snapshot(root, OVERRIDE_FILES)
    const { res } = await run(root, fakeEbay({ failAll: true }))
    expect(res.status).toBe('partiel')
    expect(res.report.counts).toMatchObject({ verified: 0, updated: 0, sourceUnavailable: 6, ramStorageUnavailable: 6, unprocessed: 12 })
    expect(await snapshot(root, OVERRIDE_FILES)).toEqual(before)
    expect(res.report.warnings.join(' ')).toMatch(/source indisponible/)
    // la source revient : le même jour, l'agent reprend et termine
    const { res: res2 } = await run(root, fakeEbay({ table: standardTable(1.05) }), { iso: '2026-10-24T05:30:00Z' })
    expect(res2.status).toBe('termine')
    expect(res2.report.counts.verified).toBe(6)
  })

  it('authentification refusée : échec explicite, rapport écrit, prix intacts', async () => {
    const root = await makeRepo()
    const before = await snapshot(root, OVERRIDE_FILES)
    const { res } = await run(root, fakeEbay({ pingOk: false }))
    expect(res.status).toBe('echec')
    expect(res.exitCode).toBe(1)
    expect(await snapshot(root, OVERRIDE_FILES)).toEqual(before)
    const report = await readJson(root, 'agent-data/reports/2026-10-24.json')
    expect(report.fatal).toMatch(/inaccessible/)
    expect(report.sources[0]).toMatchObject({ status: 'indisponible' })
    await expect(read(root, 'src/data/agent/status.json')).rejects.toThrow() // le dernier bon statut n'est pas écrasé
  })

  it('disjoncteur ouvert en cours de route : composants restants non traités, jamais « terminé »', async () => {
    const root = await makeRepo()
    const ebay = fakeEbay({ table: standardTable(1.05), onSearch: () => {} })
    let n = 0
    const original = ebay.search.bind(ebay)
    ebay.search = async (q, o) => {
      n += 1
      if (n === 5) ebay.stats.circuitOpen = true
      return original(q, o)
    }
    const { res } = await run(root, ebay)
    expect(res.status).toBe('partiel')
    expect(res.report.counts.unprocessed).toBeGreaterThan(0)
    expect(res.report.warnings.join(' ')).toMatch(/non traités/)
  })

  it('catalogue illisible : échec sans toucher aux données', async () => {
    const root = await makeRepo()
    await writeFile(path.join(root, 'src/data/priceOverrides/gpuOverrides.json'), '{ cassé')
    const before = await snapshot(root, OVERRIDE_FILES)
    const { res } = await run(root, fakeEbay({ table: standardTable(1.05) }))
    expect(res.status).toBe('echec')
    expect(await snapshot(root, OVERRIDE_FILES)).toEqual(before)
  })
})

describe('agent : prix aberrants', () => {
  it('rejette un prix à +200 %, garde la valeur, le consigne pour relecture', async () => {
    const root = await makeRepo()
    const { res } = await run(root, fakeEbay({ table: standardTable(1.05, { 'ryzen-5-5600': 3 }) }))
    expect(res.status).toBe('termine_avec_avertissements')
    const cpu = await readJson(root, 'src/data/priceOverrides/cpuOverrides.json')
    expect(cpu['ryzen-5-5600']).toBeUndefined() // valeur de base conservée
    expect(cpu['ryzen-5-7600']).toBeDefined() // les autres sont bien mis à jour
    expect(res.report.counts.rejected).toBe(1)
    expect(res.report.manualReview).toEqual(expect.arrayContaining([expect.objectContaining({ kind: 'prix-rejete', nom: 'AMD Ryzen 5 5600' })]))
    const review = await read(root, 'PRICE_REVIEW.md')
    expect(review).toContain('## 2026-10-24 (agent quotidien)')
    expect(review).toContain('### Rejetés (écart trop important, valeur inchangée)')
    expect(review).toContain('AMD Ryzen 5 5600')
  })

  it('un prix d\'occasion supérieur au neuf est refusé', async () => {
    const root = await makeRepo()
    const table = standardTable(1.05)
    table['RTX 3060'].new = listings('RTX 3060', around(150), { prefix: 'Carte graphique' }) // neuf à 150 < occasion à 240
    const { res } = await run(root, fakeEbay({ table }))
    const gpu = await readJson(root, 'src/data/priceOverrides/gpuOverrides.json')
    expect(gpu['rtx-3060']).toBeUndefined()
    expect(res.report.counts.rejected).toBe(1)
  })

  it('un saut de prix > 15 % attend sa confirmation du lendemain', async () => {
    const root = await makeRepo()
    const table = standardTable(1.05, { 'ryzen-5-5600': 1.3 })
    const day1 = await run(root, fakeEbay({ table }))
    expect((await readJson(root, 'src/data/priceOverrides/cpuOverrides.json'))['ryzen-5-5600']).toBeUndefined()
    expect(day1.res.report.counts.pending).toBe(1)
    const day2 = await run(root, fakeEbay({ table }), { iso: '2026-10-25T04:30:00Z' })
    const applied = (await readJson(root, 'src/data/priceOverrides/cpuOverrides.json'))['ryzen-5-5600']
    expect(applied.moyen).toBeGreaterThan(135)
    expect(applied.dateMaj).toBe('2026-10-25')
    expect(day2.res.report.counts.updatedToReview).toBe(1) // +30 % de la base : à relire
  })

  it('données insuffisantes : valeur conservée, pas d\'erreur', async () => {
    const root = await makeRepo()
    const table = standardTable(1.05)
    table['RX 6600'].used = listings('RX 6600', [140, 150], { prefix: 'Carte graphique' })
    const { res } = await run(root, fakeEbay({ table }))
    expect(res.status).toBe('termine')
    expect(res.report.counts.insufficient).toBe(1)
    expect((await readJson(root, 'src/data/priceOverrides/gpuOverrides.json'))['rx-6600']).toBeUndefined()
  })
})

describe('agent : erreurs d\'écriture', () => {
  it('échec de l\'écriture finale : rien n\'est modifié et l\'échec est déclaré', async () => {
    const root = await makeRepo()
    const before = await snapshot(root, [...DATA_FILES, 'agent-data/state.json'])
    const { res } = await run(root, fakeEbay({ table: standardTable(1.05) }), {
      fsOps: { rename: async () => { throw new Error('EPERM simulé') } },
    })
    expect(res.status).toBe('echec')
    expect(res.exitCode).toBe(1)
    expect(res.report.errors.join(' ')).toMatch(/écriture finale impossible/)
    expect(await snapshot(root, [...DATA_FILES, 'agent-data/state.json'])).toEqual(before)
  })
})

describe('agent : heure de Paris et échéance de 10 h', () => {
  it('démarrage dans la fenêtre : échéance 09:45 Paris (été et hiver)', async () => {
    const long = { AGENT_MAX_MINUTES: '600' }
    const summer = await run(await makeRepo(), fakeEbay({ table: standardTable(1.05) }), { iso: '2026-07-15T04:30:00Z', env: long })
    expect(summer.res.report.date).toBe('2026-07-15')
    expect(summer.res.report.startedParis).toBe('2026-07-15 06:30 (Paris)')
    expect(summer.res.report.deadlineParis).toBe('2026-07-15 09:45 (Paris)')
    expect(summer.res.report.windowEndParis).toBe('2026-07-15 09:45 (Paris)')
    const winter = await run(await makeRepo(), fakeEbay({ table: standardTable(1.05) }), { iso: '2026-01-15T05:30:00Z', env: long })
    expect(winter.res.report.startedParis).toBe('2026-01-15 06:30 (Paris)')
    expect(winter.res.report.deadlineParis).toBe('2026-01-15 09:45 (Paris)')
    expect(winter.res.report.finishedBeforeTenParis).toBe(true)
  })

  it('le jour d\'exécution est le jour parisien (00:30 à Paris = veille UTC)', async () => {
    const { res } = await run(await makeRepo(), fakeEbay({ table: standardTable(1.05) }), { iso: '2026-07-14T22:30:00Z' })
    expect(res.report.date).toBe('2026-07-15')
  })

  it('démarrage tardif (hors fenêtre) : avertissement explicite, jamais « terminé » simple', async () => {
    const { res } = await run(await makeRepo(), fakeEbay({ table: standardTable(1.05) }), { iso: '2026-10-24T09:30:00Z' }) // 11:30 Paris
    expect(res.status).toBe('termine_avec_avertissements')
    expect(res.report.startedInWindow).toBe(false)
    expect(res.report.warnings.join(' ')).toMatch(/démarrée après 09:45/)
  })

  it('dépassement de 10 h rendu visible', async () => {
    const root = await makeRepo()
    const clock = fakeClock('2026-10-24T07:44:00Z') // 09:44 Paris
    let n = 0
    const ebay = fakeEbay({
      table: standardTable(1.05),
      onSearch: () => {
        n += 1
        if (n === 1) clock.set('2026-10-24T08:05:00Z') // 10:05 Paris
      },
    })
    const { res } = await run(root, ebay, { clock, env: { AGENT_WINDOW_END: '09:59' } })
    expect(res.report.finishedBeforeTenParis).toBe(false)
    expect(res.report.warnings.join(' ')).toMatch(/DÉPASSEMENT/)
    expect(res.status).not.toBe('termine')
  })
})

describe('agent : détection de composants manquants', () => {
  const NEW_CPU = 'AMD Ryzen 5 7600X'
  const DISCOVERY = (sellers = 8) => (query, { condition }) => {
    if (query === NEW_CPU) return condition === 'new' ? listings(NEW_CPU, around(300)) : listings(NEW_CPU, around(210))
    if (condition === 'used' && /AMD Ryzen 5 processeur/.test(query)) {
      return listings(NEW_CPU, [200, 205, 210, 215, 220, 225, 230, 235], { seller: 'v' }).map((it, i) => ({ ...it, seller: `vendeur${i % sellers}` }))
    }
    return []
  }
  const withDiscovery = (sellers) => {
    const table = standardTable(1.05)
    const base = fakeEbay({ table })
    const search = base.search.bind(base)
    base.search = async (q, o) => {
      const special = DISCOVERY(sellers)(q, o ?? {})
      if (special.length) return { ok: true, items: special, total: special.length }
      return search(q, o)
    }
    return base
  }
  const CONFIRMED = async () => ({ ok: true, confirmed: true, source: 'en.wikipedia.org' })

  it('ajoute un composant solidement prouvé, sans toucher à la base, puis ne le duplique pas', async () => {
    const root = await makeRepo()
    const day1 = await run(root, withDiscovery(8), { confirm: CONFIRMED })
    expect(day1.res.report.counts.added).toBe(1)
    const added = await readJson(root, 'src/data/agent/addedCpus.json')
    expect(added).toHaveLength(1)
    expect(added[0]).toMatchObject({ id: 'ryzen-5-7600x', nom: NEW_CPU, marque: 'AMD', socket: 'AM5', dateMaj: '2026-10-24' })
    expect(added[0].agent.attributsEstimes).toContain('tier')
    expect(added[0].agent.sources).toContain('en.wikipedia.org')
    // le lendemain : déjà connu -> ni doublon ni nouvel ajout, et il est vérifié comme les autres
    const day2 = await run(root, withDiscovery(8), { confirm: CONFIRMED, iso: '2026-10-25T04:30:00Z' })
    expect(day2.res.report.counts.added).toBe(0)
    expect(await readJson(root, 'src/data/agent/addedCpus.json')).toHaveLength(1)
    expect(day2.res.report.counts.catalogue).toBe(7)
    const state = await readJson(root, 'agent-data/state.json')
    expect(state.items['cpu:ryzen-5-7600x'].checkedOn).toBe('2026-10-25')
  })

  it('preuve insuffisante : jamais ajouté, placé en liste de vérification avec la raison', async () => {
    const root = await makeRepo()
    const { res } = await run(root, withDiscovery(2), { confirm: CONFIRMED }) // 2 vendeurs seulement
    expect(res.report.counts.added).toBe(0)
    await expect(read(root, 'src/data/agent/addedCpus.json')).rejects.toThrow()
    const item = res.report.manualReview.find((m) => m.kind === 'composant-manquant')
    expect(item.nom).toBe(NEW_CPU)
    expect(item.reason).toMatch(/vendeur/)
    expect(res.report.counts.missingDetected).toBe(1)
  })

  it('modèle non confirmé par la source indépendante : jamais ajouté', async () => {
    const root = await makeRepo()
    const { res } = await run(root, withDiscovery(8), { confirm: NOT_CONFIRMED })
    expect(res.report.counts.added).toBe(0)
    expect(res.report.manualReview.find((m) => m.kind === 'composant-manquant').reason).toMatch(/non confirmé/)
  })

  it('un modèle déjà présent sous une autre graphie n\'est pas proposé (doublon)', async () => {
    const root = await makeRepo({ cpus: [...CPU_FIXTURE, { id: 'ryzen-5-7600x', nom: 'AMD Ryzen 5 7600X', marque: 'AMD', socket: 'AM5', min: 190, moyen: 210, max: 230, tier: 4 }] })
    const table = standardTable(1.05)
    table['AMD Ryzen 5 7600X'] = { used: listings('AMD Ryzen 5 7600X', around(215)), new: listings('AMD Ryzen 5 7600X', around(300)) }
    const { res } = await run(root, fakeEbay({ table }), { confirm: CONFIRMED })
    expect(res.report.counts.added).toBe(0)
    expect(res.report.manualReview.filter((m) => m.kind === 'composant-manquant')).toEqual([])
  })

  it('un composant ajouté puis intégré à la base par un humain est retiré de la liste de l\'agent', async () => {
    const root = await makeRepo()
    await mkdir(path.join(root, 'src/data/agent'), { recursive: true })
    await writeFile(path.join(root, 'src/data/agent/addedCpus.json'), JSON.stringify([{ id: 'ryzen-5-5600', nom: 'AMD Ryzen 5 5600', marque: 'AMD', min: 1, moyen: 2, max: 3, dateMaj: '2026-10-01', tier: 3, faciliteRevente: 0.5, decoteAnciennete: 1 }]))
    const { res } = await run(root, fakeEbay({ table: standardTable(1.05) }))
    expect(res.report.manualReview.some((m) => m.kind === 'doublon')).toBe(true)
    expect(JSON.parse(await read(root, 'src/data/agent/addedCpus.json'))).toEqual([])
  })
})

describe('agent : notification', () => {
  it('envoie un résumé au webhook configuré, et un échec d\'envoi ne casse pas le run', async () => {
    const root = await makeRepo()
    const posted = []
    const { res } = await run(root, fakeEbay({ table: standardTable(1.05) }), {
      env: { AGENT_WEBHOOK_URL: 'https://hooks.example/test' },
      fetchImpl: async (url, init) => {
        posted.push({ url, body: JSON.parse(init.body) })
        return { ok: true }
      },
    })
    expect(posted).toHaveLength(1)
    expect(posted[0].body.text).toMatch(/Agent prix 2026-10-24 — termine/)
    expect(res.report.notification).toEqual({ sent: true })

    const root2 = await makeRepo()
    const failing = await run(root2, fakeEbay({ table: standardTable(1.05) }), {
      env: { AGENT_WEBHOOK_URL: 'https://hooks.example/test' },
      fetchImpl: async () => { throw new Error('réseau coupé') },
    })
    expect(failing.res.status).toBe('termine')
    expect(failing.res.report.notification.sent).toBe(false)
  })
})
