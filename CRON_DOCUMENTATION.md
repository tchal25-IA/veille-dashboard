# Cronjob Veille - Documentation Technique

## 🎯 Vue d'ensemble

Le cronjob `cron.js` génère automatiquement chaque jour une veille richement documentée avec :
- Analyse synthétique en français (2-3 paragraphes par thème)
- 3-5 chiffres clés avec labels et valeurs
- 4-6 articles avec traductions en français
- Commit et push automatiques vers GitHub

## ⏰ Planification

### GitHub Actions (Production)
**Fichier** : `.github/workflows/daily-veille.yml`
**Horaire** : 7:00 AM UTC chaque jour
**Déclencheur** : `cron: '0 7 * * *'` (cron POSIX standard)

```yaml
on:
  schedule:
    - cron: '0 7 * * *'  # Chaque jour à 7h UTC
  workflow_dispatch      # Exécution manuelle possible
```

### Exécution en local
```bash
# Générer la veille d'aujourd'hui
node cron.js

# Générer la veille d'une date spécifique
node cron.js 2026-09-22
```

## 🔧 Architecture

### Flux d'exécution

```
┌─────────────────────┐
│  GitHub Actions     │ (7h UTC chaque jour)
│  ou exécution local │
└──────────┬──────────┘
           │
           ▼
    ┌──────────────────┐
    │   cron.js start  │
    └──────────┬───────┘
               │
       ┌───────▼────────┐
       │  Pour chaque   │
       │  catégorie:    │
       │                │
       │ 1. Rechercher  │ ◄──────────────┐
       │    articles    │                │
       │ 2. Extraire    │                │
       │    contenu     │ ┌──────────────┤
       │ 3. Traduire    │ │  En mode     │
       │    en français │ │  Hermes:     │
       │ 4. Générer     │ │ - web_search │
       │    analyse     │ │ - web_extract│
       │ 5. Métriques   │ │ - Claude API │
       └───────┬────────┘ │              │
               │          │ En mode      │
               │          │ standalone:  │
               │          │ - Fallback   │
               │          │ - Mock data  │
               │          └──────────────┘
               │
       ┌───────▼────────┐
       │  Générer JSON  │
       │ YYYY-MM-DD.json│
       └───────┬────────┘
               │
       ┌───────▼────────┐
       │ Git commit +   │
       │ push GitHub    │
       └───────┬────────┘
               │
       ┌───────▼────────┐
       │  Railway auto- │
       │  déploiement   │
       └────────────────┘
```

## 📊 Structure des données

### Input : Données par catégorie
```javascript
{
  category: 'ecommerce',
  articles: [
    {
      url: 'https://...',
      title: 'E-commerce Statistics 2024',
      description: 'Market analysis showing...',
      lang: 'en'
    },
    // ... 5 autres articles
  ]
}
```

### Output : JSON enrichi
```json
{
  "generated_at": "2026-09-22T07:00:00Z",
  "categories": {
    "ecommerce": {
      "summary": "Le e-commerce mondial continue sa croissance...",
      "key_figures": [
        { "label": "Marché e-commerce mondial 2024", "value": "6,8 billions $" },
        { "label": "Taux de croissance annuel", "value": "+7-8%" }
      ],
      "items": [
        {
          "title_fr": "Statistiques e-commerce 2024",
          "title_original": "E-commerce Statistics 2024",
          "url": "https://...",
          "description_fr": "Analyse du marché avec données...",
          "source": "example.com",
          "lang": "en"
        }
      ]
    }
  }
}
```

## 🤖 Mode d'opération

### Mode Hermes (Production)
Quand exécuté depuis Hermes avec les outils disponibles :

```javascript
// Recherche d'articles via Hermes web_search
const articles = await callHermesWebSearch(query, limit=3)

// Extraction de contenu réel
const extracted = await callHermesWebExtract(urls)

// Traduction via Claude API
const title_fr = await callClaude(`Traduis: "${title}"`)

// Analyse synthétique
const analysis = await callClaude(`Écris une analyse en français...`)
```

### Mode Standalone (Fallback)
En environnement sans Hermes ou en développement :

```javascript
// Utilise une base de données fallback réaliste
const articles = FALLBACK_ARTICLES[category]

// Templates d'analyses en français pré-rédigées
const summary = summaries[category]

// Chiffres clés template par catégorie
const keyFigures = keyFigureTemplates[category]
```

## 🔌 Intégration Hermes

### Wrapper Python
**Fichier** : `hermes-wrapper.py`

Fournit une interface Python pour accéder aux outils Hermes depuis Node.js :

```bash
# Recherche
python3 hermes-wrapper.py search "query" 3

# Extraction
python3 hermes-wrapper.py extract '["url1", "url2"]'

# Traduction
python3 hermes-wrapper.py translate "English text"

# Analyse
python3 hermes-wrapper.py analyze "category" "content"
```

## 📈 Catégories surveillées

| Catégorie | Label | Analyses | Chiffres |
|-----------|-------|----------|---------|
| ecommerce | 🛒 Tendances e-commerce | Croissance, IA, micro-niches | Marché, croissance, mobile |
| apps_jeux | 📱 Apps & jeux | IA, casual gaming, monétisation | Téléchargements, revenus, usage |
| reseaux_sociaux | 📢 Réseaux sociaux | Tendances visuelles, engagement | Utilisateurs, temps, croissance |
| google_trends | 📈 Google Trends | Breakout searches, SEO | Requêtes, seuil, tendances |
| business_ideas | 💡 Business ideas | Financement, niches, startup | Capital-risque, création, succès |
| news_ia | 🤖 News IA & Tech | Modèles, adoption, business | Modèles, adoption, investissements |

## ✅ Contrôles de qualité

Le cronjob valide :

- [ ] Données générées pour toutes les 6 catégories
- [ ] Analyse en français pour chaque catégorie (2-3 paragraphes)
- [ ] 3-5 chiffres clés par catégorie
- [ ] 4-6 articles enrichis par catégorie
- [ ] URLs sources préservées (vraies URLs, pas de résumés)
- [ ] Commit Git avec message `"Veille du YYYY-MM-DD"`
- [ ] Push réussi sur branche main
- [ ] Redéploiement Railway déclenché

## 🐛 Dépannage

### Le cronjob s'exécute mais no commit
- Vérifier les permissions Git
- Vérifier le token GitHub a les bonnes permissions
- Vérifier le remote origin : `git remote -v`

### Les données ne s'affichent pas
- Vérifier le JSON est valide : `node -e "console.log(require('./data/YYYY-MM-DD.json'))"`
- Vérifier le format correspond à la structure attendue
- Vérifier le serveur Express démarre : `curl http://localhost:3000/api/latest`

### web_search retourne aucun résultat
- Mode standalone : utilise FALLBACK_ARTICLES (normal)
- Mode Hermes : vérifier que hermes_tools est importable
- Vérifier la requête n'est pas trop spécifique

## 📝 Logs

Le cronjob produit des logs pour :
- Statut de chaque catégorie
- Nombre d'articles trouvés
- Erreurs de récupération/traduction
- Succès du commit/push

Exemple :
```
🚀 Starting veille cron job at 2026-09-22T07:00:00Z
📊 Generating veille data for 2026-09-22...

🔍 ecommerce...
  ✓ 6 articles
🔍 apps_jeux...
  ✓ 5 articles
...

✓ Data written to /root/veille-dashboard/data/2026-09-22.json
📤 Committing and pushing to GitHub...
✓ Successfully pushed to GitHub
✅ Veille cron job completed for 2026-09-22
```

## 🔐 Secrets requis

Pour l'exécution via GitHub Actions :
- `ANTHROPIC_API_KEY` : Token API Claude (optionnel, fallback utilisé)
- `GITHUB_TOKEN` : Auto-fourni par GitHub Actions

## 📚 Fichiers associés

- `cron.js` - Cronjob principal
- `hermes-wrapper.py` - Wrapper Hermes (optionnel)
- `.github/workflows/daily-veille.yml` - Configuration GitHub Actions
- `data/YYYY-MM-DD.json` - Données générées
- `server.js` - API Express
- `public/app.js` - Frontend
