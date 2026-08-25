import { useMemo, useRef, useState } from 'react'
import type { ComponentPricing } from '../types'

interface Props {
  label: string
  items: ComponentPricing[]
  selectedId: string | null
  onSelect: (id: string | null) => void
  placeholder?: string
}

/** Champ de recherche/autocomplétion générique, utilisé pour le CPU et le GPU. */
export function ComponentAutocomplete({ label, items, selectedId, onSelect, placeholder }: Props) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selected = items.find((i) => i.id === selectedId) ?? null

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items.slice(0, 8)
    return items.filter((i) => i.nom.toLowerCase().includes(q)).slice(0, 8)
  }, [items, query])

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
        </>
      )}
    </div>
  )
}
