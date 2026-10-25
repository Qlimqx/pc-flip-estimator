// Statut final et rapport quotidien (JSON pour les machines, Markdown pour
// les humains).

import { formatParis } from './time.mjs'

export const FINAL_STATUSES = new Set(['termine', 'termine_avec_avertissements'])

export const STATUS_LABELS = {
  termine: 'Terminé',
  termine_avec_avertissements: 'Terminé avec avertissements',
  partiel: 'Partiel (une partie du catalogue n\'a pas été traitée)',
  echec: 'Échec',
}

/**
 * Statut du run. Jamais « terminé » si une partie du catalogue n'a pas été
 * traitée, ni si le run a échoué avant de pouvoir travailler.
 */
export function computeStatus({ fatal, unprocessed, warnings }) {
  if (fatal) return 'echec'
  if (unprocessed > 0) return 'partiel'
  return warnings.length > 0 ? 'termine_avec_avertissements' : 'termine'
}

const eur = (v) => (typeof v === 'number' ? `${v} €` : '—')

function section(title, lines) {
  return lines.length ? [`## ${title}`, '', ...lines, ''] : []
}

export function renderMarkdown(r) {
  const c = r.counts
  const out = [
    `# Rapport de l'agent quotidien — ${r.date}`,
    '',
    `**Statut : ${STATUS_LABELS[r.status] ?? r.status}**${r.dryRun ? ' (simulation, rien n\'a été écrit)' : ''}`,
    '',
    `- Déclencheur : ${r.trigger}${r.runUrl ? ` ([exécution](${r.runUrl}))` : ''}`,
    `- Début : ${r.startedParis} · Fin : ${r.finishedParis} · Durée : ${r.durationSec} s`,
    `- Échéance de travail : ${r.deadlineParis} · Terminé avant 10 h (Paris) : ${r.finishedBeforeTenParis ? 'oui' : 'NON'}`,
    '',
    '## Bilan',
    '',
    '| Indicateur | Valeur |',
    '|---|---|',
    `| Composants du catalogue analysés | ${c.catalogue} |`,
    `| Prix vérifiés (données reçues) | ${c.verified} |`,
    `| Prix mis à jour | ${c.updated} (dont ${c.updatedToReview} à relire) |`,
    `| En attente de confirmation (saut > 15 %) | ${c.pending} |`,
    `| Données insuffisantes (valeur conservée) | ${c.insufficient} |`,
    `| Rejetés (écart aberrant, valeur conservée) | ${c.rejected} |`,
    `| Source indisponible | ${c.sourceUnavailable} |`,
    `| Non traités | ${c.unprocessed} |`,
    `| Composants ajoutés | ${c.added} |`,
    `| Composants manquants détectés mais non ajoutés | ${c.missingDetected} |`,
    `| Prix absents ou obsolètes (> ${r.staleDays} jours) | ${c.absentOrObsolete} |`,
    `| Anomalies de cohérence | ${c.anomalies} |`,
    '',
  ]

  out.push(
    ...section(
      'Sources',
      r.sources.map((s) => `- **${s.name}** : ${s.status}${s.detail ? ` — ${s.detail}` : ''}`),
    ),
  )
  out.push(...section('Avertissements', r.warnings.map((w) => `- ${w}`)))
  out.push(...section('Erreurs', r.errors.map((e) => `- ${e}`)))
  out.push(
    ...section(
      'Composants ajoutés',
      r.added.map(
        (a) =>
          `- **${a.nom}** (${a.category}) : ${eur(a.moyen)} (${eur(a.min)}–${eur(a.max)}), confiance ${a.confiance}, ${a.annoncesVues} annonces / ${a.vendeursDistincts} vendeurs, attributs estimés : ${a.attributsEstimes.join(', ')}`,
      ),
    ),
  )
  if (r.ramStorage.length) {
    out.push(
      ...section(
        'RAM et stockage (€/Go)',
        r.ramStorage.map((x) => `- **${x.key}** : ${x.status}${x.moyen !== undefined ? ` (mesuré ${x.moyen} €/Go, ${x.sampleCount} annonces)` : ''} — ${x.reason}`),
      ),
    )
  }
  out.push(
    ...section(
      'Demandes d\'ajout (issues « composant-demande »)',
      (r.requests ?? []).map((q) => `- #${q.number} **${q.nom}** : ${q.outcome}${q.reason ? ` — ${q.reason}` : ''}${q.detail ? ` — ${q.detail}` : ''}`),
    ),
  )
  out.push(
    ...section(
      'À vérifier manuellement',
      r.manualReview.map((m) => `- **${m.nom ?? m.key}** [${m.kind}] : ${m.reason}`),
    ),
  )
  out.push(
    '## Limites',
    '',
    ...r.limits.map((l) => `- ${l}`),
    '',
  )
  return out.join('\n')
}

export function publicStatus(r) {
  return {
    date: r.date,
    status: r.status,
    finishedAt: r.finishedParis,
    catalogue: r.counts.catalogue,
    verified: r.counts.verifiedToday ?? r.counts.verified,
    updated: r.counts.changedToday ?? r.counts.updated,
    added: r.counts.added,
    warnings: r.warnings.length,
  }
}

export { formatParis }
