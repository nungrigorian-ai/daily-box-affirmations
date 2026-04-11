/**
 * Astrology.jsx
 * Shows personalised daily guidance based on sun sign (birth month + day).
 * Includes: sign info, daily do's & don'ts, lucky color/number/crystal.
 */

// ─── Zodiac sign calculator ───────────────────────────────────────────────────

function getZodiacSign(month, day) {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
  return 'Pisces';
}

// ─── Zodiac data ──────────────────────────────────────────────────────────────

const ZODIAC = {
  Aries:       { emoji: '♈️', element: 'Fire', symbol: 'Ram',       color: '#c0392b' },
  Taurus:      { emoji: '♉️', element: 'Earth', symbol: 'Bull',      color: '#27ae60' },
  Gemini:      { emoji: '♊️', element: 'Air',   symbol: 'Twins',     color: '#f39c12' },
  Cancer:      { emoji: '♋️', element: 'Water', symbol: 'Crab',      color: '#2980b9' },
  Leo:         { emoji: '♌️', element: 'Fire',  symbol: 'Lion',      color: '#e67e22' },
  Virgo:       { emoji: '♍️', element: 'Earth', symbol: 'Maiden',    color: '#8e44ad' },
  Libra:       { emoji: '♎️', element: 'Air',   symbol: 'Scales',    color: '#16a085' },
  Scorpio:     { emoji: '♏️', element: 'Water', symbol: 'Scorpion',  color: '#8e44ad' },
  Sagittarius: { emoji: '♐️', element: 'Fire',  symbol: 'Archer',    color: '#d35400' },
  Capricorn:   { emoji: '♑️', element: 'Earth', symbol: 'Sea-goat',  color: '#2c3e50' },
  Aquarius:    { emoji: '♒️', element: 'Air',   symbol: 'Water Bearer', color: '#1abc9c' },
  Pisces:      { emoji: '♓️', element: 'Water', symbol: 'Fish',      color: '#3498db' },
};

// ─── Daily guidance pool (7 sets per sign, one per day of week) ───────────────

const DAILY_GUIDANCE = {
  Aries: [
    { dos: ['Take bold action on something you\'ve been hesitating about', 'Channel your energy into exercise or movement'], donts: ['Rush into decisions without checking the details', 'Let impatience push away someone who cares for you'] },
    { dos: ['Lead with confidence — your instincts are sharp today', 'Start that project you\'ve been planning'], donts: ['Take on more than you can finish', 'React before listening fully'] },
    { dos: ['Express yourself directly and authentically', 'Try something new and adventurous'], donts: ['Be too competitive in personal relationships', 'Skip rest — your body needs recovery too'] },
    { dos: ['Trust your gut on an important decision', 'Inspire others with your natural enthusiasm'], donts: ['Burn bridges in moments of frustration', 'Neglect the quieter voices around you'] },
    { dos: ['Pursue your passion with full commitment', 'Connect with someone who shares your fire'], donts: ['Let ego overshadow empathy', 'Rush through meaningful moments'] },
    { dos: ['Take the lead on a collaborative effort', 'Celebrate your recent wins — you deserve it'], donts: ['Overextend yourself trying to do everything', 'Dismiss others\' slower pace'] },
    { dos: ['Reflect on what truly lights you up', 'Spend energy on what matters most to you'], donts: ['Force outcomes that need more time', 'Ignore your need for stillness'] },
  ],
  Taurus: [
    { dos: ['Invest time in something beautiful — art, nature, food', 'Honor your body with nourishing rituals'], donts: ['Resist change out of fear — some shifts are gifts', 'Overindulge as a way to cope with stress'] },
    { dos: ['Build steadily toward your long-term goals', 'Connect with the earth — a walk outside will ground you'], donts: ['Hold on too tightly to things that have outgrown you', 'Let stubbornness block a good opportunity'] },
    { dos: ['Create something with your hands today', 'Express love through small, thoughtful acts'], donts: ['Be too fixed in your opinions', 'Let comfort become complacency'] },
    { dos: ['Trust your senses — your body knows what it needs', 'Invest in quality over quantity today'], donts: ['Overspend on fleeting pleasures', 'Resist necessary conversations'] },
    { dos: ['Slow down and enjoy the present moment fully', 'Plan something that gives you security and joy'], donts: ['Dig in your heels when flexibility is needed', 'Let jealousy cloud your judgment'] },
    { dos: ['Cultivate beauty in your surroundings', 'Honor your loyalty by showing up for someone you love'], donts: ['Hold grudges — releasing them frees YOU', 'Neglect your own needs while caring for others'] },
    { dos: ['Rest deeply — you\'ve earned stillness', 'Appreciate the abundance already in your life'], donts: ['Let possessiveness strain a relationship', 'Overcommit to obligations'] },
  ],
  Gemini: [
    { dos: ['Have that stimulating conversation you\'ve been craving', 'Write, journal, or express your thoughts creatively'], donts: ['Scatter your energy in too many directions', 'Commit to things you already know you won\'t follow through on'] },
    { dos: ['Explore a new idea or learn something fascinating', 'Connect with different kinds of people today'], donts: ['Let inconsistency frustrate those who depend on you', 'Avoid a deeper feeling by staying in your head'] },
    { dos: ['Use your wit to lighten someone\'s day', 'Multitask on things you\'re genuinely excited about'], donts: ['Gossip — even lightly, it dims your energy', 'Make decisions based solely on logic today'] },
    { dos: ['Ask the questions others are afraid to ask', 'Embrace spontaneity and go with the flow'], donts: ['Talk over people — your listening is as powerful as your voice', 'Jump to conclusions too quickly'] },
    { dos: ['Follow your curiosity wherever it leads', 'Share your ideas — they are more valuable than you think'], donts: ['Overthink decisions that need intuition', 'Let restlessness become anxiety'] },
    { dos: ['Bridge connections between people around you', 'Use your adaptability as a true superpower today'], donts: ['Be two-faced to avoid conflict', 'Stay surface-level in a conversation that deserves depth'] },
    { dos: ['Let yourself be playful and light', 'Read, explore, or take a short spontaneous trip'], donts: ['Overthink your feelings instead of feeling them', 'Start something new before finishing what\'s open'] },
  ],
  Cancer: [
    { dos: ['Nurture yourself as tenderly as you nurture others', 'Trust your emotional intuition — it\'s your greatest gift'], donts: ['Retreat into your shell when connection is what you need', 'Take things personally that were never about you'] },
    { dos: ['Create a cozy, sacred space around you today', 'Reach out to someone from your past who still warms your heart'], donts: ['Let mood swings make decisions for you', 'Over-give until you have nothing left'] },
    { dos: ['Honor your need for emotional safety', 'Cook, create, or care — it will fill your soul today'], donts: ['Cling to situations that have completed their cycle', 'Bottle up feelings that need to flow'] },
    { dos: ['Listen to your body\'s signals with deep compassion', 'Offer your empathy to someone who is struggling'], donts: ['Confuse self-protection with isolation', 'Let fear of abandonment cloud a good relationship'] },
    { dos: ['Set gentle but firm emotional boundaries', 'Celebrate your sensitivity — it\'s your strength'], donts: ['Drown in the feelings of others at the cost of your own peace', 'Revisit old wounds just to feel them again'] },
    { dos: ['Express your needs openly and with love', 'Make home feel like a sanctuary today'], donts: ['Manipulate through guilt or silence', 'Let nostalgia keep you from embracing now'] },
    { dos: ['Allow yourself to receive care today', 'Rest in the knowledge that you are deeply loved'], donts: ['Self-sacrifice as a way to feel worthy', 'Ignore your own emotional needs'] },
  ],
  Leo: [
    { dos: ['Shine boldly — the world needs your light today', 'Lead with warmth and generosity'], donts: ['Let pride prevent you from asking for help', 'Dominate conversations that need balance'] },
    { dos: ['Express your creativity without holding back', 'Lift someone up with genuine praise today'], donts: ['Seek validation when your inner knowing is enough', 'Let drama steal your joy'] },
    { dos: ['Wear something that makes you feel radiant', 'Share your gifts — someone is waiting for what only you can offer'], donts: ['Let ego get bruised by small slights', 'Compete when collaboration would shine brighter'] },
    { dos: ['Take center stage in something meaningful', 'Celebrate others\' victories as freely as your own'], donts: ['Roar when a gentle purr would do', 'Neglect the quieter people in your life'] },
    { dos: ['Pour love into your passions today', 'Inspire someone with your story'], donts: ['Overpromise to impress', 'Let attention-seeking overshadow authentic connection'] },
    { dos: ['Play, laugh, and be fully alive today', 'Honor the queen within you — she is real'], donts: ['Let fear of being ordinary make you perform instead of just BE', 'Forget that stillness is also powerful'] },
    { dos: ['Rest and recharge your magnificent energy', 'Reflect on the beauty you have created this week'], donts: ['Force yourself to be "on" when you need quiet', 'Seek the spotlight at the expense of your peace'] },
  ],
  Virgo: [
    { dos: ['Channel your precision into something meaningful', 'Organize one area of your life that has felt chaotic'], donts: ['Criticize yourself for not being perfect', 'Overanalyze a decision that your heart already knows'] },
    { dos: ['Offer your practical help to someone who truly needs it', 'Take care of your body with thoughtful routine'], donts: ['Let worry steal the beauty of this present moment', 'Nitpick in ways that hurt instead of help'] },
    { dos: ['Use your analytical mind to solve a real problem', 'Appreciate the small details that make your life beautiful'], donts: ['Let perfectionism keep you from starting', 'Dismiss your own needs as unimportant'] },
    { dos: ['Create order from chaos — it will calm your nervous system', 'Notice and appreciate how much you do right'], donts: ['Be too hard on someone still learning', 'Let service to others become self-neglect'] },
    { dos: ['Bring your unique care and attention to your work', 'Practice self-compassion as skillfully as you practice everything else'], donts: ['Overthink your way out of joy', 'Hold others to impossible standards'] },
    { dos: ['Trust that good enough is sometimes perfect', 'Nourish yourself — a quiet evening, good food, gentle rest'], donts: ['Let anxiety masquerade as preparation', 'Criticize what isn\'t broken'] },
    { dos: ['Celebrate how far your quiet dedication has brought you', 'Allow yourself to receive help without guilt'], donts: ['Worry about things outside your control', 'Let busyness block deeper connection'] },
  ],
  Libra: [
    { dos: ['Seek balance in a relationship that has felt one-sided', 'Create beauty in your environment — you thrive in it'], donts: ['People-please at the expense of your truth', 'Stay so indecisive that you miss the moment'] },
    { dos: ['Have the diplomatic conversation you\'ve been avoiding', 'Collaborate — your best ideas come through connection'], donts: ['Keep the peace by suppressing your real feelings', 'Let indecision be a way to avoid responsibility'] },
    { dos: ['Appreciate beauty in all its forms today', 'Honor your need for harmony without losing your voice'], donts: ['Bend so far you break', 'Let someone else make all the decisions today'] },
    { dos: ['Stand for what\'s fair, even when it\'s uncomfortable', 'Invest in a relationship that truly feeds you'], donts: ['Avoid conflict that actually needs to happen', 'Over-compromise your values to be liked'] },
    { dos: ['Trust your refined aesthetic sense', 'Bring grace and ease to a tense situation'], donts: ['Prioritize others\' opinions over your own knowing', 'Let the scales tip too far in either direction'] },
    { dos: ['Make a decision and commit to it fully', 'Express your love with thoughtfulness and elegance'], donts: ['Overanalyze a relationship that simply needs presence', 'Use charm to avoid authentic conversation'] },
    { dos: ['Rest in beauty — nature, music, art', 'Appreciate the balance you bring to everyone around you'], donts: ['Give endlessly without receiving', 'Sacrifice your center for someone else\'s comfort'] },
  ],
  Scorpio: [
    { dos: ['Trust your deep intuition — it never lies', 'Transform something painful into something powerful today'], donts: ['Use your insight to manipulate rather than understand', 'Let jealousy or suspicion poison what is actually good'] },
    { dos: ['Dive into something that requires depth and commitment', 'Allow yourself to be truly vulnerable with someone you trust'], donts: ['Sting first out of self-protection', 'Hold a grudge that is weighing you down more than them'] },
    { dos: ['Investigate, research, uncover — your detective mind is powerful', 'Release what needs to die so something new can be born'], donts: ['Control situations out of fear of being hurt', 'Let intensity become overwhelming for those around you'] },
    { dos: ['Honor your need for solitude and depth', 'Speak your truth, even the uncomfortable parts'], donts: ['Obsess over what you cannot change', 'Let power struggles erode a relationship you value'] },
    { dos: ['Channel your passion into something transformative', 'Trust the process of deep change — you are built for it'], donts: ['Shut people out during exactly the moments you need them', 'Let secrecy become isolation'] },
    { dos: ['Embrace your complexity — it\'s where your magic lives', 'Do something that reclaims your personal power'], donts: ['Use silence as punishment', 'Let your depth become darkness'] },
    { dos: ['Rest in the knowledge that your strength is extraordinary', 'Allow yourself softness — it takes real courage'], donts: ['Distrust everyone as a default', 'Let old wounds define current connections'] },
  ],
  Sagittarius: [
    { dos: ['Explore something that expands your mind or horizons', 'Share your philosophical wisdom with someone open to it'], donts: ['Promise what your free spirit can\'t realistically deliver', 'Be so blunt that you wound without meaning to'] },
    { dos: ['Follow your sense of adventure — even a small one', 'Be optimistic today — your belief in good things is a gift'], donts: ['Avoid commitment when it\'s exactly what\'s needed', 'Let restlessness make you overlook the treasure in front of you'] },
    { dos: ['Teach, inspire, or guide someone on their journey', 'Embrace your honesty — the world needs your direct truth'], donts: ['Overcommit to everything and deliver on nothing', 'Use humor to sidestep vulnerability'] },
    { dos: ['Plan an adventure, even if it\'s in your mind for now', 'Celebrate how much you\'ve grown through every journey'], donts: ['Dismiss the details that actually matter', 'Run from depth when intimacy is calling'] },
    { dos: ['Say yes to something that scares and excites you equally', 'Trust that the universe is conspiring in your favor'], donts: ['Overshare beyond what the moment calls for', 'Let freedom become an excuse to avoid accountability'] },
    { dos: ['Seek wisdom in an unexpected place today', 'Spread your infectious joy — it\'s your superpower'], donts: ['Philosophize when someone just needs your presence', 'Let wanderlust replace real connection'] },
    { dos: ['Reflect on all the ways you\'ve inspired others', 'Give your body rest after all that glorious fire'], donts: ['Minimize your need for stillness', 'Chase the next horizon without honoring where you are'] },
  ],
  Capricorn: [
    { dos: ['Take one strategic step toward your most important goal', 'Honor your discipline — it is building something real'], donts: ['Let work become a way to avoid feeling', 'Be so focused on the summit you forget to enjoy the climb'] },
    { dos: ['Lead by example today — your integrity inspires', 'Invest in your long-term wellbeing, not just your immediate tasks'], donts: ['Dismiss emotion as weakness', 'Hold yourself to standards that would exhaust anyone'] },
    { dos: ['Build something lasting today, even in a small way', 'Let someone see the warmth beneath your strength'], donts: ['Let ambition override your relationships', 'Sacrifice rest for productivity again'] },
    { dos: ['Trust the slow, steady path — it leads somewhere extraordinary', 'Acknowledge how much you\'ve already accomplished'], donts: ['Be so serious you forget to laugh', 'Let fear of failure paralyze you into inaction'] },
    { dos: ['Take responsibility in a way that lifts everyone', 'Connect with your body — it carries your ambitions and needs care'], donts: ['Control everything and everyone out of anxiety', 'Dismiss the value of play and lightness'] },
    { dos: ['Celebrate a milestone, however small — you earned it', 'Allow yourself to ask for support'], donts: ['Wear your self-sufficiency like armor', 'Let the inner critic run louder than inner wisdom'] },
    { dos: ['Rest without guilt — even mountains need stillness', 'Appreciate the foundation you are quietly building'], donts: ['Measure your worth by output alone', 'Postpone joy until everything is perfect'] },
  ],
  Aquarius: [
    { dos: ['Think beyond the conventional — your vision is ahead of its time', 'Connect with your community or a cause you believe in'], donts: ['Let detachment become emotional unavailability', 'Be so focused on humanity that you forget the humans closest to you'] },
    { dos: ['Innovate, experiment, disrupt the ordinary today', 'Honor your individuality without making others feel excluded'], donts: ['Rebel for the sake of rebelling', 'Let logic override the wisdom of your heart'] },
    { dos: ['Share your unconventional ideas — they\'re needed', 'Celebrate what makes you beautifully different'], donts: ['Intellectualize feelings that simply need to be felt', 'Dismiss tradition without understanding its value'] },
    { dos: ['Collaborate with people whose minds challenge yours', 'Use your humanitarian instincts for good today'], donts: ['Detach from intimacy as a form of self-protection', 'Let contrarianism become your default mode'] },
    { dos: ['Embrace your visionary nature — the future needs you', 'Connect authentically, not just intellectually'], donts: ['Scatter your gifts across too many causes', 'Prioritize the collective so much you forget yourself'] },
    { dos: ['Break a pattern that no longer serves your evolution', 'Let someone love you in ways that feel unfamiliar but good'], donts: ['Resist connection because it feels messy', 'Be so ahead of your time you lose the present'] },
    { dos: ['Rest and let your electric mind recharge', 'Appreciate your unique place in the world'], donts: ['Push people away who don\'t understand you yet', 'Let aloofness read as arrogance'] },
  ],
  Pisces: [
    { dos: ['Trust your deep intuition — it is wiser than any logic today', 'Create something beautiful from your inner world'], donts: ['Escape into fantasy when reality needs your gentle presence', 'Absorb others\' energy without boundaries'] },
    { dos: ['Offer compassion freely — you have so much to give', 'Let your dreams guide you toward your next step'], donts: ['Sacrifice yourself on the altar of others\' needs', 'Avoid a necessary truth because it feels uncomfortable'] },
    { dos: ['Spend time near water — it heals your soul', 'Channel your sensitivity into art, music, or writing'], donts: ['Let confusion be an excuse to avoid decisions', 'Blur boundaries between your pain and others\''] },
    { dos: ['Meditate, pray, or connect with something greater than yourself', 'Believe in your own magic — it is very real'], donts: ['Play the victim when you have power to transform', 'Lose yourself in someone else\'s story'] },
    { dos: ['Let your empathy be a bridge, not a burden', 'Follow the thread of beauty wherever it leads you today'], donts: ['Drift into daydream when action is calling', 'Let self-pity dim your luminous gifts'] },
    { dos: ['Honor your need for solitude and spiritual renewal', 'Express your love in the deep, poetic ways only you can'], donts: ['Absorb collective anxiety as if it were yours', 'Neglect practical matters entirely'] },
    { dos: ['Rest deeply — your sensitive system needs it', 'Appreciate the profound depth of your feeling heart'], donts: ['Let others take advantage of your boundless compassion', 'Drift without an anchor today'] },
  ],
};

// ─── Lucky elements (cycles through 7 sets per sign) ─────────────────────────

const LUCKY = {
  Aries:       [
    { color: 'Red', mood: 'Bold & Fearless', number: 9 },
    { color: 'Orange', mood: 'Energised & Ready', number: 1 },
    { color: 'Coral', mood: 'Passionate & Alive', number: 7 },
    { color: 'Scarlet', mood: 'Fierce & Confident', number: 3 },
    { color: 'Gold', mood: 'Powerful & Radiant', number: 5 },
    { color: 'Crimson', mood: 'Driven & Unstoppable', number: 6 },
    { color: 'Amber', mood: 'Warm & Courageous', number: 4 },
  ],
  Taurus:      [
    { color: 'Green', mood: 'Grounded & Secure', number: 6 },
    { color: 'Pink', mood: 'Soft & Loving', number: 2 },
    { color: 'Ivory', mood: 'Calm & Centered', number: 4 },
    { color: 'Sage', mood: 'Peaceful & Wise', number: 8 },
    { color: 'Blush', mood: 'Gentle & Open', number: 3 },
    { color: 'Forest', mood: 'Strong & Rooted', number: 7 },
    { color: 'Cream', mood: 'Nourished & Content', number: 5 },
  ],
  Gemini:      [
    { color: 'Yellow', mood: 'Curious & Bright', number: 5 },
    { color: 'Sky Blue', mood: 'Light & Free', number: 3 },
    { color: 'Silver', mood: 'Sharp & Witty', number: 7 },
    { color: 'Lavender', mood: 'Playful & Inspired', number: 1 },
    { color: 'White', mood: 'Clear & Open-minded', number: 9 },
    { color: 'Turquoise', mood: 'Expressive & Lively', number: 2 },
    { color: 'Mint', mood: 'Fresh & Adaptable', number: 6 },
  ],
  Cancer:      [
    { color: 'Silver', mood: 'Intuitive & Tender', number: 2 },
    { color: 'White', mood: 'Pure & Nurturing', number: 7 },
    { color: 'Sea Blue', mood: 'Deep & Flowing', number: 4 },
    { color: 'Cream', mood: 'Safe & Warm', number: 6 },
    { color: 'Lavender', mood: 'Dreamy & Gentle', number: 3 },
    { color: 'Soft Pink', mood: 'Loving & Compassionate', number: 5 },
    { color: 'Opal', mood: 'Mystical & Sensitive', number: 8 },
  ],
  Leo:         [
    { color: 'Gold', mood: 'Radiant & Magnetic', number: 1 },
    { color: 'Orange', mood: 'Joyful & Vibrant', number: 5 },
    { color: 'Royal Purple', mood: 'Regal & Inspired', number: 9 },
    { color: 'Sunny Yellow', mood: 'Bright & Generous', number: 3 },
    { color: 'Bright Red', mood: 'Passionate & Bold', number: 7 },
    { color: 'Copper', mood: 'Warm & Creative', number: 4 },
    { color: 'Ivory', mood: 'Graceful & Luminous', number: 6 },
  ],
  Virgo:       [
    { color: 'Sage Green', mood: 'Mindful & Clear', number: 6 },
    { color: 'Navy', mood: 'Focused & Precise', number: 2 },
    { color: 'Cream', mood: 'Pure & Intentional', number: 4 },
    { color: 'Dusty Rose', mood: 'Gentle & Caring', number: 8 },
    { color: 'Olive', mood: 'Grounded & Practical', number: 5 },
    { color: 'Grey', mood: 'Analytical & Calm', number: 3 },
    { color: 'White', mood: 'Clean & Purposeful', number: 7 },
  ],
  Libra:       [
    { color: 'Rose', mood: 'Harmonious & Loving', number: 7 },
    { color: 'Lavender', mood: 'Balanced & Serene', number: 2 },
    { color: 'Blue', mood: 'Fair & Thoughtful', number: 6 },
    { color: 'Mint', mood: 'Graceful & Refreshed', number: 4 },
    { color: 'Blush', mood: 'Romantic & Soft', number: 9 },
    { color: 'Ivory', mood: 'Elegant & Poised', number: 3 },
    { color: 'Peach', mood: 'Warm & Diplomatic', number: 5 },
  ],
  Scorpio:     [
    { color: 'Deep Red', mood: 'Intense & Transformative', number: 8 },
    { color: 'Black', mood: 'Mysterious & Powerful', number: 4 },
    { color: 'Burgundy', mood: 'Deep & Magnetic', number: 2 },
    { color: 'Midnight Blue', mood: 'Perceptive & Soulful', number: 9 },
    { color: 'Maroon', mood: 'Determined & Resilient', number: 6 },
    { color: 'Indigo', mood: 'Intuitive & Profound', number: 3 },
    { color: 'Charcoal', mood: 'Focused & Unyielding', number: 7 },
  ],
  Sagittarius: [
    { color: 'Purple', mood: 'Expansive & Wise', number: 3 },
    { color: 'Royal Blue', mood: 'Adventurous & Free', number: 9 },
    { color: 'Orange', mood: 'Optimistic & Joyful', number: 5 },
    { color: 'Violet', mood: 'Philosophical & Open', number: 7 },
    { color: 'Gold', mood: 'Lucky & Inspired', number: 1 },
    { color: 'Cobalt', mood: 'Truthful & Energised', number: 4 },
    { color: 'Teal', mood: 'Curious & Alive', number: 6 },
  ],
  Capricorn:   [
    { color: 'Forest Green', mood: 'Ambitious & Steady', number: 8 },
    { color: 'Charcoal', mood: 'Disciplined & Strong', number: 4 },
    { color: 'Brown', mood: 'Grounded & Reliable', number: 6 },
    { color: 'Black', mood: 'Focused & Determined', number: 2 },
    { color: 'Dark Green', mood: 'Patient & Purposeful', number: 9 },
    { color: 'Navy', mood: 'Strategic & Wise', number: 3 },
    { color: 'Slate', mood: 'Calm & Enduring', number: 7 },
  ],
  Aquarius:    [
    { color: 'Electric Blue', mood: 'Innovative & Electric', number: 4 },
    { color: 'Turquoise', mood: 'Visionary & Free', number: 7 },
    { color: 'Violet', mood: 'Unconventional & Bright', number: 11 },
    { color: 'Silver', mood: 'Sharp & Independent', number: 2 },
    { color: 'Indigo', mood: 'Humanitarian & Deep', number: 9 },
    { color: 'Cyan', mood: 'Original & Alive', number: 5 },
    { color: 'White', mood: 'Clear & Progressive', number: 3 },
  ],
  Pisces:      [
    { color: 'Sea Green', mood: 'Dreamy & Compassionate', number: 7 },
    { color: 'Lavender', mood: 'Mystical & Soft', number: 3 },
    { color: 'Aqua', mood: 'Flowing & Intuitive', number: 9 },
    { color: 'Soft Blue', mood: 'Gentle & Soulful', number: 2 },
    { color: 'Lilac', mood: 'Romantic & Tender', number: 6 },
    { color: 'Pearl', mood: 'Pure & Luminous', number: 4 },
    { color: 'Mist', mood: 'Ethereal & Peaceful', number: 11 },
  ],
};

// ─── Component ────────────────────────────────────────────────────────────────

// Color name → CSS color mapping for swatches
const COLOR_MAP = {
  'Red': '#c0392b', 'Orange': '#e67e22', 'Coral': '#e74c3c', 'Scarlet': '#c0392b',
  'Gold': '#f1c40f', 'Crimson': '#9b2335', 'Amber': '#f39c12', 'Green': '#27ae60',
  'Pink': '#e91e8c', 'Ivory': '#fffff0', 'Sage': '#87ae73', 'Blush': '#f4a7b9',
  'Forest': '#228b22', 'Cream': '#fffdd0', 'Yellow': '#f9e642', 'Sky Blue': '#87ceeb',
  'Silver': '#c0c0c0', 'Lavender': '#967bb6', 'White': '#f8f8f8', 'Turquoise': '#40e0d0',
  'Mint': '#98ff98', 'Sea Blue': '#006994', 'Soft Pink': '#ffb6c1', 'Opal': '#a8c5da',
  'Royal Purple': '#7851a9', 'Sunny Yellow': '#ffe135', 'Bright Red': '#ff0000',
  'Copper': '#b87333', 'Sage Green': '#87ae73', 'Navy': '#001f5b', 'Dusty Rose': '#dcae96',
  'Peach Selenite': '#ffcba4', 'Olive': '#808000', 'Grey': '#808080', 'Rose': '#ff007f',
  'Blue': '#0000ff', 'Peach': '#ffcba4', 'Deep Red': '#8b0000', 'Black': '#222222',
  'Burgundy': '#800020', 'Midnight Blue': '#191970', 'Maroon': '#800000',
  'Indigo': '#4b0082', 'Charcoal': '#36454f', 'Purple': '#800080',
  'Royal Blue': '#4169e1', 'Violet': '#ee82ee', 'Cobalt': '#0047ab',
  'Teal': '#008080', 'Brown': '#964b00', 'Dark Green': '#006400',
  'Slate': '#708090', 'Electric Blue': '#7df9ff', 'Cyan': '#00ffff',
  'Sea Green': '#2e8b57', 'Aqua': '#00ffff', 'Soft Blue': '#add8e6',
  'Lilac': '#c8a2c8', 'Pearl': '#f0ead6', 'Mist': '#c4c4c4',
  'Forest Green': '#228b22', 'Sunny Orange': '#ff7c00',
};

export default function Astrology({ birthday, lang = 'en' }) {
  const { month, day } = birthday;
  const sign   = getZodiacSign(month, day);
  const zodiac = ZODIAC[sign];
  const dayIndex = new Date().getDay();
  const guidance = DAILY_GUIDANCE[sign][dayIndex];
  const lucky    = LUCKY[sign][dayIndex];
  const swatchColor = COLOR_MAP[lucky.color] || zodiac.color;

  const labels = {
    lean:       lang === 'en' ? '✅ Today, lean into'        : '✅ Сегодня, устремись к',
    mindful:    lang === 'en' ? '🌿 Be mindful of'           : '🌿 Будь внимательна к',
    luckyTitle: lang === 'en' ? '✨ Your energy today'       : '✨ Твоя энергия сегодня',
    colorLabel: lang === 'en' ? 'Lucky colour'               : 'Счастливый цвет',
    numberLabel:lang === 'en' ? 'Lucky number'               : 'Счастливое число',
    moodLabel:  lang === 'en' ? 'Today\'s mood'              : 'Настроение дня',
  };

  return (
    <div style={{ ...styles.card, borderColor: zodiac.color + '33' }}>

      {/* Sign header */}
      <div style={styles.header}>
        <span style={styles.signEmoji}>{zodiac.emoji}</span>
        <div>
          <p style={styles.signName}>{sign}</p>
          <p style={styles.signMeta}>{zodiac.element} · {zodiac.symbol}</p>
        </div>
      </div>

      <div style={{ ...styles.divider, background: `linear-gradient(90deg, transparent, ${zodiac.color}66, transparent)` }} />

      {/* Do's */}
      <div style={styles.section}>
        <p style={{ ...styles.sectionLabel, color: '#5a7a5a' }}>{labels.lean}</p>
        {guidance.dos.map((item, i) => (
          <div key={i} style={styles.item}>
            <span style={{ ...styles.dot, backgroundColor: '#5a7a5a' }} />
            <p style={styles.itemText}>{item}</p>
          </div>
        ))}
      </div>

      {/* Don'ts */}
      <div style={styles.section}>
        <p style={{ ...styles.sectionLabel, color: '#8a5a4a' }}>{labels.mindful}</p>
        {guidance.donts.map((item, i) => (
          <div key={i} style={styles.item}>
            <span style={{ ...styles.dot, backgroundColor: '#c4a882' }} />
            <p style={styles.itemText}>{item}</p>
          </div>
        ))}
      </div>

      <div style={{ ...styles.divider, background: `linear-gradient(90deg, transparent, ${zodiac.color}44, transparent)` }} />

      {/* Lucky elements — 3 column layout */}
      <p style={styles.luckyTitle}>{labels.luckyTitle}</p>
      <div style={styles.luckyRow}>

        <div style={styles.luckyCol}>
          <p style={styles.luckyLabel}>{labels.colorLabel}</p>
          <div style={styles.colorRow}>
            <p style={styles.luckyValue}>{lucky.color}</p>
            <div style={{ ...styles.swatchCircleSmall, backgroundColor: swatchColor }} />
          </div>
        </div>

        <div style={styles.luckySep} />

        <div style={styles.luckyCol}>
          <p style={styles.luckyLabel}>{labels.numberLabel}</p>
          <p style={styles.luckyNumber}>{lucky.number}</p>
        </div>

        <div style={styles.luckySep} />

        <div style={styles.luckyCol}>
          <p style={styles.luckyLabel}>{labels.moodLabel}</p>
          <p style={styles.luckyValue}>{lucky.mood}</p>
        </div>

      </div>

    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  card: {
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: '#faf7f2',
    borderRadius: '20px',
    padding: '20px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    border: '1px solid',
    boxShadow: '0 4px 20px rgba(80,60,40,0.08)',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    minWidth: 0,
  },
  signEmoji: {
    fontSize: '40px',
    lineHeight: 1,
  },
  signName: {
    fontFamily: "'Lora', Georgia, serif",
    fontWeight: 500,
    fontSize: '20px',
    color: '#2d2518',
    margin: 0,
  },
  signMeta: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '12px',
    color: '#9a8870',
    margin: '2px 0 0',
    letterSpacing: '0.04em',
  },
  divider: {
    width: '100%',
    height: '1px',
    borderRadius: '1px',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  sectionLabel: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 500,
    fontSize: '12px',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    margin: 0,
  },
  item: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    minWidth: 0,
  },
  dot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    marginTop: '7px',
    flexShrink: 0,
  },
  itemText: {
    fontFamily: "'Lora', Georgia, serif",
    fontSize: '14px',
    color: '#4a3d2e',
    lineHeight: 1.6,
    margin: 0,
    minWidth: 0,
    wordBreak: 'break-word',
  },
  luckyTitle: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 400,
    fontSize: '12px',
    color: '#9a8870',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    margin: 0,
    textAlign: 'center',
  },
  luckyRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
    gap: '8px',
  },
  luckyCol: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    textAlign: 'center',
    overflow: 'hidden',
  },
  luckySep: {
    width: '1px',
    alignSelf: 'stretch',
    backgroundColor: '#ede8e2',
    margin: '4px 0',
  },
  swatchCircle: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
    border: '3px solid rgba(255,255,255,0.9)',
  },
  swatchCircleSmall: {
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
    border: '2px solid rgba(255,255,255,0.9)',
    flexShrink: 0,
  },
  colorRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '6px',
  },
  luckyLabel: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '9px',
    color: '#b0a090',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    margin: 0,
    width: '100%',
    textAlign: 'center',
    wordBreak: 'break-word',
  },
  luckyValue: {
    fontFamily: "'Lora', Georgia, serif",
    fontSize: '13px',
    color: '#2d2518',
    fontWeight: 500,
    margin: 0,
    lineHeight: 1.3,
    wordBreak: 'break-word',
    textAlign: 'center',
  },
  luckyNumber: {
    fontFamily: "'Lora', Georgia, serif",
    fontSize: '28px',
    color: '#2d2518',
    fontWeight: 500,
    margin: 0,
    lineHeight: 1,
  },
};
