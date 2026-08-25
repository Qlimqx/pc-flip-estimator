import { useState } from 'react'
import { CONDITION_LABELS } from '../data/condition'
import type { Condition, PcConfiguration } from '../types'

const CONDITIONS: Condition[] = ['mauvais', 'correct', 'bon', 'tres-bon']

interface Props {
  config: PcConfiguration
  onConditionChange: (c: Condition) => void
  onFlagChange: (
    key: 'assemblageSoigne' | 'windowsActive' | 'carteMereConnue' | 'alimentationConnue' | 'boitierConnu',
    value: boolean,
  ) => void
}

export function SecondaryFields({ config, onConditionChange, onFlagChange }: Props) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="rounded-lg border border-slate-800">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-slate-300"
      >
        Informations complémentaires (facultatif)
        <span className="text-slate-500">{expanded ? '−' : '+'}</span>
      </button>
      {expanded && (
        <div className="space-y-4 border-t border-slate-800 px-4 py-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-300">État général</label>
            <select
              value={config.condition}
              onChange={(e) => onConditionChange(e.target.value as Condition)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
            >
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>
                  {CONDITION_LABELS[c]}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Checkbox
              label="PC assemblé proprement"
              checked={config.assemblageSoigne}
              onChange={(v) => onFlagChange('assemblageSoigne', v)}
            />
            <Checkbox
              label="Windows activé"
              checked={config.windowsActive}
              onChange={(v) => onFlagChange('windowsActive', v)}
            />
            <Checkbox
              label="Carte mère connue"
              checked={config.carteMereConnue}
              onChange={(v) => onFlagChange('carteMereConnue', v)}
            />
            <Checkbox
              label="Alimentation connue"
              checked={config.alimentationConnue}
              onChange={(v) => onFlagChange('alimentationConnue', v)}
            />
            <Checkbox
              label="Boîtier connu"
              checked={config.boitierConnu}
              onChange={(v) => onFlagChange('boitierConnu', v)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-slate-300">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-slate-600 bg-slate-900 accent-emerald-500"
      />
      {label}
    </label>
  )
}
