/**
 * MealPlan.jsx
 * Daily Meal Plan — personalized, adaptive, digestion-friendly.
 * Designed for: sensitive digestion, anti-bloat, warm meals, light proteins.
 * Adapts based on yesterday's symptoms • "Fix My Day" engine • 7-day rotation.
 */

import { useState, useEffect } from 'react';

// ─── Design Tokens ────────────────────────────────────────────────────────────

const C = {
  bg: '#f5f0eb',
  card: '#ffffff',
  text: '#2d2518',
  accent: '#8b7355',
  light: '#c4a882',
  muted: '#9a8870',
  border: '#ede8e2',
  morning:  { bg: '#fef7e8', border: '#f0d080', icon: '#c8880a', label: '#a06a08' },
  midday:   { bg: '#f0f6f0', border: '#aad4aa', icon: '#4a8a4a', label: '#3a6a3a' },
  evening:  { bg: '#f0f0f9', border: '#b8b8e8', icon: '#5858a0', label: '#404080' },
  snack:    { bg: '#fdf5ef', border: '#e0c0a0', icon: '#a06030', label: '#7a4820' },
  fix:      { bg: '#fff8f0', border: '#f0c060', accent: '#c87010' },
  success:  '#5a8a4a',
  good:     '#e8f5e0',
  tag:      '#e8f0e8',
};

// ─── Meal Library ─────────────────────────────────────────────────────────────

const MEALS = {
  breakfast: [
    {
      id: 'oat_porridge',
      emoji: '🥣',
      name: { en: 'Oat Porridge & Banana', ru: 'Овсяная каша с бананом' },
      calories: 365, protein: 12, carbs: 62, fat: 8,
      tags: ['anti-bloat', 'gentle-fiber', 'warm'],
      ingredients: {
        en: ['½ cup rolled oats', '1 cup oat or almond milk', '1 ripe banana, sliced', '½ tsp cinnamon', '1 tsp honey'],
        ru: ['½ стакана овсяных хлопьев', '1 стакан овсяного или миндального молока', '1 спелый банан, нарезанный', '½ ч.л. корицы', '1 ч.л. мёда'],
      },
      prep: {
        en: ['Cook oats in milk over medium heat for 5 min, stirring often.', 'Remove from heat. Stir in cinnamon and honey.', 'Top with sliced banana. Serve warm.'],
        ru: ['Варите хлопья в молоке на среднем огне 5 мин, помешивая.', 'Снимите с огня. Добавьте корицу и мёд.', 'Сверху — нарезанный банан. Подавайте тёплым.'],
      },
      digestionNote: {
        en: 'Oats are soluble fiber that feeds good gut bacteria and eases digestion. Banana provides potassium to counteract water retention. Cinnamon gently stimulates digestive warmth.',
        ru: 'Овёс — растворимая клетчатка, питающая полезные бактерии. Банан даёт калий против задержки воды. Корица мягко разогревает пищеварение.',
      },
    },
    {
      id: 'scrambled_eggs',
      emoji: '🍳',
      name: { en: 'Soft Eggs & Sourdough', ru: 'Мягкая яичница с хлебом' },
      calories: 310, protein: 18, carbs: 28, fat: 13,
      tags: ['high-protein', 'light-carb', 'warm'],
      ingredients: {
        en: ['2 eggs', '1 slice sourdough toast', '3–4 cucumber slices', 'Pinch of sea salt', 'Drizzle of olive oil'],
        ru: ['2 яйца', '1 ломтик хлеба на закваске', '3–4 кружочка огурца', 'Щепотка морской соли', 'Капля оливкового масла'],
      },
      prep: {
        en: ['Beat eggs gently. Cook on low heat with a drizzle of olive oil.', 'Stir slowly for soft, creamy texture — do not overcook.', 'Toast sourdough. Serve with cucumber on the side.'],
        ru: ['Взбейте яйца. Готовьте на слабом огне с маслом.', 'Медленно помешивайте для кремовой текстуры — не пережаривайте.', 'Поджарьте хлеб. Подавайте с огурцом.'],
      },
      digestionNote: {
        en: 'Eggs are highly bioavailable protein, very easy on sensitive stomachs. Sourdough fermentation makes it more digestible than regular bread — less bloating. Low fiber start for sluggish mornings.',
        ru: 'Яйца — легкоусвояемый белок, мягкий для желудка. Закваска делает хлеб легче обычного — меньше вздутия. Мало клетчатки — хорошо для вялых утр.',
      },
    },
    {
      id: 'buckwheat_porridge',
      emoji: '🍚',
      name: { en: 'Buckwheat & Soft-Boiled Egg', ru: 'Гречневая каша с яйцом' },
      calories: 340, protein: 15, carbs: 48, fat: 9,
      tags: ['mineral-rich', 'anti-constipation', 'warm'],
      ingredients: {
        en: ['½ cup raw buckwheat, rinsed', '1 soft-boiled egg (7 min)', '½ tsp butter', 'Sea salt'],
        ru: ['½ стакана гречки, промытой', '1 яйцо всмятку (7 мин)', '½ ч.л. сливочного масла', 'Морская соль'],
      },
      prep: {
        en: ['Cook buckwheat in 1 cup water on low heat for 15 min.', 'Soft-boil egg: 7 min in boiling water, then cool water.', 'Add butter and salt to buckwheat. Serve together warm.'],
        ru: ['Варите гречку в 1 стакане воды на слабом огне 15 мин.', 'Яйцо всмятку: 7 мин в кипятке, затем холодная вода.', 'Добавьте масло и соль. Подавайте вместе тёплыми.'],
      },
      digestionNote: {
        en: 'Buckwheat gently stimulates bowel movement — ideal for constipation-prone mornings. It\'s rich in magnesium (neck & back muscle tension relief) and contains rutin for circulation.',
        ru: 'Гречка мягко стимулирует кишечник — идеально при склонности к запорам. Богата магнием (снимает напряжение мышц) и рутином для кровообращения.',
      },
    },
    {
      id: 'rice_porridge',
      emoji: '🍐',
      name: { en: 'Rice Porridge & Pear', ru: 'Рисовая каша с грушей' },
      calories: 290, protein: 6, carbs: 58, fat: 3,
      tags: ['lightest', 'anti-bloat', 'gut-soothing'],
      ingredients: {
        en: ['½ cup white rice', '1½ cups water or oat milk', '½ ripe pear, grated', '½ tsp cinnamon', '1 tsp honey'],
        ru: ['½ стакана белого риса', '1½ стакана воды или овсяного молока', '½ спелой груши, тёртой', '½ ч.л. корицы', '1 ч.л. мёда'],
      },
      prep: {
        en: ['Cook rice in liquid on low heat until very soft, 18–20 min.', 'Stir in cinnamon and honey.', 'Fold in grated pear just before serving. Serve warm.'],
        ru: ['Варите рис в жидкости на слабом огне до мягкости, 18–20 мин.', 'Добавьте корицу и мёд.', 'Введите тёртую грушу перед подачей. Подавайте тёплым.'],
      },
      digestionNote: {
        en: 'White rice is the gentlest grain — it soothes the gut lining without stimulating it. Best on days when digestion needs complete rest. Pear adds sorbitol for gentle regularity.',
        ru: 'Белый рис — самое мягкое зерно: успокаивает слизистую, не раздражая её. Лучший выбор в дни, когда кишечнику нужен полный отдых. Груша добавляет сорбитол для мягкой регулярности.',
      },
    },
    {
      id: 'yogurt_bowl',
      emoji: '🫙',
      name: { en: 'Yogurt Bowl & Granola', ru: 'Йогурт с гранолой' },
      calories: 320, protein: 15, carbs: 38, fat: 11,
      tags: ['probiotic', 'if-tolerated'],
      ingredients: {
        en: ['150g plain full-fat yogurt', '2 tbsp low-sugar granola', 'Small handful blueberries', '1 tsp honey'],
        ru: ['150г натурального жирного йогурта', '2 ст.л. гранолы (малосладкой)', 'Горсть черники', '1 ч.л. мёда'],
      },
      prep: {
        en: ['Spoon yogurt into a bowl. Let it sit at room temperature 10 min.', 'Top with granola, berries, and honey. Eat slowly.'],
        ru: ['Выложите йогурт в миску. Дайте постоять при комнатной температуре 10 мин.', 'Добавьте гранолу, ягоды и мёд. Ешьте медленно.'],
      },
      digestionNote: {
        en: 'Choose this only on well-tolerated dairy days. Probiotics support gut flora. ⚠️ If you notice bloating after dairy — choose oat porridge instead without hesitation.',
        ru: 'Выбирайте только в дни хорошей переносимости молочного. Пробиотики поддерживают флору. ⚠️ Если после молочного появляется вздутие — без раздумий берите овсяную кашу.',
      },
    },
  ],

  lunch: [
    {
      id: 'cod_rice_zucchini',
      emoji: '🐟',
      name: { en: 'Baked Cod + Rice + Zucchini', ru: 'Запечённая треска с рисом и кабачком' },
      calories: 450, protein: 38, carbs: 48, fat: 8,
      tags: ['light-protein', 'anti-bloat', 'classic'],
      ingredients: {
        en: ['150g cod fillet', '½ cup white rice (cooked)', '1 medium zucchini, sliced', 'Lemon juice, dill, olive oil, sea salt'],
        ru: ['150г филе трески', '½ стакана белого риса', '1 кабачок, нарезанный', 'Лимонный сок, укроп, оливковое масло, морская соль'],
      },
      prep: {
        en: ['Season cod with lemon, salt, dill. Bake at 180°C for 15–18 min.', 'Sauté zucchini in olive oil 5–7 min until soft.', 'Serve over rice, drizzle with lemon.'],
        ru: ['Приправьте треску лимоном, солью, укропом. Запекайте при 180°C 15–18 мин.', 'Обжарьте кабачок в масле 5–7 мин до мягкости.', 'Подавайте с рисом, сбрызните лимоном.'],
      },
      digestionNote: {
        en: 'White fish is the easiest protein to digest — it doesn\'t ferment in the gut. Cooked zucchini is anti-inflammatory and low-FODMAP. This combination actively reduces bloating.',
        ru: 'Белая рыба — самый лёгкий белок: не ферментирует в кишечнике. Мягкий кабачок противовоспалителен и не вызывает газов. Это сочетание активно снижает вздутие.',
      },
    },
    {
      id: 'chicken_soup',
      emoji: '🍲',
      name: { en: 'Chicken Vegetable Soup', ru: 'Куриный овощной суп' },
      calories: 380, protein: 28, carbs: 38, fat: 10,
      tags: ['gut-healing', 'hydrating', 'restorative'],
      ingredients: {
        en: ['120g chicken breast', '1 carrot, diced', '1 potato, diced', '½ onion', 'Dill, bay leaf, sea salt'],
        ru: ['120г куриной грудки', '1 морковь, кубиками', '1 картошка, кубиками', '½ луковицы', 'Укроп, лавровый лист, морская соль'],
      },
      prep: {
        en: ['Simmer chicken in water 20 min. Remove and shred.', 'Add carrot, potato, onion to broth. Cook 15 min.', 'Return chicken, add dill and bay leaf. Season, serve hot.'],
        ru: ['Варите курицу 20 мин. Достаньте и нарвите.', 'Добавьте овощи в бульон. Варите 15 мин.', 'Верните курицу, добавьте укроп и лавровый лист. Посолите, подавайте горячим.'],
      },
      digestionNote: {
        en: 'Chicken broth heals the gut lining and provides electrolytes. The warm liquid supports peristalsis — natural bowel movement. Best lunch on bloating or discomfort days.',
        ru: 'Куриный бульон восстанавливает слизистую и даёт электролиты. Тёплая жидкость поддерживает перистальтику. Лучший обед в дни вздутия или дискомфорта.',
      },
    },
    {
      id: 'turkey_patties',
      emoji: '🥩',
      name: { en: 'Turkey Patties + Potato + Green Beans', ru: 'Котлеты из индейки с картошкой и фасолью' },
      calories: 490, protein: 35, carbs: 46, fat: 14,
      tags: ['high-protein', 'satisfying', 'warm'],
      ingredients: {
        en: ['150g ground turkey', '1 egg for binding', '1 medium potato', 'Handful green beans', 'Sea salt, herbs'],
        ru: ['150г фарша из индейки', '1 яйцо (для связки)', '1 картофель', 'Горсть стручковой фасоли', 'Морская соль, зелень'],
      },
      prep: {
        en: ['Mix turkey with egg, salt, herbs. Form small patties.', 'Cook in a pan with minimal oil, medium heat, 4–5 min per side.', 'Boil potato, mash with pinch of salt. Steam green beans 5 min.'],
        ru: ['Смешайте фарш с яйцом, солью, зеленью. Сформируйте котлеты.', 'Готовьте на сковороде с минимальным маслом 4–5 мин с каждой стороны.', 'Отварите картофель, сделайте пюре. Приготовьте фасоль на пару 5 мин.'],
      },
      digestionNote: {
        en: 'Ground turkey is easy to break down — gentler than whole meat. Mashed potato is one of the most gut-friendly carbs. Green beans provide folate and gentle, soluble fiber.',
        ru: 'Фарш легче расщепляется, чем цельное мясо. Пюре — один из самых мягких углеводов для кишечника. Стручковая фасоль даёт фолат и мягкую клетчатку.',
      },
    },
    {
      id: 'salmon_quinoa',
      emoji: '🍣',
      name: { en: 'Poached Salmon + Quinoa + Roasted Pepper', ru: 'Лосось с киноа и перцем' },
      calories: 520, protein: 40, carbs: 44, fat: 16,
      tags: ['omega-3', 'anti-inflammatory', 'nervous-system'],
      ingredients: {
        en: ['150g salmon fillet', '½ cup quinoa', '1 bell pepper, roasted', 'Lemon, olive oil, dill'],
        ru: ['150г филе лосося', '½ стакана киноа', '1 болгарский перец, запечённый', 'Лимон, оливковое масло, укроп'],
      },
      prep: {
        en: ['Poach salmon in salted water with lemon for 10–12 min.', 'Cook quinoa: 1 part to 2 parts water, 15 min.', 'Roast bell pepper at 200°C for 20 min. Peel. Plate together.'],
        ru: ['Отварите лосось в подсоленной воде с лимоном 10–12 мин.', 'Варите киноа: 1 к 2 частям воды, 15 мин.', 'Запекайте перец при 200°C 20 мин. Очистите. Подавайте вместе.'],
      },
      digestionNote: {
        en: 'Salmon omega-3s reduce gut and systemic inflammation, and directly support your stress-sensitive nervous system. Quinoa contains all essential amino acids. Most nourishing option on high-stress days.',
        ru: 'Омега-3 лосося снижает воспаление и напрямую поддерживает нервную систему. Киноа содержит все незаменимые аминокислоты. Самый питательный вариант в стрессовые дни.',
      },
    },
    {
      id: 'chicken_sweet_potato',
      emoji: '🍗',
      name: { en: 'Chicken Breast + Sweet Potato + Broccoli', ru: 'Курица с бататом и брокколи' },
      calories: 480, protein: 38, carbs: 52, fat: 9,
      tags: ['prebiotic', 'balanced', 'anti-inflammatory'],
      ingredients: {
        en: ['150g chicken breast', '1 medium sweet potato', '1 cup broccoli florets', 'Olive oil, paprika, sea salt'],
        ru: ['150г куриной грудки', '1 батат', '1 стакан соцветий брокколи', 'Оливковое масло, паприка, морская соль'],
      },
      prep: {
        en: ['Season chicken, bake at 180°C for 20–22 min.', 'Bake sweet potato at 200°C for 30 min (or microwave 8 min).', 'Steam broccoli 5–6 min. Plate with olive oil drizzle.'],
        ru: ['Приправьте курицу, запекайте при 180°C 20–22 мин.', 'Запекайте батат при 200°C 30 мин (или в микроволновке 8 мин).', 'Брокколи на пару 5–6 мин. Подавайте с оливковым маслом.'],
      },
      digestionNote: {
        en: 'Sweet potato is a prebiotic food that actively feeds beneficial gut bacteria. Steamed broccoli (not raw) is well-tolerated and contains sulforaphane — a potent gut anti-inflammatory.',
        ru: 'Батат — пребиотик, активно питающий полезные бактерии. Брокколи на пару (не сырая) легко переносится и содержит сульфорафан — мощное противовоспалительное для кишечника.',
      },
    },
  ],

  dinner: [
    {
      id: 'steamed_tilapia',
      emoji: '🐠',
      name: { en: 'Steamed Tilapia + Carrots + Rice', ru: 'Тилапия на пару с морковью и рисом' },
      calories: 330, protein: 28, carbs: 38, fat: 6,
      tags: ['lightest', 'anti-bloat', 'easy'],
      ingredients: {
        en: ['120g tilapia fillet', '2 medium carrots, sliced', '⅓ cup white rice', 'Lemon juice, fresh dill, sea salt'],
        ru: ['120г филе тилапии', '2 моркови, нарезанные', '⅓ стакана белого риса', 'Лимонный сок, свежий укроп, морская соль'],
      },
      prep: {
        en: ['Steam tilapia over boiling water for 8–10 min.', 'Steam carrot slices alongside for 10–12 min.', 'Cook small portion of rice. Season everything with lemon and dill.'],
        ru: ['Готовьте тилапию на пару 8–10 мин.', 'Рядом готовьте морковь на пару 10–12 мин.', 'Сварите небольшую порцию риса. Приправьте лимоном и укропом.'],
      },
      digestionNote: {
        en: 'The lightest dinner in the plan. Ideal after a heavier lunch or when you feel any bloating. Steaming preserves nutrients without adding fats. Carrots soothe the gut wall overnight.',
        ru: 'Самый лёгкий ужин в плане. Идеален после тяжёлого обеда или при любом вздутии. Приготовление на пару сохраняет питательные вещества. Морковь успокаивает кишечник ночью.',
      },
    },
    {
      id: 'light_broth_soup',
      emoji: '🥣',
      name: { en: 'Light Chicken Broth Soup', ru: 'Лёгкий куриный бульон' },
      calories: 220, protein: 18, carbs: 20, fat: 6,
      tags: ['gut-healing', 'lightest', 'restorative'],
      ingredients: {
        en: ['80g cooked chicken breast, shredded', '500ml light chicken broth', '1 carrot', '2–3 potato cubes', 'Fresh dill, sea salt'],
        ru: ['80г варёной куриной грудки, нарванной', '500мл светлого куриного бульона', '1 морковь', '2–3 кубика картошки', 'Свежий укроп, морская соль'],
      },
      prep: {
        en: ['Heat broth. Add carrot and potato cubes. Cook 12–15 min.', 'Add shredded chicken. Heat through.', 'Finish with dill. No cream, no heavy additions.'],
        ru: ['Нагрейте бульон. Добавьте морковь и картошку. Варите 12–15 мин.', 'Добавьте нарванную курицу. Прогрейте.', 'Добавьте укроп. Никаких сливок и тяжёлых добавок.'],
      },
      digestionNote: {
        en: 'The most restorative evening option. Broth electrolytes rebalance water retention overnight. The gut rests completely while absorbing maximum nutrition from the liquid. Best on tough days.',
        ru: 'Самый восстанавливающий вечерний вариант. Электролиты бульона восстанавливают водный баланс ночью. Кишечник полностью отдыхает, усваивая максимум питательных веществ из жидкости.',
      },
    },
    {
      id: 'turkey_buckwheat',
      emoji: '🥦',
      name: { en: 'Turkey Breast + Zucchini + Buckwheat', ru: 'Грудка индейки с кабачком и гречкой' },
      calories: 360, protein: 30, carbs: 38, fat: 8,
      tags: ['tryptophan', 'magnesium', 'grounding'],
      ingredients: {
        en: ['120g turkey breast', '1 zucchini, sliced', '⅓ cup buckwheat', 'Olive oil, sea salt, fresh herbs'],
        ru: ['120г грудки индейки', '1 кабачок, нарезанный', '⅓ стакана гречки', 'Оливковое масло, морская соль, свежая зелень'],
      },
      prep: {
        en: ['Cook turkey breast in salted water 15–18 min. Slice.', 'Steam or sauté zucchini with olive oil for 5 min.', 'Cook buckwheat in 2× water for 15 min. Add fresh herbs.'],
        ru: ['Отварите грудку индейки в подсоленной воде 15–18 мин. Нарежьте.', 'Приготовьте кабачок на пару или обжарьте с маслом 5 мин.', 'Варите гречку в двойном объёме воды 15 мин. Добавьте зелень.'],
      },
      digestionNote: {
        en: 'Turkey is rich in tryptophan — it converts to serotonin, directly supporting your stress-sensitive nervous system and improving sleep. Buckwheat magnesium eases neck and back muscle tension overnight.',
        ru: 'Индейка богата триптофаном — превращается в серотонин, поддерживая нервную систему и улучшая сон. Магний гречки снимает напряжение мышц шеи и спины ночью.',
      },
    },
    {
      id: 'soft_omelette',
      emoji: '🥚',
      name: { en: 'Soft Omelette + Sautéed Spinach', ru: 'Мягкий омлет со шпинатом' },
      calories: 295, protein: 19, carbs: 14, fat: 18,
      tags: ['quick', 'light-carb', 'magnesium'],
      ingredients: {
        en: ['2 eggs', '2 tbsp oat milk', 'Handful baby spinach', '1 thin slice sourdough', 'Olive oil, sea salt'],
        ru: ['2 яйца', '2 ст.л. овсяного молока', 'Горсть шпината', '1 тонкий ломтик хлеба на закваске', 'Оливковое масло, морская соль'],
      },
      prep: {
        en: ['Whisk eggs with oat milk and salt.', 'Cook in oiled pan on low heat — fold gently, do not brown.', 'Wilt spinach in same pan for 1–2 min. Serve with thin sourdough.'],
        ru: ['Взбейте яйца с молоком и солью.', 'Готовьте в смазанной маслом сковороде на слабом огне — сложите аккуратно, не зажаривайте.', 'Обжарьте шпинат в той же сковороде 1–2 мин. Подавайте с хлебом.'],
      },
      digestionNote: {
        en: 'Quick and easy on evenings when you have no energy to cook. Spinach provides iron and magnesium — excellent for muscle tension relief and sleep quality. Low FODMAP, very gentle.',
        ru: 'Быстро и легко в вечера без сил готовить. Шпинат даёт железо и магний — отлично снимает мышечное напряжение и улучшает сон. Минимум FODMAP, очень мягко.',
      },
    },
    {
      id: 'fish_stew',
      emoji: '🍛',
      name: { en: 'White Fish Light Stew + Rice', ru: 'Лёгкое рагу из белой рыбы с рисом' },
      calories: 350, protein: 32, carbs: 40, fat: 7,
      tags: ['comforting', 'warm', 'lycopene'],
      ingredients: {
        en: ['130g white fish (cod or hake)', '1 tomato, diced', '1 carrot, sliced', '½ cup white rice', 'Olive oil, bay leaf, sea salt, parsley'],
        ru: ['130г белой рыбы (треска или хек)', '1 помидор, нарезанный', '1 морковь, нарезанная', '½ стакана белого риса', 'Оливковое масло, лавровый лист, соль, петрушка'],
      },
      prep: {
        en: ['Sauté carrot in olive oil 3 min. Add diced tomato, cook 3 min more.', 'Add fish pieces, bay leaf, 100ml water. Cover and simmer 10 min.', 'Season with salt and parsley. Serve over rice.'],
        ru: ['Обжарьте морковь в масле 3 мин. Добавьте помидор, готовьте ещё 3 мин.', 'Добавьте кусочки рыбы, лавровый лист, 100мл воды. Накройте, тушите 10 мин.', 'Посолите, добавьте петрушку. Подавайте с рисом.'],
      },
      digestionNote: {
        en: 'Cooked tomato (unlike raw) is gentle and rich in lycopene — anti-inflammatory. This stew is warming without being heavy. Perfect for cold or high-stress days when you need comfort.',
        ru: 'Варёный помидор (не сырой) мягкий и богатый ликопином — противовоспалительным. Это рагу согревает, не утяжеляя. Идеально в холодные или стрессовые дни, когда нужен уют.',
      },
    },
  ],

  snack: [
    {
      id: 'chamomile_rice_cakes',
      emoji: '🍵',
      name: { en: 'Chamomile Tea + Rice Cakes', ru: 'Ромашковый чай + рисовые хлебцы' },
      calories: 110, protein: 2, carbs: 22, fat: 1,
      tags: ['anti-bloat', 'calming', 'lightest'],
      ingredients: {
        en: ['2 unsalted rice cakes', '1 cup chamomile tea (no sugar)'],
        ru: ['2 несолёных рисовых хлебца', '1 чашка ромашкового чая (без сахара)'],
      },
      prep: {
        en: ['Brew chamomile for 5 min. Enjoy slowly with rice cakes.'],
        ru: ['Заварите ромашку на 5 мин. Пейте медленно с хлебцами.'],
      },
      digestionNote: {
        en: 'Chamomile is clinically anti-spasmodic — it relaxes intestinal muscles and actively reduces bloating and gas. Perfect for afternoon anxiety or any digestive discomfort.',
        ru: 'Ромашка клинически антиспазматична — расслабляет мышцы кишечника и активно снижает вздутие и газы. Идеальна при послеобеденной тревоге или любом дискомфорте.',
      },
    },
    {
      id: 'banana',
      emoji: '🍌',
      name: { en: 'Ripe Banana', ru: 'Спелый банан' },
      calories: 105, protein: 1, carbs: 27, fat: 0,
      tags: ['potassium', 'quick-energy', 'gentle'],
      ingredients: {
        en: ['1 ripe banana (with brown spots — more digestible and sweeter)'],
        ru: ['1 спелый банан (с коричневыми пятнами — более усвояемый и слаще)'],
      },
      prep: {
        en: ['Eat as is. Always choose ripe — underripe bananas can cause bloating due to resistant starch.'],
        ru: ['Ешьте как есть. Всегда выбирайте спелый — незрелые бананы вызывают вздутие из-за резистентного крахмала.'],
      },
      digestionNote: {
        en: 'Potassium in ripe bananas counteracts sodium and helps reduce water retention. Provides serotonin precursors. Quick gentle energy without blood sugar spike.',
        ru: 'Калий спелого банана нейтрализует натрий и снижает задержку воды. Содержит предшественники серотонина. Быстрая мягкая энергия без скачков сахара.',
      },
    },
    {
      id: 'soft_pear',
      emoji: '🍐',
      name: { en: 'Soft Ripe Pear', ru: 'Мягкая спелая груша' },
      calories: 85, protein: 1, carbs: 22, fat: 0,
      tags: ['sorbitol', 'anti-constipation', 'fiber'],
      ingredients: {
        en: ['1 ripe pear (soft to the touch)', 'Tip: warm in microwave 30 sec on sluggish digestion days'],
        ru: ['1 спелая груша (мягкая на ощупь)', 'Совет: нагрейте в микроволновке 30 сек в дни вялого пищеварения'],
      },
      prep: {
        en: ['Eat ripe only — avoid hard pears. Warm briefly if digestion is slow today.'],
        ru: ['Ешьте только спелую. Нагрейте ненадолго при вялом пищеварении.'],
      },
      digestionNote: {
        en: 'Pear contains sorbitol — a natural gentle laxative that helps with occasional constipation. Best snack on days when bowel movement has been irregular or absent.',
        ru: 'Груша содержит сорбитол — природное мягкое слабительное при случайных запорах. Лучший перекус в дни нерегулярного или отсутствующего стула.',
      },
    },
    {
      id: 'soaked_almonds',
      emoji: '🌰',
      name: { en: '12 Soaked Almonds', ru: '12 замоченных миндалин' },
      calories: 120, protein: 4, carbs: 4, fat: 10,
      tags: ['magnesium', 'muscle-tension', 'minerals'],
      ingredients: {
        en: ['12 raw almonds', 'Soak in water overnight or 4+ hours before eating'],
        ru: ['12 сырых миндалин', 'Замочите в воде на ночь или на 4+ часа'],
      },
      prep: {
        en: ['Soak almonds overnight. Drain, optionally peel (easier to digest). Eat slowly.'],
        ru: ['Замочите на ночь. Слейте воду, по желанию очистите. Ешьте медленно.'],
      },
      digestionNote: {
        en: 'Soaking removes phytic acid — dramatically improving magnesium and calcium absorption. Magnesium is your best mineral for neck and back muscle tension relief. Also supports sleep.',
        ru: 'Замачивание убирает фитиновую кислоту — резко улучшая усвоение магния и кальция. Магний — лучший минерал от напряжения мышц шеи и спины. Также улучшает сон.',
      },
    },
    {
      id: 'plain_yogurt',
      emoji: '🥛',
      name: { en: 'Small Bowl Plain Yogurt', ru: 'Небольшая порция натурального йогурта' },
      calories: 70, protein: 5, carbs: 7, fat: 2,
      tags: ['probiotic', 'if-tolerated', 'light'],
      ingredients: {
        en: ['100g plain full-fat yogurt (no sugar, no flavoring)'],
        ru: ['100г натурального жирного йогурта (без сахара, без добавок)'],
      },
      prep: {
        en: ['Serve at room temperature — cold dairy is harder on sensitive digestion.'],
        ru: ['Подавайте при комнатной температуре — холодная молочка тяжелее для чувствительного пищеварения.'],
      },
      digestionNote: {
        en: 'Probiotics support healthy microbiome and nutrient absorption. Only when dairy is well tolerated. If you feel any heaviness after — choose soaked almonds or a banana instead.',
        ru: 'Пробиотики поддерживают микрофлору и усвоение питательных веществ. Только при хорошей переносимости молочного. При любой тяжести — выберите миндаль или банан.',
      },
    },
  ],
};

// ─── 7-Day Rotation (index by day of week: 0=Sun … 6=Sat) ───────────────────

const WEEK_ROTATION = [
  { b: 'scrambled_eggs',    l: 'chicken_sweet_potato', d: 'steamed_tilapia',  s: 'plain_yogurt' },       // Sun
  { b: 'oat_porridge',      l: 'cod_rice_zucchini',    d: 'turkey_buckwheat', s: 'chamomile_rice_cakes' }, // Mon
  { b: 'scrambled_eggs',    l: 'chicken_sweet_potato', d: 'steamed_tilapia',  s: 'banana' },               // Tue
  { b: 'buckwheat_porridge',l: 'turkey_patties',       d: 'fish_stew',        s: 'soaked_almonds' },       // Wed
  { b: 'rice_porridge',     l: 'salmon_quinoa',        d: 'light_broth_soup', s: 'soft_pear' },            // Thu
  { b: 'yogurt_bowl',       l: 'cod_rice_zucchini',    d: 'soft_omelette',    s: 'chamomile_rice_cakes' }, // Fri
  { b: 'oat_porridge',      l: 'chicken_soup',         d: 'turkey_buckwheat', s: 'banana' },               // Sat
];

// ─── Calorie Calculation (Mifflin-St Jeor for women) ─────────────────────────

function calcTargetCalories({ weight, height, age, activityLevel }) {
  if (!weight || !height || !age) return 1500;
  const bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  const mult = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725 };
  const tdee = bmr * (mult[activityLevel] || 1.375);
  return Math.max(1400, Math.round(tdee * 0.9)); // gentle 10% deficit, min 1400
}

// ─── Adaptive Plan Logic ──────────────────────────────────────────────────────

function getAdaptivePlan(base, symptoms = []) {
  if (!symptoms.length || symptoms.includes('good')) return { ...base };
  const plan = { ...base };
  if (symptoms.includes('bloating') || symptoms.includes('heaviness')) {
    plan.b = 'rice_porridge'; plan.l = 'chicken_soup';
    plan.d = 'light_broth_soup'; plan.s = 'chamomile_rice_cakes';
  } else if (symptoms.includes('constipation')) {
    plan.b = 'oat_porridge'; plan.s = 'soft_pear';
  } else if (symptoms.includes('low_energy')) {
    plan.b = 'oat_porridge'; plan.l = 'salmon_quinoa';
  } else if (symptoms.includes('tension')) {
    plan.s = 'soaked_almonds'; plan.d = 'turkey_buckwheat';
  }
  return plan;
}

// ─── Fix My Day Data ──────────────────────────────────────────────────────────

const FIX_SITUATIONS = [
  { id: 'heavy_meal',    emoji: '🍕', en: 'Ate something heavy',     ru: 'Съела что-то тяжёлое' },
  { id: 'overate',       emoji: '😮', en: 'Ate too much',            ru: 'Переела' },
  { id: 'bad_food',      emoji: '🛑', en: 'Ate off-plan / processed',ru: 'Съела что-то не то' },
  { id: 'bloating',      emoji: '😤', en: 'Feeling bloated right now',ru: 'Сейчас вздутие' },
  { id: 'skipped_meal',  emoji: '⏭️', en: 'Skipped a meal',          ru: 'Пропустила приём пищи' },
  { id: 'low_energy',    emoji: '🔋', en: 'Low energy / tired',      ru: 'Низкая энергия / устала' },
];

const FIX_ADVICE = {
  heavy_meal: {
    en: {
      title: "Heavy meal — let's reset gently",
      now: "Drink a cup of warm chamomile or ginger tea now. Rest 20–30 min — no more food until you feel lighter.",
      nextMeal: "Your next meal should be very light: a small bowl of chicken broth soup, or chamomile tea + rice cakes. Give your stomach space to process.",
      avoid: "Coffee, raw vegetables, more heavy proteins, dairy, or anything complex today.",
      tomorrowTag: "Anti-Bloat Day",
      tomorrow: "Morning: rice porridge with pear. Midday: chicken vegetable soup. Evening: steamed fish + rice. Drink warm water with lemon first thing (room temperature, not cold).",
    },
    ru: {
      title: "Тяжёлая еда — мягко перезагрузимся",
      now: "Выпейте тёплый ромашковый или имбирный чай. Отдохните 20–30 мин — пока не есть, пока не станет легче.",
      nextMeal: "Следующий приём должен быть очень лёгким: небольшая миска бульона или ромашковый чай + рисовые хлебцы. Дайте желудку пространство.",
      avoid: "Кофе, сырые овощи, ещё тяжёлые белки, молочное или что-то сложное сегодня.",
      tomorrowTag: "День без вздутия",
      tomorrow: "Утро: рисовая каша с грушей. Обед: куриный суп. Ужин: рыба на пару + рис. Выпейте тёплую воду с лимоном утром (комнатной температуры, не холодную).",
    },
  },
  overate: {
    en: {
      title: "Overate — a gentle reset",
      now: "Take a slow 10-minute walk if possible — it helps digestion move. Peppermint tea also helps.",
      nextMeal: "If you overate breakfast or lunch — skip your snack. If dinner, have only herbal tea for the evening.",
      avoid: "Any more food until you feel genuinely hungry again. Don't punish yourself — just listen.",
      tomorrowTag: "Light Day",
      tomorrow: "Smaller portions all day. Morning: soft scrambled eggs (no toast). Midday: chicken soup. Evening: broth only or steamed tilapia. Follow your hunger — eat when hungry, stop when content.",
    },
    ru: {
      title: "Переела — мягкий сброс",
      now: "По возможности медленная прогулка 10 мин — помогает пищеварению. Чай с мятой тоже помогает.",
      nextMeal: "Если переели завтрак или обед — пропустите перекус. Если ужин — вечером только травяной чай.",
      avoid: "Никакой еды, пока не почувствуете настоящий голод. Не наказывайте себя — просто прислушайтесь.",
      tomorrowTag: "Лёгкий день",
      tomorrow: "Меньшие порции весь день. Утро: мягкая яичница (без хлеба). Обед: куриный суп. Ужин: только бульон или тилапия на пару. Ешьте по голоду, останавливайтесь в сытости.",
    },
  },
  bad_food: {
    en: {
      title: "Off-plan food — no judgment here",
      now: "Warm water with a squeeze of lemon right now. It starts moving things through your system gently.",
      nextMeal: "Choose the simplest thing available: plain rice, a boiled egg, or plain yogurt if tolerated. Nothing processed.",
      avoid: "More processed food, caffeine, alcohol, anything sweet or heavy for the rest of the day.",
      tomorrowTag: "Reset Day",
      tomorrow: "Back to basics. Morning: rice porridge. Midday: chicken vegetable soup. Evening: steamed fish + rice. Herbal tea between meals. No snacks unless genuinely hungry.",
    },
    ru: {
      title: "Не по плану — без осуждений",
      now: "Прямо сейчас — тёплая вода с лимоном. Мягко помогает системе двигаться.",
      nextMeal: "Выберите самое простое: белый рис, варёное яйцо или натуральный йогурт при переносимости. Ничего обработанного.",
      avoid: "Ещё обработанные продукты, кофеин, алкоголь, сладкое или тяжёлое до конца дня.",
      tomorrowTag: "День перезагрузки",
      tomorrow: "Возврат к основам. Утро: рисовая каша. Обед: куриный суп. Ужин: рыба на пару + рис. Травяной чай между приёмами. Перекус только при настоящем голоде.",
    },
  },
  bloating: {
    en: {
      title: "Bloating — let's decompress",
      now: "Lie on your left side for 10 min — this helps move gas through the digestive tract. Chamomile tea is your best friend.",
      nextMeal: "Only warm liquid for the next meal: broth soup or chamomile tea. No solid food until the feeling passes.",
      avoid: "Raw vegetables, dairy, beans, fizzy drinks, or anything complex.",
      tomorrowTag: "Gut Rest Day",
      tomorrow: "Morning: plain rice porridge (no extras). Midday: light chicken broth soup. Evening: steamed fish + steamed carrots. Snack: chamomile tea only. Warm water 30 min before each meal.",
    },
    ru: {
      title: "Вздутие — разгрузимся",
      now: "Лягте на левый бок на 10 мин — помогает продвижению газов. Ромашковый чай — ваш лучший друг сейчас.",
      nextMeal: "Только тёплая жидкость: бульон или ромашковый чай. Никакой твёрдой пищи, пока не пройдёт.",
      avoid: "Сырые овощи, молочное, бобовые, газированные напитки, всё сложное.",
      tomorrowTag: "День отдыха кишечника",
      tomorrow: "Утро: рисовая каша без добавок. Обед: лёгкий куриный бульон. Ужин: рыба на пару + морковь. Перекус: только ромашковый чай. Тёплая вода за 30 мин до каждого приёма.",
    },
  },
  skipped_meal: {
    en: {
      title: "Missed a meal — refuel gently",
      now: "Don't rush to compensate. Start small: a banana, rice cakes, or a small yogurt first.",
      nextMeal: "Your next full meal: protein + light carbs eaten slowly. Eggs + sourdough, or chicken soup with bread.",
      avoid: "Overcompensating with a huge meal — it causes more discomfort than the skipped meal did.",
      tomorrowTag: "Normal Day",
      tomorrow: "Back to the regular plan. Add an extra snack (soaked almonds) if energy is low. Don't skip meals even when hunger is mild — consistency helps your digestion regulate itself.",
    },
    ru: {
      title: "Пропустили приём — дозаправимся мягко",
      now: "Не торопитесь компенсировать. Сначала что-то маленькое: банан, хлебцы или небольшой йогурт.",
      nextMeal: "Следующий полноценный приём: белок + лёгкие углеводы, медленно. Яичница + хлеб или куриный суп с хлебом.",
      avoid: "Компенсировать большой порцией — вызовет больше дискомфорта, чем пропущенный приём.",
      tomorrowTag: "Обычный день",
      tomorrow: "Возврат к обычному плану. Добавьте дополнительный перекус (замоченный миндаль) при низкой энергии. Не пропускайте приёмы даже при слабом голоде — регулярность помогает пищеварению.",
    },
  },
  low_energy: {
    en: {
      title: "Low energy — let's fuel up",
      now: "Warm water first, then something with carbs + protein within 20 min. A banana + small yogurt is perfect.",
      nextMeal: "Eggs + sourdough toast + banana. Or oat porridge. Protein and complex carbs restore energy steadily.",
      avoid: "Coffee as your only solution — it will crash you harder later. Sugary drinks or candy.",
      tomorrowTag: "Energy Day",
      tomorrow: "Slightly higher carbs at breakfast: oat porridge + banana. Lunch: salmon + quinoa (highest nutrition). Snack: soaked almonds + banana. Dinner: turkey + buckwheat (tryptophan for recovery).",
    },
    ru: {
      title: "Низкая энергия — подзарядимся",
      now: "Сначала тёплая вода, затем углеводы + белок в течение 20 мин. Банан + небольшой йогурт — идеально.",
      nextMeal: "Яйца + тост на закваске + банан. Или овсяная каша. Белок и сложные углеводы постепенно восстановят энергию.",
      avoid: "Только кофе — даст ещё большее падение позже. Сладкие напитки или конфеты.",
      tomorrowTag: "День энергии",
      tomorrow: "Больше углеводов на завтрак: овсянка + банан. Обед: лосось + киноа (максимум питательности). Перекус: миндаль + банан. Ужин: индейка + гречка (триптофан для восстановления).",
    },
  },
};

// ─── Symptom Options ──────────────────────────────────────────────────────────

const SYMPTOMS = [
  { id: 'good',        emoji: '✨', en: 'Felt great',       ru: 'Всё отлично' },
  { id: 'bloating',    emoji: '😤', en: 'Bloating',         ru: 'Вздутие' },
  { id: 'heaviness',   emoji: '😞', en: 'Heaviness',        ru: 'Тяжесть' },
  { id: 'constipation',emoji: '😣', en: 'Constipation',     ru: 'Запор' },
  { id: 'low_energy',  emoji: '🔋', en: 'Low energy',       ru: 'Низкая энергия' },
  { id: 'tension',     emoji: '💪', en: 'Muscle tension',   ru: 'Мышечное напряжение' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getMeal(type, id) {
  return MEALS[type]?.find(m => m.id === id) || MEALS[type][0];
}

function getAlternatives(type, currentId) {
  return MEALS[type].filter(m => m.id !== currentId).slice(0, 3);
}

function todayKey() {
  return new Date().toISOString().split('T')[0];
}

function yesterdayKey() {
  return new Date(Date.now() - 86400000).toISOString().split('T')[0];
}

// ─── Sub-component: Meal Card ─────────────────────────────────────────────────

function MealCard({ type, mealId, label, timeLabel, colors, lang, isLogged, onExpand, onLog, targetCal }) {
  const L = lang;
  const meal = getMeal(type, mealId);
  if (!meal) return null;

  return (
    <div style={{
      background: colors.bg,
      border: `1.5px solid ${colors.border}`,
      borderRadius: '16px',
      padding: '16px',
      position: 'relative',
      transition: 'transform 0.15s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '44px', height: '44px',
          borderRadius: '12px',
          background: 'rgba(255,255,255,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '22px', flexShrink: 0,
        }}>
          {meal.emoji}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', fontWeight: 500, color: colors.label, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '2px' }}>
            {timeLabel}
          </p>
          <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: '15px', fontWeight: 500, color: '#2d2518', lineHeight: 1.3 }}>
            {meal.name[L]}
          </p>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#9a8870', marginTop: '2px' }}>
            {meal.calories} kcal · {meal.protein}g {L === 'en' ? 'protein' : 'белка'}
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
          <button
            onClick={onExpand}
            style={{
              padding: '6px 12px', borderRadius: '20px',
              border: `1px solid ${colors.border}`,
              background: 'rgba(255,255,255,0.8)',
              fontFamily: "'Inter', sans-serif", fontSize: '12px',
              color: colors.label, cursor: 'pointer', fontWeight: 500,
            }}>
            {L === 'en' ? 'Details' : 'Детали'}
          </button>
          {!isLogged ? (
            <button
              onClick={onLog}
              style={{
                padding: '6px 12px', borderRadius: '20px',
                border: `1px solid ${colors.border}`,
                background: colors.label,
                fontFamily: "'Inter', sans-serif", fontSize: '12px',
                color: '#fff', cursor: 'pointer', fontWeight: 500,
              }}>
              {L === 'en' ? 'Log ✓' : 'Отметить ✓'}
            </button>
          ) : (
            <div style={{
              padding: '6px 12px', borderRadius: '20px',
              background: '#e8f5e0', textAlign: 'center',
              fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#5a8a4a',
            }}>
              ✓ {L === 'en' ? 'Done' : 'Готово'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Sub-component: Meal Detail Overlay ──────────────────────────────────────

function MealDetail({ type, mealId, lang, colors, onClose, onSwap, onLog, isLogged }) {
  const L = lang;
  const meal = getMeal(type, mealId);
  const [showSwap, setShowSwap] = useState(false);
  const alts = getAlternatives(type, mealId);

  if (!meal) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(45, 37, 24, 0.5)',
      display: 'flex', alignItems: 'flex-end',
    }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: '#fdfaf7',
        borderRadius: '24px 24px 0 0',
        padding: '0 0 40px',
        width: '100%',
        maxHeight: '85vh',
        overflowY: 'auto',
        animation: 'slideUp 0.3s ease',
      }}>
        <style>{`@keyframes slideUp { from { transform:translateY(100%); } to { transform:translateY(0); } }`}</style>

        {/* Header */}
        <div style={{
          padding: '20px 20px 16px',
          background: colors.bg,
          borderBottom: `1px solid ${colors.border}`,
          borderRadius: '24px 24px 0 0',
          position: 'sticky', top: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '28px' }}>{meal.emoji}</span>
              <div>
                <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: '17px', fontWeight: 500, color: '#2d2518' }}>
                  {meal.name[L]}
                </p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#9a8870' }}>
                  {meal.calories} kcal · {meal.protein}g {L === 'en' ? 'protein' : 'белка'} · {meal.carbs}g {L === 'en' ? 'carbs' : 'углев.'} · {meal.fat}g {L === 'en' ? 'fat' : 'жиров'}
                </p>
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#9a8870', padding: '4px' }}>✕</button>
          </div>
        </div>

        <div style={{ padding: '20px' }}>

          {/* Digestion Note */}
          <div style={{ background: '#f0f8f0', border: '1px solid #c0d8c0', borderRadius: '12px', padding: '12px 14px', marginBottom: '18px' }}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', fontWeight: 600, color: '#5a8a4a', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
              🌿 {L === 'en' ? 'Why this is good for you' : 'Почему это полезно для вас'}
            </p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#3a5a3a', lineHeight: 1.5 }}>
              {meal.digestionNote[L]}
            </p>
          </div>

          {/* Ingredients */}
          <div style={{ marginBottom: '18px' }}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', fontWeight: 600, color: '#8b7355', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '10px' }}>
              {L === 'en' ? 'Ingredients' : 'Ингредиенты'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {meal.ingredients[L].map((ing, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: colors.icon || '#8b7355', marginTop: '7px', flexShrink: 0 }} />
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#3a2e20', lineHeight: 1.4 }}>{ing}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Preparation */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', fontWeight: 600, color: '#8b7355', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '10px' }}>
              {L === 'en' ? 'Preparation' : 'Приготовление'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {meal.prep[L].map((step, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{
                    width: '22px', height: '22px', borderRadius: '50%',
                    background: colors.bg, border: `1.5px solid ${colors.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: "'Inter', sans-serif", fontSize: '11px', fontWeight: 600, color: colors.label || '#8b7355',
                    flexShrink: 0,
                  }}>{i + 1}</div>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#3a2e20', lineHeight: 1.5, paddingTop: '2px' }}>{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {!isLogged && (
              <button
                onClick={() => { onLog(); onClose(); }}
                style={{
                  flex: 1, padding: '13px', borderRadius: '12px',
                  background: '#8b7355', color: '#fff', border: 'none',
                  fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: 500,
                  cursor: 'pointer',
                }}>
                {L === 'en' ? '✓ Mark as Eaten' : '✓ Отметить как съеденное'}
              </button>
            )}
            <button
              onClick={() => setShowSwap(!showSwap)}
              style={{
                flex: 1, padding: '13px', borderRadius: '12px',
                background: '#fff', color: '#8b7355',
                border: '1.5px solid #c4a882',
                fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: 500,
                cursor: 'pointer',
              }}>
              {L === 'en' ? '↕ Change Meal' : '↕ Заменить'}
            </button>
          </div>

          {/* Swap picker */}
          {showSwap && (
            <div style={{ marginTop: '16px' }}>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', fontWeight: 600, color: '#8b7355', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '10px' }}>
                {L === 'en' ? 'Pick one of 3 alternatives:' : 'Выберите одну из 3 альтернатив:'}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {alts.map(alt => (
                  <button
                    key={alt.id}
                    onClick={() => { onSwap(alt.id); onClose(); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '12px 14px', borderRadius: '12px',
                      background: '#fff', border: '1.5px solid #ede8e2',
                      cursor: 'pointer', textAlign: 'left',
                    }}>
                    <span style={{ fontSize: '20px' }}>{alt.emoji}</span>
                    <div>
                      <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: '14px', fontWeight: 500, color: '#2d2518' }}>{alt.name[L]}</p>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#9a8870' }}>{alt.calories} kcal</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Sub-component: Symptom Log Overlay ──────────────────────────────────────

function SymptomLog({ lang, onSave, onClose }) {
  const L = lang;
  const [selected, setSelected] = useState([]);

  function toggle(id) {
    if (id === 'good') { setSelected(['good']); return; }
    const next = selected.filter(s => s !== 'good').includes(id)
      ? selected.filter(s => s !== id)
      : [...selected.filter(s => s !== 'good'), id];
    setSelected(next);
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 300,
      background: 'rgba(45, 37, 24, 0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{
        background: '#fdfaf7', borderRadius: '20px',
        padding: '24px', width: '100%', maxWidth: '340px',
        animation: 'fadeIn 0.2s ease',
      }}>
        <style>{`@keyframes fadeIn { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }`}</style>
        <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: '17px', fontWeight: 500, color: '#2d2518', marginBottom: '6px' }}>
          {L === 'en' ? 'How did you feel?' : 'Как вы себя чувствовали?'}
        </p>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#9a8870', marginBottom: '18px' }}>
          {L === 'en' ? 'Optional — helps tomorrow\'s plan adapt to you.' : 'По желанию — помогает завтрашнему плану адаптироваться.'}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '18px' }}>
          {SYMPTOMS.map(s => (
            <button
              key={s.id}
              onClick={() => toggle(s.id)}
              style={{
                padding: '10px 8px', borderRadius: '10px',
                border: `1.5px solid ${selected.includes(s.id) ? '#8b7355' : '#ede8e2'}`,
                background: selected.includes(s.id) ? '#f5f0e8' : '#fff',
                display: 'flex', alignItems: 'center', gap: '8px',
                cursor: 'pointer',
              }}>
              <span style={{ fontSize: '16px' }}>{s.emoji}</span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#3a2e20', fontWeight: selected.includes(s.id) ? 500 : 400 }}>
                {s[L]}
              </span>
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => onSave(selected)}
            style={{
              flex: 1, padding: '12px', borderRadius: '10px',
              background: '#8b7355', color: '#fff', border: 'none',
              fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: 500, cursor: 'pointer',
            }}>
            {L === 'en' ? 'Save' : 'Сохранить'}
          </button>
          <button onClick={onClose}
            style={{
              padding: '12px 18px', borderRadius: '10px',
              background: '#fff', color: '#9a8870', border: '1px solid #ede8e2',
              fontFamily: "'Inter', sans-serif", fontSize: '14px', cursor: 'pointer',
            }}>
            {L === 'en' ? 'Skip' : 'Пропустить'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MealPlan({ lang = 'en' }) {
  const L = lang;

  // ── State ──────────────────────────────────────────────────────────────────
  const [loaded, setLoaded] = useState(false);
  const [profile, setProfile] = useState(null);
  const [plan, setPlan] = useState(null);          // { b, l, d, s } meal IDs
  const [loggedMeals, setLoggedMeals] = useState({}); // { b: true, l: true, ... }
  const [view, setView] = useState('today');        // 'today' | 'fix' | 'week'
  const [expandedMeal, setExpandedMeal] = useState(null); // { type, mealId } or null
  const [loggingMeal, setLoggingMeal] = useState(null);   // meal type being logged
  const [fixSituation, setFixSituation] = useState(null);
  const [adaptationNote, setAdaptationNote] = useState(null);

  // Setup form state
  const [setupForm, setSetupForm] = useState({ weight: '', height: '', age: '', activityLevel: 'light' });

  // ── Load from localStorage ─────────────────────────────────────────────────
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('dba_meal_profile');
      if (savedProfile) {
        const p = JSON.parse(savedProfile);
        setProfile(p);

        const today = todayKey();
        const savedPlan = localStorage.getItem(`dba_meal_plan_${today}`);
        if (savedPlan) {
          setPlan(JSON.parse(savedPlan));
        } else {
          const dayOfWeek = new Date().getDay();
          const base = WEEK_ROTATION[dayOfWeek];
          const yFeedback = localStorage.getItem(`dba_meal_symptoms_${yesterdayKey()}`);
          const ySymptoms = yFeedback ? JSON.parse(yFeedback) : [];
          const adapted = getAdaptivePlan(base, ySymptoms);
          if (JSON.stringify(adapted) !== JSON.stringify(base)) {
            const note = ySymptoms.includes('bloating') || ySymptoms.includes('heaviness')
              ? (L === 'en' ? "Today's plan is lighter — based on how you felt yesterday." : "План сегодня легче — на основе вашего самочувствия вчера.")
              : ySymptoms.includes('constipation')
                ? (L === 'en' ? "Added gentle fiber today to support regularity." : "Добавлена мягкая клетчатка для регулярности.")
                : null;
            setAdaptationNote(note);
          }
          setPlan(adapted);
          localStorage.setItem(`dba_meal_plan_${today}`, JSON.stringify(adapted));
        }

        const savedLogged = localStorage.getItem(`dba_meal_logged_${today}`);
        if (savedLogged) setLoggedMeals(JSON.parse(savedLogged));
      }
    } catch {}
    setLoaded(true);
  }, []);

  // ── Handlers ───────────────────────────────────────────────────────────────

  function saveProfile() {
    const p = {
      weight: parseFloat(setupForm.weight),
      height: parseFloat(setupForm.height),
      age: parseInt(setupForm.age, 10),
      activityLevel: setupForm.activityLevel,
    };
    if (!p.weight || !p.height || !p.age) return;
    localStorage.setItem('dba_meal_profile', JSON.stringify(p));
    setProfile(p);
    const dayOfWeek = new Date().getDay();
    const base = WEEK_ROTATION[dayOfWeek];
    setPlan(base);
    localStorage.setItem(`dba_meal_plan_${todayKey()}`, JSON.stringify(base));
  }

  function logMeal(type) {
    setLoggingMeal(type);
  }

  function saveSymptoms(symptoms, type) {
    const logged = { ...loggedMeals, [type]: true };
    setLoggedMeals(logged);
    localStorage.setItem(`dba_meal_logged_${todayKey()}`, JSON.stringify(logged));
    // Accumulate symptoms for the day
    const key = `dba_meal_symptoms_${todayKey()}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    const merged = [...new Set([...existing, ...symptoms])];
    localStorage.setItem(key, JSON.stringify(merged));
    setLoggingMeal(null);
  }

  function swapMeal(type, newId) {
    const newPlan = { ...plan, [type.charAt(0)]: newId };
    setPlan(newPlan);
    localStorage.setItem(`dba_meal_plan_${todayKey()}`, JSON.stringify(newPlan));
  }

  // ── Render: not loaded ─────────────────────────────────────────────────────
  if (!loaded) return null;

  // ── Render: Setup ──────────────────────────────────────────────────────────
  if (!profile) {
    const isValid = setupForm.weight && setupForm.height && setupForm.age;
    const previewCal = isValid
      ? calcTargetCalories({ weight: parseFloat(setupForm.weight), height: parseFloat(setupForm.height), age: parseInt(setupForm.age), activityLevel: setupForm.activityLevel })
      : null;

    const activityOptions = [
      { id: 'sedentary', en: 'Mostly sitting', ru: 'В основном сижу', sub: { en: 'desk job / little movement', ru: 'офисная работа' } },
      { id: 'light',     en: 'Light movement', ru: 'Лёгкая активность', sub: { en: '1–3 light workouts / week', ru: '1–3 лёгких тренировки в неделю' } },
      { id: 'moderate',  en: 'Moderate active', ru: 'Умеренно активна', sub: { en: '3–5 workouts / week', ru: '3–5 тренировок в неделю' } },
      { id: 'active',    en: 'Very active', ru: 'Очень активна', sub: { en: '6–7 workouts / week', ru: '6–7 тренировок в неделю' } },
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '8px 4px 24px' }}>
        <div style={{ textAlign: 'center', padding: '8px 0 4px' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🌿</div>
          <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: '22px', fontWeight: 500, color: '#2d2518' }}>
            {L === 'en' ? 'Your Meal Plan' : 'Ваш план питания'}
          </p>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#9a8870', lineHeight: 1.5, marginTop: '6px', maxWidth: '280px', margin: '6px auto 0' }}>
            {L === 'en'
              ? 'Let\'s personalise your daily meals to your body and goals.'
              : 'Подберём ваш ежедневный рацион под ваше тело и цели.'}
          </p>
        </div>

        <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid #ede8e2' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            {[
              { key: 'weight', label: L === 'en' ? 'Weight (kg)' : 'Вес (кг)', placeholder: '62' },
              { key: 'height', label: L === 'en' ? 'Height (cm)' : 'Рост (см)', placeholder: '165' },
              { key: 'age',    label: L === 'en' ? 'Age' : 'Возраст', placeholder: '32' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', fontWeight: 500, color: '#8b7355', marginBottom: '6px' }}>{label}</p>
                <input
                  type="number"
                  placeholder={placeholder}
                  value={setupForm[key]}
                  onChange={e => setSetupForm({ ...setupForm, [key]: e.target.value })}
                  style={{
                    width: '100%', padding: '10px', borderRadius: '10px',
                    border: '1.5px solid #ede8e2', background: '#fdf9f5',
                    fontFamily: "'Inter', sans-serif", fontSize: '15px', color: '#2d2518',
                    outline: 'none', boxSizing: 'border-box', textAlign: 'center',
                  }}
                />
              </div>
            ))}
          </div>

          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', fontWeight: 500, color: '#8b7355', marginBottom: '10px' }}>
            {L === 'en' ? 'Activity level' : 'Уровень активности'}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {activityOptions.map(opt => (
              <button
                key={opt.id}
                onClick={() => setSetupForm({ ...setupForm, activityLevel: opt.id })}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '11px 14px', borderRadius: '10px',
                  border: `1.5px solid ${setupForm.activityLevel === opt.id ? '#8b7355' : '#ede8e2'}`,
                  background: setupForm.activityLevel === opt.id ? '#fdf5ec' : '#fff',
                  cursor: 'pointer', textAlign: 'left',
                }}>
                <div style={{
                  width: '18px', height: '18px', borderRadius: '50%',
                  border: `2px solid ${setupForm.activityLevel === opt.id ? '#8b7355' : '#d0c8be'}`,
                  background: setupForm.activityLevel === opt.id ? '#8b7355' : 'transparent',
                  flexShrink: 0,
                }} />
                <div>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: 500, color: '#2d2518' }}>{opt[L]}</p>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#9a8870' }}>{opt.sub[L]}</p>
                </div>
              </button>
            ))}
          </div>

          {previewCal && (
            <div style={{ background: '#f0f8f0', borderRadius: '10px', padding: '12px 14px', marginTop: '14px', textAlign: 'center' }}>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#5a8a4a' }}>
                🎯 {L === 'en' ? 'Your gentle daily target:' : 'Ваша мягкая дневная цель:'}
                <strong style={{ fontSize: '16px', marginLeft: '6px' }}>{previewCal} kcal</strong>
              </p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#7aaa6a', marginTop: '3px' }}>
                {L === 'en' ? '(gentle 10% deficit — no restriction pressure)' : '(мягкий дефицит 10% — без давления ограничений)'}
              </p>
            </div>
          )}
        </div>

        <button
          onClick={saveProfile}
          disabled={!isValid}
          style={{
            padding: '15px', borderRadius: '14px',
            background: isValid ? '#8b7355' : '#d0c8be',
            color: '#fff', border: 'none',
            fontFamily: "'Lora', Georgia, serif", fontSize: '16px',
            cursor: isValid ? 'pointer' : 'not-allowed',
          }}>
          {L === 'en' ? 'Build My Meal Plan ✦' : 'Составить мой план питания ✦'}
        </button>
      </div>
    );
  }

  // ── Plan must exist at this point ──────────────────────────────────────────
  if (!plan) return null;

  const targetCal = calcTargetCalories(profile);
  const totalPlanCal = ['b', 'l', 'd', 's'].reduce((sum, t) => {
    const type = { b: 'breakfast', l: 'lunch', d: 'dinner', s: 'snack' }[t];
    return sum + (getMeal(type, plan[t])?.calories || 0);
  }, 0);

  const mealConfig = [
    {
      key: 'b', type: 'breakfast',
      label: L === 'en' ? 'Breakfast' : 'Завтрак',
      timeLabel: L === 'en' ? '🌅 Morning' : '🌅 Утро',
      colors: C.morning,
    },
    {
      key: 'l', type: 'lunch',
      label: L === 'en' ? 'Lunch' : 'Обед',
      timeLabel: L === 'en' ? '☀️ Midday' : '☀️ День',
      colors: C.midday,
    },
    {
      key: 'd', type: 'dinner',
      label: L === 'en' ? 'Dinner' : 'Ужин',
      timeLabel: L === 'en' ? '🌙 Evening' : '🌙 Вечер',
      colors: C.evening,
    },
    {
      key: 's', type: 'snack',
      label: L === 'en' ? 'Snack' : 'Перекус',
      timeLabel: L === 'en' ? '🍵 Optional Snack' : '🍵 Перекус (по желанию)',
      colors: C.snack,
    },
  ];

  // ── Render: Fix My Day view ────────────────────────────────────────────────

  if (view === 'fix') {
    const advice = fixSituation ? FIX_ADVICE[fixSituation]?.[L] : null;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0', padding: '8px 4px 24px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
          <div style={{ fontSize: '28px', marginBottom: '8px' }}>🔧</div>
          <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: '21px', fontWeight: 500, color: '#2d2518' }}>
            {L === 'en' ? 'Fix My Day' : 'Исправить день'}
          </p>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#9a8870', marginTop: '4px' }}>
            {L === 'en' ? 'No judgment — just gentle guidance to get back on track.' : 'Без осуждений — мягкое руководство для возврата на путь.'}
          </p>
        </div>

        {/* Situation selector */}
        {!fixSituation && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', fontWeight: 600, color: '#8b7355', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '2px' }}>
              {L === 'en' ? 'What happened?' : 'Что случилось?'}
            </p>
            {FIX_SITUATIONS.map(sit => (
              <button
                key={sit.id}
                onClick={() => setFixSituation(sit.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '14px 16px', borderRadius: '14px',
                  background: '#fff', border: '1.5px solid #ede8e2',
                  cursor: 'pointer', textAlign: 'left',
                  transition: 'border-color 0.15s',
                }}>
                <span style={{ fontSize: '22px' }}>{sit.emoji}</span>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '15px', fontWeight: 500, color: '#2d2518' }}>
                  {sit[L]}
                </p>
              </button>
            ))}
          </div>
        )}

        {/* Advice panel */}
        {advice && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '22px' }}>{FIX_SITUATIONS.find(s => s.id === fixSituation)?.emoji}</span>
              <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: '18px', fontWeight: 500, color: '#2d2518' }}>
                {advice.title}
              </p>
            </div>

            {[
              { icon: '🫖', titleEn: 'Right now', titleRu: 'Прямо сейчас', text: advice.now, bg: '#fff8f0', border: '#f0d080' },
              { icon: '🥗', titleEn: 'Your next meal', titleRu: 'Следующий приём', text: advice.nextMeal, bg: '#f0f8f0', border: '#a8d0a8' },
              { icon: '🚫', titleEn: 'Avoid today', titleRu: 'Избегайте сегодня', text: advice.avoid, bg: '#fdf5f5', border: '#e8b8b8' },
            ].map(({ icon, titleEn, titleRu, text, bg, border }) => (
              <div key={titleEn} style={{ background: bg, border: `1.5px solid ${border}`, borderRadius: '14px', padding: '14px 16px' }}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', fontWeight: 600, color: '#8b7355', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '6px' }}>
                  {icon} {L === 'en' ? titleEn : titleRu}
                </p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#3a2e20', lineHeight: 1.55 }}>
                  {text}
                </p>
              </div>
            ))}

            {/* Tomorrow */}
            <div style={{ background: '#f0f0f9', border: '1.5px solid #c0c0e0', borderRadius: '14px', padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', fontWeight: 600, color: '#5858a0', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                  🌙 {L === 'en' ? 'Tomorrow\'s approach' : 'Завтра'}
                </p>
                <div style={{ background: '#c0c0e0', borderRadius: '20px', padding: '2px 10px' }}>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', fontWeight: 600, color: '#404080' }}>{advice.tomorrowTag}</p>
                </div>
              </div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#3a2e20', lineHeight: 1.55 }}>
                {advice.tomorrow}
              </p>
            </div>

            <button
              onClick={() => setFixSituation(null)}
              style={{
                padding: '13px', borderRadius: '12px',
                background: '#fff', border: '1.5px solid #d0c8be',
                fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#8b7355',
                cursor: 'pointer',
              }}>
              ← {L === 'en' ? 'Choose different situation' : 'Выбрать другую ситуацию'}
            </button>
          </div>
        )}

        {/* Back + bottom nav */}
        <div style={{ marginTop: '20px' }}>
          <BottomNav view={view} setView={v => { setView(v); setFixSituation(null); }} lang={L} />
        </div>
      </div>
    );
  }

  // ── Render: Week view ──────────────────────────────────────────────────────

  if (view === 'week') {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dOW = d.getDay();
      const base = WEEK_ROTATION[dOW];
      const dateStr = d.toISOString().split('T')[0];
      const isToday = dateStr === todayKey();
      const savedPlan = localStorage.getItem(`dba_meal_plan_${dateStr}`);
      const dayPlan = isToday ? plan : (savedPlan ? JSON.parse(savedPlan) : base);
      return { date: d, dateStr, isToday, isPast: d < today && !isToday, plan: dayPlan };
    });

    const dayNames = {
      en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      ru: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0', padding: '8px 4px 24px' }}>
        <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
          <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: '21px', fontWeight: 500, color: '#2d2518' }}>
            {L === 'en' ? 'This Week' : 'Эта неделя'}
          </p>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#9a8870', marginTop: '3px' }}>
            {L === 'en' ? 'Consistent, simple, easy to follow' : 'Последовательно, просто, легко придерживаться'}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {days.map(({ date, dateStr, isToday, isPast, plan: dp }, i) => {
            const bf = getMeal('breakfast', dp.b);
            const lu = getMeal('lunch', dp.l);
            const di = getMeal('dinner', dp.d);
            return (
              <div key={dateStr} style={{
                background: isToday ? '#fdf5ec' : '#fff',
                border: `1.5px solid ${isToday ? '#c4a882' : '#ede8e2'}`,
                borderRadius: '14px', padding: '14px',
                opacity: isPast ? 0.65 : 1,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: '15px', fontWeight: 500, color: '#2d2518' }}>
                      {dayNames[L][i]}
                    </p>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#9a8870' }}>
                      {date.getDate()}/{date.getMonth() + 1}
                    </p>
                  </div>
                  {isToday && (
                    <div style={{ background: '#8b7355', borderRadius: '20px', padding: '3px 10px' }}>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', fontWeight: 600, color: '#fff', letterSpacing: '0.05em' }}>
                        {L === 'en' ? 'TODAY' : 'СЕГОДНЯ'}
                      </p>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[
                    { meal: bf, colors: C.morning },
                    { meal: lu, colors: C.midday },
                    { meal: di, colors: C.evening },
                  ].map(({ meal, colors }, j) => meal && (
                    <div key={j} style={{
                      flex: 1, background: colors.bg,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '8px', padding: '6px 8px',
                    }}>
                      <p style={{ fontSize: '14px', textAlign: 'center', marginBottom: '2px' }}>{meal.emoji}</p>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', color: '#5a4a38', lineHeight: 1.3, textAlign: 'center' }}>
                        {meal.name[L].split(' ').slice(0, 2).join(' ')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: '16px' }}>
          <BottomNav view={view} setView={setView} lang={L} />
        </div>
      </div>
    );
  }

  // ── Render: Today view (default) ───────────────────────────────────────────

  const loggedCount = Object.values(loggedMeals).filter(Boolean).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0', padding: '8px 4px 24px' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', padding: '8px 0 12px' }}>
        <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: '22px', fontWeight: 500, color: '#2d2518' }}>
          {L === 'en' ? 'Today\'s Plan' : 'План на сегодня'}
        </p>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#9a8870', marginTop: '3px' }}>
          {new Date().toLocaleDateString(L === 'en' ? 'en-GB' : 'ru-RU', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Adaptation note */}
      {adaptationNote && (
        <div style={{ background: '#f0f8f0', border: '1px solid #b8d8b8', borderRadius: '12px', padding: '10px 14px', marginBottom: '12px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '16px', flexShrink: 0 }}>🌿</span>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#3a6a3a', lineHeight: 1.4 }}>{adaptationNote}</p>
        </div>
      )}

      {/* Calorie target bar */}
      <div style={{ background: '#fff', borderRadius: '14px', padding: '12px 16px', marginBottom: '14px', border: '1px solid #ede8e2' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#8b7355', fontWeight: 500 }}>
            {L === 'en' ? `Daily target: ${targetCal} kcal` : `Дневная цель: ${targetCal} ккал`}
          </p>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#9a8870' }}>
            {totalPlanCal} {L === 'en' ? 'kcal planned' : 'ккал в плане'}
          </p>
        </div>
        <div style={{ height: '4px', background: '#ede8e2', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${Math.min(100, (totalPlanCal / targetCal) * 100)}%`, background: '#8b7355', borderRadius: '4px', transition: 'width 0.5s' }} />
        </div>
        {loggedCount > 0 && (
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#9a8870', marginTop: '6px' }}>
            {L === 'en' ? `${loggedCount} of 4 meals logged today` : `${loggedCount} из 4 приёмов отмечено`}
          </p>
        )}
      </div>

      {/* Meal cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {mealConfig.map(cfg => (
          <MealCard
            key={cfg.key}
            type={cfg.type}
            mealId={plan[cfg.key]}
            label={cfg.label}
            timeLabel={cfg.timeLabel}
            colors={cfg.colors}
            lang={L}
            isLogged={!!loggedMeals[cfg.key]}
            targetCal={targetCal}
            onExpand={() => setExpandedMeal({ type: cfg.type, mealId: plan[cfg.key], key: cfg.key })}
            onLog={() => logMeal(cfg.key)}
          />
        ))}
      </div>

      {/* Fix My Day banner */}
      <button
        onClick={() => setView('fix')}
        style={{
          marginTop: '16px',
          padding: '14px 16px',
          borderRadius: '14px',
          background: C.fix.bg,
          border: `1.5px solid ${C.fix.border}`,
          display: 'flex', alignItems: 'center', gap: '12px',
          cursor: 'pointer', textAlign: 'left',
          width: '100%',
        }}>
        <span style={{ fontSize: '22px' }}>🔧</span>
        <div>
          <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: '15px', fontWeight: 500, color: '#2d2518' }}>
            {L === 'en' ? 'Fix My Day' : 'Исправить день'}
          </p>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#9a8870', marginTop: '1px' }}>
            {L === 'en' ? 'Ate something off-plan? Feeling bloated? Tap here.' : 'Съели что-то не то? Вздутие? Нажмите сюда.'}
          </p>
        </div>
        <span style={{ marginLeft: 'auto', color: '#c4a882', fontSize: '18px' }}>›</span>
      </button>

      {/* Profile info */}
      <div style={{ marginTop: '6px', textAlign: 'center' }}>
        <button
          onClick={() => { localStorage.removeItem('dba_meal_profile'); setProfile(null); setPlan(null); setLoggedMeals({}); }}
          style={{ background: 'none', border: 'none', fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#c4a882', cursor: 'pointer', textDecoration: 'underline' }}>
          {L === 'en' ? `${profile.weight}kg · ${profile.height}cm · ${profile.age}y · ${profile.activityLevel} — update profile` : `${profile.weight}кг · ${profile.height}см · ${profile.age}л — обновить профиль`}
        </button>
      </div>

      {/* Bottom nav */}
      <div style={{ marginTop: '16px' }}>
        <BottomNav view={view} setView={setView} lang={L} />
      </div>

      {/* Meal Detail Overlay */}
      {expandedMeal && (
        <MealDetail
          type={expandedMeal.type}
          mealId={expandedMeal.mealId}
          lang={L}
          colors={mealConfig.find(c => c.type === expandedMeal.type)?.colors || C.morning}
          isLogged={!!loggedMeals[expandedMeal.key]}
          onClose={() => setExpandedMeal(null)}
          onSwap={newId => swapMeal(expandedMeal.type, newId)}
          onLog={() => logMeal(expandedMeal.key)}
        />
      )}

      {/* Symptom Log Overlay */}
      {loggingMeal && (
        <SymptomLog
          lang={L}
          onSave={syms => saveSymptoms(syms, loggingMeal)}
          onClose={() => setLoggingMeal(null)}
        />
      )}
    </div>
  );
}

// ─── Bottom Nav ───────────────────────────────────────────────────────────────

function BottomNav({ view, setView, lang: L }) {
  const tabs = [
    { id: 'today', emoji: '🥗', en: 'Today', ru: 'Сегодня' },
    { id: 'week',  emoji: '📅', en: 'Week',  ru: 'Неделя' },
    { id: 'fix',   emoji: '🔧', en: 'Fix Day', ru: 'Исправить' },
  ];
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setView(tab.id)}
          style={{
            flex: 1, padding: '10px 6px',
            borderRadius: '12px',
            border: `1.5px solid ${view === tab.id ? '#8b7355' : '#ede8e2'}`,
            background: view === tab.id ? '#f5f0e8' : '#fff',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
            cursor: 'pointer',
          }}>
          <span style={{ fontSize: '18px' }}>{tab.emoji}</span>
          <span style={{
            fontFamily: "'Inter', sans-serif", fontSize: '11px',
            color: view === tab.id ? '#8b7355' : '#9a8870',
            fontWeight: view === tab.id ? 600 : 400,
          }}>
            {tab[L]}
          </span>
        </button>
      ))}
    </div>
  );
}
