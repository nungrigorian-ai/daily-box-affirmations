/**
 * CycleSetup.jsx
 * First-time setup: user enters last period start date + average cycle length.
 * Stores to localStorage: dba_cycle_start (ISO date string), dba_cycle_length (number).
 */

import { useState } from 'react';

export default function CycleSetup({ onSave, lang = 'en' }) {
  const today = new Date();
  const [year,  setYear]  = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [day,   setDay]   = useState(today.getDate());
  const [cycleLen, setCycleLen] = useState(28);
  const [periodLen, setPeriodLen] = useState(5);
  const [error, setError] = useState('');

  const t = lang === 'ru' ? {
    title:       'Твой цикл',
    sub:         'Расскажи нам немного о своём цикле',
    lastPeriod:  'Первый день последних месячных',
    cycleLength: 'Длина цикла (дни)',
    periodLength:'Длина месячных (дни)',
    save:        'Сохранить',
    privacy:     'Всё хранится только на твоём устройстве',
    err:         'Пожалуйста, выбери корректную дату',
  } : {
    title:       'Your Cycle',
    sub:         'Tell us a little about your cycle',
    lastPeriod:  'First day of your last period',
    cycleLength: 'Cycle length (days)',
    periodLength:'Period length (days)',
    save:        'Save',
    privacy:     'Everything is stored only on your device',
    err:         'Please choose a valid date',
  };

  const MONTHS = lang === 'ru'
    ? ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек']
    : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  function handleSave() {
    const date = new Date(year, month - 1, day);
    if (isNaN(date.getTime()) || date > new Date()) {
      setError(t.err);
      return;
    }
    const iso = `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    localStorage.setItem('dba_cycle_start', iso);
    localStorage.setItem('dba_cycle_length', String(cycleLen));
    localStorage.setItem('dba_period_length', String(periodLen));
    onSave({ start: iso, cycleLen, periodLen });
  }

  const daysInMonth = new Date(year, month, 0).getDate();

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.iconRow}>🌸</div>
        <h2 style={styles.title}>{t.title}</h2>
        <p style={styles.sub}>{t.sub}</p>

        {/* Last period date */}
        <div style={styles.field}>
          <label style={styles.label}>{t.lastPeriod}</label>
          <div style={styles.dateRow}>
            <select style={styles.select} value={month} onChange={e => { setMonth(+e.target.value); setDay(1); }}>
              {MONTHS.map((m, i) => <option key={i} value={i+1}>{m}</option>)}
            </select>
            <select style={styles.selectSmall} value={day} onChange={e => setDay(+e.target.value)}>
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <select style={styles.selectSmall} value={year} onChange={e => setYear(+e.target.value)}>
              {[today.getFullYear(), today.getFullYear() - 1].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Cycle length */}
        <div style={styles.field}>
          <label style={styles.label}>{t.cycleLength}</label>
          <div style={styles.sliderRow}>
            <input
              type="range" min={21} max={40} value={cycleLen}
              onChange={e => setCycleLen(+e.target.value)}
              style={styles.slider}
            />
            <span style={styles.sliderValue}>{cycleLen}</span>
          </div>
        </div>

        {/* Period length */}
        <div style={styles.field}>
          <label style={styles.label}>{t.periodLength}</label>
          <div style={styles.sliderRow}>
            <input
              type="range" min={2} max={10} value={periodLen}
              onChange={e => setPeriodLen(+e.target.value)}
              style={styles.slider}
            />
            <span style={styles.sliderValue}>{periodLen}</span>
          </div>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <button style={styles.btn} onClick={handleSave}>{t.save}</button>
        <p style={styles.privacy}>🔒 {t.privacy}</p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 16px',
    boxSizing: 'border-box',
  },
  card: {
    width: '100%',
    maxWidth: '380px',
    backgroundColor: '#fff',
    borderRadius: '24px',
    padding: '32px 24px',
    boxShadow: '0 4px 24px rgba(100,60,80,0.10)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '18px',
    boxSizing: 'border-box',
  },
  iconRow: { fontSize: '42px', lineHeight: 1 },
  title: {
    fontFamily: "'Lora', Georgia, serif",
    fontWeight: 500,
    fontSize: '24px',
    color: '#2d2518',
    margin: 0,
    textAlign: 'center',
  },
  sub: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 300,
    fontSize: '13px',
    color: '#9a8870',
    textAlign: 'center',
    margin: 0,
  },
  field: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '11px',
    fontWeight: 500,
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    color: '#9a8870',
  },
  dateRow: {
    display: 'flex',
    gap: '8px',
    width: '100%',
  },
  select: {
    flex: 2,
    padding: '10px 8px',
    borderRadius: '10px',
    border: '1px solid #e0d5c8',
    backgroundColor: '#faf7f2',
    fontFamily: "'Inter', sans-serif",
    fontSize: '14px',
    color: '#2d2518',
    appearance: 'none',
    WebkitAppearance: 'none',
    cursor: 'pointer',
    boxSizing: 'border-box',
  },
  selectSmall: {
    flex: 1,
    padding: '10px 6px',
    borderRadius: '10px',
    border: '1px solid #e0d5c8',
    backgroundColor: '#faf7f2',
    fontFamily: "'Inter', sans-serif",
    fontSize: '14px',
    color: '#2d2518',
    appearance: 'none',
    WebkitAppearance: 'none',
    cursor: 'pointer',
    boxSizing: 'border-box',
  },
  sliderRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  slider: {
    flex: 1,
    accentColor: '#c4a882',
    cursor: 'pointer',
  },
  sliderValue: {
    fontFamily: "'Lora', Georgia, serif",
    fontSize: '20px',
    fontWeight: 500,
    color: '#8b7355',
    minWidth: '32px',
    textAlign: 'center',
  },
  error: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '13px',
    color: '#c0392b',
    textAlign: 'center',
    margin: 0,
  },
  btn: {
    width: '100%',
    padding: '14px',
    borderRadius: '14px',
    border: 'none',
    background: 'linear-gradient(135deg, #c4a882, #a8846e)',
    color: '#fff',
    fontFamily: "'Lora', Georgia, serif",
    fontSize: '16px',
    fontWeight: 500,
    cursor: 'pointer',
    letterSpacing: '0.02em',
    marginTop: '4px',
  },
  privacy: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 300,
    fontSize: '11px',
    color: '#c4b8a8',
    textAlign: 'center',
    margin: 0,
  },
};
