# Rapport de l'agent quotidien — 2026-11-05

**Statut : Terminé avec avertissements**

- Déclencheur : push ([exécution](https://github.com/Qlimqx/pc-flip-estimator/actions/runs/41971643127))
- Début : 2026-11-05 06:04 (Paris) · Fin : 2026-11-05 06:06 (Paris) · Durée : 90 s
- Échéance de travail : 2026-11-05 06:44 (Paris) · Terminé avant 10 h (Paris) : oui

## Bilan

| Indicateur | Valeur |
|---|---|
| Composants du catalogue analysés | 212 |
| Prix vérifiés (données reçues) | 84 |
| Prix mis à jour | 30 (dont 15 à relire) |
| En attente de confirmation (saut > 15 %) | 6 |
| Données insuffisantes (valeur conservée) | 127 |
| Rejetés (écart aberrant, valeur conservée) | 49 |
| Source indisponible | 0 |
| Non traités | 0 |
| Composants ajoutés | 1 |
| Composants manquants détectés mais non ajoutés | 11 |
| Prix absents ou obsolètes (> 45 jours) | 75 |
| Anomalies de cohérence | 0 |

## Sources

- **eBay Browse (FR)** : disponible — 422 requêtes, 0 nouvelle(s) tentative(s), 0 échec(s) ; prix demandés d'occasion et neufs
- **Wikipédia (confirmation d'existence)** : utilisée pour les candidats évalués — API de recherche MediaWiki, extraits contenant le modèle exact

## Avertissements

- 49 prix rejeté(s) comme aberrants (valeur conservée)

## Composants ajoutés

- **AMD Ryzen 3 1200** (cpu) : 37.1 € (31.54 €–42.67 €), confiance faible, 7 annonces / 6 vendeurs, attributs estimés : tier, faciliteRevente, decoteAnciennete, socket

## RAM et stockage (€/Go)

- **ram:ddr3** : donnees-insuffisantes — moins de 4 annonces valides après filtrage : valeur conservée
- **ram:ddr4** : mis-a-jour (mesuré 4.5656 €/Go, 14 annonces) — appliqué
- **ram:ddr5** : donnees-insuffisantes — moins de 4 annonces valides après filtrage : valeur conservée
- **stockage:hdd** : rejete (mesuré 0.0413 €/Go, 31 annonces) — écart de 65 % à la référence (0.025 € -> 0.0413 €), au-delà de 60 %
- **stockage:ssd** : mis-a-jour-a-verifier (mesuré 0.1572 €/Go, 68 annonces) — appliqué mais écart de 57 % à la référence : relecture humaine conseillée
- **stockage:nvme** : mis-a-jour-a-verifier (mesuré 0.1444 €/Go, 34 annonces) — appliqué mais écart de 52 % à la référence : relecture humaine conseillée

## À vérifier manuellement

- **Intel Core i5-4460** [prix-rejete] : écart de 127 % à la référence (20 € -> 45.38 €), au-delà de 60 %
- **RTX 4080** [prix-rejete] : écart de 80 % à la référence (950 € -> 1708.79 €), au-delà de 60 %
- **RX 6700 XT** [prix-rejete] : écart de 67 % à la référence (280 € -> 467.15 €), au-delà de 60 %
- **Intel Core i7-3770K** [prix-rejete] : écart de 94 % à la référence (48 € -> 93.28 €), au-delà de 60 %
- **GTX 670** [prix-rejete] : écart de 483 % à la référence (22 € -> 128.32 €), au-delà de 60 %
- **RTX 4070 Super** [prix-rejete] : écart de 126 % à la référence (610 € -> 1375.87 €), au-delà de 60 %
- **RTX 5080** [prix-rejete] : écart de 138 % à la référence (1200 € -> 2857.62 €), au-delà de 60 %
- **RTX 5060 Ti** [prix-rejete] : écart de 77 % à la référence (510 € -> 904.3 €), au-delà de 60 %
- **RTX 3060** [prix-rejete] : écart de 131 % à la référence (235 € -> 542.9 €), au-delà de 60 %
- **RTX 4070 Ti** [prix-rejete] : écart de 69 % à la référence (720 € -> 1215.03 €), au-delà de 60 %
- **RTX 3060 Ti** [prix-rejete] : écart de 102 % à la référence (220 € -> 445.3 €), au-delà de 60 %
- **RTX 3070** [ecart-notable] : appliqué mais écart de 40 % à la référence : relecture humaine conseillée
- **AMD Ryzen 5 3600** [prix-rejete] : écart de 149 % à la référence (58 € -> 144.21 €), au-delà de 60 %
- **RTX 3080** [prix-rejete] : écart de 63 % à la référence (380 € -> 618.7 €), au-delà de 60 %
- **RTX 3070 Ti** [prix-rejete] : écart de 93 % à la référence (290 € -> 560 €), au-delà de 60 %
- **AMD Ryzen 5 3600X** [prix-rejete] : écart de 107 % à la référence (60 € -> 124.46 €), au-delà de 60 %
- **RX 9070 XT** [prix-rejete] : écart de 134 % à la référence (580 € -> 1356.01 €), au-delà de 60 %
- **RTX 3080 Ti** [prix-rejete] : écart de 77 % à la référence (480 € -> 849 €), au-delà de 60 %
- **RTX 3050** [prix-rejete] : écart de 131 % à la référence (150 € -> 346.94 €), au-delà de 60 %
- **RX 6600** [ecart-notable] : appliqué mais écart de 35 % à la référence : relecture humaine conseillée
- **RTX 2060** [ecart-notable] : appliqué mais écart de 57 % à la référence : relecture humaine conseillée
- **RTX 3090** [prix-rejete] : écart de 282 % à la référence (900 € -> 3437.79 €), au-delà de 60 %
- **RTX 2070** [ecart-notable] : appliqué mais écart de 46 % à la référence : relecture humaine conseillée
- **RTX 2070 Super** [prix-rejete] : écart de 116 % à la référence (158 € -> 341.55 €), au-delà de 60 %
- **GTX 1660 Super** [prix-rejete] : écart de 126 % à la référence (102 € -> 230.78 €), au-delà de 60 %
- **GTX 1660 Ti** [prix-rejete] : écart de 154 % à la référence (108 € -> 273.94 €), au-delà de 60 %
- **RTX 2080** [ecart-notable] : appliqué mais écart de 41 % à la référence : relecture humaine conseillée
- **RX 6900 XT** [ecart-notable] : appliqué mais écart de 59 % à la référence : relecture humaine conseillée
- **AMD Ryzen 5 2600X** [ecart-notable] : appliqué mais écart de 39 % à la référence : relecture humaine conseillée
- **AMD Ryzen 3 3200G** [ecart-notable] : appliqué mais écart de 27 % à la référence : relecture humaine conseillée
- **AMD Ryzen 7 2700X** [prix-rejete] : écart de 187 % à la référence (38 € -> 109.08 €), au-delà de 60 %
- **GTX 1660** [ecart-notable] : appliqué mais écart de 43 % à la référence : relecture humaine conseillée
- **RX 5700 XT** [prix-rejete] : écart de 98 % à la référence (165 € -> 326.95 €), au-delà de 60 %
- **RTX 2080 Ti** [prix-rejete] : écart de 135 % à la référence (280 € -> 658.07 €), au-delà de 60 %
- **Intel Core i9-9900K** [prix-rejete] : écart de 86 % à la référence (205 € -> 380.76 €), au-delà de 60 %
- **GTX 1650** [prix-rejete] : écart de 143 % à la référence (82 € -> 199 €), au-delà de 60 %
- **GTX 1070** [prix-rejete] : écart de 130 % à la référence (100 € -> 230.34 €), au-delà de 60 %
- **GTX 1080** [prix-rejete] : écart de 66 % à la référence (140 € -> 232.31 €), au-delà de 60 %
- **GTX 1080 Ti** [prix-rejete] : écart de 131 % à la référence (180 € -> 415.99 €), au-delà de 60 %
- **Intel Core i5-7600K** [ecart-notable] : appliqué mais écart de 29 % à la référence : relecture humaine conseillée
- **Intel Core i3-8100** [ecart-notable] : appliqué mais écart de 36 % à la référence : relecture humaine conseillée
- **GTX 1050 Ti** [prix-rejete] : écart de 76 % à la référence (70 € -> 122.9 €), au-delà de 60 %
- **RX 580** [prix-rejete] : écart de 78 % à la référence (72 € -> 128.1 €), au-delà de 60 %
- **RX 590** [prix-rejete] : écart de 98 % à la référence (85 € -> 168.35 €), au-delà de 60 %
- **Intel Core i7-4790K** [ecart-notable] : appliqué mais écart de 47 % à la référence : relecture humaine conseillée
- **RX 570** [prix-rejete] : écart de 142 % à la référence (55 € -> 132.95 €), au-delà de 60 %
- **Intel Core i5-4590** [ecart-notable] : appliqué mais écart de 30 % à la référence : relecture humaine conseillée
- **GTX 980** [prix-rejete] : écart de 148 % à la référence (55 € -> 136.62 €), au-delà de 60 %
- **GTX 960** [ecart-notable] : appliqué mais écart de 48 % à la référence : relecture humaine conseillée
- **GTX 980 Ti** [prix-rejete] : écart de 105 % à la référence (105 € -> 215.26 €), au-delà de 60 %
- **GTX 750 Ti** [prix-rejete] : écart de 453 % à la référence (22 € -> 121.68 €), au-delà de 60 %
- **Intel Core i5-2500K** [prix-rejete] : écart de 79 % à la référence (12 € -> 21.5 €), au-delà de 60 %
- **Intel Core i5-3570K** [prix-rejete] : écart de 105 % à la référence (30 € -> 61.43 €), au-delà de 60 %
- **GTX 760** [prix-rejete] : écart de 220 % à la référence (38 € -> 121.51 €), au-delà de 60 %
- **GTX 770** [prix-rejete] : écart de 172 % à la référence (27 € -> 73.5 €), au-delà de 60 %
- **GTX 780** [prix-rejete] : écart de 174 % à la référence (42 € -> 115.1 €), au-delà de 60 %
- **GT 1030** [ecart-notable] : appliqué mais écart de 57 % à la référence : relecture humaine conseillée
- **AMD FX-6300** [prix-rejete] : écart de 73 % à la référence (22 € -> 38.11 €), au-delà de 60 %
- **GTX 680** [prix-rejete] : écart de 290 % à la référence (36 € -> 140.39 €), au-delà de 60 %
- **R9 270X** [prix-rejete] : écart de 102 % à la référence (23 € -> 46.35 €), au-delà de 60 %
- **GTX 460** [prix-rejete] : écart de 149 % à la référence (12 € -> 29.82 €), au-delà de 60 %
- **GTX 560 Ti** [prix-rejete] : écart de 150 % à la référence (15 € -> 37.49 €), au-delà de 60 %
- **Radeon HD 7870** [prix-rejete] : écart de 64 % à la référence (21 € -> 34.5 €), au-delà de 60 %
- **stockage:hdd** [prix-rejete] : écart de 65 % à la référence (0.025 € -> 0.0413 €), au-delà de 60 %
- **Intel Core i7-6700** [composant-manquant] : 5 annonce(s), 5 vendeur(s) — seulement 5 annonce(s) (minimum 6)
- **GTX 1060** [composant-manquant] : 5 annonce(s), 5 vendeur(s) — variante proche d'un composant déjà au catalogue (« GTX 1060 3Go ») : doublon possible
- **Intel Core i3-4160** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i3-4150** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i3-2100** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i5-9500** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i3-9100** [composant-manquant] : 3 annonce(s), 3 vendeur(s) — seulement 3 annonce(s) (minimum 6)
- **Intel Core i3-4170** [composant-manquant] : 3 annonce(s), 3 vendeur(s) — seulement 3 annonce(s) (minimum 6)
- **Intel Core i3-4130** [composant-manquant] : 3 annonce(s), 3 vendeur(s) — seulement 3 annonce(s) (minimum 6)
- **Intel Core i5-8500** [composant-manquant] : 3 annonce(s), 3 vendeur(s) — seulement 3 annonce(s) (minimum 6)
- **Intel Core i5-6400** [composant-manquant] : 3 annonce(s), 3 vendeur(s) — seulement 3 annonce(s) (minimum 6)

## Limites

- Les prix eBay sont des prix DEMANDÉS (annonces actives), jamais des prix de vente constatés.
- Aucune API de fabricant ou de boutique neuve n'est connectée : le prix neuf est le prix demandé eBay (état « Neuf »), indicatif.
- Cartes mères, alimentations, boîtiers et refroidissements ne sont valorisés que par forfait (secondary.ts) : non vérifiables modèle par modèle.
- Les attributs des composants ajoutés (tier, facilité de revente, décote, socket) sont hérités d'un composant voisin et marqués comme estimés.
