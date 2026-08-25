import { STORAGE_TYPE_LABELS } from '../data/storage'
import type { StorageCapacity, StorageDrive, StorageType } from '../types'

const CAPACITIES: StorageCapacity[] = [120, 240, 480, 500, 512, 1000, 2000, 4000]
const TYPES: StorageType[] = ['hdd', 'ssd', 'nvme']

interface Props {
  disques: StorageDrive[]
  onAdd: () => void
  onUpdate: (id: string, patch: Partial<Omit<StorageDrive, 'id'>>) => void
  onRemove: (id: string) => void
}

export function StorageList({ disques, onAdd, onUpdate, onRemove }: Props) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <label className="block text-sm font-medium text-slate-300">Stockage</label>
        <button
          type="button"
          onClick={onAdd}
          className="text-xs font-medium text-emerald-400 hover:text-emerald-300"
        >
          + Ajouter un disque
        </button>
      </div>
      <div className="space-y-2">
        {disques.map((d) => (
          <div key={d.id} className="flex gap-2">
            <select
              value={d.type}
              onChange={(e) => onUpdate(d.id, { type: e.target.value as StorageType })}
              className="w-1/3 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {STORAGE_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
            <select
              value={d.capacite}
              onChange={(e) => onUpdate(d.id, { capacite: Number(e.target.value) as StorageCapacity })}
              className="w-1/3 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
            >
              {CAPACITIES.map((c) => (
                <option key={c} value={c}>
                  {c >= 1000 ? `${c / 1000} To` : `${c} Go`}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => onRemove(d.id)}
              disabled={disques.length <= 1}
              className="w-1/3 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-400 hover:border-red-500 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-30"
            >
              Retirer
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
