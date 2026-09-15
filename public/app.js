const dateSelect = document.getElementById('date-select');
const loadingEl = document.getElementById('loading');
const emptyEl = document.getElementById('empty');
const categoriesEl = document.getElementById('categories');
const lastUpdateEl = document.getElementById('last-update');

const CATEGORY_LABELS = {
  ecommerce: "🛒 Tendances e-commerce & meilleures ventes",
  apps_jeux: "📱 Apps & jeux tendance",
  reseaux_sociaux: "📢 Tendances réseaux sociaux",
  google_trends: "📈 Google Trends & synergies",
  business_ideas: "💡 Nouvelles idées business",
  news_ia: "🤖 News IA & Tech"
};

async function loadDates() {
  const res = await fetch('/api/dates');
  return res.ok ? res.json() : [];
}

async function loadDay(date) {
  const res = await fetch(date ? `/api/day/${date}` : '/api/latest');
  if (!res.ok) return null;
  return res.json();
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function renderKeyFigures(figures) {
  if (!figures || figures.length === 0) return '';
  return `
    <div class="section-label">Chiffres clés</div>
    <div class="key-figures">
      ${figures.map(f => `
        <div class="kf">
          <div class="kf-value">${escapeHtml(f.value)}</div>
          <div class="kf-label">${escapeHtml(f.label)}</div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderItems(items) {
  if (!items || items.length === 0) {
    return '<div class="summary">Aucun article disponible.</div>';
  }
  return items.map(it => {
    const titleFr = it.title_fr || it.title || '(sans titre)';
    const descFr = it.description_fr || it.description || '';
    const showOriginal = it.title_original && it.title_original !== titleFr;
    const lang = it.lang || 'fr';
    return `
      <div class="item">
        <a href="${it.url || '#'}" target="_blank" rel="noopener">${escapeHtml(titleFr)}</a>
        ${showOriginal ? `<div class="orig-title">VO : ${escapeHtml(it.title_original)}</div>` : ''}
        <div class="summary">${escapeHtml(descFr)}</div>
        <div class="meta">
          ${it.tag ? `<span>${escapeHtml(it.tag)}</span>` : ''}
          ${lang !== 'fr' ? `<span class="lang-badge">traduit de l'${lang === 'en' ? 'anglais' : lang}</span>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function renderCategory(key, data) {
  const label = CATEGORY_LABELS[key] || key;
  const items = (data && data.items) || [];
  const summary = (data && data.summary) || '';
  const figures = (data && data.key_figures) || [];
  const div = document.createElement('div');
  div.className = 'category';
  div.innerHTML = `
    <h2>${label}</h2>
    <div class="section-label">Analyse</div>
    <div class="analysis">${escapeHtml(summary) || 'Analyse indisponible.'}</div>
    ${renderKeyFigures(figures)}
    <div class="section-label">Articles</div>
    ${renderItems(items)}
  `;
  return div;
}

function render(data) {
  categoriesEl.innerHTML = '';
  if (!data || !data.categories) {
    emptyEl.classList.remove('hidden');
    return;
  }
  emptyEl.classList.add('hidden');
  lastUpdateEl.textContent = data.generated_at ? `Généré le ${new Date(data.generated_at).toLocaleString('fr-FR')}` : '';
  Object.keys(CATEGORY_LABELS).forEach(key => {
    if (data.categories[key]) {
      categoriesEl.appendChild(renderCategory(key, data.categories[key]));
    }
  });
}

async function init() {
  const dates = await loadDates();
  dateSelect.innerHTML = dates.map(d => `<option value="${d}">${d}</option>`).join('');
  if (dates.length === 0) {
    loadingEl.classList.add('hidden');
    emptyEl.classList.remove('hidden');
    return;
  }
  dateSelect.addEventListener('change', async () => {
    loadingEl.classList.remove('hidden');
    const data = await loadDay(dateSelect.value);
    loadingEl.classList.add('hidden');
    render(data);
  });
  const data = await loadDay(dates[0]);
  loadingEl.classList.add('hidden');
  render(data);
}

init();
