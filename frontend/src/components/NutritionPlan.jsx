/**
 * NutritionPlan.jsx
 * Combined Diet + Meals section for Women's Space.
 * Pre-configured for Ani: 65kg · 167cm · 44 years.
 *
 * Sub-tabs:
 *   📅 My Plan  — 5-phase weekly plan (translated from original Armenian plan)
 *   🍽️ Today    — Adaptive daily meals with working detail overlay
 *   📊 Progress — Weight projection calculator
 */

import { useState } from 'react';
import { createPortal } from 'react-dom';

// ─── Safe localStorage wrapper (works even on file:// URLs) ──────────────────
const SS = {
  get:    k => { try { return localStorage.getItem(k); }      catch { return null; } },
  set:    (k, v) => { try { localStorage.setItem(k, v); }     catch {} },
  remove: k => { try { localStorage.removeItem(k); }          catch {} },
};

// ─── User profile (pre-filled, editable) ─────────────────────────────────────
const DEFAULT_PROFILE = { weight: 65, height: 167, age: 44, activityLevel: 'light' };

// ─── Weekly Plan Data (5 phases, 7 days each) ────────────────────────────────
const DAYS      = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const DAYS_FULL_EN = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const DAYS_FULL_RU = ['Понедельник','Вторник','Среда','Четверг','Пятница','Суббота','Воскресенье'];

// Helper to make bilingual slot object
const b = (en, ru) => ({ en, ru });
const W = '500мл воды комнатной температуры медленно после пробуждения';

const WEEKLY_PLAN = {
  'Week 1': [
    { waterAM:b('500ml room-temp water slowly after waking',W), breakfast:b('1 boiled egg · ½ cucumber · fresh dill · black pepper · 1 crispbread','1 варёное яйцо · ½ огурца · свежий укроп · чёрный перец · 1 хлебец'), waterMid:b('500ml water — 1h before lunch','500мл воды — за 1 ч. до обеда'), lunch:b('Boiled chicken breast (100g) · shredded carrot & cabbage salad (150g) · lemon juice + ½ tsp olive oil','Варёная куриная грудка (100г) · тёртая морковь и капуста (150г) · лимонный сок + ½ ч.л. оливкового масла'), waterAfter:b('300ml water — 1h after lunch','300мл воды — через 1 ч. после обеда'), snack:b('1 tangerine · 3 almonds','1 мандарин · 3 миндалины'), waterEve:b('500ml water','500мл воды'), dinner:b('Steamed spinach (160g) · paprika · 2 tbsp yogurt','Шпинат на пару (160г) · паприка · 2 ст.л. йогурта') },
    { waterAM:b('500ml room-temp water slowly after waking',W), breakfast:b('1 medium apple (chopped) · 90g cottage cheese · 2 tsp pumpkin seeds','1 среднее яблоко (нарезать) · 90г творога · 2 ч.л. тыквенных семечек'), waterMid:b('300ml water — 2h after breakfast','300мл воды — через 2 ч. после завтрака'), lunch:b('60g pre-soaked bulgur · arugula · 100g lean beef · tomato & cucumber (200g) · olive oil · black pepper','60г замоченной булгуры · руккола · 100г постной говядины · помидор и огурец (200г) · оливковое масло · чёрный перец'), waterAfter:b('500ml water — 1h after lunch','500мл воды — через 1 ч. после обеда'), snack:b('1 cup green tea','1 чашка зелёного чая'), waterEve:b('500ml water','500мл воды'), dinner:b('Fresh salad: carrot & broccoli (120g) + lemon · grilled chicken breast (100g)','Свежий салат: морковь и брокколи (120г) + лимон · куриная грудка гриль (100г)') },
    { waterAM:b('500ml room-temp water slowly after waking',W), breakfast:b('Cooked oatmeal (90g) · ½ orange · 1 tsp chia seeds · 4 almonds (pre-soaked, grated)','Варёная овсяная каша (90г) · ½ апельсина · 1 ч.л. чиа · 4 миндалины (замоченные, тёртые)'), waterMid:b('400ml water — 2h before lunch','400мл воды — за 2 ч. до обеда'), lunch:b('70g cooked buckwheat · fresh salad: tomato, cucumber, arugula · a little olive oil','70г варёной гречки · свежий салат: помидор, огурец, руккола · немного оливкового масла'), waterAfter:b('400ml water — 1h after lunch','400мл воды — через 1 ч. после обеда'), snack:b('1 cup warm berry tea (sugar-free)','1 чашка тёплого ягодного чая (без сахара)'), waterEve:b('500ml water','500мл воды'), dinner:b('130g cooked lean beef · chopped dill + tomato + green pepper','130г варёной постной говядины · нарезанный укроп + помидор + зелёный перец') },
    { waterAM:b('500ml room-temp water slowly after waking',W), breakfast:b('Tomato omelet (1 egg) · 1 slice rye bread','Омлет с помидором (1 яйцо) · 1 ломтик ржаного хлеба'), waterMid:b('400ml water — 1h before lunch','400мл воды — за 1 ч. до обеда'), lunch:b('Steamed cauliflower (180g) with tomato, white onion & parsley','Цветная капуста на пару (180г) с помидором, белым луком и петрушкой'), waterAfter:b('400ml water — 1h after lunch','400мл воды — через 1 ч. после обеда'), snack:b('1 cup tea or coffee · 1 piece dark chocolate (80%)','1 чашка чая или кофе · 1 кусочек чёрного шоколада (80%)'), waterEve:b('500ml water','500мл воды'), dinner:b('Oven-baked chicken breast (100g) · oven-baked broccoli (90g) · black pepper','Куриная грудка в духовке (100г) · брокколи в духовке (90г) · чёрный перец') },
    { waterAM:b('500ml room-temp water slowly after waking',W), breakfast:b('Overnight chia pudding: 1 cup kefir/yogurt + 60g berries + 2 tsp chia + 1 tsp pumpkin seeds · serve cold','Чиа-пудинг на ночь: 1 стак. кефира/йогурта + 60г ягод + 2 ч.л. чиа + 1 ч.л. тыквенных семечек · подавать холодным'), waterMid:b('300ml water — 1h before lunch','300мл воды — за 1 ч. до обеда'), lunch:b('Oven-baked chicken breast (100g) · oven-baked broccoli (130g) · black pepper','Куриная грудка в духовке (100г) · брокколи в духовке (130г) · чёрный перец'), waterAfter:b('500ml water — 1h after lunch','500мл воды — через 1 ч. после обеда'), snack:b('1 tangerine (15:00–16:00)','1 мандарин (15:00–16:00)'), waterEve:b('500ml water','500мл воды'), dinner:b('2 medium tomatoes stuffed with cooked quinoa (60g) · chopped dill','2 средних помидора, фаршированных варёной киноа (60г) · нарезанный укроп') },
    { waterAM:b('500ml room-temp water slowly after waking',W), breakfast:b('1 crispbread · 2 cherry tomatoes + herbs · 1-egg omelet · black pepper','1 хлебец · 2 черри-помидора + зелень · омлет из 1 яйца · чёрный перец'), waterMid:b('500ml water — 2h after breakfast','500мл воды — через 2 ч. после завтрака'), lunch:b('"Green Salad": arugula + shredded zucchini + carrot + bulgur/buckwheat · olive oil','«Зелёный салат»: руккола + тёртый кабачок + морковь + булгур/гречка · оливковое масло'), waterAfter:b('500ml water — 1h after lunch','500мл воды — через 1 ч. после обеда'), snack:b('1 prune · 1 cup green tea','1 чернослив · 1 чашка зелёного чая'), waterEve:b('500ml water','500мл воды'), dinner:b('Oven-baked chicken breast (165g) · 1 oven-baked tomato · parsley','Куриная грудка в духовке (165г) · 1 запечённый помидор · петрушка') },
    { waterAM:b('500ml room-temp water slowly after waking',W), breakfast:b('Detox smoothie 🍹: ½ kiwi + spinach or parsley + ½ green apple + 2 tsp chia + 200ml water','Детокс-смузи 🍹: ½ киви + шпинат или петрушка + ½ зелёного яблока + 2 ч.л. чиа + 200мл воды'), waterMid:b('500ml water — 2h after breakfast','500мл воды — через 2 ч. после завтрака'), lunch:b('Fresh salad: broccoli + cherry tomatoes + shredded carrot + cucumber · grilled chicken (100g) · lemon','Свежий салат: брокколи + черри-помидоры + тёртая морковь + огурец · курица гриль (100г) · лимон'), waterAfter:b('500ml water — 1h after lunch','500мл воды — через 1 ч. после обеда'), snack:b('1 prune · 1 cup coffee or tea','1 чернослив · 1 чашка кофе или чая'), waterEve:b('500ml water (2h before dinner)','500мл воды (за 2 ч. до ужина)'), dinner:b('Red lentil purée (165g) · season to taste · dried basil','Пюре из красной чечевицы (165г) · специи по вкусу · сушёный базилик') },
  ],
  'Week 2': [
    { waterAM:b('500ml room-temp water slowly after waking',W), breakfast:b('1-egg omelet (olive oil) · ½ mashed avocado · diced tomato · 1 slice rye bread · herbs','Омлет из 1 яйца (оливковое масло) · ½ авокадо пюре · нарезанный помидор · 1 ломтик ржаного хлеба · зелень'), waterMid:b('400ml water + mint + 1 tsp chia, then 500ml 1h before lunch','400мл воды с мятой + 1 ч.л. чиа, затем 500мл за 1 ч. до обеда'), lunch:b('Fresh salad: carrot + green peas + tomato + broccoli (150g) · lemon/balsamic · 70g cooked buckwheat','Свежий салат: морковь + горошек + помидор + брокколи (150г) · лимон/бальзамик · 70г варёной гречки'), waterAfter:b('500ml water — 1h after lunch','500мл воды — через 1 ч. после обеда'), snack:b('1 small chopped apple','1 маленькое нарезанное яблоко'), waterEve:b('500ml water','500мл воды'), dinner:b('Oven-baked broccoli · grilled fish (140g) · lemon juice','Брокколи в духовке · рыба гриль (140г) · лимонный сок') },
    { waterAM:b('500ml room-temp water slowly after waking',W), breakfast:b('Oatmeal (90g) · ½ pear · 2 tsp chia + 1 tsp pumpkin seeds · 3–4 pre-soaked almonds · grated dark chocolate','Овсянка (90г) · ½ груши · 2 ч.л. чиа + 1 ч.л. тыквенных семечек · 3–4 замоченных миндалины · тёртый чёрный шоколад'), waterMid:b('400ml water — 2h after breakfast','400мл воды — через 2 ч. после завтрака'), lunch:b('Steamed spinach with 1 egg (175g) · ½ tomato · 1 tbsp yogurt · ground red pepper','Шпинат на пару с 1 яйцом (175г) · ½ помидора · 1 ст.л. йогурта · молотый красный перец'), waterAfter:b('500ml water — 1h after lunch','500мл воды — через 1 ч. после обеда'), snack:b('1 cup tea or coffee (no sugar) · 1 date or dark chocolate (80%)','1 чашка чая или кофе (без сахара) · 1 финик или чёрный шоколад (80%)'), waterEve:b('500ml water','500мл воды'), dinner:b('Grilled chicken breast (120g) · lemon · steamed broccoli (130g)','Куриная грудка гриль (120г) · лимон · брокколи на пару (130г)') },
    { waterAM:b('500ml room-temp water slowly after waking',W), breakfast:b('1 boiled egg · fresh herbs · black pepper · 1 crispbread','1 варёное яйцо · свежая зелень · чёрный перец · 1 хлебец'), waterMid:b('400ml water — 1h before lunch','400мл воды — за 1 ч. до обеда'), lunch:b('Grilled or oven-baked salmon (130g) · fresh salad: tomato, cucumber, parsley (130g) · 1 tsp olive oil','Лосось гриль или в духовке (130г) · свежий салат: помидор, огурец, петрушка (130г) · 1 ч.л. оливкового масла'), waterAfter:b('400ml water — 1h after lunch','400мл воды — через 1 ч. после обеда'), snack:b('1 cup chamomile or berry tea','1 чашка ромашкового или ягодного чая'), waterEve:b('500ml water','500мл воды'), dinner:b('Steamed or oven-baked cauliflower (200g) with tomato, parsley & yogurt sauce (2 tbsp yogurt + garlic + dill)','Цветная капуста на пару или в духовке (200г) с помидором, петрушкой и йогуртовым соусом (2 ст.л. йогурта + чеснок + укроп)') },
    { waterAM:b('500ml room-temp water slowly after waking',W), breakfast:b('Detox smoothie 🍹: ½ kiwi + spinach + ½ green apple + 1 tsp chia + 200ml water','Детокс-смузи 🍹: ½ киви + шпинат + ½ зелёного яблока + 1 ч.л. чиа + 200мл воды'), waterMid:b('500ml water — 1h before lunch','500мл воды — за 1 ч. до обеда'), lunch:b('Oven-baked chicken breast (100g) · oven-baked zucchini & sweet pepper (150g) · herbs','Куриная грудка в духовке (100г) · кабачок и сладкий перец в духовке (150г) · зелень'), waterAfter:b('400ml water — 1h after lunch','400мл воды — через 1 ч. после обеда'), snack:b('90g cottage cheese · 1 tsp honey · 3 walnuts','90г творога · 1 ч.л. мёда · 3 грецких ореха'), waterEve:b('500ml water','500мл воды'), dinner:b('60g cooked buckwheat or quinoa · steamed broccoli (100g) · 1 boiled egg · lemon','60г варёной гречки или киноа · брокколи на пару (100г) · 1 варёное яйцо · лимон') },
    { waterAM:b('500ml room-temp water slowly after waking',W), breakfast:b('Overnight chia pudding: kefir + 60g mixed berries + 2 tsp chia + 1 tsp pumpkin seeds · serve cold','Чиа-пудинг на ночь: кефир + 60г ягод + 2 ч.л. чиа + 1 ч.л. тыквенных семечек · подавать холодным'), waterMid:b('400ml water — 2h after breakfast','400мл воды — через 2 ч. после завтрака'), lunch:b('Lean beef stew (100g) with tomato, carrot & parsley · 70g cooked buckwheat','Тушёная постная говядина (100г) с помидором, морковью и петрушкой · 70г варёной гречки'), waterAfter:b('500ml water — 1h after lunch','500мл воды — через 1 ч. после обеда'), snack:b('1 tangerine or small apple','1 мандарин или небольшое яблоко'), waterEve:b('500ml water','500мл воды'), dinner:b('Grilled or baked white fish (130g) · steamed asparagus or green beans (120g) · lemon','Белая рыба гриль или запечённая (130г) · спаржа или стручковая фасоль на пару (120г) · лимон') },
    { waterAM:b('500ml room-temp water slowly after waking',W), breakfast:b('Oatmeal (90g) with 60g mixed berries · 1 tsp chia · 3 almonds · pinch of cinnamon','Овсянка (90г) с 60г ягод · 1 ч.л. чиа · 3 миндалины · щепотка корицы'), waterMid:b('500ml water — 2h after breakfast','500мл воды — через 2 ч. после завтрака'), lunch:b('"Power Bowl": 70g buckwheat + shredded chicken (100g) + cucumber + tomato + arugula · olive oil & lemon','«Силовая миска»: 70г гречки + тёртая курица (100г) + огурец + помидор + руккола · оливковое масло и лимон'), waterAfter:b('500ml water — 1h after lunch','500мл воды — через 1 ч. после обеда'), snack:b('1 prune · 1 cup green tea','1 чернослив · 1 чашка зелёного чая'), waterEve:b('500ml water','500мл воды'), dinner:b('Baked chicken breast (165g) · oven-baked cherry tomatoes + zucchini · fresh herbs','Куриная грудка в духовке (165г) · черри-помидоры + кабачок в духовке · свежая зелень') },
    { waterAM:b('500ml room-temp water slowly after waking',W), breakfast:b('1 egg omelet with spinach & tomato · 1 slice rye bread · fresh herbs','Омлет из 1 яйца со шпинатом и помидором · 1 ломтик ржаного хлеба · свежая зелень'), waterMid:b('500ml water — 2h after breakfast','500мл воды — через 2 ч. после завтрака'), lunch:b('Steamed salmon (130g) · quinoa (60g) · fresh cucumber & tomato salad · lemon','Лосось на пару (130г) · киноа (60г) · свежий салат из огурца и помидора · лимон'), waterAfter:b('500ml water — 1h after lunch','500мл воды — через 1 ч. после обеда'), snack:b('1 cup herbal tea · 1 piece dark chocolate (80%)','1 чашка травяного чая · 1 кусочек чёрного шоколада (80%)'), waterEve:b('500ml water','500мл воды'), dinner:b('Red lentil soup (180g) with fresh parsley · cumin & turmeric','Суп из красной чечевицы (180г) со свежей петрушкой · тмин и куркума') },
  ],
  'Week 3': [
    { waterAM:b('500ml room-temp water slowly after waking',W), breakfast:b('Overnight oats: 80g oats + 150ml kefir + 1 tsp chia + ½ banana + 3 almonds · prep night before','Овсянка на ночь: 80г хлопьев + 150мл кефира + 1 ч.л. чиа + ½ банана + 3 миндалины · готовить с вечера'), waterMid:b('400ml water — 2h after breakfast','400мл воды — через 2 ч. после завтрака'), lunch:b('Grilled chicken (100g) · arugula + cherry tomatoes + cucumber + carrot · olive oil & lemon','Курица гриль (100г) · руккола + черри-помидоры + огурец + морковь · оливковое масло и лимон'), waterAfter:b('400ml water — 1h after lunch','400мл воды — через 1 ч. после обеда'), snack:b('1 small apple · 3 walnuts','1 маленькое яблоко · 3 грецких ореха'), waterEve:b('500ml water','500мл воды'), dinner:b('Steamed broccoli & cauliflower (200g) · 1 boiled egg · black pepper & lemon','Брокколи и цветная капуста на пару (200г) · 1 варёное яйцо · чёрный перец и лимон') },
    { waterAM:b('500ml room-temp water slowly after waking',W), breakfast:b('Detox smoothie 🍹: ½ kiwi + spinach + ½ green apple + 1 tsp chia + 200ml water · 1 crispbread','Детокс-смузи 🍹: ½ киви + шпинат + ½ зелёного яблока + 1 ч.л. чиа + 200мл воды · 1 хлебец'), waterMid:b('400ml water — 1h before lunch','400мл воды — за 1 ч. до обеда'), lunch:b('70g cooked quinoa · steamed zucchini & sweet pepper (150g) · parsley · olive oil','70г варёной киноа · кабачок и сладкий перец на пару (150г) · петрушка · оливковое масло'), waterAfter:b('500ml water — 1h after lunch','500мл воды — через 1 ч. после обеда'), snack:b('90g low-fat yogurt · 1 tsp pumpkin seeds','90г нежирного йогурта · 1 ч.л. тыквенных семечек'), waterEve:b('500ml water','500мл воды'), dinner:b('Grilled white fish (140g) · oven-baked cherry tomatoes · lemon + fresh herbs','Белая рыба гриль (140г) · черри-помидоры в духовке · лимон + свежая зелень') },
    { waterAM:b('500ml room-temp water slowly after waking',W), breakfast:b('2 boiled eggs · sliced tomato & cucumber · dill & parsley · 1 crispbread','2 варёных яйца · нарезанный помидор и огурец · укроп и петрушка · 1 хлебец'), waterMid:b('500ml water — 1h before lunch','500мл воды — за 1 ч. до обеда'), lunch:b('Lean beef & vegetable soup (200ml): carrot, celery, parsley · 60g rye bread','Суп из постной говядины с овощами (200мл): морковь, сельдерей, петрушка · 60г ржаного хлеба'), waterAfter:b('400ml water — 1h after lunch','400мл воды — через 1 ч. после обеда'), snack:b('1 cup green tea · 1 prune','1 чашка зелёного чая · 1 чернослив'), waterEve:b('500ml water','500мл воды'), dinner:b('Baked chicken breast (100g) with mustard · steamed green beans (120g)','Куриная грудка в духовке (100г) с горчицей · стручковая фасоль на пару (120г)') },
    { waterAM:b('500ml room-temp water slowly after waking',W), breakfast:b('Chia pudding (prep night before): kefir + 60g berries + 2 tsp chia + 1 tsp pumpkin seeds','Чиа-пудинг (готовить с вечера): кефир + 60г ягод + 2 ч.л. чиа + 1 ч.л. тыквенных семечек'), waterMid:b('400ml water — 2h before lunch','400мл воды — за 2 ч. до обеда'), lunch:b('Baked salmon (130g) · 60g cooked buckwheat · cucumber & arugula salad · lemon','Запечённый лосось (130г) · 60г варёной гречки · салат из огурца и рукколы · лимон'), waterAfter:b('400ml water — 1h after lunch','400мл воды — через 1 ч. после обеда'), snack:b('1 tangerine · 3 almonds','1 мандарин · 3 миндалины'), waterEve:b('500ml water','500мл воды'), dinner:b('Stuffed bell pepper (1 medium) with lean ground turkey (80g) + brown rice (50g) · baked','Фаршированный перец (1 средний) с постным фаршем индейки (80г) + бурый рис (50г) · запечь') },
    { waterAM:b('500ml room-temp water slowly after waking',W), breakfast:b('Oatmeal (90g) · 1 tsp honey · 60g fresh berries · 4 almonds · pinch of cinnamon','Овсянка (90г) · 1 ч.л. мёда · 60г свежих ягод · 4 миндалины · щепотка корицы'), waterMid:b('300ml water — 1h before lunch','300мл воды — за 1 ч. до обеда'), lunch:b('Grilled chicken (100g) · roasted sweet potato (100g) · steamed broccoli · herbs','Курица гриль (100г) · запечённый батат (100г) · брокколи на пару · зелень'), waterAfter:b('500ml water — 1h after lunch','500мл воды — через 1 ч. после обеда'), snack:b('1 cup herbal tea (sugar-free)','1 чашка травяного чая (без сахара)'), waterEve:b('500ml water','500мл воды'), dinner:b('Spinach & tomato egg white omelet (2 egg whites) · 1 slice rye bread','Омлет из белков со шпинатом и помидором (2 белка) · 1 ломтик ржаного хлеба') },
    { waterAM:b('500ml room-temp water slowly after waking',W), breakfast:b('Avocado toast on rye: ½ mashed avocado + lemon + black pepper · 1 poached egg on top','Тост с авокадо на ржаном: ½ мятого авокадо + лимон + чёрный перец · 1 яйцо-пашот сверху'), waterMid:b('500ml water — 2h after breakfast','500мл воды — через 2 ч. после завтрака'), lunch:b('"Rainbow Bowl": 70g quinoa + grilled chicken (100g) + shredded beet (50g) + carrot + cucumber + parsley · lemon & olive oil','«Радужная миска»: 70г киноа + курица гриль (100г) + тёртая свёкла (50г) + морковь + огурец + петрушка · лимон и оливковое масло'), waterAfter:b('500ml water — 1h after lunch','500мл воды — через 1 ч. после обеда'), snack:b('1 prune · 1 cup green tea','1 чернослив · 1 чашка зелёного чая'), waterEve:b('500ml water','500мл воды'), dinner:b('Baked white fish (140g) · steamed asparagus or zucchini (120g) · lemon & dill','Белая рыба в духовке (140г) · спаржа или кабачок на пару (120г) · лимон и укроп') },
    { waterAM:b('500ml room-temp water slowly after waking',W), breakfast:b('Greek yogurt bowl: 120g Greek yogurt + 60g berries + 1 tsp chia + 3 crushed almonds + ½ tsp honey','Греческий йогурт: 120г йогурта + 60г ягод + 1 ч.л. чиа + 3 толчёных миндалины + ½ ч.л. мёда'), waterMid:b('500ml water — 2h after breakfast','500мл воды — через 2 ч. после завтрака'), lunch:b('Lentil & vegetable soup (200ml): tomato, carrot & cumin · 1 crispbread','Суп из чечевицы и овощей (200мл): помидор, морковь и тмин · 1 хлебец'), waterAfter:b('500ml water — 1h after lunch','500мл воды — через 1 ч. после обеда'), snack:b('1 cup chamomile tea · 1 piece dark chocolate (80%)','1 чашка ромашкового чая · 1 кусочек чёрного шоколада (80%)'), waterEve:b('500ml water','500мл воды'), dinner:b('Grilled chicken (165g) · oven-baked zucchini, bell pepper, onion · parsley','Курица гриль (165г) · кабачок, перец, лук в духовке · петрушка') },
  ],
  'Stabilization I': [
    { waterAM:b('500ml room-temp water slowly after waking',W), breakfast:b('2 boiled eggs · cucumber + tomato + herbs · 1 crispbread · coffee or green tea','2 варёных яйца · огурец + помидор + зелень · 1 хлебец · кофе или зелёный чай'), waterMid:b('400ml water — 2h after breakfast','400мл воды — через 2 ч. после завтрака'), lunch:b('Chicken breast (120g) · 80g cooked buckwheat or quinoa · large green salad · olive oil & lemon','Куриная грудка (120г) · 80г варёной гречки или киноа · большой зелёный салат · оливковое масло и лимон'), waterAfter:b('400ml water — 1h after lunch','400мл воды — через 1 ч. после обеда'), snack:b('1 small apple · 5 almonds','1 маленькое яблоко · 5 миндалин'), waterEve:b('500ml water','500мл воды'), dinner:b('Baked salmon (140g) · steamed broccoli (150g) · lemon & dill','Запечённый лосось (140г) · брокколи на пару (150г) · лимон и укроп') },
    { waterAM:b('500ml room-temp water slowly after waking',W), breakfast:b('Oatmeal (100g) · 80g mixed berries · 1 tsp chia · 4 almonds · pinch of cinnamon','Овсянка (100г) · 80г ягод · 1 ч.л. чиа · 4 миндалины · щепотка корицы'), waterMid:b('400ml water — 2h after breakfast','400мл воды — через 2 ч. после завтрака'), lunch:b('Lean beef (110g) · 70g cooked buckwheat · fresh salad: tomato, cucumber, parsley','Постная говядина (110г) · 70г варёной гречки · свежий салат: помидор, огурец, петрушка'), waterAfter:b('500ml water — 1h after lunch','500мл воды — через 1 ч. после обеда'), snack:b('1 cup green tea · 1 date','1 чашка зелёного чая · 1 финик'), waterEve:b('500ml water','500мл воды'), dinner:b('Steamed chicken fillet (120g) · oven-baked zucchini & cherry tomatoes · herbs','Паровое куриное филе (120г) · кабачок и черри-помидоры в духовке · зелень') },
    { waterAM:b('500ml room-temp water slowly after waking',W), breakfast:b('Chia pudding with berries (prep night before) or Greek yogurt (120g) + 1 tsp honey + 3 walnuts','Чиа-пудинг с ягодами (готовить с вечера) или греческий йогурт (120г) + 1 ч.л. мёда + 3 грецких ореха'), waterMid:b('400ml water — 2h before lunch','400мл воды — за 2 ч. до обеда'), lunch:b('Baked white fish (140g) · 70g cooked brown rice · cucumber & arugula salad · lemon','Белая рыба в духовке (140г) · 70г варёного бурого риса · салат из огурца и рукколы · лимон'), waterAfter:b('400ml water — 1h after lunch','400мл воды — через 1 ч. после обеда'), snack:b('1 tangerine · 3 almonds','1 мандарин · 3 миндалины'), waterEve:b('500ml water','500мл воды'), dinner:b('Turkey meatballs (120g) baked in oven · steamed cauliflower (150g) · parsley','Фрикадельки из индейки (120г) в духовке · цветная капуста на пару (150г) · петрушка') },
    { waterAM:b('500ml room-temp water slowly after waking',W), breakfast:b('Detox smoothie 🍹: spinach + ½ green apple + ½ kiwi + 1 tsp chia + 200ml water · 1 crispbread','Детокс-смузи 🍹: шпинат + ½ зелёного яблока + ½ киви + 1 ч.л. чиа + 200мл воды · 1 хлебец'), waterMid:b('500ml water — 1h before lunch','500мл воды — за 1 ч. до обеда'), lunch:b('Chicken breast & vegetable stir-fry: broccoli, carrot, green beans (150g) + 80g buckwheat','Куриная грудка с овощами: брокколи, морковь, стручковая фасоль (150г) + 80г гречки'), waterAfter:b('400ml water — 1h after lunch','400мл воды — через 1 ч. после обеда'), snack:b('90g cottage cheese · 1 tsp pumpkin seeds','90г творога · 1 ч.л. тыквенных семечек'), waterEve:b('500ml water','500мл воды'), dinner:b('Grilled salmon (140g) · steamed asparagus (120g) · lemon & black pepper','Лосось гриль (140г) · спаржа на пару (120г) · лимон и чёрный перец') },
    { waterAM:b('500ml room-temp water slowly after waking',W), breakfast:b('2-egg omelet with spinach & tomato (olive oil) · 1 slice rye bread','Омлет из 2 яиц со шпинатом и помидором (оливковое масло) · 1 ломтик ржаного хлеба'), waterMid:b('400ml water — 2h after breakfast','400мл воды — через 2 ч. после завтрака'), lunch:b('"Power Plate": 100g grilled chicken + 70g quinoa + salad (arugula, cucumber, cherry tomatoes) + olive oil','«Силовая тарелка»: 100г куриного гриля + 70г киноа + салат (руккола, огурец, черри-помидоры) + оливковое масло'), waterAfter:b('500ml water — 1h after lunch','500мл воды — через 1 ч. после обеда'), snack:b('1 cup herbal tea · 1 prune','1 чашка травяного чая · 1 чернослив'), waterEve:b('500ml water','500мл воды'), dinner:b('Baked white fish (130g) · steamed green beans (130g) · lemon & dill','Белая рыба в духовке (130г) · стручковая фасоль на пару (130г) · лимон и укроп') },
    { waterAM:b('500ml room-temp water slowly after waking',W), breakfast:b('Overnight oats: 80g oats + 150ml kefir + ½ banana + 1 tsp chia + 3 almonds','Овсянка на ночь: 80г хлопьев + 150мл кефира + ½ банана + 1 ч.л. чиа + 3 миндалины'), waterMid:b('500ml water — 2h after breakfast','500мл воды — через 2 ч. после завтрака'), lunch:b('Lean beef goulash (120g, no oil): carrot & celery · 70g buckwheat on the side','Гуляш из постной говядины (120г, без масла): морковь и сельдерей · 70г гречки на гарнир'), waterAfter:b('500ml water — 1h after lunch','500мл воды — через 1 ч. после обеда'), snack:b('1 apple · 3 walnuts','1 яблоко · 3 грецких ореха'), waterEve:b('500ml water','500мл воды'), dinner:b('Stuffed zucchini (2 halves) with lean ground turkey (80g) + tomato + herbs · baked','Фаршированный кабачок (2 половины) с постным фаршем индейки (80г) + помидор + зелень · запечь') },
    { waterAM:b('500ml room-temp water slowly after waking',W), breakfast:b('Greek yogurt (150g) · mixed berries (80g) · 1 tsp honey · 1 tsp chia · 4 almonds','Греческий йогурт (150г) · ягоды (80г) · 1 ч.л. мёда · 1 ч.л. чиа · 4 миндалины'), waterMid:b('500ml water — 2h after breakfast','500мл воды — через 2 ч. после завтрака'), lunch:b('Baked salmon (150g) · 70g cooked quinoa · steamed broccoli & carrot · lemon','Запечённый лосось (150г) · 70г варёной киноа · брокколи и морковь на пару · лимон'), waterAfter:b('500ml water — 1h after lunch','500мл воды — через 1 ч. после обеда'), snack:b('1 cup green tea · 1 piece dark chocolate (80%)','1 чашка зелёного чая · 1 кусочек чёрного шоколада (80%)'), waterEve:b('500ml water','500мл воды'), dinner:b('Red lentil soup (200g): tomato, carrot & cumin · fresh coriander · 1 crispbread','Суп из красной чечевицы (200г): помидор, морковь и тмин · свежий кориандр · 1 хлебец') },
  ],
  'Stabilization II': [
    { waterAM:b('500ml room-temp water slowly after waking',W), breakfast:b('2 eggs (scrambled or poached) · avocado toast on rye · black pepper & lemon','2 яйца (яичница или пашот) · тост с авокадо на ржаном · чёрный перец и лимон'), waterMid:b('400ml water — 2h after breakfast','400мл воды — через 2 ч. после завтрака'), lunch:b('Chicken or turkey (120g) · 80g brown rice or buckwheat · large salad (mixed greens, tomato, cucumber) · olive oil','Курица или индейка (120г) · 80г бурого риса или гречки · большой салат (зелень, помидор, огурец) · оливковое масло'), waterAfter:b('400ml water — 1h after lunch','400мл воды — через 1 ч. после обеда'), snack:b('1 tangerine or small apple · 5 almonds','1 мандарин или небольшое яблоко · 5 миндалин'), waterEve:b('500ml water','500мл воды'), dinner:b('Baked sea bass or salmon (150g) · steamed broccoli (150g) · lemon & herbs','Запечённый сибас или лосось (150г) · брокколи на пару (150г) · лимон и зелень') },
    { waterAM:b('500ml room-temp water slowly after waking',W), breakfast:b('Smoothie bowl 🥣: ½ frozen banana + 60g berries + 100ml kefir · top with 1 tsp chia + 3 almonds','Смузи-боул 🥣: ½ замороженного банана + 60г ягод + 100мл кефира · сверху 1 ч.л. чиа + 3 миндалины'), waterMid:b('400ml water — 2h after breakfast','400мл воды — через 2 ч. после завтрака'), lunch:b('Lean beef steak (120g) · 70g roasted sweet potato · arugula & cherry tomato salad','Стейк из постной говядины (120г) · 70г запечённого батата · салат из рукколы и черри-помидоров'), waterAfter:b('500ml water — 1h after lunch','500мл воды — через 1 ч. после обеда'), snack:b('90g Greek yogurt · 1 tsp honey','90г греческого йогурта · 1 ч.л. мёда'), waterEve:b('500ml water','500мл воды'), dinner:b('Steamed chicken fillet (120g) · oven-roasted zucchini, pepper, cherry tomatoes · parsley','Паровое куриное филе (120г) · кабачок, перец, черри в духовке · петрушка') },
    { waterAM:b('500ml room-temp water slowly after waking',W), breakfast:b('Oatmeal (100g) + 80g mixed berries · 1 tsp chia · ½ tsp cinnamon · 4 almonds','Овсянка (100г) + 80г ягод · 1 ч.л. чиа · ½ ч.л. корицы · 4 миндалины'), waterMid:b('400ml water — 1h before lunch','400мл воды — за 1 ч. до обеда'), lunch:b('Baked salmon (150g) · 70g quinoa · cucumber, dill & arugula salad · olive oil & lemon','Запечённый лосось (150г) · 70г киноа · салат из огурца, укропа и рукколы · оливковое масло и лимон'), waterAfter:b('400ml water — 1h after lunch','400мл воды — через 1 ч. после обеда'), snack:b('1 cup green tea · 1 prune or date','1 чашка зелёного чая · 1 чернослив или финик'), waterEve:b('500ml water','500мл воды'), dinner:b('Lentil & spinach stew (180g): turmeric & cumin · 1 crispbread','Рагу из чечевицы и шпината (180г): куркума и тмин · 1 хлебец') },
    { waterAM:b('500ml room-temp water slowly after waking',W), breakfast:b('Detox smoothie 🍹 or cottage cheese (100g) + berries','Детокс-смузи 🍹 или творог (100г) + ягоды'), waterMid:b('500ml water — 1h before lunch','500мл воды — за 1 ч. до обеда'), lunch:b('Grilled chicken (120g) · baked cauliflower & broccoli (150g) · garlic yogurt sauce (2 tbsp yogurt + dill)','Курица гриль (120г) · запечённые цветная капуста и брокколи (150г) · чесночный йогуртовый соус (2 ст.л. йогурта + укроп)'), waterAfter:b('400ml water — 1h after lunch','400мл воды — через 1 ч. после обеда'), snack:b('1 small apple · 3 walnuts','1 маленькое яблоко · 3 грецких ореха'), waterEve:b('500ml water','500мл воды'), dinner:b('Baked white fish (140g) · steamed green beans & asparagus (120g) · lemon','Белая рыба в духовке (140г) · стручковая фасоль и спаржа на пару (120г) · лимон') },
    { waterAM:b('500ml room-temp water slowly after waking',W), breakfast:b('Chia pudding or 2 boiled eggs + 1 crispbread','Чиа-пудинг или 2 варёных яйца + 1 хлебец'), waterMid:b('400ml water — 2h after breakfast','400мл воды — через 2 ч. после завтрака'), lunch:b('"Full Plate": 80g buckwheat + 120g chicken + large mixed salad · olive oil & lemon · parsley','«Полная тарелка»: 80г гречки + 120г курицы + большой салат · оливковое масло и лимон · петрушка'), waterAfter:b('500ml water — 1h after lunch','500мл воды — через 1 ч. после обеда'), snack:b('1 cup chamomile or berry tea (sugar-free)','1 чашка ромашкового или ягодного чая (без сахара)'), waterEve:b('500ml water','500мл воды'), dinner:b('Turkey patty (100g) baked · steamed broccoli & carrot (150g) · black pepper','Котлета из индейки (100г) в духовке · брокколи и морковь на пару (150г) · чёрный перец') },
    { waterAM:b('500ml room-temp water slowly after waking',W), breakfast:b('Avocado & egg bowl: ½ avocado + 2 poached eggs + lemon + dill + 1 slice rye bread','Яично-авокадная миска: ½ авокадо + 2 яйца-пашот + лимон + укроп + 1 ломтик ржаного хлеба'), waterMid:b('500ml water — 2h after breakfast','500мл воды — через 2 ч. после завтрака'), lunch:b('Salmon & vegetable bake (150g fish + zucchini + cherry tomatoes + onion) · 70g quinoa','Запечённые лосось с овощами (150г рыбы + кабачок + черри-помидоры + лук) · 70г киноа'), waterAfter:b('500ml water — 1h after lunch','500мл воды — через 1 ч. после обеда'), snack:b('1 prune · 1 piece dark chocolate (80%)','1 чернослив · 1 кусочек чёрного шоколада (80%)'), waterEve:b('500ml water','500мл воды'), dinner:b('Creamy pumpkin soup (200g) blended with ginger & olive oil · 1 crispbread','Сливочный суп-пюре из тыквы (200г) с имбирём и оливковым маслом · 1 хлебец') },
    { waterAM:b('500ml room-temp water slowly after waking',W), breakfast:b('Greek yogurt (150g) · 80g berries · 1 tsp chia · 4 almonds · ½ tsp honey','Греческий йогурт (150г) · 80г ягод · 1 ч.л. чиа · 4 миндалины · ½ ч.л. мёда'), waterMid:b('500ml water — 2h after breakfast','500мл воды — через 2 ч. после завтрака'), lunch:b('Slow-cooked lean beef (120g): carrot, celery & tomato · 70g buckwheat · fresh herbs','Тушёная постная говядина (120г): морковь, сельдерей и помидор · 70г гречки · свежая зелень'), waterAfter:b('500ml water — 1h after lunch','500мл воды — через 1 ч. после обеда'), snack:b('1 tangerine · 1 cup green tea','1 мандарин · 1 чашка зелёного чая'), waterEve:b('500ml water','500мл воды'), dinner:b('Baked chicken breast (165g) · oven-roasted sweet pepper & zucchini · lemon & basil','Куриная грудка в духовке (165г) · запечённый сладкий перец и кабачок · лимон и базилик') },
  ],
};

const PHASES = Object.keys(WEEKLY_PLAN);

const PLAN_SLOTS = [
  { key:'waterAM',    icon:'💧', label:'Wake-Up Water',    labelRu:'Вода после сна',    water:true,  bg:'#eaf5fb', border:'#aad4ee' },
  { key:'breakfast',  icon:'🌅', label:'Breakfast',         labelRu:'Завтрак',           water:false, bg:'#fef9ee', border:'#f0d080' },
  { key:'waterMid',   icon:'💧', label:'Mid-Morning Water', labelRu:'Вода до обеда',     water:true,  bg:'#eaf5fb', border:'#aad4ee' },
  { key:'lunch',      icon:'🥗', label:'Lunch',             labelRu:'Обед',              water:false, bg:'#f0f7ee', border:'#90c880' },
  { key:'waterAfter', icon:'💧', label:'Post-Lunch Water',  labelRu:'Вода после обеда',  water:true,  bg:'#eaf5fb', border:'#aad4ee' },
  { key:'snack',      icon:'🍎', label:'Snack',             labelRu:'Перекус',           water:false, bg:'#fdf0f8', border:'#e0a0d0' },
  { key:'waterEve',   icon:'💧', label:'Evening Water',     labelRu:'Вечерняя вода',     water:true,  bg:'#eaf5fb', border:'#aad4ee' },
  { key:'dinner',     icon:'🌙', label:'Dinner',            labelRu:'Ужин',              water:false, bg:'#f4f0fa', border:'#b090d0' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function todayKey() { return new Date().toISOString().split('T')[0]; }

function calcTDEE({ weight=65, height=167, age=44, activityLevel='light' }) {
  const bmr = 10*weight + 6.25*height - 5*age - 161;
  const mult = { sedentary:1.2, light:1.375, moderate:1.55, active:1.725 };
  return Math.round(bmr * (mult[activityLevel] || 1.375));
}

const PHASE_KCAL = { 'Week 1':1380, 'Week 2':1430, 'Week 3':1470, 'Stabilization I':1560, 'Stabilization II':1650 };

function getTodayDayIdx() {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1;
}

// ─── Food Knowledge Database ──────────────────────────────────────────────────
// score: 5=excellent 4=good 3=okay 2=watch 1=limit 0=avoid

const FOOD_DB = [
  // PROTEINS
  { keys:['chicken','грудка','курица'], score:5, name:{en:'Chicken',ru:'Курица'}, label:{en:'lean protein',ru:'нежирный белок'}, msg:{en:'Excellent lean protein — keeps you full and supports muscle without extra fat.',ru:'Отличный нежирный белок — насыщает и поддерживает мышцы без лишнего жира.'} },
  { keys:['turkey','индейка'], score:5, name:{en:'Turkey',ru:'Индейка'}, label:{en:'lean protein',ru:'нежирный белок'}, msg:{en:'Tryptophan converts to serotonin — great for mood and sleep.',ru:'Триптофан → серотонин. Отлично для настроения и сна.'} },
  { keys:['salmon','лосось'], score:5, name:{en:'Salmon',ru:'Лосось'}, label:{en:'omega-3 protein',ru:'омега-3 белок'}, msg:{en:'Omega-3 rich — reduces inflammation, supports skin, hormones and brain.',ru:'Омега-3 снижают воспаление, улучшают кожу, гормоны и мозг.'} },
  { keys:['fish','cod','tuna','hake','trout','рыба','треска','тунец','форель','хек'], score:5, name:{en:'Fish',ru:'Рыба'}, label:{en:'lean protein',ru:'нежирный белок'}, msg:{en:'Easiest protein to digest. Ideal for evenings.',ru:'Самый лёгкий белок для пищеварения. Идеален вечером.'} },
  { keys:['egg','eggs','яйцо','яйца'], score:5, name:{en:'Eggs',ru:'Яйца'}, label:{en:'complete protein',ru:'полноценный белок'}, msg:{en:'Complete protein with all essential amino acids. Easy to digest and versatile.',ru:'Полноценный белок со всеми аминокислотами. Легко усваивается.'} },
  { keys:['cottage cheese','творог'], score:5, name:{en:'Cottage cheese',ru:'Творог'}, label:{en:'protein',ru:'белок'}, msg:{en:'High protein, probiotic calcium source. Great for bones and gut.',ru:'Много белка, пробиотики и кальций. Хорошо для костей и кишечника.'} },
  { keys:['kefir','кефир'], score:5, name:{en:'Kefir',ru:'Кефир'}, label:{en:'probiotic',ru:'пробиотик'}, msg:{en:'One of the best probiotic sources — heals gut lining and supports immunity.',ru:'Один из лучших пробиотиков — восстанавливает слизистую и укрепляет иммунитет.'} },
  { keys:['greek yogurt','йогурт','yogurt'], score:4, name:{en:'Yogurt',ru:'Йогурт'}, label:{en:'probiotic',ru:'пробиотик'}, msg:{en:'Good probiotics. Choose plain, unsweetened — flavoured versions are mostly sugar.',ru:'Хорошие пробиотики. Выбирайте натуральный без сахара — в ароматизированных много сахара.'} },
  { keys:['beef','говядина'], score:3, name:{en:'Beef',ru:'Говядина'}, label:{en:'protein',ru:'белок'}, msg:{en:'Good iron source. Choose lean cuts and limit to 2–3× per week.',ru:'Хороший источник железа. Постные куски, не чаще 2–3 раз в неделю.'} },
  { keys:['pork','свинина'], score:2, name:{en:'Pork',ru:'Свинина'}, label:{en:'protein',ru:'белок'}, msg:{en:'Higher in saturated fat. Lean pork occasionally is okay, but not daily.',ru:'Больше насыщенного жира. Постная свинина иногда допустима, но не каждый день.'} },
  { keys:['sausage','колбаса','hot dog','сосиска','salami','салями','бекон','bacon'], score:0, name:{en:'Processed meat',ru:'Переработанное мясо'}, label:{en:'avoid',ru:'избегать'}, msg:{en:'WHO classifies processed meats as carcinogenic. High in sodium, preservatives and bad fats.',ru:'ВОЗ классифицирует переработанное мясо как канцерогенное. Много соли, консервантов и вредных жиров.'} },
  // VEGETABLES
  { keys:['broccoli','брокколи'], score:5, name:{en:'Broccoli',ru:'Брокколи'}, label:{en:'vegetable',ru:'овощи'}, msg:{en:'Anti-inflammatory powerhouse. Steamed broccoli contains sulforaphane — a gut healer.',ru:'Мощное противовоспалительное. На пару содержит сульфорафан — исцеляет кишечник.'} },
  { keys:['spinach','шпинат'], score:5, name:{en:'Spinach',ru:'Шпинат'}, label:{en:'vegetable',ru:'овощи'}, msg:{en:'Iron and magnesium for energy and muscle relaxation. Great for evening meals.',ru:'Железо и магний для энергии и расслабления мышц. Отлично вечером.'} },
  { keys:['cucumber','огурец'], score:5, name:{en:'Cucumber',ru:'Огурец'}, label:{en:'vegetable',ru:'овощи'}, msg:{en:'96% water — excellent for hydration and reducing bloating.',ru:'96% воды — отлично для гидратации и уменьшения отёков.'} },
  { keys:['tomato','помидор','черри'], score:5, name:{en:'Tomato',ru:'Помидор'}, label:{en:'vegetable',ru:'овощи'}, msg:{en:'Rich in lycopene (especially cooked) — anti-inflammatory and heart-protective.',ru:'Богат ликопином (особенно варёный) — противовоспалительный, защищает сердце.'} },
  { keys:['carrot','морковь'], score:5, name:{en:'Carrot',ru:'Морковь'}, label:{en:'vegetable',ru:'овощи'}, msg:{en:'Beta-carotene for skin and immunity. Cooked carrots are easier to digest.',ru:'Бета-каротин для кожи и иммунитета. Варёная легче усваивается.'} },
  { keys:['zucchini','кабачок'], score:5, name:{en:'Zucchini',ru:'Кабачок'}, label:{en:'vegetable',ru:'овощи'}, msg:{en:'Low-calorie, anti-inflammatory, very gentle on digestion.',ru:'Мало калорий, противовоспалительный, очень мягкий для пищеварения.'} },
  { keys:['bell pepper','перец болгарский','sweet pepper'], score:5, name:{en:'Bell pepper',ru:'Болгарский перец'}, label:{en:'vegetable',ru:'овощи'}, msg:{en:'More vitamin C than oranges — boosts collagen and immunity.',ru:'Больше витамина C, чем в апельсине — стимулирует коллаген и иммунитет.'} },
  { keys:['cauliflower','цветная капуста'], score:5, name:{en:'Cauliflower',ru:'Цветная капуста'}, label:{en:'vegetable',ru:'овощи'}, msg:{en:'Rich in choline for brain health. Steam for best digestion.',ru:'Много холина для мозга. Лучше на пару для пищеварения.'} },
  { keys:['cabbage','капуста'], score:4, name:{en:'Cabbage',ru:'Капуста'}, label:{en:'vegetable',ru:'овощи'}, msg:{en:'Fermented (sauerkraut) is a natural probiotic. Raw cabbage can bloat — cook it.',ru:'Квашеная — натуральный пробиотик. Сырая может вздувать — лучше тушить.'} },
  { keys:['arugula','руккола'], score:5, name:{en:'Arugula',ru:'Руккола'}, label:{en:'vegetable',ru:'овощи'}, msg:{en:'Nitrates improve blood flow and energy levels.',ru:'Нитраты улучшают кровоток и уровень энергии.'} },
  { keys:['asparagus','спаржа'], score:5, name:{en:'Asparagus',ru:'Спаржа'}, label:{en:'vegetable',ru:'овощи'}, msg:{en:'Natural diuretic — reduces water retention. Rich in folate.',ru:'Природный диуретик — убирает отёки. Богата фолиевой кислотой.'} },
  { keys:['beet','свёкла'], score:4, name:{en:'Beet',ru:'Свёкла'}, label:{en:'vegetable',ru:'овощи'}, msg:{en:'Natural nitrates boost blood flow and stamina.',ru:'Природные нитраты улучшают кровоток и выносливость.'} },
  { keys:['sweet potato','батат'], score:4, name:{en:'Sweet potato',ru:'Батат'}, label:{en:'complex carb',ru:'сложный углевод'}, msg:{en:'Feeds beneficial gut bacteria and rich in beta-carotene.',ru:'Питает полезные бактерии кишечника и богат бета-каротином.'} },
  { keys:['lentil','lentils','чечевица'], score:5, name:{en:'Lentils',ru:'Чечевица'}, label:{en:'legume protein',ru:'бобовый белок'}, msg:{en:'Plant protein with iron and fiber — stabilises blood sugar all afternoon.',ru:'Растительный белок с железом и клетчаткой — стабилизирует сахар надолго.'} },
  { keys:['chickpea','нут'], score:4, name:{en:'Chickpeas',ru:'Нут'}, label:{en:'legume',ru:'бобовые'}, msg:{en:'Great plant protein. Soak and cook well to avoid gas.',ru:'Отличный растительный белок. Хорошо замачивайте во избежание газообразования.'} },
  { keys:['green beans','стручковая фасоль'], score:5, name:{en:'Green beans',ru:'Стручковая фасоль'}, label:{en:'vegetable',ru:'овощи'}, msg:{en:'Gentle fiber — great for bowel regularity.',ru:'Мягкая клетчатка — отлично для регулярного стула.'} },
  // GRAINS
  { keys:['buckwheat','гречка'], score:5, name:{en:'Buckwheat',ru:'Гречка'}, label:{en:'complex carb',ru:'сложный углевод'}, msg:{en:'Complete protein + magnesium. Gently stimulates bowel movement.',ru:'Полноценный белок + магний. Мягко стимулирует кишечник.'} },
  { keys:['quinoa','киноа'], score:5, name:{en:'Quinoa',ru:'Киноа'}, label:{en:'complete protein carb',ru:'полноценный белок + углевод'}, msg:{en:'Contains all 9 essential amino acids — rare for a grain.',ru:'Все 9 незаменимых аминокислот — редкость для злака.'} },
  { keys:['oat','oats','oatmeal','овсянка','овёс'], score:5, name:{en:'Oats',ru:'Овсянка'}, label:{en:'complex carb',ru:'сложный углевод'}, msg:{en:'Beta-glucan feeds good gut bacteria and lowers cholesterol.',ru:'Бета-глюкан питает полезные бактерии и снижает холестерин.'} },
  { keys:['bulgur','булгур'], score:4, name:{en:'Bulgur',ru:'Булгур'}, label:{en:'complex carb',ru:'сложный углевод'}, msg:{en:'Whole grain, high in fiber. Good rice alternative.',ru:'Цельное зерно с высоким содержанием клетчатки. Хорошая альтернатива рису.'} },
  { keys:['brown rice','бурый рис'], score:4, name:{en:'Brown rice',ru:'Бурый рис'}, label:{en:'complex carb',ru:'сложный углевод'}, msg:{en:'More fiber and magnesium than white rice, slower glucose release.',ru:'Больше клетчатки и магния, чем в белом рисе, медленнее поднимает сахар.'} },
  { keys:['white rice','белый рис','рис'], score:3, name:{en:'White rice',ru:'Белый рис'}, label:{en:'refined carb',ru:'рафинированный углевод'}, msg:{en:'Okay occasionally. Prefer buckwheat, quinoa, or brown rice for more nutrients.',ru:'Иногда можно. Предпочтите гречку, киноа или бурый рис — больше пользы.'} },
  { keys:['rye bread','ржаной хлеб'], score:4, name:{en:'Rye bread',ru:'Ржаной хлеб'}, label:{en:'complex carb',ru:'сложный углевод'}, msg:{en:'Slower glucose release than white bread. Good fiber source.',ru:'Медленнее поднимает сахар, чем белый хлеб. Хороший источник клетчатки.'} },
  { keys:['crispbread','хлебец','хлебцы'], score:4, name:{en:'Crispbread',ru:'Хлебцы'}, label:{en:'complex carb',ru:'сложный углевод'}, msg:{en:'Light and fiber-rich — a great swap for regular bread.',ru:'Лёгкие и богатые клетчаткой — отличная замена хлебу.'} },
  { keys:['white bread','белый хлеб','хлеб'], score:2, name:{en:'White bread',ru:'Белый хлеб'}, label:{en:'refined carb',ru:'рафинированный углевод'}, msg:{en:'Spikes blood sugar quickly. Swap for rye or sourdough.',ru:'Быстро поднимает сахар. Замените ржаным или хлебом на закваске.'} },
  { keys:['pasta','макароны'], score:2, name:{en:'Pasta',ru:'Макароны'}, label:{en:'refined carb',ru:'рафинированный углевод'}, msg:{en:'Little nutrition per calorie. Choose wholegrain or reduce portions.',ru:'Мало пользы на калорию. Выбирайте цельнозерновые или уменьшайте порцию.'} },
  // FRUITS
  { keys:['apple','яблоко'], score:4, name:{en:'Apple',ru:'Яблоко'}, label:{en:'fruit',ru:'фрукт'}, msg:{en:'Pectin feeds good gut bacteria. Eat with skin for maximum fiber.',ru:'Пектин питает полезные бактерии. Ешьте с кожурой для максимума клетчатки.'} },
  { keys:['pear','груша'], score:4, name:{en:'Pear',ru:'Груша'}, label:{en:'fruit',ru:'фрукт'}, msg:{en:'Sorbitol is a gentle natural laxative — good for bowel regularity.',ru:'Сорбитол — мягкое природное слабительное, хорошо для регулярности стула.'} },
  { keys:['berries','berry','blueberry','strawberry','raspberry','ягоды','черника','клубника','малина','смородина'], score:5, name:{en:'Berries',ru:'Ягоды'}, label:{en:'fruit',ru:'фрукт'}, msg:{en:'Lowest sugar, highest antioxidants of all fruits. Best fruit choice.',ru:'Меньше всего сахара и больше антиоксидантов из всех фруктов. Лучший выбор.'} },
  { keys:['banana','банан'], score:3, name:{en:'Banana',ru:'Банан'}, label:{en:'fruit',ru:'фрукт'}, msg:{en:'Good potassium and serotonin precursors. Higher sugar — best before exercise.',ru:'Калий и предшественники серотонина. Больше сахара — лучше до физической активности.'} },
  { keys:['orange','апельсин','mandarin','tangerine','мандарин'], score:4, name:{en:'Citrus',ru:'Цитрус'}, label:{en:'fruit',ru:'фрукт'}, msg:{en:'Vitamin C boosts collagen and immunity. Eat whole — not as juice.',ru:'Витамин C для коллагена и иммунитета. Ешьте целиком, не в виде сока.'} },
  { keys:['kiwi','киви'], score:5, name:{en:'Kiwi',ru:'Киви'}, label:{en:'fruit',ru:'фрукт'}, msg:{en:'Vitamin C + digestive enzymes + serotonin. Eating one before bed improves sleep.',ru:'Витамин C + пищеварительные ферменты + серотонин. Перед сном улучшает сон.'} },
  { keys:['avocado','авокадо'], score:5, name:{en:'Avocado',ru:'Авокадо'}, label:{en:'healthy fat',ru:'полезный жир'}, msg:{en:'Monounsaturated fats reduce inflammation. Potassium reduces water retention.',ru:'Мононенасыщенные жиры снижают воспаление. Калий убирает отёки.'} },
  { keys:['dried fruit','prune','чернослив','date','финик','raisin','изюм','dried apricot','курага'], score:2, name:{en:'Dried fruit',ru:'Сухофрукты'}, label:{en:'high sugar',ru:'много сахара'}, msg:{en:'Very concentrated sugar — treat like candy. Max 2–3 pieces per day.',ru:'Очень концентрированный сахар — как конфеты. Максимум 2–3 штуки в день.'} },
  // FATS, NUTS, SEEDS
  { keys:['olive oil','оливковое масло'], score:5, name:{en:'Olive oil',ru:'Оливковое масло'}, label:{en:'healthy fat',ru:'полезный жир'}, msg:{en:'The gold standard fat. Anti-inflammatory and heart-protective.',ru:'Золотой стандарт жиров. Противовоспалительное, защищает сердце.'} },
  { keys:['almond','almonds','миндаль'], score:4, name:{en:'Almonds',ru:'Миндаль'}, label:{en:'nut',ru:'орех'}, msg:{en:'Soak overnight to remove phytic acid and maximise magnesium absorption.',ru:'Замачивайте на ночь — убирает фитиновую кислоту и улучшает усвоение магния.'} },
  { keys:['walnut','walnuts','грецкий орех','грецкие орехи'], score:4, name:{en:'Walnuts',ru:'Грецкие орехи'}, label:{en:'nut',ru:'орех'}, msg:{en:'Highest omega-3 among nuts. Great for brain and reducing inflammation.',ru:'Больше всего омега-3 среди орехов. Хорошо для мозга и снижения воспаления.'} },
  { keys:['chia','чиа'], score:5, name:{en:'Chia seeds',ru:'Семена чиа'}, label:{en:'seed',ru:'семена'}, msg:{en:'Omega-3, fiber, and protein in one. Expand in stomach — lasting fullness.',ru:'Омега-3, клетчатка и белок в одном. Разбухают в желудке — долгое насыщение.'} },
  { keys:['pumpkin seed','тыквенные семечки'], score:4, name:{en:'Pumpkin seeds',ru:'Тыквенные семечки'}, label:{en:'seed',ru:'семена'}, msg:{en:'High in zinc for skin and immunity, also rich in magnesium.',ru:'Много цинка для кожи и иммунитета, богаты магнием.'} },
  { keys:['butter','сливочное масло'], score:2, name:{en:'Butter',ru:'Сливочное масло'}, label:{en:'saturated fat',ru:'насыщенный жир'}, msg:{en:'Use sparingly. Olive oil is a healthier fat for cooking.',ru:'Используйте понемногу. Оливковое масло — более полезный жир.'} },
  { keys:['cheese','сыр'], score:2, name:{en:'Cheese',ru:'Сыр'}, label:{en:'saturated fat',ru:'насыщенный жир'}, msg:{en:'High saturated fat and sodium. A small amount (30g) a few times a week is fine.',ru:'Много насыщенного жира и соли. Небольшое количество (30г) пару раз в неделю — нормально.'} },
  // DRINKS
  { keys:['water','вода'], score:5, name:{en:'Water',ru:'Вода'}, label:{en:'hydration',ru:'гидратация'}, msg:{en:'Essential for digestion, energy, skin and detox. Aim for 1.5–2L daily.',ru:'Необходима для пищеварения, энергии, кожи и детокса. Цель — 1.5–2л в день.'} },
  { keys:['green tea','зелёный чай'], score:5, name:{en:'Green tea',ru:'Зелёный чай'}, label:{en:'antioxidant',ru:'антиоксидант'}, msg:{en:'EGCG antioxidants support fat metabolism and protect cells.',ru:'Антиоксиданты EGCG поддерживают жировой обмен и защищают клетки.'} },
  { keys:['herbal tea','травяной чай','chamomile','ромашка'], score:5, name:{en:'Herbal tea',ru:'Травяной чай'}, label:{en:'calming',ru:'успокаивающий'}, msg:{en:'Chamomile relaxes intestinal muscles — counts toward your daily water goal.',ru:'Ромашка расслабляет кишечник — считается в ежедневный объём воды.'} },
  { keys:['coffee','кофе'], score:3, name:{en:'Coffee',ru:'Кофе'}, label:{en:'stimulant',ru:'стимулятор'}, msg:{en:'Rich in antioxidants if black. Limit to 1–2 cups before noon to protect sleep.',ru:'Много антиоксидантов в чёрном. До 2 чашек до полудня, чтобы не нарушать сон.'} },
  { keys:['juice','сок'], score:1, name:{en:'Juice',ru:'Сок'}, label:{en:'sugar drink',ru:'сладкий напиток'}, msg:{en:'Even fresh juice lacks fiber and spikes blood sugar fast. Eat the whole fruit instead.',ru:'Даже свежий сок без клетчатки быстро поднимает сахар. Лучше есть фрукт целиком.'} },
  { keys:['soda','cola','кола','газировка','sprite','fanta','лимонад'], score:0, name:{en:'Soda',ru:'Газировка'}, label:{en:'avoid',ru:'избегать'}, msg:{en:'Empty calories, blood sugar spike, promotes inflammation and fat storage.',ru:'Пустые калории, скачок сахара, воспаление и накопление жира.'} },
  { keys:['alcohol','wine','beer','vodka','вино','пиво','водка','алкоголь'], score:0, name:{en:'Alcohol',ru:'Алкоголь'}, label:{en:'avoid',ru:'избегать'}, msg:{en:'Disrupts sleep, raises cortisol, and leads to belly fat storage.',ru:'Нарушает сон, повышает кортизол и способствует накоплению жира на животе.'} },
  // SWEETS & PROCESSED
  { keys:['honey','мёд'], score:3, name:{en:'Honey',ru:'Мёд'}, label:{en:'natural sugar',ru:'натуральный сахар'}, msg:{en:'Better than sugar — has enzymes and antimicrobial properties. Use sparingly.',ru:'Лучше сахара — есть ферменты. Но всё равно понемногу.'} },
  { keys:['dark chocolate','тёмный шоколад'], score:3, name:{en:'Dark chocolate 70%+',ru:'Тёмный шоколад 70%+'}, label:{en:'treat',ru:'лакомство'}, msg:{en:'Antioxidants and magnesium — 1–2 small pieces a day is actually beneficial.',ru:'Антиоксиданты и магний — 1–2 маленьких кусочка в день на самом деле полезно.'} },
  { keys:['chocolate','шоколад','candy','конфеты','sweets','сладкое'], score:1, name:{en:'Candy/Sweets',ru:'Конфеты/Сладкое'}, label:{en:'sugar',ru:'сахар'}, msg:{en:'Sugar spikes insulin, causes energy crashes and feeds harmful gut bacteria.',ru:'Сахар вызывает скачок инсулина, энергетические провалы и питает вредные бактерии.'} },
  { keys:['sugar','сахар'], score:0, name:{en:'Sugar',ru:'Сахар'}, label:{en:'avoid',ru:'избегать'}, msg:{en:'Feeds harmful gut bacteria, causes inflammation and disrupts hormone balance.',ru:'Питает вредные бактерии, вызывает воспаление и нарушает гормональный баланс.'} },
  { keys:['cake','tort','торт','pastry','выпечка','bun','булочка','cookie','печенье','пирог'], score:0, name:{en:'Pastry/Cake',ru:'Выпечка/Торт'}, label:{en:'avoid',ru:'избегать'}, msg:{en:'Sugar + refined flour + saturated fat — triple hit. Save for very special occasions.',ru:'Сахар + белая мука + насыщенный жир — тройной удар. Только для особых случаев.'} },
  { keys:['chips','чипсы','crisps'], score:0, name:{en:'Chips',ru:'Чипсы'}, label:{en:'avoid',ru:'избегать'}, msg:{en:'Fried, high sodium, artificial flavors — causes bloating and water retention.',ru:'Жареные, много соли, искусственные ароматизаторы — вздутие и отёки.'} },
  { keys:['fast food','фастфуд','burger','бургер','pizza','пицца'], score:0, name:{en:'Fast food',ru:'Фастфуд'}, label:{en:'avoid',ru:'избегать'}, msg:{en:'Processed oils, hidden sugars, excess sodium. Try to avoid for the full 5 weeks.',ru:'Обработанные масла, скрытый сахар, соль. Избегайте в течение 5 недель.'} },
  { keys:['fried','жареное','жарила','жарил'], score:1, name:{en:'Fried food',ru:'Жареное'}, label:{en:'cooking method',ru:'способ готовки'}, msg:{en:'Frying creates acrylamide and trans fats. Same ingredients are far healthier grilled, steamed or baked.',ru:'Жарка создаёт акриламид и трансжиры. Те же продукты намного полезнее на гриле, пару или в духовке.'} },
];

// ─── Day Analysis Engine ──────────────────────────────────────────────────────

function analyzeDay(meals, L) {
  const allItems = [
    ...meals.breakfast.map(f => ({ ...f, slot:'breakfast' })),
    ...meals.snack.map(f => ({ ...f, slot:'snack' })),
    ...meals.lunch.map(f => ({ ...f, slot:'lunch' })),
    ...meals.dinner.map(f => ({ ...f, slot:'dinner' })),
  ];
  if (allItems.length === 0) return null;

  const matched = [], unmatched = [];
  const seenFoodIds = new Set();

  for (const item of allItems) {
    const text = item.text.toLowerCase();
    let best = null;
    for (const food of FOOD_DB) {
      for (const key of food.keys) {
        if (text.includes(key.toLowerCase())) {
          if (!best || food.score < best.score) best = food; // take worst match (conservative)
          break;
        }
      }
    }
    if (best) { matched.push({ item, food: best }); seenFoodIds.add(best.name.en); }
    else unmatched.push(item);
  }

  const great  = matched.filter(m => m.food.score >= 4);
  const watch  = matched.filter(m => m.food.score >= 2 && m.food.score <= 3);
  const avoid  = matched.filter(m => m.food.score <= 1);

  const avgScore = matched.length ? matched.reduce((s,m) => s + m.food.score, 0) / matched.length : 0;
  const dayScore = Math.round((avgScore / 5) * 10);

  // Detect patterns for insight
  const hasProtein = matched.some(m => ['lean_protein','omega3_protein','complete_protein','protein','probiotic','legume_protein'].some(g => m.food.label.en.includes('protein') || m.food.label.en.includes('probiotic')));
  const hasVeg     = matched.some(m => m.food.label.en === 'vegetable');
  const hasFried   = matched.some(m => m.food.keys.some(k => ['fried','жареное'].includes(k)));
  const hasAlcohol = matched.some(m => m.food.name.en === 'Alcohol');
  const hasSoda    = matched.some(m => m.food.name.en === 'Soda');

  let insight = { en:'', ru:'' };
  if (hasAlcohol) {
    insight = { en:'Alcohol disrupts deep sleep and raises cortisol — even one drink can affect fat loss for up to 3 days.',ru:'Алкоголь нарушает глубокий сон и повышает кортизол — даже один бокал влияет на сжигание жира до 3 дней.' };
  } else if (hasSoda) {
    insight = { en:'Swap soda for sparkling water with lemon — you get the bubbles without the sugar spike.',ru:'Замените газировку на минеральную воду с лимоном — те же пузырьки без скачка сахара.' };
  } else if (hasFried) {
    insight = { en:'Next time try baking or grilling instead of frying — same flavours, far fewer harmful compounds.',ru:'В следующий раз попробуйте запечь или приготовить на гриле вместо жарки — те же вкусы, намного меньше вредных веществ.' };
  } else if (!hasVeg) {
    insight = { en:'No vegetables today — try adding just one handful to your next meal. Even frozen counts!',ru:'Сегодня без овощей — попробуйте добавить хотя бы горсть к следующему приёму пищи. Даже замороженные считаются!' };
  } else if (!hasProtein) {
    insight = { en:'Add a protein source (eggs, fish, chicken, or lentils) at each meal to stay full and protect muscle.',ru:'Добавьте белок (яйца, рыба, курица или чечевица) к каждому приёму пищи — насыщает и защищает мышцы.' };
  } else if (dayScore >= 8) {
    insight = { en:'Exceptional day! Your gut bacteria are thriving on these choices. Keep this momentum.',ru:'Исключительный день! Ваши кишечные бактерии процветают от таких выборов. Держите этот импульс.' };
  } else if (dayScore >= 6) {
    insight = { en:'Good day overall! A few small swaps tomorrow and you\'ll be in excellent shape.',ru:'В целом хороший день! Несколько небольших замен завтра — и будет отлично.' };
  } else {
    insight = { en:'Every meal is a fresh start. Tomorrow, try swapping one processed item for a whole food.',ru:'Каждый приём пищи — это свежий старт. Завтра попробуйте заменить один переработанный продукт на цельный.' };
  }

  return { great, watch, avoid, unmatched, dayScore, insight };
}

// ─── Sub-tab: Food Journal (Today) ───────────────────────────────────────────

function TodayMeals({ lang:L, profile }) {
  const today = todayKey();
  const [meals, setMeals] = useState(() => {
    try { const s = SS.get(`dba_journal_${today}`); return s ? JSON.parse(s) : { breakfast:[], snack:[], lunch:[], dinner:[] }; }
    catch { return { breakfast:[], snack:[], lunch:[], dinner:[] }; }
  });
  const [inputs, setInputs] = useState({ breakfast:'', snack:'', lunch:'', dinner:'' });
  const [water, setWater] = useState(() => SS.get(`dba_water_${today}`) || null);

  const analysis = analyzeDay(meals, L);

  const SLOTS = [
    { key:'breakfast', icon:'🌅', label:{en:'Breakfast',ru:'Завтрак'},   time:'7:00–9:00',   bg:'#fef9ee', border:'#f0d080' },
    { key:'snack',     icon:'🍎', label:{en:'Snack',ru:'Перекус'},       time:'10:30–11:00', bg:'#fdf0f8', border:'#e0a0d0' },
    { key:'lunch',     icon:'🥗', label:{en:'Lunch',ru:'Обед'},          time:'12:30–14:00', bg:'#f0f7ee', border:'#90c880' },
    { key:'dinner',    icon:'🌙', label:{en:'Dinner',ru:'Ужин'},         time:'18:30–20:00', bg:'#f4f0fa', border:'#b090d0' },
  ];

  function addFood(slot) {
    const text = inputs[slot].trim();
    if (!text) return;
    const next = { ...meals, [slot]: [...meals[slot], { id: Date.now(), text }] };
    setMeals(next);
    SS.set(`dba_journal_${today}`, JSON.stringify(next));
    setInputs(p => ({ ...p, [slot]: '' }));
  }

  function removeFood(slot, id) {
    const next = { ...meals, [slot]: meals[slot].filter(f => f.id !== id) };
    setMeals(next);
    SS.set(`dba_journal_${today}`, JSON.stringify(next));
  }

  function setWaterLevel(val) {
    setWater(val);
    SS.set(`dba_water_${today}`, val);
  }

  const totalLogged = Object.values(meals).flat().length;
  const scoreColor = analysis
    ? analysis.dayScore >= 8 ? '#5a8a4a' : analysis.dayScore >= 5 ? '#c4a030' : '#c05030'
    : '#b0a090';

  const scoreLabel = analysis
    ? analysis.dayScore >= 8
      ? { en:'Excellent day! 🌟', ru:'Отличный день! 🌟' }
      : analysis.dayScore >= 6
      ? { en:'Good job today 💛', ru:'Хороший день 💛' }
      : analysis.dayScore >= 4
      ? { en:'Getting there 🌱', ru:'На верном пути 🌱' }
      : { en:'Room to grow 💙', ru:'Есть куда расти 💙' }
    : null;

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>

      {/* Date header */}
      <div style={{ textAlign:'center' }}>
        <p style={{ fontFamily:"'Lora',serif", fontSize:'17px', color:'#2d2518', fontWeight:500 }}>
          {new Date().toLocaleDateString(L==='ru'?'ru-RU':'en-GB', { weekday:'long', day:'numeric', month:'long' })}
        </p>
        <p style={{ fontFamily:"'Inter',sans-serif", fontSize:'11px', color:'#9a8870', marginTop:'2px' }}>
          {L==='en' ? 'Log what you ate — get honest feedback' : 'Запишите, что ели — получите честную обратную связь'}
        </p>
      </div>

      {/* Meal input sections */}
      {SLOTS.map(slot => (
        <div key={slot.key} style={{ background:slot.bg, border:`1px solid ${slot.border}`, borderRadius:'14px', padding:'12px 14px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'10px' }}>
            <span style={{ fontSize:'16px' }}>{slot.icon}</span>
            <p style={{ fontFamily:"'Inter',sans-serif", fontSize:'12px', fontWeight:600, color:'#4a3825', textTransform:'uppercase', letterSpacing:'0.05em', flex:1 }}>
              {slot.label[L]}
            </p>
            <span style={{ fontFamily:"'Inter',sans-serif", fontSize:'10px', color:'#b0a090' }}>{slot.time}</span>
          </div>

          {/* Food chips */}
          {meals[slot.key].length > 0 && (
            <div style={{ display:'flex', flexWrap:'wrap', gap:'6px', marginBottom:'8px' }}>
              {meals[slot.key].map(f => {
                const text = f.text.toLowerCase();
                let chipScore = null;
                for (const food of FOOD_DB) {
                  if (food.keys.some(k => text.includes(k.toLowerCase()))) { chipScore = food.score; break; }
                }
                const chipColor = chipScore === null ? '#9a8870' : chipScore >= 4 ? '#5a8a4a' : chipScore >= 2 ? '#b08030' : '#c05030';
                return (
                  <div key={f.id} style={{ display:'flex', alignItems:'center', gap:'4px', background:'rgba(255,255,255,0.75)', border:`1px solid ${slot.border}`, borderRadius:'20px', padding:'4px 10px 4px 8px' }}>
                    <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:chipColor, flexShrink:0 }} />
                    <span style={{ fontFamily:"'Inter',sans-serif", fontSize:'12px', color:'#3a2e22' }}>{f.text}</span>
                    <button onClick={() => removeFood(slot.key, f.id)} style={{ background:'none', border:'none', color:'#b0a090', cursor:'pointer', padding:'0 0 0 2px', fontSize:'13px', lineHeight:1 }}>×</button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Input row */}
          <div style={{ display:'flex', gap:'6px' }}>
            <input
              type="text"
              value={inputs[slot.key]}
              onChange={e => setInputs(p => ({ ...p, [slot.key]: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && addFood(slot.key)}
              placeholder={L==='en' ? 'Type a food and press Enter…' : 'Введите продукт и нажмите Enter…'}
              style={{ flex:1, padding:'8px 12px', borderRadius:'10px', border:'1px solid rgba(0,0,0,0.1)', fontFamily:"'Inter',sans-serif", fontSize:'13px', color:'#2d2518', background:'rgba(255,255,255,0.8)', outline:'none' }}
            />
            <button onClick={() => addFood(slot.key)}
              style={{ padding:'8px 14px', borderRadius:'10px', background:'#8b7355', color:'#fff', border:'none', fontFamily:"'Inter',sans-serif", fontSize:'13px', cursor:'pointer', flexShrink:0 }}>
              +
            </button>
          </div>
        </div>
      ))}

      {/* Water tracker */}
      <div style={{ background:'#eaf5fb', border:'1px solid #aad4ee', borderRadius:'14px', padding:'12px 14px' }}>
        <p style={{ fontFamily:"'Inter',sans-serif", fontSize:'12px', fontWeight:600, color:'#3a6a8a', marginBottom:'10px' }}>
          💧 {L==='en' ? 'Did you drink 1.5–2L of water today?' : 'Выпили 1.5–2л воды сегодня?'}
        </p>
        <div style={{ display:'flex', gap:'8px' }}>
          {[
            { val:'yes',    en:'Yes! ✓',      ru:'Да! ✓' },
            { val:'mostly', en:'Mostly',      ru:'В основном' },
            { val:'no',     en:'Not really',  ru:'Не очень' },
          ].map(opt => (
            <button key={opt.val} onClick={() => setWaterLevel(opt.val)}
              style={{ flex:1, padding:'8px 4px', borderRadius:'10px', border:`1.5px solid ${water===opt.val?'#4a8aaa':'#aad4ee'}`, background:water===opt.val?'#4a8aaa':'rgba(255,255,255,0.7)', color:water===opt.val?'#fff':'#3a6a8a', fontFamily:"'Inter',sans-serif", fontSize:'12px', cursor:'pointer', fontWeight:water===opt.val?600:400 }}>
              {opt[L]}
            </button>
          ))}
        </div>
        {water === 'no' && (
          <p style={{ fontFamily:"'Inter',sans-serif", fontSize:'11px', color:'#3a6a8a', marginTop:'8px', lineHeight:1.5 }}>
            {L==='en' ? '💡 Dehydration is often mistaken for hunger. Try a glass of water before your next snack.' : '💡 Обезвоживание часто путают с голодом. Попробуйте стакан воды перед следующим перекусом.'}
          </p>
        )}
      </div>

      {/* Analysis */}
      {totalLogged === 0 ? (
        <div style={{ background:'#f5f0eb', borderRadius:'14px', padding:'20px', textAlign:'center' }}>
          <p style={{ fontSize:'32px', marginBottom:'8px' }}>📝</p>
          <p style={{ fontFamily:"'Lora',serif", fontSize:'15px', color:'#5a4535', marginBottom:'4px' }}>
            {L==='en' ? 'Start logging your meals' : 'Начните вносить приёмы пищи'}
          </p>
          <p style={{ fontFamily:"'Inter',sans-serif", fontSize:'12px', color:'#9a8870', lineHeight:1.6 }}>
            {L==='en' ? 'Type any food above — we\'ll analyse it and show you what\'s helping and what\'s not.' : 'Введите любой продукт выше — мы проанализируем и покажем, что помогает, а что нет.'}
          </p>
        </div>
      ) : analysis ? (
        <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>

          {/* Score card */}
          <div style={{ background:'linear-gradient(135deg,#fdf5ec,#f5f0e8)', border:'1px solid #e0c8a8', borderRadius:'16px', padding:'16px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'10px' }}>
              <p style={{ fontFamily:"'Lora',serif", fontSize:'16px', color:'#2d2518', fontWeight:500 }}>
                {L==='en' ? 'Today\'s score' : 'Оценка дня'}
              </p>
              <p style={{ fontFamily:"'Lora',serif", fontSize:'24px', color:scoreColor, fontWeight:500 }}>
                {analysis.dayScore}<span style={{ fontSize:'14px', color:'#9a8870' }}>/10</span>
              </p>
            </div>
            <div style={{ height:'8px', borderRadius:'4px', background:'#ede8e2', overflow:'hidden', marginBottom:'8px' }}>
              <div style={{ height:'100%', width:`${analysis.dayScore*10}%`, background:scoreColor, borderRadius:'4px', transition:'width 0.6s ease' }} />
            </div>
            <p style={{ fontFamily:"'Inter',sans-serif", fontSize:'13px', color:scoreColor, fontWeight:500 }}>
              {scoreLabel[L]}
            </p>
          </div>

          {/* Great choices */}
          {analysis.great.length > 0 && (
            <div style={{ background:'#f0f8f0', border:'1px solid #b0d8b0', borderRadius:'14px', padding:'14px' }}>
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:'11px', fontWeight:700, color:'#3a6a3a', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'10px' }}>
                ✅ {L==='en' ? 'What you did right' : 'Что вы сделали правильно'}
              </p>
              {analysis.great.map((m,i) => (
                <div key={i} style={{ marginBottom:'8px', paddingBottom:'8px', borderBottom:i<analysis.great.length-1?'1px solid #d0e8d0':'none' }}>
                  <p style={{ fontFamily:"'Inter',sans-serif", fontSize:'13px', fontWeight:500, color:'#2d2518', marginBottom:'2px' }}>
                    {m.food.name[L]} <span style={{ fontSize:'11px', color:'#6a9a6a', fontWeight:400 }}>· {m.item.text}</span>
                  </p>
                  <p style={{ fontFamily:"'Inter',sans-serif", fontSize:'12px', color:'#3a5a3a', lineHeight:1.5 }}>{m.food.msg[L]}</p>
                </div>
              ))}
            </div>
          )}

          {/* Watch */}
          {analysis.watch.length > 0 && (
            <div style={{ background:'#fefaf0', border:'1px solid #e0c870', borderRadius:'14px', padding:'14px' }}>
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:'11px', fontWeight:700, color:'#8a6a20', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'10px' }}>
                ⚠️ {L==='en' ? 'Watch this' : 'Обратите внимание'}
              </p>
              {analysis.watch.map((m,i) => (
                <div key={i} style={{ marginBottom:'8px', paddingBottom:'8px', borderBottom:i<analysis.watch.length-1?'1px solid #e8d880':'none' }}>
                  <p style={{ fontFamily:"'Inter',sans-serif", fontSize:'13px', fontWeight:500, color:'#2d2518', marginBottom:'2px' }}>
                    {m.food.name[L]} <span style={{ fontSize:'11px', color:'#9a7a30', fontWeight:400 }}>· {m.item.text}</span>
                  </p>
                  <p style={{ fontFamily:"'Inter',sans-serif", fontSize:'12px', color:'#6a5020', lineHeight:1.5 }}>{m.food.msg[L]}</p>
                </div>
              ))}
            </div>
          )}

          {/* Avoid */}
          {analysis.avoid.length > 0 && (
            <div style={{ background:'#fef0f0', border:'1px solid #e0a0a0', borderRadius:'14px', padding:'14px' }}>
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:'11px', fontWeight:700, color:'#8a3030', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'10px' }}>
                ❌ {L==='en' ? 'Think twice next time' : 'В следующий раз подумайте'}
              </p>
              {analysis.avoid.map((m,i) => (
                <div key={i} style={{ marginBottom:'8px', paddingBottom:'8px', borderBottom:i<analysis.avoid.length-1?'1px solid #e8b0b0':'none' }}>
                  <p style={{ fontFamily:"'Inter',sans-serif", fontSize:'13px', fontWeight:500, color:'#2d2518', marginBottom:'2px' }}>
                    {m.food.name[L]} <span style={{ fontSize:'11px', color:'#9a5050', fontWeight:400 }}>· {m.item.text}</span>
                  </p>
                  <p style={{ fontFamily:"'Inter',sans-serif", fontSize:'12px', color:'#6a2020', lineHeight:1.5 }}>{m.food.msg[L]}</p>
                </div>
              ))}
            </div>
          )}

          {/* Unrecognized */}
          {analysis.unmatched.length > 0 && (
            <div style={{ background:'#f8f5f0', border:'1px solid #d8ccc0', borderRadius:'14px', padding:'14px' }}>
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:'11px', fontWeight:700, color:'#7a6a5a', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'6px' }}>
                ❓ {L==='en' ? 'Not in our database yet' : 'Нет в нашей базе пока'}
              </p>
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:'12px', color:'#8a7a6a', lineHeight:1.5 }}>
                {analysis.unmatched.map(f => f.text).join(', ')} — {L==='en' ? 'track mindfully.' : 'отслеживайте осознанно.'}
              </p>
            </div>
          )}

          {/* Key insight */}
          {analysis.insight.en && (
            <div style={{ background:'#f4f0fa', border:'1px solid #c0a8e0', borderRadius:'14px', padding:'14px' }}>
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:'11px', fontWeight:700, color:'#6a4a9a', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'6px' }}>
                💡 {L==='en' ? 'Today\'s insight' : 'Инсайт дня'}
              </p>
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:'13px', color:'#3a2a5a', lineHeight:1.6 }}>{analysis.insight[L]}</p>
            </div>
          )}

          {/* All good banner */}
          {analysis.avoid.length === 0 && analysis.watch.length === 0 && analysis.great.length > 0 && (
            <div style={{ background:'linear-gradient(135deg,#f0faf0,#e8f5e8)', border:'1px solid #90c890', borderRadius:'12px', padding:'12px 14px', textAlign:'center' }}>
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:'13px', color:'#3a6a3a' }}>
                🌿 {L==='en' ? 'Clean sweep! Only nourishing choices today.' : 'Чисто! Только питательные выборы сегодня.'}
              </p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}


// ─── Sub-tab: My Plan ─────────────────────────────────────────────────────────

function MyPlan({ lang:L }) {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [dayIdx, setDayIdx] = useState(getTodayDayIdx());
  const [openSlots, setOpenSlots] = useState({});

  const phase   = PHASES[phaseIdx];
  const dayPlan = WEEKLY_PLAN[phase][dayIdx];

  function toggleSlot(key) { setOpenSlots(p => ({ ...p, [key]: !p[key] })); }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>

      {/* Phase pills */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:'6px', justifyContent:'center' }}>
        {PHASES.map((p,i) => (
          <button key={p} onClick={() => setPhaseIdx(i)}
            style={{ padding:'5px 10px', borderRadius:'16px', border:`1px solid ${i===phaseIdx?'#8b7355':'#d8ccc0'}`,
              background:i===phaseIdx?'#8b7355':'#fff', color:i===phaseIdx?'#fff':'#8b7355',
              fontFamily:"'Inter',sans-serif", fontSize:'11px', cursor:'pointer' }}>
            {p}
          </button>
        ))}
      </div>

      {/* Day selector */}
      <div style={{ display:'flex', justifyContent:'space-between', gap:'4px' }}>
        {DAYS.map((d,i) => {
          const isToday = i === getTodayDayIdx();
          return (
            <button key={d} onClick={() => setDayIdx(i)}
              style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', padding:'6px 2px', borderRadius:'10px',
                border:`1.5px solid ${i===dayIdx?'#8b7355':'#ede8e2'}`, background:i===dayIdx?'#8b7355':'#fff', cursor:'pointer', gap:'3px' }}>
              <span style={{ fontFamily:"'Inter',sans-serif", fontSize:'11px', color:i===dayIdx?'#fff':'#5a4535', fontWeight:500 }}>{d}</span>
              {isToday && <span style={{ width:'5px', height:'5px', borderRadius:'50%', background:i===dayIdx?'rgba(255,255,255,0.7)':'#c4a882', display:'block' }} />}
            </button>
          );
        })}
      </div>

      <p style={{ fontFamily:"'Lora',serif", fontSize:'15px', color:'#5a4535', textAlign:'center', fontStyle:'italic', margin:'-2px 0' }}>
        {L==='ru' ? DAYS_FULL_RU[dayIdx] : DAYS_FULL_EN[dayIdx]} — {phase}
      </p>

      {/* Tip */}
      <div style={{ display:'flex', alignItems:'center', gap:'8px', background:'#fef9ee', border:'1px solid #f0d080', borderRadius:'10px', padding:'8px 12px' }}>
        <span>💡</span>
        <span style={{ fontFamily:"'Inter',sans-serif", fontSize:'11px', color:'#7a6030', lineHeight:1.5 }}>
          {L==='ru'
            ? <>Цель дня: <strong>1.5–2л воды</strong> · последний приём пищи до <strong>19:00–20:00</strong></>
            : <>Daily goal: <strong>1.5–2L water</strong> · last meal by <strong>19:00–20:00</strong></>}
        </span>
      </div>

      {/* Meal slots */}
      {PLAN_SLOTS.map(slot => {
        const val = dayPlan[slot.key];
        if (!val) return null;
        const text = typeof val === 'object' ? (val[L] || val.en) : val;
        const isOpen = !slot.water || openSlots[slot.key];
        const label = L==='ru' ? slot.labelRu : slot.label;
        return (
          <div key={slot.key} onClick={() => slot.water && toggleSlot(slot.key)}
            style={{ borderRadius:'12px', border:`1px solid ${slot.border}`, padding:'10px 14px', background:slot.bg, opacity:slot.water?0.88:1, cursor:slot.water?'pointer':'default' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:isOpen?'4px':0 }}>
              <span style={{ fontSize:'15px' }}>{slot.icon}</span>
              <span style={{ fontFamily:"'Inter',sans-serif", fontWeight:500, fontSize:'12px', color:'#4a3825', flex:1, textTransform:'uppercase', letterSpacing:'0.03em' }}>{label}</span>
              {slot.water && <span style={{ fontSize:'10px', color:'#9a8870' }}>{isOpen?'▲':'▼'}</span>}
            </div>
            {isOpen && <p style={{ fontFamily:"'Inter',sans-serif", fontSize:'13px', color:'#3a2e22', lineHeight:1.6 }}>{text}</p>}
          </div>
        );
      })}

      <div style={{ background:'#f5f0eb', borderRadius:'10px', padding:'10px 14px', marginTop:'2px' }}>
        <p style={{ fontFamily:"'Inter',sans-serif", fontSize:'12px', color:'#8b7355', lineHeight:1.6, textAlign:'center', fontStyle:'italic' }}>
          {L==='ru'
            ? '🌿 Предпочитайте готовку на пару, гриль или духовку. Прислушивайтесь к телу — корректируйте порции.'
            : '🌿 Prefer steaming, grilling, or oven-baking. Listen to your body — adjust portions as needed.'}
        </p>
      </div>
    </div>
  );
}


// ─── Sub-tab: Progress ────────────────────────────────────────────────────────

function Progress({ lang:L, profile }) {
  const tdee  = calcTDEE(profile);
  const start = profile.weight;
  const height = profile.height / 100;

  // Build week-by-week projection
  const weeks = PHASES.map(phase => {
    const planCal = PHASE_KCAL[phase];
    const deficit  = Math.max(0, tdee - planCal);
    const kgLostPerWeek = deficit * 7 / 7700; // 7700 kcal ≈ 1 kg fat
    return { phase, planCal, deficit, kgLostPerWeek };
  });

  let runningWeight = start;
  const projections = weeks.map(w => {
    runningWeight = Math.round((runningWeight - w.kgLostPerWeek) * 10) / 10;
    return { ...w, weightAfter: runningWeight };
  });

  const finalWeight = projections[projections.length - 1].weightAfter;
  const totalLoss   = Math.round((start - finalWeight) * 10) / 10;
  const finalBMI    = Math.round((finalWeight / (height * height)) * 10) / 10;
  const startBMI    = Math.round((start / (height * height)) * 10) / 10;

  const barMax = start;
  const barMin = finalWeight - 1;

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>

      {/* Summary card */}
      <div style={{ background:'linear-gradient(135deg, #fdf5ec 0%, #f5f0e8 100%)', border:'1px solid #e0c8a8', borderRadius:'16px', padding:'18px' }}>
        <p style={{ fontFamily:"'Lora',serif", fontSize:'16px', fontWeight:500, color:'#2d2518', marginBottom:'12px', textAlign:'center' }}>
          {L==='en'?'Your Projected Results':'Ваши прогнозируемые результаты'}
        </p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'12px', textAlign:'center' }}>
          {[
            { label: L==='en'?'Start weight':'Нач. вес',   value:`${start} kg`,       sub:'' },
            { label: L==='en'?'After 5 weeks':'После 5 нед', value:`${finalWeight} kg`, sub:`−${totalLoss} kg` },
            { label: L==='en'?'Final BMI':'Итог. ИМТ',    value:finalBMI,              sub:L==='en'?'healthy range':'норма' },
          ].map(({label,value,sub},i) => (
            <div key={i} style={{ background:'rgba(255,255,255,0.6)', borderRadius:'10px', padding:'10px 8px' }}>
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:'10px', color:'#9a8870', marginBottom:'4px', lineHeight:1.3 }}>{label}</p>
              <p style={{ fontFamily:"'Lora',serif", fontSize:'18px', color:'#2d2518', fontWeight:500 }}>{value}</p>
              {sub && <p style={{ fontFamily:"'Inter',sans-serif", fontSize:'11px', color:'#7a8a60', marginTop:'2px' }}>{sub}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Week-by-week chart */}
      <div style={{ background:'#fff', border:'1px solid #ede8e2', borderRadius:'14px', padding:'16px' }}>
        <p style={{ fontFamily:"'Inter',sans-serif", fontSize:'12px', fontWeight:600, color:'#4a3825', marginBottom:'14px' }}>
          📉 {L==='en'?'Week-by-Week Projection':'Неделя за неделей'}
        </p>

        {/* Starting line */}
        <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'10px' }}>
          <div style={{ width:'90px', fontFamily:"'Inter',sans-serif", fontSize:'11px', color:'#9a8870', flexShrink:0 }}>
            {L==='en'?'Start':'Начало'}
          </div>
          <div style={{ flex:1, height:'12px', borderRadius:'6px', background:'#e8e0d8', position:'relative' }}>
            <div style={{ position:'absolute', right:'-2px', top:'-4px', fontFamily:"'Inter',sans-serif", fontSize:'11px', color:'#8b7355', fontWeight:600 }}>
              {start} kg
            </div>
          </div>
        </div>

        {projections.map((p, i) => {
          const barFill = Math.max(0, Math.min(100, ((p.weightAfter - barMin) / (barMax - barMin)) * 100));
          return (
            <div key={p.phase} style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'10px' }}>
              <div style={{ width:'90px', fontFamily:"'Inter',sans-serif", fontSize:'10px', color:'#5a4535', flexShrink:0, lineHeight:1.3 }}>
                {p.phase}
              </div>
              <div style={{ flex:1, position:'relative' }}>
                <div style={{ height:'12px', borderRadius:'6px', background:'#ede8e2', overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${barFill}%`, background:`hsl(${80 + i*15}, 45%, 52%)`, borderRadius:'6px', transition:'width 0.5s' }} />
                </div>
                <div style={{ position:'absolute', right:'-2px', top:'-4px', fontFamily:"'Inter',sans-serif", fontSize:'11px', color:'#5a8a4a', fontWeight:600, whiteSpace:'nowrap' }}>
                  {p.weightAfter} kg
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Per-week details */}
      <div style={{ background:'#fff', border:'1px solid #ede8e2', borderRadius:'14px', padding:'16px' }}>
        <p style={{ fontFamily:"'Inter',sans-serif", fontSize:'12px', fontWeight:600, color:'#4a3825', marginBottom:'12px' }}>
          🔢 {L==='en'?'Calorie Math':'Расчёт калорий'}
        </p>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px' }}>
          <span style={{ fontFamily:"'Inter',sans-serif", fontSize:'11px', color:'#9a8870' }}>{L==='en'?'Your TDEE (maintenance)':'Ваш TDEE (поддержание)'}</span>
          <span style={{ fontFamily:"'Inter',sans-serif", fontSize:'12px', color:'#2d2518', fontWeight:500 }}>{tdee} kcal</span>
        </div>
        {projections.map(p => (
          <div key={p.phase} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderTop:'1px solid #f5f0eb' }}>
            <span style={{ fontFamily:"'Inter',sans-serif", fontSize:'11px', color:'#5a4535' }}>{p.phase}</span>
            <span style={{ fontFamily:"'Inter',sans-serif", fontSize:'11px', color:'#9a8870' }}>
              ~{p.planCal} kcal · deficit {p.deficit} · −{p.kgLostPerWeek.toFixed(2)} kg/wk
            </span>
          </div>
        ))}
      </div>

      {/* BMI note */}
      <div style={{ background:'#f0f8f0', border:'1px solid #c0d8c0', borderRadius:'12px', padding:'12px 14px' }}>
        <p style={{ fontFamily:"'Inter',sans-serif", fontSize:'12px', color:'#3a6a3a', lineHeight:1.6 }}>
          🌿 <strong>{L==='en'?'Your BMI context:':'Ваш ИМТ:'}</strong>{' '}
          {L==='en'
            ? `Currently ${startBMI} (healthy range: 18.5–24.9). After the plan: ${finalBMI}. You are staying well within healthy range throughout — this plan is about quality and maintenance, not drastic change.`
            : `Сейчас ${startBMI} (норма: 18.5–24.9). После плана: ${finalBMI}. Вы остаётесь в норме на протяжении всего плана — это про качество и поддержание, а не резкие изменения.`}
        </p>
      </div>

      <p style={{ fontFamily:"'Inter',sans-serif", fontSize:'10px', color:'#b0a090', textAlign:'center', lineHeight:1.5 }}>
        {L==='en'
          ? '* Projections are estimates based on Mifflin-St Jeor formula. Actual results depend on consistency, hydration, sleep, and stress levels.'
          : '* Прогнозы — расчёты по формуле Миффлина-Сан Жеора. Реальные результаты зависят от регулярности, сна и стресса.'}
      </p>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function NutritionPlan({ lang = 'en' }) {
  const L = lang;

  const [subTab, setSubTab] = useState('today');
  const [profile, setProfile] = useState(() => {
    try {
      const saved = SS.get('dba_nutrition_profile');
      return saved ? JSON.parse(saved) : { ...DEFAULT_PROFILE };
    } catch {
      return { ...DEFAULT_PROFILE };
    }
  });

  const SUB_TABS = [
    { id:'plan',     icon:'📅', label:L==='en'?'My Plan':'Мой план' },
    { id:'today',    icon:'🍽️', label:L==='en'?'Today':'Сегодня' },
    { id:'progress', icon:'📊', label:L==='en'?'Progress':'Прогресс' },
  ];

  return (
    <div style={{ width:'100%', display:'flex', flexDirection:'column', gap:'12px', paddingBottom:'16px' }}>

      {/* Header */}
      <div style={{ textAlign:'center', paddingTop:'4px' }}>
        <p style={{ fontFamily:"'Lora',serif", fontWeight:500, fontSize:'22px', color:'#2d2518', marginBottom:'4px' }}>
          {L==='en'?'Nutrition':'Питание'}
        </p>
        <p style={{ fontFamily:"'Inter',sans-serif", fontWeight:300, fontSize:'12px', color:'#9a8870' }}>
          {L==='en'?'Your personalised meal & diet plan':'Ваш персональный план питания'}
        </p>
      </div>

      {/* Sub-tab bar */}
      <div style={{ display:'flex', background:'#fff', borderRadius:'14px', border:'1px solid #ede8e2', padding:'4px', gap:'4px' }}>
        {SUB_TABS.map(t => (
          <button key={t.id} onClick={() => setSubTab(t.id)}
            style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:'2px', padding:'8px 4px', borderRadius:'10px',
              background:t.id===subTab?'#8b7355':'transparent', border:'none', cursor:'pointer' }}>
            <span style={{ fontSize:'16px', lineHeight:1 }}>{t.icon}</span>
            <span style={{ fontFamily:"'Inter',sans-serif", fontSize:'10px', fontWeight:t.id===subTab?600:400, color:t.id===subTab?'#fff':'#9a8870', letterSpacing:'0.02em' }}>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Sub-tab content */}
      {subTab === 'plan'     && <MyPlan lang={L} />}
      {subTab === 'today'    && <TodayMeals lang={L} profile={profile} />}
      {subTab === 'progress' && <Progress lang={L} profile={profile} />}
    </div>
  );
}
