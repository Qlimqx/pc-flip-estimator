// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { MAX_OPEN_REQUESTS, buildIssue, handleRequest, validateInput } from './requestComponent.js'

const ok = (body, status = 200) => ({ ok: status < 300, status, json: async () => body })

/** Faux GitHub : liste d'issues ouvertes, enregistre les créations. */
function github({ open = [], listStatus = 200, createStatus = 201 } = {}) {
  const created = []
  const fetchImpl = async (url, init = {}) => {
    if (init.method === 'POST') {
      created.push({ url: String(url), headers: init.headers, body: JSON.parse(init.body) })
      return ok({ number: 99 }, createStatus)
    }
    return ok(open, listStatus)
  }
  return { fetchImpl, created }
}
const ctx = (g, over = {}) => ({ token: 'tok', repo: 'o/r', fetchImpl: g.fetchImpl, ...over })
const ask = (name, kind = 'cpu') => ({ kind, name })

describe('validation de la demande', () => {
  it('reconnaît et canonise le modèle', () => {
    expect(validateInput(ask('  ryzen 5   5700 ')).model.nom).toBe('AMD Ryzen 5 5700')
    expect(validateInput(ask('rtx 4070 ti super', 'gpu')).model.nom).toBe('RTX 4070 Ti Super')
  })

  it('refuse robots, types invalides, noms vides, longs ou exotiques, et modèles non reconnus', () => {
    expect(validateInput({ ...ask('Ryzen 5 5700'), website: 'http://spam' }).status).toBe(400)
    expect(validateInput(ask('Ryzen 5 5700', 'ram')).status).toBe(400)
    expect(validateInput(ask('ab')).status).toBe(400)
    expect(validateInput(ask('x'.repeat(61))).status).toBe(400)
    expect(validateInput(ask('Ryzen 5 5700 <script>alert(1)</script>')).status).toBe(400)
    expect(validateInput(ask('un truc inconnu')).status).toBe(422)
    expect(validateInput(ask('Ryzen 5 5700', 'gpu')).status).toBe(422) // processeur donné pour une carte graphique
    expect(validateInput(ask('Ryzen 5 5700 et Ryzen 7 5800X')).status).toBe(422)
    expect(validateInput(null).status).toBe(400)
  })

  it("l'issue ne contient que le nom canonique, jamais le texte du visiteur", () => {
    const issue = buildIssue(validateInput(ask('ryzen 5 5700 (merci)')))
    expect(issue.title).toBe('[Demande] Processeur AMD Ryzen 5 5700')
    expect(issue.body).not.toMatch(/merci/)
    expect(issue.labels).toEqual(['composant-demande', 'depuis-le-site'])
  })
})

describe("création de l'issue", () => {
  it("crée l'issue étiquetée, avec le jeton uniquement dans l'en-tête serveur", async () => {
    const g = github()
    const r = await handleRequest(ask('Ryzen 5 5700'), ctx(g))
    expect(r.status).toBe(200)
    expect(r.body).toMatchObject({ ok: true, nom: 'AMD Ryzen 5 5700' })
    expect(g.created).toHaveLength(1)
    expect(g.created[0].url).toBe('https://api.github.com/repos/o/r/issues')
    expect(g.created[0].headers.Authorization).toBe('Bearer tok')
    expect(g.created[0].body.labels).toContain('depuis-le-site')
    expect(JSON.stringify(r.body)).not.toContain('tok')
  })

  it('ne crée pas de doublon', async () => {
    const g = github({ open: [{ title: '[Demande] Processeur AMD Ryzen 5 5700' }] })
    const r = await handleRequest(ask('ryzen 5 5700'), ctx(g))
    expect(r.body).toMatchObject({ ok: true, duplicate: true })
    expect(g.created).toHaveLength(0)
  })

  it('plafonne le nombre de demandes ouvertes', async () => {
    const open = Array.from({ length: MAX_OPEN_REQUESTS }, (_, i) => ({ title: `autre ${i}` }))
    const r = await handleRequest(ask('Ryzen 5 5700'), ctx(github({ open })))
    expect(r.status).toBe(429)
  })

  it("sans jeton configuré : 503 not-configured (l'interface bascule sur le lien GitHub)", async () => {
    const r = await handleRequest(ask('Ryzen 5 5700'), ctx(github(), { token: undefined }))
    expect(r).toMatchObject({ status: 503, body: { error: 'not-configured' } })
  })

  it('erreur GitHub ou réseau : 502 sans détail interne', async () => {
    expect((await handleRequest(ask('Ryzen 5 5700'), ctx(github({ createStatus: 403 })))).status).toBe(502)
    expect((await handleRequest(ask('Ryzen 5 5700'), ctx(github({ listStatus: 500 })))).status).toBe(502)
    const boom = { fetchImpl: async () => { throw new Error('secret interne') } }
    const r = await handleRequest(ask('Ryzen 5 5700'), ctx(boom))
    expect(r.status).toBe(502)
    expect(JSON.stringify(r.body)).not.toMatch(/secret interne/)
  })

  it('une entrée invalide est refusée avant tout appel GitHub', async () => {
    const calls = []
    const spy = async (...a) => { calls.push(a); return ok([]) }
    const r = await handleRequest(ask('nimporte quoi'), { token: 't', repo: 'o/r', fetchImpl: spy })
    expect(r.status).toBe(422)
    expect(calls).toHaveLength(0)
  })
})
