// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createEbayClient } from '../lib/ebay.mjs'

const json = (body, status = 200, headers = {}) => ({
  ok: status >= 200 && status < 300,
  status,
  headers: { get: (k) => headers[k.toLowerCase()] ?? null },
  json: async () => body,
})
const TOKEN = json({ access_token: 'tok', expires_in: 7200 })
const ITEMS = json({ total: 2, itemSummaries: [
  { itemId: '1', title: 'A', price: { value: '10.5', currency: 'EUR' }, seller: { username: 'u1' } },
  { itemId: '2', title: 'B', price: { value: '12', currency: 'USD' }, seller: { username: 'u2' } },
] })

/** Fabrique un client avec une file de réponses (ou d'erreurs) pour `fetch`. */
function client(responses, opts = {}) {
  const calls = []
  const sleeps = []
  const queue = [...responses]
  const fetchImpl = async (url) => {
    calls.push(String(url))
    const next = queue.shift()
    if (next instanceof Error) throw next
    return next ?? json({}, 500)
  }
  const c = createEbayClient({
    clientId: 'id',
    clientSecret: 'secret',
    fetchImpl,
    sleep: async (ms) => {
      sleeps.push(ms)
    },
    minIntervalMs: 0,
    ...opts,
  })
  return { c, calls, sleeps }
}

describe('client eBay', () => {
  it('renvoie les annonces en euros avec vendeur et identifiant', async () => {
    const { c } = client([TOKEN, ITEMS])
    const r = await c.search('RTX 3060')
    expect(r.ok).toBe(true)
    expect(r.items).toEqual([{ id: '1', title: 'A', price: 10.5, currency: 'EUR', seller: 'u1', condition: undefined }])
  })

  it('réessaie sur 429 / 5xx avec attente exponentielle puis réussit', async () => {
    const { c, sleeps } = client([TOKEN, json({}, 429, { 'retry-after': '2' }), json({}, 503), ITEMS])
    const r = await c.search('x')
    expect(r.ok).toBe(true)
    expect(c.stats.retries).toBe(2)
    expect(sleeps.some((ms) => ms >= 2000)).toBe(true)
  })

  it('distingue une panne (ok:false) d\'un résultat vide (ok:true, items:[])', async () => {
    const empty = client([TOKEN, json({ total: 0 })])
    expect(await empty.c.search('x')).toMatchObject({ ok: true, items: [] })
    const down = client([TOKEN, json({}, 503), json({}, 503), json({}, 503)])
    expect(await down.c.search('x')).toMatchObject({ ok: false, kind: 'http' })
    expect(down.c.stats.failures).toBe(1)
  })

  it('ne réessaie pas une erreur 4xx définitive', async () => {
    const { c, calls } = client([TOKEN, json({}, 400)])
    const r = await c.search('x')
    expect(r.ok).toBe(false)
    expect(calls).toHaveLength(2) // jeton + une seule recherche
  })

  it('délai dépassé -> échec propre', async () => {
    const abortable = async (_url, init) =>
      new Promise((_resolve, reject) => {
        init.signal.addEventListener('abort', () => reject(Object.assign(new Error('abort'), { name: 'AbortError' })))
      })
    const c = createEbayClient({ clientId: 'a', clientSecret: 'b', fetchImpl: abortable, sleep: async () => {}, timeoutMs: 10, maxRetries: 0, minIntervalMs: 0 })
    const r = await c.search('x')
    expect(r).toMatchObject({ ok: false })
  })

  it('le disjoncteur coupe la source après des échecs consécutifs', async () => {
    const bad = Array.from({ length: 40 }, () => json({}, 503))
    const { c, calls } = client([TOKEN, ...bad], { breakerThreshold: 2, maxRetries: 0 })
    await c.search('a')
    await c.search('b')
    expect(c.stats.circuitOpen).toBe(true)
    const before = calls.length
    const r = await c.search('c')
    expect(r.kind).toBe('circuit-open')
    expect(calls.length).toBe(before) // plus aucun appel réseau
  })

  it('identifiants absents -> erreur de configuration claire, sans appel réseau', async () => {
    const c = createEbayClient({ fetchImpl: async () => { throw new Error('ne doit pas être appelé') }, sleep: async () => {}, minIntervalMs: 0 })
    expect(await c.ping()).toMatchObject({ ok: false, kind: 'config' })
  })
})
