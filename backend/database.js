/**
 * database.js
 * Initializes the SQLite database and creates tables if they don't exist.
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'affirmations.db');

// Open (or create) the database file
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Could not open database:', err.message);
    process.exit(1);
  }
});

// Enable WAL mode for better performance and run table creation
db.serialize(() => {
  db.run('PRAGMA journal_mode = WAL');

  db.run(`
    CREATE TABLE IF NOT EXISTS affirmations (
      id   INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      lang TEXT DEFAULT 'en'
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS user_daily_affirmations (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id        TEXT NOT NULL,
      date           TEXT NOT NULL,
      affirmation_id INTEGER NOT NULL,
      UNIQUE(user_id, date),
      FOREIGN KEY (affirmation_id) REFERENCES affirmations(id)
    )
  `);
});

// Helper: run a query that modifies data (INSERT, UPDATE, DELETE)
db.runAsync = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });

// Helper: fetch a single row
db.getAsync = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });

// Helper: fetch multiple rows
db.allAsync = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });

module.exports = db;
