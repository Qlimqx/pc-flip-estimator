import { CPUS } from '../data/cpus'
import { GPUS } from '../data/gpus'
import { useEstimatorStore } from '../store/useEstimatorStore'
import { ComponentAutocomplete } from './ComponentAutocomplete'
import { RamFields } from './RamFields'
import { SecondaryFields } from './SecondaryFields'
import { StorageList } from './StorageList'

export function ConfigForm() {
  const config = useEstimatorStore((s) => s.config)
  const setCpu = useEstimatorStore((s) => s.setCpu)
  const setGpu = useEstimatorStore((s) => s.setGpu)
  const setRam = useEstimatorStore((s) => s.setRam)
  const addDisque = useEstimatorStore((s) => s.addDisque)
  const updateDisque = useEstimatorStore((s) => s.updateDisque)
  const removeDisque = useEstimatorStore((s) => s.removeDisque)
  const setCondition = useEstimatorStore((s) => s.setCondition)
  const setSecondaryFlag = useEstimatorStore((s) => s.setSecondaryFlag)
  const setPrixAchat = useEstimatorStore((s) => s.setPrixAchat)

  return (
    <div className="space-y-5">
      <ComponentAutocomplete
        label="Processeur"
        items={CPUS}
        selectedId={config.cpu.id}
        onSelect={setCpu}
        placeholder="Ex : Ryzen 5 5600, i5-10400F..."
      />

      <ComponentAutocomplete
        label="Carte graphique (laisser vide si iGPU)"
        items={GPUS}
        selectedId={config.gpu?.id ?? null}
        onSelect={setGpu}
        placeholder="Ex : RTX 4060, GTX 1650..."
      />

      <RamFields capacite={config.ramCapacite} type={config.ramType} onChange={setRam} />

      <StorageList
        disques={config.disques}
        onAdd={addDisque}
        onUpdate={updateDisque}
        onRemove={removeDisque}
      />

      <SecondaryFields
        config={config}
        onConditionChange={setCondition}
        onFlagChange={setSecondaryFlag}
      />

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-300">
          Prix auquel je peux acheter ce PC (facultatif)
        </label>
        <input
          type="number"
          min={0}
          value={config.prixAchat ?? ''}
          onChange={(e) => setPrixAchat(e.target.value === '' ? null : Number(e.target.value))}
          placeholder="Ex : 550"
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
        />
      </div>
    </div>
  )
}
