# Rapport de l'agent quotidien — 2026-11-19

**Statut : Terminé avec avertissements**

- Déclencheur : push ([exécution](https://github.com/Qlimqx/pc-flip-estimator/actions/runs/44469500448))
- Début : 2026-11-19 07:04 (Paris) · Fin : 2026-11-19 07:06 (Paris) · Durée : 104 s
- Échéance de travail : 2026-11-19 07:44 (Paris) · Terminé avant 10 h (Paris) : oui

## Bilan

| Indicateur | Valeur |
|---|---|
| Composants du catalogue analysés | 215 |
| Prix vérifiés (données reçues) | 90 |
| Prix mis à jour | 47 (dont 25 à relire) |
| En attente de confirmation (saut > 15 %) | 1 |
| Données insuffisantes (valeur conservée) | 125 |
| Rejetés (écart aberrant, valeur conservée) | 43 |
| Source indisponible | 0 |
| Non traités | 0 |
| Composants ajoutés | 0 |
| Composants manquants détectés mais non ajoutés | 12 |
| Prix absents ou obsolètes (> 45 jours) | 61 |
| Anomalies de cohérence | 0 |

## Sources

- **eBay Browse (FR)** : disponible — 430 requêtes, 0 nouvelle(s) tentative(s), 0 échec(s) ; prix demandés d'occasion et neufs
- **Wikipédia (confirmation d'existence)** : utilisée pour les candidats évalués — API de recherche MediaWiki, extraits contenant le modèle exact

## Avertissements

- 43 prix rejeté(s) comme aberrants (valeur conservée)

## RAM et stockage (€/Go)

- **ram:ddr3** : rejete (mesuré 3.0488 €/Go, 23 annonces) — écart de 135 % à la référence (1.3 € -> 3.0488 €), au-delà de 60 %
- **ram:ddr4** : mis-a-jour (mesuré 4.9016 €/Go, 15 annonces) — appliqué
- **ram:ddr5** : donnees-insuffisantes — moins de 4 annonces valides après filtrage : valeur conservée
- **stockage:hdd** : mis-a-jour (mesuré 0.0354 €/Go, 27 annonces) — appliqué
- **stockage:ssd** : mis-a-jour-a-verifier (mesuré 0.1572 €/Go, 61 annonces) — appliqué mais écart de 37 % à la référence : relecture humaine conseillée
- **stockage:nvme** : mis-a-jour-a-verifier (mesuré 0.1481 €/Go, 35 annonces) — appliqué mais écart de 56 % à la référence : relecture humaine conseillée

## À vérifier manuellement

- **RX 6600 XT** [prix-rejete] : écart de 62 % à la référence (300 € -> 486.1 €), au-delà de 60 %
- **GTX 780** [prix-rejete] : écart de 118 % à la référence (55 € -> 119.78 €), au-delà de 60 %
- **GTX 670** [prix-rejete] : écart de 366 % à la référence (28 € -> 130.6 €), au-delà de 60 %
- **RTX 4070** [prix-rejete] : écart de 129 % à la référence (430 € -> 983.78 €), au-delà de 60 %
- **RTX 5060 Ti** [ecart-notable] : appliqué mais écart de 37 % à la référence : relecture humaine conseillée
- **RTX 5080** [prix-rejete] : écart de 107 % à la référence (1550 € -> 3210.72 €), au-delà de 60 %
- **RTX 5090** [ecart-notable] : appliqué mais écart de 57 % à la référence : relecture humaine conseillée
- **RTX 3060** [prix-rejete] : écart de 115 % à la référence (260 € -> 558.43 €), au-delà de 60 %
- **RTX 4070 Ti** [prix-rejete] : écart de 61 % à la référence (770 € -> 1240.5 €), au-delà de 60 %
- **RTX 3060 Ti** [ecart-notable] : appliqué mais écart de 59 % à la référence : relecture humaine conseillée
- **RTX 3070** [ecart-notable] : appliqué mais écart de 48 % à la référence : relecture humaine conseillée
- **AMD Ryzen 5 3600** [prix-rejete] : écart de 149 % à la référence (58 € -> 144.21 €), au-delà de 60 %
- **RTX 3070 Ti** [prix-rejete] : écart de 81 % à la référence (320 € -> 577.9 €), au-delà de 60 %
- **RTX 3080** [ecart-notable] : appliqué mais écart de 56 % à la référence : relecture humaine conseillée
- **RX 9070 XT** [prix-rejete] : écart de 109 % à la référence (660 € -> 1380.05 €), au-delà de 60 %
- **RTX 3080 Ti** [prix-rejete] : écart de 160 % à la référence (480 € -> 1245.65 €), au-delà de 60 %
- **AMD Ryzen 7 3800X** [prix-rejete] : écart de 94 % à la référence (98 € -> 189.98 €), au-delà de 60 %
- **RTX 3050** [prix-rejete] : écart de 108 % à la référence (175 € -> 363.7 €), au-delà de 60 %
- **RX 6600** [ecart-notable] : appliqué mais écart de 35 % à la référence : relecture humaine conseillée
- **RTX 2060** [ecart-notable] : appliqué mais écart de 45 % à la référence : relecture humaine conseillée
- **RTX 3090** [prix-rejete] : écart de 217 % à la référence (950 € -> 3015.32 €), au-delà de 60 %
- **RTX 2070** [ecart-notable] : appliqué mais écart de 31 % à la référence : relecture humaine conseillée
- **RTX 2070 Super** [prix-rejete] : écart de 66 % à la référence (200 € -> 331.13 €), au-delà de 60 %
- **GTX 1660 Super** [ecart-notable] : appliqué mais écart de 34 % à la référence : relecture humaine conseillée
- **GTX 1660 Ti** [prix-rejete] : écart de 164 % à la référence (108 € -> 284.79 €), au-delà de 60 %
- **RTX 2080** [ecart-notable] : appliqué mais écart de 41 % à la référence : relecture humaine conseillée
- **AMD Ryzen 5 2600X** [prix-rejete] : écart de 73 % à la référence (52 € -> 90 €), au-delà de 60 %
- **AMD Ryzen 3 3200G** [ecart-notable] : appliqué mais écart de 27 % à la référence : relecture humaine conseillée
- **AMD Ryzen 7 2700X** [prix-rejete] : écart de 127 % à la référence (48 € -> 109.08 €), au-delà de 60 %
- **Intel Core i5-9400F** [prix-rejete] : écart de 77 % à la référence (45 € -> 79.63 €), au-delà de 60 %
- **Intel Core i7-10700KF** [prix-rejete] : écart de 82 % à la référence (135 € -> 246.15 €), au-delà de 60 %
- **GTX 1660** [ecart-notable] : appliqué mais écart de 33 % à la référence : relecture humaine conseillée
- **RX 5700 XT** [prix-rejete] : écart de 102 % à la référence (165 € -> 333.1 €), au-delà de 60 %
- **RTX 2080 Ti** [prix-rejete] : écart de 137 % à la référence (280 € -> 664.26 €), au-delà de 60 %
- **Intel Core i3-10100F** [ecart-notable] : appliqué mais écart de 59 % à la référence : relecture humaine conseillée
- **GTX 1650** [prix-rejete] : écart de 81 % à la référence (115 € -> 208.31 €), au-delà de 60 %
- **GTX 1070** [prix-rejete] : écart de 176 % à la référence (88 € -> 242.54 €), au-delà de 60 %
- **GTX 1070 Ti** [prix-rejete] : écart de 74 % à la référence (98 € -> 170.42 €), au-delà de 60 %
- **GTX 1080** [prix-rejete] : écart de 116 % à la référence (122 € -> 263.15 €), au-delà de 60 %
- **GTX 1080 Ti** [prix-rejete] : écart de 136 % à la référence (180 € -> 424.68 €), au-delà de 60 %
- **Intel Core i5-7600K** [ecart-notable] : appliqué mais écart de 29 % à la référence : relecture humaine conseillée
- **Intel Core i3-9100F** [ecart-notable] : appliqué mais écart de 29 % à la référence : relecture humaine conseillée
- **Intel Core i3-8100** [ecart-notable] : appliqué mais écart de 39 % à la référence : relecture humaine conseillée
- **RX 580** [prix-rejete] : écart de 69 % à la référence (85 € -> 143.7 €), au-delà de 60 %
- **RX 590** [prix-rejete] : écart de 60 % à la référence (105 € -> 168.35 €), au-delà de 60 %
- **GTX 1050 Ti** [ecart-notable] : appliqué mais écart de 35 % à la référence : relecture humaine conseillée
- **RX 570** [prix-rejete] : écart de 98 % à la référence (55 € -> 109 €), au-delà de 60 %
- **Intel Core i5-4590** [ecart-notable] : appliqué mais écart de 28 % à la référence : relecture humaine conseillée
- **GTX 970** [ecart-notable] : appliqué mais écart de 35 % à la référence : relecture humaine conseillée
- **GTX 980** [prix-rejete] : écart de 212 % à la référence (55 € -> 171.53 €), au-delà de 60 %
- **RX 560** [prix-rejete] : écart de 151 % à la référence (33 € -> 82.99 €), au-delà de 60 %
- **GTX 960** [prix-rejete] : écart de 94 % à la référence (42 € -> 81.55 €), au-delà de 60 %
- **Intel Core i7-3770K** [ecart-notable] : appliqué mais écart de 41 % à la référence : relecture humaine conseillée
- **GTX 950** [prix-rejete] : écart de 189 % à la référence (50 € -> 144.56 €), au-delà de 60 %
- **GTX 750 Ti** [prix-rejete] : écart de 382 % à la référence (28 € -> 135.07 €), au-delà de 60 %
- **Intel Core i5-3570K** [prix-rejete] : écart de 148 % à la référence (30 € -> 74.32 €), au-delà de 60 %
- **Intel Core i5-2500K** [prix-rejete] : écart de 79 % à la référence (12 € -> 21.5 €), au-delà de 60 %
- **GTX 760** [prix-rejete] : écart de 223 % à la référence (38 € -> 122.65 €), au-delà de 60 %
- **GTX 770** [ecart-notable] : appliqué mais écart de 43 % à la référence : relecture humaine conseillée
- **GT 1030** [ecart-notable] : appliqué mais écart de 57 % à la référence : relecture humaine conseillée
- **AMD FX-6300** [ecart-notable] : appliqué mais écart de 41 % à la référence : relecture humaine conseillée
- **GTX 660** [prix-rejete] : écart de 63 % à la référence (25 € -> 40.85 €), au-delà de 60 %
- **GTX 680** [prix-rejete] : écart de 188 % à la référence (36 € -> 103.66 €), au-delà de 60 %
- **R9 270X** [prix-rejete] : écart de 72 % à la référence (27 € -> 46.35 €), au-delà de 60 %
- **GTX 460** [ecart-notable] : appliqué mais écart de 49 % à la référence : relecture humaine conseillée
- **GTX 560 Ti** [prix-rejete] : écart de 80 % à la référence (20 € -> 35.91 €), au-delà de 60 %
- **Radeon HD 7870** [ecart-notable] : appliqué mais écart de 28 % à la référence : relecture humaine conseillée
- **ram:ddr3** [prix-rejete] : écart de 135 % à la référence (1.3 € -> 3.0488 €), au-delà de 60 %
- **GTX 1060** [composant-manquant] : 6 annonce(s), 6 vendeur(s) — variante proche d'un composant déjà au catalogue (« GTX 1060 3Go ») : doublon possible
- **Intel Core i3-4130** [composant-manquant] : 5 annonce(s), 5 vendeur(s) — seulement 5 annonce(s) (minimum 6)
- **Intel Core i3-4150** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i3-2100** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i5-9500** [composant-manquant] : 4 annonce(s), 3 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i5-6400** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i7-7700** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i7-4770** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i9-10900** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **RX 9060 XT** [composant-manquant] : 4 annonce(s), 3 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i3-3220** [composant-manquant] : 3 annonce(s), 3 vendeur(s) — seulement 3 annonce(s) (minimum 6)
- **Intel Core i3-3240** [composant-manquant] : 3 annonce(s), 3 vendeur(s) — seulement 3 annonce(s) (minimum 6)

## Limites

- Les prix eBay sont des prix DEMANDÉS (annonces actives), jamais des prix de vente constatés.
- Aucune API de fabricant ou de boutique neuve n'est connectée : le prix neuf est le prix demandé eBay (état « Neuf »), indicatif.
- Cartes mères, alimentations, boîtiers et refroidissements ne sont valorisés que par forfait (secondary.ts) : non vérifiables modèle par modèle.
- Les attributs des composants ajoutés (tier, facilité de revente, décote, socket) sont hérités d'un composant voisin et marqués comme estimés.
