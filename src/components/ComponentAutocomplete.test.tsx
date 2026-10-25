import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { buildRequestUrl } from '../lib/componentRequest'
import { ComponentAutocomplete } from './ComponentAutocomplete'

const items = [
  { id: 'ryzen-5-5600', nom: 'AMD Ryzen 5 5600', marque: 'AMD', min: 90, moyen: 110, max: 130, dateMaj: '2026-10-01', faciliteRevente: 0.7, decoteAnciennete: 1, tier: 3 as const },
]

function setup() {
  render(<ComponentAutocomplete label="Processeur" kind="cpu" items={items} selectedId={null} onSelect={() => {}} />)
  const input = screen.getByRole('textbox')
  fireEvent.focus(input)
  return input
}

describe('ComponentAutocomplete : modèle absent', () => {
  afterEach(() => vi.unstubAllGlobals())

  it("annonce que le modèle n'est pas dans la liste et propose de demander son ajout", () => {
    const input = setup()
    fireEvent.change(input, { target: { value: 'Ryzen 5 5700' } })
    expect(screen.getByText(/« Ryzen 5 5700 » n'est pas dans la liste/)).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Demander son ajout' }).length).toBeGreaterThan(0)
  })

  it("un modèle présent est proposé normalement, sans message d'absence", () => {
    const input = setup()
    fireEvent.change(input, { target: { value: 'ryzen 5 5600' } })
    expect(screen.getByText('AMD Ryzen 5 5600')).toBeInTheDocument()
    expect(screen.queryByText(/n'est pas dans la liste/)).not.toBeInTheDocument()
  })

  it('envoie la demande directement au site, sans passer par GitHub', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ ok: true, message: 'Demande envoyée pour AMD Ryzen 5 5700 : ok.' }) })
    vi.stubGlobal('fetch', fetchMock)
    const input = setup()
    fireEvent.change(input, { target: { value: 'Ryzen 5 5700' } })
    fireEvent.click(screen.getAllByRole('button', { name: 'Demander son ajout' })[0])
    expect(await screen.findByRole('status')).toHaveTextContent('Demande envoyée pour AMD Ryzen 5 5700')
    expect(fetchMock).toHaveBeenCalledWith('/api/request-component', expect.objectContaining({ method: 'POST' }))
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ kind: 'cpu', name: 'Ryzen 5 5700', website: '' })
  })

  it("si l'envoi direct est indisponible, propose le repli GitHub", async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 503, json: async () => ({ ok: false, error: 'not-configured', message: 'x' }) }))
    const input = setup()
    fireEvent.change(input, { target: { value: 'Ryzen 5 5700' } })
    fireEvent.click(screen.getAllByRole('button', { name: 'Demander son ajout' })[0])
    const link = await screen.findByRole('link', { name: 'demander via GitHub' })
    expect(link).toHaveAttribute('href', buildRequestUrl('cpu', 'Ryzen 5 5700'))
  })

  it("affiche l'erreur de validation sans basculer sur GitHub", async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 422, json: async () => ({ ok: false, error: 'invalid', message: 'Modèle non reconnu.' }) }))
    const input = setup()
    fireEvent.change(input, { target: { value: 'truc' } })
    fireEvent.click(screen.getAllByRole('button', { name: 'Demander son ajout' })[0])
    expect(await screen.findByRole('alert')).toHaveTextContent('Modèle non reconnu.')
    expect(screen.queryByRole('link', { name: 'demander via GitHub' })).not.toBeInTheDocument()
  })

  it("refuse d'envoyer une demande vide", async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    setup()
    fireEvent.click(screen.getAllByRole('button', { name: 'Demander son ajout' })[0])
    expect(await screen.findByRole('alert')).toHaveTextContent('Tapez d’abord le nom du modèle')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("l'URL de repli cible l'issue préremplie avec le bon libellé", () => {
    const url = new URL(buildRequestUrl('gpu', 'RTX 4070 Ti Super'))
    expect(url.pathname).toBe('/Qlimqx/pc-flip-estimator/issues/new')
    expect(url.searchParams.get('labels')).toBe('composant-demande')
    expect(url.searchParams.get('title')).toBe('[Demande] Carte graphique RTX 4070 Ti Super')
  })
})
