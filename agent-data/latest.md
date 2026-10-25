# Rapport de l'agent quotidien — 2026-10-25

**Statut : Terminé avec avertissements**

- Déclencheur : workflow_dispatch ([exécution](https://github.com/Qlimqx/pc-flip-estimator/actions/runs/40220497799))
- Début : 2026-10-25 19:17 (Paris) · Fin : 2026-10-25 19:17 (Paris) · Durée : 15 s
- Échéance de travail : 2026-10-25 19:42 (Paris) · Terminé avant 10 h (Paris) : NON

## Bilan

| Indicateur | Valeur |
|---|---|
| Composants du catalogue analysés | 210 |
| Prix vérifiés (données reçues) | 0 |
| Prix mis à jour | 0 (dont 0 à relire) |
| En attente de confirmation (saut > 15 %) | 0 |
| Données insuffisantes (valeur conservée) | 0 |
| Rejetés (écart aberrant, valeur conservée) | 0 |
| Source indisponible | 0 |
| Non traités | 0 |
| Composants ajoutés | 0 |
| Composants manquants détectés mais non ajoutés | 12 |
| Prix absents ou obsolètes (> 45 jours) | 88 |
| Anomalies de cohérence | 0 |

## Sources

- **eBay Browse (FR)** : disponible — 0 requêtes, 0 nouvelle(s) tentative(s), 0 échec(s) ; prix demandés d'occasion et neufs
- **Wikipédia (confirmation d'existence)** : utilisée pour les candidats évalués — API de recherche MediaWiki, extraits contenant le modèle exact

## Avertissements

- exécution démarrée après 09:45 (Paris) : la contrainte de fin avant 10 h n'était plus garantie

## Demandes d'ajout (issues « composant-demande »)

- #6 **AMD Ryzen 5 5700** : a-verifier — prix d'occasion inexploitable : 0 annonce(s) valide(s) sur 26 (minimum 4) ; titres vus : « Processeur AMD Ryzen 5 7600 - Socket AM5 - CPU », « Processeur AMD Ryzen 5 2600 - Socket AM4 - CPU », « Processeur AMD Ryzen 5 4650G PRO - Socket AM4 - CPU »

## À vérifier manuellement

- **AMD Ryzen 5 5700** [demande-non-aboutie] : demande #6 : prix d'occasion inexploitable : 0 annonce(s) valide(s) sur 26 (minimum 4) ; titres vus : « Processeur AMD Ryzen 5 7600 - Socket AM5 - CPU », « Processeur AMD Ryzen 5 2600 - Socket AM4 - CPU », « Processeur AMD Ryzen 5 4650G PRO - Socket AM4 - CPU »
- **Intel Core i3-4130** [composant-manquant] : 5 annonce(s), 5 vendeur(s) — seulement 5 annonce(s) (minimum 6)
- **Intel Core i5-6400** [composant-manquant] : 5 annonce(s), 5 vendeur(s) — seulement 5 annonce(s) (minimum 6)
- **GTX 1060** [composant-manquant] : 5 annonce(s), 4 vendeur(s) — variante proche d'un composant déjà au catalogue (« GTX 1060 3Go ») : doublon possible
- **Intel Core i5-6600** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i7-7700** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i7-7700K** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i9-10900** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i9-10900F** [composant-manquant] : 4 annonce(s), 3 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **AMD Ryzen 3 2200G** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **AMD Ryzen 3 1200** [composant-manquant] : 4 annonce(s), 4 vendeur(s) — seulement 4 annonce(s) (minimum 6)
- **Intel Core i3-9100** [composant-manquant] : 3 annonce(s), 3 vendeur(s) — seulement 3 annonce(s) (minimum 6)
- **Intel Core i3-2100** [composant-manquant] : 3 annonce(s), 3 vendeur(s) — seulement 3 annonce(s) (minimum 6)

## Limites

- Les prix eBay sont des prix DEMANDÉS (annonces actives), jamais des prix de vente constatés.
- Aucune API de fabricant ou de boutique neuve n'est connectée : le prix neuf est le prix demandé eBay (état « Neuf »), indicatif.
- Cartes mères, alimentations, boîtiers et refroidissements ne sont valorisés que par forfait (secondary.ts) : non vérifiables modèle par modèle.
- Les attributs des composants ajoutés (tier, facilité de revente, décote, socket) sont hérités d'un composant voisin et marqués comme estimés.
