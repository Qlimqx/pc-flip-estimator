#!/usr/bin/env node
// Rotation manuelle de PRICE_REVIEW.md (l'agent quotidien la fait déjà chaque jour).
//
// Usage : node scripts/agent/rotate-review.mjs [--dry-run] [--today AAAA-MM-JJ] [--keep N]
// Archive les sections de plus de N jours (30 par défaut) dans
// docs/price-review-archive/AAAA-MM.md et épingle le dernier « ### Rejetés » en tête.

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { ARCHIVE_DIR, REVIEW_FILE, REVIEW_KEEP_DAYS, planReviewRotation } from './lib/rotate-review.mjs'
import { createTransaction, readText } from './lib/store.mjs'
import { parisYmd } from './lib/time.mjs'

export async function rotateReviewCli({ root, argv = [], now = () => new Date(), log = console.log } = {}) {
  const arg = (name) => {
    const i = argv.indexOf(name)
    return i === -1 ? null : argv[i + 1]
  }
  const today = arg('--today') ?? parisYmd(now())
  const keepDays = arg('--keep') === null ? REVIEW_KEEP_DAYS : Number(arg('--keep'))
  if (!/^\d{4}-\d{2}-\d{2}$/.test(today) || !Number.isInteger(keepDays) || keepDays < 0) {
    throw new Error('Usage : rotate-review.mjs [--dry-run] [--today AAAA-MM-JJ] [--keep N]')
  }
  const text = await readText(path.join(root, REVIEW_FILE), null)
  if (text === null) {
    log(`${REVIEW_FILE} introuvable : rien à faire.`)
    return { archivedCount: 0, files: [] }
  }
  const plan = await planReviewRotation({ root, text, today, keepDays })
  const files = Object.keys(plan.files)
  const dryRun = argv.includes('--dry-run')
  if (!dryRun && files.length > 0) {
    const tx = createTransaction({ root, backupDir: path.join(root, '.agent-backup', `rotate-${today}`) })
    for (const [rel, content] of Object.entries(plan.files)) tx.stage(rel, content)
    await tx.commit()
  }
  const lines = (s) => s.split('\n').length
  log(`${dryRun ? '[simulation] ' : ''}${plan.archivedCount} section(s) de plus de ${keepDays} jours archivée(s) dans ${ARCHIVE_DIR}/ ; ${REVIEW_FILE} : ${lines(text)} -> ${lines(plan.files[REVIEW_FILE] ?? text)} lignes.`)
  return { archivedCount: plan.archivedCount, files }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
  rotateReviewCli({ root, argv: process.argv.slice(2) }).catch((err) => {
    console.error(err.message)
    process.exitCode = 1
  })
}
