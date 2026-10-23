# pc-flip-estimator

Estime la rentabilité d'un PC destiné à l'achat-revente sur le marché de
l'occasion en France : prix de revente estimé, prix d'achat conseillé,
marge, verdict (TRÈS BONNE AFFAIRE / BONNE AFFAIRE / MARGE FAIBLE / TROP
CHER / À ÉVITER). React + TypeScript + Vite + Tailwind, 100% statique
(aucun backend, calcul et autocomplétion en local dans le navigateur,
historique en IndexedDB).

## Développement

```bash
npm install
npm run dev
```

```bash
npm test          # tests du moteur de calcul (Vitest)
npm run build     # build de production
```

## Données composants

`src/data/cpus.ts` et `src/data/gpus.ts` contiennent la base de prix
occasion (~99 CPU, ~109 GPU couvrant le desktop grand public de 2011 à
aujourd'hui). Chaque entrée : prix occasion min/moyen/max, décote liée à
l'ancienneté, facilité de revente, date de dernière mise à jour. Voir les
commentaires en tête de ces fichiers pour la méthodologie de calibrage et
ses limites connues.

`src/data/ram.ts` et `src/data/storage.ts` utilisent un tarif €/Go par type
plutôt qu'une fiche par capacité.

## Mise à jour automatique des prix

Un **agent quotidien** (`scripts/agent/`, workflow
`.github/workflows/daily-agent.yml`) vérifie chaque jour les prix du
catalogue via l'API eBay Browse, mesure les tarifs RAM/stockage, détecte les
composants manquants (ajout automatique seulement sur preuves multiples),
contrôle la cohérence des données et publie un rapport
(`agent-data/reports/`). Il doit avoir terminé avant 10 h, heure de Paris :
déclencheurs redondants, reprise après interruption, chien de garde.
**Tout est décrit dans [`docs/AGENT.md`](docs/AGENT.md)** (fonctionnement,
garanties et limites, lancement manuel, dépannage).

Les prix rafraîchis sont écrits dans `src/data/priceOverrides/{cpu,gpu}Overrides.json`
-- fusionnés par-dessus la donnée de base (`BASE_CPUS`/`BASE_GPUS`) à
l'import, sans jamais modifier la donnée écrite/vérifiée à la main. Le commit
automatique déclenche un redéploiement Vercel. Garde-fous : rejet des
annonces aberrantes avant calcul, ancrage sur la donnée de base (rejet > 60 %,
relecture > 25 %), saut de prix confirmé sur deux jours, écriture
transactionnelle. L'ancien pipeline (`scripts/update-prices.mjs`) reste
disponible en lancement manuel uniquement.

### Configuration requise

1. Crée un compte développeur sur [developer.ebay.com](https://developer.ebay.com/)
   (gratuit) et récupère un **App ID (Client ID)** et un **Cert ID (Client
   Secret)** en mode Production.
2. Dans les paramètres du repo GitHub : Settings → Secrets and variables →
   Actions → New repository secret, ajoute `EBAY_CLIENT_ID` et
   `EBAY_CLIENT_SECRET`.
3. Le workflow tourne automatiquement à partir de là. Pour un déclenchement
   manuel immédiat : onglet Actions → "Agent quotidien (prix et catalogue)" →
   Run workflow (case `dry_run` pour une simulation sans écriture).

Sans ces secrets configurés, le job échoue proprement (message d'erreur
explicite) sans toucher aux données existantes -- l'appli continue de
fonctionner avec la dernière donnée connue.

## Déploiement

Connecté à [Vercel](https://vercel.com/) via GitHub -- chaque push sur
`main` (manuel ou via le job de mise à jour des prix) redéploie
automatiquement.
