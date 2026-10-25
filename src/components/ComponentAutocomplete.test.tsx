import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
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
  it('annonce que le modèle n\'est pas dans la liste et propose de demander son ajout', () => {
    const input = setup()
    fireEvent.change(input, { target: { value: 'Ryzen 5 5700' } })
    expect(screen.getByText(/« Ryzen 5 5700 » n'est pas dans la liste/)).toBeInTheDocument()
    const links = screen.getAllByRole('link', { name: 'Demander son ajout' })
    expect(links[0]).toHaveAttribute('href', buildRequestUrl('cpu', 'Ryzen 5 5700'))
  })

  it('un modèle présent est proposé normalement, sans message d\'absence', () => {
    const input = setup()
    fireEvent.change(input, { target: { value: 'ryzen 5 5600' } })
    expect(screen.getByText('AMD Ryzen 5 5600')).toBeInTheDocument()
    expect(screen.queryByText(/n'est pas dans la liste/)).not.toBeInTheDocument()
  })

  it('l\'URL de demande cible l\'issue préremplie avec le bon libellé', () => {
    const url = new URL(buildRequestUrl('gpu', 'RTX 4070 Ti Super'))
    expect(url.pathname).toBe('/Qlimqx/pc-flip-estimator/issues/new')
    expect(url.searchParams.get('labels')).toBe('composant-demande')
    expect(url.searchParams.get('title')).toBe('[Demande] Carte graphique RTX 4070 Ti Super')
  })
})
