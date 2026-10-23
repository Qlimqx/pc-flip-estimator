#!/usr/bin/env node
// Alerte de fin de run (appelée par daily-agent.yml) : ouvre UNE issue par
// jour si l'agent n'a pas terminé proprement. Les statuts « terminé » et
// « terminé avec avertissements » n'ouvrent pas d'issue (le détail est dans le
// rapport) ; « partiel » et « échec » en ouvrent une, dédupliquée par date.

import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { ghCli, openIssueOnce } from './lib/github.mjs'
import { FINAL_STATUSES, STATUS_LABELS } from './lib/report.mjs'
import { parisYmd } from './lib/time.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

/** Décide s'il faut alerter : renvoie { title, body } ou null. Fonction pure. */
export function buildAlert({ day, report, agentOutcome, runUrl }) {
  if (report && FINAL_STATUSES.has(report.status)) {
    if (!report.finishedBeforeTenParis) {
      return {
        title: `Agent prix ${day} : terminé APRÈS 10 h (Paris)`,
        body: `Le rapport indique une fin à ${report.finishedParis}. ${runUrl ? `Exécution : ${runUrl}` : ''}`,
      }
    }
    return null
  }
  if (report) {
    return {
      title: `Agent prix ${day} : ${STATUS_LABELS[report.status] ?? report.status}`,
      body: [
        `Statut : **${report.status}** (début ${report.startedParis}, fin ${report.finishedParis}).`,
        report.fatal ? `Cause : ${report.fatal}` : `${report.counts.unprocessed} élément(s) non traités.`,
        'Les données déjà vérifiées sont conservées ; le prochain déclenchement reprend là où l\'agent s\'est arrêté.',
        runUrl ? `Exécution : ${runUrl}` : '',
      ]
        .filter(Boolean)
        .join('\n\n'),
    }
  }
  if (agentOutcome === 'failure') {
    return {
      title: `Agent prix ${day} : échec sans rapport`,
      body: `L'agent s'est arrêté avant d'écrire son rapport. ${runUrl ? `Voir les journaux : ${runUrl}` : ''}`,
    }
  }
  return null
}

async function main() {
  const day = parisYmd(new Date())
  let report = null
  try {
    report = JSON.parse(await readFile(path.join(root, 'agent-data/reports', `${day}.json`), 'utf8'))
  } catch {
    report = null
  }
  const runUrl = process.env.GITHUB_RUN_ID ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}` : ''
  const alert = buildAlert({ day, report, agentOutcome: process.env.AGENT_OUTCOME, runUrl })
  if (!alert) {
    console.log('Aucune alerte à émettre.')
    return
  }
  const res = await openIssueOnce(ghCli, { ...alert, label: 'agent-alerte', description: 'Alerte de l\'agent quotidien de prix' })
  console.log(res.created ? `Issue ouverte : ${alert.title}` : `Issue déjà ouverte : ${alert.title}`)
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    // Une alerte qui échoue ne doit pas masquer le vrai résultat du run.
    console.error(`Alerte impossible : ${err.message}`)
  })
}
