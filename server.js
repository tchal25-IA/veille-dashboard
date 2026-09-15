const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');

app.use(express.static(path.join(__dirname, 'public')));

function listDates() {
  if (!fs.existsSync(DATA_DIR)) return [];
  return fs.readdirSync(DATA_DIR)
    .filter(f => /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
    .map(f => f.replace('.json', ''))
    .sort()
    .reverse();
}

app.get('/api/dates', (req, res) => {
  res.json(listDates());
});

app.get('/api/latest', (req, res) => {
  const dates = listDates();
  if (dates.length === 0) return res.status(404).json({ error: 'no data yet' });
  const file = path.join(DATA_DIR, dates[0] + '.json');
  res.sendFile(file);
});

app.get('/api/day/:date', (req, res) => {
  const date = req.params.date;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return res.status(400).json({ error: 'bad date format' });
  const file = path.join(DATA_DIR, date + '.json');
  if (!fs.existsSync(file)) return res.status(404).json({ error: 'not found' });
  res.sendFile(file);
});

app.get('/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Veille dashboard listening on port ${PORT}`);
});
