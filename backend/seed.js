/**
 * seed.js
 * Populates the affirmations table with example affirmations (English + Russian).
 * Runs automatically on first server start, or manually: node seed.js
 */

const db = require('./database');

const affirmations = [
  // ── English ──────────────────────────────────────────────────────────────
  { text: "You are enough exactly as you are.", lang: "en" },
  { text: "Today I choose peace over perfection.", lang: "en" },
  { text: "Every breath I take fills me with calm and clarity.", lang: "en" },
  { text: "I trust the journey, even when I don't understand it.", lang: "en" },
  { text: "My feelings are valid, and I honor them with kindness.", lang: "en" },
  { text: "I am worthy of love, rest, and all good things.", lang: "en" },
  { text: "Small steps still move me forward — I celebrate each one.", lang: "en" },
  { text: "I release what I cannot control and embrace what I can.", lang: "en" },
  { text: "My presence in this world matters more than I know.", lang: "en" },
  { text: "Today holds new possibilities I haven't imagined yet.", lang: "en" },
  { text: "Breathe in courage. Breathe out fear.", lang: "en" },
  { text: "You have survived every difficult day so far — this one too.", lang: "en" },
  { text: "The world is gentler when you are gentle with yourself.", lang: "en" },
  { text: "Right now, in this moment, you are safe.", lang: "en" },

  // ── Russian (послание дня) ────────────────────────────────────────────────
  { text: "Ты заслуживаешь всего самого лучшего — прямо сейчас.", lang: "ru" },
  { text: "Твои мечты реальны, и путь к ним начинается сегодня.", lang: "ru" },
  { text: "Ты сильнее, чем думаешь, и мудрее, чем кажешься.", lang: "ru" },
  { text: "Каждый новый день — это подарок, открытый специально для тебя.", lang: "ru" },
  { text: "Позволь себе отдохнуть — это тоже продуктивность.", lang: "ru" },
  { text: "Твоя доброта меняет мир вокруг тебя.", lang: "ru" },
  { text: "Я отпускаю вчерашние тревоги и встречаю сегодня с открытым сердцем.", lang: "ru" },
  { text: "Каждое препятствие — это урок, который делает меня мудрее.", lang: "ru" },
  { text: "Всё, что тебе нужно, уже внутри тебя.", lang: "ru" },
  { text: "Сегодня я выбираю радость, даже в мелочах.", lang: "ru" },
  { text: "Твой темп — это правильный темп.", lang: "ru" },
];

async function seed() {
  try {
    const row = await db.getAsync('SELECT COUNT(*) as count FROM affirmations');

    if (row.count > 0) {
      console.log(`ℹ️  Database already has ${row.count} affirmations — skipping seed.`);
      return;
    }

    for (const item of affirmations) {
      await db.runAsync('INSERT INTO affirmations (text, lang) VALUES (?, ?)', [item.text, item.lang]);
    }

    console.log(`✅ Seeded ${affirmations.length} affirmations.`);
  } catch (err) {
    console.error('Seed error:', err.message);
  }
}

// If run directly (node seed.js), execute and exit
if (require.main === module) {
  seed().then(() => process.exit(0));
} else {
  // If required by server.js, just export the function
  module.exports = seed;
}
