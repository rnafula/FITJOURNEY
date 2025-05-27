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
  database: "fitjourney_db",
});

// Connect to database and handle errors
dbConnection.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to database");
});

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
const publicRoutes = [
  "/",
  "/signup",
  "/login",
  "/about",
  "/book",
  "/checkout",
  "/checkin",
  "/logout",
];
const nutritionistRoutes = ["/nutritionist/dashboard", ...publicRoutes];
const fit_instructorRoutes = ["/fit_instructor/dashboard", ...publicRoutes];
const regular_userRoutes = ["/regular_user/dashboard", ...publicRoutes];
const adminRoutes = [
  ...nutritionistRoutes,
  ...fit_instructorRoutes,
  ...regular_userRoutes,
];

app.use((req, res, next) => {
  // Set user data for views if logged in
  res.locals.user = req.session.user || null;

  // Allow access to public routes for all users
  if (publicRoutes.includes(req.path)) {
    return next();
  }

  // Check if user is logged in
  if (!req.session.user) {
    return res.redirect("/login");
  }

  // Check role-based access
  const userRole = req.session.user.role; // Assuming role is stored in the database
  if (userRole === "admin" && adminRoutes.includes(req.path)) {
    return next();
  } else if (
    userRole === "nutritionist" &&
    nutritionistRoutes.includes(req.path)
  ) {
    return next();
  } else if (
    userRole === "instructor" &&
    fit_instructorRoutes.includes(req.path)
  ) {
    return next();
  } else if (userRole === "regular" && regular_userRoutes.includes(req.path)) {
    return next();
  }

  // Unauthorized access
  return res.status(401).send("Unauthorized access");
});

// Routes
app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/signup", (req, res) => {
  res.render("signup.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/regular_user/dashboard", (req, res) => {
  res.render("regular_user/dashboard_R.ejs");
});

app.get("/nutritionist/dashboard", (req, res) => {
  res.render("nutritionist/dashboard_N.ejs");
});

app.get("/fit_instructor/dashboard", (req, res) => {
  res.render("fit_instructor/dashboard_I.ejs");
});

// POST routes
app.post("/signup", (req, res) => {
  const { username, email, password_hash } = req.body;

  // Check if email already exists
  dbConnection.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (result.length > 0) {
        return res
          .status(400)
          .send("Email already exists, please use another email or login");
      }

      // Hash password and insert user
      const hashedPassword = bcrypt.hashSync(password_hash, 10);
      dbConnection.query(
        "INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)",
        [username, email, hashedPassword, "regular"], // Default role is 'regular'
        (err) => {
          if (err) {
            console.error("Error signing up:", err);
            return res.status(500).send("Error signing up");
          }
          res.redirect("/login");
        }
      );
    }
  );
});

app.post("/login", (req, res) => {
  const { email, password_hash } = req.body;

  dbConnection.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, data) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).send("Error logging in");
      }

      if (data.length === 0) {
        return res.status(401).send("User not found");
      }

      const user = data[0];
      const isPasswordValid = bcrypt.compareSync(
        password_hash,
        user.password_hash
      );

      if (isPasswordValid) {
        req.session.user = user;
        // Redirect based on user role
        if (user.role === "admin") {
          return res.redirect("/admin/dashboard");
        } else if (user.role === "nutritionist") {
          return res.redirect("/nutritionist/dashboard");
        } else if (user.role === "instructor") {
          return res.redirect("/fit_instructor/dashboard");
        } else {
          return res.redirect("/regular_user/dashboard");
        }
      } else {
        return res.status(401).send("Invalid password");
      }
    }
  );
});

// Logout route
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
