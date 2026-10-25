#!/usr/bin/env node
// Agent quotidien de vérification des prix et du catalogue.
//
// Ordre d'exécution (voir docs/AGENT.md) :
//   1. vérifier que la base (fichiers) et la source de prix sont accessibles ;
//   2. charger tout le catalogue ;
//   3. vérifier les prix existants (par lots, avec points de sauvegarde) ;
//   4. mesurer les tarifs RAM / stockage ;
//   5. rechercher les composants manquants ;
//   6. contrôler la cohérence (doublons, prix absents/obsolètes, formulaire) ;
//   7. écrire les données validées (transaction atomique) ;
//   8. produire le rapport et confirmer l'heure de fin.
//
// Usage : node scripts/agent/run.mjs [--dry-run] [--force]
// Variables : EBAY_CLIENT_ID, EBAY_CLIENT_SECRET (secrets), AGENT_WEBHOOK_URL
// (facultatif), AGENT_WINDOW_END (HH:MM Paris, défaut 09:45), AGENT_MAX_MINUTES
// (défaut 40).

import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { genuineListings, summarizePrices, round2 } from '../lib/pricing.mjs'
import { CATEGORIES, checkEntries, findDuplicates, itemKey, loadCatalogue, normalizeKey } from './lib/catalogue.mjs'
import { confirmOnWikipedia, evaluateCandidate, MAX_ADDS_PER_RUN, nearDuplicateOf, tallyCandidates } from './lib/discovery.mjs'
import { EBAY_CATEGORIES, createEbayClient } from './lib/ebay.mjs'
import { checkFormCoverage } from './lib/forms.mjs'
import { notify } from './lib/notify.mjs'
import { MAX_ATTEMPTS, MAX_REQUESTS_PER_RUN, TRUSTED_ASSOCIATIONS, loadRequests, parseRequest } from './lib/requests.mjs'
import {
  RAM_PROBES,
  STORAGE_PROBES,
  filterRamListings,
  filterStorageListings,
  parseRates,
  ramQuery,
  ratePerGo,
  storageQuery,
} from './lib/ramstorage.mjs'
import { FINAL_STATUSES, computeStatus, publicStatus, renderMarkdown } from './lib/report.mjs'
import { ARCHIVE_DIR, REVIEW_FILE, planReviewRotation } from './lib/rotate-review.mjs'
import { acquireLock, createTransaction, mergeJsonl, readJsonStrict, readText } from './lib/store.mjs'
import { decidePrice } from './lib/verify.mjs'
import { formatParis, parisToUtc, parisYmd } from './lib/time.mjs'

const DATA_DIR = 'agent-data'
export const STALE_DAYS = 45
const CHECKPOINT_EVERY = 40
const CONCURRENCY = 3
const VERIFY_RESERVE_MIN = 8 // temps gardé pour RAM/stockage, découverte et écriture finale

const LIMITS = [
  'Les prix eBay sont des prix DEMANDÉS (annonces actives), jamais des prix de vente constatés.',
  'Aucune API de fabricant ou de boutique neuve n\'est connectée : le prix neuf est le prix demandé eBay (état « Neuf »), indicatif.',
  'Cartes mères, alimentations, boîtiers et refroidissements ne sont valorisés que par forfait (secondary.ts) : non vérifiables modèle par modèle.',
  'Les attributs des composants ajoutés (tier, facilité de revente, décote, socket) sont hérités d\'un composant voisin et marqués comme estimés.',
]

const DISCOVERY_QUERIES = [
  ['Intel Core i3 processeur', 'cpu'],
  ['Intel Core i5 processeur', 'cpu'],
  ['Intel Core i7 processeur', 'cpu'],
  ['Intel Core i9 processeur', 'cpu'],
  ['Intel Core Ultra processeur', 'cpu'],
  ['AMD Ryzen 3 processeur', 'cpu'],
  ['AMD Ryzen 5 processeur', 'cpu'],
  ['AMD Ryzen 7 processeur', 'cpu'],
  ['AMD Ryzen 9 processeur', 'cpu'],
  ['NVIDIA GeForce RTX carte graphique', 'gpu'],
  ['NVIDIA GeForce GTX carte graphique', 'gpu'],
  ['AMD Radeon RX carte graphique', 'gpu'],
  ['Intel Arc carte graphique', 'gpu'],
]
const DISCOVERY_SORTS = [null, 'newlyListed']

async function pool(items, concurrency, shouldStop, worker) {
  let next = 0
  const runners = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (next < items.length && !shouldStop()) {
      const item = items[next]
      next += 1
      await worker(item)
    }
  })
  await Promise.all(runners)
  return next // nombre d'éléments démarrés
}

export async function runAgent(opts = {}) {
  const {
    root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..'),
    env = process.env,
    now = () => new Date(),
    fetchImpl = globalThis.fetch,
    sleep,
    log = (...a) => console.log(...a),
    dryRun = false,
    force = false,
    ebay: injectedEbay,
    confirm: injectedConfirm,
    requests: injectedRequests,
    fsOps,
    checkpointEvery = CHECKPOINT_EVERY,
    minIntervalMs,
  } = opts

  const startedAt = now()
  const day = parisYmd(startedAt)
  const windowEnd = env.AGENT_WINDOW_END || '09:45'
  const maxMinutes = Number(env.AGENT_MAX_MINUTES) || 40
  const windowEndAt = parisToUtc(day, windowEnd)
  const tenAt = parisToUtc(day, '10:00')
  const inWindow = startedAt < windowEndAt
  const deadlineAt = inWindow
    ? new Date(Math.min(windowEndAt.getTime(), startedAt.getTime() + maxMinutes * 60000))
    : new Date(startedAt.getTime() + Math.min(maxMinutes, 25) * 60000)
  const verifyDeadline = new Date(deadlineAt.getTime() - VERIFY_RESERVE_MIN * 60000)
  const runStamp = startedAt.toISOString().slice(11, 19).replace(/:/g, '')
  const runId = `${day}-${runStamp}`

  const reportJsonRel = `${DATA_DIR}/reports/${day}.json`
  const reportMdRel = `${DATA_DIR}/reports/${day}.md`
  const stateRel = `${DATA_DIR}/state.json`
  const historyRel = `${DATA_DIR}/history/${day.slice(0, 7)}.jsonl`
  const addedRels = { cpu: CATEGORIES.cpu.added, gpu: CATEGORIES.gpu.added }
  const overrideRels = { cpu: CATEGORIES.cpu.overrides, gpu: CATEGORIES.gpu.overrides }
  const ramOverRel = 'src/data/agent/ramOverrides.json'
  const storageOverRel = 'src/data/agent/storageOverrides.json'
  const statusRel = 'src/data/agent/status.json'

  // --- idempotence : un rapport définitif existe déjà pour ce jour ---
  const existingReport = await readJsonStrict(path.join(root, reportJsonRel), null)
  if (existingReport && FINAL_STATUSES.has(existingReport.status) && !force) {
    log(`Agent : le rapport du ${day} est déjà définitif (${existingReport.status}) — rien à faire.`)
    return { status: 'deja-fait', exitCode: 0, report: existingReport }
  }

  // --- anti-exécution simultanée (lancement local / manuel) ---
  const lock = await acquireLock(path.join(root, '.agent-lock'), { now: () => now().getTime(), owner: runId })
  if (!lock.acquired) {
    log(`Agent : une autre exécution est en cours (${lock.heldBy}) — abandon sans rien modifier.`)
    return { status: 'deja-en-cours', exitCode: 0 }
  }

  const tx = createTransaction({ root, backupDir: path.join(root, '.agent-backup', runId), fsOps })
  const warnings = []
  const errors = []
  const manualReview = []
  const sources = []
  const counters = {
    verified: 0, updated: 0, updatedToReview: 0, pending: 0, insufficient: 0, rejected: 0, sourceUnavailable: 0, ramStorageUnavailable: 0, unprocessed: 0, skippedToday: 0,
  }
  const priceReviewLines = { rejected: [], flagged: [] }
  const history = []
  const added = []
  const ramStorage = []
  const requestResults = []
  let fatal = null
  let catalogue = null
  let ebay = null

  const finish = async (extra = {}) => {
    const finishedAt = now()
    const issues = catalogue
      ? checkEntries(catalogue.entries, catalogue.overrides, { today: day, staleDays: STALE_DAYS })
      : []
    const absentOrObsolete = issues.filter((i) => i.kind === 'prix-absent' || i.kind === 'prix-obsolete')
    const anomalies = issues.filter((i) => !['prix-absent', 'prix-obsolete'].includes(i.kind))
    const unprocessed = counters.unprocessed
    const statusWarnings = [...warnings]
    if (counters.sourceUnavailable > 0) statusWarnings.push(`${counters.sourceUnavailable} composant(s) non vérifiés : source indisponible`)
    if (counters.ramStorageUnavailable > 0) statusWarnings.push(`${counters.ramStorageUnavailable} tarif(s) RAM/stockage non mesurés : source indisponible`)
    if (counters.rejected > 0) statusWarnings.push(`${counters.rejected} prix rejeté(s) comme aberrants (valeur conservée)`)
    if (anomalies.length > 0) statusWarnings.push(`${anomalies.length} anomalie(s) de cohérence du catalogue`)
    if (!inWindow) statusWarnings.push(`exécution démarrée après ${windowEnd} (Paris) : la contrainte de fin avant 10 h n'était plus garantie`)
    if (finishedAt > tenAt && startedAt < tenAt) statusWarnings.push('DÉPASSEMENT : exécution terminée après 10 h (Paris)')
    if (errors.length > 0) statusWarnings.push(`${errors.length} erreur(s) non bloquante(s)`)
    const status = computeStatus({ fatal: Boolean(fatal), unprocessed, warnings: statusWarnings })

    const report = {
      schema: 1,
      date: day,
      runId,
      trigger: env.GITHUB_EVENT_NAME || 'local',
      runUrl: env.GITHUB_SERVER_URL && env.GITHUB_RUN_ID ? `${env.GITHUB_SERVER_URL}/${env.GITHUB_REPOSITORY}/actions/runs/${env.GITHUB_RUN_ID}` : null,
      dryRun,
      status,
      startedAt: startedAt.toISOString(),
      finishedAt: finishedAt.toISOString(),
      startedParis: formatParis(startedAt),
      finishedParis: formatParis(finishedAt),
      durationSec: Math.round((finishedAt - startedAt) / 1000),
      deadlineParis: formatParis(deadlineAt),
      windowEndParis: formatParis(windowEndAt),
      startedInWindow: inWindow,
      finishedBeforeTenParis: finishedAt < tenAt,
      staleDays: STALE_DAYS,
      counts: {
        catalogue: catalogue?.entries.length ?? 0,
        verified: counters.verified,
        updated: counters.updated,
        updatedToReview: counters.updatedToReview,
        pending: counters.pending,
        insufficient: counters.insufficient,
        rejected: counters.rejected,
        sourceUnavailable: counters.sourceUnavailable,
        ramStorageUnavailable: counters.ramStorageUnavailable,
        unprocessed,
        added: added.length,
        missingDetected: manualReview.filter((m) => m.kind === 'composant-manquant').length,
        absentOrObsolete: absentOrObsolete.length,
        anomalies: anomalies.length,
      },
      sources,
      warnings: statusWarnings,
      errors,
      fatal,
      added: added.map((a) => ({ category: a.category, ...a.record, ...a.record.agent, annoncesVues: a.record.agent.annoncesVues, attributsEstimes: a.record.agent.attributsEstimes })),
      ramStorage,
      requests: requestResults,
      manualReview: [
        ...manualReview,
        ...anomalies.map((i) => ({ kind: i.kind, key: i.key, nom: i.nom, reason: i.detail })),
      ],
      absentOrObsolete: absentOrObsolete.map((i) => ({ key: i.key, nom: i.nom, detail: i.detail })),
      limits: LIMITS,
      ...extra,
    }

    if (!dryRun) {
      try {
        // PRICE_REVIEW.md : même format que l'ancien pipeline (la routine de
        // vérification IA lit la section « Rejetés »).
        const reviewPath = path.join(root, REVIEW_FILE)
        if (priceReviewLines.rejected.length || priceReviewLines.flagged.length) {
          const existing = (await readText(reviewPath, '# Écarts de prix à vérifier\n\n')) ?? ''
          const marker = `## ${day} (agent quotidien)`
          if (!existing.includes(marker)) {
            const lines = [marker, '']
            if (priceReviewLines.rejected.length) lines.push('### Rejetés (écart trop important, valeur inchangée)', '', ...priceReviewLines.rejected, '')
            if (priceReviewLines.flagged.length) lines.push('### Écarts notables acceptés (à vérifier)', '', ...priceReviewLines.flagged, '')
            tx.stage(REVIEW_FILE, existing + lines.join('\n'))
          }
        }
        // Rotation : sections de plus de 30 jours -> docs/price-review-archive/.
        // Non bloquante : en cas d'échec le fichier reste tel quel (avertissement).
        try {
          const reviewText = tx.peek(REVIEW_FILE) ?? (await readText(reviewPath, null))
          if (reviewText !== null) {
            const plan = await planReviewRotation({ root, text: reviewText, today: day })
            for (const [rel, content] of Object.entries(plan.files)) tx.stage(rel, content)
            if (plan.archivedCount > 0) log(`Agent : ${plan.archivedCount} section(s) de ${REVIEW_FILE} archivée(s) dans ${ARCHIVE_DIR}/.`)
          }
        } catch (err) {
          report.warnings.push(`rotation de ${REVIEW_FILE} impossible : ${err.message}`)
          if (report.status === 'termine') report.status = 'termine_avec_avertissements'
        }
        const historyText = await readText(path.join(root, historyRel), '')
        const merged = mergeJsonl(historyText, history, (r) => `${r.date}|${r.key}`)
        if (merged.added > 0) tx.stage(historyRel, merged.text)
        tx.stageJson(reportJsonRel, report)
        tx.stage(reportMdRel, renderMarkdown(report))
        tx.stage(`${DATA_DIR}/latest.md`, renderMarkdown(report))
        if (!fatal || status !== 'echec') tx.stageJson(statusRel, publicStatus(report))
        await tx.commit()
      } catch (err) {
        errors.push(`écriture finale impossible : ${err.message}`)
        report.status = 'echec'
        report.errors = errors
        report.fatal = report.fatal ?? `écriture finale impossible : ${err.message}`
      }
    }
    await lock.release()
    const notif = await notify(report, { env, fetchImpl })
    report.notification = notif
    if (dryRun) log(renderMarkdown(report))
    log(`Agent ${day} : ${report.status} — ${report.counts.verified}/${report.counts.catalogue} vérifiés, ${report.counts.updated} mis à jour, ${report.counts.added} ajoutés, fin ${report.finishedParis}`)
    return { status: report.status, exitCode: FINAL_STATUSES.has(report.status) ? 0 : 1, report }
  }

  try {
    // --- 1-2. base accessible + catalogue complet ---
    try {
      catalogue = await loadCatalogue(root)
    } catch (err) {
      fatal = `catalogue illisible : ${err.message}`
      errors.push(fatal)
      return await finish()
    }
    if (catalogue.entries.length === 0) {
      fatal = 'catalogue vide : rien à vérifier'
      errors.push(fatal)
      return await finish()
    }
    if (catalogue.skipped.length) {
      warnings.push(`${catalogue.skipped.length} fiche(s) du catalogue illisibles ou incomplètes ignorées : ${catalogue.skipped.join(', ')}`)
    }
    const state = await readJsonStrict(path.join(root, stateRel), { version: 1, items: {}, missing: {}, rates: {} })
    state.items ??= {}
    state.missing ??= {}
    state.rates ??= {}
    const ramOver = await readJsonStrict(path.join(root, ramOverRel), {})
    const storageOver = await readJsonStrict(path.join(root, storageOverRel), {})
    const overridesTouched = { cpu: false, gpu: false }

    ebay =
      injectedEbay ??
      createEbayClient({
        clientId: env.EBAY_CLIENT_ID,
        clientSecret: env.EBAY_CLIENT_SECRET,
        fetchImpl,
        sleep,
        ...(minIntervalMs !== undefined ? { minIntervalMs } : {}),
      })
    const ping = await ebay.ping()
    if (!ping.ok) {
      sources.push({ name: 'eBay Browse (FR)', status: 'indisponible', detail: ping.error })
      fatal = `source de prix inaccessible : ${ping.error}`
      errors.push(fatal)
      return await finish()
    }

    // contrôles de cohérence préalables (sans réseau)
    const dups = findDuplicates(catalogue.entries)
    for (const d of dups) manualReview.push({ kind: 'doublon', key: d.key, nom: d.key, reason: `doublon (${d.type}) : ${d.ids.join(' / ')}` })
    try {
      const read = (rel) => readFile(path.join(root, rel), 'utf8')
      const formIssues = checkFormCoverage({
        types: await read('src/types/index.ts'),
        ramFields: await read('src/components/RamFields.tsx'),
        storageList: await read('src/components/StorageList.tsx'),
        ram: await read('src/data/ram.ts'),
        storage: await read('src/data/storage.ts'),
      })
      for (const i of formIssues) manualReview.push({ kind: i.kind, key: 'formulaire', nom: 'Formulaire / catalogue', reason: i.detail })
    } catch (err) {
      warnings.push(`contrôle formulaire/catalogue impossible : ${err.message}`)
    }

    // --- 3. vérification des prix existants (reprise possible) ---
    const stageProgress = () => {
      for (const cat of Object.keys(CATEGORIES)) {
        if (overridesTouched[cat]) tx.stageJson(overrideRels[cat], sortKeys(catalogue.overrides[cat]))
      }
      state.updatedAt = now().toISOString()
      tx.stageJson(stateRel, state)
    }
    let sinceCheckpoint = 0
    let checkpointChain = Promise.resolve()
    const checkpoint = () => {
      if (dryRun) return checkpointChain
      checkpointChain = checkpointChain.then(async () => {
        stageProgress()
        await tx.commit()
      })
      return checkpointChain
    }

    const queue = catalogue.entries
      .filter((e) => {
        if (state.items[itemKey(e)]?.checkedOn === day) {
          counters.skippedToday += 1
          return false
        }
        return true
      })
      .sort((a, b) => {
        const la = state.items[itemKey(a)]?.lastVerifiedOn ?? '0000'
        const lb = state.items[itemKey(b)]?.lastVerifiedOn ?? '0000'
        return la === lb ? (b.faciliteRevente ?? 0) - (a.faciliteRevente ?? 0) : la < lb ? -1 : 1
      })
    if (counters.skippedToday > 0) log(`Agent : reprise — ${counters.skippedToday} composant(s) déjà vérifiés aujourd'hui.`)

    let timeCut = false
    const started = await pool(
      queue,
      CONCURRENCY,
      () => {
        if (ebay.stats.circuitOpen) return true
        if (now() >= verifyDeadline) {
          timeCut = true
          return true
        }
        return false
      },
      async (entry) => {
        const key = itemKey(entry)
        const st = (state.items[key] ??= {})
        const categoryId = EBAY_CATEGORIES[entry.category]
        const used = await ebay.search(entry.nom, { condition: 'used', categoryId })
        let candidate = null
        let newStats = null
        if (used.ok) {
          candidate = summarizePrices(genuineListings(used.items, entry.nom).map((i) => i.price))
          const neu = await ebay.search(entry.nom, { condition: 'new', categoryId })
          if (neu.ok) newStats = summarizePrices(genuineListings(neu.items, entry.nom).map((i) => i.price))
        }
        const overrides = catalogue.overrides[entry.category]
        const effective = overrides[entry.id]?.moyen ?? entry.baseMoyen
        const decision = decidePrice({
          entry,
          effectiveMoyen: effective,
          candidate,
          sourceOk: used.ok,
          newPrice: newStats,
          pending: st.pending ?? null,
          today: day,
        })

        st.status = decision.status
        st.pending = decision.pending ?? null
        st.reason = decision.reason
        if (newStats) st.neuf = { moyen: newStats.moyen, sampleCount: newStats.sampleCount, on: day }
        if (used.ok) {
          st.checkedOn = day
          if (candidate) {
            st.lastVerifiedOn = day
            counters.verified += 1
          }
          st.failures = 0
        } else {
          st.failures = (st.failures ?? 0) + 1
          counters.sourceUnavailable += 1
          counters.unprocessed += 1
        }

        if (decision.action === 'update') {
          overrides[entry.id] = {
            min: candidate.min,
            moyen: candidate.moyen,
            max: candidate.max,
            dateMaj: day,
            sampleCount: candidate.sampleCount,
            rawCount: used.items.length,
          }
          overridesTouched[entry.category] = true
          if (candidate.moyen !== effective) st.lastChangedOn = day
          counters.updated += 1
          if (decision.flag) {
            counters.updatedToReview += 1
            priceReviewLines.flagged.push(`- **${entry.nom}** (${entry.category}) : ${effective}€ → ${candidate.moyen}€ (${Math.round(((candidate.moyen - entry.baseMoyen) / entry.baseMoyen) * 100)}% vs référence)`)
            manualReview.push({ kind: 'ecart-notable', key, nom: entry.nom, reason: decision.reason })
          }
        } else if (decision.status === 'rejete') {
          counters.rejected += 1
          priceReviewLines.rejected.push(`- **${entry.nom}** (${entry.category}) : ${effective}€ conservé, eBay proposait ${candidate?.moyen}€ (${candidate && candidate.moyen > effective ? '+' : ''}${round2(((candidate?.moyen ?? 0) - effective) / effective * 100)}%)`)
          manualReview.push({ kind: 'prix-rejete', key, nom: entry.nom, reason: decision.reason })
        } else if (decision.status === 'en-attente-confirmation') {
          counters.pending += 1
        } else if (decision.status === 'donnees-insuffisantes') {
          counters.insufficient += 1
        } else if (decision.status === 'source-indisponible') {
          manualReview.push({ kind: 'source-indisponible', key, nom: entry.nom, reason: used.error ?? decision.reason })
        }
        if (candidate) {
          history.push({ date: day, key, min: candidate.min, moyen: candidate.moyen, max: candidate.max, n: candidate.sampleCount, neuf: newStats?.moyen ?? null, decision: decision.status })
        }

        sinceCheckpoint += 1
        if (sinceCheckpoint >= checkpointEvery) {
          sinceCheckpoint = 0
          await checkpoint()
        }
      },
    )
    await checkpointChain
    const notStarted = queue.length - started
    if (notStarted > 0) {
      counters.unprocessed += notStarted
      const reason = ebay.stats.circuitOpen ? 'source eBay déclarée indisponible (échecs consécutifs)' : timeCut ? 'échéance de travail atteinte' : 'arrêt anticipé'
      warnings.push(`${notStarted} composant(s) non traités : ${reason}`)
    }
    sources.push({
      name: 'eBay Browse (FR)',
      status: ebay.stats.circuitOpen ? 'indisponible (disjoncteur)' : counters.sourceUnavailable ? 'partiellement disponible' : 'disponible',
      detail: `${ebay.stats.calls} requêtes, ${ebay.stats.retries} nouvelle(s) tentative(s), ${ebay.stats.failures} échec(s) ; prix demandés d'occasion et neufs`,
    })

    // --- 3b. demandes d'ajout faites depuis l'application ---
    {
      state.requests ??= {}
      let pendingRequests = []
      try {
        const loaded = injectedRequests ? { requests: injectedRequests, note: null } : await loadRequests(env)
        pendingRequests = loaded.requests
        if (loaded.note) sources.push({ name: "Demandes d'ajout (issues GitHub)", status: 'non lues', detail: loaded.note })
      } catch (err) {
        warnings.push(`demandes d'ajout illisibles : ${err.message}`)
      }
      const known = new Map(catalogue.entries.map((e) => [`${e.category}:${normalizeKey(e.nom)}`, e.nom]))
      const confirmRequest = injectedConfirm ?? ((core) => confirmOnWikipedia(core, { fetchImpl }))
      let handled = 0
      for (const req of pendingRequests) {
        if (!TRUSTED_ASSOCIATIONS.has(req.authorAssociation)) continue // dépôt public : demandes d'inconnus ignorées
        if (handled >= MAX_REQUESTS_PER_RUN || now() >= new Date(deadlineAt.getTime() - 6 * 60000)) break
        handled += 1
        const st = (state.requests[req.number] ??= { firstSeen: day, attempts: 0 })
        const result = { number: req.number, demande: String(req.title).slice(0, 120), notify: false }
        const parsed = parseRequest(req)
        if (parsed.error) {
          Object.assign(result, { outcome: 'non-reconnu', nom: '(inconnu)', reason: parsed.error, notify: st.lastReason !== parsed.error })
          st.lastReason = parsed.error
          requestResults.push(result)
          continue
        }
        const cand = parsed.model
        const key = `${cand.category}:${normalizeKey(cand.nom)}`
        result.nom = cand.nom
        if (known.has(key)) {
          Object.assign(result, { outcome: 'deja-present', nom: known.get(key), notify: true })
          requestResults.push(result)
          continue
        }
        const verdict = await evaluateCandidate(
          { ...cand, requested: true, listingCount: 0, sellerCount: 0, nearDuplicateOf: nearDuplicateOf(key, known) },
          { search: (q, o) => ebay.search(q, o), confirm: confirmRequest, entries: catalogue.entries, today: day },
        )
        st.attempts += 1
        if (verdict.verdict === 'ajouter') {
          const record = verdict.record
          const cat = cand.category
          if (catalogue.entries.some((e) => e.category === cat && e.id === record.id)) {
            Object.assign(result, { outcome: 'a-verifier', reason: `identifiant ${record.id} déjà utilisé`, notify: false })
          } else {
            catalogue.added[cat] = [...catalogue.added[cat], record]
            catalogue.entries.push({
              id: record.id, nom: record.nom, category: cat, origin: 'agent', marque: record.marque, socket: record.socket, vramGo: record.vramGo,
              baseMin: record.min, baseMoyen: record.moyen, baseMax: record.max, baseDateMaj: record.dateMaj,
              faciliteRevente: record.faciliteRevente, decoteAnciennete: record.decoteAnciennete, tier: record.tier,
            })
            known.set(key, record.nom)
            state.items[`${cat}:${record.id}`] = { checkedOn: day, lastVerifiedOn: day, status: 'ajoute', pending: null }
            added.push({ category: cat, record })
            history.push({ date: day, key: `${cat}:${record.id}`, min: record.min, moyen: record.moyen, max: record.max, n: record.agent.echantillons, neuf: record.agent.prixNeufIndicatif, decision: 'ajoute' })
            Object.assign(result, { outcome: 'ajoute', detail: `${record.moyen} €, fourchette ${record.min}–${record.max} €, ${record.agent.echantillons} annonces`, notify: true })
          }
        } else {
          const reason = verdict.reasons.join(' ; ')
          const giveUp = st.attempts >= MAX_ATTEMPTS && !verdict.retryable
          Object.assign(result, { outcome: giveUp ? 'abandonne' : 'a-verifier', reason, notify: giveUp || st.lastReason !== reason })
          st.lastReason = reason
          manualReview.push({ kind: 'demande-non-aboutie', key, nom: cand.nom, reason: `demande #${req.number} : ${reason}` })
        }
        requestResults.push(result)
      }
      if (!dryRun && added.length > 0) {
        for (const cat of Object.keys(CATEGORIES)) {
          if (catalogue.added[cat].length) tx.stageJson(addedRels[cat], catalogue.added[cat])
        }
      }
    }

    // --- 4. RAM / stockage ---
    {
      const ramBase = parseRates(await readFile(path.join(root, 'src/data/ram.ts'), 'utf8'), Object.keys(RAM_PROBES))
      const stBase = parseRates(await readFile(path.join(root, 'src/data/storage.ts'), 'utf8'), Object.keys(STORAGE_PROBES))
      const groups = [
        { prefix: 'ram', probes: RAM_PROBES, base: ramBase, over: ramOver, query: ramQuery, filter: filterRamListings, digits: 2, category: () => EBAY_CATEGORIES.ram },
        { prefix: 'stockage', probes: STORAGE_PROBES, base: stBase, over: storageOver, query: storageQuery, filter: filterStorageListings, digits: 3, category: (t) => (t === 'hdd' ? EBAY_CATEGORIES.hdd : EBAY_CATEGORIES.ssd) },
      ]
      const rsCutoff = new Date(deadlineAt.getTime() - 4 * 60000)
      for (const g of groups) {
        for (const [type, caps] of Object.entries(g.probes)) {
          const key = `${g.prefix}:${type}`
          if (state.items[key]?.checkedOn === day) continue
          if (now() >= rsCutoff || ebay.stats.circuitOpen) {
            counters.unprocessed += 1
            ramStorage.push({ key, status: 'non-traite', reason: ebay.stats.circuitOpen ? 'source indisponible' : 'échéance de travail atteinte' })
            continue
          }
          const byCap = {}
          let failed = false
          for (const cap of caps) {
            const res = await ebay.search(g.query(type, cap), { condition: 'used', categoryId: g.category(type) })
            if (!res.ok) {
              failed = true
              break
            }
            byCap[cap] = g.filter(res.items, type, cap)
          }
          const st = (state.items[key] ??= {})
          const baseRate = g.base[type]
          if (failed || baseRate === undefined) {
            ramStorage.push({ key, status: failed ? 'source-indisponible' : 'tarif-de-base-illisible', reason: failed ? 'recherche impossible' : 'tarif de base illisible dans le code source' })
            counters.unprocessed += 1
            if (failed) counters.ramStorageUnavailable += 1
            continue
          }
          const rate = ratePerGo(byCap)
          const current = g.over[type]?.prixParGo ?? baseRate
          const decision = decidePrice({
            entry: { baseMoyen: baseRate },
            effectiveMoyen: current,
            candidate: rate && rate.sampleCount >= 8 ? { moyen: rate.moyen, sampleCount: rate.sampleCount } : null,
            sourceOk: true,
            pending: st.pending ?? null,
            today: day,
          })
          st.checkedOn = day
          st.status = decision.status
          st.pending = decision.pending ?? null
          if (rate) st.lastVerifiedOn = day
          if (decision.action === 'update') {
            g.over[type] = { prixParGo: round3(rate.moyen, g.digits), dateMaj: day, sampleCount: rate.sampleCount }
            st.lastChangedOn = day
          }
          if (decision.status === 'rejete') {
            counters.rejected += 1
            manualReview.push({ kind: 'prix-rejete', key, nom: key, reason: decision.reason })
          }
          ramStorage.push({ key, status: decision.status, reason: decision.reason, moyen: rate?.moyen, sampleCount: rate?.sampleCount })
          if (rate) history.push({ date: day, key, min: rate.moyen, moyen: rate.moyen, max: rate.moyen, n: rate.sampleCount, neuf: null, decision: decision.status })
        }
      }
      if (!dryRun && (Object.keys(ramOver).length || Object.keys(storageOver).length)) {
        tx.stageJson(ramOverRel, sortKeys(ramOver))
        tx.stageJson(storageOverRel, sortKeys(storageOver))
      }
    }

    // --- 5. composants manquants ---
    if (now() < new Date(deadlineAt.getTime() - 3 * 60000) && !ebay.stats.circuitOpen) {
      const knownKeys = new Map(catalogue.entries.map((e) => [`${e.category}:${normalizeKey(e.nom)}`, e.nom]))
      const seenItems = new Map()
      let discoveryFailed = 0
      for (const [q, queryCategory] of DISCOVERY_QUERIES) {
        for (const sort of DISCOVERY_SORTS) {
          if (now() >= new Date(deadlineAt.getTime() - 3 * 60000)) break
          const res = await ebay.search(q, { condition: 'used', sort, categoryId: EBAY_CATEGORIES[queryCategory] })
          if (!res.ok) {
            discoveryFailed += 1
            continue
          }
          for (const it of res.items) seenItems.set(it.id ?? it.title, it)
        }
      }
      if (discoveryFailed > 0) warnings.push(`découverte : ${discoveryFailed} recherche(s) en échec`)
      const candidates = tallyCandidates([...seenItems.values()], knownKeys).sort((a, b) => b.listingCount - a.listingCount)
      const confirm = injectedConfirm ?? ((core) => confirmOnWikipedia(core, { fetchImpl }))
      const search = (q, o) => ebay.search(q, o)
      let evaluated = 0
      for (const cand of candidates) {
        if (cand.listingCount < 3) continue // bruit : pas même signalé
        if (evaluated >= 12 || now() >= new Date(deadlineAt.getTime() - 2 * 60000)) break
        evaluated += 1
        const key = cand.key
        const verdict = await evaluateCandidate(cand, { search, confirm, entries: catalogue.entries, today: day })
        const seen = (state.missing[key] ??= { firstSeen: day })
        seen.lastSeen = day
        seen.listingCount = cand.listingCount
        if (verdict.verdict === 'ajouter' && added.length < MAX_ADDS_PER_RUN) {
          const record = verdict.record
          const cat = cand.category
          const known = [...catalogue.added[cat]]
          if (known.some((a) => a.id === record.id) || catalogue.entries.some((e) => e.category === cat && e.id === record.id)) {
            manualReview.push({ kind: 'doublon', key, nom: record.nom, reason: `identifiant ${record.id} déjà utilisé : ajout annulé` })
            continue
          }
          catalogue.added[cat] = [...known, record]
          catalogue.entries.push({
            id: record.id, nom: record.nom, category: cat, origin: 'agent', marque: record.marque, socket: record.socket, vramGo: record.vramGo,
            baseMin: record.min, baseMoyen: record.moyen, baseMax: record.max, baseDateMaj: record.dateMaj,
            faciliteRevente: record.faciliteRevente, decoteAnciennete: record.decoteAnciennete, tier: record.tier,
          })
          state.items[`${cat}:${record.id}`] = { checkedOn: day, lastVerifiedOn: day, status: 'ajoute', pending: null }
          seen.addedOn = day
          added.push({ category: cat, record })
          history.push({ date: day, key: `${cat}:${record.id}`, min: record.min, moyen: record.moyen, max: record.max, n: record.agent.echantillons, neuf: record.agent.prixNeufIndicatif, decision: 'ajoute' })
        } else {
          const reason = verdict.verdict === 'ajouter' ? `limite de ${MAX_ADDS_PER_RUN} ajouts par run atteinte` : verdict.reasons.join(' ; ')
          manualReview.push({ kind: 'composant-manquant', key, nom: cand.nom, reason: `${cand.listingCount} annonce(s), ${cand.sellerCount} vendeur(s) — ${reason}` })
        }
      }
      sources.push({
        name: 'Wikipédia (confirmation d\'existence)',
        status: 'utilisée pour les candidats évalués',
        detail: 'API de recherche MediaWiki, extraits contenant le modèle exact',
      })
      if (!dryRun && added.length > 0) {
        for (const cat of Object.keys(CATEGORIES)) {
          if (catalogue.added[cat].length) tx.stageJson(addedRels[cat], catalogue.added[cat])
        }
      }
    } else if (!ebay.stats.circuitOpen) {
      warnings.push('découverte des composants manquants non exécutée : échéance de travail proche')
    }

    // promotion : un composant ajouté par l'agent figure désormais en base -> on retire la copie
    for (const cat of Object.keys(CATEGORIES)) {
      const baseKeys = new Set(catalogue.entries.filter((e) => e.category === cat && e.origin === 'base').map((e) => normalizeKey(e.nom)))
      const kept = catalogue.added[cat].filter((a) => !baseKeys.has(normalizeKey(a.nom)))
      if (kept.length !== catalogue.added[cat].length) {
        warnings.push(`${catalogue.added[cat].length - kept.length} composant(s) ajouté(s) par l'agent désormais présent(s) en base : copie retirée (${cat})`)
        catalogue.added[cat] = kept
        if (!dryRun) tx.stageJson(addedRels[cat], kept)
      }
    }

    stageProgress()
    return await finish()
  } catch (err) {
    fatal = `erreur inattendue : ${err?.stack ?? err}`
    errors.push(String(err?.message ?? err))
    try {
      return await finish()
    } catch (err2) {
      await lock.release()
      throw err2
    }
  }
}

const round3 = (v, digits) => Math.round(v * 10 ** digits) / 10 ** digits
const sortKeys = (obj) => Object.fromEntries(Object.entries(obj).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)))

// --- point d'entrée en ligne de commande ---
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = new Set(process.argv.slice(2))
  runAgent({ dryRun: args.has('--dry-run'), force: args.has('--force') })
    .then((r) => {
      process.exitCode = r.exitCode
    })
    .catch((err) => {
      console.error(err)
      process.exitCode = 1
    })
}
