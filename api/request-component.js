// Fonction Vercel : POST /api/request-component  { kind: 'cpu' | 'gpu', name: string }
// Variables d'environnement (Vercel -> Settings -> Environment Variables) :
//   GITHUB_REQUEST_TOKEN : jeton GitHub "fine-grained", limité à CE dépôt, permission Issues (lecture/écriture)
//   GITHUB_REPO          : facultatif, défaut Qlimqx/pc-flip-estimator
// Voir docs/AGENT.md.

import { handleRequest } from './_lib/requestComponent.js'

// Limite grossière par instance (les instances serverless sont éphémères : simple frein, pas une garantie).
const hits = new Map()
const WINDOW_MS = 10 * 60 * 1000
const MAX_HITS = 8

function tooMany(ip, now = Date.now()) {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 500) hits.clear()
  return recent.length > MAX_HITS
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, error: 'method', message: 'Méthode non autorisée.' })
  }
  const ip = String(req.headers['x-forwarded-for'] ?? '').split(',')[0].trim() || 'inconnue'
  if (tooMany(ip)) return res.status(429).json({ ok: false, error: 'rate', message: 'Trop de demandes, réessayez dans quelques minutes.' })

  let body = req.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      body = null
    }
  }
  const { status, body: payload } = await handleRequest(body, {
    token: process.env.GITHUB_REQUEST_TOKEN,
    repo: process.env.GITHUB_REPO || 'Qlimqx/pc-flip-estimator',
  })
  return res.status(status).json(payload)
}
