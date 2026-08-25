import { RAM_TYPE_LABELS } from '../data/ram'
import type { RamCapacity, RamType } from '../types'

const CAPACITIES: RamCapacity[] = [4, 8, 16, 32, 64, 128]
const TYPES: RamType[] = ['ddr3', 'ddr4', 'ddr5']

interface Props {
  capacite: RamCapacity
  type: RamType
  onChange: (capacite: RamCapacity, type: RamType) => void
}

export function RamFields({ capacite, type, onChange }: Props) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-300">RAM</label>
      <div className="flex gap-2">
        <select
          value={capacite}
          onChange={(e) => onChange(Number(e.target.value) as RamCapacity, type)}
          className="w-1/2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
        >
          {CAPACITIES.map((c) => (
            <option key={c} value={c}>
              {c} Go
            </option>
          ))}
        </select>
        <select
          value={type}
          onChange={(e) => onChange(capacite, e.target.value as RamType)}
          className="w-1/2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
        >
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {RAM_TYPE_LABELS[t]}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
