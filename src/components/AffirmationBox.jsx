/**
 * AffirmationBox.jsx
 * Standalone frontend-only version.
 * All affirmations are embedded here; localStorage tracks the daily pick.
 */

import { useState, useEffect } from 'react';

// ─── Affirmations list ────────────────────────────────────────────────────────
const AFFIRMATIONS = [
  // ── English ──────────────────────────────────────────────────────────────────
  { text: "You are enough exactly as you are — not when you lose the weight, finish the project, or figure everything out. Right now.", lang: "en" },
  { text: "It's okay that today is hard. Hard days are part of a real life, not proof that something is wrong with you.", lang: "en" },
  { text: "You don't have to earn rest. You are allowed to stop.", lang: "en" },
  { text: "The love you pour into others — you deserve some of that too.", lang: "en" },
  { text: "You have already survived things that once felt impossible. Remember that today.", lang: "en" },
  { text: "Your sensitivity is not weakness. It means you actually feel this life.", lang: "en" },
  { text: "Something in you keeps going. That thing is extraordinary.", lang: "en" },
  { text: "You are allowed to want more — for yourself, your life, your joy.", lang: "en" },
  { text: "Not every relationship you lose was your fault. Some things simply run their course.", lang: "en" },
  { text: "The quietness inside you right now is not emptiness. It's space being made for something new.", lang: "en" },
  { text: "You don't need to have it all together to deserve good things.", lang: "en" },
  { text: "Your body has carried you through every hard moment. Treat it with the tenderness it deserves.", lang: "en" },
  { text: "Healing is not linear. Going backwards sometimes is still going.", lang: "en" },
  { text: "The version of you from five years ago would be proud of who you are now.", lang: "en" },
  { text: "You are not a burden. You are a human being who sometimes needs help — that is completely different.", lang: "en" },
  { text: "It's okay to outgrow things — places, habits, even people — without guilt.", lang: "en" },
  { text: "Rest is not laziness. It is the soil that everything good grows from.", lang: "en" },
  { text: "You are not behind. You are on your own path, at your own pace, and that is valid.", lang: "en" },
  { text: "The fact that you are trying — even quietly, even imperfectly — counts for everything.", lang: "en" },
  { text: "You are worthy of a love that doesn't make you question yourself.", lang: "en" },
  { text: "Today doesn't have to be perfect to be beautiful.", lang: "en" },
  { text: "You are not too much. You've just been surrounded by people with too little capacity.", lang: "en" },
  { text: "Your dreams are not silly. They are the wisest part of you speaking.", lang: "en" },
  { text: "Every time you choose kindness — toward others or yourself — you make the world softer.", lang: "en" },
  { text: "You are still becoming. That is not a flaw, it is the whole point.", lang: "en" },
  { text: "The answers will come. You do not need to force them today.", lang: "en" },
  { text: "Something good is finding its way to you, even on days when you can't feel it yet.", lang: "en" },
  { text: "You are allowed to change your mind. About relationships, paths, beliefs — all of it.", lang: "en" },
  { text: "Your presence in someone's life has mattered more than you will ever know.", lang: "en" },
  { text: "Let today be gentle. You are allowed to move slowly.", lang: "en" },
  { text: "You have a right to take up space — in rooms, in conversations, in your own life.", lang: "en" },
  { text: "The things that make you different are the things that make you memorable.", lang: "en" },
  { text: "You are not stuck. You are in transition. There is a difference.", lang: "en" },
  { text: "Choose one small act of self-care today. Just one. That is enough.", lang: "en" },
  { text: "Your intuition has been quietly right about things more times than you've given it credit for.", lang: "en" },
  { text: "You do not have to earn your place in any room. You belong.", lang: "en" },
  { text: "Letting go of what no longer fits is not giving up. It is growing up.", lang: "en" },
  { text: "You are allowed to feel joy — real, unguarded, unapologetic joy — today.", lang: "en" },
  { text: "The strength you used to survive difficult seasons is still inside you. It didn't leave.", lang: "en" },
  { text: "You are more resilient than the story you've been telling yourself about your limits.", lang: "en" },
  { text: "Not every day will sparkle. Some days are just for getting through — and that is okay.", lang: "en" },
  { text: "You deserve friendships that feel like relief, not effort.", lang: "en" },
  { text: "The right people will love the real you — not a polished, filtered version.", lang: "en" },
  { text: "Somewhere, right now, something is quietly working out in your favour.", lang: "en" },
  { text: "You are allowed to prioritise your own happiness without explaining yourself.", lang: "en" },
  { text: "Even on your most ordinary day, you are doing something that matters.", lang: "en" },
  { text: "Your worth was never tied to your productivity. You are valuable simply because you exist.", lang: "en" },
  { text: "You are not responsible for managing other people's reactions to your truth.", lang: "en" },
  { text: "The chapter you're in right now is not the whole book.", lang: "en" },
  { text: "Trust yourself more. You know more than you're giving yourself credit for.", lang: "en" },
  { text: "It's okay to need people. Connection is not weakness — it is what we are made for.", lang: "en" },
  { text: "You are planting seeds in your life that you will be grateful for later. Keep going.", lang: "en" },
  { text: "Peace is available to you today — not when life is perfect, but right here in the imperfect.", lang: "en" },
  { text: "You are brave enough to begin again. You have done it before.", lang: "en" },
  { text: "The best thing you can give the world is a version of yourself that feels whole.", lang: "en" },
  { text: "Your struggles have not defined you. They have shaped you — and there's a difference.", lang: "en" },
  { text: "You are exactly where you need to be, even when it doesn't feel that way.", lang: "en" },
  { text: "Today, just breathe. Sometimes that's the bravest thing you can do.", lang: "en" },
  { text: "You are a woman of depth, grace, and quiet power — even on the days you forget it.", lang: "en" },
  { text: "What you're going through right now is making you someone you haven't met yet.", lang: "en" },
  { text: "You are allowed to want a life that feels good from the inside, not just looks good from the outside.", lang: "en" },
  { text: "Everything you need to move forward already lives inside you.", lang: "en" },
  { text: "There is beauty in where you are, even if it's hard to see it today.", lang: "en" },
  { text: "You have permission to rest before you're completely exhausted.", lang: "en" },
  { text: "The kindness you show yourself today will ripple outward in ways you can't imagine.", lang: "en" },
  { text: "You are not a work in progress to be finished. You are a life being lived.", lang: "en" },
  { text: "Something about you — your laugh, your way of seeing things, your heart — is irreplaceable.", lang: "en" },
  { text: "This moment is temporary. The strength you're building is permanent.", lang: "en" },
  { text: "You are allowed to be both grateful and hungry for more.", lang: "en" },
  { text: "Give yourself the same compassion you would give your closest friend.", lang: "en" },
  { text: "You are not alone in what you feel. Someone else out there understands.", lang: "en" },

  // ── Russian ───────────────────────────────────────────────────────────────────
  { text: "Ты достаточна ровно такая, какая ты есть — не после того, как похудеешь или всё наладишь. Прямо сейчас.", lang: "ru" },
  { text: "Тебе не нужно зарабатывать право на отдых. Ты можешь просто остановиться.", lang: "ru" },
  { text: "Любовь, которую ты отдаёшь другим — ты заслуживаешь её не меньше.", lang: "ru" },
  { text: "Ты уже пережила то, что казалось невозможным. Помни об этом сегодня.", lang: "ru" },
  { text: "Твоя чувствительность — не слабость. Это значит, что ты по-настоящему проживаешь эту жизнь.", lang: "ru" },
  { text: "Что-то внутри тебя продолжает двигаться вперёд. Это что-то — удивительно.", lang: "ru" },
  { text: "Ты имеешь право хотеть большего — для себя, своей жизни, своей радости.", lang: "ru" },
  { text: "Тишина внутри тебя — это не пустота. Это место, которое освобождается для чего-то нового.", lang: "ru" },
  { text: "Тебе не нужно быть совершенной, чтобы заслуживать хорошего.", lang: "ru" },
  { text: "Исцеление не идёт по прямой. Иногда шаг назад — это тоже движение.", lang: "ru" },
  { text: "Ты имеешь право перерасти вещи — места, привычки и даже людей — без чувства вины.", lang: "ru" },
  { text: "Ты не отстаёшь. Ты просто идёшь своим путём в своём темпе — и это правильно.", lang: "ru" },
  { text: "То, что ты стараешься — даже тихо, даже несовершенно — это уже много.", lang: "ru" },
  { text: "Ты заслуживаешь любви, которая не заставляет тебя сомневаться в себе.", lang: "ru" },
  { text: "Ты не «слишком много». Просто рядом были люди с недостаточно большим сердцем.", lang: "ru" },
  { text: "Твои мечты не глупые. Это самая мудрая часть тебя говорит с тобой.", lang: "ru" },
  { text: "Ты всё ещё становишься собой. Это не недостаток — это весь смысл.", lang: "ru" },
  { text: "Ответы придут. Тебе не нужно выдавливать их из себя сегодня.", lang: "ru" },
  { text: "Что-то хорошее уже движется к тебе — даже если ты пока не можешь это почувствовать.", lang: "ru" },
  { text: "Ты имеешь право менять своё мнение — об отношениях, пути, убеждениях. Обо всём.", lang: "ru" },
  { text: "Твоё присутствие в чьей-то жизни значило больше, чем ты когда-либо узнаешь.", lang: "ru" },
  { text: "Пусть сегодня будет мягким. Ты можешь двигаться медленно.", lang: "ru" },
  { text: "Ты имеешь право занимать место — в комнате, в разговоре, в своей собственной жизни.", lang: "ru" },
  { text: "Ты не застряла. Ты в переходе. Это разные вещи.", lang: "ru" },
  { text: "Твоя интуиция была права чаще, чем ты ей доверяла.", lang: "ru" },
  { text: "Отпустить то, что больше не подходит — это не сдаться. Это вырасти.", lang: "ru" },
  { text: "Ты имеешь право чувствовать радость — настоящую, без извинений — сегодня.", lang: "ru" },
  { text: "Сила, которая помогла тебе пережить трудные времена, никуда не делась. Она всё ещё в тебе.", lang: "ru" },
  { text: "Не каждый день будет сиять. Некоторые дни просто для того, чтобы пережить их — и это нормально.", lang: "ru" },
  { text: "Ты заслуживаешь дружбы, которая ощущается как облегчение, а не как усилие.", lang: "ru" },
  { text: "Правильные люди полюбят настоящую тебя — не отфильтрованную версию.", lang: "ru" },
  { text: "Где-то прямо сейчас что-то тихо складывается в твою пользу.", lang: "ru" },
  { text: "Ты имеешь право ставить своё счастье в приоритет, не объясняя себя никому.", lang: "ru" },
  { text: "Даже в самый обычный твой день ты делаешь что-то важное.", lang: "ru" },
  { text: "Твоя ценность никогда не зависела от твоей продуктивности. Ты ценна просто потому, что существуешь.", lang: "ru" },
  { text: "Глава, в которой ты сейчас находишься — это не вся книга.", lang: "ru" },
  { text: "Доверяй себе больше. Ты знаешь куда больше, чем думаешь.", lang: "ru" },
  { text: "Нуждаться в людях — это нормально. Связь — это не слабость, это то, из чего мы сделаны.", lang: "ru" },
  { text: "Ты сажаешь семена, за которые позже будешь благодарна. Продолжай.", lang: "ru" },
  { text: "Покой доступен тебе сегодня — не когда жизнь станет идеальной, а прямо здесь.", lang: "ru" },
  { text: "Ты достаточно смела, чтобы начать снова. Ты делала это раньше.", lang: "ru" },
  { text: "Лучшее, что ты можешь дать миру — это версия себя, которая чувствует себя целой.", lang: "ru" },
  { text: "Твои трудности не определили тебя. Они сформировали тебя — и это разные вещи.", lang: "ru" },
  { text: "Ты именно там, где тебе нужно быть — даже когда это не ощущается так.", lang: "ru" },
  { text: "Сегодня просто дыши. Иногда это самое смелое, что можно сделать.", lang: "ru" },
  { text: "Ты женщина с глубиной, изяществом и тихой силой — даже в те дни, когда забываешь об этом.", lang: "ru" },
  { text: "То, через что ты проходишь сейчас, делает тебя той, с которой ты ещё не познакомилась.", lang: "ru" },
  { text: "Ты имеешь право хотеть жизнь, которая хорошо ощущается изнутри — не просто выглядит снаружи.", lang: "ru" },
  { text: "Всё необходимое для движения вперёд уже живёт внутри тебя.", lang: "ru" },
  { text: "В том, где ты находишься, есть красота — даже если её сложно увидеть сегодня.", lang: "ru" },
  { text: "У тебя есть разрешение отдохнуть — до того, как ты полностью истощена.", lang: "ru" },
  { text: "Доброта, которую ты проявляешь к себе сегодня, разойдётся волнами туда, куда ты даже не догадываешься.", lang: "ru" },
  { text: "Что-то в тебе — твой смех, твой взгляд на вещи, твоё сердце — незаменимо.", lang: "ru" },
  { text: "Этот момент временный. Сила, которую ты в себе строишь — постоянная.", lang: "ru" },
  { text: "Ты имеешь право быть одновременно благодарной и хотеть большего.", lang: "ru" },
  { text: "Дай себе то сострадание, которое ты бы дала своей лучшей подруге.", lang: "ru" },
  { text: "Ты не одна в том, что чувствуешь. Кто-то где-то тебя понимает.", lang: "ru" },
  { text: "Позволь себе не знать ответа. Жить с вопросом — тоже форма мудрости.", lang: "ru" },
  { text: "Твоя усталость — это сигнал, а не слабость. Прислушайся к ней.", lang: "ru" },
  { text: "Ты не обязана делать больше, чем можешь сегодня. Достаточно — это достаточно.", lang: "ru" },
  { text: "Маленькие радости тоже считаются. Не только большие победы.", lang: "ru" },
  { text: "Ты растёшь — даже тогда, когда кажется, что стоишь на месте.", lang: "ru" },
  { text: "Всё, что ты пережила, дало тебе мудрость, которую не купить ни за какие деньги.", lang: "ru" },
  { text: "Ты имеешь право быть несовершенной — и любимой именно такой.", lang: "ru" },
  { text: "Твой путь не должен выглядеть как чужой. Он твой — и в этом его ценность.", lang: "ru" },
  { text: "Сегодня можно просто быть. Не достигать, не доказывать — просто быть.", lang: "ru" },
  { text: "Ты заслуживаешь тех же добрых слов, которые так легко говоришь другим.", lang: "ru" },
  { text: "Каждый маленький шаг в сторону себя — это уже победа.", lang: "ru" },
  { text: "Твоё сердце знает дорогу. Иногда нужно просто замолчать достаточно надолго, чтобы услышать его.", lang: "ru" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getLocalDate() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function getDailyAffirmation(lang = 'en') {
  const today = getLocalDate();
  const cacheKey = `dba_${today}_${lang}`;
  const cached = localStorage.getItem(cacheKey);

  if (cached) {
    try { return { affirmation: JSON.parse(cached), alreadyOpened: true }; } catch {}
  }

  // Filter by selected language
  const pool = AFFIRMATIONS.filter(a => a.lang === lang);

  // Collect recently seen affirmations (last 14 days) to avoid repeats
  const recentTexts = new Set();
  Object.keys(localStorage)
    .filter(k => k.startsWith('dba_') && k !== cacheKey && k.endsWith(`_${lang}`))
    .forEach(k => {
      try { recentTexts.add(JSON.parse(localStorage.getItem(k)).text); } catch {}
    });

  // Remove recent ones from pool; if pool empties, reset (full rotation complete)
  let filteredPool = pool.filter(a => !recentTexts.has(a.text));
  if (filteredPool.length === 0) filteredPool = pool;

  const picked = filteredPool[Math.floor(Math.random() * filteredPool.length)];
  localStorage.setItem(cacheKey, JSON.stringify(picked));

  // Clean up keys older than 20 days
  const allKeys = Object.keys(localStorage).filter(k => k.startsWith('dba_') && k.endsWith(`_${lang}`));
  if (allKeys.length > 20) {
    allKeys.sort().slice(0, allKeys.length - 20).forEach(k => localStorage.removeItem(k));
  }

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

export default function AffirmationBox({ lang = 'en' }) {
  const [phase, setPhase] = useState('idle');
  const [affirmation, setAffirmation] = useState(null);
  const [alreadyOpened, setAlreadyOpened] = useState(false);

  // Reset when language changes
  useEffect(() => {
    const today = getLocalDate();
    const cached = localStorage.getItem(`dba_${today}_${lang}`);
    if (cached) {
      try {
        setAffirmation(JSON.parse(cached));
        setAlreadyOpened(true);
        setPhase('open');
      } catch {}
    } else {
      setPhase('idle');
      setAffirmation(null);
    }
  }, [lang]);

  function handleBoxClick() {
    if (phase !== 'idle') return;
    setPhase('opening');
    setTimeout(() => {
      const { affirmation, alreadyOpened } = getDailyAffirmation(lang);
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
  page: { display:'flex', flexDirection:'column', alignItems:'center', width:'100%', gap:'14px' },
  header: { textAlign:'center' },
  dateLabel: { fontFamily:"'Inter',sans-serif", fontWeight:300, fontSize:'13px', letterSpacing:'0.15em', textTransform:'uppercase', color:'#b0a090', marginBottom:'6px' },
  title: { fontFamily:"'Lora',Georgia,serif", fontWeight:500, fontSize:'clamp(26px,5vw,36px)', color:'#2d2518', letterSpacing:'-0.01em', lineHeight:1.2 },
  subtitle: { fontFamily:"'Lora',Georgia,serif", fontStyle:'italic', fontWeight:400, fontSize:'15px', color:'#9a8870', marginTop:'4px' },
  card: { position:'relative', width:'100%', boxSizing:'border-box', minHeight:'240px', backgroundColor:'#ffffff', borderRadius:'20px', padding:'24px 18px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 24px rgba(100,80,50,0.10)', transition:'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)', overflow:'hidden', border:'1px solid rgba(196,168,130,0.2)' },
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
