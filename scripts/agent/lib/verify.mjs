// Décision de prix pour UN composant. Fonction pure : aucune entrée/sortie,
// entièrement testable.
//
// Règles (toutes ancrées sur la donnée de BASE, jamais sur la veille seule --
// leçon de l'incident du 2026-09-27) :
//   1. source en panne            -> on garde la dernière valeur fiable, signalé ;
//   2. données insuffisantes      -> on garde, ce n'est pas une panne ;
//   3. écart à la base > 60 %     -> REJETÉ (valeur inchangée, liste manuelle) ;
//   4. occasion > neuf constaté   -> REJETÉ (incohérence neuf/occasion) ;
//   5. saut > 15 % vs valeur actuelle -> mis en ATTENTE : appliqué seulement si
//      le run suivant (jour différent) le confirme à ±15 % ;
//   6. écart à la base > 25 %     -> appliqué mais consigné « à vérifier » ;
//   7. sinon                      -> appliqué.

export const HARD_REJECT_PCT = 0.6
export const FLAG_PCT = 0.25
export const JUMP_CONFIRM_PCT = 0.15
export const USED_OVER_NEW_TOLERANCE = 1.05

const pct = (a, b) => Math.abs(a - b) / b

/**
 * @param {object} input
 * @param {{baseMoyen:number}} input.entry
 * @param {number} input.effectiveMoyen  valeur actuellement visible dans l'app
 * @param {null | {min:number,moyen:number,max:number,sampleCount:number}} input.candidate
 * @param {boolean} input.sourceOk       false si la source n'a pas répondu
 * @param {null | {moyen:number,sampleCount:number}} [input.newPrice]  prix neuf demandé (indicatif)
 * @param {null | {moyen:number,on:string}} [input.pending]  candidat en attente d'un run précédent
 * @param {string} input.today
 * @returns {{action:'update'|'keep'|'pending', status:string, flag?:boolean, reason:string, pending?:object|null}}
 */
export function decidePrice({ entry, effectiveMoyen, candidate, sourceOk, newPrice = null, pending = null, today }) {
  if (!sourceOk) {
    return { action: 'keep', status: 'source-indisponible', reason: 'source injoignable : dernière valeur fiable conservée', pending }
  }
  if (!candidate) {
    return { action: 'keep', status: 'donnees-insuffisantes', reason: 'moins de 4 annonces valides après filtrage : valeur conservée', pending }
  }

  const fromBase = pct(candidate.moyen, entry.baseMoyen)
  if (fromBase > HARD_REJECT_PCT) {
    return {
      action: 'keep',
      status: 'rejete',
      reason: `écart de ${Math.round(fromBase * 100)} % à la référence (${entry.baseMoyen} € -> ${candidate.moyen} €), au-delà de ${HARD_REJECT_PCT * 100} %`,
      pending: null,
    }
  }

  // Le prix neuf n'est un garde-fou que s'il est plausible : un « neuf » à moins de
  // la moitié de la référence d'occasion est quasi sûrement un accessoire ou une
  // annonce mal classée, pas le composant.
  const newReliable = newPrice && newPrice.sampleCount >= 4 && newPrice.moyen >= entry.baseMoyen * 0.5
  if (newReliable && candidate.moyen > newPrice.moyen * USED_OVER_NEW_TOLERANCE) {
    return {
      action: 'keep',
      status: 'rejete',
      reason: `prix d'occasion (${candidate.moyen} €) supérieur au prix neuf demandé (${newPrice.moyen} €) : incohérent`,
      pending: null,
    }
  }

  const jump = pct(candidate.moyen, effectiveMoyen)
  if (jump > JUMP_CONFIRM_PCT) {
    const confirms = pending && pending.on !== today && pct(candidate.moyen, pending.moyen) <= JUMP_CONFIRM_PCT
    if (!confirms) {
      return {
        action: 'pending',
        status: 'en-attente-confirmation',
        reason: `saut de ${Math.round(jump * 100)} % (${effectiveMoyen} € -> ${candidate.moyen} €) : appliqué seulement s'il est confirmé au prochain run`,
        pending: { moyen: candidate.moyen, on: today },
      }
    }
  }

  const flag = fromBase > FLAG_PCT
  return {
    action: 'update',
    status: flag ? 'mis-a-jour-a-verifier' : 'mis-a-jour',
    flag,
    reason: flag ? `appliqué mais écart de ${Math.round(fromBase * 100)} % à la référence : relecture humaine conseillée` : 'appliqué',
    pending: null,
  }
}
