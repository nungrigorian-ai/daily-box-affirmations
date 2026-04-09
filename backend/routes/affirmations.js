/**
 * routes/affirmations.js
 * Defines all affirmation-related API routes.
 */

const express = require('express');
const router = express.Router();
const db = require('../database');

// ─── GET /api/daily-affirmation ───────────────────────────────────────────────
router.get('/daily-affirmation', async (req, res) => {
  const { user_id, date } = req.query;

  if (!user_id || !date) {
    return res.status(400).json({ error: 'user_id and date query params are required.' });
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: 'date must be in YYYY-MM-DD format.' });
  }

  try {
    // Check if user already has an affirmation for today
    const existing = await db.getAsync(`
      SELECT a.id, a.text, a.lang
      FROM user_daily_affirmations uda
      JOIN affirmations a ON a.id = uda.affirmation_id
      WHERE uda.user_id = ? AND uda.date = ?
    `, [user_id, date]);

    if (existing) {
      return res.json({ affirmation: existing, already_opened: true });
    }

    // Count total affirmations
    const total = await db.getAsync('SELECT COUNT(*) as count FROM affirmations');

    if (!total || total.count === 0) {
      return res.status(503).json({ error: 'No affirmations in the database yet.' });
    }

    // Avoid repeating yesterday's affirmation if possible
    const yesterday = await db.getAsync(
      'SELECT affirmation_id FROM user_daily_affirmations WHERE user_id = ? ORDER BY date DESC LIMIT 1',
      [user_id]
    );

    let affirmation;
    if (yesterday && total.count > 1) {
      affirmation = await db.getAsync(
        'SELECT * FROM affirmations WHERE id != ? ORDER BY RANDOM() LIMIT 1',
        [yesterday.affirmation_id]
      );
    } else {
      affirmation = await db.getAsync('SELECT * FROM affirmations ORDER BY RANDOM() LIMIT 1');
    }

    // Persist the assignment
    await db.runAsync(
      'INSERT OR IGNORE INTO user_daily_affirmations (user_id, date, affirmation_id) VALUES (?, ?, ?)',
      [user_id, date, affirmation.id]
    );

    return res.json({ affirmation, already_opened: false });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// ─── GET /api/affirmations ────────────────────────────────────────────────────
router.get('/affirmations', async (req, res) => {
  try {
    const rows = await db.allAsync('SELECT * FROM affirmations ORDER BY id');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/affirmations ───────────────────────────────────────────────────
router.post('/affirmations', async (req, res) => {
  const { text, lang = 'en' } = req.body;

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({ error: 'text is required.' });
  }

  const validLangs = ['en', 'ru', 'mixed'];
  if (!validLangs.includes(lang)) {
    return res.status(400).json({ error: `lang must be one of: ${validLangs.join(', ')}` });
  }

  try {
    const result = await db.runAsync(
      'INSERT INTO affirmations (text, lang) VALUES (?, ?)',
      [text.trim(), lang]
    );
    res.status(201).json({ id: result.lastID, text: text.trim(), lang });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── DELETE /api/affirmations/:id ─────────────────────────────────────────────
router.delete('/affirmations/:id', async (req, res) => {
  try {
    const result = await db.runAsync('DELETE FROM affirmations WHERE id = ?', [req.params.id]);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Affirmation not found.' });
    }
    res.json({ message: `Affirmation ${req.params.id} deleted.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
