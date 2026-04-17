/**
 * App.jsx
 * Women's Space — horizontal swipeable cards with bottom tab bar.
 * Card 1: Daily Affirmation Box
 * Card 2: Moon Phase
 * Card 3: Your Stars (Astrology)
 * Card 4: Cycle Tracker
 * Card 5: Daily Meal Plan (personalized, adaptive, digestion-friendly)
 */

import { useState, useEffect, useRef } from 'react';
import AffirmationBox from './components/AffirmationBox';
import MoonPhase      from './components/MoonPhase';
import Astrology      from './components/Astrology';
import BirthdaySetup  from './components/BirthdaySetup';
import CycleTracker   from './components/CycleTracker';
import CycleSetup     from './components/CycleSetup';
import NutritionPlan  from './components/NutritionPlan';

const GLOBAL_STYLES = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; }

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

  [role="button"]:hover {
    transform: translateY(-3px) scale(1.01) !important;
    box-shadow: 0 16px 50px rgba(100,80,50,0.20) !important;
  }
  [role="button"]:active { transform: scale(0.98) !important; }
  select:focus, input:focus {
    border-color: #c4a882 !important;
    box-shadow: 0 0 0 3px rgba(196,168,130,0.2);
    outline: none;
  }
`;

const CARDS = [
  { id: 'affirmation', label: 'Message', labelRu: 'Послание', icon: '🎁' },
  { id: 'moon',        label: 'Moon',    labelRu: 'Луна',     icon: '🌙' },
  { id: 'stars',       label: 'Stars',   labelRu: 'Звёзды',   icon: '✨' },
  { id: 'nutrition',   label: 'Nutrition', labelRu: 'Питание',  icon: '🥦' },
  { id: 'cycle',       label: 'Cycle',   labelRu: 'Цикл',     icon: '🌸' },
];

export default function App() {
  const [birthday, setBirthday]     = useState(null);
  const [cycleData, setCycleData]   = useState(null);
  const [loaded, setLoaded]         = useState(false);
  const [activeCard, setActiveCard] = useState(0);
  const [lang, setLang]             = useState('en'); // 'en' | 'ru'
  const touchStartX = useRef(null);

  useEffect(() => {
    const savedBirthday  = localStorage.getItem('dba_birthday');
    const savedLang      = localStorage.getItem('dba_lang');
    const savedCycleStart  = localStorage.getItem('dba_cycle_start');
    const savedCycleLen    = localStorage.getItem('dba_cycle_length');
    const savedPeriodLen   = localStorage.getItem('dba_period_length');
    if (savedBirthday) {
      try { setBirthday(JSON.parse(savedBirthday)); } catch {}
    }
    if (savedLang) setLang(savedLang);
    if (savedCycleStart && savedCycleLen) {
      setCycleData({
        start:     savedCycleStart,
        cycleLen:  parseInt(savedCycleLen, 10),
        periodLen: parseInt(savedPeriodLen || '5', 10),
      });
    }
    setLoaded(true);
  }, []);

  function toggleLang() {
    const next = lang === 'en' ? 'ru' : 'en';
    setLang(next);
    localStorage.setItem('dba_lang', next);
  }

  function goToCard(index) {
    if (index < 0 || index >= CARDS.length) return;
    setActiveCard(index);
  }

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e) {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goToCard(activeCard + 1);
      else goToCard(activeCard - 1);
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

        {/* Top bar — title + language toggle */}
        <header style={styles.topBar}>
          <p style={styles.appTitle}>Women's Space</p>
          <button onClick={toggleLang} style={styles.langBtn}>
            {lang === 'en' ? '🇺🇸 EN' : '🇷🇺 RU'}
          </button>
        </header>

        {/* Swipeable card viewport */}
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
                <AffirmationBox lang={lang} />
              </div>
            </div>

            {/* Card 2 — Moon */}
            <div style={styles.card}>
              <div style={styles.cardScroll}>
                <div style={styles.cardHeader}>
                  <p style={styles.cardTitle}>{lang === 'en' ? 'Lunar Energy' : 'Энергия луны'}</p>
                  <p style={styles.cardSubtitle}>{lang === 'en' ? "Today's moon phase & guidance" : 'Фаза луны и послание дня'}</p>
                </div>
                <MoonPhase lang={lang} />
              </div>
            </div>

            {/* Card 3 — Astrology */}
            <div style={styles.card}>
              <div style={styles.cardScroll}>
                <div style={styles.cardHeader}>
                  <p style={styles.cardTitle}>{lang === 'en' ? 'Your Stars Today' : 'Твои звёзды сегодня'}</p>
                  <p style={styles.cardSubtitle}>{lang === 'en' ? 'Guidance for your sign' : 'Руководство для твоего знака'}</p>
                </div>
                <Astrology birthday={birthday} lang={lang} />
                <button
                  style={styles.resetBtn}
                  onClick={() => { localStorage.removeItem('dba_birthday'); setBirthday(null); }}
                >
                  {lang === 'en' ? 'Change my birthday' : 'Изменить дату рождения'}
                </button>
              </div>
            </div>

            {/* Card 4 — Nutrition (Diet + Meals combined) */}
            <div style={styles.card}>
              <div style={styles.cardScroll}>
                <NutritionPlan lang={lang} />
              </div>
            </div>

            {/* Card 5 — Cycle */}
            <div style={styles.card}>
              <div style={styles.cardScroll}>
                <div style={styles.cardHeader}>
                  <p style={styles.cardTitle}>{lang === 'en' ? 'Your Cycle' : 'Твой цикл'}</p>
                  <p style={styles.cardSubtitle}>{lang === 'en' ? 'Phase, energy & guidance' : 'Фаза, энергия и советы'}</p>
                </div>
                {cycleData
                  ? <CycleTracker
                      cycleData={cycleData}
                      lang={lang}
                      onReset={() => {
                        localStorage.removeItem('dba_cycle_start');
                        localStorage.removeItem('dba_cycle_length');
                        localStorage.removeItem('dba_period_length');
                        setCycleData(null);
                      }}
                    />
                  : <CycleSetup
                      lang={lang}
                      onSave={data => setCycleData(data)}
                    />
                }
              </div>
            </div>

          </div>
        </div>

        {/* Bottom tab bar */}
        <nav style={styles.bottomBar}>
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
              <span style={{
                ...styles.tabLabel,
                ...(activeCard === i ? styles.tabLabelActive : {}),
              }}>{lang === 'ru' ? card.labelRu : card.label}</span>
              {activeCard === i && <div style={styles.tabIndicator} />}
            </button>
          ))}
        </nav>

      </div>
    </>
  );
}

const styles = {
  shell: {
    position: 'relative',
    width: '100%',
    maxWidth: '480px',
    margin: '0 auto',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f5f0eb',
    overflow: 'hidden',
  },

  // Top bar
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px 10px',
    flexShrink: 0,
  },
  appTitle: {
    fontFamily: "'Lora', Georgia, serif",
    fontWeight: 500,
    fontSize: '18px',
    color: '#2d2518',
    letterSpacing: '-0.01em',
  },
  langBtn: {
    padding: '6px 12px',
    borderRadius: '20px',
    border: '1px solid #d8ccc0',
    backgroundColor: '#fff',
    fontFamily: "'Inter', sans-serif",
    fontSize: '13px',
    color: '#8b7355',
    cursor: 'pointer',
    letterSpacing: '0.02em',
  },

  // Swipe area
  viewport: {
    flex: 1,
    overflow: 'hidden',
    width: '100%',
  },
  cardTrack: {
    display: 'flex',
    height: '100%',
    transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    willChange: 'transform',
  },
  card: {
    minWidth: '100%',
    width: '100%',
    maxWidth: '100%',
    height: '100%',
    flexShrink: 0,
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: '8px 16px 24px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  cardScroll: {
    width: '100%',
    maxWidth: '460px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '16px',
    paddingBottom: '16px',
    boxSizing: 'border-box',
  },
  cardHeader: {
    textAlign: 'center',
    paddingTop: '4px',
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

  // Bottom tab bar
  bottomBar: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '8px 0 20px',
    backgroundColor: '#fff',
    borderTop: '1px solid #ede8e2',
    flexShrink: 0,
  },
  tab: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '3px',
    padding: '6px 20px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    position: 'relative',
    minWidth: '80px',
  },
  tabActive: {},
  tabIcon: {
    fontSize: '22px',
    lineHeight: 1,
  },
  tabLabel: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '11px',
    color: '#b0a090',
    letterSpacing: '0.04em',
  },
  tabLabelActive: {
    color: '#8b7355',
    fontWeight: 500,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: '-8px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '20px',
    height: '3px',
    backgroundColor: '#8b7355',
    borderRadius: '2px',
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
  },
};
