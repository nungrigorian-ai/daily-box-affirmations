/**
 * AffirmationBox.jsx
 * The central interactive component.
 * Shows a closed gift box, then animates open to reveal today's affirmation.
 */

import { useState, useEffect } from 'react';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns or creates a stable anonymous user ID stored in localStorage. */
function getUserId() {
  const KEY = 'dba_user_id';
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = 'user_' + Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
    localStorage.setItem(KEY, id);
  }
  return id;
}

/** Returns today's date as YYYY-MM-DD in the user's local timezone. */
function getLocalDate() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/** Maps a weekday number (0=Sun) to a friendly label. */
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];

function formatDate() {
  const d = new Date();
  return `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const BoxClosedIcon = () => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"
       style={{ width: 80, height: 80 }}>
    {/* Box body */}
    <rect x="8" y="34" width="64" height="40" rx="4" fill="#e8d5b8" stroke="#c4a882" strokeWidth="2"/>
    {/* Box lid */}
    <rect x="4" y="24" width="72" height="14" rx="4" fill="#d4b896" stroke="#c4a882" strokeWidth="2"/>
    {/* Ribbon vertical */}
    <rect x="36" y="24" width="8" height="50" fill="#c4a882" opacity="0.7"/>
    {/* Ribbon horizontal */}
    <rect x="4" y="29" width="72" height="6" fill="#c4a882" opacity="0.7"/>
    {/* Bow left loop */}
    <ellipse cx="31" cy="20" rx="11" ry="8" fill="#c4a882" transform="rotate(-20 31 20)"/>
    {/* Bow right loop */}
    <ellipse cx="49" cy="20" rx="11" ry="8" fill="#c4a882" transform="rotate(20 49 20)"/>
    {/* Bow center */}
    <circle cx="40" cy="22" r="5" fill="#b89060"/>
    {/* Sparkles */}
    <circle cx="18" cy="16" r="2" fill="#f0d090" opacity="0.8"/>
    <circle cx="62" cy="12" r="1.5" fill="#f0d090" opacity="0.6"/>
    <circle cx="70" cy="22" r="1" fill="#f0d090" opacity="0.5"/>
  </svg>
);

const BoxOpenIcon = () => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"
       style={{ width: 80, height: 80 }}>
    {/* Box body */}
    <rect x="8" y="38" width="64" height="36" rx="4" fill="#e8d5b8" stroke="#c4a882" strokeWidth="2"/>
    {/* Ribbon on body */}
    <rect x="36" y="38" width="8" height="36" fill="#c4a882" opacity="0.5"/>
    {/* Lid open / tilted back */}
    <rect x="6" y="10" width="68" height="14" rx="4" fill="#d4b896" stroke="#c4a882" strokeWidth="2"
          transform="rotate(-15 40 17)"/>
    {/* Ribbon on lid */}
    <rect x="36" y="10" width="8" height="14" fill="#c4a882" opacity="0.5"
          transform="rotate(-15 40 17)"/>
    {/* Glow from inside */}
    <ellipse cx="40" cy="44" rx="24" ry="8" fill="#fff8ec" opacity="0.6"/>
    {/* Stars / sparkles coming out */}
    <circle cx="30" cy="28" r="2.5" fill="#f5c842" opacity="0.9"/>
    <circle cx="52" cy="22" r="2" fill="#f5c842" opacity="0.8"/>
    <circle cx="42" cy="18" r="3" fill="#f5c842" opacity="0.95"/>
    <circle cx="22" cy="22" r="1.5" fill="#f5c842" opacity="0.7"/>
    <circle cx="60" cy="30" r="1.5" fill="#f5c842" opacity="0.6"/>
    {/* Small stars */}
    <path d="M40 6 L41.2 9.6 L45 9.6 L42 11.8 L43.2 15.4 L40 13.2 L36.8 15.4 L38 11.8 L35 9.6 L38.8 9.6 Z"
          fill="#f5c842" opacity="0.9"/>
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────

export default function AffirmationBox() {
  const [phase, setPhase] = useState('idle');         // 'idle' | 'loading' | 'opening' | 'open' | 'error'
  const [affirmation, setAffirmation] = useState(null);
  const [alreadyOpened, setAlreadyOpened] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // On mount: check if user already opened today (avoid refetch on refresh)
  useEffect(() => {
    const userId = getUserId();
    const today  = getLocalDate();
    const cacheKey = `dba_opened_${today}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      try {
        const data = JSON.parse(cached);
        setAffirmation(data);
        setAlreadyOpened(true);
        setPhase('open');
      } catch {
        localStorage.removeItem(cacheKey);
      }
    }
  }, []);

  // ── Fetch affirmation from backend ─────────────────────────────────────────
  async function fetchAffirmation() {
    const userId = getUserId();
    const today  = getLocalDate();

    setPhase('loading');

    try {
      // Use VITE_API_URL env variable in production, fall back to Vite proxy in dev
      const base = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${base}/api/daily-affirmation?user_id=${encodeURIComponent(userId)}&date=${today}`);

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Server error ${res.status}`);
      }

      const data = await res.json();
      setAffirmation(data.affirmation);
      setAlreadyOpened(data.already_opened);

      // Cache locally so refresh doesn't lose the state
      localStorage.setItem(`dba_opened_${today}`, JSON.stringify(data.affirmation));

      // Short delay for dramatic effect before showing open state
      setTimeout(() => setPhase('open'), 600);
    } catch (err) {
      setErrorMsg(err.message || 'Could not load your affirmation. Is the backend running?');
      setPhase('error');
    }
  }

  // ── Click handler ──────────────────────────────────────────────────────────
  function handleBoxClick() {
    if (phase === 'idle') {
      setPhase('opening');
      fetchAffirmation();
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  const isOpen    = phase === 'open';
  const isLoading = phase === 'loading' || phase === 'opening';

  return (
    <div style={styles.page}>

      {/* Header */}
      <header style={styles.header}>
        <p style={styles.dateLabel}>{formatDate()}</p>
        <h1 style={styles.title}>Daily Message</h1>
        <p style={styles.subtitle}>Послание дня</p>
      </header>

      {/* The Box Card */}
      <div
        onClick={handleBoxClick}
        style={{
          ...styles.card,
          cursor: (phase === 'idle') ? 'pointer' : 'default',
          transform: isOpen ? 'scale(1)' : isLoading ? 'scale(0.97)' : 'scale(1)',
          boxShadow: isOpen ? styles.card['--shadow-open'] : styles.card['--shadow-default'],
        }}
        role={phase === 'idle' ? 'button' : 'article'}
        aria-label={phase === 'idle' ? 'Open your daily affirmation' : 'Your daily affirmation'}
        tabIndex={phase === 'idle' ? 0 : -1}
        onKeyDown={e => e.key === 'Enter' && handleBoxClick()}
      >
        {/* Closed state */}
        {!isOpen && !isLoading && phase !== 'error' && (
          <div style={styles.closedContent}>
            <div style={styles.iconWrap}>
              <BoxClosedIcon />
            </div>
            <p style={styles.promptText}>Open your daily message</p>
            <p style={styles.promptSubtext}>Tap to reveal today's affirmation</p>
          </div>
        )}

        {/* Loading / Opening state */}
        {isLoading && (
          <div style={styles.loadingContent}>
            <div style={{ ...styles.iconWrap, animation: 'pulse 1s ease-in-out infinite' }}>
              <BoxOpenIcon />
            </div>
            <p style={styles.promptText}>Opening…</p>
          </div>
        )}

        {/* Open / Revealed state */}
        {isOpen && affirmation && (
          <div style={styles.openContent}>
            <div style={styles.openIconWrap}>
              <BoxOpenIcon />
            </div>
            <div style={styles.divider} />
            <p style={styles.affirmationText}>
              {affirmation.text}
            </p>
            {alreadyOpened && (
              <p style={styles.alreadyNote}>✦ Today's message</p>
            )}
            <span style={styles.langBadge}>
              {affirmation.lang === 'ru' ? '🇷🇺 RU' : affirmation.lang === 'en' ? '🇺🇸 EN' : '🌐'}
            </span>
          </div>
        )}

        {/* Error state */}
        {phase === 'error' && (
          <div style={styles.errorContent}>
            <p style={styles.errorIcon}>⚠️</p>
            <p style={styles.errorText}>{errorMsg}</p>
            <button style={styles.retryBtn} onClick={(e) => { e.stopPropagation(); setPhase('idle'); setErrorMsg(''); }}>
              Try again
            </button>
          </div>
        )}

        {/* Shimmer overlay when idle */}
        {phase === 'idle' && <div style={styles.shimmer} />}
      </div>

      {/* Footer hint */}
      {phase === 'idle' && (
        <p style={styles.hint}>A new message awaits every day 🌿</p>
      )}
      {isOpen && (
        <p style={styles.hint}>Come back tomorrow for a new message ✨</p>
      )}
    </div>
  );
}

// ─── Styles (CSS-in-JS) ───────────────────────────────────────────────────────

const styles = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '24px 16px',
    gap: '28px',
  },

  header: {
    textAlign: 'center',
  },

  dateLabel: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 300,
    fontSize: '13px',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: '#b0a090',
    marginBottom: '6px',
  },

  title: {
    fontFamily: "'Lora', Georgia, serif",
    fontWeight: 500,
    fontSize: 'clamp(26px, 5vw, 36px)',
    color: '#2d2518',
    letterSpacing: '-0.01em',
    lineHeight: 1.2,
  },

  subtitle: {
    fontFamily: "'Lora', Georgia, serif",
    fontStyle: 'italic',
    fontWeight: 400,
    fontSize: '15px',
    color: '#9a8870',
    marginTop: '4px',
  },

  card: {
    position: 'relative',
    width: '100%',
    maxWidth: '420px',
    minHeight: '320px',
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    padding: '40px 36px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 40px rgba(100, 80, 50, 0.14)',
    transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease',
    overflow: 'hidden',
    '--shadow-default': '0 8px 40px rgba(100, 80, 50, 0.14)',
    '--shadow-open': '0 20px 60px rgba(100, 80, 50, 0.22)',
    border: '1px solid rgba(196, 168, 130, 0.2)',
  },

  shimmer: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(105deg, transparent 40%, rgba(255,248,230,0.5) 50%, transparent 60%)',
    animation: 'shimmer 3s ease-in-out infinite',
    pointerEvents: 'none',
    borderRadius: '24px',
  },

  closedContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    animation: 'fadeIn 0.4s ease',
  },

  loadingContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },

  openContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    animation: 'revealIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
    width: '100%',
  },

  errorContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    textAlign: 'center',
  },

  iconWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    filter: 'drop-shadow(0 4px 12px rgba(196, 168, 130, 0.4))',
  },

  openIconWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    filter: 'drop-shadow(0 4px 16px rgba(245, 200, 66, 0.5))',
  },

  promptText: {
    fontFamily: "'Lora', Georgia, serif",
    fontWeight: 500,
    fontSize: '18px',
    color: '#2d2518',
    textAlign: 'center',
  },

  promptSubtext: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 300,
    fontSize: '13px',
    color: '#b0a090',
    textAlign: 'center',
  },

  divider: {
    width: '48px',
    height: '2px',
    borderRadius: '2px',
    background: 'linear-gradient(90deg, transparent, #c4a882, transparent)',
  },

  affirmationText: {
    fontFamily: "'Lora', Georgia, serif",
    fontWeight: 400,
    fontSize: 'clamp(17px, 3vw, 21px)',
    lineHeight: 1.65,
    color: '#2d2518',
    textAlign: 'center',
    fontStyle: 'italic',
    padding: '0 4px',
  },

  alreadyNote: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 300,
    fontSize: '12px',
    color: '#c4a882',
    letterSpacing: '0.05em',
    marginTop: '4px',
  },

  langBadge: {
    fontSize: '11px',
    color: '#b0a090',
    fontFamily: "'Inter', sans-serif",
    letterSpacing: '0.04em',
    marginTop: '4px',
  },

  hint: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 300,
    fontSize: '13px',
    color: '#b0a090',
    textAlign: 'center',
  },

  errorIcon: {
    fontSize: '32px',
  },

  errorText: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '14px',
    color: '#a07060',
    textAlign: 'center',
    maxWidth: '260px',
    lineHeight: 1.5,
  },

  retryBtn: {
    marginTop: '8px',
    padding: '8px 20px',
    borderRadius: '20px',
    border: '1px solid #c4a882',
    background: 'transparent',
    color: '#8b7355',
    fontSize: '13px',
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    transition: 'background 0.2s, color 0.2s',
  },
};
