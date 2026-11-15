# Rapport de l'agent quotidien — 2026-11-15

**Statut : Terminé avec avertissements**

- Déclencheur : push ([exécution](https://github.com/Qlimqx/pc-flip-estimator/actions/runs/43683999723))
- Début : 2026-11-15 07:07 (Paris) · Fin : 2026-11-15 07:09 (Paris) · Durée : 105 s
- Échéance de travail : 2026-11-15 07:47 (Paris) · Terminé avant 10 h (Paris) : oui

## Bilan

| Indicateur | Valeur |
|---|---|
| Composants du catalogue analysés | 214 |
| Prix vérifiés (données reçues) | 85 |
| Prix mis à jour | 43 (dont 25 à relire) |
| En attente de confirmation (saut > 15 %) | 0 |
| Données insuffisantes (valeur conservée) | 128 |
| Rejetés (écart aberrant, valeur conservée) | 43 |
| Source indisponible | 0 |
| Non traités | 0 |
| Composants ajoutés | 1 |
| Composants manquants détectés mais non ajoutés | 11 |
| Prix absents ou obsolètes (> 45 jours) | 60 |
| Anomalies de cohérence | 0 |

## Sources

- **eBay Browse (FR)** : disponible — 426 requêtes, 0 nouvelle(s) tentative(s), 0 échec(s) ; prix demandés d'occasion et neufs
- **Wikipédia (confirmation d'existence)** : utilisée pour les candidats évalués — API de recherche MediaWiki, extraits contenant le modèle exact

## Avertissements

- 43 prix rejeté(s) comme aberrants (valeur conservée)

## Composants ajoutés

- **Intel Core i3-4160** (cpu) : 8.96 € (5.89 €–12.94 €), confiance moyenne, 6 annonces / 5 vendeurs, attributs estimés : tier, faciliteRevente, decoteAnciennete, socket

## RAM et stockage (€/Go)

- **ram:ddr3** : rejete (mesuré 3.1356 €/Go, 22 annonces) — écart de 248 % à la référence (0.9 € -> 3.1356 €), au-delà de 60 %
- **ram:ddr4** : mis-a-jour (mesuré 4.6016 €/Go, 17 annonces) — appliqué
- **ram:ddr5** : donnees-insuffisantes — moins de 4 annonces valides après filtrage : valeur conservée
- **stockage:hdd** : mis-a-jour (mesuré 0.0423 €/Go, 26 annonces) — appliqué
- **stockage:ssd** : mis-a-jour-a-verifier (mesuré 0.1572 €/Go, 64 annonces) — appliqué mais écart de 37 % à la référence : relecture humaine conseillée
- **stockage:nvme** : mis-a-jour-a-verifier (mesuré 0.1453 €/Go, 37 annonces) — appliqué mais écart de 53 % à la référence : relecture humaine conseillée

## À vérifier manuellement

- **GTX 670** [prix-rejete] : écart de 354 % à la référence (28 € -> 127.13 €), au-delà de 60 %
- **RTX 5060 Ti** [prix-rejete] : écart de 77 % à la référence (510 € -> 904.3 €), au-delà de 60 %
- **RTX 5080** [prix-rejete] : écart de 104 % à la référence (1550 € -> 3165.35 €), au-delà de 60 %
- **RTX 5090** [ecart-notable] : appliqué mais écart de 57 % à la référence : relecture humaine conseillée
- **RTX 3060** [prix-rejete] : écart de 129 % à la référence (235 € -> 537.1 €), au-delà de 60 %
- **RTX 4070 Ti** [prix-rejete] : écart de 69 % à la référence (720 € -> 1215.03 €), au-delà de 60 %
- **RTX 3060 Ti** [prix-rejete] : écart de 65 % à la référence (270 € -> 445.3 €), au-delà de 60 %
- **RTX 3070** [ecart-notable] : appliqué mais écart de 48 % à la référence : relecture humaine conseillée
- **AMD Ryzen 5 3600** [prix-rejete] : écart de 149 % à la référence (58 € -> 144.21 €), au-delà de 60 %
- **RTX 3070 Ti** [prix-rejete] : écart de 78 % à la référence (320 € -> 568.09 €), au-delà de 60 %
- **RTX 3080** [ecart-notable] : appliqué mais écart de 56 % à la référence : relecture humaine conseillée
- **RX 9070 XT** [prix-rejete] : écart de 103 % à la référence (660 € -> 1341.61 €), au-delà de 60 %
- **RTX 3080 Ti** [prix-rejete] : écart de 106 % à la référence (480 € -> 990 €), au-delà de 60 %
- **AMD Ryzen 7 3800X** [prix-rejete] : écart de 94 % à la référence (98 € -> 189.98 €), au-delà de 60 %
- **RTX 3050** [prix-rejete] : écart de 109 % à la référence (175 € -> 366.43 €), au-delà de 60 %
- **RX 6600** [ecart-notable] : appliqué mais écart de 37 % à la référence : relecture humaine conseillée
- **RTX 2060** [ecart-notable] : appliqué mais écart de 49 % à la référence : relecture humaine conseillée
- **RX 6600 XT** [ecart-notable] : appliqué mais écart de 55 % à la référence : relecture humaine conseillée
- **RTX 3090** [prix-rejete] : écart de 230 % à la référence (900 € -> 2969.99 €), au-delà de 60 %
- **RTX 2070** [ecart-notable] : appliqué mais écart de 43 % à la référence : relecture humaine conseillée
- **RTX 2070 Super** [prix-rejete] : écart de 65 % à la référence (200 € -> 329.11 €), au-delà de 60 %
- **GTX 1660 Super** [ecart-notable] : appliqué mais écart de 35 % à la référence : relecture humaine conseillée
- **GTX 1660 Ti** [prix-rejete] : écart de 99 % à la référence (108 € -> 214.93 €), au-delà de 60 %
- **RTX 2080** [ecart-notable] : appliqué mais écart de 41 % à la référence : relecture humaine conseillée
- **RX 6900 XT** [ecart-notable] : appliqué mais écart de 31 % à la référence : relecture humaine conseillée
- **AMD Ryzen 5 2600X** [prix-rejete] : écart de 72 % à la référence (52 € -> 89.55 €), au-delà de 60 %
- **AMD Ryzen 3 3200G** [ecart-notable] : appliqué mais écart de 27 % à la référence : relecture humaine conseillée
- **AMD Ryzen 7 2700X** [prix-rejete] : écart de 127 % à la référence (48 € -> 109.08 €), au-delà de 60 %
- **Intel Core i5-9400F** [prix-rejete] : écart de 77 % à la référence (45 € -> 79.63 €), au-delà de 60 %
- **Intel Core i7-10700KF** [prix-rejete] : écart de 82 % à la référence (135 € -> 246.15 €), au-delà de 60 %
- **RX 5700 XT** [prix-rejete] : écart de 102 % à la référence (165 € -> 333.1 €), au-delà de 60 %
- **RTX 2080 Ti** [prix-rejete] : écart de 134 % à la référence (280 € -> 654.82 €), au-delà de 60 %
- **Intel Core i3-10100F** [ecart-notable] : appliqué mais écart de 59 % à la référence : relecture humaine conseillée
- **Intel Core i9-9900K** [ecart-notable] : appliqué mais écart de 28 % à la référence : relecture humaine conseillée
- **GTX 1650** [prix-rejete] : écart de 81 % à la référence (115 € -> 208.37 €), au-delà de 60 %
- **GTX 1070** [prix-rejete] : écart de 132 % à la référence (100 € -> 231.64 €), au-delà de 60 %
- **GTX 1070 Ti** [prix-rejete] : écart de 134 % à la référence (115 € -> 268.93 €), au-delà de 60 %
- **GTX 1080** [prix-rejete] : écart de 63 % à la référence (140 € -> 228.24 €), au-delà de 60 %
- **GTX 1080 Ti** [prix-rejete] : écart de 133 % à la référence (180 € -> 418.58 €), au-delà de 60 %
- **Intel Core i5-7600K** [ecart-notable] : appliqué mais écart de 29 % à la référence : relecture humaine conseillée
- **Intel Core i3-9100F** [ecart-notable] : appliqué mais écart de 29 % à la référence : relecture humaine conseillée
- **Intel Core i3-8100** [ecart-notable] : appliqué mais écart de 39 % à la référence : relecture humaine conseillée
- **GTX 1050 Ti** [ecart-notable] : appliqué mais écart de 42 % à la référence : relecture humaine conseillée
- **RX 580** [ecart-notable] : appliqué mais écart de 48 % à la référence : relecture humaine conseillée
- **RX 590** [prix-rejete] : écart de 60 % à la référence (105 € -> 168.35 €), au-delà de 60 %
- **Intel Core i7-4790K** [prix-rejete] : écart de 92 % à la référence (58 € -> 111.4 €), au-delà de 60 %
- **RX 570** [prix-rejete] : écart de 132 % à la référence (55 € -> 127.75 €), au-delà de 60 %
- **Intel Core i5-4590** [ecart-notable] : appliqué mais écart de 30 % à la référence : relecture humaine conseillée
- **GTX 970** [ecart-notable] : appliqué mais écart de 34 % à la référence : relecture humaine conseillée
- **GTX 980** [prix-rejete] : écart de 147 % à la référence (55 € -> 135.84 €), au-delà de 60 %
- **GTX 960** [prix-rejete] : écart de 200 % à la référence (42 € -> 126 €), au-delà de 60 %
- **Intel Core i7-3770K** [ecart-notable] : appliqué mais écart de 55 % à la référence : relecture humaine conseillée
- **GTX 950** [prix-rejete] : écart de 186 % à la référence (50 € -> 142.81 €), au-delà de 60 %
- **GTX 750 Ti** [prix-rejete] : écart de 350 % à la référence (28 € -> 126 €), au-delà de 60 %
- **Intel Core i5-3570K** [prix-rejete] : écart de 144 % à la référence (30 € -> 73.14 €), au-delà de 60 %
- **Intel Core i5-2500K** [prix-rejete] : écart de 79 % à la référence (12 € -> 21.5 €), au-delà de 60 %
- **GTX 760** [prix-rejete] : écart de 214 % à la référence (38 € -> 119.39 €), au-delà de 60 %
- **GTX 770** [ecart-notable] : appliqué mais écart de 43 % à la référence : relecture humaine conseillée
- **GTX 780** [prix-rejete] : écart de 118 % à la référence (55 € -> 119.78 €), au-delà de 60 %
- **AMD FX-6300** [ecart-notable] : appliqué mais écart de 41 % à la référence : relecture humaine conseillée
- **GT 1030** [ecart-notable] : appliqué mais écart de 57 % à la référence : relecture humaine conseillée
- **GTX 660** [prix-rejete] : écart de 63 % à la référence (25 € -> 40.85 €), au-delà de 60 %
- **GTX 680** [prix-rejete] : écart de 237 % à la référence (36 € -> 121.37 €), au-delà de 60 %
- **R9 270X** [prix-rejete] : écart de 72 % à la référence (27 € -> 46.35 €), au-delà de 60 %
- **GTX 460** [prix-rejete] : écart de 99 % à la référence (15 € -> 29.82 €), au-delà de 60 %
- **GTX 560 Ti** [prix-rejete] : écart de 80 % à la référence (20 € -> 35.91 €), au-delà de 60 %
- **Radeon HD 7870** [ecart-notable] : appliqué mais écart de 28 % à la référence : relecture humaine conseillée
- **ram:ddr3** [prix-rejete] : écart de 248 % à la référence (0.9 € -> 3.1356 €), au-delà de 60 %
- **Intel Core i3-4130** [composant-manquant] : 5 annonce(s), 5 vendeur(s) — seulement 5 annonce(s) (minimum 6)
- **Intel Core i5-8500** [composant-manquant] : 5 annonce(s), 4 vendeur(s) — seulement 5 annonce(s) (minimum 6)
- **Intel Core i3-4150** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i3-2100** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i3-3240** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i5-9500** [composant-manquant] : 4 annonce(s), 3 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i5-6400** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i7-7700K** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **GTX 1060** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — variante proche d'un composant déjà au catalogue (« GTX 1060 3Go ») : doublon possible
- **Intel Core i3-3220** [composant-manquant] : 3 annonce(s), 3 vendeur(s) — seulement 3 annonce(s) (minimum 6)
- **Intel Core i3-9100** [composant-manquant] : 3 annonce(s), 3 vendeur(s) — seulement 3 annonce(s) (minimum 6)

## Limites

- Les prix eBay sont des prix DEMANDÉS (annonces actives), jamais des prix de vente constatés.
- Aucune API de fabricant ou de boutique neuve n'est connectée : le prix neuf est le prix demandé eBay (état « Neuf »), indicatif.
- Cartes mères, alimentations, boîtiers et refroidissements ne sont valorisés que par forfait (secondary.ts) : non vérifiables modèle par modèle.
- Les attributs des composants ajoutés (tier, facilité de revente, décote, socket) sont hérités d'un composant voisin et marqués comme estimés.
