// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { formatParis, parisHm, parisOffsetMinutes, parisToUtc, parisYmd } from '../lib/time.mjs'

describe('heure de Paris', () => {
  it('décalage +120 min en été et +60 min en hiver', () => {
    expect(parisOffsetMinutes(new Date('2026-07-15T12:00:00Z'))).toBe(120)
    expect(parisOffsetMinutes(new Date('2026-01-15T12:00:00Z'))).toBe(60)
  })

  it('09:45 Paris = 07:45 UTC en été et 08:45 UTC en hiver', () => {
    expect(parisToUtc('2026-07-15', '09:45').toISOString()).toBe('2026-07-15T07:45:00.000Z')
    expect(parisToUtc('2026-01-15', '09:45').toISOString()).toBe('2026-01-15T08:45:00.000Z')
  })

  it('10:00 Paris suit le changement d\'heure (dimanche 29 mars et 25 octobre 2026)', () => {
    // La veille et le lendemain du passage à l'heure d'été (29/03/2026).
    expect(parisToUtc('2026-03-28', '10:00').toISOString()).toBe('2026-03-28T09:00:00.000Z')
    expect(parisToUtc('2026-03-29', '10:00').toISOString()).toBe('2026-03-29T08:00:00.000Z')
    // Passage à l'heure d'hiver (25/10/2026).
    expect(parisToUtc('2026-10-24', '10:00').toISOString()).toBe('2026-10-24T08:00:00.000Z')
    expect(parisToUtc('2026-10-25', '10:00').toISOString()).toBe('2026-10-25T09:00:00.000Z')
  })

  it('le jour d\'exécution est le jour civil parisien, pas le jour UTC', () => {
    expect(parisYmd(new Date('2026-07-14T22:30:00Z'))).toBe('2026-07-15') // 00:30 à Paris
    expect(parisYmd(new Date('2026-01-14T22:30:00Z'))).toBe('2026-01-14') // 23:30 à Paris
    expect(parisYmd(new Date('2026-01-14T23:30:00Z'))).toBe('2026-01-15') // 00:30 à Paris
  })

  it('aller-retour parisToUtc -> parisHm sur toute l\'année', () => {
    for (let d = 0; d < 366; d += 1) {
      const ymd = new Date(Date.UTC(2026, 0, 1 + d)).toISOString().slice(0, 10)
      for (const hm of ['05:17', '09:45', '10:00']) {
        const utc = parisToUtc(ymd, hm)
        expect(parisYmd(utc)).toBe(ymd)
        expect(parisHm(utc)).toBe(hm)
      }
    }
  })

  it('formate lisiblement', () => {
    expect(formatParis(new Date('2026-07-15T07:45:00Z'))).toBe('2026-07-15 09:45 (Paris)')
  })
})
