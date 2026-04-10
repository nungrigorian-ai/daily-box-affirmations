/**
 * App.jsx
 * Root component. Renders the affirmation box and moon phase tracker.
 */

import AffirmationBox from './components/AffirmationBox';
import MoonPhase from './components/MoonPhase';

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
    box-shadow: 0 16px 50px rgba(100, 80, 50, 0.20) !important;
  }

  [role="button"]:active {
    transform: scale(0.98) !important;
  }

  button:hover {
    background: #f5ede0 !important;
  }
`;

export default function App() {
  return (
    <>
      <style>{GLOBAL_STYLES}</style>

      <main style={styles.main}>
        {/* Daily affirmation box */}
        <AffirmationBox />

        {/* Section divider */}
        <div style={styles.sectionDivider}>
          <div style={styles.dividerLine} />
          <span style={styles.dividerText}>🌿 lunar energy</span>
          <div style={styles.dividerLine} />
        </div>

        {/* Moon phase tracker */}
        <MoonPhase />
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
    padding: '40px 16px 80px',
    gap: '32px',
    width: '100%',
    maxWidth: '480px',
    margin: '0 auto',
  },
  sectionDivider: {
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
};
