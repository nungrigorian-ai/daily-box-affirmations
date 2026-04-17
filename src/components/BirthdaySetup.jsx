/**
 * BirthdaySetup.jsx
 * Shown on first visit. Asks for the user's birthday and saves to localStorage.
 */

import { useState } from 'react';

export default function BirthdaySetup({ onSave }) {
  const [month, setMonth] = useState('');
  const [day, setDay]     = useState('');
  const [error, setError] = useState('');

  const MONTHS = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];

  function handleSave() {
    const m = parseInt(month);
    const d = parseInt(day);
    if (!m || !d || d < 1 || d > 31) {
      setError('Please enter a valid date.');
      return;
    }
    localStorage.setItem('dba_birthday', JSON.stringify({ month: m, day: d }));
    onSave({ month: m, day: d });
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>

        <div style={styles.moonIcon}>🌸</div>
        <h2 style={styles.title}>Welcome to your Women's Space</h2>
        <p style={styles.subtitle}>
          Enter your birthday so we can personalise your daily astrology guidance.
        </p>

        <div style={styles.row}>
          {/* Month selector */}
          <select
            value={month}
            onChange={e => { setMonth(e.target.value); setError(''); }}
            style={styles.select}
          >
            <option value="">Month</option>
            {MONTHS.map((m, i) => (
              <option key={m} value={i + 1}>{m}</option>
            ))}
          </select>

          {/* Day input */}
          <input
            type="number"
            min="1"
            max="31"
            placeholder="Day"
            value={day}
            onChange={e => { setDay(e.target.value); setError(''); }}
            style={styles.input}
          />
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <p style={styles.note}>
          We only use your birth day and month — no year needed. 🌿
        </p>

        <button
          onClick={handleSave}
          style={{ ...styles.btn, opacity: month && day ? 1 : 0.5 }}
        >
          Begin my journey ✨
        </button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: '#f5f0eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    padding: '24px',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '24px',
    padding: '40px 32px',
    maxWidth: '380px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 8px 40px rgba(100,80,50,0.12)',
    border: '1px solid rgba(196,168,130,0.2)',
    animation: 'fadeIn 0.5s ease',
  },
  moonIcon: {
    fontSize: '48px',
    marginBottom: '4px',
  },
  title: {
    fontFamily: "'Lora', Georgia, serif",
    fontWeight: 500,
    fontSize: '22px',
    color: '#2d2518',
    textAlign: 'center',
    margin: 0,
    lineHeight: 1.3,
  },
  subtitle: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 300,
    fontSize: '14px',
    color: '#7a6a55',
    textAlign: 'center',
    lineHeight: 1.6,
    margin: 0,
  },
  row: {
    display: 'flex',
    gap: '12px',
    width: '100%',
    marginTop: '8px',
  },
  select: {
    flex: 2,
    padding: '12px 14px',
    borderRadius: '12px',
    border: '1px solid #d8ccc0',
    backgroundColor: '#faf7f2',
    fontFamily: "'Inter', sans-serif",
    fontSize: '14px',
    color: '#2d2518',
    outline: 'none',
    cursor: 'pointer',
  },
  input: {
    flex: 1,
    padding: '12px 14px',
    borderRadius: '12px',
    border: '1px solid #d8ccc0',
    backgroundColor: '#faf7f2',
    fontFamily: "'Inter', sans-serif",
    fontSize: '14px',
    color: '#2d2518',
    outline: 'none',
    textAlign: 'center',
  },
  error: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '12px',
    color: '#c07060',
    margin: 0,
  },
  note: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 300,
    fontSize: '12px',
    color: '#b0a090',
    textAlign: 'center',
    margin: 0,
  },
  btn: {
    marginTop: '8px',
    width: '100%',
    padding: '14px',
    borderRadius: '14px',
    border: 'none',
    backgroundColor: '#8b7355',
    color: '#fff',
    fontFamily: "'Lora', Georgia, serif",
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background 0.2s',
    letterSpacing: '0.02em',
  },
};
