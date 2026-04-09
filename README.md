# 🎁 Daily Box Affirmations

A calming full-stack web app that shows you one affirmation per day — revealed by clicking a gift box.

---

## Project Structure

```
daily-box-affirmations/
├── backend/
│   ├── server.js          # Express entry point
│   ├── database.js        # SQLite setup & table creation
│   ├── seed.js            # Populates 25 affirmations (EN + RU)
│   ├── routes/
│   │   └── affirmations.js # API routes
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── main.jsx       # React root
│   │   ├── App.jsx        # Layout + animations
│   │   ├── index.css      # Global styles & CSS variables
│   │   └── components/
│   │       └── AffirmationBox.jsx  # Main interactive component
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## Quick Start

You need **Node.js 18+** installed.

### 1. Start the Backend

```bash
cd backend
npm install
npm start
```

The API will be running at `http://localhost:3001`.
The database is created and seeded automatically on first run.

### 2. Start the Frontend (in a new terminal)

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/daily-affirmation?user_id=<id>&date=<YYYY-MM-DD>` | Get today's affirmation for a user |
| `GET` | `/api/affirmations` | List all affirmations |
| `POST` | `/api/affirmations` | Add a new affirmation |
| `DELETE` | `/api/affirmations/:id` | Remove an affirmation |
| `GET` | `/health` | Health check |

### Example: Add a new affirmation

```bash
curl -X POST http://localhost:3001/api/affirmations \
  -H "Content-Type: application/json" \
  -d '{"text": "I am grateful for this moment.", "lang": "en"}'
```

---

## Features

- **One affirmation per day** — persisted server-side, same one returned on refresh
- **Anonymous user identity** — stored in localStorage, no login required
- **25 built-in affirmations** — mix of English and Russian (послания дня)
- **Yesterday-avoidance** — tries not to repeat the previous day's affirmation
- **Smooth animations** — box shimmer, reveal animation, hover effects
- **Calming warm design** — Lora serif font, earth tones, minimal UI

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express |
| Database | SQLite (via better-sqlite3) |
| Styling | CSS-in-JS + CSS variables |

---

## Development

```bash
# Run backend with auto-reload
cd backend && npm run dev

# Re-seed the database (if needed)
cd backend && node seed.js
```
