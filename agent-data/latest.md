# Rapport de l'agent quotidien — 2026-10-23

**Statut : Terminé avec avertissements**

- Déclencheur : workflow_dispatch ([exécution](https://github.com/Qlimqx/pc-flip-estimator/actions/runs/40003753774))
- Début : 2026-10-23 20:30 (Paris) · Fin : 2026-10-23 20:31 (Paris) · Durée : 100 s
- Échéance de travail : 2026-10-23 20:55 (Paris) · Terminé avant 10 h (Paris) : NON

## Bilan

| Indicateur | Valeur |
|---|---|
| Composants du catalogue analysés | 210 |
| Prix vérifiés (données reçues) | 96 |
| Prix mis à jour | 33 (dont 18 à relire) |
| En attente de confirmation (saut > 15 %) | 6 |
| Données insuffisantes (valeur conservée) | 112 |
| Rejetés (écart aberrant, valeur conservée) | 59 |
| Source indisponible | 0 |
| Non traités | 0 |
| Composants ajoutés | 2 |
| Composants manquants détectés mais non ajoutés | 10 |
| Prix absents ou obsolètes (> 45 jours) | 101 |
| Anomalies de cohérence | 0 |

## Sources

- **eBay Browse (FR)** : disponible — 416 requêtes, 0 nouvelle(s) tentative(s), 0 échec(s) ; prix demandés d'occasion et neufs
- **Wikipédia (confirmation d'existence)** : utilisée pour les candidats évalués — API de recherche MediaWiki, extraits contenant le modèle exact

## Avertissements

- 59 prix rejeté(s) comme aberrants (valeur conservée)
- exécution démarrée après 09:45 (Paris) : la contrainte de fin avant 10 h n'était plus garantie

## Composants ajoutés

- **Intel Core i3-7100** (cpu) : 11.16 € (9.49 €–12.83 €), confiance moyenne, 6 annonces / 6 vendeurs, attributs estimés : tier, faciliteRevente, decoteAnciennete, socket
- **Intel Core i3-6100** (cpu) : 10.8 € (9.18 €–12.42 €), confiance moyenne, 6 annonces / 6 vendeurs, attributs estimés : tier, faciliteRevente, decoteAnciennete, socket

## RAM et stockage (€/Go)

- **ram:ddr3** : rejete (mesuré 3.6075 €/Go, 29 annonces) — écart de 301 % à la référence (0.9 € -> 3.6075 €), au-delà de 60 %
- **ram:ddr4** : en-attente-confirmation (mesuré 5.4281 €/Go, 12 annonces) — saut de 36 % (4 € -> 5.4281 €) : appliqué seulement s'il est confirmé au prochain run
- **ram:ddr5** : donnees-insuffisantes — moins de 4 annonces valides après filtrage : valeur conservée
- **stockage:hdd** : rejete (mesuré 0.0462 €/Go, 28 annonces) — écart de 157 % à la référence (0.018 € -> 0.0462 €), au-delà de 60 %
- **stockage:ssd** : en-attente-confirmation (mesuré 0.1572 €/Go, 66 annonces) — saut de 57 % (0.1 € -> 0.1572 €) : appliqué seulement s'il est confirmé au prochain run
- **stockage:nvme** : en-attente-confirmation (mesuré 0.1369 €/Go, 30 annonces) — saut de 44 % (0.095 € -> 0.1369 €) : appliqué seulement s'il est confirmé au prochain run

## À vérifier manuellement

- **RTX 4070 Super** [prix-rejete] : écart de 126 % à la référence (610 € -> 1375.87 €), au-delà de 60 %
- **AMD Ryzen 7 5800X** [prix-rejete] : écart de 63 % à la référence (160 € -> 260.86 €), au-delà de 60 %
- **RTX 5060 Ti** [prix-rejete] : écart de 74 % à la référence (510 € -> 889.41 €), au-delà de 60 %
- **RTX 5080** [prix-rejete] : écart de 159 % à la référence (1200 € -> 3112.81 €), au-delà de 60 %
- **RTX 5090** [ecart-notable] : appliqué mais écart de 57 % à la référence : relecture humaine conseillée
- **RTX 3060** [prix-rejete] : écart de 158 % à la référence (235 € -> 607.24 €), au-delà de 60 %
- **RTX 4070 Ti** [prix-rejete] : écart de 69 % à la référence (720 € -> 1215.03 €), au-delà de 60 %
- **AMD Ryzen 7 7700** [prix-rejete] : écart de 109 % à la référence (180 € -> 376.56 €), au-delà de 60 %
- **RTX 3060 Ti** [prix-rejete] : écart de 84 % à la référence (220 € -> 404.5 €), au-delà de 60 %
- **RTX 3070** [ecart-notable] : appliqué mais écart de 38 % à la référence : relecture humaine conseillée
- **AMD Ryzen 5 3600** [prix-rejete] : écart de 65 % à la référence (58 € -> 95.74 €), au-delà de 60 %
- **RTX 3070 Ti** [prix-rejete] : écart de 93 % à la référence (290 € -> 559.5 €), au-delà de 60 %
- **RTX 4080** [prix-rejete] : écart de 80 % à la référence (950 € -> 1709.94 €), au-delà de 60 %
- **RTX 3080** [prix-rejete] : écart de 60 % à la référence (380 € -> 608.34 €), au-delà de 60 %
- **RTX 4080 Super** [ecart-notable] : appliqué mais écart de 48 % à la référence : relecture humaine conseillée
- **AMD Ryzen 5 3600X** [prix-rejete] : écart de 103 % à la référence (60 € -> 121.86 €), au-delà de 60 %
- **RX 9070 XT** [prix-rejete] : écart de 84 % à la référence (700 € -> 1284.62 €), au-delà de 60 %
- **RTX 3080 Ti** [prix-rejete] : écart de 82 % à la référence (480 € -> 871.55 €), au-delà de 60 %
- **AMD Ryzen 7 3800X** [ecart-notable] : appliqué mais écart de 43 % à la référence : relecture humaine conseillée
- **RTX 3050** [prix-rejete] : écart de 137 % à la référence (150 € -> 354.9 €), au-delà de 60 %
- **RX 6600** [ecart-notable] : appliqué mais écart de 38 % à la référence : relecture humaine conseillée
- **AMD Ryzen 9 3900X** [ecart-notable] : appliqué mais écart de 31 % à la référence : relecture humaine conseillée
- **RTX 2060** [ecart-notable] : appliqué mais écart de 57 % à la référence : relecture humaine conseillée
- **RTX 2060 Super** [ecart-notable] : appliqué mais écart de 39 % à la référence : relecture humaine conseillée
- **RX 6700 XT** [ecart-notable] : appliqué mais écart de 42 % à la référence : relecture humaine conseillée
- **RTX 3090** [prix-rejete] : écart de 249 % à la référence (900 € -> 3138.56 €), au-delà de 60 %
- **RTX 2070** [ecart-notable] : appliqué mais écart de 47 % à la référence : relecture humaine conseillée
- **RTX 2070 Super** [prix-rejete] : écart de 108 % à la référence (158 € -> 329.15 €), au-delà de 60 %
- **Intel Core i5-10400F** [prix-rejete] : écart de 92 % à la référence (75 € -> 143.97 €), au-delà de 60 %
- **GTX 1660 Super** [prix-rejete] : écart de 141 % à la référence (102 € -> 246.22 €), au-delà de 60 %
- **GTX 1660 Ti** [prix-rejete] : écart de 147 % à la référence (108 € -> 266.7 €), au-delà de 60 %
- **RTX 2080** [prix-rejete] : écart de 114 % à la référence (170 € -> 363.7 €), au-delà de 60 %
- **RTX 2080 Super** [prix-rejete] : écart de 96 % à la référence (230 € -> 450.74 €), au-delà de 60 %
- **RX 6900 XT** [ecart-notable] : appliqué mais écart de 59 % à la référence : relecture humaine conseillée
- **AMD Ryzen 5 2600X** [ecart-notable] : appliqué mais écart de 30 % à la référence : relecture humaine conseillée
- **AMD Ryzen 3 3200G** [ecart-notable] : appliqué mais écart de 29 % à la référence : relecture humaine conseillée
- **AMD Ryzen 7 2700X** [prix-rejete] : écart de 187 % à la référence (38 € -> 109.08 €), au-delà de 60 %
- **GTX 1660** [prix-rejete] : écart de 90 % à la référence (88 € -> 167.1 €), au-delà de 60 %
- **RX 5700 XT** [prix-rejete] : écart de 98 % à la référence (165 € -> 326.95 €), au-delà de 60 %
- **RTX 2080 Ti** [prix-rejete] : écart de 148 % à la référence (230 € -> 571.05 €), au-delà de 60 %
- **AMD Ryzen 5 1600** [prix-rejete] : écart de 90 % à la référence (33 € -> 62.58 €), au-delà de 60 %
- **Intel Core i3-10100F** [prix-rejete] : écart de 81 % à la référence (42 € -> 76.04 €), au-delà de 60 %
- **Intel Core i9-9900K** [ecart-notable] : appliqué mais écart de 56 % à la référence : relecture humaine conseillée
- **GTX 1650** [prix-rejete] : écart de 191 % à la référence (70 € -> 203.85 €), au-delà de 60 %
- **GTX 1070** [prix-rejete] : écart de 130 % à la référence (100 € -> 229.5 €), au-delà de 60 %
- **GTX 1070 Ti** [prix-rejete] : écart de 128 % à la référence (115 € -> 262.64 €), au-delà de 60 %
- **GTX 1080 Ti** [prix-rejete] : écart de 129 % à la référence (180 € -> 411.37 €), au-delà de 60 %
- **GTX 1080** [ecart-notable] : appliqué mais écart de 53 % à la référence : relecture humaine conseillée
- **GTX 1050 Ti** [prix-rejete] : écart de 79 % à la référence (70 € -> 125.04 €), au-delà de 60 %
- **Intel Core i3-8100** [ecart-notable] : appliqué mais écart de 29 % à la référence : relecture humaine conseillée
- **RX 580** [prix-rejete] : écart de 74 % à la référence (72 € -> 125.5 €), au-delà de 60 %
- **RX 590** [prix-rejete] : écart de 98 % à la référence (85 € -> 168.35 €), au-delà de 60 %
- **Intel Core i7-4790K** [prix-rejete] : écart de 153 % à la référence (33 € -> 83.46 €), au-delà de 60 %
- **RX 480** [ecart-notable] : appliqué mais écart de 27 % à la référence : relecture humaine conseillée
- **RX 570** [prix-rejete] : écart de 136 % à la référence (55 € -> 130 €), au-delà de 60 %
- **GTX 970** [prix-rejete] : écart de 77 % à la référence (42 € -> 74.25 €), au-delà de 60 %
- **Intel Core i5-4590** [ecart-notable] : appliqué mais écart de 33 % à la référence : relecture humaine conseillée
- **GTX 980** [prix-rejete] : écart de 154 % à la référence (55 € -> 139.6 €), au-delà de 60 %
- **RX 560** [prix-rejete] : écart de 144 % à la référence (33 € -> 80.39 €), au-delà de 60 %
- **GTX 960** [prix-rejete] : écart de 211 % à la référence (42 € -> 130.41 €), au-delà de 60 %
- **Intel Core i7-3770K** [prix-rejete] : écart de 369 % à la référence (22 € -> 103.18 €), au-delà de 60 %
- **GTX 950** [prix-rejete] : écart de 491 % à la référence (28 € -> 165.57 €), au-delà de 60 %
- **GTX 750 Ti** [prix-rejete] : écart de 438 % à la référence (22 € -> 118.46 €), au-delà de 60 %
- **Intel Core i5-3570K** [prix-rejete] : écart de 379 % à la référence (15 € -> 71.88 €), au-delà de 60 %
- **Intel Core i5-2500K** [prix-rejete] : écart de 79 % à la référence (12 € -> 21.5 €), au-delà de 60 %
- **GTX 760** [prix-rejete] : écart de 374 % à la référence (25 € -> 118.39 €), au-delà de 60 %
- **GTX 770** [prix-rejete] : écart de 134 % à la référence (27 € -> 63.1 €), au-delà de 60 %
- **GTX 780** [prix-rejete] : écart de 174 % à la référence (42 € -> 115.1 €), au-delà de 60 %
- **AMD FX-6300** [prix-rejete] : écart de 246 % à la référence (11 € -> 38.11 €), au-delà de 60 %
- **GTX 660** [prix-rejete] : écart de 470 % à la référence (19 € -> 108.33 €), au-delà de 60 %
- **GTX 670** [prix-rejete] : écart de 130 % à la référence (22 € -> 50.62 €), au-delà de 60 %
- **GTX 680** [prix-rejete] : écart de 234 % à la référence (36 € -> 120.18 €), au-delà de 60 %
- **R9 270X** [prix-rejete] : écart de 83 % à la référence (23 € -> 42 €), au-delà de 60 %
- **GTX 460** [prix-rejete] : écart de 149 % à la référence (12 € -> 29.82 €), au-delà de 60 %
- **GTX 560 Ti** [prix-rejete] : écart de 150 % à la référence (15 € -> 37.49 €), au-delà de 60 %
- **ram:ddr3** [prix-rejete] : écart de 301 % à la référence (0.9 € -> 3.6075 €), au-delà de 60 %
- **stockage:hdd** [prix-rejete] : écart de 157 % à la référence (0.018 € -> 0.0462 €), au-delà de 60 %
- **Intel Core i7-7700** [composant-manquant] : 5 annonce(s), 5 vendeur(s) — seulement 5 annonce(s) (minimum 6)
- **GTX 1060** [composant-manquant] : 5 annonce(s), 4 vendeur(s) — variante proche d'un composant déjà au catalogue (« GTX 1060 3Go ») : doublon possible
- **Intel Core i3-4130** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i5-6600** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i5-6400** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i7-7700K** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i9-11900F** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i9-10900F** [composant-manquant] : 4 annonce(s), 3 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i9-10900** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **AMD Ryzen 3 1200** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)

## Limites

- Les prix eBay sont des prix DEMANDÉS (annonces actives), jamais des prix de vente constatés.
- Aucune API de fabricant ou de boutique neuve n'est connectée : le prix neuf est le prix demandé eBay (état « Neuf »), indicatif.
- Cartes mères, alimentations, boîtiers et refroidissements ne sont valorisés que par forfait (secondary.ts) : non vérifiables modèle par modèle.
- Les attributs des composants ajoutés (tier, facilité de revente, décote, socket) sont hérités d'un composant voisin et marqués comme estimés.
