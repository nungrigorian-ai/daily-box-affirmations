/**
 * App.jsx
 * Women's Space — horizontal swipeable cards (Instagram Stories style).
 * Card 1: Daily Affirmation Box
 * Card 2: Moon Phase
 * Card 3: Your Stars (Astrology)
 */

import { useState, useEffect, useRef } from 'react';
import AffirmationBox from './components/AffirmationBox';
import MoonPhase      from './components/MoonPhase';
import Astrology      from './components/Astrology';
import BirthdaySetup  from './components/BirthdaySetup';

const GLOBAL_STYLES = `
  * { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes shimmer {
    0%   { transform: translateX(-100%); }
    60%  { transform: translateX(100%); }
    100% { transform: translateX(100%); }
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes revealIn {
    from { opacity: 0; transform: scale(0.92) translateY(8px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50%       { transform: scale(1.06); opacity: 0.85; }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(30px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  [role="button"]:hover {
    transform: translateY(-3px) scale(1.01) !important;
    box-shadow: 0 16px 50px rgba(100,80,50,0.20) !important;
  }
  [role="button"]:active { transform: scale(0.98) !important; }
  button:hover { opacity: 0.85; }

  select:focus, input:focus {
    border-color: #c4a882 !important;
    box-shadow: 0 0 0 3px rgba(196,168,130,0.2);
    outline: none;
  }

  /* Hide scrollbar on the swipe container */
  .swipe-container {
    display: flex;
    overflow-x: hidden;
    width: 100%;
    height: 100%;
    touch-action: pan-x;
  }
`;

const CARDS = [
  { id: 'affirmation', label: '✦ Message',   icon: '🎁' },
  { id: 'moon',        label: '🌿 Moon',      icon: '🌙' },
  { id: 'stars',       label: '✨ Stars',     icon: '♈️' },
];

export default function App() {
  const [birthday, setBirthday]   = useState(null);
  const [loaded, setLoaded]       = useState(false);
  const [activeCard, setActiveCard] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Touch swipe tracking
  const touchStartX = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('dba_birthday');
    if (saved) {
      try { setBirthday(JSON.parse(saved)); } catch {}
    }
    setLoaded(true);
  }, []);

  function goToCard(index) {
    if (isAnimating || index === activeCard) return;
    setIsAnimating(true);
    setActiveCard(index);
    setTimeout(() => setIsAnimating(false), 400);
  }

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e) {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && activeCard < CARDS.length - 1) goToCard(activeCard + 1);
      if (diff < 0 && activeCard > 0) goToCard(activeCard - 1);
    }
    touchStartX.current = null;
  }

  if (!loaded) return null;

  if (!birthday) {
    return (
      <>
        <style>{GLOBAL_STYLES}</style>
        <BirthdaySetup onSave={bd => setBirthday(bd)} />
      </>
    );
  }

  return (
    <>
      <style>{GLOBAL_STYLES}</style>

      <div style={styles.shell}>

        {/* Top tab bar */}
        <nav style={styles.tabBar}>
          {CARDS.map((card, i) => (
            <button
              key={card.id}
              onClick={() => goToCard(i)}
              style={{
                ...styles.tab,
                ...(activeCard === i ? styles.tabActive : {}),
              }}
            >
              <span style={styles.tabIcon}>{card.icon}</span>
              <span style={styles.tabLabel}>{card.label}</span>
            </button>
          ))}
        </nav>

        {/* Card viewport */}
        <div
          style={styles.viewport}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            style={{
              ...styles.cardTrack,
              transform: `translateX(-${activeCard * 100}%)`,
            }}
          >
            {/* Card 1 — Affirmation */}
            <div style={styles.card}>
              <div style={styles.cardScroll}>
                <AffirmationBox />
              </div>
            </div>

            {/* Card 2 — Moon */}
            <div style={styles.card}>
              <div style={styles.cardScroll}>
                <div style={styles.cardHeader}>
                  <p style={styles.cardTitle}>Lunar Energy</p>
                  <p style={styles.cardSubtitle}>Today's moon phase & guidance</p>
                </div>
                <MoonPhase />
              </div>
            </div>

            {/* Card 3 — Astrology */}
            <div style={styles.card}>
              <div style={styles.cardScroll}>
                <div style={styles.cardHeader}>
                  <p style={styles.cardTitle}>Your Stars Today</p>
                  <p style={styles.cardSubtitle}>Personalised guidance for your sign</p>
                </div>
                <Astrology birthday={birthday} />
                <button
                  style={styles.resetBtn}
                  onClick={() => {
                    localStorage.removeItem('dba_birthday');
                    setBirthday(null);
                  }}
                >
                  Change my birthday
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom dots */}
        <div style={styles.dots}>
          {CARDS.map((_, i) => (
            <button
              key={i}
              onClick={() => goToCard(i)}
              style={{
                ...styles.dot,
                ...(activeCard === i ? styles.dotActive : {}),
              }}
            />
          ))}
        </div>

        {/* Arrow navigation (desktop) */}
        {activeCard > 0 && (
          <button style={{ ...styles.arrow, ...styles.arrowLeft }} onClick={() => goToCard(activeCard - 1)}>
            ‹
          </button>
        )}
        {activeCard < CARDS.length - 1 && (
          <button style={{ ...styles.arrow, ...styles.arrowRight }} onClick={() => goToCard(activeCard + 1)}>
            ›
          </button>
        )}

      </div>

      <footer style={styles.footer}>
        Women's Space ✦ Swipe or tap to explore
      </footer>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  shell: {
    position: 'relative',
    width: '100%',
    maxWidth: '480px',
    margin: '0 auto',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: '60px',
  },

  // Tab bar at top
  tabBar: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    padding: '16px 16px 12px',
    position: 'sticky',
    top: 0,
    backgroundColor: '#f5f0eb',
    zIndex: 10,
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '7px 14px',
    borderRadius: '20px',
    border: '1px solid #d8ccc0',
    backgroundColor: 'transparent',
    fontFamily: "'Inter', sans-serif",
    fontSize: '12px',
    color: '#9a8870',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    letterSpacing: '0.02em',
  },
  tabActive: {
    backgroundColor: '#8b7355',
    borderColor: '#8b7355',
    color: '#fff',
  },
  tabIcon: {
    fontSize: '14px',
  },
  tabLabel: {
    fontWeight: 400,
  },

  // Sliding viewport
  viewport: {
    flex: 1,
    overflow: 'hidden',
    width: '100%',
  },
  cardTrack: {
    display: 'flex',
    width: '100%',
    transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    willChange: 'transform',
  },
  card: {
    minWidth: '100%',
    width: '100%',
    flexShrink: 0,
    padding: '8px 16px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  cardScroll: {
    width: '100%',
    maxWidth: '440px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  cardHeader: {
    textAlign: 'center',
    paddingTop: '8px',
  },
  cardTitle: {
    fontFamily: "'Lora', Georgia, serif",
    fontWeight: 500,
    fontSize: '22px',
    color: '#2d2518',
    marginBottom: '4px',
  },
  cardSubtitle: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 300,
    fontSize: '13px',
    color: '#9a8870',
  },

  // Dots
  dots: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    padding: '16px',
    position: 'fixed',
    bottom: '28px',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#d8ccc0',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    transition: 'all 0.3s ease',
  },
  dotActive: {
    backgroundColor: '#8b7355',
    width: '24px',
    borderRadius: '4px',
  },

  // Arrow buttons (desktop)
  arrow: {
    position: 'fixed',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'rgba(255,255,255,0.8)',
    border: '1px solid #d8ccc0',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    fontSize: '24px',
    color: '#8b7355',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    lineHeight: 1,
  },
  arrowLeft: {
    left: '8px',
  },
  arrowRight: {
    right: '8px',
  },

  resetBtn: {
    background: 'transparent',
    border: 'none',
    fontFamily: "'Inter', sans-serif",
    fontSize: '12px',
    color: '#b0a090',
    cursor: 'pointer',
    textDecoration: 'underline',
    padding: '4px 8px',
    marginTop: '8px',
  },

  footer: {
    position: 'fixed',
    bottom: '8px',
    left: '50%',
    transform: 'translateX(-50%)',
    fontFamily: "'Inter', sans-serif",
    fontSize: '11px',
    color: '#c8baa8',
    letterSpacing: '0.06em',
    textAlign: 'center',
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
  },
};
