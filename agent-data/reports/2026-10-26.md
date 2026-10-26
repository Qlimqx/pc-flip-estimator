# Rapport de l'agent quotidien — 2026-10-26

**Statut : Terminé avec avertissements**

- Déclencheur : push ([exécution](https://github.com/Qlimqx/pc-flip-estimator/actions/runs/40272337645))
- Début : 2026-10-26 06:05 (Paris) · Fin : 2026-10-26 06:06 (Paris) · Durée : 94 s
- Échéance de travail : 2026-10-26 06:45 (Paris) · Terminé avant 10 h (Paris) : oui

## Bilan

| Indicateur | Valeur |
|---|---|
| Composants du catalogue analysés | 211 |
| Prix vérifiés (données reçues) | 102 |
| Prix mis à jour | 41 (dont 20 à relire) |
| En attente de confirmation (saut > 15 %) | 1 |
| Données insuffisantes (valeur conservée) | 109 |
| Rejetés (écart aberrant, valeur conservée) | 62 |
| Source indisponible | 0 |
| Non traités | 0 |
| Composants ajoutés | 0 |
| Composants manquants détectés mais non ajoutés | 12 |
| Prix absents ou obsolètes (> 45 jours) | 88 |
| Anomalies de cohérence | 0 |

## Sources

- **eBay Browse (FR)** : disponible — 422 requêtes, 0 nouvelle(s) tentative(s), 0 échec(s) ; prix demandés d'occasion et neufs
- **Wikipédia (confirmation d'existence)** : utilisée pour les candidats évalués — API de recherche MediaWiki, extraits contenant le modèle exact

## Avertissements

- 62 prix rejeté(s) comme aberrants (valeur conservée)

## RAM et stockage (€/Go)

- **ram:ddr3** : rejete (mesuré 3.6563 €/Go, 29 annonces) — écart de 306 % à la référence (0.9 € -> 3.6563 €), au-delà de 60 %
- **ram:ddr4** : mis-a-jour-a-verifier (mesuré 5.4281 €/Go, 12 annonces) — appliqué mais écart de 36 % à la référence : relecture humaine conseillée
- **ram:ddr5** : donnees-insuffisantes — moins de 4 annonces valides après filtrage : valeur conservée
- **stockage:hdd** : rejete (mesuré 0.0448 €/Go, 31 annonces) — écart de 149 % à la référence (0.018 € -> 0.0448 €), au-delà de 60 %
- **stockage:ssd** : mis-a-jour-a-verifier (mesuré 0.1572 €/Go, 63 annonces) — appliqué mais écart de 57 % à la référence : relecture humaine conseillée
- **stockage:nvme** : mis-a-jour (mesuré 0.1331 €/Go, 33 annonces) — appliqué

## À vérifier manuellement

- **RTX 4060** [ecart-notable] : appliqué mais écart de 52 % à la référence : relecture humaine conseillée
- **RTX 4070 Super** [prix-rejete] : écart de 126 % à la référence (610 € -> 1375.87 €), au-delà de 60 %
- **AMD Ryzen 7 5800X** [prix-rejete] : écart de 63 % à la référence (160 € -> 261.06 €), au-delà de 60 %
- **RTX 4060 Ti** [prix-rejete] : écart de 123 % à la référence (340 € -> 758.34 €), au-delà de 60 %
- **RTX 5060 Ti** [prix-rejete] : écart de 74 % à la référence (510 € -> 889.41 €), au-delà de 60 %
- **RTX 5080** [prix-rejete] : écart de 160 % à la référence (1200 € -> 3116.7 €), au-delà de 60 %
- **RTX 5090** [ecart-notable] : appliqué mais écart de 48 % à la référence : relecture humaine conseillée
- **RTX 3060** [prix-rejete] : écart de 218 % à la référence (235 € -> 746.96 €), au-delà de 60 %
- **RTX 4070 Ti** [prix-rejete] : écart de 69 % à la référence (720 € -> 1215.03 €), au-delà de 60 %
- **AMD Ryzen 7 7700** [prix-rejete] : écart de 109 % à la référence (180 € -> 376.56 €), au-delà de 60 %
- **RTX 3060 Ti** [prix-rejete] : écart de 79 % à la référence (220 € -> 394.3 €), au-delà de 60 %
- **AMD Ryzen 5 3600** [prix-rejete] : écart de 149 % à la référence (58 € -> 144.21 €), au-delà de 60 %
- **RTX 3070** [ecart-notable] : appliqué mais écart de 39 % à la référence : relecture humaine conseillée
- **RTX 3070 Ti** [prix-rejete] : écart de 93 % à la référence (290 € -> 559.5 €), au-delà de 60 %
- **RTX 3080** [prix-rejete] : écart de 63 % à la référence (380 € -> 618.7 €), au-delà de 60 %
- **RTX 4080** [prix-rejete] : écart de 80 % à la référence (950 € -> 1708.79 €), au-delà de 60 %
- **RTX 4080 Super** [ecart-notable] : appliqué mais écart de 48 % à la référence : relecture humaine conseillée
- **RX 7800 XT** [prix-rejete] : écart de 104 % à la référence (410 € -> 837.52 €), au-delà de 60 %
- **AMD Ryzen 5 3600X** [prix-rejete] : écart de 103 % à la référence (60 € -> 121.86 €), au-delà de 60 %
- **RX 9070 XT** [prix-rejete] : écart de 84 % à la référence (700 € -> 1286.22 €), au-delà de 60 %
- **RTX 3080 Ti** [prix-rejete] : écart de 82 % à la référence (480 € -> 871.55 €), au-delà de 60 %
- **AMD Ryzen 7 3800X** [prix-rejete] : écart de 86 % à la référence (98 € -> 182.7 €), au-delà de 60 %
- **RTX 3050** [prix-rejete] : écart de 137 % à la référence (150 € -> 354.9 €), au-delà de 60 %
- **RX 6600** [ecart-notable] : appliqué mais écart de 38 % à la référence : relecture humaine conseillée
- **AMD Ryzen 9 3900X** [ecart-notable] : appliqué mais écart de 31 % à la référence : relecture humaine conseillée
- **RTX 2060** [ecart-notable] : appliqué mais écart de 56 % à la référence : relecture humaine conseillée
- **RX 6700 XT** [ecart-notable] : appliqué mais écart de 41 % à la référence : relecture humaine conseillée
- **RX 6750 XT** [prix-rejete] : écart de 85 % à la référence (265 € -> 490.69 €), au-delà de 60 %
- **RTX 3090** [prix-rejete] : écart de 249 % à la référence (900 € -> 3138.56 €), au-delà de 60 %
- **RTX 2070** [ecart-notable] : appliqué mais écart de 47 % à la référence : relecture humaine conseillée
- **Intel Core i5-10400F** [prix-rejete] : écart de 92 % à la référence (75 € -> 143.97 €), au-delà de 60 %
- **RTX 2070 Super** [prix-rejete] : écart de 106 % à la référence (158 € -> 325.2 €), au-delà de 60 %
- **GTX 1660 Super** [prix-rejete] : écart de 125 % à la référence (102 € -> 229.5 €), au-delà de 60 %
- **GTX 1660 Ti** [prix-rejete] : écart de 150 % à la référence (108 € -> 270.5 €), au-delà de 60 %
- **RTX 2080** [prix-rejete] : écart de 97 % à la référence (185 € -> 363.7 €), au-delà de 60 %
- **RTX 2080 Super** [prix-rejete] : écart de 96 % à la référence (230 € -> 451.64 €), au-delà de 60 %
- **RX 6900 XT** [ecart-notable] : appliqué mais écart de 59 % à la référence : relecture humaine conseillée
- **AMD Ryzen 5 2600X** [ecart-notable] : appliqué mais écart de 30 % à la référence : relecture humaine conseillée
- **AMD Ryzen 3 3200G** [ecart-notable] : appliqué mais écart de 29 % à la référence : relecture humaine conseillée
- **Intel Core i5-9400F** [ecart-notable] : appliqué mais écart de 41 % à la référence : relecture humaine conseillée
- **AMD Ryzen 7 2700X** [prix-rejete] : écart de 187 % à la référence (38 € -> 109.08 €), au-delà de 60 %
- **GTX 1660** [prix-rejete] : écart de 66 % à la référence (88 € -> 146.3 €), au-delà de 60 %
- **RX 5700 XT** [prix-rejete] : écart de 98 % à la référence (165 € -> 326.95 €), au-delà de 60 %
- **RTX 2080 Ti** [prix-rejete] : écart de 169 % à la référence (230 € -> 618.7 €), au-delà de 60 %
- **AMD Ryzen 5 1600** [prix-rejete] : écart de 90 % à la référence (33 € -> 62.58 €), au-delà de 60 %
- **Intel Core i3-10100F** [prix-rejete] : écart de 81 % à la référence (42 € -> 76.04 €), au-delà de 60 %
- **Intel Core i9-9900K** [ecart-notable] : appliqué mais écart de 56 % à la référence : relecture humaine conseillée
- **GTX 1650** [prix-rejete] : écart de 149 % à la référence (82 € -> 203.85 €), au-delà de 60 %
- **GTX 1070** [prix-rejete] : écart de 130 % à la référence (100 € -> 229.5 €), au-delà de 60 %
- **GTX 1070 Ti** [prix-rejete] : écart de 131 % à la référence (115 € -> 265.53 €), au-delà de 60 %
- **GTX 1080** [ecart-notable] : appliqué mais écart de 43 % à la référence : relecture humaine conseillée
- **GTX 1080 Ti** [prix-rejete] : écart de 129 % à la référence (180 € -> 411.62 €), au-delà de 60 %
- **Intel Core i3-8100** [ecart-notable] : appliqué mais écart de 28 % à la référence : relecture humaine conseillée
- **GTX 1050 Ti** [prix-rejete] : écart de 79 % à la référence (70 € -> 125.04 €), au-delà de 60 %
- **RX 580** [prix-rejete] : écart de 74 % à la référence (72 € -> 125.5 €), au-delà de 60 %
- **RX 590** [prix-rejete] : écart de 98 % à la référence (85 € -> 168.35 €), au-delà de 60 %
- **Intel Core i7-4790K** [ecart-notable] : appliqué mais écart de 44 % à la référence : relecture humaine conseillée
- **RX 480** [ecart-notable] : appliqué mais écart de 27 % à la référence : relecture humaine conseillée
- **RX 570** [prix-rejete] : écart de 160 % à la référence (55 € -> 143.14 €), au-delà de 60 %
- **Intel Core i5-4590** [ecart-notable] : appliqué mais écart de 30 % à la référence : relecture humaine conseillée
- **GTX 970** [prix-rejete] : écart de 79 % à la référence (42 € -> 75 €), au-delà de 60 %
- **GTX 980** [prix-rejete] : écart de 154 % à la référence (55 € -> 139.7 €), au-delà de 60 %
- **RX 560** [prix-rejete] : écart de 144 % à la référence (33 € -> 80.39 €), au-delà de 60 %
- **GTX 960** [prix-rejete] : écart de 204 % à la référence (42 € -> 127.8 €), au-delà de 60 %
- **GTX 950** [prix-rejete] : écart de 491 % à la référence (28 € -> 165.57 €), au-delà de 60 %
- **Intel Core i7-3770K** [prix-rejete] : écart de 94 % à la référence (48 € -> 93.28 €), au-delà de 60 %
- **GTX 750 Ti** [prix-rejete] : écart de 439 % à la référence (22 € -> 118.62 €), au-delà de 60 %
- **Intel Core i5-2500K** [prix-rejete] : écart de 79 % à la référence (12 € -> 21.5 €), au-delà de 60 %
- **GTX 760** [prix-rejete] : écart de 374 % à la référence (25 € -> 118.54 €), au-delà de 60 %
- **GTX 770** [prix-rejete] : écart de 134 % à la référence (27 € -> 63.1 €), au-delà de 60 %
- **GTX 780** [prix-rejete] : écart de 174 % à la référence (42 € -> 115.1 €), au-delà de 60 %
- **GT 1030** [ecart-notable] : appliqué mais écart de 57 % à la référence : relecture humaine conseillée
- **AMD FX-6300** [prix-rejete] : écart de 73 % à la référence (22 € -> 38.11 €), au-delà de 60 %
- **GTX 660** [prix-rejete] : écart de 471 % à la référence (19 € -> 108.4 €), au-delà de 60 %
- **GTX 670** [prix-rejete] : écart de 130 % à la référence (22 € -> 50.62 €), au-delà de 60 %
- **GTX 680** [prix-rejete] : écart de 234 % à la référence (36 € -> 120.26 €), au-delà de 60 %
- **R9 270X** [prix-rejete] : écart de 83 % à la référence (23 € -> 42 €), au-delà de 60 %
- **GTX 460** [prix-rejete] : écart de 149 % à la référence (12 € -> 29.82 €), au-delà de 60 %
- **GTX 560 Ti** [prix-rejete] : écart de 150 % à la référence (15 € -> 37.49 €), au-delà de 60 %
- **Radeon HD 7870** [prix-rejete] : écart de 87 % à la référence (21 € -> 39.18 €), au-delà de 60 %
- **ram:ddr3** [prix-rejete] : écart de 306 % à la référence (0.9 € -> 3.6563 €), au-delà de 60 %
- **stockage:hdd** [prix-rejete] : écart de 149 % à la référence (0.018 € -> 0.0448 €), au-delà de 60 %
- **Intel Core i3-4130** [composant-manquant] : 5 annonce(s), 5 vendeur(s) — seulement 5 annonce(s) (minimum 6)
- **Intel Core i5-6400** [composant-manquant] : 5 annonce(s), 5 vendeur(s) — seulement 5 annonce(s) (minimum 6)
- **GTX 1060** [composant-manquant] : 5 annonce(s), 4 vendeur(s) — variante proche d'un composant déjà au catalogue (« GTX 1060 3Go ») : doublon possible
- **Intel Core i5-6600** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i7-7700** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i9-10900** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i9-11900F** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i9-10900F** [composant-manquant] : 4 annonce(s), 3 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **AMD Ryzen 3 2200G** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **AMD Ryzen 3 1200** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i3-9100** [composant-manquant] : 3 annonce(s), 3 vendeur(s) — seulement 3 annonce(s) (minimum 6)
- **Intel Core i3-4170** [composant-manquant] : 3 annonce(s), 3 vendeur(s) — seulement 3 annonce(s) (minimum 6)

## Limites

- Les prix eBay sont des prix DEMANDÉS (annonces actives), jamais des prix de vente constatés.
- Aucune API de fabricant ou de boutique neuve n'est connectée : le prix neuf est le prix demandé eBay (état « Neuf »), indicatif.
- Cartes mères, alimentations, boîtiers et refroidissements ne sont valorisés que par forfait (secondary.ts) : non vérifiables modèle par modèle.
- Les attributs des composants ajoutés (tier, facilité de revente, décote, socket) sont hérités d'un composant voisin et marqués comme estimés.
