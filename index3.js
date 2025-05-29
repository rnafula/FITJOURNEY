const express = require("express");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcrypt");
const ejs = require("ejs");
const session = require("express-session");
const mysql = require("mysql");
const multer = require("multer");
const upload = multer({ dest: "public/images" });
const app = express();

// Set view engine and static files
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Database connection
const dbConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ft_db",
});

// Connect to database and handle errors

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "Techlabs_Mashinani",
    resave: false,
    saveUninitialized: true,
  })
);

// Authorization middleware
const publicRoutes = ["/", "/signup", "/login", "/about", "/logout"];
const nutritionistRoutes = ["/nutritionist/dashboard", ...publicRoutes];
const fit_instructorRoutes = ["/fit_instructor/dashboard", ...publicRoutes];
const regular_userRoutes = ["/regular_user/dashboard", ...publicRoutes];
const adminRoutes = [
  ...nutritionistRoutes,
  ...fit_instructorRoutes,
  ...regular_userRoutes,
];
app.use((req, res, next) => {
  if (req.session.user) {
    // Check if user is logged in
    const userRole = req.session.user.role;
    if (
      (userRole === "nutritionist" && nutritionistRoutes.includes(req.path)) ||
      (userRole === "instructor" && fit_instructorRoutes.includes(req.path)) ||
      (userRole === "admin" && adminRoutes.includes(req.path)) ||
      (userRole === "regular" && regular_userRoutes.includes(req.path))
    ) {
      return next(); // Allow access to authorized routes
    } else {
      return res
        .status(403)
        .send("Forbidden: You do not have access to this route");
    }
  }
  // If not logged in, check if the route is public
  if (publicRoutes.includes(req.path)) {
    return next(); // Allow access to public routes
  }
  // If not logged in and not a public route, deny access
  return res
    .status(401)
    .send("Unauthorized: Please log in to access this route");
});

app.get("/", (req, res) => {
  if (req.session.user) {
    // If user is logged in, redirect to their dashboard based on role
    const userRole = req.session.user.role;
    if (userRole === "nutritionist") {
      return res.redirect("/nutritionist/dashboard");
    } else if (userRole === "instructor") {
      return res.redirect("/fit_instructor/dashboard");
    } else if (userRole === "regular") {
      return res.redirect("/regular_user/dashboard");
    } else if (userRole === "admin") {
      return res.redirect("/admin/dashboard");
    }
  } else {
    res.render("index.ejs");
  }
});

app.get("/signup", (req, res) => {
  res.render("signup.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/regular_user/dashboard", (req, res) => {
  if (!req.session.user) {
    return res.status(401).send("Unauthorized access");
  }
  dbConnection.query("SELECT * FROM users", (err, users) => {
    if (err) {
      console.error("Error fetching users:", err);

      return res.status(500).send("Server Error");
    }

    dbConnection.query("SELECT * FROM roles", (err, roles) => {
      if (err) {
        console.error("Error fetching roles:", err);
        return res.status(500).send("Server Error");
      }

      res.render("regular_user/dashboard_R.ejs", {
        users,
        roles,
        username: req.session.user.username, // 👈 Pass username to EJS
      });
    });
  });
});

app.get("/nutritionist/dashboard", (req, res) => {
  res.render("nutritionist/dashboard_N.ejs");
});

app.get("/fit_instructor/dashboard", (req, res) => {
  res.render("fit_instructor/dashboard_I.ejs");
});

// POST routes

const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

app.post("/signup", (req, res) => {
  const { username, email, password_hash } = req.body;

  // Validate input
  if (!username || !email || !password_hash) {
    return res.status(400).send("All fields are required");
  }

  if (!isEmailValid.test(email)) {
    return res.status(400).send("Invalid email format");
  }

  // Hash the password
  const hashedpassword = bcrypt.hashSync(password_hash, 10);

  // Check if user already exists
  dbConnection.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, results) => {
      if (err) {
        console.error("DB Error:", err);

        return res.status(500).send("Server error while checking user");
      }

      if (results.length > 0) {
        return res.status(400).send("User already exists");
      }

      // Insert new user
      dbConnection.query(
        "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
        [username, email, hashedpassword],
        (error) => {
          if (error) {
            console.error("DB Error:", error);
            return res.status(500).send("Server error while signing up");
          }

          return res.redirect("/login");
        }
      );
    }
  );
});

//login route
app.post("/login", (req, res) => {
  const { username, password_hash } = req.body;

  // Validate input
  if (!username || !password_hash) {
    return res.status(400).send("Email and password are required");
  }

  // Look up user by username
  dbConnection.query(
    `SELECT 
    users.id AS user_id,
    users.username,
    users.email,
    users.password_hash,
    roles.id AS role_id,
    roles.role
  FROM users
  JOIN user_roles ON users.id = user_roles.user_id
  JOIN roles ON user_roles.role_id = roles.id
  WHERE users.username = ?`,
    [username],
    (err, results) => {
      if (err) {
        console.error("DB Error:", err);
        return res.status(500).send("Server error while checking user");
      }
      console.log("Login query result:", results);

      if (results.length === 0) {
        return res.status(401).send("Invalid username or password");
      }

      const user = results[0];

      // ✅ Check password correctly
      const isMatch = bcrypt.compareSync(password_hash, user.password_hash);

      if (!isMatch) {
        return res.status(401).send("Invalid password");
      }

      req.session.user = {
        id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role.toLowerCase(), // Add role to session for access control
      };

      res.redirect("/");
    }
  );
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error logging out:", err);
      return res.status(500).send("Error logging out");
    }
    res.redirect("/");
  });
});

// Start server
app.listen(9000, () => {
  console.log("Server is running on port 9000");
});
