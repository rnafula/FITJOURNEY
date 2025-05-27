/* USERS TABLE */
/* 1. Regular USERS
2.Nutritionist
3.Instructors
4.Content-creators
5. Family
6. Lactating mothers
7. Weaning babies(through guardians) */
/* users table */
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL,
  status ENUM('active', 'inactive') DEFAULT 'active'
);
--Role table
CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE user_roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  role_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (role_id) REFERENCES roles(id)
);
CREATE TABLE user_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  profile_picture VARCHAR(255),
  user_id INT NOT NULL,
  age INT,
  gender ENUM('male', 'female', 'other'),
  weight DECIMAL(5,2),
  height DECIMAL(5,2),
  goal ENUM('lose', 'gain', 'maintain'),
  activity_level ENUM('low', 'moderate', 'high'),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE progress_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  date DATE NOT NULL,
  weight DECIMAL(5,2),
  note TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE TABLE meal_plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  created_by INT,  -- nutritionist or AI
  title VARCHAR(100),
  description TEXT,
  target_goal ENUM('lose', 'gain', 'maintain'),
  calories INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE user_meals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  meal_plan_id INT,
  date DATE NOT NULL,
  notes TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (meal_plan_id) REFERENCES meal_plans(id)
);
CREATE TABLE workout_plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  created_by INT,
  title VARCHAR(100),
  description TEXT,
  difficulty ENUM('beginner', 'intermediate', 'advanced'),
  duration_minutes INT,
  target_goal ENUM('lose', 'gain', 'maintain'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE user_workouts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  workout_plan_id INT,
  date DATE NOT NULL,
  notes TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (workout_plan_id) REFERENCES workout_plans(id)
);
-- 1. Seed Roles
INSERT INTO roles (name) VALUES 
  ('regular'),
  ('nutritionist'),
  ('instructor'),
  ('admin');

-- 2. Seed Users
INSERT INTO users (username, email, password_hash) VALUES
  ('alice', 'alice@example.com', 'hashed_pwd_1'),
  ('bob', 'bob@example.com', 'hashed_pwd_2'),
  ('claire', 'claire@example.com', 'hashed_pwd_3'),
  ('dan', 'dan@example.com', 'hashed_pwd_4');

-- 3. Assign User Roles
-- Assuming role IDs: regular=1, nutritionist=2, instructor=3, admin=4
-- Assuming user IDs: alice=1, bob=2, claire=3, dan=4
INSERT INTO user_roles (user_id, role_id) VALUES
  (1, 1),  -- Alice: regular
  (2, 2),  -- Bob: nutritionist
  (3, 3),  -- Claire: instructor
  (4, 4);  -- Dan: admin

-- 4. User Profiles
INSERT INTO user_profiles (user_id, age, gender, weight, height, goal, activity_level) VALUES
  (1, 28, 'female', 65.5, 165.0, 'lose', 'moderate'),
  (2, 34, 'male', 78.0, 180.0, 'maintain', 'high'),
  (3, 29, 'female', 59.0, 170.0, 'gain', 'low'),
  (4, 40, 'male', 85.2, 175.0, 'lose', 'moderate');

-- 5. Progress Logs
INSERT INTO progress_logs (user_id, date, weight, note) VALUES
  (1, '2025-04-25', 66.0, 'Starting weight'),
  (1, '2025-04-28', 65.5, 'Minor drop after meal changes'),
  (3, '2025-04-25', 58.0, 'Initial check-in'),
  (3, '2025-04-28', 59.0, 'Progress after protein boost');
INSERT INTO meal_plans (created_by, title, description, target_goal, calories) VALUES
  (2, 'Low-Carb Breakfast', 'Omelet with spinach and mushrooms', 'lose', 350),
  (2, 'Muscle Gain Lunch', 'Grilled chicken, brown rice, veggies', 'gain', 600),
  (2, 'Balanced Dinner', 'Salmon, sweet potato, broccoli', 'maintain', 500),
  (2, 'Vegan High-Protein', 'Tofu stir-fry with quinoa', 'gain', 550);
INSERT INTO user_meals (user_id, meal_plan_id, date, notes) VALUES
  (1, 1, '2025-04-28', 'Had a banana with the meal'),
  (1, 3, '2025-04-29', ''),
  (3, 2, '2025-04-28', 'Substituted chicken with lentils'),
  (3, 4, '2025-04-29', 'Felt energized after this meal');
INSERT INTO workout_plans (created_by, title, description, difficulty, duration_minutes, target_goal) VALUES
  (3, 'Beginner HIIT', '20-min high intensity routine', 'beginner', 20, 'lose'),
  (3, 'Strength Builder', 'Full-body workout with weights', 'intermediate', 45, 'gain'),
  (3, 'Flex & Tone', 'Yoga-inspired stretching and toning', 'beginner', 30, 'maintain'),
  (3, 'Cardio Burn', 'Endurance cardio session', 'advanced', 60, 'lose');
INSERT INTO user_workouts (user_id, workout_plan_id, date, notes) VALUES
  (1, 1, '2025-04-28', 'Tough but manageable'),
  (1, 4, '2025-04-29', 'Couldn’t finish the last 10 mins'),
  (3, 2, '2025-04-28', 'Felt strong, added extra reps'),
  (3, 3, '2025-04-29', 'Good post-workout stretch');
INSERT INTO ai_recommendations (user_id, type, content) VALUES
  (1, 'meal', 'Try a protein-rich smoothie for breakfast.'),
  (1, 'workout', 'Add 10 minutes of brisk walking daily.'),
  (3, 'meal', 'Increase calorie intake with nuts and seeds.'),
  (3, 'workout', 'Use resistance bands for strength building.');

