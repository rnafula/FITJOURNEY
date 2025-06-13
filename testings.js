 dbConnection.query("SELECT * FROM rooms", (roomsSelectError, rooms) => {
      if (roomsSelectError) {
        res.status(500).send("Server Error: 500");
      } else {
        dbConnection.query("SELECT * FROM spots", (spotsSelectError, spots) => {
          if (spotsSelectError) {
            res.status(500).send("Server Error: 500");
          } else {
            res.render("index.ejs", { rooms, spots });
          }


          app.get("/regular/my_plans", (req, res) => {
            res.status(400).redirect("/regular/available_plans");
          });
          
          app.get("/regular/my_plans/:id", (req, res) => {
            // Check if user is logged in
            if (!req.session.user) {
              return res.redirect("/login");
            }
            const planId = req.params.id;
            const userId = req.session.user.id;
            //saving plan for user if not already saved
              dbConnection.query(
              `INSERT IGNORE INTO user_meal_plans (user_id, meal_plan_id) VALUES (?, ?)`,
              [userId, planId],
              (err) => {
                if (err) {
                  console.error("Save error:", err);
                  return res.status(500).send("Error saving plan");
                }
          
            dbConnection.query(
              `
              SELECT 
                mp.title AS meal_plan,
                md.day_number,
                m.type AS meal_type,
                m.notes AS meal_notes,
                mi.name AS item_name,
                mi.quantity,
                mi.calories
              FROM meal_plans mp
              JOIN meal_days md ON md.meal_plan_id = mp.id
              JOIN meals m ON m.meal_day_id = md.id
              LEFT JOIN meal_items mi ON mi.meal_id = m.id
              WHERE mp.id = ?
              ORDER BY md.day_number, FIELD(m.type, 'breakfast', 'lunch', 'dinner')
            `,
              [planId],
              (err, results) => {
                if (err) {
                  console.error("💥 DB Error:", err); // <-- log real SQL error
                  return res.status(500).send("Database error");
                }
          
                if (results.length === 0) {
                  return res.status(404).send("Meal plan not found");
                }
          
                res.render("regular_user/my_plans.ejs", { my_plan: results });
              }
            );
          });
          app.get("/regular/my_plans", (req, res) => {
            if (!req.session.user) {
              return res.redirect("/login");
            }
            const userId = req.session.user.id;
          
            dbConnection.query(
              `SELECT mp.* 
               FROM meal_plans mp
               JOIN user_meal_plans ump ON ump.meal_plan_id = mp.id
               WHERE ump.user_id = ?`,
              [userId],
              (err, results) => {
                if (err) return res.status(500).send("Database error");
                res.render("regular_user/my_plans.ejs", { my_plans: results });
              }
            );
          });
          });
          