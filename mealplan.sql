-- Meal Plan
INSERT INTO meal_plans (id, created_by, title, description, target_goal, created_at, days_count)
VALUES ( 2, 'Sample 3-Day Plan', 'Complete meals for testing', 'maintain', NOW(), 3);

-- Meal Days
INSERT INTO meal_days (id, meal_plan_id, day_number)
VALUES 
( 100, 1),
( 100, 2),
( 100, 3);

-- Meals (Breakfast, Lunch, Dinner for each day)
INSERT INTO meals (id, meal_day_id, type, notes)
VALUES
-- Day 1
( 1, 'breakfast', 'Start your day with protein.'),
( 1, 'lunch', 'Balanced meal for energy.'),
( 1, 'dinner', 'Light and nutritious dinner.'),
-- Day 2
( 2, 'breakfast', 'Add some fruits.'),
( 2, 'lunch', 'Fiber and protein-rich.'),
( 2, 'dinner', 'Low-carb dinner.'),
-- Day 3
( 3, 'breakfast', 'Oats and milk combo.'),
( 3, 'lunch', 'High protein lunch.'),
( 3, 'dinner', 'Simple and light.');

-- Meal Items
INSERT INTO meal_items (meal_id, name, quantity, calories)
VALUES
-- Day 1 Breakfast
(1, 'Boiled eggs', '2 eggs', 140),
(1, 'Whole grain toast', '2 slices', 160),
-- Day 1 Lunch
(2, 'Grilled chicken', '150g', 250),
(2, 'Brown rice', '1 cup', 215),
(2, 'Steamed broccoli', '1 cup', 55),
-- Day 1 Dinner
(3, 'Vegetable soup', '1 bowl', 150),
(3, 'Whole wheat bread', '1 slice', 80),
-- Day 2 Breakfast
(1, 'Greek yogurt', '1 cup', 100),
(1, 'Mixed berries', '1/2 cup', 50),
-- Day 2 Lunch
(2, 'Tuna salad', '1 bowl', 300),
(2, 'Avocado slices', '1/2 avocado', 120),
-- Day 2 Dinner
(3, 'Zucchini noodles', '1 plate', 100),
(3, 'Tofu', '100g', 120),
-- Day 3 Breakfast
(1, 'Oatmeal', '1 cup', 150),
(1, 'Skimmed milk', '1 cup', 80),
-- Day 3 Lunch
(2, 'Beef stir-fry', '150g', 300),
(2, 'Quinoa', '1 cup', 220),
-- Day 3 Dinner
(3, 'Grilled fish', '100g', 180),
(3, 'Steamed carrots', '1 cup', 50);
