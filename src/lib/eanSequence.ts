const STORAGE_KEY = 'pc-flip-estimator:ean-sequence'

/**
 * Préfixe "usage interne" (plage 20-29, réservée par GS1 pour un usage
 * restreint en magasin) -- aucun risque de collision avec un vrai code
 * produit du commerce, pas besoin d'enregistrement GS1 pour ce cas d'usage.
 */
const EAN_PREFIX = '20'

/**
 * Alloue et persiste (localStorage) le prochain code EAN-13, jamais
 * réutilisé tant que le navigateur garde ses données -- un code = une unité
 * physique. Retourne les 12 premiers chiffres (préfixe + séquence) ; le 13e
 * (clé de contrôle) est calculé automatiquement par JsBarcode au rendu.
 */
export function allocateNextEan(): string {
  const current = Number(localStorage.getItem(STORAGE_KEY) ?? '0')
  const next = current + 1
  localStorage.setItem(STORAGE_KEY, String(next))
  return `${EAN_PREFIX}${String(next).padStart(10, '0')}`
}
