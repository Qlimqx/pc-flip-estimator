// Heure de Paris, indépendante du fuseau de la machine qui exécute l'agent.
//
// Tout se calcule avec Intl (base IANA du moteur JavaScript) : l'heure d'été
// et l'heure d'hiver françaises sont donc gérées sans table à maintenir.
// Le « jour » d'une exécution est le jour CIVIL À PARIS, jamais le jour UTC :
// une exécution lancée à 23h30 UTC (= 00h30 ou 01h30 à Paris) appartient déjà
// au lendemain parisien.

export const PARIS = 'Europe/Paris'

const formatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: PARIS,
  hourCycle: 'h23',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
})

/** Composantes de l'instant `date` vues depuis Paris. */
export function parisParts(date) {
  const parts = Object.fromEntries(formatter.formatToParts(date).map((p) => [p.type, p.value]))
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    second: Number(parts.second),
  }
}

/** Jour civil parisien au format AAAA-MM-JJ. */
export function parisYmd(date) {
  const p = parisParts(date)
  return `${p.year}-${String(p.month).padStart(2, '0')}-${String(p.day).padStart(2, '0')}`
}

/** Heure parisienne au format HH:MM. */
export function parisHm(date) {
  const p = parisParts(date)
  return `${String(p.hour).padStart(2, '0')}:${String(p.minute).padStart(2, '0')}`
}

/** Décalage de Paris par rapport à UTC (en minutes) à l'instant donné : +60 en hiver, +120 en été. */
export function parisOffsetMinutes(date) {
  const p = parisParts(date)
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second)
  return Math.round((asUtc - Math.floor(date.getTime() / 1000) * 1000) / 60000)
}

/**
 * Instant UTC correspondant à `hm` (HH:MM) à Paris le jour civil `ymd`.
 * Deux passes : le décalage dépend de l'instant cherché, qui dépend du décalage.
 */
export function parisToUtc(ymd, hm) {
  const [y, mo, d] = ymd.split('-').map(Number)
  const [h, mi] = hm.split(':').map(Number)
  const naive = Date.UTC(y, mo - 1, d, h, mi, 0)
  let guess = naive - parisOffsetMinutes(new Date(naive)) * 60000
  guess = naive - parisOffsetMinutes(new Date(guess)) * 60000
  return new Date(guess)
}

/** Libellé lisible : « 2026-10-24 06:12 (Paris) ». */
export function formatParis(date) {
  return `${parisYmd(date)} ${parisHm(date)} (Paris)`
}
