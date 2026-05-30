const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const dbPath = path.join(__dirname, 'visit_counts.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS page_visits (
      page_name TEXT PRIMARY KEY,
      count INTEGER DEFAULT 0
    )
  `);
});

app.post('/api/track', (req, res) => {
  const { page } = req.body;
  if (!page) return res.status(400).json({ error: 'Page required' });

  const query = `
    INSERT INTO page_visits (page_name, count) 
    VALUES (?, 1) 
    ON CONFLICT(page_name) 
    DO UPDATE SET count = count + 1
  `;
  
  db.run(query, [page], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ success: true });
  });
});

app.get('/api/counts', (req, res) => {
  db.all('SELECT page_name, count FROM page_visits ORDER BY count DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Visit Counts server running on port ${PORT}`);
});

process.on('SIGINT', () => {
  db.close(() => process.exit(0));
});
