import { create } from 'zustand'
import { estimate } from '../engine/estimate'
import type {
  Condition,
  EstimationHistoryEntry,
  PcConfiguration,
  PriceBand,
  RamCapacity,
  RamType,
  StorageCapacity,
  StorageDrive,
  StorageType,
} from '../types'
import {
  deleteHistoryEntry,
  duplicateHistoryEntry,
  listHistory,
  saveHistoryEntry,
  updateHistoryEntry,
} from './historyRepository'

export function defaultConfiguration(): PcConfiguration {
  return {
    cpu: { id: null, overrideBand: null },
    gpu: { id: null, overrideBand: null },
    ramCapacite: 16,
    ramType: 'ddr4',
    ramOverrideBand: null,
    disques: [{ id: crypto.randomUUID(), type: 'ssd', capacite: 512 }],
    storageOverrideBand: null,
    condition: 'bon',
    assemblageSoigne: true,
    windowsActive: false,
    carteMereConnue: false,
    alimentationConnue: false,
    boitierConnu: false,
    prixAchat: null,
  }
}

interface EstimatorState {
  config: PcConfiguration
  result: ReturnType<typeof estimate>
  history: EstimationHistoryEntry[]
  historyLoaded: boolean
  editingHistoryId: string | null

  setCpu: (id: string | null) => void
  setGpu: (id: string | null) => void
  setCpuOverride: (band: PriceBand | null) => void
  setGpuOverride: (band: PriceBand | null) => void
  setRam: (capacite: RamCapacity, type: RamType) => void
  setRamOverride: (band: PriceBand | null) => void
  addDisque: () => void
  updateDisque: (id: string, patch: Partial<Omit<StorageDrive, 'id'>>) => void
  removeDisque: (id: string) => void
  setStorageOverride: (band: PriceBand | null) => void
  setCondition: (condition: Condition) => void
  setSecondaryFlag: (
    key: 'assemblageSoigne' | 'windowsActive' | 'carteMereConnue' | 'alimentationConnue' | 'boitierConnu',
    value: boolean,
  ) => void
  setPrixAchat: (prix: number | null) => void
  loadConfiguration: (config: PcConfiguration) => void
  resetConfiguration: () => void

  refreshHistory: () => Promise<void>
  saveCurrentAsHistory: () => Promise<void>
  loadFromHistory: (entry: EstimationHistoryEntry) => void
  deleteFromHistory: (id: string) => Promise<void>
  duplicateFromHistory: (id: string) => Promise<void>
}

function withRecomputedResult(config: PcConfiguration) {
  return { config, result: estimate(config) }
}

/** Nom auto-généré à partir du CPU/GPU choisis -- pas de saisie manuelle,
 * l'outil est pensé pour évaluer vite plusieurs configs à la suite. */
function autoName(result: ReturnType<typeof estimate>, config: PcConfiguration): string {
  const cpuLabel = result.breakdown[0]?.label
  const hasGpu = config.gpu !== null && (config.gpu.id !== null || config.gpu.overrideBand !== null)
  const gpuLabel = hasGpu ? result.breakdown[1]?.label : null
  const parts = [cpuLabel, gpuLabel].filter((p): p is string => Boolean(p))
  return parts.length > 0 ? parts.join(' + ') : 'Estimation sans nom'
}

export const useEstimatorStore = create<EstimatorState>((set, get) => ({
  ...withRecomputedResult(defaultConfiguration()),
  history: [],
  historyLoaded: false,
  editingHistoryId: null,

  setCpu: (id) =>
    set((s) => withRecomputedResult({ ...s.config, cpu: { id, overrideBand: null } })),
  setGpu: (id) =>
    set((s) => withRecomputedResult({ ...s.config, gpu: { id, overrideBand: null } })),
  setCpuOverride: (band) =>
    set((s) => withRecomputedResult({ ...s.config, cpu: { ...s.config.cpu, overrideBand: band } })),
  setGpuOverride: (band) =>
    set((s) =>
      withRecomputedResult({
        ...s.config,
        gpu: { id: s.config.gpu?.id ?? null, overrideBand: band },
      }),
    ),
  setRam: (ramCapacite, ramType) =>
    set((s) => withRecomputedResult({ ...s.config, ramCapacite, ramType })),
  setRamOverride: (band) =>
    set((s) => withRecomputedResult({ ...s.config, ramOverrideBand: band })),
  addDisque: () =>
    set((s) =>
      withRecomputedResult({
        ...s.config,
        disques: [...s.config.disques, { id: crypto.randomUUID(), type: 'ssd', capacite: 512 }],
      }),
    ),
  updateDisque: (id, patch) =>
    set((s) =>
      withRecomputedResult({
        ...s.config,
        disques: s.config.disques.map((d) => (d.id === id ? { ...d, ...patch } : d)),
      }),
    ),
  removeDisque: (id) =>
    set((s) =>
      withRecomputedResult({
        ...s.config,
        disques: s.config.disques.filter((d) => d.id !== id),
      }),
    ),
  setStorageOverride: (band) =>
    set((s) => withRecomputedResult({ ...s.config, storageOverrideBand: band })),
  setCondition: (condition) => set((s) => withRecomputedResult({ ...s.config, condition })),
  setSecondaryFlag: (key, value) =>
    set((s) => withRecomputedResult({ ...s.config, [key]: value })),
  setPrixAchat: (prixAchat) => set((s) => withRecomputedResult({ ...s.config, prixAchat })),
  loadConfiguration: (config) => set({ ...withRecomputedResult(config), editingHistoryId: null }),
  resetConfiguration: () =>
    set({ ...withRecomputedResult(defaultConfiguration()), editingHistoryId: null }),

  refreshHistory: async () => {
    const history = await listHistory()
    set({ history, historyLoaded: true })
  },
  saveCurrentAsHistory: async () => {
    const { config, result, editingHistoryId } = get()
    const nom = autoName(result, config)
    if (editingHistoryId) {
      await updateHistoryEntry(editingHistoryId, nom, config, result)
    } else {
      const entry = await saveHistoryEntry(nom, config, result)
      set({ editingHistoryId: entry.id })
    }
    await get().refreshHistory()
  },
  loadFromHistory: (entry) =>
    set({ ...withRecomputedResult(entry.config), editingHistoryId: entry.id }),
  deleteFromHistory: async (id) => {
    await deleteHistoryEntry(id)
    if (get().editingHistoryId === id) set({ editingHistoryId: null })
    await get().refreshHistory()
  },
  duplicateFromHistory: async (id) => {
    await duplicateHistoryEntry(id)
    await get().refreshHistory()
  },
}))

export type { StorageCapacity, StorageType }
