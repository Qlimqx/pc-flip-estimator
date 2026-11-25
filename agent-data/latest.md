# Rapport de l'agent quotidien — 2026-11-25

**Statut : Terminé avec avertissements**

- Déclencheur : push ([exécution](https://github.com/Qlimqx/pc-flip-estimator/actions/runs/45557928325))
- Début : 2026-11-25 07:04 (Paris) · Fin : 2026-11-25 07:06 (Paris) · Durée : 104 s
- Échéance de travail : 2026-11-25 07:44 (Paris) · Terminé avant 10 h (Paris) : oui

## Bilan

| Indicateur | Valeur |
|---|---|
| Composants du catalogue analysés | 215 |
| Prix vérifiés (données reçues) | 99 |
| Prix mis à jour | 52 (dont 28 à relire) |
| En attente de confirmation (saut > 15 %) | 4 |
| Données insuffisantes (valeur conservée) | 116 |
| Rejetés (écart aberrant, valeur conservée) | 44 |
| Source indisponible | 0 |
| Non traités | 0 |
| Composants ajoutés | 0 |
| Composants manquants détectés mais non ajoutés | 12 |
| Prix absents ou obsolètes (> 45 jours) | 70 |
| Anomalies de cohérence | 0 |

## Sources

- **eBay Browse (FR)** : disponible — 430 requêtes, 0 nouvelle(s) tentative(s), 0 échec(s) ; prix demandés d'occasion et neufs
- **Wikipédia (confirmation d'existence)** : utilisée pour les candidats évalués — API de recherche MediaWiki, extraits contenant le modèle exact

## Avertissements

- 44 prix rejeté(s) comme aberrants (valeur conservée)

## RAM et stockage (€/Go)

- **ram:ddr3** : rejete (mesuré 3.1144 €/Go, 26 annonces) — écart de 140 % à la référence (1.3 € -> 3.1144 €), au-delà de 60 %
- **ram:ddr4** : donnees-insuffisantes — moins de 4 annonces valides après filtrage : valeur conservée
- **ram:ddr5** : donnees-insuffisantes — moins de 4 annonces valides après filtrage : valeur conservée
- **stockage:hdd** : en-attente-confirmation (mesuré 0.0283 €/Go, 32 annonces) — saut de 27 % (0.039 € -> 0.0283 €) : appliqué seulement s'il est confirmé au prochain run
- **stockage:ssd** : mis-a-jour-a-verifier (mesuré 0.1572 €/Go, 58 annonces) — appliqué mais écart de 37 % à la référence : relecture humaine conseillée
- **stockage:nvme** : mis-a-jour-a-verifier (mesuré 0.1329 €/Go, 37 annonces) — appliqué mais écart de 40 % à la référence : relecture humaine conseillée

## À vérifier manuellement

- **RX 7600** [prix-rejete] : écart de 110 % à la référence (230 € -> 483.14 €), au-delà de 60 %
- **Intel Core i5-4460** [ecart-notable] : appliqué mais écart de 30 % à la référence : relecture humaine conseillée
- **GTX 780** [prix-rejete] : écart de 118 % à la référence (55 € -> 119.78 €), au-delà de 60 %
- **GTX 670** [prix-rejete] : écart de 370 % à la référence (28 € -> 131.73 €), au-delà de 60 %
- **RTX 5080** [prix-rejete] : écart de 91 % à la référence (1550 € -> 2954.04 €), au-delà de 60 %
- **RTX 5090** [ecart-notable] : appliqué mais écart de 37 % à la référence : relecture humaine conseillée
- **RTX 3060** [prix-rejete] : écart de 117 % à la référence (260 € -> 563.29 €), au-delà de 60 %
- **RTX 3060 Ti** [ecart-notable] : appliqué mais écart de 55 % à la référence : relecture humaine conseillée
- **RTX 3070** [ecart-notable] : appliqué mais écart de 56 % à la référence : relecture humaine conseillée
- **AMD Ryzen 5 3600** [prix-rejete] : écart de 85 % à la référence (58 € -> 107.43 €), au-delà de 60 %
- **RTX 3070 Ti** [prix-rejete] : écart de 81 % à la référence (320 € -> 577.9 €), au-delà de 60 %
- **RTX 3080** [ecart-notable] : appliqué mais écart de 44 % à la référence : relecture humaine conseillée
- **RX 9070 XT** [prix-rejete] : écart de 116 % à la référence (660 € -> 1427.62 €), au-delà de 60 %
- **RTX 3080 Ti** [prix-rejete] : écart de 77 % à la référence (480 € -> 849 €), au-delà de 60 %
- **AMD Ryzen 7 3800X** [prix-rejete] : écart de 94 % à la référence (98 € -> 189.98 €), au-delà de 60 %
- **RTX 3050** [prix-rejete] : écart de 99 % à la référence (175 € -> 348.86 €), au-delà de 60 %
- **RX 6600** [ecart-notable] : appliqué mais écart de 35 % à la référence : relecture humaine conseillée
- **RTX 2060** [ecart-notable] : appliqué mais écart de 50 % à la référence : relecture humaine conseillée
- **RX 6600 XT** [prix-rejete] : prix d'occasion (465.7 €) supérieur au prix neuf demandé (437.87 €) : incohérent
- **RX 6700 XT** [ecart-notable] : appliqué mais écart de 35 % à la référence : relecture humaine conseillée
- **RTX 3090** [prix-rejete] : écart de 172 % à la référence (950 € -> 2581.71 €), au-delà de 60 %
- **RTX 2070** [ecart-notable] : appliqué mais écart de 34 % à la référence : relecture humaine conseillée
- **RTX 2070 Super** [prix-rejete] : écart de 71 % à la référence (200 € -> 341.38 €), au-delà de 60 %
- **GTX 1660 Super** [ecart-notable] : appliqué mais écart de 30 % à la référence : relecture humaine conseillée
- **GTX 1660 Ti** [prix-rejete] : écart de 141 % à la référence (108 € -> 260.7 €), au-delà de 60 %
- **RTX 2080** [ecart-notable] : appliqué mais écart de 41 % à la référence : relecture humaine conseillée
- **AMD Ryzen 5 2600** [prix-rejete] : écart de 113 % à la référence (46 € -> 98.02 €), au-delà de 60 %
- **AMD Ryzen 5 2600X** [prix-rejete] : écart de 73 % à la référence (52 € -> 90 €), au-delà de 60 %
- **AMD Ryzen 7 2700X** [prix-rejete] : écart de 127 % à la référence (48 € -> 109.08 €), au-delà de 60 %
- **AMD Ryzen 3 3200G** [ecart-notable] : appliqué mais écart de 27 % à la référence : relecture humaine conseillée
- **Intel Core i5-9400F** [prix-rejete] : écart de 77 % à la référence (45 € -> 79.63 €), au-delà de 60 %
- **Intel Core i7-10700KF** [ecart-notable] : appliqué mais écart de 41 % à la référence : relecture humaine conseillée
- **RX 5700 XT** [prix-rejete] : écart de 68 % à la référence (165 € -> 277.48 €), au-delà de 60 %
- **RTX 2080 Ti** [prix-rejete] : écart de 139 % à la référence (300 € -> 716 €), au-delà de 60 %
- **Intel Core i3-10100F** [ecart-notable] : appliqué mais écart de 59 % à la référence : relecture humaine conseillée
- **Intel Core i7-9700K** [ecart-notable] : appliqué mais écart de 50 % à la référence : relecture humaine conseillée
- **GTX 1650** [prix-rejete] : écart de 73 % à la référence (115 € -> 198.74 €), au-delà de 60 %
- **GTX 1650 Super** [ecart-notable] : appliqué mais écart de 43 % à la référence : relecture humaine conseillée
- **GTX 1070** [prix-rejete] : écart de 166 % à la référence (88 € -> 234.48 €), au-delà de 60 %
- **GTX 1070 Ti** [prix-rejete] : écart de 149 % à la référence (98 € -> 244 €), au-delà de 60 %
- **RX 5700** [prix-rejete] : écart de 74 % à la référence (145 € -> 252.68 €), au-delà de 60 %
- **GTX 1080** [prix-rejete] : écart de 118 % à la référence (122 € -> 265.44 €), au-delà de 60 %
- **GTX 1080 Ti** [prix-rejete] : écart de 137 % à la référence (180 € -> 427.06 €), au-delà de 60 %
- **Intel Core i5-7500** [prix-rejete] : écart de 75 % à la référence (33 € -> 57.9 €), au-delà de 60 %
- **Intel Core i5-7600K** [ecart-notable] : appliqué mais écart de 29 % à la référence : relecture humaine conseillée
- **Intel Core i3-9100F** [ecart-notable] : appliqué mais écart de 29 % à la référence : relecture humaine conseillée
- **Intel Core i3-8100** [ecart-notable] : appliqué mais écart de 39 % à la référence : relecture humaine conseillée
- **GTX 1050 Ti** [ecart-notable] : appliqué mais écart de 35 % à la référence : relecture humaine conseillée
- **RX 580** [prix-rejete] : écart de 69 % à la référence (85 € -> 143.7 €), au-delà de 60 %
- **RX 590** [prix-rejete] : écart de 84 % à la référence (105 € -> 192.85 €), au-delà de 60 %
- **RX 570** [prix-rejete] : écart de 68 % à la référence (65 € -> 109 €), au-delà de 60 %
- **Intel Core i5-4590** [ecart-notable] : appliqué mais écart de 28 % à la référence : relecture humaine conseillée
- **GTX 970** [ecart-notable] : appliqué mais écart de 34 % à la référence : relecture humaine conseillée
- **GTX 980** [prix-rejete] : écart de 231 % à la référence (42 € -> 138.86 €), au-delà de 60 %
- **RX 560** [prix-rejete] : écart de 101 % à la référence (40 € -> 80.39 €), au-delà de 60 %
- **GTX 960** [prix-rejete] : écart de 182 % à la référence (42 € -> 118.53 €), au-delà de 60 %
- **Intel Core i7-3770K** [ecart-notable] : appliqué mais écart de 41 % à la référence : relecture humaine conseillée
- **Intel Core i7-6700** [prix-rejete] : écart de 143 % à la référence (47 € -> 114.31 €), au-delà de 60 %
- **GTX 750 Ti** [prix-rejete] : écart de 387 % à la référence (28 € -> 136.24 €), au-delà de 60 %
- **Intel Core i5-3570K** [prix-rejete] : écart de 149 % à la référence (30 € -> 74.65 €), au-delà de 60 %
- **GTX 760** [prix-rejete] : écart de 205 % à la référence (38 € -> 115.85 €), au-delà de 60 %
- **GTX 770** [ecart-notable] : appliqué mais écart de 43 % à la référence : relecture humaine conseillée
- **AMD FX-6300** [ecart-notable] : appliqué mais écart de 41 % à la référence : relecture humaine conseillée
- **GT 1030** [ecart-notable] : appliqué mais écart de 48 % à la référence : relecture humaine conseillée
- **GTX 660** [prix-rejete] : écart de 70 % à la référence (25 € -> 42.62 €), au-delà de 60 %
- **GTX 680** [prix-rejete] : écart de 222 % à la référence (36 € -> 115.77 €), au-delà de 60 %
- **R9 270X** [prix-rejete] : écart de 72 % à la référence (27 € -> 46.35 €), au-delà de 60 %
- **R9 280X** [prix-rejete] : écart de 96 % à la référence (28 € -> 54.78 €), au-delà de 60 %
- **GTX 460** [ecart-notable] : appliqué mais écart de 36 % à la référence : relecture humaine conseillée
- **GTX 560 Ti** [prix-rejete] : écart de 80 % à la référence (20 € -> 35.91 €), au-delà de 60 %
- **Radeon HD 7870** [ecart-notable] : appliqué mais écart de 37 % à la référence : relecture humaine conseillée
- **ram:ddr3** [prix-rejete] : écart de 140 % à la référence (1.3 € -> 3.1144 €), au-delà de 60 %
- **Intel Core i3-3240** [composant-manquant] : 5 annonce(s), 5 vendeur(s) — seulement 5 annonce(s) (minimum 6)
- **Intel Core i5-9500** [composant-manquant] : 5 annonce(s), 4 vendeur(s) — seulement 5 annonce(s) (minimum 6)
- **Intel Core i7-4770** [composant-manquant] : 5 annonce(s), 5 vendeur(s) — seulement 5 annonce(s) (minimum 6)
- **GTX 1060** [composant-manquant] : 5 annonce(s), 5 vendeur(s) — variante proche d'un composant déjà au catalogue (« GTX 1060 3Go ») : doublon possible
- **Intel Core i3-4130** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i3-2100** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i7-7700K** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i9-10900** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **GTX 260** [composant-manquant] : 4 annonce(s), 3 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **RX 9060 XT** [composant-manquant] : 4 annonce(s), 3 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i3-4150** [composant-manquant] : 3 annonce(s), 3 vendeur(s) — seulement 3 annonce(s) (minimum 6)
- **Intel Core i3-3220** [composant-manquant] : 3 annonce(s), 3 vendeur(s) — seulement 3 annonce(s) (minimum 6)

## Limites

- Les prix eBay sont des prix DEMANDÉS (annonces actives), jamais des prix de vente constatés.
- Aucune API de fabricant ou de boutique neuve n'est connectée : le prix neuf est le prix demandé eBay (état « Neuf »), indicatif.
- Cartes mères, alimentations, boîtiers et refroidissements ne sont valorisés que par forfait (secondary.ts) : non vérifiables modèle par modèle.
- Les attributs des composants ajoutés (tier, facilité de revente, décote, socket) sont hérités d'un composant voisin et marqués comme estimés.
