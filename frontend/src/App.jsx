/**
 * App.jsx
 * Root component. Renders the layout and the AffirmationBox.
 */

import AffirmationBox from './components/AffirmationBox';

// ─── Keyframe animations injected into the document ──────────────────────────
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

  /* Hover effect for the closed card */
  [role="button"]:hover {
    transform: translateY(-3px) scale(1.01) !important;
    box-shadow: 0 16px 50px rgba(100, 80, 50, 0.20) !important;
  }

  [role="button"]:active {
    transform: scale(0.98) !important;
  }

  /* Retry button hover */
  button:hover {
    background: #f5ede0 !important;
  }
`;

export default function App() {
  return (
    <>
      {/* Inject global keyframes */}
      <style>{GLOBAL_STYLES}</style>

      {/* Main layout */}
      <main>
        <AffirmationBox />
      </main>

      {/* Subtle footer */}
      <footer style={{
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
      }}>
        Daily Box Affirmations ✦ One message, one day
      </footer>
    </>
  );
}
