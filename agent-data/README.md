# Données de l'agent quotidien

Dossier écrit par `scripts/agent/run.mjs` (voir `docs/AGENT.md`). Ne pas modifier à la main.

| Élément | Rôle |
|---|---|
| `state.json` | Progression par composant (dernière vérification, saut de prix en attente de confirmation, prix neuf indicatif). Sert à la **reprise** et à l'**idempotence**. |
| `reports/AAAA-MM-JJ.json` / `.md` | Rapport du jour (une seule version par jour, réécrite à chaque reprise). |
| `latest.md` | Copie du dernier rapport (affichée dans le résumé du workflow). |
| `history/AAAA-MM.jsonl` | Historique des prix constatés, une ligne par composant et par jour (jamais de doublon). |
| `trigger.txt` | Facultatif : sa modification (push) déclenche le workflow. Écrit chaque matin par la routine cloud Claude. |
