const STORAGE_KEY = 'pc-flip-estimator:ean-daily'
const MAX_PER_DAY = 9999

/**
 * Préfixe "usage interne" (plage 040-049, circulation restreinte GS1) --
 * aucun risque de collision avec un vrai code produit du commerce. Volontairement
 * pas 20-29 : les logiciels de caisse y voient souvent un code à prix/poids
 * variable et n'en lisent qu'une partie (Athena ne retrouvait pas l'article).
 */
const EAN_PREFIX = '04'

interface DailyCounter {
  date: string
  count: number
}

function todayYYMMDD(): string {
  const now = new Date()
  const yy = String(now.getFullYear() % 100).padStart(2, '0')
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  return `${yy}${mm}${dd}`
}

function readCounter(): DailyCounter | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as DailyCounter) : null
  } catch {
    return null
  }
}

/**
 * Alloue et persiste (localStorage) le prochain code EAN-13 : préfixe 04 +
 * date AAMMJJ + compteur du jour sur 4 chiffres, soit 12 chiffres ; le 13e
 * (clé de contrôle) est calculé automatiquement par JsBarcode au rendu.
 * Un code = une unité physique, jamais réutilisé tant que le navigateur
 * garde ses données (le compteur repart à 1 chaque jour, la date suffit à
 * différencier les jours).
 */
export function allocateNextEan(): string {
  const date = todayYYMMDD()
  const stored = readCounter()
  const count = stored && stored.date === date ? stored.count + 1 : 1
  if (count > MAX_PER_DAY) throw new Error(`Plus de ${MAX_PER_DAY} codes EAN générés aujourd'hui`)
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ date, count }))
  return `${EAN_PREFIX}${date}${String(count).padStart(4, '0')}`
}
