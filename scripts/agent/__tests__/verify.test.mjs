// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { filterOutliers, genuineListings, looksLikeBundle, modelVariants, summarizePrices, titleMatchesModel } from '../../lib/pricing.mjs'
import { decidePrice } from '../lib/verify.mjs'

const entry = { baseMoyen: 100 }
const cand = (moyen, sampleCount = 8) => ({ min: moyen * 0.9, moyen, max: moyen * 1.1, sampleCount })

describe('filtrage par titre (garde-fous hérités des incidents)', () => {
  it('écarte les mauvaises variantes et les PC complets', () => {
    expect(titleMatchesModel('Processeur AMD Ryzen 5 5600 AM4', 'AMD Ryzen 5 5600')).toBe(true)
    expect(titleMatchesModel('AMD Ryzen 5 5600X', 'AMD Ryzen 5 5600')).toBe(false)
    expect(titleMatchesModel('AMD Ryzen 5 5600G', 'AMD Ryzen 5 5600')).toBe(false)
    expect(titleMatchesModel('RTX 4070 Ti Super', 'RTX 4070')).toBe(false)
    expect(looksLikeBundle('PC Gamer RTX 3080 Ryzen 5 5600')).toBe(true)
    expect(genuineListings([{ title: 'PC Gamer AMD Ryzen 5 5600' }, { title: 'AMD Ryzen 5 5600' }], 'AMD Ryzen 5 5600')).toHaveLength(1)
  })

  it('reconnaît les graphies courantes d\'un modèle sans confondre les variantes', () => {
    expect(modelVariants('Intel Core i5-12400F')).toEqual(expect.arrayContaining(['i5-12400F', 'i5 12400F', 'Core i5-12400F']))
    const titles = ['Processeur i5 12400F LGA1700', 'Core i5-12400 (sans F)', 'Intel i5-12400F boxed', 'PC Gamer i5-12400F RTX']
    expect(genuineListings(titles.map((title) => ({ title })), 'Intel Core i5-12400F')).toHaveLength(2)
    expect(genuineListings([{ title: 'Ryzen 5 5600X' }, { title: 'Ryzen 5 5600 AM4' }], 'AMD Ryzen 5 5600')).toHaveLength(1)
  })

  it('exige 4 annonces valides et écarte les outliers', () => {
    expect(summarizePrices([100, 110, 120])).toBeNull()
    expect(filterOutliers([100, 105, 110, 600])).toEqual([100, 105, 110])
    const s = summarizePrices([100, 105, 110, 115, 120, 900])
    expect(s.moyen).toBe(110)
    expect(s.sampleCount).toBe(5)
  })

  it('resserre une fourchette trop étalée autour de la médiane', () => {
    const s = summarizePrices([70, 80, 100, 120, 150, 190])
    expect(s.spreadTightened).toBe(true)
    expect(s.max / s.min).toBeLessThan(1.5)
    expect(s.moyen).toBe(110)
  })
})

describe('décision de prix', () => {
  it('met à jour un prix normal', () => {
    const d = decidePrice({ entry, effectiveMoyen: 100, candidate: cand(108), sourceOk: true, today: '2026-10-24' })
    expect(d.action).toBe('update')
    expect(d.flag).toBe(false)
  })

  it('rejette un prix aberrant (> 60 % de la référence) et garde la valeur', () => {
    const d = decidePrice({ entry, effectiveMoyen: 100, candidate: cand(220), sourceOk: true, today: '2026-10-24' })
    expect(d.action).toBe('keep')
    expect(d.status).toBe('rejete')
  })

  it('ancre sur la BASE : une dérive progressive ne peut pas s\'accumuler', () => {
    // La veille valait déjà 150 (+50 % de la base) ; +15 % de plus = 172 (+72 % de la base) -> rejeté.
    const d = decidePrice({ entry, effectiveMoyen: 150, candidate: cand(172), sourceOk: true, today: '2026-10-24' })
    expect(d.status).toBe('rejete')
  })

  it('un saut > 15 % n\'est appliqué qu\'après confirmation un autre jour', () => {
    const day1 = decidePrice({ entry, effectiveMoyen: 100, candidate: cand(130), sourceOk: true, today: '2026-10-24' })
    expect(day1.action).toBe('pending')
    expect(day1.pending).toEqual({ moyen: 130, on: '2026-10-24' })
    // même jour : une deuxième lecture ne vaut pas confirmation
    const sameDay = decidePrice({ entry, effectiveMoyen: 100, candidate: cand(131), sourceOk: true, pending: day1.pending, today: '2026-10-24' })
    expect(sameDay.action).toBe('pending')
    // lendemain, confirmé à ±15 %
    const day2 = decidePrice({ entry, effectiveMoyen: 100, candidate: cand(128), sourceOk: true, pending: day1.pending, today: '2026-10-25' })
    expect(day2.action).toBe('update')
    expect(day2.flag).toBe(true) // +28 % de la base : à relire
    // lendemain mais valeur différente : repart en attente
    const other = decidePrice({ entry, effectiveMoyen: 100, candidate: cand(150), sourceOk: true, pending: day1.pending, today: '2026-10-25' })
    expect(other.action).toBe('pending')
  })

  it('source indisponible ou données insuffisantes : valeur conservée', () => {
    expect(decidePrice({ entry, effectiveMoyen: 100, candidate: null, sourceOk: false, today: 'x' }).status).toBe('source-indisponible')
    expect(decidePrice({ entry, effectiveMoyen: 100, candidate: null, sourceOk: true, today: 'x' }).status).toBe('donnees-insuffisantes')
  })

  it('ignore un prix « neuf » implausible (moins de la moitié de la référence : accessoire mal classé)', () => {
    const d = decidePrice({ entry, effectiveMoyen: 100, candidate: cand(110), sourceOk: true, newPrice: { moyen: 40, sampleCount: 8 }, today: 'x' })
    expect(d.action).toBe('update')
  })

  it('refuse un prix d\'occasion supérieur au prix neuf', () => {
    const d = decidePrice({ entry, effectiveMoyen: 100, candidate: cand(110), sourceOk: true, newPrice: { moyen: 90, sampleCount: 6 }, today: 'x' })
    expect(d.status).toBe('rejete')
    // un prix neuf peu fiable (peu d'annonces) ne bloque pas
    const ok = decidePrice({ entry, effectiveMoyen: 100, candidate: cand(110), sourceOk: true, newPrice: { moyen: 90, sampleCount: 2 }, today: 'x' })
    expect(ok.action).toBe('update')
  })
})
