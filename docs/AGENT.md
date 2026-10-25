# Agent quotidien de vérification des prix et du catalogue

Agent autonome qui, chaque jour, vérifie les prix du catalogue, détecte les composants manquants, contrôle la cohérence des données, enregistre ce qui est validé et publie un rapport — **avant 10 h, heure de Paris**.

> Lisez d'abord [« Ce qui est garanti et ce qui ne l'est pas »](#ce-qui-est-garanti-et-ce-qui-ne-lest-pas).

## Architecture réelle (relevée avant de choisir)

| Élément | Constat |
|---|---|
| Application | SPA statique Vite + React + TypeScript, déployée par Vercel à chaque push sur `main`. Aucun serveur, aucune base de données. |
| « Base de données » | Fichiers versionnés dans Git : `src/data/*.ts` (référence écrite à la main), `src/data/priceOverrides/*.json` (prix rafraîchis), `src/data/agent/*.json` (données de l'agent). |
| Planificateur | **GitHub Actions** (gratuit, accès aux secrets eBay, droit d'écrire dans le dépôt). Vercel Hobby n'offre qu'un cron quotidien à ±59 min près, sans stockage : écarté. |
| Autre automatisme existant | Une routine cloud Claude (`pc-flip-estimator - verification prix quotidienne`, 05:30 UTC) qui vérifie par recherche web et corrige `BASE_CPUS` / `BASE_GPUS`. Elle **coexiste** : l'agent ne modifie jamais `cpus.ts` / `gpus.ts` / `ram.ts` / `storage.ts`, et lit leurs valeurs comme ancrage. |
| Source de prix | API officielle eBay Browse (marketplace `EBAY_FR`), secrets `EBAY_CLIENT_ID` / `EBAY_CLIENT_SECRET` déjà configurés. **Prix demandés** d'annonces actives, jamais des prix de vente. |

## Ce que fait l'agent (ordre d'exécution)

1. Vérifie que les fichiers de données sont lisibles et que la source répond (`ping` OAuth). Sinon : **échec** explicite, aucune donnée modifiée.
2. Charge **tout** le catalogue (CPU + GPU de la base + composants ajoutés par l'agent). Une fiche illisible est signalée, jamais perdue en silence.
3. **Vérifie les prix existants**, par lots, 3 requêtes en parallèle, points de sauvegarde tous les 40 composants. Pour chaque composant : prix d'occasion et prix neuf demandés (catégorie eBay filtrée), filtrage par titre, rejet des PC complets et des mauvaises variantes, filtre statistique, minimum 4 annonces.
4. Mesure les tarifs **RAM** (DDR3/4/5) et **stockage** (HDD, SSD SATA, NVMe) au Go.
5. **Cherche les composants manquants** (voir règles de preuve).
6. **Contrôle la cohérence** : doublons, prix absents / incohérents / obsolètes (> 45 jours), fiches de prix orphelines, correspondance entre les listes du formulaire (capacités RAM/stockage, types) et ce que le catalogue sait valoriser.
7. Écrit les données validées dans **une transaction** (tout ou rien).
8. Produit le rapport, notifie, confirme l'heure de fin.

### Règles de décision sur un prix

Toutes ancrées sur la valeur de **base** (leçon des incidents des 2026-08-26 et 2026-09-27) :

| Situation | Décision |
|---|---|
| Source en panne | Valeur conservée, composant compté « non traité » → statut **partiel** |
| Moins de 4 annonces valides | Valeur conservée (pas une erreur) |
| Écart à la base > 60 % | **Rejeté**, valeur conservée, listé pour relecture humaine (et dans `PRICE_REVIEW.md`, section « Rejetés », lue par la routine IA) |
| Prix d'occasion > prix neuf demandé (neuf jugé plausible) | **Rejeté** |
| Saut > 15 % par rapport à la valeur actuelle | **En attente** : appliqué seulement si le run d'un **autre jour** le confirme à ±15 % |
| Écart à la base > 25 % | Appliqué mais marqué « à relire » |
| Sinon | Appliqué (`dateMaj` = date de collecte) |

### Règles de preuve pour ajouter un composant

Jamais sur une supposition. Il faut **tout** :
- modèle absent du catalogue sous toute graphie (clé normalisée) et pas une variante de capacité d'un composant existant (« GTX 1060 » vs « GTX 1060 6Go » → liste de vérification, jamais d'ajout) ;
- ≥ 6 annonces « composant seul » de ≥ 3 vendeurs distincts ;
- prix d'occasion exploitable (≥ 4 annonces valides) et cohérent avec le prix neuf demandé ;
- confirmation d'existence par une source indépendante (API de recherche Wikipédia, extrait contenant le modèle **exact**) ;
- au plus 5 ajouts par jour.

Les attributs qu'aucune source ne fournit (`tier`, `faciliteRevente`, `decoteAnciennete`, `socket`) sont **hérités d'un composant voisin** et listés dans `agent.attributsEstimes` de la fiche. Tout composant qui échoue à une preuve va dans « À vérifier manuellement » avec la raison exacte. Si un humain ajoute plus tard le même modèle dans `BASE_*`, la copie de l'agent est retirée automatiquement.

### Demander l'ajout d'un composant depuis l'application

Si un processeur ou une carte graphique est absent de la liste (ex. « Ryzen 5 5700 »), le champ de recherche l'indique (« … n'est pas dans la liste ») et propose **Demander son ajout** : un lien ouvre une issue GitHub préremplie (libellé `composant-demande`). Au prochain run, l'agent :

1. lit les issues ouvertes portant ce libellé (**seulement celles du propriétaire / membres / collaborateurs** : le dépôt est public, les demandes d'inconnus sont ignorées) ;
2. reconstruit le nom du modèle par extraction (le texte libre n'est jamais recopié dans les données) ;
3. applique les mêmes preuves que pour la découverte (annonces d'occasion exploitables, cohérence avec le neuf, confirmation indépendante) — seul le minimum d'annonces vues dans la découverte générale est levé, puisque la demande vaut intérêt ;
4. après **publication** des données, commente l'issue et la **ferme** si le composant est ajouté ou déjà présent. Si le modèle n'est pas confirmé, l'issue reste ouverte avec la raison (commentée une seule fois) et l'agent réessaie chaque jour pendant 7 jours, puis ferme avec explication.

Le composant demandé apparaît dans la recherche dès le déploiement qui suit le run (en pratique le matin même).

### Données et idempotence

| Fichier | Rôle |
|---|---|
| `agent-data/state.json` | Progression par composant (`checkedOn`, `lastVerifiedOn`, `lastChangedOn`, saut en attente, prix neuf indicatif). Sert à la reprise. |
| `agent-data/reports/AAAA-MM-JJ.json` / `.md` | Rapport du jour. S'il est **définitif**, toute nouvelle exécution du jour s'arrête aussitôt sans rien écrire. |
| `agent-data/history/AAAA-MM.jsonl` | Historique des prix, une ligne par composant et par jour ; clé `date|composant` → jamais de doublon. |
| `src/data/priceOverrides/{cpu,gpu}Overrides.json` | Prix rafraîchis (même format qu'avant). |
| `src/data/agent/added{Cpus,Gpus}.json` | Composants ajoutés (fusionnés par `cpus.ts` / `gpus.ts` ; la base l'emporte en cas d'identifiant identique). |
| `src/data/agent/{ram,storage}Overrides.json` | Tarifs €/Go rafraîchis (appliqués par `effectiveRates.ts`). |
| `src/data/agent/status.json` | Affiché en pied de page de l'application. |
| `PRICE_REVIEW.md` | Écarts de prix à relire (sections `## AAAA-MM-JJ` / `### Rejetés`), lu par la routine IA. Voir la rotation ci-dessous. |
| `docs/price-review-archive/AAAA-MM.md` | Sections de `PRICE_REVIEW.md` de plus de 30 jours, un fichier par mois. |

Date de collecte (`lastVerifiedOn`, `dateMaj`) et date de dernière modification de valeur (`lastChangedOn`) sont distinguées. Aucun composant n'est supprimé parce qu'il est arrêté.

### Rotation de `PRICE_REVIEW.md`

Trois écrivains y ajoutent des sections (ancien pipeline, routine IA, agent) ; sans rotation il grossit sans fin. À chaque run, l'agent (`scripts/agent/lib/rotate-review.mjs`, dans la même transaction que le reste) :

- déplace les sections **datées de plus de 30 jours** (`## AAAA-MM-JJ…`, tous suffixes confondus) vers `docs/price-review-archive/AAAA-MM.md`, selon le mois de la section ; les sections sans date reconnaissable ne sont jamais déplacées ;
- n'altère aucune section : titres et blocs `### Rejetés` restent tels quels, ordre et fins de ligne (CRLF) conservés ;
- **épingle une copie du `### Rejetés` le plus récent** juste après le préambule, entre `<!-- price-review:rejetes-recent -->` et `<!-- /price-review:rejetes-recent -->` (commentaires invisibles). La routine cloud « verification prix quotidienne » le trouve donc toujours en tête, même si l'agent est resté en panne plus de 30 jours. L'original garde sa place chronologique ; la copie est recalculée à chaque rotation, jamais empilée ;
- ne duplique jamais une section déjà archivée (reprise après interruption sans risque) ;
- reste **non bloquante** : si l'archivage échoue, `PRICE_REVIEW.md` n'est pas touché et le rapport indique un avertissement.

Lancement manuel (simulation d'abord) : `npm run review:rotate -- --dry-run`, puis `npm run review:rotate`. Options : `--keep N` (jours conservés, 30 par défaut) et `--today AAAA-MM-JJ`.

### Statuts

| Statut | Signification |
|---|---|
| `termine` | Tout le catalogue traité, aucun avertissement |
| `termine_avec_avertissements` | Tout traité, mais prix rejetés, anomalies, source partielle, démarrage tardif ou dépassement |
| `partiel` | Une partie n'a **pas** été traitée (échéance, source en panne). Jamais présenté comme terminé. Le déclencheur suivant reprend. |
| `echec` | Source inaccessible, catalogue illisible ou écriture impossible |

## Tenir l'échéance de 10 h

Un planificateur seul ne peut pas la garantir. Mesures :

- **Échéance de travail 09:45 (Paris, heure d'été/hiver gérée par `Intl`)** et durée maximale 40 min : au-delà de `échéance − 8 min`, plus de nouvelle vérification ; RAM/stockage et découverte s'arrêtent avant l'échéance ; l'écriture finale se fait dans la marge.
- **Un run démarré après 09:45** est signalé (« hors fenêtre ») et ne peut pas être « terminé » sans avertissement. Un run qui finit après 10:00 est marqué **DÉPASSEMENT**.
- **Quatre sources de déclenchement** :
  1. `schedule` GitHub à 05:23, 06:47 et 08:13 **heure de Paris** (champ `timezone: Europe/Paris`), minutes hors pointe ;
  2. un `push` de `agent-data/trigger.txt`, écrit chaque jour à 05:00 UTC (07:00 l'été / 06:00 l'hiver à Paris) par la routine cloud Claude `pc-flip-estimator - declencheur agent prix` — une **horloge externe** à GitHub ;
  3. le lancement manuel (`workflow_dispatch`) ;
  4. le **chien de garde** (`agent-watchdog.yml`, 10:07 et 11:37 Paris) qui, si rien n'est terminé à 10 h, ouvre une issue `agent-alerte` et relance l'agent.
- Le premier déclencheur qui passe fait le travail ; les suivants s'arrêtent (« déjà fait »). Le groupe `concurrency: daily-agent` interdit deux exécutions simultanées sans jamais en interrompre une en cours.

### Ce qui est garanti et ce qui ne l'est pas

- **Garanti par le code et testé** : idempotence, reprise, pas d'écriture partielle, aucune donnée de base modifiée, rejet des valeurs aberrantes, statut honnête, détection et signalement du dépassement.
- **Non garanti** : l'heure à laquelle GitHub **démarre** un `schedule`. Sur ce dépôt, l'ancien cron de 04:00 UTC démarrait en médiane ~5 h plus tard (jusqu'à ~12 h, mesuré sur l'historique des runs) ; aujourd'hui (2026-10-23) il a démarré à 09:00 UTC = 11:00 Paris. C'est pourquoi l'horloge externe (routine cloud, observée ponctuelle à ±5 min) et le chien de garde existent. Aucun de ces mécanismes ne *prouve* l'heure de fin d'une exécution future : seule l'observation des rapports quotidiens (`finishedBeforeTenParis`) le fait.

## Lancement manuel

- **Simulation** (appelle eBay, n'écrit rien, affiche le rapport dans les journaux) : onglet *Actions* → *Agent quotidien* → *Run workflow* → cocher `dry_run`. Ou en ligne de commande : `gh workflow run daily-agent.yml -f dry_run=true`.
- **Réel** : même chose sans `dry_run`. Option `force` pour refaire un jour déjà terminé.
- **En local** : définir `EBAY_CLIENT_ID` et `EBAY_CLIENT_SECRET`, puis `npm run agent:dry-run` ou `npm run agent`.

## Configuration

| Variable | Où | Rôle |
|---|---|---|
| `EBAY_CLIENT_ID`, `EBAY_CLIENT_SECRET` | Secrets GitHub (déjà présents) | Accès API eBay |
| `AGENT_WEBHOOK_URL` | Secret GitHub, **facultatif** | Webhook entrant (Discord, Slack, ntfy…) recevant un résumé à chaque run. Absent = pas de notification externe. |
| `AGENT_WINDOW_END` | Variable d'environnement | Échéance de travail `HH:MM` Paris (défaut `09:45`) |
| `AGENT_MAX_MINUTES` | Variable d'environnement | Durée maximale (défaut `40`) |

Aucun secret dans le code ni dans les journaux. Notifications gratuites déjà actives : issues GitHub `agent-alerte` (échec, partiel, dépassement) et `price-review` (rappel hebdomadaire du lundi).

## Dépannage

| Symptôme | Cause probable / action |
|---|---|
| Issue « Agent prix … : Échec » | Lire `agent-data/reports/AAAA-MM-JJ.md` (rubrique *Erreurs*). Authentification eBay refusée : vérifier les secrets. |
| Issue « Partiel » | Source en panne ou échéance atteinte. Rien à faire : le déclencheur suivant reprend. Relancer à la main si urgent. |
| Issue « aucune exécution terminée à 10 h » | Les `schedule` GitHub n'ont pas démarré à temps *et* la routine cloud n'a pas poussé. Vérifier la routine sur https://claude.ai/code/routines et l'onglet *Actions*. |
| Beaucoup de « Rejetés » | Normal : les prix demandés eBay s'écartent souvent de la référence. La routine IA les vérifie. Ne pas forcer les valeurs. |
| Publication refusée (« Valider… ») | `npm test` ou `npm run build` échoue avec les nouvelles données : rien n'est publié. Ouvrir les journaux du run. |
| Retour en arrière | Chaque run publie un artefact `sauvegarde-avant-agent-<id>` (14 jours) et un commit Git revertable. |
| Désactiver l'agent | *Actions* → *Agent quotidien* → *Disable workflow* ; désactiver aussi la routine cloud. |

## Tests

`npm test` (vitest) : 100+ tests, aucun accès réseau réel (fausse API eBay, faux dépôt temporaire, horloge contrôlée). Ils couvrent : heure de Paris et changements d'heure, configuration des workflows (fuseau, redondance, concurrence, validation avant publication), mise à jour normale, détection et refus d'ajout de composants, doublons, sources indisponibles et disjoncteur, prix aberrants et sauts en attente, panne d'écriture avec restauration, reprise après interruption, idempotence, verrou anti-exécution simultanée, rapport, notification, chien de garde. **Ce qu'ils ne prouvent pas** : le démarrage à l'heure d'un `schedule` GitHub (voir ci-dessus) et la qualité des prix eBay.

## Limites connues

- Prix = annonces **demandées** eBay. Aucun prix de vente constaté, aucune API fabricant ou boutique : le « prix neuf » est le prix neuf demandé eBay (indicatif, jamais affiché comme référence).
- Cartes mères, alimentations, boîtiers et refroidissements : forfaits (`secondary.ts`), non vérifiables modèle par modèle.
- Une grande partie du catalogue reste en « données insuffisantes » (pas assez d'annonces fiables) : sa valeur est conservée et sa date de mise à jour vieillit — visible dans le rapport (« prix absents ou obsolètes »).
- Les attributs des composants ajoutés sont estimés par voisinage.
- Le saut de prix de plus de 15 % n'est pris en compte qu'au bout de deux jours (volontaire).
