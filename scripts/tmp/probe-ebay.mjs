// SONDE TEMPORAIRE (supprimée après usage) : catégories eBay FR et effet du filtre de catégorie.
import { genuineListings, median } from '../lib/pricing.mjs'
const basic = Buffer.from(`${process.env.EBAY_CLIENT_ID}:${process.env.EBAY_CLIENT_SECRET}`).toString('base64')
const tok = (await (await fetch('https://api.ebay.com/identity/v1/oauth2/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: `Basic ${basic}` }, body: 'grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope' })).json()).access_token
const H = { Authorization: `Bearer ${tok}`, 'X-EBAY-C-MARKETPLACE-ID': 'EBAY_FR' }
for (const q of ['carte graphique nvidia', 'processeur intel core', 'barrette memoire ram ddr4', 'ssd nvme', 'disque dur interne hdd']) {
  const r = await fetch(`https://api.ebay.com/commerce/taxonomy/v1/category_tree/71/get_category_suggestions?q=${encodeURIComponent(q)}`, { headers: H })
  const j = await r.json().catch(() => ({}))
  console.log('TAXO', q, r.status, JSON.stringify((j.categorySuggestions ?? []).slice(0, 3).map((s) => [s.category.categoryId, s.category.categoryName, (s.categoryTreeNodeAncestors ?? []).map((a) => a.categoryName).join('>')])))
}
async function search(q, extra = '') {
  const u = `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(q)}&filter=${encodeURIComponent('conditionIds:{3000|4000|5000|6000}')}&limit=50${extra}`
  const r = await fetch(u, { headers: H })
  return (await r.json()).itemSummaries ?? []
}
for (const [q, cat] of [['RTX 4060', '27386'], ['AMD Ryzen 7 5800X', '164'], ['RTX 3070', '27386']]) {
  for (const extra of ['', `&category_ids=${cat}`]) {
    const items = await search(q, extra)
    const g = genuineListings(items.map((i) => ({ title: i.title, price: Number(i.price?.value) })), q)
    console.log('SEARCH', q, extra || '(sans catégorie)', 'brut', items.length, 'retenues', g.length, 'médiane', g.length ? median(g.map((x) => x.price)) : null)
    if (!extra) console.log('  échantillon:', items.slice(0, 8).map((i) => `${i.price?.value}€ ${i.title.slice(0, 70)} [${i.categories?.map((c) => c.categoryId).join(',')}]`).join('\n    '))
  }
}
