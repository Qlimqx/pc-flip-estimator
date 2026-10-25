// @vitest-environment node
// Demandes d'ajout faites depuis l'application (issues « composant-demande »).
import { describe, expect, it } from 'vitest'
import { answerRequests } from '../answer-requests.mjs'
import { buildRequestComment, loadRequests, parseRequest } from '../lib/requests.mjs'
import { runAgent } from '../run.mjs'
import { CPU_FIXTURE, GPU_FIXTURE, around, fakeClock, fakeEbay, listings, makeRepo, readJson } from './helpers.mjs'

const CONFIRMED = async () => ({ ok: true, confirmed: true, source: 'en.wikipedia.org' })
const NOT_CONFIRMED = async () => ({ ok: true, confirmed: false })
const NEW_CPU = 'AMD Ryzen 5 5700'

const table = () => {
  const t = {}
  for (const e of [...CPU_FIXTURE, ...GPU_FIXTURE]) {
    t[e.nom] = { used: listings(e.nom, around(e.moyen * 1.05)), new: listings(e.nom, around(e.moyen * 1.6)) }
  }
  t[NEW_CPU] = { used: listings(NEW_CPU, around(120)), new: listings(NEW_CPU, around(170)) }
  return t
}
const issue = (number, title, over = {}) => ({ number, title, body: '', authorAssociation: 'OWNER', ...over })

async function run(requests, { confirm = CONFIRMED, ebay = fakeEbay({ table: table() }), root, iso = '2026-10-24T04:30:00Z' } = {}) {
  const r = root ?? (await makeRepo())
  const clock = fakeClock(iso)
  const res = await runAgent({ root: r, ebay, now: clock.now, env: {}, confirm, requests, log: () => {} })
  return { res, root: r }
}

describe('lecture d\'une demande', () => {
  it('reconnaît le modèle du titre ou, à défaut, du corps', () => {
    expect(parseRequest({ title: '[Demande] Processeur Ryzen 5 5700' }).model.nom).toBe(NEW_CPU)
    expect(parseRequest({ title: 'Ajout', body: 'Composant demandé : **RTX 4070 Ti Super**' }).model.nom).toBe('RTX 4070 Ti Super')
  })
  it('refuse un titre sans modèle ou avec plusieurs modèles', () => {
    expect(parseRequest({ title: 'ajoutez un truc' }).error).toMatch(/non reconnu/)
    expect(parseRequest({ title: 'Ryzen 5 5700 et RTX 3060' }).error).toMatch(/plusieurs modèles/)
  })
  it('ne lit les demandes que si un jeton GitHub est disponible', async () => {
    expect((await loadRequests({})).requests).toEqual([])
    const gh = async (args) => {
      expect(args[0]).toBe('api')
      expect(args[1]).toContain('labels=composant-demande')
      return JSON.stringify([
        { number: 1, title: 'x', body: null, author_association: 'OWNER' },
        { number: 2, title: 'pr', body: '', author_association: 'OWNER', pull_request: {} },
      ])
    }
    const { requests } = await loadRequests({ GH_TOKEN: 't' }, gh)
    expect(requests).toEqual([{ number: 1, title: 'x', body: '', authorAssociation: 'OWNER' }])
  })
})

describe('traitement par l\'agent', () => {
  it('ajoute un modèle demandé sans minimum d\'annonces vues, et le répond pour fermeture', async () => {
    const { res, root } = await run([issue(7, '[Demande] Processeur Ryzen 5 5700')])
    expect(res.report.requests).toMatchObject([{ number: 7, outcome: 'ajoute', nom: NEW_CPU, notify: true }])
    const added = await readJson(root, 'src/data/agent/addedCpus.json')
    expect(added.map((a) => a.id)).toEqual(['ryzen-5-5700'])
    expect(added[0].agent.attributsEstimes).toContain('tier')
    expect(res.report.counts.added).toBe(1)
  })

  it('une demande déjà présente dans le catalogue est close sans ajout', async () => {
    const { res } = await run([issue(8, '[Demande] Processeur Ryzen 5 5600')])
    expect(res.report.requests[0]).toMatchObject({ outcome: 'deja-present', nom: 'AMD Ryzen 5 5600', notify: true })
    expect(res.report.counts.added).toBe(0)
  })

  it('un modèle non confirmé reste ouvert, avec la raison, sans rien ajouter', async () => {
    const { res, root } = await run([issue(9, '[Demande] Processeur Ryzen 5 5700')], { confirm: NOT_CONFIRMED })
    expect(res.report.requests[0]).toMatchObject({ outcome: 'a-verifier', notify: true })
    expect(res.report.requests[0].reason).toMatch(/non confirmé/)
    await expect(readJson(root, 'src/data/agent/addedCpus.json')).rejects.toThrow()
  })

  it('une demande refusée n\'est commentée qu\'une fois tant que la raison ne change pas', async () => {
    const first = await run([issue(9, '[Demande] Processeur Ryzen 5 5700')], { confirm: NOT_CONFIRMED })
    const second = await run([issue(9, '[Demande] Processeur Ryzen 5 5700')], { confirm: NOT_CONFIRMED, root: first.root, iso: '2026-10-25T04:30:00Z' })
    expect(second.res.report.requests[0]).toMatchObject({ outcome: 'a-verifier', notify: false })
  })

  it('abandonne après 7 jours d\'échecs et ferme avec explication', async () => {
    let root
    let last
    for (let d = 0; d < 7; d += 1) {
      const iso = `2026-10-${String(24 + d).padStart(2, '0')}T04:30:00Z`
      const r = await run([issue(10, '[Demande] Processeur Ryzen 5 5700')], { confirm: NOT_CONFIRMED, root, iso })
      root = r.root
      last = r.res.report.requests[0]
    }
    expect(last).toMatchObject({ outcome: 'abandonne', notify: true })
  })

  it('ignore les demandes d\'inconnus (dépôt public) et ne copie jamais le texte libre', async () => {
    const { res, root } = await run([
      issue(11, '[Demande] Processeur Ryzen 5 5700', { authorAssociation: 'NONE' }),
      issue(12, '[Demande] Ryzen 5 5700"; rm -rf / <script>', { authorAssociation: 'OWNER' }),
    ])
    expect(res.report.requests.map((r) => r.number)).toEqual([12])
    const added = await readJson(root, 'src/data/agent/addedCpus.json')
    expect(added[0].nom).toBe(NEW_CPU) // nom reconstruit, pas copié de la demande
    expect(JSON.stringify(added)).not.toMatch(/rm -rf|script/)
  })

  it('un titre incompréhensible est signalé sans erreur', async () => {
    const { res } = await run([issue(13, 'ajoutez le truc')])
    expect(res.report.requests[0]).toMatchObject({ outcome: 'non-reconnu', notify: true })
    expect(res.status).not.toBe('echec')
  })

  it('une lecture des demandes qui échoue ne bloque pas la vérification des prix', async () => {
    const r = await makeRepo()
    const clock = fakeClock('2026-10-24T04:30:00Z')
    const res = await runAgent({
      root: r, ebay: fakeEbay({ table: table() }), now: clock.now, confirm: NOT_CONFIRMED, log: () => {},
      env: { GH_TOKEN: 't' },
    })
    // sans `requests` injecté, le CLI `gh` réel est tenté : son éventuel échec n'est qu'un avertissement
    expect(res.report.counts.verified).toBeGreaterThan(0)
  })
})

describe('réponses sur les issues', () => {
  const report = {
    requests: [
      { number: 1, outcome: 'ajoute', nom: NEW_CPU, detail: '120 €', notify: true },
      { number: 2, outcome: 'a-verifier', nom: NEW_CPU, reason: 'x', notify: true },
      { number: 3, outcome: 'a-verifier', nom: NEW_CPU, reason: 'x', notify: false },
    ],
  }
  it('commente les demandes à notifier et ne ferme que celles réglées', async () => {
    const calls = []
    const done = await answerRequests(report, async (args) => calls.push(args))
    expect(done).toEqual([1, 2])
    expect(calls.filter((c) => c[1] === 'close').map((c) => c[2])).toEqual(['1'])
    expect(calls.filter((c) => c[1] === 'comment')).toHaveLength(2)
  })
  it('rédige un message clair par issue', () => {
    expect(buildRequestComment({ outcome: 'ajoute', nom: 'X', detail: 'd' })).toMatch(/a été ajouté/)
    expect(buildRequestComment({ outcome: 'a-verifier', nom: 'X', reason: 'r' })).toMatch(/réessaie chaque jour/)
  })
})

describe('repli pour une demande sans annonce d\'occasion exploitable', () => {
  const noUsed = () => {
    const t = table()
    t[NEW_CPU] = { used: [], new: listings(NEW_CPU, around(170)) }
    return t
  }

  it('estime le prix d\'occasion depuis le neuf, confiance faible et signalé dans la fiche', async () => {
    const { res, root } = await run([issue(20, '[Demande] Processeur Ryzen 5 5700')], { ebay: fakeEbay({ table: noUsed() }) })
    expect(res.report.requests[0]).toMatchObject({ outcome: 'ajoute' })
    const [added] = await readJson(root, 'src/data/agent/addedCpus.json')
    expect(added.moyen).toBeCloseTo(170 * 0.7, 0) // ratio occasion/neuf de neufRatio.ts
    expect(added.agent).toMatchObject({ confiance: 'faible', prixEstimeDepuisNeuf: true })
    expect(added.agent.sources.join(' ')).toMatch(/NEUVES/)
  })

  it('jamais pour la découverte automatique : sans annonce d\'occasion, pas d\'ajout', async () => {
    const { evaluateCandidate } = await import('../lib/discovery.mjs')
    const v = await evaluateCandidate(
      { category: 'cpu', marque: 'AMD', nom: NEW_CPU, modelCore: 'Ryzen 5 5700', listingCount: 9, sellerCount: 6 },
      { search: async (_q, { condition }) => ({ ok: true, items: condition === 'new' ? listings(NEW_CPU, around(170)) : [] }), confirm: CONFIRMED, entries: [], today: 'x', neufRatio: 0.7 },
    )
    expect(v.verdict).toBe('verifier')
  })

  it('sans annonce neuve non plus : reste en vérification', async () => {
    const t = noUsed()
    t[NEW_CPU].new = []
    const { res } = await run([issue(21, '[Demande] Processeur Ryzen 5 5700')], { ebay: fakeEbay({ table: t }) })
    expect(res.report.requests[0].outcome).toBe('a-verifier')
  })
})

describe('prix indicatif saisi par le demandeur', () => {
  it('lit un prix plausible dans le corps de l\'issue et ignore le gabarit vide', async () => {
    const { parseUserPrice } = await import('../lib/requests.mjs')
    expect(parseUserPrice("Prix d'occasion indicatif : 120 €")).toBe(120)
    expect(parseUserPrice('prix occasion ~ 99,5 eur')).toBe(99.5)
    expect(parseUserPrice("Prix d'occasion indicatif (facultatif, utilisé seulement si aucune annonce n'est exploitable) : … €")).toBeNull()
    expect(parseUserPrice('prix : 3 €')).toBeNull() // hors bornes
    expect(parseUserPrice('')).toBeNull()
  })

  it('sans aucune annonce, le prix saisi permet l\'ajout (confiance faible, signalé) mais reste soumis à Wikipédia', async () => {
    const t = table()
    t[NEW_CPU] = { used: [], new: [] }
    const body = "Prix d'occasion indicatif : 120 €"
    const ok = await run([issue(30, '[Demande] Processeur Ryzen 5 5700', { body })], { ebay: fakeEbay({ table: t }) })
    expect(ok.res.report.requests[0].outcome).toBe('ajoute')
    const [added] = await readJson(ok.root, 'src/data/agent/addedCpus.json')
    expect(added).toMatchObject({ moyen: 120, min: 102, max: 138 })
    expect(added.agent).toMatchObject({ confiance: 'faible', prixSaisiParDemandeur: true })
    const refused = await run([issue(31, '[Demande] Processeur Ryzen 5 5700', { body })], { ebay: fakeEbay({ table: t }), confirm: NOT_CONFIRMED })
    expect(refused.res.report.requests[0].outcome).toBe('a-verifier')
  })

  it('n\'écrase jamais un prix issu d\'annonces par le prix saisi', async () => {
    const ok = await run([issue(32, '[Demande] Processeur Ryzen 5 5700', { body: 'Prix : 500 €' })])
    const [added] = await readJson(ok.root, 'src/data/agent/addedCpus.json')
    expect(added.moyen).toBeLessThan(150) // ~120 mesuré sur annonces, pas 500
    expect(added.agent.prixSaisiParDemandeur).toBe(false)
  })
})
