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

Un job GitHub Actions (`.github/workflows/update-prices.yml`) interroge
l'API eBay Browse chaque nuit à 4h UTC et rafraîchit les prix dans
`src/data/priceOverrides/{cpu,gpu}Overrides.json` -- ces fichiers sont
fusionnés par-dessus la donnée de base (`BASE_CPUS`/`BASE_GPUS`) au moment
de l'import, sans jamais modifier la donnée écrite/vérifiée à la main. Le
commit automatique déclenche un redéploiement Vercel (repo connecté).

Garde-fous contre une automatisation qui corromprait la base silencieusement
(voir `scripts/update-prices.mjs` pour le détail) : rejet des annonces
aberrantes avant calcul, minimum d'annonces valides exigé (sinon la fiche
n'est pas touchée ce jour-là), et tout écart de prix moyen > 25% par rapport
à la veille est consigné dans `PRICE_REVIEW.md` pour relecture humaine. Un
second job hebdomadaire (le lundi) ouvre une issue GitHub rappelant de
relire ces écarts -- l'automatisation rafraîchit les chiffres, elle ne
remplace pas un contrôle humain périodique.

### Configuration requise

1. Crée un compte développeur sur [developer.ebay.com](https://developer.ebay.com/)
   (gratuit) et récupère un **App ID (Client ID)** et un **Cert ID (Client
   Secret)** en mode Production.
2. Dans les paramètres du repo GitHub : Settings → Secrets and variables →
   Actions → New repository secret, ajoute `EBAY_CLIENT_ID` et
   `EBAY_CLIENT_SECRET`.
3. Le workflow tourne automatiquement à partir de là. Pour un déclenchement
   manuel immédiat : onglet Actions → "Mise à jour quotidienne des prix" →
   Run workflow.

Sans ces secrets configurés, le job échoue proprement (message d'erreur
explicite) sans toucher aux données existantes -- l'appli continue de
fonctionner avec la dernière donnée connue.

## Déploiement

Connecté à [Vercel](https://vercel.com/) via GitHub -- chaque push sur
`main` (manuel ou via le job de mise à jour des prix) redéploie
automatiquement.
