#!/usr/bin/env node
// Répond aux issues de demande d'ajout APRÈS la publication des données
// (daily-agent.yml) : commente le résultat et ferme les demandes réglées.
// Exécuté seulement si la publication a réussi, pour ne jamais annoncer un
// ajout qui n'aurait pas été publié.

import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { ghCli } from './lib/github.mjs'
import { CLOSING_OUTCOMES, buildRequestComment } from './lib/requests.mjs'
import { parisYmd } from './lib/time.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

/** Applique les réponses du rapport avec le CLI donné. Renvoie les numéros traités. */
export async function answerRequests(report, gh = ghCli) {
  const done = []
  for (const r of report?.requests ?? []) {
    if (!r.notify) continue
    await gh(['issue', 'comment', String(r.number), '--body', buildRequestComment(r)])
    if (CLOSING_OUTCOMES.has(r.outcome)) await gh(['issue', 'close', String(r.number)])
    done.push(r.number)
  }
  return done
}

async function main() {
  const day = parisYmd(new Date())
  let report
  try {
    report = JSON.parse(await readFile(path.join(root, 'agent-data/reports', `${day}.json`), 'utf8'))
  } catch {
    console.log('Pas de rapport du jour : aucune demande à traiter.')
    return
  }
  const done = await answerRequests(report)
  console.log(done.length ? `Demandes traitées : #${done.join(', #')}` : 'Aucune demande à commenter.')
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(`Réponse aux demandes impossible : ${err.message}`) // jamais bloquant
  })
}
