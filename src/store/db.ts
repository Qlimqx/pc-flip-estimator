import { type DBSchema, type IDBPDatabase, openDB } from 'idb'
import type { EstimationHistoryEntry } from '../types'

interface PcFlipDb extends DBSchema {
  historique: {
    key: string
    value: EstimationHistoryEntry
    indexes: { dateCreation: string }
  }
}

let dbPromise: Promise<IDBPDatabase<PcFlipDb>> | null = null

export function getDb() {
  if (!dbPromise) {
    dbPromise = openDB<PcFlipDb>('pc-flip-estimator', 1, {
      upgrade(db) {
        const store = db.createObjectStore('historique', { keyPath: 'id' })
        store.createIndex('dateCreation', 'dateCreation')
      },
    })
  }
  return dbPromise
}
