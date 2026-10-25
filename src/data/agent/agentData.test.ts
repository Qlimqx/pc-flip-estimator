import { describe, expect, it } from 'vitest'
import { CPUS } from '../cpus'
import { GPUS } from '../gpus'
import { RAM_TYPE_PRICING } from '../ram'
import { STORAGE_TYPE_PRICING } from '../storage'
import { EFFECTIVE_RAM_PRICING, EFFECTIVE_STORAGE_PRICING, mergeRates } from './effectiveRates'

describe('données de l\'agent intégrées au catalogue', () => {
  it('aucun identifiant en double entre la base et les composants ajoutés', () => {
    expect(new Set(CPUS.map((c) => c.id)).size).toBe(CPUS.length)
    expect(new Set(GPUS.map((g) => g.id)).size).toBe(GPUS.length)
  })

  it('sans surcharge, les tarifs sont ceux de la référence', () => {
    expect(mergeRates(RAM_TYPE_PRICING, {})).toEqual(RAM_TYPE_PRICING)
    expect(mergeRates(STORAGE_TYPE_PRICING, {})).toEqual(STORAGE_TYPE_PRICING)
  })

  it("les tarifs effectifs (avec les surcharges de l'agent) ne diffèrent de la référence que par le prix au Go", () => {
    // Indépendant du contenu courant de ramOverrides.json / storageOverrides.json,
    // que l'agent réécrit chaque jour : ce test ne doit jamais bloquer la publication.
    for (const type of Object.keys(RAM_TYPE_PRICING) as Array<keyof typeof RAM_TYPE_PRICING>) {
      expect({ ...EFFECTIVE_RAM_PRICING[type], prixParGo: 0 }).toEqual({ ...RAM_TYPE_PRICING[type], prixParGo: 0 })
      expect(EFFECTIVE_RAM_PRICING[type].prixParGo).toBeGreaterThan(0)
    }
    for (const type of Object.keys(STORAGE_TYPE_PRICING) as Array<keyof typeof STORAGE_TYPE_PRICING>) {
      expect({ ...EFFECTIVE_STORAGE_PRICING[type], prixParGo: 0 }).toEqual({ ...STORAGE_TYPE_PRICING[type], prixParGo: 0 })
      expect(EFFECTIVE_STORAGE_PRICING[type].prixParGo).toBeGreaterThan(0)
    }
  })

  it('une surcharge ne change que le prix au Go et ignore les valeurs invalides', () => {
    const base = { ddr4: { prixParGo: 4, plancher: 25 }, ddr5: { prixParGo: 7, plancher: 60 } }
    const merged = mergeRates(base, {
      ddr4: { prixParGo: 4.4, dateMaj: '2026-10-24' },
      ddr5: { prixParGo: -1, dateMaj: '2026-10-24' },
    })
    expect(merged.ddr4).toEqual({ prixParGo: 4.4, plancher: 25 })
    expect(merged.ddr5).toEqual(base.ddr5)
    expect(base.ddr4.prixParGo).toBe(4) // l'objet de référence n'est pas modifié
  })
})
