# Rapport de l'agent quotidien — 2026-11-14

**Statut : Terminé avec avertissements**

- Déclencheur : push ([exécution](https://github.com/Qlimqx/pc-flip-estimator/actions/runs/43559724550))
- Début : 2026-11-14 06:04 (Paris) · Fin : 2026-11-14 06:07 (Paris) · Durée : 173 s
- Échéance de travail : 2026-11-14 06:44 (Paris) · Terminé avant 10 h (Paris) : oui

## Bilan

| Indicateur | Valeur |
|---|---|
| Composants du catalogue analysés | 213 |
| Prix vérifiés (données reçues) | 84 |
| Prix mis à jour | 42 (dont 23 à relire) |
| En attente de confirmation (saut > 15 %) | 1 |
| Données insuffisantes (valeur conservée) | 129 |
| Rejetés (écart aberrant, valeur conservée) | 42 |
| Source indisponible | 0 |
| Non traités | 0 |
| Composants ajoutés | 0 |
| Composants manquants détectés mais non ajoutés | 12 |
| Prix absents ou obsolètes (> 45 jours) | 61 |
| Anomalies de cohérence | 0 |

## Sources

- **eBay Browse (FR)** : disponible — 426 requêtes, 0 nouvelle(s) tentative(s), 0 échec(s) ; prix demandés d'occasion et neufs
- **Wikipédia (confirmation d'existence)** : utilisée pour les candidats évalués — API de recherche MediaWiki, extraits contenant le modèle exact

## Avertissements

- 42 prix rejeté(s) comme aberrants (valeur conservée)

## RAM et stockage (€/Go)

- **ram:ddr3** : rejete (mesuré 3.5056 €/Go, 25 annonces) — écart de 290 % à la référence (0.9 € -> 3.5056 €), au-delà de 60 %
- **ram:ddr4** : mis-a-jour (mesuré 4.6016 €/Go, 17 annonces) — appliqué
- **ram:ddr5** : donnees-insuffisantes — moins de 4 annonces valides après filtrage : valeur conservée
- **stockage:hdd** : mis-a-jour-a-verifier (mesuré 0.044 €/Go, 31 annonces) — appliqué mais écart de 26 % à la référence : relecture humaine conseillée
- **stockage:ssd** : mis-a-jour-a-verifier (mesuré 0.1572 €/Go, 66 annonces) — appliqué mais écart de 37 % à la référence : relecture humaine conseillée
- **stockage:nvme** : mis-a-jour-a-verifier (mesuré 0.1455 €/Go, 35 annonces) — appliqué mais écart de 53 % à la référence : relecture humaine conseillée

## À vérifier manuellement

- **RTX 4070** [prix-rejete] : écart de 138 % à la référence (430 € -> 1022.36 €), au-delà de 60 %
- **RTX 5080** [prix-rejete] : écart de 112 % à la référence (1550 € -> 3291.07 €), au-delà de 60 %
- **RTX 5060 Ti** [prix-rejete] : écart de 70 % à la référence (510 € -> 865.35 €), au-delà de 60 %
- **RTX 5090** [ecart-notable] : appliqué mais écart de 57 % à la référence : relecture humaine conseillée
- **RTX 3060** [prix-rejete] : écart de 221 % à la référence (235 € -> 753.63 €), au-delà de 60 %
- **RTX 3060 Ti** [prix-rejete] : écart de 61 % à la référence (270 € -> 435.1 €), au-delà de 60 %
- **RTX 4070 Ti** [prix-rejete] : écart de 69 % à la référence (720 € -> 1215.03 €), au-delà de 60 %
- **RTX 3070** [ecart-notable] : appliqué mais écart de 40 % à la référence : relecture humaine conseillée
- **AMD Ryzen 5 3600** [prix-rejete] : écart de 149 % à la référence (58 € -> 144.21 €), au-delà de 60 %
- **RTX 3070 Ti** [prix-rejete] : écart de 96 % à la référence (290 € -> 568.95 €), au-delà de 60 %
- **RTX 3080** [ecart-notable] : appliqué mais écart de 56 % à la référence : relecture humaine conseillée
- **RX 9070 XT** [prix-rejete] : écart de 167 % à la référence (660 € -> 1760.17 €), au-delà de 60 %
- **RTX 3080 Ti** [prix-rejete] : écart de 107 % à la référence (480 € -> 995.04 €), au-delà de 60 %
- **AMD Ryzen 7 3800X** [prix-rejete] : écart de 94 % à la référence (98 € -> 189.98 €), au-delà de 60 %
- **RTX 3050** [prix-rejete] : écart de 108 % à la référence (175 € -> 364.22 €), au-delà de 60 %
- **RX 6600** [ecart-notable] : appliqué mais écart de 37 % à la référence : relecture humaine conseillée
- **RTX 2060** [ecart-notable] : appliqué mais écart de 49 % à la référence : relecture humaine conseillée
- **RX 6600 XT** [ecart-notable] : appliqué mais écart de 48 % à la référence : relecture humaine conseillée
- **RTX 3090** [prix-rejete] : écart de 196 % à la référence (900 € -> 2665.77 €), au-delà de 60 %
- **RTX 2070** [ecart-notable] : appliqué mais écart de 39 % à la référence : relecture humaine conseillée
- **RTX 2070 Super** [prix-rejete] : écart de 65 % à la référence (200 € -> 329.11 €), au-delà de 60 %
- **GTX 1660 Ti** [prix-rejete] : écart de 96 % à la référence (108 € -> 211.82 €), au-delà de 60 %
- **GTX 1660 Super** [ecart-notable] : appliqué mais écart de 34 % à la référence : relecture humaine conseillée
- **RTX 2080** [ecart-notable] : appliqué mais écart de 41 % à la référence : relecture humaine conseillée
- **AMD Ryzen 5 2600X** [prix-rejete] : écart de 72 % à la référence (52 € -> 89.55 €), au-delà de 60 %
- **AMD Ryzen 3 3200G** [ecart-notable] : appliqué mais écart de 27 % à la référence : relecture humaine conseillée
- **AMD Ryzen 7 2700X** [prix-rejete] : écart de 127 % à la référence (48 € -> 109.08 €), au-delà de 60 %
- **Intel Core i5-9400F** [prix-rejete] : écart de 77 % à la référence (45 € -> 79.63 €), au-delà de 60 %
- **Intel Core i7-10700KF** [prix-rejete] : écart de 82 % à la référence (135 € -> 246.15 €), au-delà de 60 %
- **RX 5700 XT** [prix-rejete] : écart de 102 % à la référence (165 € -> 333.1 €), au-delà de 60 %
- **Intel Core i3-10100F** [ecart-notable] : appliqué mais écart de 59 % à la référence : relecture humaine conseillée
- **RTX 2080 Ti** [prix-rejete] : écart de 142 % à la référence (280 € -> 677.97 €), au-delà de 60 %
- **Intel Core i9-9900K** [ecart-notable] : appliqué mais écart de 28 % à la référence : relecture humaine conseillée
- **GTX 1650** [prix-rejete] : écart de 81 % à la référence (115 € -> 208.37 €), au-delà de 60 %
- **GTX 1070** [prix-rejete] : écart de 203 % à la référence (100 € -> 303.07 €), au-delà de 60 %
- **GTX 1070 Ti** [prix-rejete] : écart de 135 % à la référence (115 € -> 270.61 €), au-delà de 60 %
- **GTX 1080** [prix-rejete] : écart de 79 % à la référence (140 € -> 250.04 €), au-delà de 60 %
- **GTX 1080 Ti** [prix-rejete] : écart de 94 % à la référence (240 € -> 465.7 €), au-delà de 60 %
- **Intel Core i5-7600K** [ecart-notable] : appliqué mais écart de 29 % à la référence : relecture humaine conseillée
- **Intel Core i3-8100** [ecart-notable] : appliqué mais écart de 39 % à la référence : relecture humaine conseillée
- **GTX 1050 Ti** [ecart-notable] : appliqué mais écart de 38 % à la référence : relecture humaine conseillée
- **RX 590** [prix-rejete] : écart de 60 % à la référence (105 € -> 168.35 €), au-delà de 60 %
- **RX 580** [ecart-notable] : appliqué mais écart de 48 % à la référence : relecture humaine conseillée
- **Intel Core i7-4790K** [prix-rejete] : écart de 92 % à la référence (58 € -> 111.4 €), au-delà de 60 %
- **RX 570** [prix-rejete] : écart de 113 % à la référence (55 € -> 117.25 €), au-delà de 60 %
- **Intel Core i5-4590** [ecart-notable] : appliqué mais écart de 30 % à la référence : relecture humaine conseillée
- **GTX 970** [ecart-notable] : appliqué mais écart de 34 % à la référence : relecture humaine conseillée
- **GTX 980** [prix-rejete] : écart de 163 % à la référence (55 € -> 144.74 €), au-delà de 60 %
- **GTX 960** [ecart-notable] : appliqué mais écart de 49 % à la référence : relecture humaine conseillée
- **GTX 950** [prix-rejete] : écart de 217 % à la référence (50 € -> 158.58 €), au-delà de 60 %
- **GTX 750 Ti** [prix-rejete] : écart de 437 % à la référence (28 € -> 150.25 €), au-delà de 60 %
- **Intel Core i5-3570K** [prix-rejete] : écart de 145 % à la référence (30 € -> 73.5 €), au-delà de 60 %
- **Intel Core i5-2500K** [prix-rejete] : écart de 79 % à la référence (12 € -> 21.5 €), au-delà de 60 %
- **GTX 760** [prix-rejete] : écart de 256 % à la référence (38 € -> 135.46 €), au-delà de 60 %
- **GTX 770** [ecart-notable] : appliqué mais écart de 43 % à la référence : relecture humaine conseillée
- **GTX 780** [prix-rejete] : écart de 100 % à la référence (55 € -> 109.9 €), au-delà de 60 %
- **GT 1030** [ecart-notable] : appliqué mais écart de 57 % à la référence : relecture humaine conseillée
- **AMD FX-6300** [ecart-notable] : appliqué mais écart de 41 % à la référence : relecture humaine conseillée
- **GTX 660** [prix-rejete] : écart de 63 % à la référence (25 € -> 40.85 €), au-delà de 60 %
- **GTX 680** [prix-rejete] : écart de 188 % à la référence (36 € -> 103.66 €), au-delà de 60 %
- **R9 270X** [prix-rejete] : écart de 72 % à la référence (27 € -> 46.35 €), au-delà de 60 %
- **GTX 460** [prix-rejete] : écart de 99 % à la référence (15 € -> 29.82 €), au-delà de 60 %
- **GTX 560 Ti** [prix-rejete] : écart de 80 % à la référence (20 € -> 35.91 €), au-delà de 60 %
- **Radeon HD 7870** [ecart-notable] : appliqué mais écart de 28 % à la référence : relecture humaine conseillée
- **ram:ddr3** [prix-rejete] : écart de 290 % à la référence (0.9 € -> 3.5056 €), au-delà de 60 %
- **Intel Core i3-4160** [composant-manquant] : 5 annonce(s), 5 vendeur(s) — seulement 5 annonce(s) (minimum 6)
- **Intel Core i3-4130** [composant-manquant] : 5 annonce(s), 5 vendeur(s) — seulement 5 annonce(s) (minimum 6)
- **Intel Core i5-8500** [composant-manquant] : 5 annonce(s), 4 vendeur(s) — seulement 5 annonce(s) (minimum 6)
- **Intel Core i3-4150** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i3-2100** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i5-6400** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i5-9500** [composant-manquant] : 4 annonce(s), 3 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i7-7700K** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **GTX 1060** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — variante proche d'un composant déjà au catalogue (« GTX 1060 3Go ») : doublon possible
- **Intel Core i3-3220** [composant-manquant] : 3 annonce(s), 3 vendeur(s) — seulement 3 annonce(s) (minimum 6)
- **Intel Core i3-9100** [composant-manquant] : 3 annonce(s), 3 vendeur(s) — seulement 3 annonce(s) (minimum 6)
- **Intel Core i3-3240** [composant-manquant] : 3 annonce(s), 3 vendeur(s) — seulement 3 annonce(s) (minimum 6)

## Limites

- Les prix eBay sont des prix DEMANDÉS (annonces actives), jamais des prix de vente constatés.
- Aucune API de fabricant ou de boutique neuve n'est connectée : le prix neuf est le prix demandé eBay (état « Neuf »), indicatif.
- Cartes mères, alimentations, boîtiers et refroidissements ne sont valorisés que par forfait (secondary.ts) : non vérifiables modèle par modèle.
- Les attributs des composants ajoutés (tier, facilité de revente, décote, socket) sont hérités d'un composant voisin et marqués comme estimés.
