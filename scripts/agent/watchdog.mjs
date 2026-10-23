#!/usr/bin/env node
// Chien de garde (agent-watchdog.yml), lancé après 10 h Paris : vérifie que
// l'agent a terminé AVANT 10 h aujourd'hui. Sinon : alerte (issue) et relance
// de l'agent si aucune exécution n'est en cours. Le lundi, ouvre aussi le
// rappel hebdomadaire de relecture humaine (ancien job « weekly reminder » qui
// échouait faute de libellé : le libellé est maintenant créé s'il manque).

import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { activeAgentRuns, dispatchAgent, ghCli, openIssueOnce } from './lib/github.mjs'
import { FINAL_STATUSES } from './lib/report.mjs'
import { parisToUtc, parisYmd } from './lib/time.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

/**
 * Évalue la situation à l'instant `now`. Fonction pure.
 * @returns {{level:'ok'|'tot'|'en-retard'|'partiel'|'absent', relaunch:boolean, title?:string, message:string}}
 */
export function evaluateWatchdog({ now, report, activeRuns }) {
  const day = parisYmd(now)
  const tenAt = parisToUtc(day, '10:00')
  if (now < tenAt) return { level: 'tot', relaunch: false, message: 'Avant 10 h Paris : rien à contrôler.' }
  if (report && FINAL_STATUSES.has(report.status)) {
    if (report.finishedBeforeTenParis) {
      return { level: 'ok', relaunch: false, message: `Agent terminé à ${report.finishedParis} (statut ${report.status}).` }
    }
    return {
      level: 'en-retard',
      relaunch: false,
      title: `Agent prix ${day} : terminé APRÈS 10 h (Paris)`,
      message: `Fin constatée à ${report.finishedParis} : échéance de 10 h dépassée.`,
    }
  }
  const relaunch = activeRuns === 0
  if (report) {
    return {
      level: 'partiel',
      relaunch,
      title: `Agent prix ${day} : pas terminé à 10 h (statut ${report.status})`,
      message: `Statut ${report.status} à ${report.finishedParis}. ${relaunch ? 'Relance de l\'agent pour reprise.' : 'Une exécution est déjà en cours.'}`,
    }
  }
  return {
    level: 'absent',
    relaunch,
    title: `Agent prix ${day} : aucune exécution terminée à 10 h`,
    message: relaunch
      ? 'Aucun rapport du jour : les déclencheurs planifiés n\'ont pas abouti. Relance de l\'agent.'
      : 'Aucun rapport du jour, mais une exécution est en cours ou en attente.',
  }
}

async function main() {
  const now = new Date()
  const day = parisYmd(now)
  let report = null
  try {
    report = JSON.parse(await readFile(path.join(root, 'agent-data/reports', `${day}.json`), 'utf8'))
  } catch {
    report = null
  }
  const activeRuns = await activeAgentRuns(ghCli).catch(() => 0)
  const verdict = evaluateWatchdog({ now, report, activeRuns })
  console.log(`[chien de garde] ${verdict.level} — ${verdict.message}`)
  if (verdict.title) {
    await openIssueOnce(ghCli, { title: verdict.title, body: verdict.message, label: 'agent-alerte', description: 'Alerte de l\'agent quotidien de prix' })
  }
  if (verdict.relaunch) {
    await dispatchAgent(ghCli)
    console.log('Agent relancé (workflow_dispatch).')
  }

  // Rappel hebdomadaire de relecture humaine : le lundi (jour civil parisien).
  const weekday = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Paris', weekday: 'short' }).format(now)
  if (weekday === 'Mon') {
    await openIssueOnce(ghCli, {
      title: `Vérification manuelle hebdomadaire des prix (${day})`,
      body: 'Contrôle hebdomadaire recommandé : relire les rapports de l\'agent (dossier agent-data/reports/, rubrique « À vérifier manuellement ») et PRICE_REVIEW.md, puis repasser une vérification croisée (LeBonCoin) sur quelques modèles clés.',
      label: 'price-review',
      color: '0e8a16',
      description: 'Relecture humaine des prix',
    })
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err)
    process.exitCode = 1
  })
}
