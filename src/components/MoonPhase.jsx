/**
 * MoonPhase.jsx
 * Displays today's moon phase, its energy description,
 * and an affirmation aligned with that phase.
 * Pure frontend — no API needed, calculated astronomically.
 */

// ─── Moon phase calculation ───────────────────────────────────────────────────

/**
 * Returns a value 0–1 representing how far through the lunar cycle we are.
 * 0 = new moon, 0.5 = full moon, 1 = back to new moon.
 */
function getMoonPhase(date = new Date()) {
  // Known new moon reference: Jan 6, 2000
  const KNOWN_NEW_MOON = new Date('2000-01-06T18:14:00Z');
  const LUNAR_CYCLE_MS = 29.53058867 * 24 * 60 * 60 * 1000;
  const elapsed = date.getTime() - KNOWN_NEW_MOON.getTime();
  const phase = ((elapsed % LUNAR_CYCLE_MS) / LUNAR_CYCLE_MS + 1) % 1;
  return phase;
}

/**
 * Maps a 0–1 phase value to a named moon phase with metadata.
 */
function getPhaseInfo(phase) {
  if (phase < 0.03 || phase >= 0.97) return {
    name: 'New Moon',
    nameRu: 'Новолуние',
    emoji: '🌑',
    energy: 'A time for new beginnings. Set intentions, plant seeds, rest and dream.',
    energyRu: 'Время новых начинаний. Ставь намерения, отдыхай и мечтай.',
    affirmation: 'I plant seeds of intention in fertile ground. What I begin now will bloom.',
    color: '#2d3a2e',
  };
  if (phase < 0.12) return {
    name: 'Waxing Crescent',
    nameRu: 'Растущий серп',
    emoji: '🌒',
    energy: 'Energy is building. Take the first steps toward what you envisioned.',
    energyRu: 'Энергия нарастает. Делай первые шаги к своим намерениям.',
    affirmation: 'I move forward with gentle courage. Each small step matters.',
    color: '#3a4a2a',
  };
  if (phase < 0.20) return {
    name: 'First Quarter',
    nameRu: 'Первая четверть',
    emoji: '🌓',
    energy: 'A time for action and decision. Push through resistance with determination.',
    energyRu: 'Время действий и решений. Преодолевай препятствия с решимостью.',
    affirmation: 'I trust my decisions. I act with clarity and purpose today.',
    color: '#4a5a30',
  };
  if (phase < 0.35) return {
    name: 'Waxing Gibbous',
    nameRu: 'Прибывающая луна',
    emoji: '🌔',
    energy: 'Refine and adjust. You are close — keep nurturing what you started.',
    energyRu: 'Совершенствуй и корректируй. Ты близко — продолжай заботиться о начатом.',
    affirmation: 'I trust the process. I refine, not rush. Growth is happening.',
    color: '#5a6a38',
  };
  if (phase < 0.65) return {
    name: 'Full Moon',
    nameRu: 'Полнолуние',
    emoji: '🌕',
    energy: 'Peak energy and illumination. Celebrate, release what no longer serves you.',
    energyRu: 'Пиковая энергия. Празднуй и отпускай то, что больше не служит тебе.',
    affirmation: 'I am fully seen, fully alive. I release what dims my light.',
    color: '#7a6a40',
  };
  if (phase < 0.73) return {
    name: 'Waning Gibbous',
    nameRu: 'Убывающая луна',
    emoji: '🌖',
    energy: 'Share your wisdom. Give gratitude and begin to release.',
    energyRu: 'Делись мудростью. Выражай благодарность и начинай отпускать.',
    affirmation: 'I am grateful for all I have received. I share my light freely.',
    color: '#6a5a38',
  };
  if (phase < 0.82) return {
    name: 'Last Quarter',
    nameRu: 'Последняя четверть',
    emoji: '🌗',
    energy: 'Let go of what is no longer aligned. Make space for what is coming.',
    energyRu: 'Отпускай то, что больше не соответствует тебе. Освобождай место.',
    affirmation: 'I release with grace. Letting go is an act of love for myself.',
    color: '#5a4a30',
  };
  return {
    name: 'Waning Crescent',
    nameRu: 'Убывающий серп',
    emoji: '🌘',
    energy: 'Rest, reflect, and surrender. Honor your need for quiet and stillness.',
    energyRu: 'Отдыхай, размышляй и доверяй. Цени тишину и покой.',
    affirmation: 'I rest without guilt. In stillness, I find my deepest wisdom.',
    color: '#3a2d28',
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function MoonPhase() {
  const phase = getMoonPhase();
  const info  = getPhaseInfo(phase);

  // Illumination percentage (0% at new moon, 100% at full moon)
  const illumination = Math.round(Math.sin(phase * Math.PI) * 100);

  return (
    <div style={{ ...styles.card, borderColor: info.color + '44' }}>

      {/* Moon emoji + phase name */}
      <div style={styles.moonRow}>
        <span style={styles.moonEmoji}>{info.emoji}</span>
        <div>
          <p style={styles.phaseName}>{info.name}</p>
          <p style={styles.phaseNameRu}>{info.nameRu}</p>
        </div>
      </div>

      {/* Illumination bar */}
      <div style={styles.barTrack}>
        <div style={{ ...styles.barFill, width: `${illumination}%`, backgroundColor: info.color }} />
      </div>
      <p style={styles.illuminationLabel}>{illumination}% illuminated</p>

      {/* Divider */}
      <div style={{ ...styles.divider, background: `linear-gradient(90deg, transparent, ${info.color}, transparent)` }} />

      {/* Energy description */}
      <p style={styles.energy}>{info.energy}</p>
      <p style={styles.energyRu}>{info.energyRu}</p>

      {/* Affirmation */}
      <div style={{ ...styles.affirmationBox, borderColor: info.color + '55', backgroundColor: info.color + '11' }}>
        <p style={styles.affirmationLabel}>🌿 Moon affirmation</p>
        <p style={styles.affirmationText}>"{info.affirmation}"</p>
      </div>

    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  card: {
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: '#faf7f2',
    borderRadius: '20px',
    padding: '24px 18px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    border: '1px solid',
    boxShadow: '0 4px 20px rgba(80,60,40,0.08)',
    overflow: 'hidden',
  },
  moonRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  moonEmoji: {
    fontSize: '48px',
    lineHeight: 1,
    filter: 'drop-shadow(0 2px 8px rgba(100,80,40,0.3))',
  },
  phaseName: {
    fontFamily: "'Lora', Georgia, serif",
    fontWeight: 500,
    fontSize: '20px',
    color: '#2d2518',
    margin: 0,
  },
  phaseNameRu: {
    fontFamily: "'Lora', Georgia, serif",
    fontStyle: 'italic',
    fontSize: '13px',
    color: '#9a8870',
    margin: '2px 0 0',
  },
  barTrack: {
    width: '100%',
    height: '6px',
    backgroundColor: '#e8ddd0',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 1s ease',
  },
  illuminationLabel: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '11px',
    color: '#b0a090',
    margin: 0,
    letterSpacing: '0.04em',
  },
  divider: {
    width: '100%',
    height: '1px',
    borderRadius: '1px',
    margin: '2px 0',
  },
  energy: {
    fontFamily: "'Lora', Georgia, serif",
    fontSize: '15px',
    color: '#4a3d2e',
    lineHeight: 1.6,
    margin: 0,
  },
  energyRu: {
    fontFamily: "'Lora', Georgia, serif",
    fontStyle: 'italic',
    fontSize: '13px',
    color: '#9a8870',
    lineHeight: 1.6,
    margin: 0,
  },
  affirmationBox: {
    borderRadius: '12px',
    border: '1px solid',
    padding: '14px 16px',
    marginTop: '4px',
  },
  affirmationLabel: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '11px',
    color: '#b0a090',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    margin: '0 0 6px',
  },
  affirmationText: {
    fontFamily: "'Lora', Georgia, serif",
    fontStyle: 'italic',
    fontSize: '15px',
    color: '#2d2518',
    lineHeight: 1.65,
    margin: 0,
  },
};
