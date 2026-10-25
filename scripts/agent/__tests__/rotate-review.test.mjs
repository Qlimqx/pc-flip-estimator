// @vitest-environment node
// Rotation de PRICE_REVIEW.md : les sections de plus de 30 jours partent dans
// docs/price-review-archive/AAAA-MM.md ; le dernier « ### Rejetés » reste en tête
// du fichier (la routine cloud « verification prix quotidienne » le lit).
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { ARCHIVE_DIR, PIN_END, PIN_START, REVIEW_KEEP_DAYS, mergeArchive, planReviewRotation, rotateReview } from '../lib/rotate-review.mjs'
import { makeRepo, read } from './helpers.mjs'

const REJ = '### Rejetés (écart trop important, valeur inchangée)'
const FLAG = '### Écarts notables acceptés (à vérifier)'
const PREAMBLE = [
  '# Écarts de prix à vérifier',
  '',
  'Généré automatiquement par `scripts/update-prices.mjs` -- chaque entrée liste',
  'un modèle dont le prix moyen a changé de plus de 25% d\'un jour à l\'autre.',
  'Un grand écart n\'est pas forcément une erreur, mais ça mérite un',
  'coup d\'œil avant de faire confiance au chiffre pour une décision d\'achat.',
].join('\n')

/** Section « ## date » avec un bloc Rejetés (et, si demandé, un bloc « acceptés »). */
function sec(date, { label = '', rejected = [`- **CPU-${date}** (cpu) : 10€ conservé, eBay proposait 30€ (+200%)`], flagged = [], noRejected = false } = {}) {
  const out = [`## ${date}${label}`, '']
  if (!noRejected) out.push(REJ, '', ...rejected, '')
  if (flagged.length) out.push(FLAG, '', ...flagged, '')
  return out.join('\n')
}
const file = (...sections) => `${PREAMBLE}\n${sections.join('\n')}`
const headings = (text) => text.split(/\r?\n/).filter((l) => l.startsWith('## '))
const TODAY = '2026-10-23'

describe('rotateReview : sélection des sections', () => {
  it('archive à partir de 31 jours et garde 30 jours pile', () => {
    expect(REVIEW_KEEP_DAYS).toBe(30)
    const text = file(sec('2026-09-21'), sec('2026-09-22'), sec('2026-09-23'), sec('2026-10-23'))
    const out = rotateReview(text, { today: TODAY })
    expect(out.archivedCount).toBe(2)
    expect(Object.keys(out.archive)).toEqual(['2026-09'])
    expect(out.archive['2026-09'].join('')).toContain('## 2026-09-21')
    expect(out.archive['2026-09'].join('')).toContain('## 2026-09-22')
    const body = out.text.slice(out.text.indexOf(PIN_END))
    expect(headings(body)).toEqual(['## 2026-09-23', '## 2026-10-23'])
  })

  it('classe les sections archivées par mois, dans l\'ordre du fichier', () => {
    const text = file(sec('2026-07-30'), sec('2026-08-01', { label: ' (agent quotidien)' }), sec('2026-08-01'), sec('2026-10-20'))
    const out = rotateReview(text, { today: TODAY })
    expect(Object.keys(out.archive).sort()).toEqual(['2026-07', '2026-08'])
    expect(out.archive['2026-08']).toHaveLength(2)
    expect(out.archive['2026-08'][0]).toContain('## 2026-08-01 (agent quotidien)')
    expect(out.archive['2026-08'][1]).toContain('## 2026-08-01\n')
  })

  it('ne touche jamais une section sans date (ou datée dans le futur)', () => {
    const notes = '## Notes de relecture\n\ntexte libre\n'
    const text = file(sec('2026-08-01'), notes, sec('2026-11-30'))
    const out = rotateReview(text, { today: TODAY })
    expect(out.archivedCount).toBe(1)
    expect(out.text).toContain('## Notes de relecture\n\ntexte libre')
    expect(out.text).toContain('## 2026-11-30')
  })

  it('une section « ## 2026-10-07 (agent quotidien) » compte comme datée du 2026-10-07', () => {
    const text = file(sec('2026-08-05', { label: ' (agent quotidien)' }), sec('2026-10-20'))
    expect(rotateReview(text, { today: TODAY }).archivedCount).toBe(1)
  })

  it('rien à archiver : le texte conservé garde toutes les sections', () => {
    const text = file(sec('2026-10-01'), sec('2026-10-02'))
    const out = rotateReview(text, { today: TODAY })
    expect(out.archivedCount).toBe(0)
    expect(out.archive).toEqual({})
    expect(headings(out.text.slice(out.text.indexOf(PIN_END)))).toEqual(['## 2026-10-01', '## 2026-10-02'])
  })
})

describe('rotateReview : « Rejetés » le plus récent épinglé en tête', () => {
  const pinned = (text) => text.slice(text.indexOf(PIN_START), text.indexOf(PIN_END) + PIN_END.length)

  it('place le dernier « Rejetés » juste après le préambule, avant toute autre section', () => {
    const text = file(sec('2026-10-01'), sec('2026-10-22', { rejected: ['- **A** (cpu) : 1€ conservé, eBay proposait 5€ (+400%)'] }), sec('2026-10-23', { noRejected: true, flagged: ['- **Z** (gpu) : 1€ → 2€ (+100% vs référence)'] }))
    const out = rotateReview(text, { today: TODAY })
    const firstH2 = out.text.indexOf('\n## ')
    expect(out.text.indexOf(PIN_START)).toBeLessThan(firstH2)
    expect(out.text.startsWith('# Écarts de prix à vérifier')).toBe(true)
    // le bloc épinglé garde le format « ## date » puis « ### Rejetés »
    expect(pinned(out.text)).toContain(`${PIN_START}\n## 2026-10-22\n\n${REJ}\n\n- **A** (cpu)`)
    // seul le bloc Rejetés est copié, pas les « acceptés »
    expect(pinned(out.text)).not.toContain(FLAG)
    // le premier « ### Rejetés » du fichier est bien le dernier en date
    expect(out.text.indexOf(REJ)).toBeGreaterThan(out.text.indexOf(PIN_START))
    expect(out.text.indexOf(REJ)).toBeLessThan(out.text.indexOf(PIN_END))
  })

  it('le choix se fait par date, et le dernier du fichier l\'emporte à date égale', () => {
    const text = file(
      sec('2026-10-23', { label: ' (agent quotidien)', rejected: ['- **TARD** (cpu) : 1€ conservé, eBay proposait 9€ (+800%)'] }),
      sec('2026-10-22', { rejected: ['- **VEILLE** (cpu) : 1€ conservé, eBay proposait 9€ (+800%)'] }),
      sec('2026-10-23', { rejected: ['- **DERNIER** (cpu) : 1€ conservé, eBay proposait 9€ (+800%)'] }),
    )
    const block = pinned(rotateReview(text, { today: TODAY }).text)
    expect(block).toContain('**DERNIER**')
    expect(block).not.toContain('**TARD**')
    expect(block).not.toContain('**VEILLE**')
  })

  it('conserve l\'épingle même si le dernier « Rejetés » a plus de 30 jours (il est aussi archivé)', () => {
    const text = file(sec('2026-08-10'), sec('2026-10-22', { noRejected: true, flagged: ['- **Z** (gpu) : 1€ → 2€ (+100% vs référence)'] }))
    const out = rotateReview(text, { today: TODAY })
    expect(pinned(out.text)).toContain('## 2026-08-10')
    expect(pinned(out.text)).toContain('**CPU-2026-08-10**')
    expect(out.archive['2026-08'].join('')).toContain('**CPU-2026-08-10**')
  })

  it('la section reste aussi à sa place chronologique (aucune donnée déplacée)', () => {
    const text = file(sec('2026-10-22'))
    const out = rotateReview(text, { today: TODAY })
    expect(out.text.split('**CPU-2026-10-22**')).toHaveLength(3) // épingle + corps
  })

  it('remplace l\'ancienne épingle au lieu d\'en accumuler', () => {
    const once = rotateReview(file(sec('2026-10-20')), { today: '2026-10-21' }).text
    const next = `${once}\n${sec('2026-10-22')}`
    const out = rotateReview(next, { today: TODAY })
    expect(out.text.split(PIN_START)).toHaveLength(2)
    expect(out.text.split(PIN_END)).toHaveLength(2)
    expect(pinned(out.text)).toContain('## 2026-10-22')
    expect(pinned(out.text)).not.toContain('2026-10-20')
    expect(out.text).toContain('## 2026-10-20') // toujours présente dans le corps
  })

  it('sans aucun « Rejetés », n\'ajoute pas de bloc vide', () => {
    const out = rotateReview(file(sec('2026-10-22', { noRejected: true, flagged: ['- **Z** (gpu) : 1€ → 2€ (+100% vs référence)'] })), { today: TODAY })
    expect(out.text).not.toContain(PIN_START)
  })
})

describe('rotateReview : sûreté', () => {
  it('est idempotent : une 2e rotation ne change rien et n\'archive plus rien', () => {
    const text = file(sec('2026-08-01'), sec('2026-09-10'), sec('2026-10-22'), sec('2026-10-23', { label: ' (agent quotidien)' }))
    const first = rotateReview(text, { today: TODAY })
    const second = rotateReview(first.text, { today: TODAY })
    expect(second.text).toBe(first.text)
    expect(second.archivedCount).toBe(0)
  })

  it('ne perd aucune ligne : corps conservé + archive = original (hors épingle et note)', () => {
    const text = file(sec('2026-08-01', { flagged: ['- **F** (cpu) : 1€ → 2€ (+100% vs référence)'] }), sec('2026-10-22'))
    const out = rotateReview(text, { today: TODAY })
    const body = out.text.slice(out.text.indexOf(PIN_END) + PIN_END.length)
    const rebuilt = [...Object.values(out.archive).flat(), body].join('')
    for (const line of text.split('\n').filter((l) => l.startsWith('- ') || l.startsWith('## '))) {
      expect(rebuilt).toContain(line)
    }
  })

  it('préserve les fins de ligne CRLF du fichier réel (aucun « \\n » isolé introduit)', () => {
    const crlf = file(sec('2026-08-01'), sec('2026-10-22')).replace(/\n/g, '\r\n')
    const out = rotateReview(crlf, { today: TODAY })
    expect(out.text.replace(/\r\n/g, '')).not.toContain('\n')
    for (const s of Object.values(out.archive).flat()) expect(s.replace(/\r\n/g, '')).not.toContain('\n')
  })

  it('ajoute au préambule une seule fois le renvoi vers l\'archive', () => {
    const once = rotateReview(file(sec('2026-08-01'), sec('2026-10-22')), { today: TODAY }).text
    const twice = rotateReview(once, { today: TODAY }).text
    expect(once.split(ARCHIVE_DIR)).toHaveLength(2)
    expect(twice.split(ARCHIVE_DIR)).toHaveLength(2)
    expect(once.slice(0, once.indexOf(PIN_START))).toContain(ARCHIVE_DIR)
  })

  it('accepte un fichier vide ou sans section', () => {
    expect(rotateReview('', { today: TODAY }).archivedCount).toBe(0)
    expect(rotateReview('# Écarts de prix à vérifier\n\n', { today: TODAY }).text).toContain('# Écarts de prix à vérifier')
  })
})

describe('mergeArchive', () => {
  const s1 = sec('2026-09-01')
  const s2 = sec('2026-09-02')

  it('crée le fichier du mois avec un titre, puis ajoute les sections', () => {
    const out = mergeArchive(null, '2026-09', [s1, s2])
    expect(out.startsWith('# Archive PRICE_REVIEW — 2026-09')).toBe(true)
    expect(out.indexOf('## 2026-09-01')).toBeLessThan(out.indexOf('## 2026-09-02'))
    expect(out.endsWith('\n')).toBe(true)
  })

  it('n\'ajoute pas deux fois une section déjà archivée (reprise après interruption)', () => {
    const once = mergeArchive(null, '2026-09', [s1])
    const again = mergeArchive(once, '2026-09', [s1, s2])
    expect(again.split('## 2026-09-01')).toHaveLength(2)
    expect(again).toContain('## 2026-09-02')
    expect(mergeArchive(again, '2026-09', [s1, s2])).toBe(again)
  })

  it('compare les sections sans tenir compte du type de fin de ligne', () => {
    const once = mergeArchive(null, '2026-09', [s1])
    expect(mergeArchive(once, '2026-09', [s1.replace(/\n/g, '\r\n')])).toBe(once)
  })
})

describe('planReviewRotation : fichiers à écrire', () => {
  it('renvoie PRICE_REVIEW.md réduit et un fichier d\'archive par mois, en complétant l\'existant', async () => {
    const root = await makeRepo()
    await mkdir(path.join(root, ARCHIVE_DIR), { recursive: true })
    await writeFile(path.join(root, ARCHIVE_DIR, '2026-08.md'), mergeArchive(null, '2026-08', [sec('2026-08-01')]))
    const text = file(sec('2026-08-01'), sec('2026-08-02'), sec('2026-09-05'), sec('2026-10-22'))
    const plan = await planReviewRotation({ root, text, today: TODAY })
    expect(plan.archivedCount).toBe(3)
    expect(Object.keys(plan.files).sort()).toEqual(['PRICE_REVIEW.md', `${ARCHIVE_DIR}/2026-08.md`, `${ARCHIVE_DIR}/2026-09.md`])
    const aug = plan.files[`${ARCHIVE_DIR}/2026-08.md`]
    expect(aug.split('## 2026-08-01')).toHaveLength(2) // pas de doublon avec l'existant
    expect(aug).toContain('## 2026-08-02')
    expect(plan.files['PRICE_REVIEW.md']).not.toContain('## 2026-08-02')
    expect(plan.files['PRICE_REVIEW.md']).toContain('## 2026-10-22')
  })

  it('sans rien à archiver, ne produit pas de fichier d\'archive', async () => {
    const root = await makeRepo()
    const plan = await planReviewRotation({ root, text: file(sec('2026-10-22')), today: TODAY })
    expect(Object.keys(plan.files)).toEqual(['PRICE_REVIEW.md'])
    expect(await read(root, 'src/data/cpus.ts')).toBeTruthy()
  })
})

describe('rotate-review.mjs : lancement manuel', () => {
  it('--dry-run n\'écrit rien ; sans option, applique la rotation avec sauvegarde', async () => {
    const { rotateReviewCli } = await import('../rotate-review.mjs')
    const root = await makeRepo()
    await writeFile(path.join(root, 'PRICE_REVIEW.md'), file(sec('2026-08-01'), sec('2026-10-22')))
    const before = await read(root, 'PRICE_REVIEW.md')

    const dry = await rotateReviewCli({ root, argv: ['--dry-run', '--today', TODAY], log: () => {} })
    expect(dry.archivedCount).toBe(1)
    expect(await read(root, 'PRICE_REVIEW.md')).toBe(before)

    await rotateReviewCli({ root, argv: ['--today', TODAY], log: () => {} })
    expect(await read(root, 'PRICE_REVIEW.md')).not.toContain('## 2026-08-01')
    expect(await read(root, `${ARCHIVE_DIR}/2026-08.md`)).toContain('## 2026-08-01')
    expect(await read(root, '.agent-backup/rotate-2026-10-23/PRICE_REVIEW.md')).toBe(before)
  })

  it('refuse une date ou une durée invalide', async () => {
    const { rotateReviewCli } = await import('../rotate-review.mjs')
    const root = await makeRepo()
    await expect(rotateReviewCli({ root, argv: ['--today', 'hier'], log: () => {} })).rejects.toThrow(/Usage/)
    await expect(rotateReviewCli({ root, argv: ['--keep', '-3'], log: () => {} })).rejects.toThrow(/Usage/)
  })
})
