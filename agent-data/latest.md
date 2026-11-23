# Rapport de l'agent quotidien — 2026-11-23

**Statut : Terminé avec avertissements**

- Déclencheur : push ([exécution](https://github.com/Qlimqx/pc-flip-estimator/actions/runs/45121721254))
- Début : 2026-11-23 07:04 (Paris) · Fin : 2026-11-23 07:06 (Paris) · Durée : 102 s
- Échéance de travail : 2026-11-23 07:44 (Paris) · Terminé avant 10 h (Paris) : oui

## Bilan

| Indicateur | Valeur |
|---|---|
| Composants du catalogue analysés | 215 |
| Prix vérifiés (données reçues) | 93 |
| Prix mis à jour | 50 (dont 31 à relire) |
| En attente de confirmation (saut > 15 %) | 2 |
| Données insuffisantes (valeur conservée) | 122 |
| Rejetés (écart aberrant, valeur conservée) | 42 |
| Source indisponible | 0 |
| Non traités | 0 |
| Composants ajoutés | 0 |
| Composants manquants détectés mais non ajoutés | 12 |
| Prix absents ou obsolètes (> 45 jours) | 65 |
| Anomalies de cohérence | 0 |

## Sources

- **eBay Browse (FR)** : disponible — 430 requêtes, 0 nouvelle(s) tentative(s), 0 échec(s) ; prix demandés d'occasion et neufs
- **Wikipédia (confirmation d'existence)** : utilisée pour les candidats évalués — API de recherche MediaWiki, extraits contenant le modèle exact

## Avertissements

- 42 prix rejeté(s) comme aberrants (valeur conservée)

## RAM et stockage (€/Go)

- **ram:ddr3** : rejete (mesuré 3.0981 €/Go, 26 annonces) — écart de 138 % à la référence (1.3 € -> 3.0981 €), au-delà de 60 %
- **ram:ddr4** : donnees-insuffisantes — moins de 4 annonces valides après filtrage : valeur conservée
- **ram:ddr5** : donnees-insuffisantes — moins de 4 annonces valides après filtrage : valeur conservée
- **stockage:hdd** : mis-a-jour (mesuré 0.0352 €/Go, 27 annonces) — appliqué
- **stockage:ssd** : mis-a-jour-a-verifier (mesuré 0.1572 €/Go, 61 annonces) — appliqué mais écart de 37 % à la référence : relecture humaine conseillée
- **stockage:nvme** : mis-a-jour-a-verifier (mesuré 0.1448 €/Go, 34 annonces) — appliqué mais écart de 52 % à la référence : relecture humaine conseillée

## À vérifier manuellement

- **RX 6700 XT** [ecart-notable] : appliqué mais écart de 35 % à la référence : relecture humaine conseillée
- **RX 5700** [prix-rejete] : écart de 77 % à la référence (145 € -> 257.2 €), au-delà de 60 %
- **GTX 780** [prix-rejete] : écart de 118 % à la référence (55 € -> 119.78 €), au-delà de 60 %
- **GTX 670** [prix-rejete] : écart de 356 % à la référence (28 € -> 127.77 €), au-delà de 60 %
- **RTX 4070 Super** [prix-rejete] : écart de 66 % à la référence (610 € -> 1014.68 €), au-delà de 60 %
- **RTX 5060 Ti** [ecart-notable] : appliqué mais écart de 37 % à la référence : relecture humaine conseillée
- **RTX 5080** [prix-rejete] : écart de 94 % à la référence (1550 € -> 3002.84 €), au-delà de 60 %
- **RTX 5090** [ecart-notable] : appliqué mais écart de 57 % à la référence : relecture humaine conseillée
- **RTX 3060** [prix-rejete] : écart de 107 % à la référence (260 € -> 537.1 €), au-delà de 60 %
- **RTX 4070 Ti** [ecart-notable] : appliqué mais écart de 58 % à la référence : relecture humaine conseillée
- **RTX 3060 Ti** [prix-rejete] : écart de 61 % à la référence (270 € -> 435.1 €), au-delà de 60 %
- **RTX 3070** [ecart-notable] : appliqué mais écart de 56 % à la référence : relecture humaine conseillée
- **AMD Ryzen 5 3600** [prix-rejete] : écart de 85 % à la référence (58 € -> 107.43 €), au-delà de 60 %
- **RTX 3070 Ti** [prix-rejete] : écart de 81 % à la référence (320 € -> 577.9 €), au-delà de 60 %
- **RTX 3080** [ecart-notable] : appliqué mais écart de 56 % à la référence : relecture humaine conseillée
- **RX 9070 XT** [prix-rejete] : écart de 121 % à la référence (660 € -> 1455.55 €), au-delà de 60 %
- **RTX 3080 Ti** [prix-rejete] : écart de 163 % à la référence (480 € -> 1263.31 €), au-delà de 60 %
- **AMD Ryzen 7 3800X** [prix-rejete] : écart de 94 % à la référence (98 € -> 189.98 €), au-delà de 60 %
- **RTX 3050** [prix-rejete] : écart de 99 % à la référence (175 € -> 348.88 €), au-delà de 60 %
- **RX 6600** [ecart-notable] : appliqué mais écart de 35 % à la référence : relecture humaine conseillée
- **RTX 2060** [ecart-notable] : appliqué mais écart de 50 % à la référence : relecture humaine conseillée
- **RTX 2060 Super** [ecart-notable] : appliqué mais écart de 28 % à la référence : relecture humaine conseillée
- **RX 6600 XT** [prix-rejete] : prix d'occasion (465.7 €) supérieur au prix neuf demandé (437.87 €) : incohérent
- **RTX 3090** [prix-rejete] : écart de 172 % à la référence (950 € -> 2581.71 €), au-delà de 60 %
- **RTX 2070** [ecart-notable] : appliqué mais écart de 34 % à la référence : relecture humaine conseillée
- **RTX 2070 Super** [prix-rejete] : écart de 67 % à la référence (200 € -> 333.1 €), au-delà de 60 %
- **GTX 1660 Super** [ecart-notable] : appliqué mais écart de 27 % à la référence : relecture humaine conseillée
- **GTX 1660 Ti** [prix-rejete] : écart de 141 % à la référence (108 € -> 260.7 €), au-delà de 60 %
- **RTX 2080** [ecart-notable] : appliqué mais écart de 41 % à la référence : relecture humaine conseillée
- **RX 6900 XT** [ecart-notable] : appliqué mais écart de 25 % à la référence : relecture humaine conseillée
- **AMD Ryzen 5 2600** [prix-rejete] : écart de 113 % à la référence (46 € -> 98.02 €), au-delà de 60 %
- **AMD Ryzen 5 2600X** [prix-rejete] : écart de 73 % à la référence (52 € -> 90 €), au-delà de 60 %
- **AMD Ryzen 3 3200G** [ecart-notable] : appliqué mais écart de 27 % à la référence : relecture humaine conseillée
- **AMD Ryzen 7 2700X** [prix-rejete] : écart de 127 % à la référence (48 € -> 109.08 €), au-delà de 60 %
- **Intel Core i5-9400F** [prix-rejete] : écart de 77 % à la référence (45 € -> 79.63 €), au-delà de 60 %
- **Intel Core i7-10700KF** [ecart-notable] : appliqué mais écart de 41 % à la référence : relecture humaine conseillée
- **RX 5700 XT** [prix-rejete] : écart de 102 % à la référence (165 € -> 333.1 €), au-delà de 60 %
- **RTX 2080 Ti** [prix-rejete] : écart de 119 % à la référence (300 € -> 656.55 €), au-delà de 60 %
- **Intel Core i3-10100F** [ecart-notable] : appliqué mais écart de 59 % à la référence : relecture humaine conseillée
- **GTX 1650** [prix-rejete] : écart de 78 % à la référence (115 € -> 204.82 €), au-delà de 60 %
- **GTX 1650 Super** [ecart-notable] : appliqué mais écart de 43 % à la référence : relecture humaine conseillée
- **GTX 1070** [prix-rejete] : écart de 163 % à la référence (88 € -> 231.64 €), au-delà de 60 %
- **GTX 1070 Ti** [prix-rejete] : écart de 176 % à la référence (98 € -> 270.61 €), au-delà de 60 %
- **GTX 1080** [prix-rejete] : écart de 111 % à la référence (122 € -> 257.44 €), au-delà de 60 %
- **GTX 1080 Ti** [prix-rejete] : écart de 130 % à la référence (180 € -> 414.17 €), au-delà de 60 %
- **Intel Core i5-7500** [ecart-notable] : appliqué mais écart de 28 % à la référence : relecture humaine conseillée
- **Intel Core i5-7600K** [ecart-notable] : appliqué mais écart de 29 % à la référence : relecture humaine conseillée
- **Intel Core i3-9100F** [ecart-notable] : appliqué mais écart de 29 % à la référence : relecture humaine conseillée
- **Intel Core i3-8100** [ecart-notable] : appliqué mais écart de 39 % à la référence : relecture humaine conseillée
- **GTX 1050 Ti** [ecart-notable] : appliqué mais écart de 42 % à la référence : relecture humaine conseillée
- **RX 580** [prix-rejete] : écart de 84 % à la référence (85 € -> 156.7 €), au-delà de 60 %
- **RX 590** [prix-rejete] : écart de 84 % à la référence (105 € -> 192.85 €), au-delà de 60 %
- **RX 570** [prix-rejete] : écart de 80 % à la référence (65 € -> 117.25 €), au-delà de 60 %
- **Intel Core i5-4590** [ecart-notable] : appliqué mais écart de 28 % à la référence : relecture humaine conseillée
- **GTX 970** [ecart-notable] : appliqué mais écart de 34 % à la référence : relecture humaine conseillée
- **GTX 980** [prix-rejete] : écart de 300 % à la référence (42 € -> 167.8 €), au-delà de 60 %
- **GTX 960** [prix-rejete] : écart de 138 % à la référence (42 € -> 100 €), au-delà de 60 %
- **Intel Core i7-3770K** [ecart-notable] : appliqué mais écart de 41 % à la référence : relecture humaine conseillée
- **Intel Core i7-6700** [prix-rejete] : écart de 143 % à la référence (47 € -> 114.31 €), au-delà de 60 %
- **GTX 750 Ti** [prix-rejete] : écart de 372 % à la référence (28 € -> 132.13 €), au-delà de 60 %
- **Intel Core i5-3570K** [prix-rejete] : écart de 145 % à la référence (30 € -> 73.51 €), au-delà de 60 %
- **Intel Core i3-4160** [ecart-notable] : appliqué mais écart de 27 % à la référence : relecture humaine conseillée
- **GTX 760** [prix-rejete] : écart de 216 % à la référence (38 € -> 119.99 €), au-delà de 60 %
- **GTX 770** [ecart-notable] : appliqué mais écart de 48 % à la référence : relecture humaine conseillée
- **GT 1030** [ecart-notable] : appliqué mais écart de 48 % à la référence : relecture humaine conseillée
- **AMD FX-6300** [ecart-notable] : appliqué mais écart de 41 % à la référence : relecture humaine conseillée
- **GTX 660** [prix-rejete] : écart de 63 % à la référence (25 € -> 40.85 €), au-delà de 60 %
- **GTX 680** [prix-rejete] : écart de 188 % à la référence (36 € -> 103.66 €), au-delà de 60 %
- **R9 270X** [prix-rejete] : écart de 72 % à la référence (27 € -> 46.35 €), au-delà de 60 %
- **GTX 560 Ti** [prix-rejete] : écart de 80 % à la référence (20 € -> 35.91 €), au-delà de 60 %
- **GTX 460** [ecart-notable] : appliqué mais écart de 36 % à la référence : relecture humaine conseillée
- **Radeon HD 7870** [ecart-notable] : appliqué mais écart de 28 % à la référence : relecture humaine conseillée
- **ram:ddr3** [prix-rejete] : écart de 138 % à la référence (1.3 € -> 3.0981 €), au-delà de 60 %
- **GTX 1060** [composant-manquant] : 6 annonce(s), 6 vendeur(s) — variante proche d'un composant déjà au catalogue (« GTX 1060 3Go ») : doublon possible
- **Intel Core i3-4130** [composant-manquant] : 5 annonce(s), 5 vendeur(s) — seulement 5 annonce(s) (minimum 6)
- **Intel Core i7-4770** [composant-manquant] : 5 annonce(s), 5 vendeur(s) — seulement 5 annonce(s) (minimum 6)
- **Intel Core i3-4150** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i5-9500** [composant-manquant] : 4 annonce(s), 3 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i5-6400** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i9-10900** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **GTX 260** [composant-manquant] : 4 annonce(s), 3 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **RX 9060 XT** [composant-manquant] : 4 annonce(s), 3 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i3-2100** [composant-manquant] : 3 annonce(s), 3 vendeur(s) — seulement 3 annonce(s) (minimum 6)
- **Intel Core i3-3220** [composant-manquant] : 3 annonce(s), 3 vendeur(s) — seulement 3 annonce(s) (minimum 6)
- **Intel Core i3-3240** [composant-manquant] : 3 annonce(s), 3 vendeur(s) — seulement 3 annonce(s) (minimum 6)

## Limites

- Les prix eBay sont des prix DEMANDÉS (annonces actives), jamais des prix de vente constatés.
- Aucune API de fabricant ou de boutique neuve n'est connectée : le prix neuf est le prix demandé eBay (état « Neuf »), indicatif.
- Cartes mères, alimentations, boîtiers et refroidissements ne sont valorisés que par forfait (secondary.ts) : non vérifiables modèle par modèle.
- Les attributs des composants ajoutés (tier, facilité de revente, décote, socket) sont hérités d'un composant voisin et marqués comme estimés.
