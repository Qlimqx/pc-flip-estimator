# Rapport de l'agent quotidien — 2026-10-31

**Statut : Terminé avec avertissements**

- Déclencheur : push ([exécution](https://github.com/Qlimqx/pc-flip-estimator/actions/runs/41171118004))
- Début : 2026-10-31 06:04 (Paris) · Fin : 2026-10-31 06:06 (Paris) · Durée : 101 s
- Échéance de travail : 2026-10-31 06:44 (Paris) · Terminé avant 10 h (Paris) : oui

## Bilan

| Indicateur | Valeur |
|---|---|
| Composants du catalogue analysés | 211 |
| Prix vérifiés (données reçues) | 95 |
| Prix mis à jour | 37 (dont 17 à relire) |
| En attente de confirmation (saut > 15 %) | 2 |
| Données insuffisantes (valeur conservée) | 116 |
| Rejetés (écart aberrant, valeur conservée) | 58 |
| Source indisponible | 0 |
| Non traités | 0 |
| Composants ajoutés | 0 |
| Composants manquants détectés mais non ajoutés | 12 |
| Prix absents ou obsolètes (> 45 jours) | 79 |
| Anomalies de cohérence | 0 |

## Sources

- **eBay Browse (FR)** : disponible — 422 requêtes, 0 nouvelle(s) tentative(s), 0 échec(s) ; prix demandés d'occasion et neufs
- **Wikipédia (confirmation d'existence)** : utilisée pour les candidats évalués — API de recherche MediaWiki, extraits contenant le modèle exact

## Avertissements

- 58 prix rejeté(s) comme aberrants (valeur conservée)

## RAM et stockage (€/Go)

- **ram:ddr3** : rejete (mesuré 2.6238 €/Go, 26 annonces) — écart de 192 % à la référence (0.9 € -> 2.6238 €), au-delà de 60 %
- **ram:ddr4** : en-attente-confirmation (mesuré 4.7219 €/Go, 13 annonces) — saut de 17 % (5.68 € -> 4.7219 €) : appliqué seulement s'il est confirmé au prochain run
- **ram:ddr5** : donnees-insuffisantes — moins de 4 annonces valides après filtrage : valeur conservée
- **stockage:hdd** : rejete (mesuré 0.0433 €/Go, 34 annonces) — écart de 141 % à la référence (0.018 € -> 0.0433 €), au-delà de 60 %
- **stockage:ssd** : mis-a-jour-a-verifier (mesuré 0.1572 €/Go, 67 annonces) — appliqué mais écart de 57 % à la référence : relecture humaine conseillée
- **stockage:nvme** : mis-a-jour-a-verifier (mesuré 0.1307 €/Go, 35 annonces) — appliqué mais écart de 38 % à la référence : relecture humaine conseillée

## À vérifier manuellement

- **RX 7800 XT** [prix-rejete] : écart de 98 % à la référence (410 € -> 811.89 €), au-delà de 60 %
- **RTX 4070 Super** [prix-rejete] : écart de 126 % à la référence (610 € -> 1375.87 €), au-delà de 60 %
- **AMD Ryzen 7 5800X** [ecart-notable] : appliqué mais écart de 30 % à la référence : relecture humaine conseillée
- **RTX 4060 Ti** [prix-rejete] : écart de 153 % à la référence (340 € -> 860.85 €), au-delà de 60 %
- **RTX 5060 Ti** [prix-rejete] : écart de 70 % à la référence (510 € -> 865.35 €), au-delà de 60 %
- **RTX 5080** [prix-rejete] : écart de 203 % à la référence (1200 € -> 3634.13 €), au-delà de 60 %
- **RTX 3060** [prix-rejete] : écart de 217 % à la référence (235 € -> 745.55 €), au-delà de 60 %
- **RTX 4070 Ti** [prix-rejete] : écart de 69 % à la référence (720 € -> 1215.03 €), au-delà de 60 %
- **AMD Ryzen 7 7700** [prix-rejete] : écart de 109 % à la référence (180 € -> 376.56 €), au-delà de 60 %
- **RTX 3060 Ti** [prix-rejete] : écart de 88 % à la référence (220 € -> 414.7 €), au-delà de 60 %
- **RTX 3070** [ecart-notable] : appliqué mais écart de 40 % à la référence : relecture humaine conseillée
- **AMD Ryzen 5 3600** [prix-rejete] : écart de 149 % à la référence (58 € -> 144.21 €), au-delà de 60 %
- **RTX 3070 Ti** [prix-rejete] : écart de 93 % à la référence (290 € -> 559 €), au-delà de 60 %
- **RTX 3080** [prix-rejete] : écart de 63 % à la référence (380 € -> 618.19 €), au-delà de 60 %
- **RX 9070 XT** [prix-rejete] : écart de 192 % à la référence (580 € -> 1695.73 €), au-delà de 60 %
- **AMD Ryzen 5 3600X** [prix-rejete] : écart de 103 % à la référence (60 € -> 121.86 €), au-delà de 60 %
- **RTX 3080 Ti** [prix-rejete] : écart de 96 % à la référence (480 € -> 941.49 €), au-delà de 60 %
- **AMD Ryzen 7 3800X** [prix-rejete] : écart de 86 % à la référence (98 € -> 182.7 €), au-delà de 60 %
- **RTX 3050** [prix-rejete] : écart de 141 % à la référence (150 € -> 361.3 €), au-delà de 60 %
- **RX 6600** [ecart-notable] : appliqué mais écart de 35 % à la référence : relecture humaine conseillée
- **RTX 2060** [ecart-notable] : appliqué mais écart de 53 % à la référence : relecture humaine conseillée
- **RX 6600 XT** [prix-rejete] : écart de 65 % à la référence (205 € -> 337.67 €), au-delà de 60 %
- **RX 6700 XT** [ecart-notable] : appliqué mais écart de 41 % à la référence : relecture humaine conseillée
- **RX 6750 XT** [prix-rejete] : écart de 96 % à la référence (265 € -> 519.89 €), au-delà de 60 %
- **RTX 3090** [prix-rejete] : écart de 302 % à la référence (900 € -> 3621.84 €), au-delà de 60 %
- **RTX 2070** [ecart-notable] : appliqué mais écart de 47 % à la référence : relecture humaine conseillée
- **RTX 2070 Super** [prix-rejete] : écart de 114 % à la référence (158 € -> 338.06 €), au-delà de 60 %
- **Intel Core i5-10400F** [prix-rejete] : écart de 92 % à la référence (75 € -> 143.97 €), au-delà de 60 %
- **GTX 1660 Super** [prix-rejete] : écart de 122 % à la référence (102 € -> 226.9 €), au-delà de 60 %
- **GTX 1660 Ti** [prix-rejete] : écart de 210 % à la référence (108 € -> 334.45 €), au-delà de 60 %
- **RTX 2080** [ecart-notable] : appliqué mais écart de 41 % à la référence : relecture humaine conseillée
- **RX 6900 XT** [ecart-notable] : appliqué mais écart de 58 % à la référence : relecture humaine conseillée
- **AMD Ryzen 5 2600X** [ecart-notable] : appliqué mais écart de 39 % à la référence : relecture humaine conseillée
- **AMD Ryzen 3 3200G** [ecart-notable] : appliqué mais écart de 29 % à la référence : relecture humaine conseillée
- **AMD Ryzen 7 2700X** [prix-rejete] : écart de 187 % à la référence (38 € -> 109.08 €), au-delà de 60 %
- **Intel Core i5-9400F** [ecart-notable] : appliqué mais écart de 41 % à la référence : relecture humaine conseillée
- **GTX 1660** [prix-rejete] : écart de 90 % à la référence (88 € -> 167.1 €), au-delà de 60 %
- **RX 5700 XT** [prix-rejete] : écart de 98 % à la référence (165 € -> 326.95 €), au-delà de 60 %
- **RTX 2080 Ti** [prix-rejete] : écart de 185 % à la référence (230 € -> 656.36 €), au-delà de 60 %
- **AMD Ryzen 5 1600** [prix-rejete] : écart de 90 % à la référence (33 € -> 62.58 €), au-delà de 60 %
- **Intel Core i3-10100F** [prix-rejete] : écart de 63 % à la référence (42 € -> 68.3 €), au-delà de 60 %
- **Intel Core i9-9900K** [prix-rejete] : écart de 86 % à la référence (205 € -> 380.76 €), au-delà de 60 %
- **GTX 1650** [prix-rejete] : écart de 161 % à la référence (82 € -> 214.1 €), au-delà de 60 %
- **GTX 1070** [prix-rejete] : écart de 191 % à la référence (100 € -> 290.97 €), au-delà de 60 %
- **GTX 1070 Ti** [prix-rejete] : écart de 161 % à la référence (115 € -> 299.98 €), au-delà de 60 %
- **GTX 1080** [ecart-notable] : appliqué mais écart de 34 % à la référence : relecture humaine conseillée
- **GTX 1080 Ti** [prix-rejete] : écart de 150 % à la référence (180 € -> 449.58 €), au-delà de 60 %
- **Intel Core i3-8100** [ecart-notable] : appliqué mais écart de 29 % à la référence : relecture humaine conseillée
- **GTX 1050 Ti** [prix-rejete] : écart de 72 % à la référence (70 € -> 120.3 €), au-delà de 60 %
- **RX 580** [prix-rejete] : écart de 74 % à la référence (72 € -> 125.5 €), au-delà de 60 %
- **RX 590** [prix-rejete] : écart de 98 % à la référence (85 € -> 168.35 €), au-delà de 60 %
- **Intel Core i7-4790K** [ecart-notable] : appliqué mais écart de 44 % à la référence : relecture humaine conseillée
- **RX 570** [prix-rejete] : écart de 132 % à la référence (55 € -> 127.75 €), au-delà de 60 %
- **Intel Core i5-4590** [ecart-notable] : appliqué mais écart de 36 % à la référence : relecture humaine conseillée
- **Intel Core i5-4460** [ecart-notable] : appliqué mais écart de 28 % à la référence : relecture humaine conseillée
- **GTX 970** [prix-rejete] : écart de 87 % à la référence (42 € -> 78.69 €), au-delà de 60 %
- **GTX 980** [prix-rejete] : écart de 182 % à la référence (55 € -> 155.24 €), au-delà de 60 %
- **RX 560** [prix-rejete] : écart de 144 % à la référence (33 € -> 80.39 €), au-delà de 60 %
- **GTX 950** [prix-rejete] : écart de 492 % à la référence (28 € -> 165.62 €), au-delà de 60 %
- **Intel Core i5-3570K** [prix-rejete] : écart de 62 % à la référence (30 € -> 48.56 €), au-delà de 60 %
- **GTX 750 Ti** [prix-rejete] : écart de 526 % à la référence (22 € -> 137.64 €), au-delà de 60 %
- **Intel Core i5-2500K** [prix-rejete] : écart de 79 % à la référence (12 € -> 21.5 €), au-delà de 60 %
- **GTX 760** [prix-rejete] : écart de 436 % à la référence (25 € -> 133.88 €), au-delà de 60 %
- **GTX 770** [prix-rejete] : écart de 172 % à la référence (27 € -> 73.5 €), au-delà de 60 %
- **GTX 780** [prix-rejete] : écart de 162 % à la référence (42 € -> 109.9 €), au-delà de 60 %
- **GT 1030** [ecart-notable] : appliqué mais écart de 57 % à la référence : relecture humaine conseillée
- **AMD FX-6300** [prix-rejete] : écart de 73 % à la référence (22 € -> 38.11 €), au-delà de 60 %
- **GTX 660** [prix-rejete] : écart de 100 % à la référence (19 € -> 38.03 €), au-delà de 60 %
- **GTX 680** [prix-rejete] : écart de 333 % à la référence (36 € -> 155.94 €), au-delà de 60 %
- **R9 270X** [prix-rejete] : écart de 102 % à la référence (23 € -> 46.35 €), au-delà de 60 %
- **GTX 460** [prix-rejete] : écart de 149 % à la référence (12 € -> 29.82 €), au-delà de 60 %
- **GTX 560 Ti** [prix-rejete] : écart de 150 % à la référence (15 € -> 37.49 €), au-delà de 60 %
- **Radeon HD 7870** [prix-rejete] : écart de 87 % à la référence (21 € -> 39.18 €), au-delà de 60 %
- **ram:ddr3** [prix-rejete] : écart de 192 % à la référence (0.9 € -> 2.6238 €), au-delà de 60 %
- **stockage:hdd** [prix-rejete] : écart de 141 % à la référence (0.018 € -> 0.0433 €), au-delà de 60 %
- **Intel Core i3-4150** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i3-2100** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i5-6400** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i7-6700** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i7-2600** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i7-7700K** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i9-10900** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i9-10900F** [composant-manquant] : 4 annonce(s), 3 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i3-4160** [composant-manquant] : 3 annonce(s), 3 vendeur(s) — seulement 3 annonce(s) (minimum 6)
- **Intel Core i3-9100** [composant-manquant] : 3 annonce(s), 3 vendeur(s) — seulement 3 annonce(s) (minimum 6)
- **Intel Core i3-4170** [composant-manquant] : 3 annonce(s), 3 vendeur(s) — seulement 3 annonce(s) (minimum 6)
- **Intel Core i3-2120** [composant-manquant] : 3 annonce(s), 3 vendeur(s) — seulement 3 annonce(s) (minimum 6)

## Limites

- Les prix eBay sont des prix DEMANDÉS (annonces actives), jamais des prix de vente constatés.
- Aucune API de fabricant ou de boutique neuve n'est connectée : le prix neuf est le prix demandé eBay (état « Neuf »), indicatif.
- Cartes mères, alimentations, boîtiers et refroidissements ne sont valorisés que par forfait (secondary.ts) : non vérifiables modèle par modèle.
- Les attributs des composants ajoutés (tier, facilité de revente, décote, socket) sont hérités d'un composant voisin et marqués comme estimés.
