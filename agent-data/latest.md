# Rapport de l'agent quotidien — 2026-11-07

**Statut : Terminé avec avertissements**

- Déclencheur : push ([exécution](https://github.com/Qlimqx/pc-flip-estimator/actions/runs/42341155411))
- Début : 2026-11-07 06:04 (Paris) · Fin : 2026-11-07 06:06 (Paris) · Durée : 95 s
- Échéance de travail : 2026-11-07 06:44 (Paris) · Terminé avant 10 h (Paris) : oui

## Bilan

| Indicateur | Valeur |
|---|---|
| Composants du catalogue analysés | 213 |
| Prix vérifiés (données reçues) | 89 |
| Prix mis à jour | 39 (dont 22 à relire) |
| En attente de confirmation (saut > 15 %) | 2 |
| Données insuffisantes (valeur conservée) | 124 |
| Rejetés (écart aberrant, valeur conservée) | 49 |
| Source indisponible | 0 |
| Non traités | 0 |
| Composants ajoutés | 0 |
| Composants manquants détectés mais non ajoutés | 12 |
| Prix absents ou obsolètes (> 45 jours) | 72 |
| Anomalies de cohérence | 0 |

## Sources

- **eBay Browse (FR)** : disponible — 426 requêtes, 0 nouvelle(s) tentative(s), 0 échec(s) ; prix demandés d'occasion et neufs
- **Wikipédia (confirmation d'existence)** : utilisée pour les candidats évalués — API de recherche MediaWiki, extraits contenant le modèle exact

## Avertissements

- 49 prix rejeté(s) comme aberrants (valeur conservée)

## RAM et stockage (€/Go)

- **ram:ddr3** : rejete (mesuré 3.1981 €/Go, 21 annonces) — écart de 255 % à la référence (0.9 € -> 3.1981 €), au-delà de 60 %
- **ram:ddr4** : mis-a-jour (mesuré 4.625 €/Go, 13 annonces) — appliqué
- **ram:ddr5** : donnees-insuffisantes — moins de 4 annonces valides après filtrage : valeur conservée
- **stockage:hdd** : mis-a-jour-a-verifier (mesuré 0.0448 €/Go, 35 annonces) — appliqué mais écart de 28 % à la référence : relecture humaine conseillée
- **stockage:ssd** : mis-a-jour-a-verifier (mesuré 0.1572 €/Go, 70 annonces) — appliqué mais écart de 37 % à la référence : relecture humaine conseillée
- **stockage:nvme** : mis-a-jour-a-verifier (mesuré 0.1453 €/Go, 33 annonces) — appliqué mais écart de 53 % à la référence : relecture humaine conseillée

## À vérifier manuellement

- **RTX 4080 Super** [ecart-notable] : appliqué mais écart de 48 % à la référence : relecture humaine conseillée
- **RX 6700 XT** [prix-rejete] : écart de 62 % à la référence (280 € -> 452.84 €), au-delà de 60 %
- **GTX 670** [prix-rejete] : écart de 468 % à la référence (22 € -> 124.9 €), au-delà de 60 %
- **RTX 4070 Super** [prix-rejete] : écart de 126 % à la référence (610 € -> 1375.87 €), au-delà de 60 %
- **RTX 5060 Ti** [prix-rejete] : écart de 77 % à la référence (510 € -> 904.3 €), au-delà de 60 %
- **RTX 5080** [prix-rejete] : écart de 159 % à la référence (1200 € -> 3111.98 €), au-delà de 60 %
- **RTX 3060** [prix-rejete] : écart de 143 % à la référence (235 € -> 571.81 €), au-delà de 60 %
- **RTX 4070 Ti** [prix-rejete] : écart de 69 % à la référence (720 € -> 1215.03 €), au-delà de 60 %
- **RTX 3060 Ti** [prix-rejete] : écart de 107 % à la référence (220 € -> 455.5 €), au-delà de 60 %
- **RTX 3070** [ecart-notable] : appliqué mais écart de 40 % à la référence : relecture humaine conseillée
- **AMD Ryzen 5 3600** [prix-rejete] : écart de 149 % à la référence (58 € -> 144.21 €), au-delà de 60 %
- **RTX 3070 Ti** [prix-rejete] : écart de 93 % à la référence (290 € -> 560 €), au-delà de 60 %
- **RTX 3080** [prix-rejete] : écart de 69 % à la référence (380 € -> 640.33 €), au-delà de 60 %
- **RTX 4080** [prix-rejete] : écart de 101 % à la référence (950 € -> 1909.54 €), au-delà de 60 %
- **RX 9070 XT** [prix-rejete] : écart de 122 % à la référence (580 € -> 1289.83 €), au-delà de 60 %
- **AMD Ryzen 5 3600X** [prix-rejete] : écart de 107 % à la référence (60 € -> 124.46 €), au-delà de 60 %
- **RTX 3080 Ti** [prix-rejete] : écart de 82 % à la référence (480 € -> 871.55 €), au-delà de 60 %
- **AMD Ryzen 7 3800X** [prix-rejete] : écart de 86 % à la référence (98 € -> 182.7 €), au-delà de 60 %
- **RTX 3050** [prix-rejete] : écart de 108 % à la référence (175 € -> 363.7 €), au-delà de 60 %
- **RX 6600** [ecart-notable] : appliqué mais écart de 43 % à la référence : relecture humaine conseillée
- **RTX 2060** [prix-rejete] : écart de 60 % à la référence (140 € -> 224.3 €), au-delà de 60 %
- **RX 6600 XT** [prix-rejete] : écart de 79 % à la référence (260 € -> 465.7 €), au-delà de 60 %
- **RTX 3090** [prix-rejete] : écart de 273 % à la référence (900 € -> 3356.64 €), au-delà de 60 %
- **RTX 2070** [ecart-notable] : appliqué mais écart de 46 % à la référence : relecture humaine conseillée
- **RTX 2070 Super** [prix-rejete] : écart de 111 % à la référence (158 € -> 333.1 €), au-delà de 60 %
- **GTX 1660 Super** [prix-rejete] : écart de 105 % à la référence (102 € -> 208.7 €), au-delà de 60 %
- **GTX 1660 Ti** [prix-rejete] : écart de 157 % à la référence (108 € -> 278.05 €), au-delà de 60 %
- **RTX 2080** [ecart-notable] : appliqué mais écart de 41 % à la référence : relecture humaine conseillée
- **RX 6900 XT** [ecart-notable] : appliqué mais écart de 59 % à la référence : relecture humaine conseillée
- **AMD Ryzen 5 2600X** [ecart-notable] : appliqué mais écart de 39 % à la référence : relecture humaine conseillée
- **AMD Ryzen 3 3200G** [ecart-notable] : appliqué mais écart de 27 % à la référence : relecture humaine conseillée
- **AMD Ryzen 7 2700X** [prix-rejete] : écart de 187 % à la référence (38 € -> 109.08 €), au-delà de 60 %
- **Intel Core i5-9400F** [ecart-notable] : appliqué mais écart de 50 % à la référence : relecture humaine conseillée
- **Intel Core i7-10700KF** [ecart-notable] : appliqué mais écart de 45 % à la référence : relecture humaine conseillée
- **GTX 1660** [ecart-notable] : appliqué mais écart de 43 % à la référence : relecture humaine conseillée
- **RX 5700 XT** [prix-rejete] : écart de 98 % à la référence (165 € -> 326.95 €), au-delà de 60 %
- **RTX 2080 Ti** [prix-rejete] : écart de 132 % à la référence (280 € -> 648.78 €), au-delà de 60 %
- **Intel Core i3-10100F** [ecart-notable] : appliqué mais écart de 59 % à la référence : relecture humaine conseillée
- **Intel Core i9-9900K** [prix-rejete] : écart de 86 % à la référence (205 € -> 380.76 €), au-delà de 60 %
- **GTX 1650** [prix-rejete] : écart de 142 % à la référence (82 € -> 198.37 €), au-delà de 60 %
- **GTX 1070** [prix-rejete] : écart de 131 % à la référence (100 € -> 230.57 €), au-delà de 60 %
- **GTX 1070 Ti** [prix-rejete] : écart de 131 % à la référence (115 € -> 265.13 €), au-delà de 60 %
- **GTX 1080** [ecart-notable] : appliqué mais écart de 56 % à la référence : relecture humaine conseillée
- **GTX 1080 Ti** [prix-rejete] : écart de 125 % à la référence (180 € -> 404.9 €), au-delà de 60 %
- **Intel Core i5-7600K** [ecart-notable] : appliqué mais écart de 29 % à la référence : relecture humaine conseillée
- **Intel Core i3-8100** [ecart-notable] : appliqué mais écart de 39 % à la référence : relecture humaine conseillée
- **RX 580** [ecart-notable] : appliqué mais écart de 54 % à la référence : relecture humaine conseillée
- **RX 590** [prix-rejete] : écart de 60 % à la référence (105 € -> 168.35 €), au-delà de 60 %
- **Intel Core i7-4790K** [ecart-notable] : appliqué mais écart de 47 % à la référence : relecture humaine conseillée
- **RX 570** [prix-rejete] : écart de 136 % à la référence (55 € -> 130 €), au-delà de 60 %
- **Intel Core i5-4460** [prix-rejete] : écart de 127 % à la référence (20 € -> 45.38 €), au-delà de 60 %
- **Intel Core i5-4590** [ecart-notable] : appliqué mais écart de 30 % à la référence : relecture humaine conseillée
- **GTX 970** [ecart-notable] : appliqué mais écart de 34 % à la référence : relecture humaine conseillée
- **GTX 980** [prix-rejete] : écart de 144 % à la référence (55 € -> 134.38 €), au-delà de 60 %
- **GTX 980 Ti** [prix-rejete] : écart de 100 % à la référence (105 € -> 209.52 €), au-delà de 60 %
- **GTX 960** [ecart-notable] : appliqué mais écart de 48 % à la référence : relecture humaine conseillée
- **Intel Core i7-3770K** [prix-rejete] : écart de 92 % à la référence (48 € -> 92.22 €), au-delà de 60 %
- **GTX 750 Ti** [prix-rejete] : écart de 323 % à la référence (28 € -> 118.45 €), au-delà de 60 %
- **Intel Core i5-2500K** [prix-rejete] : écart de 79 % à la référence (12 € -> 21.5 €), au-delà de 60 %
- **Intel Core i5-3570K** [prix-rejete] : écart de 142 % à la référence (30 € -> 72.69 €), au-delà de 60 %
- **GTX 760** [prix-rejete] : écart de 211 % à la référence (38 € -> 118.27 €), au-delà de 60 %
- **GTX 770** [prix-rejete] : écart de 172 % à la référence (27 € -> 73.5 €), au-delà de 60 %
- **GTX 780** [prix-rejete] : écart de 109 % à la référence (55 € -> 115.1 €), au-delà de 60 %
- **GT 1030** [ecart-notable] : appliqué mais écart de 57 % à la référence : relecture humaine conseillée
- **GTX 660** [ecart-notable] : appliqué mais écart de 58 % à la référence : relecture humaine conseillée
- **GTX 680** [prix-rejete] : écart de 280 % à la référence (36 € -> 136.66 €), au-delà de 60 %
- **R9 270X** [prix-rejete] : écart de 102 % à la référence (23 € -> 46.35 €), au-delà de 60 %
- **GTX 560 Ti** [prix-rejete] : écart de 150 % à la référence (15 € -> 37.49 €), au-delà de 60 %
- **GTX 460** [prix-rejete] : écart de 99 % à la référence (15 € -> 29.82 €), au-delà de 60 %
- **Radeon HD 7870** [prix-rejete] : écart de 64 % à la référence (21 € -> 34.5 €), au-delà de 60 %
- **ram:ddr3** [prix-rejete] : écart de 255 % à la référence (0.9 € -> 3.1981 €), au-delà de 60 %
- **GTX 1060** [composant-manquant] : 8 annonce(s), 7 vendeur(s) — variante proche d'un composant déjà au catalogue (« GTX 1060 3Go ») : doublon possible
- **Intel Core i3-4160** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i3-4150** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i3-2100** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i3-3240** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i3-9100** [composant-manquant] : 3 annonce(s), 3 vendeur(s) — seulement 3 annonce(s) (minimum 6)
- **Intel Core i3-10100** [composant-manquant] : 3 annonce(s), 3 vendeur(s) — seulement 3 annonce(s) (minimum 6)
- **Intel Core i3-4170** [composant-manquant] : 3 annonce(s), 3 vendeur(s) — seulement 3 annonce(s) (minimum 6)
- **Intel Core i3-4130** [composant-manquant] : 3 annonce(s), 3 vendeur(s) — seulement 3 annonce(s) (minimum 6)
- **Intel Core i5-8500** [composant-manquant] : 3 annonce(s), 3 vendeur(s) — seulement 3 annonce(s) (minimum 6)
- **Intel Core i5-8600** [composant-manquant] : 3 annonce(s), 3 vendeur(s) — seulement 3 annonce(s) (minimum 6)
- **Intel Core i5-9400** [composant-manquant] : 3 annonce(s), 3 vendeur(s) — seulement 3 annonce(s) (minimum 6)

## Limites

- Les prix eBay sont des prix DEMANDÉS (annonces actives), jamais des prix de vente constatés.
- Aucune API de fabricant ou de boutique neuve n'est connectée : le prix neuf est le prix demandé eBay (état « Neuf »), indicatif.
- Cartes mères, alimentations, boîtiers et refroidissements ne sont valorisés que par forfait (secondary.ts) : non vérifiables modèle par modèle.
- Les attributs des composants ajoutés (tier, facilité de revente, décote, socket) sont hérités d'un composant voisin et marqués comme estimés.
