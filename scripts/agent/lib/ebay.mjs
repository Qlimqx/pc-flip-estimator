// Client eBay Browse (marketplace EBAY_FR) pour l'agent.
//
// Différences avec l'ancien scripts/update-prices.mjs :
// - distingue « la source est en panne » de « aucune annonce trouvée » (l'ancien
//   code renvoyait [] dans les deux cas, ce qui masquait les pannes) ;
// - délai maximal par requête, nouvelles tentatives limitées avec attente
//   exponentielle (Retry-After respecté, plafonné) ;
// - disjoncteur : après N échecs consécutifs, la source est déclarée
//   indisponible et on arrête de la solliciter pour ce run ;
// - ne contourne aucune protection : API officielle, jeton OAuth applicatif,
//   quotas respectés (délai minimal entre requêtes).

const TOKEN_URL = 'https://api.ebay.com/identity/v1/oauth2/token'
const SEARCH_URL = 'https://api.ebay.com/buy/browse/v1/item_summary/search'

export const CONDITIONS = {
  used: '3000|4000|5000|6000',
  new: '1000',
}

const defaultSleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export class EbayError extends Error {
  constructor(message, kind) {
    super(message)
    this.name = 'EbayError'
    this.kind = kind // 'config' | 'auth' | 'http' | 'network' | 'circuit-open' | 'timeout'
  }
}

/**
 * @param {object} opts
 * @param {string} [opts.clientId]
 * @param {string} [opts.clientSecret]
 * @param {typeof fetch} [opts.fetchImpl]
 * @param {(ms:number)=>Promise<void>} [opts.sleep]
 * @param {() => number} [opts.now]
 */
export function createEbayClient({
  clientId,
  clientSecret,
  fetchImpl = globalThis.fetch,
  sleep = defaultSleep,
  now = Date.now,
  timeoutMs = 15000,
  maxRetries = 2,
  backoffBaseMs = 800,
  maxBackoffMs = 8000,
  minIntervalMs = 200,
  breakerThreshold = 5,
} = {}) {
  let token = null
  let tokenExpiresAt = 0
  let lastCallAt = 0
  let consecutiveFailures = 0
  const stats = { calls: 0, retries: 0, failures: 0, circuitOpen: false }

  async function timedFetch(url, init) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
      return await fetchImpl(url, { ...init, signal: controller.signal })
    } catch (err) {
      if (err?.name === 'AbortError') throw new EbayError(`délai de ${timeoutMs} ms dépassé`, 'timeout')
      throw new EbayError(`erreur réseau : ${err?.message ?? err}`, 'network')
    } finally {
      clearTimeout(timer)
    }
  }

  async function pace() {
    const wait = lastCallAt + minIntervalMs - now()
    if (wait > 0) await sleep(wait)
    lastCallAt = now()
  }

  async function getToken() {
    if (!clientId || !clientSecret) {
      throw new EbayError('EBAY_CLIENT_ID / EBAY_CLIENT_SECRET manquants (secrets GitHub Actions)', 'config')
    }
    if (token && now() < tokenExpiresAt - 60000) return token
    const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
    const res = await timedFetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: `Basic ${basic}` },
      body: 'grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope',
    })
    if (!res.ok) throw new EbayError(`authentification eBay refusée (HTTP ${res.status})`, 'auth')
    const data = await res.json()
    if (!data.access_token) throw new EbayError('réponse OAuth eBay sans jeton', 'auth')
    token = data.access_token
    tokenExpiresAt = now() + (Number(data.expires_in) || 7200) * 1000
    return token
  }

  /**
   * Recherche d'annonces. Ne lève jamais : renvoie { ok, items, total, error?, kind? }.
   * `ok: true` avec `items: []` signifie vraiment « aucune annonce ».
   */
  async function search(query, { condition = 'used', limit = 50, offset = 0, sort = null } = {}) {
    if (stats.circuitOpen) return { ok: false, items: [], total: 0, error: 'source déclarée indisponible pour ce run', kind: 'circuit-open' }
    const url = new URL(SEARCH_URL)
    url.searchParams.set('q', query)
    url.searchParams.set('filter', `conditionIds:{${CONDITIONS[condition]}}`)
    url.searchParams.set('limit', String(limit))
    if (offset) url.searchParams.set('offset', String(offset))
    if (sort) url.searchParams.set('sort', sort)

    let lastError = null
    for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
      if (attempt > 0) {
        stats.retries += 1
        const retryAfter = lastError?.retryAfterMs ?? 0
        await sleep(Math.min(maxBackoffMs, Math.max(retryAfter, backoffBaseMs * 2 ** (attempt - 1))))
      }
      try {
        await pace()
        const bearer = await getToken()
        stats.calls += 1
        const res = await timedFetch(url, {
          headers: { Authorization: `Bearer ${bearer}`, 'X-EBAY-C-MARKETPLACE-ID': 'EBAY_FR' },
        })
        if (res.status === 401) {
          token = null // jeton expiré ou révoqué : on redemande au prochain essai
          throw Object.assign(new EbayError('jeton eBay refusé (401)', 'auth'), { retryable: true })
        }
        if (res.status === 429 || res.status >= 500) {
          const ra = Number(res.headers?.get?.('retry-after'))
          throw Object.assign(new EbayError(`HTTP ${res.status}`, 'http'), {
            retryable: true,
            retryAfterMs: Number.isFinite(ra) ? ra * 1000 : 0,
          })
        }
        if (!res.ok) throw new EbayError(`HTTP ${res.status}`, 'http') // 4xx : inutile de réessayer
        const data = await res.json()
        consecutiveFailures = 0
        const items = (data.itemSummaries ?? []).map((it) => ({
          id: it.itemId,
          title: it.title,
          price: Number(it.price?.value),
          currency: it.price?.currency,
          seller: it.seller?.username,
          condition: it.condition,
        }))
        return { ok: true, items: items.filter((i) => i.currency === 'EUR'), total: Number(data.total) || items.length }
      } catch (err) {
        lastError = err instanceof EbayError ? err : new EbayError(String(err?.message ?? err), 'network')
        if (lastError.kind === 'config') break
        if (lastError.retryable === false) break
        if (lastError.kind === 'http' && !lastError.retryable) break
      }
    }
    stats.failures += 1
    consecutiveFailures += 1
    if (consecutiveFailures >= breakerThreshold || lastError.kind === 'config') stats.circuitOpen = true
    return { ok: false, items: [], total: 0, error: lastError.message, kind: lastError.kind }
  }

  return {
    search,
    stats,
    /** Vérifie que l'API répond et que les identifiants sont valides. */
    async ping() {
      try {
        await getToken()
        return { ok: true }
      } catch (err) {
        return { ok: false, error: err.message, kind: err.kind }
      }
    },
  }
}
