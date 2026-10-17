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
//
// Re-vérifié le 2026-10-07 : la DDR4 reste stable (presse -- Cowcotland --
// évoque même "un peu de calme") mais la DDR5 continue de grimper (kits
// 32Go neufs à 450-600€ chez Materiel.net/Grosbill, TrendForce prévoit
// encore +10-15% sur la DRAM au T4 2026) -- ddr4 inchangé, ddr5 ajusté de
// 11 à 13€/Go.
//
// Re-vérifié le 2026-10-11 : la DDR4 a fini par décrocher elle aussi. Kit de
// référence Cowcotland DDR4 3200 CL16 32Go stable à 209,90€ depuis fin août ;
// confirmé indépendamment par Corsair Vengeance LPX 32Go à 209,99€
// (Amazon.fr/Dealabs) et par des kits premium Crucial/G.Skill 32Go à
// 258-268€ (comparateur-gamer.fr/PCcomponentes, PowerPlanet) -- soit
// ~6,5-8,4€/Go, bien au-dessus du prix implicite précédent (4,7€/Go =
// 150,40€ pour 32Go, un écart de +40 à +80% selon la source). ddr4 ajusté de
// 4,7 à 6,5€/Go (aligné sur le bas de la fourchette, cohérent avec la
// logique déjà utilisée pour la DDR5) ; ddr5 et SSD/NVMe inchangés (dans la
// tolérance au vu du marché observé ce jour).
//
// Corrigé le 2026-10-13 : le calibrage du 10-11 avait en fait utilisé le
// prix NEUF au Go (kits Cowcotland/Corsair/Crucial-GSkill) comme s'il
// s'agissait du prix OCCASION, sans appliquer de décote -- erreur de
// méthode. Revérifié sur 5 annonces LeBonCoin/eBay.fr indépendantes de
// barrettes/kits 16Go desktop occasion réelles : 30€, 39€, ~56€, 60€, ~65€
// (médiane ~56€, soit ~3,5-4€/Go), très loin des 104€ (6,5€/Go) actuels.
// ddr4 ramené à 4€/Go -- cohérent avec l'estimation d'origine du 08-24
// (~4,7€/Go), légèrement révisé à la baisse par les données les plus
// récentes.
//
// Corrigé le 2026-10-17 : la ddr5 souffrait du même bug neuf/occasion déjà
// corrigé pour la ddr4 le 10-13 (13€/Go venait des kits neufs 32Go à
// 450-600€ chez Materiel.net/Grosbill, jamais revérifié depuis contre
// l'occasion réelle). Revérifié sur plusieurs annonces LeBonCoin/eBay.fr de
// kits DDR5 32Go occasion : Crucial 290€, G.Skill Trident Z5 (équivalent
// 32Go) ~275€, Forgeon 2x16 6000 CL30 239€ (eBay.fr), fourchette de
// négociation 190-240€ rapportée sur Hardware.fr -- médiane ~265€, soit
// ~7€/Go une fois la décote bon-état/facilité (×1,177) retirée, contre
// 13€/Go actuels (+86% d'écart). ddr4/SSD/NVMe inchangés (dans la
// tolérance ou données insuffisantes pour trancher, voir storage.ts).
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
    prixParGo: 4,
    plancher: 25,
    faciliteRevente: 0.75,
    decoteAnciennete: 1.0,
  },
  ddr5: {
    prixParGo: 7,
    plancher: 60,
    faciliteRevente: 0.85,
    decoteAnciennete: 1.1,
  },
}
