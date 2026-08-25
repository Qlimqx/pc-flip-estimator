import type { RamType } from '../types'

// La RAM/le stockage sont des composants commodités : plutôt qu'une fiche
// par (capacité × type), on modélise un tarif €/Go par type — ça couvre
// n'importe quelle capacité sans avoir à énumérer des combinaisons qui
// n'existent pas réellement (ex : 128 Go en DDR3). `floor` évite qu'une
// petite capacité tombe à un prix ridicule.
export interface RamTypePricing {
  prixParGo: number
  plancher: number
  faciliteRevente: number
  decoteAnciennete: number
}

export const RAM_TYPE_LABELS: Record<RamType, string> = {
  ddr3: 'DDR3',
  ddr4: 'DDR4',
  ddr5: 'DDR5',
}

// Recalibré le 2026-08-24 : il y a une pénurie mondiale de DRAM bien réelle
// et documentée depuis fin 2025 (Samsung/SK Hynix/Micron ont réorienté leur
// production vers la mémoire HBM pour l'IA), qui a fait grimper les prix de
// la RAM neuve ET occasion dans des proportions inédites -- confirmé par
// plusieurs sources presse tech (hardwarecooking.fr, topachat.com,
// omgpu.com, dropreference.com) : DDR5 x4 à x5 entre septembre 2025 et
// juillet 2026, DDR4 +50%+ sur la même période. Vérifié directement sur des
// annonces LeBonCoin occasion (pas juste le prix neuf) :
// - DDR4 16Go : ~55-90€ (desktop), soit ~4,7€/Go -- avant la pénurie
//   c'était plutôt ~1,6€/Go.
// - DDR5 16Go : ~115-280€ ; DDR5 32Go : ~270-480€ -- soit ~11€/Go dans les
//   deux cas, contre ~2,4€/Go avant la pénurie.
// Les analystes (Gartner, TrendForce) annoncent que la pénurie devrait durer
// au moins jusqu'en 2028 -- ces tarifs sont donc probablement encore amenés
// à bouger, à revérifier périodiquement plutôt que de les considérer figés.
export const RAM_TYPE_PRICING: Record<RamType, RamTypePricing> = {
  ddr3: {
    // DDR3 est aussi "touchée" par la pénurie selon la presse (marché de
    // niche, pas de production DDR3 pure mais dérivée de lignes DRAM
    // partagées), mais sans chiffre précis vérifié -- bond modéré appliqué
    // par cohérence avec DDR4/DDR5, à ajuster si une annonce réelle
    // montre un écart.
    prixParGo: 0.9,
    plancher: 6,
    faciliteRevente: 0.3,
    decoteAnciennete: 0.75,
  },
  ddr4: {
    prixParGo: 4.7,
    plancher: 25,
    faciliteRevente: 0.75,
    decoteAnciennete: 1.0,
  },
  ddr5: {
    prixParGo: 11,
    plancher: 60,
    faciliteRevente: 0.85,
    decoteAnciennete: 1.1,
  },
}
