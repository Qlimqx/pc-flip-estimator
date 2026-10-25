// Rotation de PRICE_REVIEW.md.
//
// Le fichier est en ajout seul (ancien pipeline, routine de vérification IA et
// agent quotidien y ajoutent chacun des sections « ## AAAA-MM-JJ ») : il grossit
// sans fin. La rotation déplace les sections de plus de REVIEW_KEEP_DAYS jours
// vers docs/price-review-archive/AAAA-MM.md (mois de la section).
//
// Contraintes de format, à ne pas casser :
//   - les sections gardent leur titre « ## AAAA-MM-JJ[ …] » et leur bloc
//     « ### Rejetés (…) » tels quels (on ne réécrit jamais une section) ;
//   - la routine cloud « verification prix quotidienne » lit le « ### Rejetés »
//     le plus récent : une COPIE de ce bloc est épinglée juste après le préambule,
//     entre deux commentaires HTML invisibles, même s'il a plus de 30 jours.
//     L'original reste à sa place chronologique (donc archivé le moment venu) ;
//     la copie est recalculée à chaque rotation, jamais accumulée.
//
// Tout est pur (texte -> texte) sauf planReviewRotation, qui lit les archives
// existantes pour les compléter sans doublon.

import path from 'node:path'
import { readText } from './store.mjs'

export const REVIEW_FILE = 'PRICE_REVIEW.md'
export const ARCHIVE_DIR = 'docs/price-review-archive'
export const REVIEW_KEEP_DAYS = 30
export const PIN_START = '<!-- price-review:rejetes-recent -->'
export const PIN_END = '<!-- /price-review:rejetes-recent -->'

const SECTION_DATE = /^## (\d{4}-\d{2}-\d{2})(?!\d)/
const REJETES = /^### Rejetés/
const DAY_MS = 86400000

const eolOf = (text) => (text.includes('\r\n') ? '\r\n' : '\n')
const splitLines = (text) => text.match(/[^\n]*\n|[^\n]+$/g) ?? []
const normalize = (text) => text.replace(/\r\n/g, '\n').trimEnd()
const utcDay = (ymd) => Date.UTC(...ymd.split('-').map((v, i) => (i === 1 ? Number(v) - 1 : Number(v))))

/** Retire l'ancienne épingle (et la ligne vide qui la suit). */
function withoutPin(lines) {
  const start = lines.findIndex((l) => l.trim() === PIN_START)
  if (start === -1) return lines
  const end = lines.findIndex((l, i) => i > start && l.trim() === PIN_END)
  if (end === -1) return lines.filter((_, i) => i !== start) // épingle tronquée : on ne supprime que la balise
  const after = lines[end + 1]?.trim() === '' ? end + 2 : end + 1
  return [...lines.slice(0, start), ...lines.slice(after)]
}

/** Découpe en préambule + sections « ## … » (texte exact, fins de ligne comprises). */
function parse(text) {
  const lines = withoutPin(splitLines(text))
  const first = lines.findIndex((l) => l.startsWith('## '))
  const preamble = first === -1 ? lines : lines.slice(0, first)
  const sections = []
  for (const line of first === -1 ? [] : lines.slice(first)) {
    if (line.startsWith('## ')) sections.push({ date: SECTION_DATE.exec(line)?.[1] ?? null, lines: [] })
    sections.at(-1).lines.push(line)
  }
  return { preamble, sections }
}

/** « ### Rejetés … » d'une section, jusqu'au sous-titre suivant. */
function rejetesBlock(section) {
  const start = section.lines.findIndex((l) => REJETES.test(l))
  if (start === -1) return null
  const next = section.lines.findIndex((l, i) => i > start && l.startsWith('### '))
  const block = section.lines.slice(start, next === -1 ? undefined : next)
  while (block.length && block.at(-1).trim() === '') block.pop()
  return block
}

/**
 * @param {string} text   contenu de PRICE_REVIEW.md
 * @param {{today: string, keepDays?: number}} opts   today = jour civil AAAA-MM-JJ (Paris)
 * @returns {{text: string, archive: Record<string, string[]>, archivedCount: number}}
 */
export function rotateReview(text, { today, keepDays = REVIEW_KEEP_DAYS }) {
  if (text.trim() === '') return { text, archive: {}, archivedCount: 0 }
  const eol = eolOf(text)
  const { preamble, sections } = parse(text)

  const isOld = (s) => s.date !== null && (utcDay(today) - utcDay(s.date)) / DAY_MS > keepDays
  const kept = sections.filter((s) => !isOld(s))
  const archive = {}
  for (const s of sections.filter(isOld)) {
    const raw = s.lines.join('')
    ;(archive[s.date.slice(0, 7)] ??= []).push(raw.endsWith('\n') ? raw : raw + eol)
  }

  // « Rejetés » le plus récent : date la plus haute, le dernier du fichier à date égale.
  let latest = null
  for (const s of sections) {
    if (s.date !== null && rejetesBlock(s) && (latest === null || s.date >= latest.date)) latest = s
  }

  let head = preamble.join('').trimEnd()
  if (!head.includes(ARCHIVE_DIR)) {
    head += `${eol}${eol}*Les sections de plus de ${keepDays} jours sont archivées dans \`${ARCHIVE_DIR}/AAAA-MM.md\`.*`
  }
  const parts = [head + eol + eol]
  if (latest) {
    const title = latest.lines[0].replace(/\r?\n$/, '')
    parts.push([PIN_START, title, '', ...rejetesBlock(latest).map((l) => l.replace(/\r?\n$/, '')), PIN_END, '', ''].join(eol))
  }
  parts.push(...kept.map((s) => s.lines.join('')))

  return { text: parts.join(''), archive, archivedCount: sections.length - kept.length }
}

/** Ajoute `sections` au fichier d'archive du mois, sans jamais dupliquer une section déjà présente. */
export function mergeArchive(existing, month, sections, eol = eolOf(existing ?? sections.join(''))) {
  const present = new Set(parse(existing ?? '').sections.map((s) => normalize(s.lines.join(''))))
  const fresh = []
  for (const section of sections) {
    const key = normalize(section)
    if (present.has(key)) continue
    present.add(key)
    fresh.push(section.trimEnd() + eol + eol)
  }
  if (existing !== null && fresh.length === 0) return existing
  const base =
    existing ??
    `# Archive PRICE_REVIEW — ${month}${eol}${eol}Sections de \`${REVIEW_FILE}\` de plus de ${REVIEW_KEEP_DAYS} jours (rotation automatique).${eol}${eol}`
  return (base.endsWith('\n') ? base : base + eol) + fresh.join('')
}

/**
 * Calcule les fichiers à écrire (chemin relatif -> contenu) : PRICE_REVIEW.md
 * réduit, plus une archive par mois concerné. Seuls les fichiers modifiés
 * sont renvoyés ; à passer à une transaction (écriture tout ou rien).
 */
export async function planReviewRotation({ root, text, today, keepDays = REVIEW_KEEP_DAYS }) {
  const rotated = rotateReview(text, { today, keepDays })
  const eol = eolOf(text)
  const files = {}
  if (rotated.text !== text) files[REVIEW_FILE] = rotated.text
  for (const [month, sections] of Object.entries(rotated.archive)) {
    const rel = `${ARCHIVE_DIR}/${month}.md`
    const existing = await readText(path.join(root, rel), null)
    const merged = mergeArchive(existing, month, sections, eol)
    if (merged !== existing) files[rel] = merged
  }
  return { files, archivedCount: rotated.archivedCount }
}
