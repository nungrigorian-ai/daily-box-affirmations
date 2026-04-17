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

// ─── Adaptive Meal Library ────────────────────────────────────────────────────

const MEALS = {
  breakfast: [
    { id:'oat_porridge', emoji:'🥣', name:{en:'Oat Porridge & Banana',ru:'Овсянка с бананом'}, calories:365, protein:12, carbs:62, fat:8,
      ingredients:{en:['½ cup rolled oats','1 cup oat or almond milk','1 ripe banana, sliced','½ tsp cinnamon','1 tsp honey'],ru:['½ стак. овсяных хлопьев','1 стак. молока','1 спелый банан','½ ч.л. корицы','1 ч.л. мёда']},
      prep:{en:['Cook oats in milk 5 min, stirring often.','Stir in cinnamon and honey.','Top with banana. Serve warm.'],ru:['Варите хлопья в молоке 5 мин.','Добавьте корицу и мёд.','Сверху банан. Подавайте тёплым.']},
      note:{en:'Oats feed good gut bacteria. Banana gives potassium to reduce water retention. Cinnamon warms digestion.',ru:'Овёс питает полезные бактерии. Банан даёт калий. Корица разогревает пищеварение.'} },
    { id:'scrambled_eggs', emoji:'🍳', name:{en:'Soft Eggs & Sourdough',ru:'Яичница с хлебом'}, calories:310, protein:18, carbs:28, fat:13,
      ingredients:{en:['2 eggs','1 slice sourdough toast','3–4 cucumber slices','Pinch sea salt','Drizzle olive oil'],ru:['2 яйца','1 ломтик хлеба','3–4 кружочка огурца','Щепотка соли','Капля оливкового масла']},
      prep:{en:['Beat eggs. Cook low heat with olive oil.','Stir slowly for creamy texture.','Toast sourdough. Serve with cucumber.'],ru:['Взбейте яйца. Готовьте на слабом огне.','Медленно помешивайте.','Хлеб подрумяньте. Подавайте с огурцом.']},
      note:{en:'Eggs are highly bioavailable protein. Sourdough fermentation reduces bloating vs regular bread.',ru:'Яйца — лёгкий белок. Закваска делает хлеб легче обычного — меньше вздутия.'} },
    { id:'buckwheat_porridge', emoji:'🍚', name:{en:'Buckwheat & Soft-Boiled Egg',ru:'Гречка с яйцом'}, calories:340, protein:15, carbs:48, fat:9,
      ingredients:{en:['½ cup raw buckwheat, rinsed','1 soft-boiled egg (7 min)','½ tsp butter','Sea salt'],ru:['½ стак. гречки','1 яйцо всмятку (7 мин)','½ ч.л. масла','Морская соль']},
      prep:{en:['Cook buckwheat in 1 cup water 15 min.','Soft-boil egg 7 min, then cool water.','Add butter and salt. Serve warm.'],ru:['Варите гречку 15 мин.','Яйцо всмятку 7 мин.','Добавьте масло и соль.']},
      note:{en:'Buckwheat gently stimulates bowel movement. Rich in magnesium for muscle tension relief.',ru:'Гречка мягко стимулирует кишечник. Богата магнием от напряжения мышц.'} },
    { id:'chia_pudding', emoji:'🫙', name:{en:'Overnight Chia Pudding',ru:'Чиа-пудинг'}, calories:285, protein:12, carbs:32, fat:10,
      ingredients:{en:['1 cup kefir or yogurt','2 tsp chia seeds','1 tsp pumpkin seeds','60g mixed berries','Prepare the night before'],ru:['1 стак. кефира или йогурта','2 ч.л. семян чиа','1 ч.л. тыквенных семечек','60г ягод','Готовить вечером']},
      prep:{en:['Mix kefir with chia and pumpkin seeds.','Add berries. Stir well.','Refrigerate overnight. Serve cold.'],ru:['Смешайте кефир с чиа и семечками.','Добавьте ягоды. Перемешайте.','Охладите ночью. Подавайте холодным.']},
      note:{en:'Chia seeds are omega-3 rich and provide lasting fullness. Probiotics from kefir support gut flora.',ru:'Чиа богаты омега-3 и дают длительное насыщение. Пробиотики кефира поддерживают микрофлору.'} },
    { id:'detox_smoothie', emoji:'🍹', name:{en:'Detox Green Smoothie',ru:'Детокс-смузи'}, calories:195, protein:5, carbs:38, fat:3,
      ingredients:{en:['½ kiwi','Handful fresh spinach or parsley','½ green apple, juiced','2 tsp chia seeds','200ml water'],ru:['½ киви','Горсть шпината или петрушки','½ зелёного яблока','2 ч.л. чиа','200мл воды']},
      prep:{en:['Blend all ingredients until smooth.','Drink slowly, within 15 min of blending.'],ru:['Взбейте всё блендером.','Пейте медленно, в течение 15 мин.']},
      note:{en:'Chlorophyll from greens alkalizes the body. Kiwi provides vitamin C and digestive enzymes. Best light start.',ru:'Хлорофилл из зелени ощелачивает организм. Киви даёт витамин C и ферменты. Лёгкий старт дня.'} },
  ],
  lunch: [
    { id:'cod_rice_zucchini', emoji:'🐟', name:{en:'Baked Cod + Rice + Zucchini',ru:'Запечённая треска с рисом'}, calories:450, protein:38, carbs:48, fat:8,
      ingredients:{en:['150g cod fillet','½ cup white rice (cooked)','1 medium zucchini, sliced','Lemon juice, dill, olive oil, sea salt'],ru:['150г трески','½ стак. риса','1 кабачок','Лимон, укроп, оливковое масло, соль']},
      prep:{en:['Season cod with lemon, salt, dill. Bake 180°C for 15–18 min.','Sauté zucchini in olive oil 5–7 min.','Serve over rice, drizzle lemon.'],ru:['Треску с лимоном и укропом запечь 180°C 15–18 мин.','Кабачок обжарить 5–7 мин.','Подать с рисом.']},
      note:{en:'White fish is the easiest protein to digest. Cooked zucchini is anti-inflammatory and low-FODMAP.',ru:'Белая рыба — самый лёгкий белок. Мягкий кабачок противовоспалителен и не вызывает газов.'} },
    { id:'chicken_soup', emoji:'🍲', name:{en:'Chicken Vegetable Soup',ru:'Куриный овощной суп'}, calories:380, protein:28, carbs:38, fat:10,
      ingredients:{en:['120g chicken breast','1 carrot diced','1 potato diced','½ onion','Dill, bay leaf, sea salt'],ru:['120г куриной грудки','1 морковь','1 картофель','½ луковицы','Укроп, лавровый лист, соль']},
      prep:{en:['Simmer chicken 20 min. Remove and shred.','Add vegetables to broth. Cook 15 min.','Return chicken, add dill. Serve hot.'],ru:['Варите курицу 20 мин. Достаньте.','Добавьте овощи в бульон 15 мин.','Верните курицу, добавьте укроп.']},
      note:{en:'Chicken broth heals the gut lining. Warm liquid supports natural bowel movement. Best on bloating days.',ru:'Бульон восстанавливает слизистую. Тёплая жидкость поддерживает перистальтику. Лучший выбор в дни вздутия.'} },
    { id:'salmon_quinoa', emoji:'🍣', name:{en:'Poached Salmon + Quinoa + Roasted Pepper',ru:'Лосось с киноа и перцем'}, calories:520, protein:40, carbs:44, fat:16,
      ingredients:{en:['150g salmon fillet','½ cup quinoa','1 bell pepper, roasted','Lemon, olive oil, dill'],ru:['150г лосося','½ стак. киноа','1 болгарский перец','Лимон, масло, укроп']},
      prep:{en:['Poach salmon in salted water + lemon 10–12 min.','Cook quinoa: 1 part to 2 water, 15 min.','Roast bell pepper 200°C 20 min. Plate together.'],ru:['Лосось в подсоленной воде с лимоном 10–12 мин.','Киноа 1:2 воды, 15 мин.','Перец 200°C 20 мин. Подать вместе.']},
      note:{en:'Salmon omega-3s reduce inflammation and directly support your nervous system. Quinoa contains all essential amino acids.',ru:'Омега-3 лосося снижают воспаление и поддерживают нервную систему. Киноа содержит все незаменимые аминокислоты.'} },
    { id:'chicken_sweet_potato', emoji:'🍗', name:{en:'Chicken + Sweet Potato + Broccoli',ru:'Курица с бататом и брокколи'}, calories:480, protein:38, carbs:52, fat:9,
      ingredients:{en:['150g chicken breast','1 medium sweet potato','1 cup broccoli florets','Olive oil, paprika, sea salt'],ru:['150г куриной грудки','1 батат','1 стак. брокколи','Оливковое масло, паприка, соль']},
      prep:{en:['Season chicken, bake 180°C 20–22 min.','Bake sweet potato 200°C 30 min.','Steam broccoli 5–6 min. Drizzle olive oil.'],ru:['Курицу запечь 180°C 20–22 мин.','Батат 200°C 30 мин.','Брокколи на пару 5–6 мин.']},
      note:{en:'Sweet potato feeds beneficial gut bacteria. Steamed broccoli contains sulforaphane — a potent gut anti-inflammatory.',ru:'Батат питает полезные бактерии. Брокколи на пару содержит сульфорафан — мощное противовоспалительное.'} },
    { id:'turkey_patties', emoji:'🥩', name:{en:'Turkey Patties + Potato + Green Beans',ru:'Котлеты из индейки с картошкой'}, calories:490, protein:35, carbs:46, fat:14,
      ingredients:{en:['150g ground turkey','1 egg for binding','1 medium potato','Handful green beans','Sea salt, herbs'],ru:['150г фарша индейки','1 яйцо','1 картофель','Горсть стручковой фасоли','Соль, зелень']},
      prep:{en:['Mix turkey with egg, salt, herbs. Form patties.','Cook medium heat 4–5 min per side.','Boil potato, mash. Steam beans 5 min.'],ru:['Смешайте фарш с яйцом и зеленью.','Готовьте 4–5 мин с каждой стороны.','Пюре из картофеля. Фасоль на пару.']},
      note:{en:'Ground turkey is gentle to digest. Mashed potato is one of the most gut-friendly carbs. Green beans provide gentle fiber.',ru:'Фарш легче расщепляется. Пюре — один из самых мягких углеводов. Фасоль даёт мягкую клетчатку.'} },
  ],
  dinner: [
    { id:'steamed_tilapia', emoji:'🐠', name:{en:'Steamed Fish + Carrots + Rice',ru:'Рыба на пару с морковью'}, calories:330, protein:28, carbs:38, fat:6,
      ingredients:{en:['120g white fish fillet','2 medium carrots, sliced','⅓ cup white rice','Lemon juice, dill, sea salt'],ru:['120г белой рыбы','2 моркови','⅓ стак. риса','Лимон, укроп, соль']},
      prep:{en:['Steam fish over boiling water 8–10 min.','Steam carrots alongside 10–12 min.','Cook small portion of rice. Season with lemon and dill.'],ru:['Рыба на пару 8–10 мин.','Морковь рядом 10–12 мин.','Маленькая порция риса. Лимон и укроп.']},
      note:{en:'The lightest dinner. Ideal after a heavier lunch. Carrots soothe the gut wall overnight.',ru:'Самый лёгкий ужин. Идеален после тяжёлого обеда. Морковь успокаивает кишечник ночью.'} },
    { id:'turkey_buckwheat', emoji:'🥦', name:{en:'Turkey Breast + Zucchini + Buckwheat',ru:'Индейка с кабачком и гречкой'}, calories:360, protein:30, carbs:38, fat:8,
      ingredients:{en:['120g turkey breast','1 zucchini, sliced','⅓ cup buckwheat','Olive oil, sea salt, herbs'],ru:['120г индейки','1 кабачок','⅓ стак. гречки','Масло, соль, зелень']},
      prep:{en:['Cook turkey in salted water 15–18 min. Slice.','Steam or sauté zucchini 5 min.','Cook buckwheat in 2× water 15 min.'],ru:['Индейку отварить 15–18 мин.','Кабачок на пару или обжарить 5 мин.','Гречка 2× воды 15 мин.']},
      note:{en:'Turkey tryptophan converts to serotonin — supports your nervous system and sleep. Buckwheat magnesium eases muscle tension.',ru:'Триптофан индейки → серотонин, поддерживает нервную систему и сон. Магний гречки снимает мышечное напряжение.'} },
    { id:'soft_omelette', emoji:'🥚', name:{en:'Soft Omelette + Sautéed Spinach',ru:'Омлет со шпинатом'}, calories:295, protein:19, carbs:14, fat:18,
      ingredients:{en:['2 eggs','2 tbsp oat milk','Handful baby spinach','Olive oil, sea salt'],ru:['2 яйца','2 ст.л. овсяного молока','Горсть шпината','Оливковое масло, соль']},
      prep:{en:['Whisk eggs with milk and salt.','Cook in oiled pan low heat — fold gently.','Wilt spinach 1–2 min in same pan.'],ru:['Взбейте яйца с молоком и солью.','Готовьте на слабом огне — сложите аккуратно.','Шпинат в той же сковороде 1–2 мин.']},
      note:{en:'Quick on low-energy evenings. Spinach provides iron and magnesium for muscle relief and sleep quality.',ru:'Быстро в вечера без сил. Шпинат даёт железо и магний для снятия напряжения и сна.'} },
    { id:'light_broth_soup', emoji:'🥣', name:{en:'Light Chicken Broth Soup',ru:'Лёгкий куриный бульон'}, calories:220, protein:18, carbs:20, fat:6,
      ingredients:{en:['80g cooked chicken, shredded','500ml light chicken broth','1 carrot','2–3 potato cubes','Fresh dill, sea salt'],ru:['80г варёной курицы','500мл бульона','1 морковь','2–3 кубика картофеля','Укроп, соль']},
      prep:{en:['Heat broth. Add carrot and potato 12–15 min.','Add chicken. Heat through.','Finish with dill. No cream.'],ru:['Нагрейте бульон. Морковь и картофель 12–15 мин.','Добавьте курицу. Прогрейте.','Укроп. Без сливок.']},
      note:{en:'Most restorative evening option. Broth electrolytes rebalance water retention overnight.',ru:'Самый восстанавливающий вечерний вариант. Электролиты восстанавливают водный баланс ночью.'} },
    { id:'fish_stew', emoji:'🍛', name:{en:'White Fish Light Stew + Rice',ru:'Рагу из белой рыбы с рисом'}, calories:350, protein:32, carbs:40, fat:7,
      ingredients:{en:['130g white fish (cod or hake)','1 tomato diced','1 carrot sliced','½ cup white rice','Olive oil, bay leaf, parsley'],ru:['130г белой рыбы','1 помидор','1 морковь','½ стак. риса','Масло, лавровый лист, петрушка']},
      prep:{en:['Sauté carrot 3 min. Add tomato 3 min.','Add fish, bay leaf, 100ml water. Cover 10 min.','Season with salt and parsley. Serve over rice.'],ru:['Морковь 3 мин. Помидор ещё 3 мин.','Рыба, лавр, 100мл воды. Накрыть 10 мин.','Посолить, петрушка. Подать с рисом.']},
      note:{en:'Cooked tomato is rich in lycopene — anti-inflammatory. Warming without being heavy. Perfect for cold or stressful days.',ru:'Варёный помидор богат ликопином. Согревает, не утяжеляя. Идеально в холодные или стрессовые дни.'} },
  ],
  snack: [
    { id:'chamomile_rice_cakes', emoji:'🍵', name:{en:'Chamomile Tea + Rice Cakes',ru:'Ромашковый чай + хлебцы'}, calories:110, protein:2, carbs:22, fat:1,
      ingredients:{en:['2 unsalted rice cakes','1 cup chamomile tea (no sugar)'],ru:['2 рисовых хлебца','1 чашка ромашкового чая (без сахара)']},
      prep:{en:['Brew chamomile 5 min. Enjoy slowly.'],ru:['Заварите ромашку 5 мин. Пейте медленно.']},
      note:{en:'Chamomile is clinically anti-spasmodic — relaxes intestinal muscles, reduces bloating and gas.',ru:'Ромашка клинически антиспазматична — расслабляет мышцы кишечника, снижает вздутие.'} },
    { id:'banana', emoji:'🍌', name:{en:'Ripe Banana',ru:'Спелый банан'}, calories:105, protein:1, carbs:27, fat:0,
      ingredients:{en:['1 ripe banana (brown spots = more digestible)'],ru:['1 спелый банан (с пятнами = более усвояемый)']},
      prep:{en:['Eat as is. Always choose ripe — underripe causes bloating.'],ru:['Ешьте как есть. Только спелый — недозрелый вызывает вздутие.']},
      note:{en:'Potassium counteracts sodium and reduces water retention. Provides serotonin precursors.',ru:'Калий нейтрализует натрий. Содержит предшественники серотонина.'} },
    { id:'soaked_almonds', emoji:'🌰', name:{en:'12 Soaked Almonds',ru:'12 замоченных миндалин'}, calories:120, protein:4, carbs:4, fat:10,
      ingredients:{en:['12 raw almonds','Soak in water overnight or 4+ hours'],ru:['12 сырых миндалин','Замочить на ночь или 4+ часа']},
      prep:{en:['Drain soaked almonds. Optionally peel. Eat slowly.'],ru:['Слить воду. Очистить по желанию. Есть медленно.']},
      note:{en:'Soaking removes phytic acid — dramatically improving magnesium absorption. Magnesium relieves neck and back muscle tension.',ru:'Замачивание убирает фитиновую кислоту — улучшает усвоение магния. Магний снимает напряжение мышц.'} },
    { id:'soft_pear', emoji:'🍐', name:{en:'Soft Ripe Pear',ru:'Мягкая спелая груша'}, calories:85, protein:1, carbs:22, fat:0,
      ingredients:{en:['1 ripe pear (soft to touch)'],ru:['1 спелая груша (мягкая)']},
      prep:{en:['Eat ripe only. Warm in microwave 30 sec on sluggish days.'],ru:['Только спелую. Нагреть 30 сек при вялом пищеварении.']},
      note:{en:'Pear contains sorbitol — a gentle natural laxative. Best snack on irregular bowel movement days.',ru:'Груша содержит сорбитол — мягкое слабительное. Лучший перекус при нерегулярном стуле.'} },
  ],
};

const WEEK_ROTATION = [
  { b:'scrambled_eggs',    l:'chicken_sweet_potato', d:'steamed_tilapia',  s:'banana' },          // Sun
  { b:'oat_porridge',      l:'cod_rice_zucchini',    d:'turkey_buckwheat', s:'chamomile_rice_cakes' }, // Mon
  { b:'scrambled_eggs',    l:'chicken_sweet_potato', d:'steamed_tilapia',  s:'banana' },          // Tue
  { b:'buckwheat_porridge',l:'turkey_patties',       d:'fish_stew',        s:'soaked_almonds' },  // Wed
  { b:'chia_pudding',      l:'salmon_quinoa',        d:'light_broth_soup', s:'soft_pear' },       // Thu
  { b:'detox_smoothie',    l:'cod_rice_zucchini',    d:'soft_omelette',    s:'chamomile_rice_cakes' }, // Fri
  { b:'oat_porridge',      l:'chicken_soup',         d:'turkey_buckwheat', s:'banana' },          // Sat
];

function getMeal(type, id) { return MEALS[type]?.find(m => m.id === id) || MEALS[type][0]; }
function getAlts(type, id) { return MEALS[type].filter(m => m.id !== id).slice(0,3); }
function todayKey() { return new Date().toISOString().split('T')[0]; }

function calcTDEE({ weight=65, height=167, age=44, activityLevel='light' }) {
  const bmr = 10*weight + 6.25*height - 5*age - 161;
  const mult = { sedentary:1.2, light:1.375, moderate:1.55, active:1.725 };
  return Math.round(bmr * (mult[activityLevel] || 1.375));
}

// Weight projection per phase (avg daily kcal from plan)
const PHASE_KCAL = { 'Week 1':1380, 'Week 2':1430, 'Week 3':1470, 'Stabilization I':1560, 'Stabilization II':1650 };

function getTodayDayIdx() {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1;
}

// ─── Meal Detail Overlay ──────────────────────────────────────────────────────

function MealDetail({ type, mealId, lang:L, onClose, onSwap }) {
  const meal = getMeal(type, mealId);
  const alts  = getAlts(type, mealId);
  const [showSwap, setShowSwap] = useState(false);
  if (!meal) return null;

  const typeColors = {
    breakfast: { bg:'#fef9ee', border:'#f0d080' },
    lunch:     { bg:'#f0f7ee', border:'#90c880' },
    dinner:    { bg:'#f4f0fa', border:'#b090d0' },
    snack:     { bg:'#fdf0f8', border:'#e0a0d0' },
  };
  const tc = typeColors[type] || typeColors.breakfast;

  return createPortal(
    <div style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(45,37,24,0.55)', display:'flex', alignItems:'flex-end' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background:'#fdfaf7', borderRadius:'24px 24px 0 0', width:'100%', maxHeight:'88vh', overflowY:'auto', animation:'slideUp 0.28s ease' }}>
        <style>{`@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>

        {/* Header */}
        <div style={{ padding:'20px 20px 14px', background:tc.bg, borderBottom:`1px solid ${tc.border}`, borderRadius:'24px 24px 0 0', position:'sticky', top:0 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
              <span style={{ fontSize:'28px' }}>{meal.emoji}</span>
              <div>
                <p style={{ fontFamily:"'Lora',serif", fontSize:'17px', fontWeight:500, color:'#2d2518' }}>{meal.name[L]}</p>
                <p style={{ fontFamily:"'Inter',sans-serif", fontSize:'12px', color:'#9a8870' }}>
                  {meal.calories} kcal · {meal.protein}g {L==='en'?'protein':'белка'} · {meal.carbs}g {L==='en'?'carbs':'углев.'} · {meal.fat}g {L==='en'?'fat':'жиров'}
                </p>
              </div>
            </div>
            <button onClick={onClose} style={{ background:'none', border:'none', fontSize:'22px', cursor:'pointer', color:'#9a8870', padding:'4px' }}>✕</button>
          </div>
        </div>

        <div style={{ padding:'20px', display:'flex', flexDirection:'column', gap:'16px' }}>

          {/* Why good for you */}
          <div style={{ background:'#f0f8f0', border:'1px solid #c0d8c0', borderRadius:'12px', padding:'12px 14px' }}>
            <p style={{ fontFamily:"'Inter',sans-serif", fontSize:'11px', fontWeight:600, color:'#5a8a4a', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'4px' }}>
              🌿 {L==='en'?'Why this is good for you':'Почему это полезно'}
            </p>
            <p style={{ fontFamily:"'Inter',sans-serif", fontSize:'13px', color:'#3a2e22', lineHeight:1.6 }}>{meal.note[L]}</p>
          </div>

          {/* Ingredients */}
          <div>
            <p style={{ fontFamily:"'Inter',sans-serif", fontSize:'11px', fontWeight:600, color:'#8b7355', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'10px' }}>
              🧂 {L==='en'?'Ingredients':'Ингредиенты'}
            </p>
            {meal.ingredients[L].map((item,i) => (
              <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'10px', marginBottom:'8px' }}>
                <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#c4a882', flexShrink:0, marginTop:'6px' }} />
                <p style={{ fontFamily:"'Inter',sans-serif", fontSize:'13px', color:'#3a2e22', lineHeight:1.5 }}>{item}</p>
              </div>
            ))}
          </div>

          {/* Preparation */}
          <div>
            <p style={{ fontFamily:"'Inter',sans-serif", fontSize:'11px', fontWeight:600, color:'#8b7355', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'10px' }}>
              👩‍🍳 {L==='en'?'How to prepare':'Как приготовить'}
            </p>
            {meal.prep[L].map((step,i) => (
              <div key={i} style={{ display:'flex', gap:'12px', marginBottom:'10px' }}>
                <span style={{ width:'22px', height:'22px', borderRadius:'50%', background:'#8b7355', color:'#fff', fontFamily:"'Inter',sans-serif", fontSize:'12px', fontWeight:600, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{i+1}</span>
                <p style={{ fontFamily:"'Inter',sans-serif", fontSize:'13px', color:'#3a2e22', lineHeight:1.6, paddingTop:'2px' }}>{step}</p>
              </div>
            ))}
          </div>

          {/* Swap options */}
          {alts.length > 0 && (
            <div>
              <button onClick={() => setShowSwap(!showSwap)} style={{ width:'100%', padding:'11px', borderRadius:'12px', border:'1.5px solid #ede8e2', background:showSwap?'#f5f0eb':'#fff', fontFamily:"'Inter',sans-serif", fontSize:'13px', color:'#8b7355', cursor:'pointer' }}>
                🔄 {L==='en'?`Swap this ${type}`:`Заменить ${type==='breakfast'?'завтрак':type==='lunch'?'обед':type==='dinner'?'ужин':'перекус'}`}
                {showSwap ? ' ▲' : ' ▼'}
              </button>
              {showSwap && (
                <div style={{ marginTop:'10px', display:'flex', flexDirection:'column', gap:'8px' }}>
                  {alts.map(alt => (
                    <button key={alt.id} onClick={() => { onSwap(alt.id); onClose(); }}
                      style={{ display:'flex', alignItems:'center', gap:'12px', padding:'12px 14px', borderRadius:'12px', border:'1px solid #ede8e2', background:'#fff', cursor:'pointer', textAlign:'left' }}>
                      <span style={{ fontSize:'22px' }}>{alt.emoji}</span>
                      <div>
                        <p style={{ fontFamily:"'Inter',sans-serif", fontSize:'13px', fontWeight:500, color:'#2d2518' }}>{alt.name[L]}</p>
                        <p style={{ fontFamily:"'Inter',sans-serif", fontSize:'11px', color:'#9a8870' }}>{alt.calories} kcal · {alt.protein}g {L==='en'?'protein':'белка'}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
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

// ─── Sub-tab: Today's Meals ───────────────────────────────────────────────────

function TodayMeals({ lang:L, profile, setProfile }) {
  const dayOfWeek = new Date().getDay();
  const [plan, setPlan] = useState(() => {
    try { const s = SS.get(`dba_plan_${todayKey()}`); return s ? JSON.parse(s) : WEEK_ROTATION[dayOfWeek]; }
    catch { return WEEK_ROTATION[dayOfWeek]; }
  });
  const [expandedMeal, setExpandedMeal] = useState(null);
  const [logged, setLogged] = useState(() => {
    try { const s = SS.get(`dba_logged_${todayKey()}`); return s ? JSON.parse(s) : {}; }
    catch { return {}; }
  });
  const [editingProfile, setEditingProfile] = useState(false);
  const [form, setForm] = useState({ weight: String(profile.weight), height: String(profile.height), age: String(profile.age), activityLevel: profile.activityLevel });

  const tdee = calcTDEE(profile);
  const targetCal = Math.max(1380, Math.round(tdee * 0.88));

  const mealConfigs = [
    { key:'b', type:'breakfast', label:L==='en'?'Breakfast':'Завтрак',        time:'7:00–8:00',  colors:{ bg:'#fef9ee', border:'#f0d080' } },
    { key:'s', type:'snack',     label:L==='en'?'Snack':'Перекус',            time:'10:30–11:00',colors:{ bg:'#fdf0f8', border:'#e0a0d0' } },
    { key:'l', type:'lunch',     label:L==='en'?'Lunch':'Обед',               time:'12:30–13:30',colors:{ bg:'#f0f7ee', border:'#90c880' } },
    { key:'d', type:'dinner',    label:L==='en'?'Dinner':'Ужин',              time:'18:30–19:30',colors:{ bg:'#f4f0fa', border:'#b090d0' } },
  ];

  const totalCal = mealConfigs.reduce((sum, mc) => {
    const m = getMeal(mc.type, plan[mc.key]);
    return sum + (m?.calories || 0);
  }, 0);

  function logMeal(key) {
    const next = { ...logged, [key]: true };
    setLogged(next);
    SS.set(`dba_logged_${todayKey()}`, JSON.stringify(next));
  }

  function swapMeal(type, key, newId) {
    const next = { ...plan, [key]: newId };
    setPlan(next);
    SS.set(`dba_plan_${todayKey()}`, JSON.stringify(next));
  }

  function saveProfile() {
    const p = { weight: parseFloat(form.weight)||65, height: parseFloat(form.height)||167, age: parseInt(form.age)||44, activityLevel: form.activityLevel };
    setProfile(p);
    SS.set('dba_nutrition_profile', JSON.stringify(p));
    setEditingProfile(false);
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>

      {/* Profile bar */}
      <div style={{ background:'#fff', border:'1px solid #ede8e2', borderRadius:'14px', padding:'12px 16px' }}>
        {editingProfile ? (
          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            <p style={{ fontFamily:"'Inter',sans-serif", fontSize:'12px', fontWeight:600, color:'#8b7355' }}>Update your stats</p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'8px' }}>
              {[{k:'weight',l:'Weight (kg)'},{k:'height',l:'Height (cm)'},{k:'age',l:'Age'}].map(({k,l}) => (
                <div key={k}>
                  <p style={{ fontFamily:"'Inter',sans-serif", fontSize:'10px', color:'#9a8870', marginBottom:'4px' }}>{l}</p>
                  <input type="number" value={form[k]} onChange={e => setForm({...form,[k]:e.target.value})}
                    style={{ width:'100%', padding:'8px', borderRadius:'8px', border:'1px solid #ede8e2', fontFamily:"'Inter',sans-serif", fontSize:'14px', color:'#2d2518', boxSizing:'border-box', textAlign:'center' }} />
                </div>
              ))}
            </div>
            <div style={{ display:'flex', gap:'8px' }}>
              {['sedentary','light','moderate','active'].map(a => (
                <button key={a} onClick={() => setForm({...form, activityLevel:a})}
                  style={{ flex:1, padding:'6px', borderRadius:'8px', border:`1px solid ${form.activityLevel===a?'#8b7355':'#ede8e2'}`, background:form.activityLevel===a?'#8b7355':'#fff', color:form.activityLevel===a?'#fff':'#8b7355', fontFamily:"'Inter',sans-serif", fontSize:'10px', cursor:'pointer' }}>
                  {a}
                </button>
              ))}
            </div>
            <div style={{ display:'flex', gap:'8px' }}>
              <button onClick={saveProfile} style={{ flex:1, padding:'10px', borderRadius:'10px', background:'#8b7355', color:'#fff', border:'none', fontFamily:"'Inter',sans-serif", fontSize:'13px', cursor:'pointer' }}>Save</button>
              <button onClick={() => setEditingProfile(false)} style={{ padding:'10px 16px', borderRadius:'10px', background:'#fff', color:'#8b7355', border:'1px solid #ede8e2', fontFamily:"'Inter',sans-serif", fontSize:'13px', cursor:'pointer' }}>Cancel</button>
            </div>
          </div>
        ) : (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:'12px', fontWeight:600, color:'#2d2518' }}>
                {profile.weight}kg · {profile.height}cm · {profile.age}y · {profile.activityLevel}
              </p>
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:'11px', color:'#9a8870', marginTop:'2px' }}>
                TDEE: {tdee} kcal · Target: {targetCal} kcal/day
              </p>
            </div>
            <button onClick={() => setEditingProfile(true)} style={{ padding:'6px 12px', borderRadius:'10px', border:'1px solid #ede8e2', background:'#fdf9f5', color:'#8b7355', fontFamily:"'Inter',sans-serif", fontSize:'11px', cursor:'pointer' }}>Edit</button>
          </div>
        )}
      </div>

      {/* Calorie tracker */}
      <div style={{ background:'#fff', border:'1px solid #ede8e2', borderRadius:'14px', padding:'12px 16px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px' }}>
          <p style={{ fontFamily:"'Inter',sans-serif", fontSize:'12px', fontWeight:500, color:'#4a3825' }}>
            {L==='en'?"Today's calories":'Калории сегодня'}
          </p>
          <p style={{ fontFamily:"'Inter',sans-serif", fontSize:'13px', color:totalCal <= targetCal ? '#5a8a4a' : '#c07030', fontWeight:600 }}>
            {totalCal} / {targetCal} kcal
          </p>
        </div>
        <div style={{ height:'6px', borderRadius:'3px', background:'#ede8e2', overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${Math.min(100, (totalCal/targetCal)*100)}%`, background:totalCal<=targetCal?'#7ab870':'#c07030', borderRadius:'3px', transition:'width 0.4s' }} />
        </div>
      </div>

      {/* Meal cards */}
      {mealConfigs.map(mc => {
        const meal = getMeal(mc.type, plan[mc.key]);
        if (!meal) return null;
        const isLogged = !!logged[mc.key];
        return (
          <div key={mc.key} style={{ background:mc.colors.bg, border:`1px solid ${mc.colors.border}`, borderRadius:'14px', padding:'14px 16px' }}>
            <div style={{ display:'flex', alignItems:'flex-start', gap:'12px' }}>
              <span style={{ fontSize:'26px', lineHeight:1 }}>{meal.emoji}</span>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'2px' }}>
                  <p style={{ fontFamily:"'Inter',sans-serif", fontSize:'11px', fontWeight:600, color:'#8b7355', textTransform:'uppercase', letterSpacing:'0.06em' }}>{mc.label}</p>
                  <span style={{ fontFamily:"'Inter',sans-serif", fontSize:'11px', color:'#b0a090' }}>· {mc.time}</span>
                </div>
                <p style={{ fontFamily:"'Lora',serif", fontSize:'15px', fontWeight:500, color:'#2d2518', marginBottom:'4px' }}>{meal.name[L]}</p>
                <p style={{ fontFamily:"'Inter',sans-serif", fontSize:'11px', color:'#9a8870' }}>
                  {meal.calories} kcal · {meal.protein}g {L==='en'?'protein':'белка'}
                </p>
              </div>
              {isLogged && <span style={{ fontSize:'18px' }}>✅</span>}
            </div>
            <div style={{ display:'flex', gap:'8px', marginTop:'12px' }}>
              <button onClick={() => setExpandedMeal({ type:mc.type, key:mc.key, mealId:plan[mc.key] })}
                style={{ flex:1, padding:'9px', borderRadius:'10px', background:'#fff', border:`1px solid ${mc.colors.border}`, fontFamily:"'Inter',sans-serif", fontSize:'12px', color:'#5a4535', cursor:'pointer', fontWeight:500 }}>
                {L==='en'?'Details 📖':'Детали 📖'}
              </button>
              {!isLogged && (
                <button onClick={() => logMeal(mc.key)}
                  style={{ padding:'9px 14px', borderRadius:'10px', background:'#8b7355', border:'none', fontFamily:"'Inter',sans-serif", fontSize:'12px', color:'#fff', cursor:'pointer' }}>
                  {L==='en'?'Log ✓':'Отметить ✓'}
                </button>
              )}
            </div>
          </div>
        );
      })}

      {/* Detail overlay */}
      {expandedMeal && (
        <MealDetail
          type={expandedMeal.type}
          mealId={expandedMeal.mealId}
          lang={L}
          onClose={() => setExpandedMeal(null)}
          onSwap={newId => { swapMeal(expandedMeal.type, expandedMeal.key, newId); setExpandedMeal(null); }}
        />
      )}
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
      {subTab === 'today'    && <TodayMeals lang={L} profile={profile} setProfile={setProfile} />}
      {subTab === 'progress' && <Progress lang={L} profile={profile} />}
    </div>
  );
}
