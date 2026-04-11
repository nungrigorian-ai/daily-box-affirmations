/**
 * CycleTracker.jsx
 * Displays current cycle day, phase, energy insight, and predictions.
 * All calculation is local — no external API.
 */

// ─── Cycle phase definitions ──────────────────────────────────────────────────

const PHASES = {
  menstrual: {
    en: {
      name: 'Menstrual',
      emoji: '🌑',
      tagline: 'Rest & release',
      energy: 'Your energy is at its lowest — and that is completely natural. Your body is doing deep, powerful work right now.',
      body: 'You may feel cramps, fatigue, or heaviness. Heat, rest, and gentle movement are your allies.',
      mood: 'Emotions can feel closer to the surface. Be extra gentle with yourself today.',
      doList: ['Warm baths or a heating pad', 'Slow walks or gentle yoga', 'Iron-rich foods (lentils, leafy greens)', 'Journal or reflect quietly'],
      dontList: ['Intense workouts or HIIT', 'Overloading your schedule', 'Judging yourself for needing rest'],
    },
    ru: {
      name: 'Менструация',
      emoji: '🌑',
      tagline: 'Отдых и отпускание',
      energy: 'Твоя энергия сейчас на минимуме — и это совершенно естественно. Твоё тело делает глубокую, мощную работу.',
      body: 'Ты можешь чувствовать спазмы, усталость или тяжесть. Тепло, отдых и мягкое движение — твои союзники.',
      mood: 'Эмоции могут быть ближе к поверхности. Будь особенно мягкой с собой сегодня.',
      doList: ['Тёплая ванна или грелка', 'Медленные прогулки или йога', 'Пища богатая железом (чечевица, зелень)', 'Журнал или тихие размышления'],
      dontList: ['Интенсивные тренировки', 'Перегружать расписание', 'Осуждать себя за потребность в отдыхе'],
    },
    color: '#9b6b8a',
    bg: '#f9f0f5',
    border: '#e8c5d8',
  },
  follicular: {
    en: {
      name: 'Follicular',
      emoji: '🌒',
      tagline: 'Rising & awakening',
      energy: 'Estrogen is climbing and so is your vitality. You may feel a fresh spark of motivation and mental clarity starting to emerge.',
      body: 'Your body feels lighter and more capable. This is a wonderful time to try new things or restart habits.',
      mood: 'Optimism and curiosity tend to rise in this phase. New ideas feel exciting and possible.',
      doList: ['Start a new project or habit', 'Social plans and meetings', 'Brainstorming and creative work', 'Trying something different'],
      dontList: ['Hiding away when you feel social', 'Overplanning before the energy fully arrives', 'Ignoring the good ideas coming to you'],
    },
    ru: {
      name: 'Фолликулярная',
      emoji: '🌒',
      tagline: 'Подъём и пробуждение',
      energy: 'Эстроген растёт, и вместе с ним твоя жизненная сила. Ты можешь почувствовать свежую искру мотивации и ясность ума.',
      body: 'Тело чувствует себя легче и способнее. Отличное время, чтобы попробовать что-то новое или восстановить привычки.',
      mood: 'Оптимизм и любопытство растут в этой фазе. Новые идеи кажутся захватывающими и возможными.',
      doList: ['Начать новый проект или привычку', 'Социальные планы и встречи', 'Мозговой штурм и творческая работа', 'Пробовать что-то новое'],
      dontList: ['Прятаться, когда хочется общаться', 'Перегружать планы до прихода энергии', 'Игнорировать хорошие идеи'],
    },
    color: '#7a9e8a',
    bg: '#f0f6f2',
    border: '#bcd8c8',
  },
  ovulation: {
    en: {
      name: 'Ovulation',
      emoji: '🌕',
      tagline: 'Peak power & radiance',
      energy: 'This is your peak. Estrogen and testosterone are at their highest — you may feel magnetic, confident, and full of energy.',
      body: 'Physical strength and stamina are at their best. Your body is literally glowing.',
      mood: 'You tend to feel more extroverted, expressive, and open. People are drawn to you right now.',
      doList: ['Important meetings, presentations, or dates', 'High-intensity workouts', 'Connect with people you love', 'Ask for what you want'],
      dontList: ['Wasting this energy on things that don\'t matter', 'Saying yes to everything (protect your peak)', 'Forgetting to hydrate — your body works harder now'],
    },
    ru: {
      name: 'Овуляция',
      emoji: '🌕',
      tagline: 'Пик силы и сияния',
      energy: 'Это твой пик. Эстроген и тестостерон на максимуме — ты можешь чувствовать себя магнетичной, уверенной и полной энергии.',
      body: 'Физическая сила и выносливость на высоте. Твоё тело буквально светится.',
      mood: 'Ты склонна чувствовать себя более экстравертной, выразительной и открытой. Люди тянутся к тебе.',
      doList: ['Важные встречи, презентации или свидания', 'Интенсивные тренировки', 'Общаться с близкими людьми', 'Просить о том, чего хочешь'],
      dontList: ['Тратить энергию на неважное', 'Соглашаться на всё (защити свой пик)', 'Забывать пить воду — тело работает усерднее'],
    },
    color: '#c4943a',
    bg: '#fdf6ec',
    border: '#f0d8a8',
  },
  luteal: {
    en: {
      name: 'Luteal',
      emoji: '🌘',
      tagline: 'Slowing & turning inward',
      energy: 'Progesterone rises and energy begins to slow. Your body is preparing — this phase is about completion, not launching.',
      body: 'You may notice bloating, breast tenderness, or appetite changes. These are normal. Nourish yourself well.',
      mood: 'Your inner critic can get louder. Notice it without believing every thought. This phase has a beautiful depth to it.',
      doList: ['Finishing tasks already in progress', 'Self-care and nourishing food', 'Honest conversations and reflection', 'Reducing caffeine and alcohol'],
      dontList: ['Starting too many new things', 'Pushing through fatigue without rest', 'Taking criticism too personally right now'],
    },
    ru: {
      name: 'Лютеиновая',
      emoji: '🌘',
      tagline: 'Замедление и погружение внутрь',
      energy: 'Прогестерон растёт, и энергия начинает замедляться. Твоё тело готовится — эта фаза про завершение, а не старт.',
      body: 'Ты можешь заметить вздутие, чувствительность груди или изменение аппетита. Это нормально. Питай себя хорошо.',
      mood: 'Внутренний критик может стать громче. Замечай это, не веря каждой мысли. В этой фазе есть своя глубина.',
      doList: ['Завершать уже начатое', 'Забота о себе и питательная еда', 'Честные разговоры и рефлексия', 'Меньше кофеина и алкоголя'],
      dontList: ['Начинать слишком много нового', 'Пересиливать усталость без отдыха', 'Принимать критику слишком близко к сердцу'],
    },
    color: '#7a6ea0',
    bg: '#f4f0f9',
    border: '#ccc0e0',
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function daysBetween(d1, d2) {
  return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
}

function getCycleDay(startIso, cycleLen) {
  const start = new Date(startIso + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = daysBetween(start, today);
  // Normalize into current cycle (handle multiple cycles passed)
  return (diff % cycleLen) + 1;
}

function getPhase(cycleDay, cycleLen, periodLen) {
  const ovDay = Math.round(cycleLen / 2);
  if (cycleDay <= periodLen)                        return 'menstrual';
  if (cycleDay <= ovDay - 1)                        return 'follicular';
  if (cycleDay <= ovDay + 1)                        return 'ovulation';
  return 'luteal';
}

function getNextPeriodDays(cycleDay, cycleLen) {
  return cycleLen - cycleDay + 1;
}

function getFertileWindow(cycleLen) {
  const ov = Math.round(cycleLen / 2);
  return { start: ov - 4, end: ov + 1 };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CycleTracker({ cycleData, lang = 'en', onReset }) {
  const { start, cycleLen, periodLen } = cycleData;

  const cycleDay   = getCycleDay(start, cycleLen);
  const phaseName  = getPhase(cycleDay, cycleLen, periodLen);
  const phase      = PHASES[phaseName];
  const content    = phase[lang] || phase.en;
  const daysLeft   = getNextPeriodDays(cycleDay, cycleLen);
  const fertile    = getFertileWindow(cycleLen);
  const isFertile  = cycleDay >= fertile.start && cycleDay <= fertile.end;
  const progress   = Math.round((cycleDay / cycleLen) * 100);

  const t = lang === 'ru' ? {
    dayOf:      `День ${cycleDay} из ${cycleLen}`,
    nextPeriod: daysLeft === 1 ? 'Завтра начинаются месячные' : `До следующих месячных: ${daysLeft} дн.`,
    fertile:    isFertile ? '🌿 Фертильное окно' : '',
    energy:     'Энергия',
    body:       'Тело',
    mood:       'Настроение',
    lean:       '✅ Сегодня хорошо',
    avoid:      '🌿 Лучше избегать',
    change:     'Изменить данные цикла',
  } : {
    dayOf:      `Day ${cycleDay} of ${cycleLen}`,
    nextPeriod: daysLeft === 1 ? 'Your period starts tomorrow' : `Next period in ${daysLeft} days`,
    fertile:    isFertile ? '🌿 Fertile window' : '',
    energy:     'Energy',
    body:       'Body',
    mood:       'Mood',
    lean:       '✅ Lean into',
    avoid:      '🌿 Be mindful of',
    change:     'Change my cycle data',
  };

  return (
    <div style={styles.page}>

      {/* Phase hero */}
      <div style={{ ...styles.heroCard, backgroundColor: phase.bg, borderColor: phase.border }}>
        <div style={styles.heroTop}>
          <span style={styles.phaseEmoji}>{content.emoji}</span>
          <div style={styles.heroLabels}>
            <p style={{ ...styles.phaseName, color: phase.color }}>{content.name}</p>
            <p style={styles.phaseTagline}>{content.tagline}</p>
          </div>
        </div>

        {/* Cycle progress bar */}
        <div style={styles.progressWrap}>
          <div style={styles.progressTrack}>
            <div style={{ ...styles.progressFill, width: `${progress}%`, backgroundColor: phase.color }} />
            <div style={{ ...styles.progressDot, left: `calc(${progress}% - 7px)`, backgroundColor: phase.color }} />
          </div>
          <div style={styles.progressLabels}>
            <span style={styles.progLabel}>{t.dayOf}</span>
            <span style={{ ...styles.progLabel, color: phase.color }}>{t.nextPeriod}</span>
          </div>
        </div>

        {isFertile && (
          <div style={{ ...styles.fertileBadge, borderColor: phase.border, color: phase.color }}>
            {t.fertile}
          </div>
        )}
      </div>

      {/* Energy / body / mood */}
      <div style={{ ...styles.insightCard, borderColor: phase.border + '80' }}>
        <InsightRow label={t.energy} text={content.energy} color={phase.color} icon="⚡" />
        <div style={{ ...styles.insightDivider, backgroundColor: phase.border }} />
        <InsightRow label={t.body}   text={content.body}   color={phase.color} icon="🌿" />
        <div style={{ ...styles.insightDivider, backgroundColor: phase.border }} />
        <InsightRow label={t.mood}   text={content.mood}   color={phase.color} icon="💭" />
      </div>

      {/* Do / Don't */}
      <div style={{ ...styles.guidanceCard, borderColor: phase.border + '80' }}>
        <p style={{ ...styles.guidanceTitle, color: '#5a7a5a' }}>{t.lean}</p>
        {content.doList.map((item, i) => (
          <div key={i} style={styles.guidanceItem}>
            <span style={{ ...styles.guidanceDot, backgroundColor: '#5a7a5a' }} />
            <p style={styles.guidanceText}>{item}</p>
          </div>
        ))}
        <div style={{ height: '12px' }} />
        <p style={{ ...styles.guidanceTitle, color: '#8a5a4a' }}>{t.avoid}</p>
        {content.dontList.map((item, i) => (
          <div key={i} style={styles.guidanceItem}>
            <span style={{ ...styles.guidanceDot, backgroundColor: '#c4a882' }} />
            <p style={styles.guidanceText}>{item}</p>
          </div>
        ))}
      </div>

      <button style={styles.resetBtn} onClick={onReset}>{t.change}</button>
    </div>
  );
}

function InsightRow({ label, text, color, icon }) {
  return (
    <div style={styles.insightRow}>
      <span style={styles.insightIcon}>{icon}</span>
      <div style={styles.insightBody}>
        <p style={{ ...styles.insightLabel, color }}>{label}</p>
        <p style={styles.insightText}>{text}</p>
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  page: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    boxSizing: 'border-box',
  },

  heroCard: {
    width: '100%',
    boxSizing: 'border-box',
    borderRadius: '20px',
    border: '1px solid',
    padding: '20px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  heroTop: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  phaseEmoji: {
    fontSize: '40px',
    lineHeight: 1,
    flexShrink: 0,
  },
  heroLabels: { minWidth: 0 },
  phaseName: {
    fontFamily: "'Lora', Georgia, serif",
    fontWeight: 500,
    fontSize: '22px',
    margin: 0,
    lineHeight: 1.2,
  },
  phaseTagline: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 300,
    fontSize: '13px',
    color: '#9a8870',
    margin: '4px 0 0',
  },

  progressWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  progressTrack: {
    position: 'relative',
    height: '6px',
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: '3px',
    overflow: 'visible',
  },
  progressFill: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 0.6s ease',
  },
  progressDot: {
    position: 'absolute',
    top: '-4px',
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    border: '2px solid #fff',
    boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
  },
  progressLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progLabel: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '11px',
    color: '#9a8870',
    fontWeight: 400,
  },
  fertileBadge: {
    alignSelf: 'flex-start',
    padding: '4px 10px',
    borderRadius: '20px',
    border: '1px solid',
    fontFamily: "'Inter', sans-serif",
    fontSize: '12px',
    fontWeight: 500,
  },

  insightCard: {
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: '#faf7f2',
    borderRadius: '20px',
    border: '1px solid',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  insightRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
    minWidth: 0,
  },
  insightIcon: {
    fontSize: '18px',
    lineHeight: 1,
    flexShrink: 0,
    marginTop: '2px',
  },
  insightBody: { minWidth: 0 },
  insightLabel: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 600,
    fontSize: '11px',
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    margin: '0 0 4px',
  },
  insightText: {
    fontFamily: "'Lora', Georgia, serif",
    fontSize: '13px',
    lineHeight: 1.65,
    color: '#4a3d2e',
    margin: 0,
    wordBreak: 'break-word',
  },
  insightDivider: {
    width: '100%',
    height: '1px',
    opacity: 0.4,
  },

  guidanceCard: {
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: '#faf7f2',
    borderRadius: '20px',
    border: '1px solid',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  guidanceTitle: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 500,
    fontSize: '11px',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    margin: '0 0 4px',
  },
  guidanceItem: {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start',
    minWidth: 0,
  },
  guidanceDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    marginTop: '7px',
    flexShrink: 0,
  },
  guidanceText: {
    fontFamily: "'Lora', Georgia, serif",
    fontSize: '14px',
    color: '#4a3d2e',
    lineHeight: 1.55,
    margin: 0,
    wordBreak: 'break-word',
  },

  resetBtn: {
    alignSelf: 'center',
    background: 'transparent',
    border: 'none',
    fontFamily: "'Inter', sans-serif",
    fontSize: '12px',
    color: '#b0a090',
    cursor: 'pointer',
    textDecoration: 'underline',
    padding: '4px 8px',
    marginBottom: '8px',
  },
};
