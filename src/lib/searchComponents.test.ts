import { describe, expect, it } from 'vitest'
import { CPUS } from '../data/cpus'
import { searchComponents } from './searchComponents'

describe('recherche tolérante dans le catalogue', () => {
  it('trouve par sous-chaîne comme avant, sans signaler d’approximation', () => {
    const r = searchComponents(CPUS, 'Ryzen 5 5600')
    expect(r.results.map((c) => c.nom)).toContain('AMD Ryzen 5 5600')
    expect(r.approximate).toBe(false)
  })

  it('« Ryzen 5 5700X » (qui est un Ryzen 7) propose le Ryzen 7 5700X comme modèle proche', () => {
    const r = searchComponents(CPUS, 'Ryzen 5 5700X')
    expect(r.approximate).toBe(true)
    expect(r.results.map((c) => c.nom)).toContain('AMD Ryzen 7 5700X')
  })

  it('ignore l’ordre des mots et la casse', () => {
    const r = searchComponents(CPUS, '5600x ryzen')
    expect(r.results.map((c) => c.nom)).toContain('AMD Ryzen 5 5600X')
  })

  it('un modèle inexistant ne renvoie rien (donc la demande d’ajout est proposée)', () => {
    expect(searchComponents(CPUS, 'Ryzen 9 1234Z')).toEqual({ results: [], approximate: false })
  })

  it('sans saisie, liste les premiers modèles', () => {
    expect(searchComponents(CPUS, '  ').results).toHaveLength(8)
  })
})
