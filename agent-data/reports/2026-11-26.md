# Rapport de l'agent quotidien — 2026-11-26

**Statut : Terminé avec avertissements**

- Déclencheur : push ([exécution](https://github.com/Qlimqx/pc-flip-estimator/actions/runs/45765694977))
- Début : 2026-11-26 07:04 (Paris) · Fin : 2026-11-26 07:06 (Paris) · Durée : 104 s
- Échéance de travail : 2026-11-26 07:44 (Paris) · Terminé avant 10 h (Paris) : oui

## Bilan

| Indicateur | Valeur |
|---|---|
| Composants du catalogue analysés | 215 |
| Prix vérifiés (données reçues) | 96 |
| Prix mis à jour | 55 (dont 33 à relire) |
| En attente de confirmation (saut > 15 %) | 3 |
| Données insuffisantes (valeur conservée) | 119 |
| Rejetés (écart aberrant, valeur conservée) | 39 |
| Source indisponible | 0 |
| Non traités | 0 |
| Composants ajoutés | 0 |
| Composants manquants détectés mais non ajoutés | 12 |
| Prix absents ou obsolètes (> 45 jours) | 74 |
| Anomalies de cohérence | 0 |

## Sources

- **eBay Browse (FR)** : disponible — 430 requêtes, 0 nouvelle(s) tentative(s), 0 échec(s) ; prix demandés d'occasion et neufs
- **Wikipédia (confirmation d'existence)** : utilisée pour les candidats évalués — API de recherche MediaWiki, extraits contenant le modèle exact

## Avertissements

- 39 prix rejeté(s) comme aberrants (valeur conservée)

## RAM et stockage (€/Go)

- **ram:ddr3** : rejete (mesuré 3.0981 €/Go, 22 annonces) — écart de 138 % à la référence (1.3 € -> 3.0981 €), au-delà de 60 %
- **ram:ddr4** : en-attente-confirmation (mesuré 6.4156 €/Go, 9 annonces) — saut de 22 % (5.26 € -> 6.4156 €) : appliqué seulement s'il est confirmé au prochain run
- **ram:ddr5** : donnees-insuffisantes — moins de 4 annonces valides après filtrage : valeur conservée
- **stockage:hdd** : mis-a-jour (mesuré 0.0283 €/Go, 33 annonces) — appliqué
- **stockage:ssd** : mis-a-jour-a-verifier (mesuré 0.1572 €/Go, 61 annonces) — appliqué mais écart de 37 % à la référence : relecture humaine conseillée
- **stockage:nvme** : mis-a-jour-a-verifier (mesuré 0.1301 €/Go, 36 annonces) — appliqué mais écart de 37 % à la référence : relecture humaine conseillée

## À vérifier manuellement

- **RTX 4070 Super** [prix-rejete] : écart de 62 % à la référence (610 € -> 989.69 €), au-delà de 60 %
- **RTX 5060 Ti** [ecart-notable] : appliqué mais écart de 25 % à la référence : relecture humaine conseillée
- **RTX 5080** [prix-rejete] : écart de 104 % à la référence (1550 € -> 3163.37 €), au-delà de 60 %
- **RTX 5090** [ecart-notable] : appliqué mais écart de 57 % à la référence : relecture humaine conseillée
- **RTX 3060** [prix-rejete] : écart de 177 % à la référence (260 € -> 720.7 €), au-delà de 60 %
- **RTX 4070 Ti** [ecart-notable] : appliqué mais écart de 58 % à la référence : relecture humaine conseillée
- **RTX 3060 Ti** [ecart-notable] : appliqué mais écart de 55 % à la référence : relecture humaine conseillée
- **RTX 3070** [ecart-notable] : appliqué mais écart de 56 % à la référence : relecture humaine conseillée
- **AMD Ryzen 5 3600** [prix-rejete] : écart de 85 % à la référence (58 € -> 107.43 €), au-delà de 60 %
- **RTX 3070 Ti** [prix-rejete] : écart de 145 % à la référence (320 € -> 785.25 €), au-delà de 60 %
- **RTX 3080** [ecart-notable] : appliqué mais écart de 44 % à la référence : relecture humaine conseillée
- **RX 9070 XT** [prix-rejete] : écart de 169 % à la référence (660 € -> 1774.45 €), au-delà de 60 %
- **RTX 3080 Ti** [prix-rejete] : écart de 82 % à la référence (480 € -> 871.55 €), au-delà de 60 %
- **AMD Ryzen 7 3800X** [prix-rejete] : écart de 124 % à la référence (85 € -> 189.98 €), au-delà de 60 %
- **AMD Ryzen 9 7950X** [ecart-notable] : appliqué mais écart de 54 % à la référence : relecture humaine conseillée
- **RTX 3050** [prix-rejete] : écart de 108 % à la référence (175 € -> 363.7 €), au-delà de 60 %
- **RX 6600** [ecart-notable] : appliqué mais écart de 35 % à la référence : relecture humaine conseillée
- **RX 7600** [prix-rejete] : écart de 110 % à la référence (230 € -> 483.18 €), au-delà de 60 %
- **RTX 2060** [ecart-notable] : appliqué mais écart de 55 % à la référence : relecture humaine conseillée
- **RX 6600 XT** [ecart-notable] : appliqué mais écart de 47 % à la référence : relecture humaine conseillée
- **RX 6700 XT** [ecart-notable] : appliqué mais écart de 32 % à la référence : relecture humaine conseillée
- **RTX 3090** [prix-rejete] : écart de 159 % à la référence (950 € -> 2461.69 €), au-delà de 60 %
- **RTX 2070** [ecart-notable] : appliqué mais écart de 34 % à la référence : relecture humaine conseillée
- **RTX 2070 Super** [prix-rejete] : écart de 75 % à la référence (200 € -> 349.86 €), au-delà de 60 %
- **GTX 1660 Super** [ecart-notable] : appliqué mais écart de 39 % à la référence : relecture humaine conseillée
- **RTX 2080** [ecart-notable] : appliqué mais écart de 41 % à la référence : relecture humaine conseillée
- **GTX 1660 Ti** [prix-rejete] : écart de 184 % à la référence (108 € -> 307.1 €), au-delà de 60 %
- **AMD Ryzen 5 2600** [prix-rejete] : écart de 113 % à la référence (46 € -> 98.02 €), au-delà de 60 %
- **AMD Ryzen 5 2600X** [prix-rejete] : écart de 73 % à la référence (52 € -> 90 €), au-delà de 60 %
- **AMD Ryzen 3 3200G** [ecart-notable] : appliqué mais écart de 27 % à la référence : relecture humaine conseillée
- **AMD Ryzen 7 2700X** [prix-rejete] : écart de 127 % à la référence (48 € -> 109.08 €), au-delà de 60 %
- **Intel Core i5-9400F** [prix-rejete] : écart de 77 % à la référence (45 € -> 79.63 €), au-delà de 60 %
- **Intel Core i7-10700KF** [ecart-notable] : appliqué mais écart de 41 % à la référence : relecture humaine conseillée
- **RX 5700 XT** [prix-rejete] : écart de 102 % à la référence (165 € -> 333.1 €), au-delà de 60 %
- **RTX 2080 Ti** [prix-rejete] : écart de 140 % à la référence (300 € -> 720.7 €), au-delà de 60 %
- **Intel Core i3-10100F** [ecart-notable] : appliqué mais écart de 59 % à la référence : relecture humaine conseillée
- **Intel Core i7-9700K** [ecart-notable] : appliqué mais écart de 50 % à la référence : relecture humaine conseillée
- **GTX 1650** [prix-rejete] : écart de 73 % à la référence (115 € -> 198.48 €), au-delà de 60 %
- **GTX 1650 Super** [ecart-notable] : appliqué mais écart de 43 % à la référence : relecture humaine conseillée
- **GTX 1070** [prix-rejete] : écart de 174 % à la référence (88 € -> 240.97 €), au-delà de 60 %
- **GTX 1070 Ti** [prix-rejete] : écart de 243 % à la référence (98 € -> 335.78 €), au-delà de 60 %
- **RX 5700** [prix-rejete] : écart de 75 % à la référence (145 € -> 253.15 €), au-delà de 60 %
- **GTX 1080** [prix-rejete] : écart de 83 % à la référence (122 € -> 223.03 €), au-delà de 60 %
- **GTX 1080 Ti** [prix-rejete] : écart de 141 % à la référence (180 € -> 434.58 €), au-delà de 60 %
- **Intel Core i5-7600K** [ecart-notable] : appliqué mais écart de 29 % à la référence : relecture humaine conseillée
- **Intel Core i3-9100F** [ecart-notable] : appliqué mais écart de 29 % à la référence : relecture humaine conseillée
- **Intel Core i3-8100** [ecart-notable] : appliqué mais écart de 39 % à la référence : relecture humaine conseillée
- **GTX 1050 Ti** [ecart-notable] : appliqué mais écart de 35 % à la référence : relecture humaine conseillée
- **RX 580** [prix-rejete] : écart de 69 % à la référence (85 € -> 143.7 €), au-delà de 60 %
- **RX 590** [prix-rejete] : écart de 84 % à la référence (105 € -> 192.85 €), au-delà de 60 %
- **RX 570** [prix-rejete] : écart de 64 % à la référence (65 € -> 106.85 €), au-delà de 60 %
- **Intel Core i5-4460** [ecart-notable] : appliqué mais écart de 30 % à la référence : relecture humaine conseillée
- **Intel Core i5-4590** [ecart-notable] : appliqué mais écart de 28 % à la référence : relecture humaine conseillée
- **GTX 970** [ecart-notable] : appliqué mais écart de 34 % à la référence : relecture humaine conseillée
- **GTX 980** [prix-rejete] : écart de 245 % à la référence (42 € -> 144.74 €), au-delà de 60 %
- **GTX 960** [prix-rejete] : écart de 198 % à la référence (42 € -> 124.98 €), au-delà de 60 %
- **Intel Core i7-3770K** [ecart-notable] : appliqué mais écart de 41 % à la référence : relecture humaine conseillée
- **Intel Core i7-6700** [prix-rejete] : écart de 143 % à la référence (47 € -> 114.31 €), au-delà de 60 %
- **GTX 750 Ti** [prix-rejete] : écart de 490 % à la référence (28 € -> 165.19 €), au-delà de 60 %
- **Intel Core i5-3570K** [prix-rejete] : écart de 176 % à la référence (30 € -> 82.7 €), au-delà de 60 %
- **Intel Core i3-4160** [ecart-notable] : appliqué mais écart de 27 % à la référence : relecture humaine conseillée
- **GTX 770** [ecart-notable] : appliqué mais écart de 48 % à la référence : relecture humaine conseillée
- **GTX 760** [prix-rejete] : écart de 244 % à la référence (38 € -> 130.7 €), au-delà de 60 %
- **GT 1030** [ecart-notable] : appliqué mais écart de 48 % à la référence : relecture humaine conseillée
- **AMD FX-6300** [ecart-notable] : appliqué mais écart de 41 % à la référence : relecture humaine conseillée
- **GTX 660** [prix-rejete] : écart de 63 % à la référence (25 € -> 40.85 €), au-delà de 60 %
- **GTX 680** [prix-rejete] : écart de 261 % à la référence (36 € -> 129.8 €), au-delà de 60 %
- **R9 270X** [prix-rejete] : écart de 72 % à la référence (27 € -> 46.35 €), au-delà de 60 %
- **GTX 460** [ecart-notable] : appliqué mais écart de 36 % à la référence : relecture humaine conseillée
- **GTX 560 Ti** [prix-rejete] : écart de 72 % à la référence (20 € -> 34.32 €), au-delà de 60 %
- **Radeon HD 7870** [ecart-notable] : appliqué mais écart de 37 % à la référence : relecture humaine conseillée
- **ram:ddr3** [prix-rejete] : écart de 138 % à la référence (1.3 € -> 3.0981 €), au-delà de 60 %
- **Intel Core i5-9500** [composant-manquant] : 5 annonce(s), 4 vendeur(s) — seulement 5 annonce(s) (minimum 6)
- **GTX 1060** [composant-manquant] : 5 annonce(s), 5 vendeur(s) — variante proche d'un composant déjà au catalogue (« GTX 1060 3Go ») : doublon possible
- **Intel Core i3-2100** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i3-4130** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i7-7700K** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i7-4770** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i9-10900** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **GTX 260** [composant-manquant] : 4 annonce(s), 3 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i3-4150** [composant-manquant] : 3 annonce(s), 3 vendeur(s) — seulement 3 annonce(s) (minimum 6)
- **Intel Core i3-3220** [composant-manquant] : 3 annonce(s), 3 vendeur(s) — seulement 3 annonce(s) (minimum 6)
- **Intel Core i3-3240** [composant-manquant] : 3 annonce(s), 3 vendeur(s) — seulement 3 annonce(s) (minimum 6)
- **Intel Core i5-7400** [composant-manquant] : 3 annonce(s), 3 vendeur(s) — seulement 3 annonce(s) (minimum 6)

## Limites

- Les prix eBay sont des prix DEMANDÉS (annonces actives), jamais des prix de vente constatés.
- Aucune API de fabricant ou de boutique neuve n'est connectée : le prix neuf est le prix demandé eBay (état « Neuf »), indicatif.
- Cartes mères, alimentations, boîtiers et refroidissements ne sont valorisés que par forfait (secondary.ts) : non vérifiables modèle par modèle.
- Les attributs des composants ajoutés (tier, facilité de revente, décote, socket) sont hérités d'un composant voisin et marqués comme estimés.
