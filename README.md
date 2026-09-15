# Veille Dashboard

Dashboard web affichant 6 recherches de veille quotidienne, générées automatiquement par un agent Hermes et publiées ici chaque jour.

## Catégories suivies

1. **E-commerce** — tendances et meilleures ventes de la veille
2. **Apps & jeux** — tendances de téléchargement, synergies, thèmes/solutions
3. **Réseaux sociaux** — thèmes les plus vus, mots-clés recherchés
4. **Google Trends** — tendances de recherche et synergies possibles
5. **Idées business** — nouveaux business/produits à faible concurrence répondant à un besoin réel
6. **News IA & Tech** — actualité IA, nouveautés, usages

## Architecture

- `server.js` : petit serveur Express qui sert le front statique (`public/`) et une API JSON lisant les fichiers de `data/`.
- `data/YYYY-MM-DD.json` : un fichier par jour, généré et commité automatiquement par le cronjob de veille (agent Hermes).
- `public/` : front HTML/CSS/JS vanilla, sélecteur de date, une carte par catégorie.

## Format d'un fichier `data/YYYY-MM-DD.json`

```json
{
  "generated_at": "2026-09-15T06:00:00Z",
  "categories": {
    "ecommerce": {
      "summary": "Résumé court de la tendance du jour",
      "items": [
        { "title": "...", "url": "...", "description": "...", "tag": "optionnel" }
      ]
    },
    "apps_jeux": { "summary": "...", "items": [...] },
    "reseaux_sociaux": { "summary": "...", "items": [...] },
    "google_trends": { "summary": "...", "items": [...] },
    "business_ideas": { "summary": "...", "items": [...] },
    "news_ia": { "summary": "...", "items": [...] }
  }
}
```

## Lancer en local

```bash
npm install
npm start
# http://localhost:3000
```

## Déploiement

Déployé sur Railway, connecté à ce repo GitHub — chaque push sur `main` redéploie automatiquement.

## Mise à jour des données

Un cronjob Hermes exécute chaque jour les 6 recherches, écrit un nouveau fichier `data/YYYY-MM-DD.json`, puis `git commit` + `git push` sur ce repo. Railway redéploie automatiquement après le push.
