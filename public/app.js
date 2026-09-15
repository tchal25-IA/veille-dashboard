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

function renderCategory(key, data) {
  const label = CATEGORY_LABELS[key] || key;
  const items = (data && data.items) || [];
  const summary = (data && data.summary) || '';
  const div = document.createElement('div');
  div.className = 'category';
  div.innerHTML = `
    <h2>${label}</h2>
    <div class="subtitle">${summary}</div>
    ${items.map(it => `
      <div class="item">
        <a href="${it.url || '#'}" target="_blank" rel="noopener">${it.title || '(sans titre)'}</a>
        <div class="summary">${it.description || ''}</div>
        ${it.tag ? `<div class="meta">${it.tag}</div>` : ''}
      </div>
    `).join('') || '<div class="summary">Aucun élément.</div>'}
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
