/**
 * DietPlan.jsx
 * Personalized weekly diet plan for Ani — adapted for 65kg / 167cm / 44 years old.
 * Based on original clean-eating plan (translated from Armenian).
 * 5 phases: Week 1, Week 2, Week 3, Stabilization I, Stabilization II
 */

import { useState } from 'react';

// ─── Meal Data (translated from Armenian, portions adapted for 65kg/167cm/44y) ────

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAYS_FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const PLAN = {
  'Week 1': [
    // Monday
    {
      waterAM:     'Drink 500ml room-temperature water slowly right after waking up',
      breakfast:   '1 boiled egg · ½ cucumber (chopped) · fresh dill · season with black pepper · 1 crispbread',
      waterMid:    '500ml water — 1 hour before lunch',
      lunch:       'Boiled chicken breast fillet (100g) · fresh shredded carrot & cabbage salad (150g) · season with lemon juice + ½ tsp olive oil',
      waterAfter:  '300ml water — 1 hour after lunch',
      snack:       '1 tangerine · 3 almonds',
      waterEve:    '500ml water',
      dinner:      'Steamed spinach (160g) · season with paprika · 2 tbsp yogurt on the side',
    },
    // Tuesday
    {
      waterAM:     'Drink 500ml room-temperature water slowly right after waking up',
      breakfast:   '1 medium apple (chopped) · 90g cottage cheese · 2 tsp pumpkin seeds',
      waterMid:    '300ml water — 2 hours after breakfast',
      lunch:       '60g pre-soaked bulgur · arugula · 100g lean beef pieces · tomato & cucumber fresh salad (200g) · olive oil · black pepper',
      waterAfter:  '500ml water — 1 hour after lunch',
      snack:       '1 cup green tea',
      waterEve:    '500ml water',
      dinner:      'Fresh salad: carrot & broccoli (120g) + lemon juice · grilled or oven-baked chicken breast (100g)',
    },
    // Wednesday
    {
      waterAM:     'Drink 500ml room-temperature water slowly right after waking up',
      breakfast:   'Cooked oatmeal (90g) · ½ orange (chopped) · 1 tsp chia seeds · 4 almonds grated (pre-soaked)',
      waterMid:    '400ml water — 2 hours before lunch',
      lunch:       '70g cooked buckwheat · fresh salad: tomato, cucumber, arugula, mixed greens · a little olive oil',
      waterAfter:  '400ml water — 1 hour after lunch',
      snack:       '1 cup warm berry tea (sugar-free)',
      waterEve:    '500ml water',
      dinner:      '130g cooked lean beef · chopped dill + tomato + green pepper · season to taste',
    },
    // Thursday
    {
      waterAM:     'Drink 500ml room-temperature water slowly right after waking up',
      breakfast:   'Tomato omelet (1 egg) · 1 slice rye bread',
      waterMid:    '400ml water — 1 hour before lunch',
      lunch:       'Steamed cauliflower (180g) with diced tomato, white onion & chopped parsley',
      waterAfter:  '400ml water — 1 hour after lunch',
      snack:       '1 cup tea or coffee · 1 piece dark chocolate (80%)',
      waterEve:    '500ml water',
      dinner:      'Oven-baked chicken breast (100g) · oven-baked broccoli florets (90g) · black pepper',
    },
    // Friday
    {
      waterAM:     'Drink 500ml room-temperature water slowly right after waking up',
      breakfast:   'Overnight chia pudding: 1 cup kefir or yogurt + 60g berries + 2 tsp chia seeds + 1 tsp pumpkin seeds · prepare the night before, serve cold',
      waterMid:    '300ml water — 1 hour before lunch',
      lunch:       'Oven-baked chicken breast (100g) · oven-baked broccoli (130g) · season with black pepper',
      waterAfter:  '500ml water — 1 hour after lunch',
      snack:       '1 tangerine (around 15:00–16:00)',
      waterEve:    '500ml water',
      dinner:      '2 medium tomatoes stuffed with cooked quinoa (60g) · chopped dill',
    },
    // Saturday
    {
      waterAM:     'Drink 500ml room-temperature water slowly right after waking up',
      breakfast:   '1 crispbread · 2 cherry tomatoes + herbs · 1-egg omelet · season with black pepper',
      waterMid:    '500ml water — 2 hours after breakfast',
      lunch:       '"Green Salad": arugula or lettuce · shredded half-cooked zucchini · carrot · pre-soaked bulgur or buckwheat · olive oil',
      waterAfter:  '500ml water — 1 hour after lunch',
      snack:       '1 prune · 1 cup green tea',
      waterEve:    '500ml water',
      dinner:      'Oven-baked chicken breast (165g) · 1 oven-baked tomato · chopped parsley',
    },
    // Sunday
    {
      waterAM:     'Drink 500ml room-temperature water slowly right after waking up',
      breakfast:   'Detox smoothie 🍹: blend ½ kiwi + fresh spinach or parsley + ½ green apple juice + 2 tsp chia seeds + 200ml water',
      waterMid:    '500ml water — 2 hours after breakfast',
      lunch:       'Fresh salad: broccoli florets + cherry tomatoes + shredded carrot + cucumber · grilled or boiled chicken breast (100g) · lemon juice',
      waterAfter:  '500ml water — 1 hour after lunch',
      snack:       '1 prune · 1 cup coffee or tea',
      waterEve:    '500ml water — 2 hours before dinner',
      dinner:      'Red lentil purée (165g) · season to taste · dried basil leaves',
    },
  ],

  'Week 2': [
    // Monday
    {
      waterAM:     'Drink 500ml room-temperature water slowly right after waking up',
      breakfast:   '1-egg omelet (cooked in coconut oil or olive oil) · ½ mashed avocado · diced tomato · 1 slice rye bread · chopped herbs',
      waterMid:    '400ml water (with mint leaves + 1 tsp chia seeds) — 2 hours after breakfast, then 500ml water 1 hour before lunch',
      lunch:       'Fresh salad: carrot + green peas + tomato + broccoli (lemon juice or balsamic vinegar, 150g) · 70g cooked buckwheat',
      waterAfter:  '500ml water — 1 hour after lunch',
      snack:       '1 small chopped apple',
      waterEve:    '500ml water',
      dinner:      'Oven-baked broccoli florets · grilled fish (140g) · dried lemon · drizzle of lemon juice',
    },
    // Tuesday
    {
      waterAM:     'Drink 500ml room-temperature water slowly right after waking up',
      breakfast:   'Cooked oatmeal (90g) · ½ pear (chopped) · 2 tsp chia + 1 tsp pumpkin seeds · 3–4 almonds (pre-soaked) · grated piece of dark chocolate',
      waterMid:    '400ml water — 2 hours after breakfast',
      lunch:       'Steamed spinach with 1 egg (175g) · ½ chopped tomato · 1 tbsp yogurt · ground red pepper',
      waterAfter:  '500ml water — 1 hour after lunch',
      snack:       '1 cup tea or coffee (no sugar) · 1 date or 1 piece dark chocolate (80%)',
      waterEve:    '500ml water',
      dinner:      'Grilled chicken breast (120g) · lemon juice · steamed broccoli florets (130g)',
    },
    // Wednesday
    {
      waterAM:     'Drink 500ml room-temperature water slowly right after waking up',
      breakfast:   '1 boiled egg · fresh herbs · season with black pepper · 1 crispbread',
      waterMid:    '400ml water — 1 hour before lunch',
      lunch:       'Grilled or oven-baked salmon fillet (130g) · fresh salad: tomato, cucumber, parsley (130g) · 1 tsp olive oil',
      waterAfter:  '400ml water — 1 hour after lunch',
      snack:       '1 cup chamomile or berry tea',
      waterEve:    '500ml water',
      dinner:      'Steamed or oven-baked cauliflower (200g) with chopped tomato, parsley & yogurt sauce (2 tbsp yogurt + garlic + dill)',
    },
    // Thursday
    {
      waterAM:     'Drink 500ml room-temperature water slowly right after waking up',
      breakfast:   'Detox smoothie 🍹: ½ kiwi + spinach + ½ green apple + 1 tsp chia seeds + 200ml water',
      waterMid:    '500ml water — 1 hour before lunch',
      lunch:       'Oven-baked chicken breast (100g) · oven-baked zucchini & sweet pepper (150g) · season with herbs',
      waterAfter:  '400ml water — 1 hour after lunch',
      snack:       '90g cottage cheese · 1 tsp honey · 3 walnuts',
      waterEve:    '500ml water',
      dinner:      '60g cooked buckwheat or quinoa · steamed broccoli (100g) · 1 boiled egg · lemon squeeze',
    },
    // Friday
    {
      waterAM:     'Drink 500ml room-temperature water slowly right after waking up',
      breakfast:   'Overnight chia pudding: kefir + 60g mixed berries + 2 tsp chia + 1 tsp pumpkin seeds · serve cold',
      waterMid:    '400ml water — 2 hours after breakfast',
      lunch:       'Lean beef stew (100g) with diced tomato, carrot & parsley (no oil) · 70g cooked buckwheat on the side',
      waterAfter:  '500ml water — 1 hour after lunch',
      snack:       '1 tangerine or a small apple',
      waterEve:    '500ml water',
      dinner:      'Grilled or baked white fish (130g) · steamed asparagus or green beans (120g) · lemon juice',
    },
    // Saturday
    {
      waterAM:     'Drink 500ml room-temperature water slowly right after waking up',
      breakfast:   'Oatmeal (90g) with 60g mixed berries · 1 tsp chia seeds · 3 almonds · pinch of cinnamon',
      waterMid:    '500ml water — 2 hours after breakfast',
      lunch:       '"Power Bowl": 70g cooked buckwheat + shredded chicken breast (100g) + cucumber + tomato + arugula · olive oil & lemon dressing',
      waterAfter:  '500ml water — 1 hour after lunch',
      snack:       '1 prune · 1 cup green tea',
      waterEve:    '500ml water',
      dinner:      'Baked chicken breast (165g) · oven-baked cherry tomatoes + zucchini · fresh herbs',
    },
    // Sunday
    {
      waterAM:     'Drink 500ml room-temperature water slowly right after waking up',
      breakfast:   '1 egg omelet with spinach & tomato · 1 slice rye bread · fresh herbs',
      waterMid:    '500ml water — 2 hours after breakfast',
      lunch:       'Steamed salmon (130g) · quinoa (60g) · fresh cucumber & tomato salad · lemon juice',
      waterAfter:  '500ml water — 1 hour after lunch',
      snack:       '1 cup herbal tea · 1 piece dark chocolate (80%)',
      waterEve:    '500ml water',
      dinner:      'Red lentil soup (180g) with fresh parsley · season with cumin & turmeric',
    },
  ],

  'Week 3': [
    // Monday
    {
      waterAM:     'Drink 500ml room-temperature water slowly right after waking up',
      breakfast:   'Overnight oats: 80g oats + 150ml kefir + 1 tsp chia seeds + ½ banana (mashed) + 3 almonds · prepare night before',
      waterMid:    '400ml water — 2 hours after breakfast',
      lunch:       'Grilled chicken breast (100g) · fresh salad: arugula + cherry tomatoes + cucumber + shredded carrot · olive oil & lemon',
      waterAfter:  '400ml water — 1 hour after lunch',
      snack:       '1 small apple · 3 walnuts',
      waterEve:    '500ml water',
      dinner:      'Steamed broccoli & cauliflower (200g) · 1 boiled egg · season with black pepper & lemon',
    },
    // Tuesday
    {
      waterAM:     'Drink 500ml room-temperature water slowly right after waking up',
      breakfast:   'Detox smoothie 🍹: ½ kiwi + fresh spinach + ½ green apple + 1 tsp chia + 200ml water · 1 crispbread',
      waterMid:    '400ml water — 1 hour before lunch',
      lunch:       '70g cooked quinoa · steamed zucchini & sweet pepper (150g) · chopped parsley · olive oil',
      waterAfter:  '500ml water — 1 hour after lunch',
      snack:       '90g low-fat yogurt · 1 tsp pumpkin seeds',
      waterEve:    '500ml water',
      dinner:      'Grilled white fish (140g) · oven-baked cherry tomatoes · lemon + fresh herbs',
    },
    // Wednesday
    {
      waterAM:     'Drink 500ml room-temperature water slowly right after waking up',
      breakfast:   '2 boiled eggs · sliced tomato & cucumber · dill & parsley · 1 crispbread',
      waterMid:    '500ml water — 1 hour before lunch',
      lunch:       'Lean beef & vegetable soup (200ml) with carrot, celery & parsley (no potatoes) · 60g rye bread',
      waterAfter:  '400ml water — 1 hour after lunch',
      snack:       '1 cup green tea · 1 prune',
      waterEve:    '500ml water',
      dinner:      'Baked chicken breast (100g) with Dijon mustard · steamed green beans (120g)',
    },
    // Thursday
    {
      waterAM:     'Drink 500ml room-temperature water slowly right after waking up',
      breakfast:   'Chia pudding (prepared night before): kefir + 60g berries + 2 tsp chia + 1 tsp pumpkin seeds',
      waterMid:    '400ml water — 2 hours before lunch',
      lunch:       'Baked salmon (130g) · 60g cooked buckwheat · fresh cucumber & arugula salad · lemon',
      waterAfter:  '400ml water — 1 hour after lunch',
      snack:       '1 tangerine · 3 almonds',
      waterEve:    '500ml water',
      dinner:      'Stuffed bell pepper (1 medium) with lean ground turkey (80g) + cooked brown rice (50g) · baked in oven',
    },
    // Friday
    {
      waterAM:     'Drink 500ml room-temperature water slowly right after waking up',
      breakfast:   'Oatmeal (90g) · 1 tsp honey · 60g fresh berries · 4 almonds · pinch of cinnamon',
      waterMid:    '300ml water — 1 hour before lunch',
      lunch:       'Grilled chicken breast (100g) · roasted sweet potato (100g) · steamed broccoli · herbs',
      waterAfter:  '500ml water — 1 hour after lunch',
      snack:       '1 cup herbal tea (sugar-free)',
      waterEve:    '500ml water',
      dinner:      'Tomato & spinach egg white omelet (2 egg whites) · 1 slice rye bread',
    },
    // Saturday
    {
      waterAM:     'Drink 500ml room-temperature water slowly right after waking up',
      breakfast:   '1 avocado toast on rye bread · ½ mashed avocado + lemon + black pepper · 1 poached egg on top',
      waterMid:    '500ml water — 2 hours after breakfast',
      lunch:       '"Rainbow Bowl": 70g cooked quinoa + grilled chicken (100g) + beet (shredded, 50g) + carrot + cucumber + parsley · lemon & olive oil',
      waterAfter:  '500ml water — 1 hour after lunch',
      snack:       '1 prune · 1 cup green tea',
      waterEve:    '500ml water',
      dinner:      'Baked white fish (140g) · steamed asparagus or zucchini (120g) · lemon & dill',
    },
    // Sunday
    {
      waterAM:     'Drink 500ml room-temperature water slowly right after waking up',
      breakfast:   'Greek yogurt bowl: 120g Greek yogurt + 60g berries + 1 tsp chia + 3 crushed almonds + ½ tsp honey',
      waterMid:    '500ml water — 2 hours after breakfast',
      lunch:       'Lentil & vegetable soup (200ml) with tomato, carrot & cumin · 1 crispbread',
      waterAfter:  '500ml water — 1 hour after lunch',
      snack:       '1 cup chamomile tea · 1 piece dark chocolate (80%)',
      waterEve:    '500ml water',
      dinner:      'Grilled chicken breast (165g) · oven-baked mixed vegetables (zucchini, bell pepper, onion) · fresh parsley',
    },
  ],

  'Stabilization I': [
    // Monday
    {
      waterAM:     'Drink 500ml room-temperature water slowly right after waking up',
      breakfast:   '2 boiled eggs · sliced cucumber + tomato · fresh herbs · 1 crispbread · black coffee or green tea',
      waterMid:    '400ml water — 2 hours after breakfast',
      lunch:       'Chicken breast (120g) · 80g cooked buckwheat or quinoa · large green salad with olive oil & lemon',
      waterAfter:  '400ml water — 1 hour after lunch',
      snack:       '1 small apple · 5 almonds',
      waterEve:    '500ml water',
      dinner:      'Baked salmon (140g) · steamed broccoli (150g) · lemon & dill',
    },
    // Tuesday
    {
      waterAM:     'Drink 500ml room-temperature water slowly right after waking up',
      breakfast:   'Oatmeal (100g) · 80g mixed berries · 1 tsp chia seeds · 4 almonds · pinch of cinnamon',
      waterMid:    '400ml water — 2 hours after breakfast',
      lunch:       'Lean beef (110g) · 70g cooked buckwheat · fresh salad: tomato, cucumber, parsley · black pepper',
      waterAfter:  '500ml water — 1 hour after lunch',
      snack:       '1 cup green tea · 1 date',
      waterEve:    '500ml water',
      dinner:      'Steamed chicken fillet (120g) · oven-baked zucchini & cherry tomatoes · fresh herbs',
    },
    // Wednesday
    {
      waterAM:     'Drink 500ml room-temperature water slowly right after waking up',
      breakfast:   'Chia pudding with berries (prepared night before) · or Greek yogurt (120g) + 1 tsp honey + 3 walnuts',
      waterMid:    '400ml water — 2 hours before lunch',
      lunch:       'Baked white fish (140g) · 70g cooked brown rice · cucumber & arugula salad · lemon',
      waterAfter:  '400ml water — 1 hour after lunch',
      snack:       '1 tangerine · 3 almonds',
      waterEve:    '500ml water',
      dinner:      'Turkey meatballs (120g) baked in oven · steamed cauliflower (150g) · chopped parsley',
    },
    // Thursday
    {
      waterAM:     'Drink 500ml room-temperature water slowly right after waking up',
      breakfast:   'Detox smoothie 🍹: spinach + ½ green apple + ½ kiwi + 1 tsp chia + 200ml water · 1 crispbread',
      waterMid:    '500ml water — 1 hour before lunch',
      lunch:       'Chicken breast & vegetable stir-fry (no oil): broccoli, carrot, green beans (total 150g) + 80g buckwheat',
      waterAfter:  '400ml water — 1 hour after lunch',
      snack:       '90g cottage cheese · 1 tsp pumpkin seeds',
      waterEve:    '500ml water',
      dinner:      'Grilled salmon (140g) · steamed asparagus (120g) · lemon & black pepper',
    },
    // Friday
    {
      waterAM:     'Drink 500ml room-temperature water slowly right after waking up',
      breakfast:   '2-egg omelet with spinach & tomato (cooked in olive oil) · 1 slice rye bread',
      waterMid:    '400ml water — 2 hours after breakfast',
      lunch:       '"Power Plate": 100g grilled chicken + 70g quinoa + large salad (arugula, cucumber, cherry tomatoes) + olive oil',
      waterAfter:  '500ml water — 1 hour after lunch',
      snack:       '1 cup herbal tea · 1 prune',
      waterEve:    '500ml water',
      dinner:      'Baked white fish (130g) · steamed green beans (130g) · lemon & dill',
    },
    // Saturday
    {
      waterAM:     'Drink 500ml room-temperature water slowly right after waking up',
      breakfast:   'Overnight oats: 80g oats + 150ml kefir + ½ banana + 1 tsp chia + 3 almonds',
      waterMid:    '500ml water — 2 hours after breakfast',
      lunch:       'Lean beef goulash (120g, no oil) with diced carrot & celery · 70g buckwheat on the side',
      waterAfter:  '500ml water — 1 hour after lunch',
      snack:       '1 apple · 3 walnuts',
      waterEve:    '500ml water',
      dinner:      'Stuffed zucchini (2 halves) with lean ground turkey (80g) + tomato + herbs · baked in oven',
    },
    // Sunday
    {
      waterAM:     'Drink 500ml room-temperature water slowly right after waking up',
      breakfast:   'Greek yogurt (150g) · mixed berries (80g) · 1 tsp honey · 1 tsp chia seeds · 4 almonds',
      waterMid:    '500ml water — 2 hours after breakfast',
      lunch:       'Baked salmon (150g) · 70g cooked quinoa · steamed broccoli & carrot · lemon',
      waterAfter:  '500ml water — 1 hour after lunch',
      snack:       '1 cup green tea · 1 piece dark chocolate (80%)',
      waterEve:    '500ml water',
      dinner:      'Red lentil soup (200g) with tomato, carrot & cumin · fresh coriander · 1 crispbread',
    },
  ],

  'Stabilization II': [
    // Monday
    {
      waterAM:     'Drink 500ml room-temperature water slowly right after waking up',
      breakfast:   '2 eggs (scrambled or poached) · 1 slice avocado toast on rye bread · black pepper & lemon',
      waterMid:    '400ml water — 2 hours after breakfast',
      lunch:       'Chicken or turkey breast (120g) · 80g cooked brown rice or buckwheat · large salad (mixed greens, tomato, cucumber) · olive oil',
      waterAfter:  '400ml water — 1 hour after lunch',
      snack:       '1 tangerine or small apple · 5 almonds',
      waterEve:    '500ml water',
      dinner:      'Baked sea bass or salmon (150g) · steamed broccoli (150g) · lemon & fresh herbs',
    },
    // Tuesday
    {
      waterAM:     'Drink 500ml room-temperature water slowly right after waking up',
      breakfast:   'Smoothie bowl 🥣: blend ½ frozen banana + 60g berries + 100ml kefir · top with 1 tsp chia + 3 almonds',
      waterMid:    '400ml water — 2 hours after breakfast',
      lunch:       'Lean beef steak (120g) · 70g roasted sweet potato · fresh arugula & cherry tomato salad',
      waterAfter:  '500ml water — 1 hour after lunch',
      snack:       '90g Greek yogurt · 1 tsp honey',
      waterEve:    '500ml water',
      dinner:      'Steamed chicken fillet (120g) · oven-roasted vegetables: zucchini, pepper, cherry tomatoes · fresh parsley',
    },
    // Wednesday
    {
      waterAM:     'Drink 500ml room-temperature water slowly right after waking up',
      breakfast:   'Oatmeal (100g) with 80g mixed berries · 1 tsp chia seeds · ½ tsp cinnamon · 4 almonds',
      waterMid:    '400ml water — 1 hour before lunch',
      lunch:       'Baked salmon (150g) · 70g quinoa · cucumber, dill & arugula salad · olive oil & lemon',
      waterAfter:  '400ml water — 1 hour after lunch',
      snack:       '1 cup green tea · 1 prune or 1 date',
      waterEve:    '500ml water',
      dinner:      'Lentil & spinach stew (180g) with turmeric & cumin · 1 crispbread',
    },
    // Thursday
    {
      waterAM:     'Drink 500ml room-temperature water slowly right after waking up',
      breakfast:   'Detox smoothie 🍹: spinach + ½ green apple + ½ kiwi + 1 tsp chia + 200ml water · or cottage cheese (100g) + berries',
      waterMid:    '500ml water — 1 hour before lunch',
      lunch:       'Grilled chicken breast (120g) · baked cauliflower & broccoli (150g) · garlic yogurt sauce (2 tbsp yogurt + dill)',
      waterAfter:  '400ml water — 1 hour after lunch',
      snack:       '1 small apple · 3 walnuts',
      waterEve:    '500ml water',
      dinner:      'White fish ceviche or baked fillet (140g) · steamed green beans & asparagus (120g) · lemon',
    },
    // Friday
    {
      waterAM:     'Drink 500ml room-temperature water slowly right after waking up',
      breakfast:   'Chia pudding (prepared night before): kefir + 60g berries + 2 tsp chia · or 2 boiled eggs + 1 crispbread',
      waterMid:    '400ml water — 2 hours after breakfast',
      lunch:       '"Full Plate": 80g buckwheat + 120g chicken breast + large mixed salad · olive oil & lemon · fresh parsley',
      waterAfter:  '500ml water — 1 hour after lunch',
      snack:       '1 cup chamomile or berry tea (sugar-free)',
      waterEve:    '500ml water',
      dinner:      'Turkey patty (100g) baked in oven · steamed broccoli & carrot (150g) · black pepper',
    },
    // Saturday
    {
      waterAM:     'Drink 500ml room-temperature water slowly right after waking up',
      breakfast:   'Avocado & egg bowl: ½ avocado + 2 poached eggs + lemon + dill + 1 slice rye bread',
      waterMid:    '500ml water — 2 hours after breakfast',
      lunch:       'Salmon & vegetable bake (150g fish + zucchini + cherry tomatoes + onion) · 70g quinoa on the side',
      waterAfter:  '500ml water — 1 hour after lunch',
      snack:       '1 prune · 1 piece dark chocolate (80%)',
      waterEve:    '500ml water',
      dinner:      'Creamy pumpkin soup (200g) — blended with ginger & olive oil · 1 crispbread',
    },
    // Sunday
    {
      waterAM:     'Drink 500ml room-temperature water slowly right after waking up',
      breakfast:   'Greek yogurt (150g) · 80g berries · 1 tsp chia · 4 almonds · ½ tsp honey',
      waterMid:    '500ml water — 2 hours after breakfast',
      lunch:       'Slow-cooked lean beef (120g) with carrot, celery & tomato · 70g buckwheat · fresh herbs',
      waterAfter:  '500ml water — 1 hour after lunch',
      snack:       '1 tangerine · 1 cup green tea',
      waterEve:    '500ml water',
      dinner:      'Baked chicken breast (165g) · oven-roasted sweet pepper & zucchini · lemon & basil',
    },
  ],
};

const PHASES = Object.keys(PLAN);

const MEAL_SECTIONS = [
  { key: 'waterAM',    icon: '💧', label: 'Wake-Up Water',    color: '#e8f4fd', borderColor: '#a8d4f0' },
  { key: 'breakfast',  icon: '🌅', label: 'Breakfast',        color: '#fef9ee', borderColor: '#f0d080' },
  { key: 'waterMid',   icon: '💧', label: 'Mid-Morning Water',color: '#e8f4fd', borderColor: '#a8d4f0' },
  { key: 'lunch',      icon: '🥗', label: 'Lunch',            color: '#f0f7ee', borderColor: '#90c880' },
  { key: 'waterAfter', icon: '💧', label: 'Post-Lunch Water', color: '#e8f4fd', borderColor: '#a8d4f0' },
  { key: 'snack',      icon: '🍎', label: 'Snack',            color: '#fdf0f8', borderColor: '#e0a0d0' },
  { key: 'waterEve',   icon: '💧', label: 'Evening Water',    color: '#e8f4fd', borderColor: '#a8d4f0' },
  { key: 'dinner',     icon: '🌙', label: 'Dinner',           color: '#f4f0fa', borderColor: '#b090d0' },
];

// Get today's day index (0=Mon … 6=Sun)
function getTodayDayIdx() {
  const jsDay = new Date().getDay(); // 0=Sun,1=Mon…6=Sat
  return jsDay === 0 ? 6 : jsDay - 1;
}

export default function DietPlan({ lang }) {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [dayIdx,   setDayIdx]   = useState(getTodayDayIdx());
  const [expanded, setExpanded] = useState({});

  const phase   = PHASES[phaseIdx];
  const dayPlan = PLAN[phase][dayIdx];

  function toggleExpand(key) {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  }

  const title    = lang === 'ru' ? 'Мой план питания' : 'My Diet Plan';
  const subtitle = lang === 'ru' ? 'Адаптировано для тебя · 65кг · 167см · 44 года' : 'Adapted for you · 65kg · 167cm · 44 years';

  return (
    <div style={s.wrap}>

      {/* Header */}
      <div style={s.header}>
        <p style={s.title}>{title}</p>
        <p style={s.subtitle}>{subtitle}</p>
      </div>

      {/* Phase selector */}
      <div style={s.phaseRow}>
        {PHASES.map((p, i) => (
          <button
            key={p}
            onClick={() => setPhaseIdx(i)}
            style={{ ...s.phaseBtn, ...(i === phaseIdx ? s.phaseBtnActive : {}) }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Day selector */}
      <div style={s.dayRow}>
        {DAYS.map((d, i) => {
          const isToday = i === getTodayDayIdx();
          return (
            <button
              key={d}
              onClick={() => setDayIdx(i)}
              style={{
                ...s.dayBtn,
                ...(i === dayIdx ? s.dayBtnActive : {}),
              }}
            >
              <span style={s.dayLabel}>{d}</span>
              {isToday && <span style={s.todayDot} />}
            </button>
          );
        })}
      </div>

      {/* Day full name */}
      <p style={s.dayFull}>{DAYS_FULL[dayIdx]}</p>

      {/* Tip banner */}
      <div style={s.tipBanner}>
        <span style={s.tipIcon}>💡</span>
        <span style={s.tipText}>
          Daily goal: <strong>1.5–2L water</strong> · last meal by <strong>19:00–20:00</strong>
        </span>
      </div>

      {/* Meal cards */}
      {MEAL_SECTIONS.map(sec => {
        const text = dayPlan[sec.key];
        if (!text) return null;
        const isWater = sec.key.startsWith('water');
        const isOpen  = !isWater || expanded[sec.key];

        return (
          <div
            key={sec.key}
            style={{
              ...s.card,
              backgroundColor: sec.color,
              borderColor:     sec.borderColor,
              opacity: isWater ? 0.85 : 1,
            }}
            onClick={() => isWater && toggleExpand(sec.key)}
          >
            <div style={s.cardHeader}>
              <span style={s.cardIcon}>{sec.icon}</span>
              <span style={s.cardLabel}>{sec.label}</span>
              {isWater && (
                <span style={s.chevron}>{isOpen ? '▲' : '▼'}</span>
              )}
            </div>
            {(!isWater || isOpen) && (
              <p style={s.cardText}>{text}</p>
            )}
          </div>
        );
      })}

      {/* Bottom note */}
      <div style={s.note}>
        <p style={s.noteText}>
          🌿 Season food lightly. Prefer steaming, grilling or oven-baking over frying.
          Listen to your body — adjust portions if needed.
        </p>
      </div>

    </div>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const s = {
  wrap: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    paddingBottom: '16px',
  },
  header: {
    textAlign: 'center',
    paddingTop: '4px',
  },
  title: {
    fontFamily: "'Lora', Georgia, serif",
    fontWeight: 500,
    fontSize: '22px',
    color: '#2d2518',
    marginBottom: '4px',
  },
  subtitle: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 300,
    fontSize: '12px',
    color: '#9a8870',
  },

  // Phase selector
  phaseRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    justifyContent: 'center',
  },
  phaseBtn: {
    padding: '5px 10px',
    borderRadius: '16px',
    border: '1px solid #d8ccc0',
    backgroundColor: '#fff',
    fontFamily: "'Inter', sans-serif",
    fontSize: '11px',
    color: '#8b7355',
    cursor: 'pointer',
    letterSpacing: '0.01em',
  },
  phaseBtnActive: {
    backgroundColor: '#8b7355',
    color: '#fff',
    border: '1px solid #8b7355',
  },

  // Day selector
  dayRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '4px',
  },
  dayBtn: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '6px 2px',
    borderRadius: '10px',
    border: '1px solid #ede8e2',
    backgroundColor: '#fff',
    cursor: 'pointer',
    position: 'relative',
    gap: '2px',
  },
  dayBtnActive: {
    backgroundColor: '#8b7355',
    borderColor: '#8b7355',
  },
  dayLabel: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '11px',
    color: 'inherit',
    fontWeight: 500,
  },
  todayDot: {
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    backgroundColor: '#c4a882',
    display: 'block',
  },

  dayFull: {
    fontFamily: "'Lora', Georgia, serif",
    fontSize: '16px',
    color: '#5a4535',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: '-4px',
  },

  // Tip
  tipBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#fef9ee',
    border: '1px solid #f0d080',
    borderRadius: '10px',
    padding: '8px 12px',
  },
  tipIcon: { fontSize: '14px' },
  tipText: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '11px',
    color: '#7a6030',
    lineHeight: 1.5,
  },

  // Meal cards
  card: {
    borderRadius: '12px',
    border: '1px solid',
    padding: '10px 14px',
    cursor: 'default',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px',
  },
  cardIcon: { fontSize: '16px', lineHeight: 1 },
  cardLabel: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 500,
    fontSize: '12px',
    color: '#4a3825',
    flex: 1,
    letterSpacing: '0.03em',
    textTransform: 'uppercase',
  },
  chevron: {
    fontSize: '10px',
    color: '#9a8870',
  },
  cardText: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '13px',
    color: '#3a2e22',
    lineHeight: 1.6,
    paddingTop: '2px',
  },

  // Note
  note: {
    backgroundColor: '#f5f0eb',
    borderRadius: '10px',
    padding: '10px 14px',
    marginTop: '4px',
  },
  noteText: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '12px',
    color: '#8b7355',
    lineHeight: 1.6,
    textAlign: 'center',
    fontStyle: 'italic',
  },
};
