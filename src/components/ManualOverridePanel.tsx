import { useState } from 'react'
import { useEstimatorStore } from '../store/useEstimatorStore'
import type { PriceBand } from '../types'

interface OverrideRowProps {
  label: string
  computedBand: PriceBand
  overrideBand: PriceBand | null
  onChange: (band: PriceBand | null) => void
}

function OverrideRow({ label, computedBand, overrideBand, onChange }: OverrideRowProps) {
  const active = overrideBand !== null
  const band = overrideBand ?? computedBand

  return (
    <div className="rounded-lg border border-slate-800 p-3">
      <label className="mb-2 flex items-center justify-between text-sm text-slate-300">
        <span>{label}</span>
        <span className="flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => onChange(e.target.checked ? { ...computedBand } : null)}
            className="h-4 w-4 rounded border-slate-600 bg-slate-900 accent-emerald-500"
          />
          Ajuster manuellement
        </span>
      </label>
      <div className="grid grid-cols-3 gap-2">
        {(['min', 'moyen', 'max'] as const).map((key) => (
          <div key={key}>
            <span className="mb-0.5 block text-[10px] uppercase text-slate-500">{key}</span>
            <input
              type="number"
              disabled={!active}
              value={band[key]}
              onChange={(e) =>
                onChange({ ...band, [key]: Number(e.target.value) })
              }
              className="w-full rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100 disabled:opacity-40"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Permet de remplacer la valeur calculée d'un composant par une valeur
 * connue de l'utilisateur — le reste du moteur (bonus config, prime PC
 * assemblé, marges, verdict) recalcule automatiquement à partir de cette
 * valeur surchargée.
 */
export function ManualOverridePanel() {
  const [expanded, setExpanded] = useState(false)
  const config = useEstimatorStore((s) => s.config)
  const result = useEstimatorStore((s) => s.result)
  const setCpuOverride = useEstimatorStore((s) => s.setCpuOverride)
  const setGpuOverride = useEstimatorStore((s) => s.setGpuOverride)
  const setRamOverride = useEstimatorStore((s) => s.setRamOverride)
  const setStorageOverride = useEstimatorStore((s) => s.setStorageOverride)

  const cpuLine = result.breakdown[0]
  const gpuLine = config.gpu?.id || config.gpu?.overrideBand ? result.breakdown[1] : null
  const ramLine = result.breakdown.find((l) => l.label.startsWith('RAM'))
  // La somme des lignes de stockage (ou la surcharge globale) sert de base
  // par défaut si l'utilisateur active la surcharge du stockage.
  const storageComputed: PriceBand = config.storageOverrideBand ?? {
    min: result.breakdown
      .filter((l) => l.label.match(/^(HDD|SSD|NVME)/))
      .reduce((acc, l) => acc + l.band.min, 0),
    moyen: result.breakdown
      .filter((l) => l.label.match(/^(HDD|SSD|NVME)/))
      .reduce((acc, l) => acc + l.band.moyen, 0),
    max: result.breakdown
      .filter((l) => l.label.match(/^(HDD|SSD|NVME)/))
      .reduce((acc, l) => acc + l.band.max, 0),
  }

  return (
    <div className="rounded-lg border border-slate-800">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-slate-300"
      >
        Mode manuel — ajuster les valeurs estimées
        <span className="text-slate-500">{expanded ? '−' : '+'}</span>
      </button>
      {expanded && (
        <div className="space-y-3 border-t border-slate-800 px-4 py-4">
          {cpuLine && (
            <OverrideRow
              label={`Processeur (${cpuLine.label})`}
              computedBand={cpuLine.band}
              overrideBand={config.cpu.overrideBand}
              onChange={setCpuOverride}
            />
          )}
          {gpuLine && (
            <OverrideRow
              label={`Carte graphique (${gpuLine.label})`}
              computedBand={gpuLine.band}
              overrideBand={config.gpu?.overrideBand ?? null}
              onChange={setGpuOverride}
            />
          )}
          {ramLine && (
            <OverrideRow
              label="RAM"
              computedBand={ramLine.band}
              overrideBand={config.ramOverrideBand}
              onChange={setRamOverride}
            />
          )}
          <OverrideRow
            label="Stockage (tous les disques)"
            computedBand={storageComputed}
            overrideBand={config.storageOverrideBand}
            onChange={setStorageOverride}
          />
        </div>
      )}
    </div>
  )
}
