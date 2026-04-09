/**
 * server.js
 * Entry point for the Daily Box Affirmations backend.
 */

const express = require('express');
const cors = require('cors');

// Initialize database (creates tables if needed)
require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: '*',   // Allow all origins (frontend on Vercel + local dev)
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────
const affirmationRoutes = require('./routes/affirmations');
app.use('/api', affirmationRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// ─── Start & Seed ─────────────────────────────────────────────────────────────
app.listen(PORT, async () => {
  console.log(`✨ Daily Box Affirmations API running at http://localhost:${PORT}`);

  // Auto-seed on first run
  try {
    const seed = require('./seed');
    await seed();
  } catch (err) {
    console.error('Seed error:', err.message);
  }
});
