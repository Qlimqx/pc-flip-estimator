import type { StorageType } from '../types'

export interface StorageTypePricing {
  prixParGo: number
  plancher: number
  faciliteRevente: number
  decoteAnciennete: number
}

export const STORAGE_TYPE_LABELS: Record<StorageType, string> = {
  hdd: 'HDD',
  ssd: 'SSD SATA',
  nvme: 'NVMe',
}

// Même logique que ram.ts : tarif €/Go par type de stockage plutôt qu'une
// fiche par capacité.
//
// SSD/NVMe recalibrés le 2026-08-24, même cause que la RAM : pénurie
// mondiale de mémoire flash NAND (pas seulement DRAM) depuis fin 2025,
// confirmée par plusieurs sources presse tech -- +115% sur le NVMe et +75%
// sur le SATA en un an (Kingston : +246% sur la NAND en 2025 seule).
// Vérifié directement sur des annonces LeBonCoin occasion :
// - NVMe 1To : ~80-200€ (majorité 90-150€), soit ~0,115€/Go contre
//   ~0,048€/Go avant la pénurie.
// - SSD SATA 512Go : ~40-90€, soit ~0,127€/Go contre ~0,035€/Go avant.
// Le HDD n'est PAS concerné (technologie mécanique, pas de mémoire flash),
// laissé inchangé. Comme pour la RAM, la pénurie NAND est annoncée pour
// durer jusqu'en 2028 selon les analystes -- ces tarifs sont à revérifier
// périodiquement.
//
// Re-vérifié le 2026-10-07 : la pénurie NAND s'est nettement aggravée
// (puce NAND TLC 1Tb passée de 4,80$ en juillet à 10,70$ en octobre selon
// tech-insider.org/hwbusters.com ; un cadre Kioxia déclare que "l'ère du
// SSD 1To bon marché est terminée" -- club386.com ; Sandisk a relevé ses
// prix jusqu'à 2,8x selon Tom's Hardware) -- ssd et nvme ajustés à la
// hausse en conséquence, hdd inchangé.
export const STORAGE_TYPE_PRICING: Record<StorageType, StorageTypePricing> = {
  hdd: {
    prixParGo: 0.018,
    plancher: 8,
    faciliteRevente: 0.35,
    decoteAnciennete: 0.85,
  },
  ssd: {
    prixParGo: 0.16,
    plancher: 35,
    faciliteRevente: 0.7,
    decoteAnciennete: 1.0,
  },
  nvme: {
    prixParGo: 0.145,
    plancher: 40,
    faciliteRevente: 0.8,
    decoteAnciennete: 1.05,
  },
}
