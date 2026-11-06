# Rapport de l'agent quotidien — 2026-11-06

**Statut : Terminé avec avertissements**

- Déclencheur : push ([exécution](https://github.com/Qlimqx/pc-flip-estimator/actions/runs/42166208964))
- Début : 2026-11-06 06:04 (Paris) · Fin : 2026-11-06 06:06 (Paris) · Durée : 90 s
- Échéance de travail : 2026-11-06 06:44 (Paris) · Terminé avant 10 h (Paris) : oui

## Bilan

| Indicateur | Valeur |
|---|---|
| Composants du catalogue analysés | 213 |
| Prix vérifiés (données reçues) | 86 |
| Prix mis à jour | 40 (dont 23 à relire) |
| En attente de confirmation (saut > 15 %) | 1 |
| Données insuffisantes (valeur conservée) | 126 |
| Rejetés (écart aberrant, valeur conservée) | 45 |
| Source indisponible | 0 |
| Non traités | 0 |
| Composants ajoutés | 1 |
| Composants manquants détectés mais non ajoutés | 11 |
| Prix absents ou obsolètes (> 45 jours) | 72 |
| Anomalies de cohérence | 0 |

## Sources

- **eBay Browse (FR)** : disponible — 424 requêtes, 0 nouvelle(s) tentative(s), 0 échec(s) ; prix demandés d'occasion et neufs
- **Wikipédia (confirmation d'existence)** : utilisée pour les candidats évalués — API de recherche MediaWiki, extraits contenant le modèle exact

## Avertissements

- 45 prix rejeté(s) comme aberrants (valeur conservée)

## Composants ajoutés

- **Intel Core i7-6700** (cpu) : 47 € (32.9 €–69.5 €), confiance moyenne, 6 annonces / 6 vendeurs, attributs estimés : tier, faciliteRevente, decoteAnciennete, socket

## RAM et stockage (€/Go)

- **ram:ddr3** : donnees-insuffisantes — moins de 4 annonces valides après filtrage : valeur conservée
- **ram:ddr4** : mis-a-jour (mesuré 4.625 €/Go, 13 annonces) — appliqué
- **ram:ddr5** : donnees-insuffisantes — moins de 4 annonces valides après filtrage : valeur conservée
- **stockage:hdd** : en-attente-confirmation (mesuré 0.043 €/Go, 32 annonces) — saut de 23 % (0.035 € -> 0.043 €) : appliqué seulement s'il est confirmé au prochain run
- **stockage:ssd** : mis-a-jour-a-verifier (mesuré 0.1572 €/Go, 66 annonces) — appliqué mais écart de 37 % à la référence : relecture humaine conseillée
- **stockage:nvme** : mis-a-jour-a-verifier (mesuré 0.1447 €/Go, 35 annonces) — appliqué mais écart de 52 % à la référence : relecture humaine conseillée

## À vérifier manuellement

- **RTX 4070** [prix-rejete] : écart de 135 % à la référence (430 € -> 1011.77 €), au-delà de 60 %
- **AMD Ryzen 7 3800X** [prix-rejete] : écart de 86 % à la référence (98 € -> 182.7 €), au-delà de 60 %
- **Intel Core i5-9400F** [ecart-notable] : appliqué mais écart de 50 % à la référence : relecture humaine conseillée
- **RTX 4070 Super** [prix-rejete] : écart de 126 % à la référence (610 € -> 1375.87 €), au-delà de 60 %
- **RTX 5060 Ti** [prix-rejete] : écart de 70 % à la référence (510 € -> 865.35 €), au-delà de 60 %
- **RTX 5080** [prix-rejete] : écart de 172 % à la référence (1200 € -> 3261.41 €), au-delà de 60 %
- **RTX 3060** [prix-rejete] : écart de 129 % à la référence (235 € -> 537.1 €), au-delà de 60 %
- **RTX 4070 Ti** [prix-rejete] : écart de 69 % à la référence (720 € -> 1215.03 €), au-delà de 60 %
- **RTX 3060 Ti** [prix-rejete] : écart de 98 % à la référence (220 € -> 435.1 €), au-delà de 60 %
- **RTX 3070** [ecart-notable] : appliqué mais écart de 40 % à la référence : relecture humaine conseillée
- **AMD Ryzen 5 3600** [prix-rejete] : écart de 149 % à la référence (58 € -> 144.21 €), au-delà de 60 %
- **RTX 3070 Ti** [prix-rejete] : écart de 93 % à la référence (290 € -> 559 €), au-delà de 60 %
- **RTX 3080** [prix-rejete] : écart de 63 % à la référence (380 € -> 618.7 €), au-delà de 60 %
- **RTX 4080** [prix-rejete] : écart de 71 % à la référence (950 € -> 1621.12 €), au-delà de 60 %
- **AMD Ryzen 5 3600X** [prix-rejete] : écart de 107 % à la référence (60 € -> 124.46 €), au-delà de 60 %
- **RX 9070 XT** [prix-rejete] : écart de 192 % à la référence (580 € -> 1695.78 €), au-delà de 60 %
- **RTX 3080 Ti** [prix-rejete] : écart de 96 % à la référence (480 € -> 939.38 €), au-delà de 60 %
- **RTX 3050** [prix-rejete] : écart de 106 % à la référence (175 € -> 359.75 €), au-delà de 60 %
- **RX 6600** [ecart-notable] : appliqué mais écart de 35 % à la référence : relecture humaine conseillée
- **RTX 2060** [ecart-notable] : appliqué mais écart de 49 % à la référence : relecture humaine conseillée
- **RX 6600 XT** [ecart-notable] : appliqué mais écart de 29 % à la référence : relecture humaine conseillée
- **RTX 3090** [prix-rejete] : écart de 388 % à la référence (900 € -> 4393.69 €), au-delà de 60 %
- **RTX 2070** [ecart-notable] : appliqué mais écart de 46 % à la référence : relecture humaine conseillée
- **RTX 2070 Super** [prix-rejete] : écart de 114 % à la référence (158 € -> 337.33 €), au-delà de 60 %
- **GTX 1660 Super** [prix-rejete] : écart de 145 % à la référence (102 € -> 250.3 €), au-delà de 60 %
- **GTX 1660 Ti** [prix-rejete] : écart de 216 % à la référence (108 € -> 341.66 €), au-delà de 60 %
- **RTX 2080** [ecart-notable] : appliqué mais écart de 41 % à la référence : relecture humaine conseillée
- **RX 6900 XT** [ecart-notable] : appliqué mais écart de 58 % à la référence : relecture humaine conseillée
- **AMD Ryzen 5 2600X** [ecart-notable] : appliqué mais écart de 39 % à la référence : relecture humaine conseillée
- **AMD Ryzen 3 3200G** [ecart-notable] : appliqué mais écart de 27 % à la référence : relecture humaine conseillée
- **AMD Ryzen 7 2700X** [prix-rejete] : écart de 187 % à la référence (38 € -> 109.08 €), au-delà de 60 %
- **Intel Core i7-10700KF** [ecart-notable] : appliqué mais écart de 45 % à la référence : relecture humaine conseillée
- **RX 5700 XT** [prix-rejete] : écart de 98 % à la référence (165 € -> 326.95 €), au-delà de 60 %
- **GTX 1660** [ecart-notable] : appliqué mais écart de 43 % à la référence : relecture humaine conseillée
- **RTX 2080 Ti** [prix-rejete] : écart de 142 % à la référence (280 € -> 677.97 €), au-delà de 60 %
- **Intel Core i3-10100F** [ecart-notable] : appliqué mais écart de 59 % à la référence : relecture humaine conseillée
- **Intel Core i9-9900K** [prix-rejete] : écart de 86 % à la référence (205 € -> 380.76 €), au-delà de 60 %
- **GTX 1650** [prix-rejete] : écart de 142 % à la référence (82 € -> 198.37 €), au-delà de 60 %
- **GTX 1070** [prix-rejete] : écart de 168 % à la référence (100 € -> 267.54 €), au-delà de 60 %
- **GTX 1080** [ecart-notable] : appliqué mais écart de 56 % à la référence : relecture humaine conseillée
- **GTX 1080 Ti** [prix-rejete] : écart de 159 % à la référence (180 € -> 465.7 €), au-delà de 60 %
- **Intel Core i5-7600K** [ecart-notable] : appliqué mais écart de 29 % à la référence : relecture humaine conseillée
- **Intel Core i3-8100** [ecart-notable] : appliqué mais écart de 39 % à la référence : relecture humaine conseillée
- **GTX 1050 Ti** [prix-rejete] : écart de 72 % à la référence (70 € -> 120.3 €), au-delà de 60 %
- **RX 590** [prix-rejete] : écart de 98 % à la référence (85 € -> 168.35 €), au-delà de 60 %
- **RX 580** [ecart-notable] : appliqué mais écart de 48 % à la référence : relecture humaine conseillée
- **Intel Core i7-4790K** [ecart-notable] : appliqué mais écart de 47 % à la référence : relecture humaine conseillée
- **RX 570** [prix-rejete] : écart de 128 % à la référence (55 € -> 125.5 €), au-delà de 60 %
- **Intel Core i5-4460** [prix-rejete] : écart de 127 % à la référence (20 € -> 45.38 €), au-delà de 60 %
- **Intel Core i5-4590** [ecart-notable] : appliqué mais écart de 30 % à la référence : relecture humaine conseillée
- **GTX 970** [ecart-notable] : appliqué mais écart de 42 % à la référence : relecture humaine conseillée
- **GTX 980** [prix-rejete] : écart de 181 % à la référence (55 € -> 154.79 €), au-delà de 60 %
- **GTX 960** [ecart-notable] : appliqué mais écart de 48 % à la référence : relecture humaine conseillée
- **GTX 980 Ti** [prix-rejete] : écart de 118 % à la référence (105 € -> 228.78 €), au-delà de 60 %
- **GTX 750 Ti** [prix-rejete] : écart de 428 % à la référence (28 € -> 147.92 €), au-delà de 60 %
- **Intel Core i5-3570K** [prix-rejete] : écart de 145 % à la référence (30 € -> 73.5 €), au-delà de 60 %
- **Intel Core i5-2500K** [prix-rejete] : écart de 79 % à la référence (12 € -> 21.5 €), au-delà de 60 %
- **GTX 760** [prix-rejete] : écart de 257 % à la référence (38 € -> 135.52 €), au-delà de 60 %
- **GTX 770** [prix-rejete] : écart de 172 % à la référence (27 € -> 73.5 €), au-delà de 60 %
- **GTX 780** [prix-rejete] : écart de 162 % à la référence (42 € -> 109.9 €), au-delà de 60 %
- **GT 1030** [ecart-notable] : appliqué mais écart de 57 % à la référence : relecture humaine conseillée
- **AMD FX-6300** [prix-rejete] : écart de 73 % à la référence (22 € -> 38.11 €), au-delà de 60 %
- **GTX 660** [ecart-notable] : appliqué mais écart de 58 % à la référence : relecture humaine conseillée
- **GTX 680** [prix-rejete] : écart de 333 % à la référence (36 € -> 155.94 €), au-delà de 60 %
- **R9 270X** [prix-rejete] : écart de 102 % à la référence (23 € -> 46.35 €), au-delà de 60 %
- **GTX 460** [prix-rejete] : écart de 99 % à la référence (15 € -> 29.82 €), au-delà de 60 %
- **GTX 560 Ti** [prix-rejete] : écart de 150 % à la référence (15 € -> 37.49 €), au-delà de 60 %
- **Radeon HD 7870** [prix-rejete] : écart de 64 % à la référence (21 € -> 34.5 €), au-delà de 60 %
- **GTX 1060** [composant-manquant] : 6 annonce(s), 6 vendeur(s) — variante proche d'un composant déjà au catalogue (« GTX 1060 3Go ») : doublon possible
- **Intel Core i3-4160** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i3-4150** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i3-2100** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i3-9100** [composant-manquant] : 3 annonce(s), 3 vendeur(s) — seulement 3 annonce(s) (minimum 6)
- **Intel Core i3-4170** [composant-manquant] : 3 annonce(s), 3 vendeur(s) — seulement 3 annonce(s) (minimum 6)
- **Intel Core i3-4130** [composant-manquant] : 3 annonce(s), 3 vendeur(s) — seulement 3 annonce(s) (minimum 6)
- **Intel Core i3-3240** [composant-manquant] : 3 annonce(s), 3 vendeur(s) — seulement 3 annonce(s) (minimum 6)
- **Intel Core i5-8500** [composant-manquant] : 3 annonce(s), 3 vendeur(s) — seulement 3 annonce(s) (minimum 6)
- **Intel Core i5-6400** [composant-manquant] : 3 annonce(s), 3 vendeur(s) — seulement 3 annonce(s) (minimum 6)
- **Intel Core i5-9400** [composant-manquant] : 3 annonce(s), 3 vendeur(s) — seulement 3 annonce(s) (minimum 6)

## Limites

- Les prix eBay sont des prix DEMANDÉS (annonces actives), jamais des prix de vente constatés.
- Aucune API de fabricant ou de boutique neuve n'est connectée : le prix neuf est le prix demandé eBay (état « Neuf »), indicatif.
- Cartes mères, alimentations, boîtiers et refroidissements ne sont valorisés que par forfait (secondary.ts) : non vérifiables modèle par modèle.
- Les attributs des composants ajoutés (tier, facilité de revente, décote, socket) sont hérités d'un composant voisin et marqués comme estimés.
