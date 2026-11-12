# Rapport de l'agent quotidien — 2026-11-12

**Statut : Terminé avec avertissements**

- Déclencheur : push ([exécution](https://github.com/Qlimqx/pc-flip-estimator/actions/runs/43159011326))
- Début : 2026-11-12 06:05 (Paris) · Fin : 2026-11-12 06:07 (Paris) · Durée : 101 s
- Échéance de travail : 2026-11-12 06:45 (Paris) · Terminé avant 10 h (Paris) : oui

## Bilan

| Indicateur | Valeur |
|---|---|
| Composants du catalogue analysés | 213 |
| Prix vérifiés (données reçues) | 85 |
| Prix mis à jour | 41 (dont 22 à relire) |
| En attente de confirmation (saut > 15 %) | 3 |
| Données insuffisantes (valeur conservée) | 128 |
| Rejetés (écart aberrant, valeur conservée) | 42 |
| Source indisponible | 0 |
| Non traités | 0 |
| Composants ajoutés | 0 |
| Composants manquants détectés mais non ajoutés | 12 |
| Prix absents ou obsolètes (> 45 jours) | 63 |
| Anomalies de cohérence | 0 |

## Sources

- **eBay Browse (FR)** : disponible — 426 requêtes, 0 nouvelle(s) tentative(s), 0 échec(s) ; prix demandés d'occasion et neufs
- **Wikipédia (confirmation d'existence)** : utilisée pour les candidats évalués — API de recherche MediaWiki, extraits contenant le modèle exact

## Avertissements

- 42 prix rejeté(s) comme aberrants (valeur conservée)

## RAM et stockage (€/Go)

- **ram:ddr3** : rejete (mesuré 2.8031 €/Go, 21 annonces) — écart de 211 % à la référence (0.9 € -> 2.8031 €), au-delà de 60 %
- **ram:ddr4** : donnees-insuffisantes — moins de 4 annonces valides après filtrage : valeur conservée
- **ram:ddr5** : donnees-insuffisantes — moins de 4 annonces valides après filtrage : valeur conservée
- **stockage:hdd** : mis-a-jour (mesuré 0.0433 €/Go, 31 annonces) — appliqué
- **stockage:ssd** : mis-a-jour-a-verifier (mesuré 0.1572 €/Go, 67 annonces) — appliqué mais écart de 37 % à la référence : relecture humaine conseillée
- **stockage:nvme** : mis-a-jour-a-verifier (mesuré 0.146 €/Go, 33 annonces) — appliqué mais écart de 54 % à la référence : relecture humaine conseillée

## À vérifier manuellement

- **RTX 4060 Ti** [prix-rejete] : écart de 153 % à la référence (340 € -> 861.59 €), au-delà de 60 %
- **RTX 4090** [prix-rejete] : écart de 78 % à la référence (2350 € -> 4185.7 €), au-delà de 60 %
- **RTX 5060 Ti** [prix-rejete] : écart de 70 % à la référence (510 € -> 865.35 €), au-delà de 60 %
- **RTX 5080** [prix-rejete] : écart de 92 % à la référence (1550 € -> 2969.82 €), au-delà de 60 %
- **RTX 3060** [prix-rejete] : écart de 157 % à la référence (235 € -> 604 €), au-delà de 60 %
- **RTX 4070 Ti** [prix-rejete] : écart de 69 % à la référence (720 € -> 1215.03 €), au-delà de 60 %
- **RTX 3060 Ti** [prix-rejete] : écart de 61 % à la référence (270 € -> 435.1 €), au-delà de 60 %
- **RTX 3070** [ecart-notable] : appliqué mais écart de 40 % à la référence : relecture humaine conseillée
- **AMD Ryzen 5 3600** [prix-rejete] : écart de 149 % à la référence (58 € -> 144.21 €), au-delà de 60 %
- **RTX 3070 Ti** [prix-rejete] : écart de 96 % à la référence (290 € -> 568.95 €), au-delà de 60 %
- **RTX 3080** [ecart-notable] : appliqué mais écart de 44 % à la référence : relecture humaine conseillée
- **RX 9070 XT** [prix-rejete] : écart de 185 % à la référence (580 € -> 1655.56 €), au-delà de 60 %
- **RTX 3080 Ti** [prix-rejete] : écart de 86 % à la référence (480 € -> 894.1 €), au-delà de 60 %
- **AMD Ryzen 7 3800X** [prix-rejete] : écart de 86 % à la référence (98 € -> 182.7 €), au-delà de 60 %
- **RTX 3050** [prix-rejete] : écart de 108 % à la référence (175 € -> 363.7 €), au-delà de 60 %
- **RX 6600** [ecart-notable] : appliqué mais écart de 37 % à la référence : relecture humaine conseillée
- **RTX 2060** [ecart-notable] : appliqué mais écart de 49 % à la référence : relecture humaine conseillée
- **RX 6600 XT** [ecart-notable] : appliqué mais écart de 55 % à la référence : relecture humaine conseillée
- **RTX 2070** [ecart-notable] : appliqué mais écart de 39 % à la référence : relecture humaine conseillée
- **RTX 3090** [prix-rejete] : écart de 208 % à la référence (900 € -> 2767.82 €), au-delà de 60 %
- **RTX 2070 Super** [prix-rejete] : écart de 65 % à la référence (200 € -> 329.11 €), au-delà de 60 %
- **GTX 1660 Super** [ecart-notable] : appliqué mais écart de 30 % à la référence : relecture humaine conseillée
- **GTX 1660 Ti** [prix-rejete] : écart de 93 % à la référence (108 € -> 208.7 €), au-delà de 60 %
- **RTX 2080** [ecart-notable] : appliqué mais écart de 41 % à la référence : relecture humaine conseillée
- **AMD Ryzen 5 2600X** [ecart-notable] : appliqué mais écart de 39 % à la référence : relecture humaine conseillée
- **AMD Ryzen 7 2700X** [prix-rejete] : écart de 127 % à la référence (48 € -> 109.08 €), au-delà de 60 %
- **Intel Core i5-9400F** [prix-rejete] : écart de 77 % à la référence (45 € -> 79.63 €), au-delà de 60 %
- **Intel Core i7-10700KF** [prix-rejete] : écart de 82 % à la référence (135 € -> 246.15 €), au-delà de 60 %
- **RX 5700 XT** [prix-rejete] : écart de 98 % à la référence (165 € -> 326.95 €), au-delà de 60 %
- **RTX 2080 Ti** [prix-rejete] : écart de 142 % à la référence (280 € -> 677.97 €), au-delà de 60 %
- **Intel Core i3-10100F** [ecart-notable] : appliqué mais écart de 59 % à la référence : relecture humaine conseillée
- **Intel Core i9-9900K** [ecart-notable] : appliqué mais écart de 52 % à la référence : relecture humaine conseillée
- **GTX 1650** [prix-rejete] : écart de 73 % à la référence (115 € -> 199 €), au-delà de 60 %
- **GTX 1070** [prix-rejete] : écart de 183 % à la référence (100 € -> 282.65 €), au-delà de 60 %
- **GTX 1070 Ti** [prix-rejete] : écart de 135 % à la référence (115 € -> 270.61 €), au-delà de 60 %
- **RX 5700** [ecart-notable] : appliqué mais écart de 26 % à la référence : relecture humaine conseillée
- **GTX 1080** [prix-rejete] : écart de 68 % à la référence (140 € -> 234.7 €), au-delà de 60 %
- **GTX 1080 Ti** [prix-rejete] : écart de 94 % à la référence (240 € -> 465.7 €), au-delà de 60 %
- **Intel Core i5-7600K** [ecart-notable] : appliqué mais écart de 29 % à la référence : relecture humaine conseillée
- **Intel Core i3-8100** [ecart-notable] : appliqué mais écart de 39 % à la référence : relecture humaine conseillée
- **GTX 1050 Ti** [ecart-notable] : appliqué mais écart de 35 % à la référence : relecture humaine conseillée
- **RX 580** [ecart-notable] : appliqué mais écart de 48 % à la référence : relecture humaine conseillée
- **RX 590** [prix-rejete] : écart de 60 % à la référence (105 € -> 168.35 €), au-delà de 60 %
- **Intel Core i7-4790K** [prix-rejete] : écart de 92 % à la référence (58 € -> 111.4 €), au-delà de 60 %
- **RX 570** [prix-rejete] : écart de 128 % à la référence (55 € -> 125.5 €), au-delà de 60 %
- **Intel Core i5-4590** [ecart-notable] : appliqué mais écart de 30 % à la référence : relecture humaine conseillée
- **GTX 970** [ecart-notable] : appliqué mais écart de 34 % à la référence : relecture humaine conseillée
- **GTX 960** [ecart-notable] : appliqué mais écart de 49 % à la référence : relecture humaine conseillée
- **GTX 980** [prix-rejete] : écart de 90 % à la référence (55 € -> 104.7 €), au-delà de 60 %
- **GTX 950** [prix-rejete] : écart de 216 % à la référence (50 € -> 157.8 €), au-delà de 60 %
- **GTX 750 Ti** [prix-rejete] : écart de 431 % à la référence (28 € -> 148.78 €), au-delà de 60 %
- **Intel Core i5-2500K** [prix-rejete] : écart de 79 % à la référence (12 € -> 21.5 €), au-delà de 60 %
- **GTX 760** [prix-rejete] : écart de 257 % à la référence (38 € -> 135.52 €), au-delà de 60 %
- **GTX 770** [prix-rejete] : écart de 64 % à la référence (27 € -> 44.38 €), au-delà de 60 %
- **GT 1030** [ecart-notable] : appliqué mais écart de 57 % à la référence : relecture humaine conseillée
- **GTX 780** [prix-rejete] : écart de 100 % à la référence (55 € -> 109.9 €), au-delà de 60 %
- **AMD FX-6300** [ecart-notable] : appliqué mais écart de 41 % à la référence : relecture humaine conseillée
- **GTX 660** [prix-rejete] : écart de 63 % à la référence (25 € -> 40.85 €), au-delà de 60 %
- **GTX 680** [prix-rejete] : écart de 188 % à la référence (36 € -> 103.66 €), au-delà de 60 %
- **R9 270X** [prix-rejete] : écart de 72 % à la référence (27 € -> 46.35 €), au-delà de 60 %
- **GTX 460** [prix-rejete] : écart de 99 % à la référence (15 € -> 29.82 €), au-delà de 60 %
- **GTX 560 Ti** [prix-rejete] : écart de 72 % à la référence (20 € -> 34.32 €), au-delà de 60 %
- **Radeon HD 6870** [ecart-notable] : appliqué mais écart de 37 % à la référence : relecture humaine conseillée
- **ram:ddr3** [prix-rejete] : écart de 211 % à la référence (0.9 € -> 2.8031 €), au-delà de 60 %
- **Intel Core i3-4160** [composant-manquant] : 5 annonce(s), 5 vendeur(s) — seulement 5 annonce(s) (minimum 6)
- **Intel Core i5-8500** [composant-manquant] : 5 annonce(s), 4 vendeur(s) — seulement 5 annonce(s) (minimum 6)
- **GTX 1060** [composant-manquant] : 5 annonce(s), 4 vendeur(s) — variante proche d'un composant déjà au catalogue (« GTX 1060 3Go ») : doublon possible
- **Intel Core i3-4150** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i3-2100** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i7-7700K** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i3-10100** [composant-manquant] : 3 annonce(s), 3 vendeur(s) — seulement 3 annonce(s) (minimum 6)
- **Intel Core i3-3220** [composant-manquant] : 3 annonce(s), 3 vendeur(s) — seulement 3 annonce(s) (minimum 6)
- **Intel Core i3-9100** [composant-manquant] : 3 annonce(s), 3 vendeur(s) — seulement 3 annonce(s) (minimum 6)
- **Intel Core i3-4130** [composant-manquant] : 3 annonce(s), 3 vendeur(s) — seulement 3 annonce(s) (minimum 6)
- **Intel Core i5-9500** [composant-manquant] : 3 annonce(s), 3 vendeur(s) — seulement 3 annonce(s) (minimum 6)
- **Intel Core i5-9400** [composant-manquant] : 3 annonce(s), 3 vendeur(s) — seulement 3 annonce(s) (minimum 6)

## Limites

- Les prix eBay sont des prix DEMANDÉS (annonces actives), jamais des prix de vente constatés.
- Aucune API de fabricant ou de boutique neuve n'est connectée : le prix neuf est le prix demandé eBay (état « Neuf »), indicatif.
- Cartes mères, alimentations, boîtiers et refroidissements ne sont valorisés que par forfait (secondary.ts) : non vérifiables modèle par modèle.
- Les attributs des composants ajoutés (tier, facilité de revente, décote, socket) sont hérités d'un composant voisin et marqués comme estimés.
