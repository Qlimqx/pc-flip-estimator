import type { EstimationHistoryEntry, EstimationResult, PcConfiguration } from '../types'
import { getDb } from './db'

/**
 * Couche d'accès à l'historique -- toute l'app passe par ces fonctions,
 * jamais directement par IndexedDB. C'est le point qu'il faudra remplacer
 * (ou doubler) par un client Supabase le jour où un compte utilisateur /
 * une sauvegarde cloud sont ajoutés : la forme des données ne change pas,
 * seule l'implémentation de ce fichier changerait.
 */

export async function listHistory(): Promise<EstimationHistoryEntry[]> {
  const db = await getDb()
  const entries = await db.getAllFromIndex('historique', 'dateCreation')
  return entries.reverse()
}

export async function saveHistoryEntry(
  nom: string,
  config: PcConfiguration,
  resultat: EstimationResult,
): Promise<EstimationHistoryEntry> {
  const db = await getDb()
  const now = new Date().toISOString()
  const entry: EstimationHistoryEntry = {
    id: crypto.randomUUID(),
    dateCreation: now,
    dateModification: now,
    nom,
    config,
    resultat,
  }
  await db.put('historique', entry)
  return entry
}

export async function updateHistoryEntry(
  id: string,
  nom: string,
  config: PcConfiguration,
  resultat: EstimationResult,
): Promise<EstimationHistoryEntry | null> {
  const db = await getDb()
  const existing = await db.get('historique', id)
  if (!existing) return null
  const updated: EstimationHistoryEntry = {
    ...existing,
    nom,
    config,
    resultat,
    dateModification: new Date().toISOString(),
  }
  await db.put('historique', updated)
  return updated
}

export async function deleteHistoryEntry(id: string): Promise<void> {
  const db = await getDb()
  await db.delete('historique', id)
}

export async function duplicateHistoryEntry(id: string): Promise<EstimationHistoryEntry | null> {
  const db = await getDb()
  const existing = await db.get('historique', id)
  if (!existing) return null
  const now = new Date().toISOString()
  const copy: EstimationHistoryEntry = {
    ...existing,
    id: crypto.randomUUID(),
    nom: `${existing.nom} (copie)`,
    dateCreation: now,
    dateModification: now,
  }
  await db.put('historique', copy)
  return copy
}
