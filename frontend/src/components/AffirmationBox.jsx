/**
 * AffirmationBox.jsx
 * Standalone frontend-only version.
 * All affirmations are embedded here; localStorage tracks the daily pick.
 */

import { useState, useEffect } from 'react';

// ─── Affirmations list ────────────────────────────────────────────────────────
const AFFIRMATIONS = [
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getLocalDate() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function getDailyAffirmation() {
  const today = getLocalDate();
  const cacheKey = `dba_${today}`;
  const cached = localStorage.getItem(cacheKey);

  if (cached) {
    try { return { affirmation: JSON.parse(cached), alreadyOpened: true }; } catch {}
  }

  // Pick a random affirmation, avoiding yesterday's if possible
  const yesterdayKey = Object.keys(localStorage).filter(k => k.startsWith('dba_') && k !== cacheKey)[0];
  let yesterdayAffirmation = null;
  if (yesterdayKey) {
    try { yesterdayAffirmation = JSON.parse(localStorage.getItem(yesterdayKey)); } catch {}
  }

  let pool = AFFIRMATIONS;
  if (yesterdayAffirmation && AFFIRMATIONS.length > 1) {
    pool = AFFIRMATIONS.filter(a => a.text !== yesterdayAffirmation.text);
  }

  const picked = pool[Math.floor(Math.random() * pool.length)];
  localStorage.setItem(cacheKey, JSON.stringify(picked));

  // Clean up old keys (keep only last 2 days)
  Object.keys(localStorage)
    .filter(k => k.startsWith('dba_') && k !== cacheKey)
    .slice(0, -1)
    .forEach(k => localStorage.removeItem(k));

  return { affirmation: picked, alreadyOpened: false };
}

const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
function formatDate() {
  const d = new Date();
  return `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const BoxClosedIcon = () => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 80, height: 80 }}>
    <rect x="8" y="34" width="64" height="40" rx="4" fill="#e8d5b8" stroke="#c4a882" strokeWidth="2"/>
    <rect x="4" y="24" width="72" height="14" rx="4" fill="#d4b896" stroke="#c4a882" strokeWidth="2"/>
    <rect x="36" y="24" width="8" height="50" fill="#c4a882" opacity="0.7"/>
    <rect x="4" y="29" width="72" height="6" fill="#c4a882" opacity="0.7"/>
    <ellipse cx="31" cy="20" rx="11" ry="8" fill="#c4a882" transform="rotate(-20 31 20)"/>
    <ellipse cx="49" cy="20" rx="11" ry="8" fill="#c4a882" transform="rotate(20 49 20)"/>
    <circle cx="40" cy="22" r="5" fill="#b89060"/>
    <circle cx="18" cy="16" r="2" fill="#f0d090" opacity="0.8"/>
    <circle cx="62" cy="12" r="1.5" fill="#f0d090" opacity="0.6"/>
    <circle cx="70" cy="22" r="1" fill="#f0d090" opacity="0.5"/>
  </svg>
);

const BoxOpenIcon = () => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 80, height: 80 }}>
    <rect x="8" y="38" width="64" height="36" rx="4" fill="#e8d5b8" stroke="#c4a882" strokeWidth="2"/>
    <rect x="36" y="38" width="8" height="36" fill="#c4a882" opacity="0.5"/>
    <rect x="6" y="10" width="68" height="14" rx="4" fill="#d4b896" stroke="#c4a882" strokeWidth="2" transform="rotate(-15 40 17)"/>
    <rect x="36" y="10" width="8" height="14" fill="#c4a882" opacity="0.5" transform="rotate(-15 40 17)"/>
    <ellipse cx="40" cy="44" rx="24" ry="8" fill="#fff8ec" opacity="0.6"/>
    <circle cx="30" cy="28" r="2.5" fill="#f5c842" opacity="0.9"/>
    <circle cx="52" cy="22" r="2" fill="#f5c842" opacity="0.8"/>
    <circle cx="42" cy="18" r="3" fill="#f5c842" opacity="0.95"/>
    <circle cx="22" cy="22" r="1.5" fill="#f5c842" opacity="0.7"/>
    <circle cx="60" cy="30" r="1.5" fill="#f5c842" opacity="0.6"/>
    <path d="M40 6 L41.2 9.6 L45 9.6 L42 11.8 L43.2 15.4 L40 13.2 L36.8 15.4 L38 11.8 L35 9.6 L38.8 9.6 Z" fill="#f5c842" opacity="0.9"/>
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────

export default function AffirmationBox() {
  const [phase, setPhase] = useState('idle'); // 'idle' | 'opening' | 'open'
  const [affirmation, setAffirmation] = useState(null);
  const [alreadyOpened, setAlreadyOpened] = useState(false);

  // On mount: check if already opened today
  useEffect(() => {
    const today = getLocalDate();
    const cached = localStorage.getItem(`dba_${today}`);
    if (cached) {
      try {
        setAffirmation(JSON.parse(cached));
        setAlreadyOpened(true);
        setPhase('open');
      } catch {}
    }
  }, []);

  function handleBoxClick() {
    if (phase !== 'idle') return;
    setPhase('opening');
    setTimeout(() => {
      const { affirmation, alreadyOpened } = getDailyAffirmation();
      setAffirmation(affirmation);
      setAlreadyOpened(alreadyOpened);
      setPhase('open');
    }, 700);
  }

  const isOpen    = phase === 'open';
  const isOpening = phase === 'opening';

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <p style={styles.dateLabel}>{formatDate()}</p>
        <h1 style={styles.title}>Daily Message</h1>
        <p style={styles.subtitle}>Послание дня</p>
      </header>

      <div
        onClick={handleBoxClick}
        style={{
          ...styles.card,
          cursor: phase === 'idle' ? 'pointer' : 'default',
        }}
        role={phase === 'idle' ? 'button' : 'article'}
        tabIndex={phase === 'idle' ? 0 : -1}
        onKeyDown={e => e.key === 'Enter' && handleBoxClick()}
      >
        {!isOpen && !isOpening && (
          <div style={styles.closedContent}>
            <div style={styles.iconWrap}><BoxClosedIcon /></div>
            <p style={styles.promptText}>Open your daily message</p>
            <p style={styles.promptSubtext}>Tap to reveal today's affirmation</p>
          </div>
        )}

        {isOpening && (
          <div style={styles.loadingContent}>
            <div style={{ ...styles.iconWrap, animation: 'pulse 1s ease-in-out infinite' }}>
              <BoxOpenIcon />
            </div>
            <p style={styles.promptText}>Opening…</p>
          </div>
        )}

        {isOpen && affirmation && (
          <div style={styles.openContent}>
            <div style={styles.openIconWrap}><BoxOpenIcon /></div>
            <div style={styles.divider} />
            <p style={styles.affirmationText}>{affirmation.text}</p>
            {alreadyOpened && <p style={styles.alreadyNote}>✦ Today's message</p>}
            <span style={styles.langBadge}>
              {affirmation.lang === 'ru' ? '🇷🇺 RU' : '🇺🇸 EN'}
            </span>
          </div>
        )}

        {phase === 'idle' && <div style={styles.shimmer} />}
      </div>

      {phase === 'idle' && <p style={styles.hint}>A new message awaits every day 🌿</p>}
      {isOpen && <p style={styles.hint}>Come back tomorrow for a new message ✨</p>}
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  page: { display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100vh', padding:'24px 16px', gap:'28px' },
  header: { textAlign:'center' },
  dateLabel: { fontFamily:"'Inter',sans-serif", fontWeight:300, fontSize:'13px', letterSpacing:'0.15em', textTransform:'uppercase', color:'#b0a090', marginBottom:'6px' },
  title: { fontFamily:"'Lora',Georgia,serif", fontWeight:500, fontSize:'clamp(26px,5vw,36px)', color:'#2d2518', letterSpacing:'-0.01em', lineHeight:1.2 },
  subtitle: { fontFamily:"'Lora',Georgia,serif", fontStyle:'italic', fontWeight:400, fontSize:'15px', color:'#9a8870', marginTop:'4px' },
  card: { position:'relative', width:'100%', maxWidth:'420px', minHeight:'320px', backgroundColor:'#ffffff', borderRadius:'24px', padding:'40px 36px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', boxShadow:'0 8px 40px rgba(100,80,50,0.14)', transition:'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)', overflow:'hidden', border:'1px solid rgba(196,168,130,0.2)' },
  shimmer: { position:'absolute', inset:0, background:'linear-gradient(105deg,transparent 40%,rgba(255,248,230,0.5) 50%,transparent 60%)', animation:'shimmer 3s ease-in-out infinite', pointerEvents:'none', borderRadius:'24px' },
  closedContent: { display:'flex', flexDirection:'column', alignItems:'center', gap:'16px', animation:'fadeIn 0.4s ease' },
  loadingContent: { display:'flex', flexDirection:'column', alignItems:'center', gap:'16px' },
  openContent: { display:'flex', flexDirection:'column', alignItems:'center', gap:'16px', animation:'revealIn 0.6s cubic-bezier(0.34,1.56,0.64,1)', width:'100%' },
  iconWrap: { display:'flex', alignItems:'center', justifyContent:'center', filter:'drop-shadow(0 4px 12px rgba(196,168,130,0.4))' },
  openIconWrap: { display:'flex', alignItems:'center', justifyContent:'center', filter:'drop-shadow(0 4px 16px rgba(245,200,66,0.5))' },
  promptText: { fontFamily:"'Lora',Georgia,serif", fontWeight:500, fontSize:'18px', color:'#2d2518', textAlign:'center' },
  promptSubtext: { fontFamily:"'Inter',sans-serif", fontWeight:300, fontSize:'13px', color:'#b0a090', textAlign:'center' },
  divider: { width:'48px', height:'2px', borderRadius:'2px', background:'linear-gradient(90deg,transparent,#c4a882,transparent)' },
  affirmationText: { fontFamily:"'Lora',Georgia,serif", fontWeight:400, fontSize:'clamp(17px,3vw,21px)', lineHeight:1.65, color:'#2d2518', textAlign:'center', fontStyle:'italic', padding:'0 4px' },
  alreadyNote: { fontFamily:"'Inter',sans-serif", fontWeight:300, fontSize:'12px', color:'#c4a882', letterSpacing:'0.05em', marginTop:'4px' },
  langBadge: { fontSize:'11px', color:'#b0a090', fontFamily:"'Inter',sans-serif", letterSpacing:'0.04em', marginTop:'4px' },
  hint: { fontFamily:"'Inter',sans-serif", fontWeight:300, fontSize:'13px', color:'#b0a090', textAlign:'center' },
};
