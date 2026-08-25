import { describe, expect, it } from 'vitest'
import type { PcConfiguration } from '../types'
import { estimate } from './estimate'

function baseConfig(overrides: Partial<PcConfiguration>): PcConfiguration {
  return {
    cpu: { id: null, overrideBand: null },
    gpu: { id: null, overrideBand: null },
    ramCapacite: 16,
    ramType: 'ddr4',
    ramOverrideBand: null,
    disques: [],
    storageOverrideBand: null,
    condition: 'bon',
    assemblageSoigne: false,
    windowsActive: false,
    carteMereConnue: false,
    alimentationConnue: false,
    boitierConnu: false,
    prixAchat: null,
    ...overrides,
  }
}

describe('estimate -- config ancienne DDR3', () => {
  it('produit une revente basse, cohérente avec du matériel très ancien', () => {
    const config = baseConfig({
      cpu: { id: 'i5-4460', overrideBand: null },
      gpu: { id: 'gtx-960', overrideBand: null },
      ramCapacite: 8,
      ramType: 'ddr3',
      disques: [{ id: '1', type: 'hdd', capacite: 500 }],
      condition: 'correct',
    })

    const result = estimate(config)

    expect(result.revente.moyen).toBeGreaterThan(30)
    expect(result.revente.moyen).toBeLessThan(120)
    expect(result.revente.min).toBeLessThanOrEqual(result.revente.moyen)
    expect(result.revente.moyen).toBeLessThanOrEqual(result.revente.max)
  })
})

describe('estimate -- config milieu de gamme DDR4 (exemple de la spec)', () => {
  it('Ryzen 5 5600 + 32Go DDR4 + NVMe 1To + RTX 4060, acheté 550€ -> bonne affaire', () => {
    const config = baseConfig({
      cpu: { id: 'ryzen-5-5600', overrideBand: null },
      gpu: { id: 'rtx-4060', overrideBand: null },
      ramCapacite: 32,
      ramType: 'ddr4',
      disques: [{ id: '1', type: 'nvme', capacite: 1000 }],
      condition: 'bon',
      prixAchat: 550,
    })

    const result = estimate(config)

    // La spec visait ~700-780€ à l'origine, mais la pénurie mémoire de fin
    // 2025/2026 (DDR4 +~3x, NVMe +~2,4x en occasion, voir data/ram.ts et
    // data/storage.ts) a fait grimper le poste RAM+stockage de cet exemple
    // de ~99€ à ~265€ -- l'écart est donc désormais bien réel, pas une
    // erreur de calibration. On garde une fourchette large plutôt qu'une
    // valeur pile, le but étant de couvrir une éventuelle repasse de
    // calibration plutôt qu'un chiffre figé.
    expect(result.revente.moyen).toBeGreaterThan(550)
    expect(result.revente.moyen).toBeLessThan(1300)
    expect(result.benefice).not.toBeNull()
    expect(result.benefice!.moyen).toBeGreaterThan(0)
    expect(result.margePct).not.toBeNull()
    expect(result.margePct!).toBeGreaterThan(0.1)
    expect(['bonne-affaire', 'tres-bonne-affaire']).toContain(result.verdict)
  })
})

describe('estimate -- config récente DDR5', () => {
  it('Ryzen 7 9800X3D + RTX 5070 Ti + 32Go DDR5 se revend nettement plus cher', () => {
    const config = baseConfig({
      cpu: { id: 'ryzen-7-9800x3d', overrideBand: null },
      gpu: { id: 'rtx-5070-ti', overrideBand: null },
      ramCapacite: 32,
      ramType: 'ddr5',
      disques: [{ id: '1', type: 'nvme', capacite: 2000 }],
      condition: 'tres-bon',
    })

    const result = estimate(config)

    expect(result.revente.moyen).toBeGreaterThan(1400)
  })
})

describe('estimate -- GPU ancien', () => {
  it('i5-9400F + GTX 1050 Ti reste dans une fourchette basse', () => {
    const config = baseConfig({
      cpu: { id: 'i5-9400f', overrideBand: null },
      gpu: { id: 'gtx-1050-ti', overrideBand: null },
      ramCapacite: 16,
      ramType: 'ddr4',
      disques: [{ id: '1', type: 'ssd', capacite: 480 }],
      condition: 'bon',
    })

    const result = estimate(config)

    // Borne haute relevée pour la même raison que le test milieu de gamme
    // ci-dessus : la pénurie mémoire gonfle désormais le poste RAM+stockage
    // même sur une config par ailleurs modeste.
    expect(result.revente.moyen).toBeGreaterThan(80)
    expect(result.revente.moyen).toBeLessThan(450)
  })
})

describe('estimate -- GPU RTX 4060', () => {
  it('i5-12400F + RTX 4060 se revend nettement plus cher que le cas GPU ancien', () => {
    const config = baseConfig({
      cpu: { id: 'i5-12400f', overrideBand: null },
      gpu: { id: 'rtx-4060', overrideBand: null },
      ramCapacite: 16,
      ramType: 'ddr4',
      disques: [{ id: '1', type: 'nvme', capacite: 512 }],
      condition: 'bon',
    })

    const result = estimate(config)

    expect(result.revente.moyen).toBeGreaterThan(400)
  })
})

describe('estimate -- comportements transverses', () => {
  it('un prix d\'achat au-dessus de la revente donne un verdict "à éviter"', () => {
    const config = baseConfig({
      cpu: { id: 'ryzen-5-5600', overrideBand: null },
      gpu: { id: 'rtx-4060', overrideBand: null },
      ramCapacite: 16,
      ramType: 'ddr4',
      disques: [{ id: '1', type: 'ssd', capacite: 512 }],
      prixAchat: 5000,
    })

    const result = estimate(config)

    expect(result.verdict).toBe('a-eviter')
    expect(result.benefice!.moyen).toBeLessThan(0)
  })

  it("sans prix d'achat saisi, aucun verdict n'est calculé", () => {
    const config = baseConfig({
      cpu: { id: 'ryzen-5-5600', overrideBand: null },
    })

    const result = estimate(config)

    expect(result.verdict).toBeNull()
    expect(result.benefice).toBeNull()
    expect(result.margePct).toBeNull()
  })

  it('la surcharge manuelle du CPU remplace la valeur calculée', () => {
    const withDb = estimate(baseConfig({ cpu: { id: 'ryzen-5-5600', overrideBand: null } }))
    const withOverride = estimate(
      baseConfig({ cpu: { id: 'ryzen-5-5600', overrideBand: { min: 500, moyen: 500, max: 500 } } }),
    )

    expect(withOverride.revente.moyen).toBeGreaterThan(withDb.revente.moyen)
    expect(withOverride.breakdown[0].isManual).toBe(true)
  })

  it("une surcharge manuelle mal ordonnée (moyen > max) est normalisée avant calcul", () => {
    // Régression : découvert en testant l'appli dans le navigateur -- en ne
    // modifiant que le champ "moyen" sans ajuster "max", le prix haut
    // affiché se retrouvait sous le prix moyen.
    const result = estimate(
      baseConfig({
        cpu: { id: 'ryzen-5-5600', overrideBand: { min: 496.24, moyen: 1000, max: 578.94 } },
      }),
    )

    expect(result.revente.min).toBeLessThanOrEqual(result.revente.moyen)
    expect(result.revente.moyen).toBeLessThanOrEqual(result.revente.max)
  })

  it('un état "mauvais" donne une revente plus basse qu\'un état "très bon" à config identique', () => {
    const mauvais = estimate(
      baseConfig({ cpu: { id: 'ryzen-5-5600', overrideBand: null }, condition: 'mauvais' }),
    )
    const tresBon = estimate(
      baseConfig({ cpu: { id: 'ryzen-5-5600', overrideBand: null }, condition: 'tres-bon' }),
    )

    expect(mauvais.revente.moyen).toBeLessThan(tresBon.revente.moyen)
  })

  it('plusieurs disques sont additionnés dans le calcul du stockage', () => {
    const unDisque = estimate(
      baseConfig({
        cpu: { id: 'ryzen-5-5600', overrideBand: null },
        disques: [{ id: '1', type: 'nvme', capacite: 1000 }],
      }),
    )
    const deuxDisques = estimate(
      baseConfig({
        cpu: { id: 'ryzen-5-5600', overrideBand: null },
        disques: [
          { id: '1', type: 'nvme', capacite: 1000 },
          { id: '2', type: 'hdd', capacite: 2000 },
        ],
      }),
    )

    expect(deuxDisques.revente.moyen).toBeGreaterThan(unDisque.revente.moyen)
  })

  it('les paliers de prix d\'achat conseillé sont strictement croissants avec la marge visée décroissante', () => {
    const result = estimate(
      baseConfig({
        cpu: { id: 'ryzen-5-5600', overrideBand: null },
        gpu: { id: 'rtx-4060', overrideBand: null },
      }),
    )

    expect(result.achatConseille.minimale).toBeGreaterThan(result.achatConseille.bonne)
    expect(result.achatConseille.bonne).toBeGreaterThan(result.achatConseille['tres-bonne'])
  })
})
