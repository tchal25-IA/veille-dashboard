# Veille Dashboard

Dashboard de veille quotidienne générant automatiquement chaque jour une analyse enrichie sur 6 thèmes clés.

## 🎯 Fonctionnalités

- **Analyse quotidienne automatique** : Génération chaque jour à 7h00 UTC
- **Analyse rédigée en français** : 2-3 paragraphes synthétisant les tendances par thème
- **Chiffres clés** : 3-5 métriques avec labels et valeurs identifiés à partir du contenu
- **Articles traduits** : 4-6 articles avec :
  - Titre traduit en français
  - Titre original
  - URL source
  - Description traduite en français
  - Source (domaine)
  - Langue originale

## 📊 Thèmes couverts

1. **ecommerce** - Tendances e-commerce & meilleures ventes
2. **apps_jeux** - Apps & jeux tendance
3. **reseaux_sociaux** - Tendances réseaux sociaux
4. **google_trends** - Google Trends & synergies
5. **business_ideas** - Nouvelles idées business
6. **news_ia** - News IA & Tech

## 🏗️ Architecture

```
veille-dashboard/
├── server.js              # Express server (produit les APIs)
├── cron.js               # Cronjob de génération quotidienne
├── public/
│   ├── index.html        # Interface web
│   ├── app.js            # Logique frontend
│   └── style.css         # Styling
├── data/
│   └── YYYY-MM-DD.json   # Données quotidiennes (auto-générées)
└── .github/workflows/
    └── daily-veille.yml  # GitHub Actions (7h UTC chaque jour)
```

## 🚀 Déploiement

### Sur Railway
Le projet est auto-déployé via Railway :
- **Build** : Node.js (Nixpacks)
- **Start** : `node server.js`
- **Port** : 3000

Le push sur GitHub déclenche automatiquement le redéploiement.

### Cronjob quotidien
- **Fréquence** : Chaque jour à 7h00 UTC
- **Déclencheur** : GitHub Actions (`.github/workflows/daily-veille.yml`)
- **Exécution** : 
  1. Clone du repo
  2. Installation des dépendances
  3. Exécution de `cron.js`
  4. Commit et push automatique

## 📝 Format des données

Chaque fichier `data/YYYY-MM-DD.json` contient :

```json
{
  "generated_at": "2026-09-21T07:00:00Z",
  "categories": {
    "ecommerce": {
      "summary": "Analyse rédigée en français...",
      "key_figures": [
        { "label": "Métrique", "value": "valeur" }
      ],
      "items": [
        {
          "title_fr": "Titre traduit en français",
          "title_original": "Original title",
          "url": "https://...",
          "description_fr": "Description traduite en français",
          "source": "domaine.com",
          "lang": "en"
        }
      ]
    }
  }
}
```

## 🔌 API

### GET `/api/latest`
Retourne les données de la veille la plus récente.

```bash
curl https://veille-dashboard-production.up.railway.app/api/latest
```

### GET `/api/dates`
Liste toutes les dates disponibles (format YYYY-MM-DD).

```bash
curl https://veille-dashboard-production.up.railway.app/api/dates
```

### GET `/api/day/:date`
Retourne les données pour une date spécifique.

```bash
curl https://veille-dashboard-production.up.railway.app/api/day/2026-09-21
```

## 🎨 Frontend

Le dashboard affiche pour chaque catégorie :
1. **Titre** avec l'emoji de la catégorie
2. **Analyse** - Synthèse professionnelle en français
3. **Chiffres clés** - Métriques avec labels et valeurs
4. **Articles** - Liste avec titre FR, description FR, source, et lien

Sélecteur de date pour consulter les archives.

## 🔧 Développement local

```bash
# Installation
npm install

# Serveur (produit les APIs)
npm start

# Dashboard
Ouvrir http://localhost:3000

# Générer les données de test (optionnel)
node cron.js 2026-09-21
```

## 🤖 Intégration Hermes

En environnement Hermes, le cronjob utilise :
- **web_search** : Recherche d'articles
- **web_extract** : Extraction de contenu
- **Claude API** : Traduction et génération d'analyse

En standalone, utilise des données fallback réalistes pour les tests.

## 📈 Monitoring

- Vérifier les exécutions : GitHub Actions → Workflows → "Daily Veille Generation"
- Vérifier le déploiement : Railway dashboard
- Vérifier les données : `curl https://veille-dashboard-production.up.railway.app/api/latest`

## ✅ Checklist de succès

- [x] Cronjob génère les données automatiquement chaque jour à 7h UTC
- [x] Analyse rédigée en français (2-3 paragraphes par thème)
- [x] 3-5 chiffres clés par catégorie avec labels
- [x] 4-6 articles avec titres et descriptions traduits en français
- [x] URLs sources préservées (vraies sources, pas des résumés)
- [x] Structure JSON conforme au format spécifié
- [x] Git commit et push automatiques sur Railway
- [x] Dashboard affiche correctement les données enrichies

## 📄 License

MIT
