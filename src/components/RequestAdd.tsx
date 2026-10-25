import { useState } from 'react'
import { buildRequestUrl, sendComponentRequest, type RequestKind } from '../lib/componentRequest'

type Status =
  | { state: 'idle' }
  | { state: 'sending' }
  | { state: 'sent'; message: string }
  | { state: 'error'; message: string }
  | { state: 'fallback' }

interface Props {
  kind: RequestKind
  query: string
  label?: string
  className?: string
}

/**
 * Bouton « Demander son ajout » : envoie la demande directement au site (fonction
 * /api/request-component), sans compte GitHub. Si l'envoi direct n'est pas
 * disponible (non configuré, hors ligne), repli sur une issue GitHub préremplie.
 */
export function RequestAdd({ kind, query, label = 'Demander son ajout', className }: Props) {
  const [status, setStatus] = useState<Status>({ state: 'idle' })

  async function onClick() {
    if (!query.trim()) {
      setStatus({ state: 'error', message: 'Tapez d’abord le nom du modèle dans le champ.' })
      return
    }
    setStatus({ state: 'sending' })
    const result = await sendComponentRequest(kind, query)
    if (result.ok) setStatus({ state: 'sent', message: result.message })
    else if (result.fallback) setStatus({ state: 'fallback' })
    else setStatus({ state: 'error', message: result.message })
  }

  return (
    <span className={className}>
      {status.state === 'sent' ? (
        <span role="status" className="text-emerald-400">
          {status.message}
        </span>
      ) : (
        <>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={onClick}
            disabled={status.state === 'sending'}
            className="text-emerald-400 underline hover:text-emerald-300 disabled:opacity-60"
          >
            {status.state === 'sending' ? 'Envoi…' : label}
          </button>
          {status.state === 'error' && (
            <span role="alert" className="ml-2 text-amber-400">
              {status.message}
            </span>
          )}
          {status.state === 'fallback' && (
            <span className="ml-2 text-slate-400">
              Envoi direct indisponible —{' '}
              <a href={buildRequestUrl(kind, query)} target="_blank" rel="noreferrer" className="underline hover:text-slate-200">
                demander via GitHub
              </a>
            </span>
          )}
        </>
      )}
    </span>
  )
}
