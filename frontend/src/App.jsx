/**
 * App.jsx
 * Women's Space — Daily affirmations, moon phase & personalised astrology.
 */

import { useState, useEffect } from 'react';
import AffirmationBox from './components/AffirmationBox';
import MoonPhase      from './components/MoonPhase';
import Astrology      from './components/Astrology';
import BirthdaySetup  from './components/BirthdaySetup';

const GLOBAL_STYLES = `
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
    0%, 100% { transform: scale(1);    opacity: 1; }
    50%       { transform: scale(1.06); opacity: 0.85; }
  }
  [role="button"]:hover {
    transform: translateY(-3px) scale(1.01) !important;
    box-shadow: 0 16px 50px rgba(100,80,50,0.20) !important;
  }
  [role="button"]:active { transform: scale(0.98) !important; }
  button:hover { background: #f5ede0 !important; }
  select:focus, input:focus { border-color: #c4a882 !important; box-shadow: 0 0 0 3px rgba(196,168,130,0.2); }
`;

function Divider({ label }) {
  return (
    <div style={styles.divider}>
      <div style={styles.dividerLine} />
      <span style={styles.dividerText}>{label}</span>
      <div style={styles.dividerLine} />
    </div>
  );
}

export default function App() {
  const [birthday, setBirthday] = useState(null);
  const [loaded, setLoaded]     = useState(false);

  // Load birthday from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('dba_birthday');
    if (saved) {
      try { setBirthday(JSON.parse(saved)); } catch {}
    }
    setLoaded(true);
  }, []);

  function handleBirthdaySave(bd) {
    setBirthday(bd);
  }

  // Don't render until we've checked localStorage
  if (!loaded) return null;

  // Show birthday setup on first visit
  if (!birthday) {
    return (
      <>
        <style>{GLOBAL_STYLES}</style>
        <BirthdaySetup onSave={handleBirthdaySave} />
      </>
    );
  }

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      <main style={styles.main}>

        {/* Daily affirmation box */}
        <AffirmationBox />

        {/* Moon phase */}
        <Divider label="🌿 lunar energy" />
        <MoonPhase />

        {/* Astrology */}
        <Divider label="✨ your stars today" />
        <Astrology birthday={birthday} />

        {/* Change birthday link */}
        <button
          style={styles.resetBtn}
          onClick={() => {
            localStorage.removeItem('dba_birthday');
            setBirthday(null);
          }}
        >
          Change my birthday
        </button>

      </main>

      <footer style={styles.footer}>
        Women's Space ✦ Daily Box Affirmations
      </footer>
    </>
  );
}

const styles = {
  main: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '24px 16px 80px',
    gap: '16px',
    width: '100%',
    maxWidth: '460px',
    margin: '0 auto',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    maxWidth: '420px',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    backgroundColor: '#d8ccc0',
  },
  dividerText: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '11px',
    color: '#b0a090',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  },
  footer: {
    position: 'fixed',
    bottom: '16px',
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
  resetBtn: {
    background: 'transparent',
    border: 'none',
    fontFamily: "'Inter', sans-serif",
    fontSize: '12px',
    color: '#b0a090',
    cursor: 'pointer',
    textDecoration: 'underline',
    padding: '4px 8px',
    marginTop: '4px',
  },
};
