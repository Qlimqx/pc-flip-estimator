// Types partagés par toute l'application. Les données (src/data) et le
// moteur de calcul (src/engine) sont écrits contre ces types, pour que les
// deux restent découplés : changer les prix ne touche jamais à la logique,
// et vice-versa.

export type Condition = 'mauvais' | 'correct' | 'bon' | 'tres-bon'

export type RamType = 'ddr3' | 'ddr4' | 'ddr5'
export type RamCapacity = 4 | 8 | 16 | 32 | 64 | 128

export type StorageType = 'hdd' | 'ssd' | 'nvme'
export type StorageCapacity = 120 | 240 | 480 | 500 | 512 | 1000 | 2000 | 4000

/** Fourchette de prix occasion pour un composant ou un poste de calcul. */
export interface PriceBand {
  min: number
  moyen: number
  max: number
}

/** Fiche de prix d'un composant identifiable (CPU ou GPU) dans la base. */
export interface ComponentPricing extends PriceBand {
  id: string
  nom: string
  marque: string
  dateMaj: string
  /** 0 (difficile à revendre) à 1 (très recherché, se vend vite et bien). */
  faciliteRevente: number
  /**
   * Multiplicateur de décote lié à l'ancienneté de la technologie, appliqué
   * en plus du prix de base (déjà réaliste pour ce modèle précis) — reflète
   * qu'une génération entière devient plus difficile à écouler avec le
   * temps, indépendamment du prix actuel de ce modèle. 1 = pas de décote
   * supplémentaire, < 1 = décote.
   */
  decoteAnciennete: number
  /** Grossière classification de puissance, utilisée pour le bonus config équilibrée. */
  tier: 1 | 2 | 3 | 4 | 5
}

export interface CpuPricing extends ComponentPricing {
  socket?: string
}

export interface GpuPricing extends ComponentPricing {
  vramGo?: number
}

export interface RamPriceEntry extends PriceBand {
  faciliteRevente: number
}

export interface StoragePriceEntry extends PriceBand {
  faciliteRevente: number
}

export interface StorageDrive {
  id: string
  type: StorageType
  capacite: StorageCapacity
}

/** Une ligne de composant dans le formulaire, avec surcharge manuelle optionnelle. */
export interface ComponentSelection<TId = string> {
  id: TId | null
  overrideBand: PriceBand | null
}

export interface PcConfiguration {
  cpu: ComponentSelection
  gpu: ComponentSelection | null
  ramCapacite: RamCapacity
  ramType: RamType
  ramOverrideBand: PriceBand | null
  disques: StorageDrive[]
  storageOverrideBand: PriceBand | null
  condition: Condition
  assemblageSoigne: boolean
  windowsActive: boolean
  carteMereConnue: boolean
  alimentationConnue: boolean
  boitierConnu: boolean
  prixAchat: number | null
}

export type Verdict =
  | 'tres-bonne-affaire'
  | 'bonne-affaire'
  | 'marge-faible'
  | 'trop-cher'
  | 'a-eviter'

export interface ComponentBreakdownLine {
  label: string
  band: PriceBand
  isManual: boolean
  /** Repère de prix neuf, pour comparaison -- null pour les lignes sans équivalent neuf (bonus, prime PC assemblé...). */
  neufEstime: number | null
}

export interface MarginTier {
  key: 'minimale' | 'bonne' | 'tres-bonne'
  label: string
  pct: number
}

export interface EstimationResult {
  revente: PriceBand
  breakdown: ComponentBreakdownLine[]
  configBonusPct: number
  achatConseille: Record<MarginTier['key'], number>
  prixAchatSaisi: number | null
  benefice: PriceBand | null
  margePct: number | null
  ecartPrixConseille: number | null
  verdict: Verdict | null
  explication: string
}

export interface EstimationHistoryEntry {
  id: string
  dateCreation: string
  dateModification: string
  nom: string
  config: PcConfiguration
  resultat: EstimationResult
}
