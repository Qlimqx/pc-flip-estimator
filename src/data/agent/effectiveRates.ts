import { RAM_TYPE_PRICING, type RamTypePricing } from '../ram'
import { STORAGE_TYPE_PRICING, type StorageTypePricing } from '../storage'
import type { RamType, StorageType } from '../../types'
import ramOverrides from './ramOverrides.json'
import storageOverrides from './storageOverrides.json'

// Tarifs €/Go effectivement utilisés par l'appli : ram.ts / storage.ts
// (valeurs de référence relues à la main) rafraîchis par l'agent quotidien
// (scripts/agent/, fichiers ramOverrides.json / storageOverrides.json). Comme
// pour les prix CPU/GPU, seul `prixParGo` est surchargé : plancher, facilité
// de revente et décote d'ancienneté restent ceux de la référence.

interface RateOverride {
  prixParGo: number
  dateMaj: string
}

export function mergeRates<K extends string, T extends { prixParGo: number }>(
  base: Record<K, T>,
  overrides: Record<string, RateOverride | undefined>,
): Record<K, T> {
  const merged = { ...base }
  for (const key of Object.keys(base) as K[]) {
    const override = overrides[key]
    if (override && Number.isFinite(override.prixParGo) && override.prixParGo > 0) {
      merged[key] = { ...base[key], prixParGo: override.prixParGo }
    }
  }
  return merged
}

export const EFFECTIVE_RAM_PRICING: Record<RamType, RamTypePricing> = mergeRates(
  RAM_TYPE_PRICING,
  ramOverrides as Record<string, RateOverride | undefined>,
)

export const EFFECTIVE_STORAGE_PRICING: Record<StorageType, StorageTypePricing> = mergeRates(
  STORAGE_TYPE_PRICING,
  storageOverrides as Record<string, RateOverride | undefined>,
)
