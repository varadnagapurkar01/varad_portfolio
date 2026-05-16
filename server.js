/* ============================================
   BACKEND SERVER FOR NAME STORAGE
   Node.js + Express + SQLite
   ============================================ */

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files

// Database setup
const dbPath = path.join(__dirname, 'visitors.db');
const db = new sqlite3.Database(dbPath);

// Create visitors table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS visitors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      timestamp INTEGER NOT NULL,
      user_agent TEXT,
      referrer TEXT,
      ip_address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// ============================================
// API ENDPOINTS
// ============================================

// Store visitor name
app.post('/api/store-name', (req, res) => {
  const { name, timestamp, userAgent, referrer } = req.body;
  const ipAddress = req.ip || req.connection.remoteAddress;

  if (!name || !timestamp) {
    return res.status(400).json({ 
      success: false, 
      error: 'Name and timestamp are required' 
    });
  }

  const query = `
    INSERT INTO visitors (name, timestamp, user_agent, referrer, ip_address)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(query, [name, timestamp, userAgent, referrer, ipAddress], function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to store name' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Name stored successfully',
      id: this.lastID
    });
  });
});

// Get all visitors (for admin/analytics)
app.get('/api/visitors', (req, res) => {
  const query = `
    SELECT id, name, timestamp, user_agent, referrer, created_at
    FROM visitors
    ORDER BY created_at DESC
    LIMIT 100
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to retrieve visitors' 
      });
    }

    res.json({ 
      success: true, 
      count: rows.length,
      visitors: rows 
    });
  });
});

// Get visitor count
app.get('/api/visitor-count', (req, res) => {
  const query = 'SELECT COUNT(*) as count FROM visitors';

  db.get(query, [], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to get count' 
      });
    }

    res.json({ 
      success: true, 
      count: row.count 
    });
  });
});

// Export visitors to JSON (backup)
app.get('/api/export-visitors', (req, res) => {
  const query = 'SELECT * FROM visitors ORDER BY created_at DESC';

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to export data' 
      });
    }

    const exportPath = path.join(__dirname, 'visitors-export.json');
    fs.writeFileSync(exportPath, JSON.stringify(rows, null, 2));

    res.json({ 
      success: true, 
      message: 'Data exported successfully',
      file: 'visitors-export.json',
      count: rows.length
    });
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    timestamp: Date.now()
  });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   PORTFOLIO BACKEND SERVER RUNNING    ║
╠════════════════════════════════════════╣
║   Port: ${PORT}                          ║
║   Database: ${dbPath}                   ║
║   Status: ✓ Ready                      ║
╚════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nClosing database connection...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});
