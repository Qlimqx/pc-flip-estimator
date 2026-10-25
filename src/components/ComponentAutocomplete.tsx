import { useMemo, useRef, useState } from 'react'
import type { RequestKind } from '../lib/componentRequest'
import { searchComponents } from '../lib/searchComponents'
import { RequestAdd } from './RequestAdd'
import type { ComponentPricing } from '../types'

interface Props {
  label: string
  items: ComponentPricing[]
  selectedId: string | null
  onSelect: (id: string | null) => void
  placeholder?: string
  /** Type de composant, pour proposer l'ajout d'un modèle absent de la liste. */
  kind: RequestKind
}

/** Champ de recherche/autocomplétion générique, utilisé pour le CPU et le GPU. */
export function ComponentAutocomplete({ label, items, selectedId, onSelect, placeholder, kind }: Props) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selected = items.find((i) => i.id === selectedId) ?? null

  const { results, approximate } = useMemo(() => searchComponents(items, query), [items, query])

  function handleBlur() {
    // Laisse le temps au clic sur une option de se déclencher avant de fermer.
    window.setTimeout(() => setOpen(false), 120)
  }

  return (
    <div className="relative" ref={containerRef}>
      <label className="mb-1 block text-sm font-medium text-slate-300">{label}</label>
      {selected ? (
        <div className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-900 px-3 py-2">
          <span className="text-sm text-slate-100">{selected.nom}</span>
          <button
            type="button"
            onClick={() => {
              onSelect(null)
              setQuery('')
            }}
            className="text-xs text-slate-400 hover:text-slate-200"
          >
            Changer
          </button>
        </div>
      ) : (
        <>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setOpen(true)}
            onBlur={handleBlur}
            placeholder={placeholder}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
          />
          {open && results.length > 0 && (
            <ul className="absolute z-10 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-slate-700 bg-slate-900 shadow-lg">
              {approximate && (
                <li className="px-3 py-1.5 text-xs text-amber-400">
                  Aucun « {query.trim()} » exact — modèles proches :
                </li>
              )}
              {results.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(item.id)
                      setQuery('')
                      setOpen(false)
                    }}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-800"
                  >
                    <span>{item.nom}</span>
                    <span className="text-xs text-slate-500">~{item.moyen}€</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {open && query.trim() !== '' && results.length === 0 && (
            <div className="absolute z-10 mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-sm shadow-lg">
              <p className="text-slate-300">« {query.trim()} » n'est pas dans la liste.</p>
              <RequestAdd kind={kind} query={query} className="mt-1 inline-block" />
              <span className="text-slate-500"> — l'agent le vérifie et l'ajoute avec son prix le lendemain.</span>
            </div>
          )}
          <p className="mt-1 text-xs text-slate-500">
            Modèle absent ?{' '}
            <RequestAdd kind={kind} query={query} />
          </p>
        </>
      )}
    </div>
  )
}
