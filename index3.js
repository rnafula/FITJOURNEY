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
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "ft_db",
};

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
  console.log(req.path);
  // Set user data for views if logged in
  if (req.session.user) {
    res.locals.user = req.session.user;

    const userRole = req.session.user.roles;
    if (userRole == "nutritionist" && nutritionistRoutes.includes(req.path)) {
      next();
    } else if (
      (userRole = "instructor" && fit_instructorRoutes.includes(req.path))
    ) {
      next();
    } else if ((userRole = "admin" && adminRoutes.includes(req.path))) {
      next();
    } else {
      if ((userRole = "regular" && regular_userRoutes.includes(req.path))) {
        next();
      }
    }
  } else {
    if (publicRoutes.includes(req.path)) {
      next(); // Allow access to public routes
    }
  }
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

  const dbConnection = mysql.createConnection(dbConfig);

  dbConnection.connect();

  // Check if user already exists
  dbConnection.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, results) => {
      if (err) {
        console.error("DB Error:", err);
        dbConnection.end();
        return res.status(500).send("Server error while checking user");
      }

      if (results.length > 0) {
        dbConnection.end();
        return res.status(400).send("User already exists");
      }

      // Insert new user
      dbConnection.query(
        "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
        [username, email, hashedpassword],
        (error) => {
          dbConnection.end();

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

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// Login route
/* app.post("/login", (req, res) => {
  const { email, password } = req.body;

  dbConnection.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (error, userData) => {
      if (error) {
        console.error("DB Error:", error);
        return res.status(500).send("Server error while logging in");
      }

      if (userData.length === 0) {
        return res.status(401).send("User not found, please sign up");
      }

      const user = userData[0];
      const isPasswordValid = bcrypt.compareSync(password, user.password_hash);

      if (!isPasswordValid) {
        return res.status(401).send("Invalid password");
      }

      // ✅ Store session
      req.session.user = {
        id: user.id,
        email: user.email,
        username: user.username,
        role_id: user.role_id,
      };

      // ✅ Redirect based on role_id
      switch (user.role_id) {
        case 1:
          return res.redirect("/regular_user/dashboard");
        case 2:
          return res.redirect("/nutritionist/dashboard");
        case 3:
          return res.redirect("/fit_instructor/dashboard");
        case 4:
          return res.redirect("/admin/dashboard");
        default:
          return res.redirect("/"); // fallback
      }
    }
  );
}); */

/* app.post("/login", (req, res) => {
  const { email, password_hash } = req.body;

  dbConnection.query(
    `SELECT 
  users.id,
  users.username,
  users.email,
  users.password_hash,
  users.role_id,
  roles.name AS role_name
FROM users
JOIN roles ON users.role_id = roles.id
WHERE users.email = ?;
`,
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

      if (!isPasswordValid) {
        return res.status(401).send("Invalid password");
      }

      req.session.user = {
        id: user.id,
        username: user.username,
        email: user.email,
        role_id: user.role_id,
        role_name: user.role_name,
      };

      console.log("User logged in:", req.session.user);

      // ✅ Role-based redirect
      switch (user.role_name) {
        case "admin":
          return res.redirect("/admin/dashboard");
        case "nutritionist":
          return res.redirect("/nutritionist/dashboard");
        case "instructor":
          return res.redirect("/fit_instructor/dashboard");
        default:
          return res.redirect("/regular_user/dashboard");
      }
    }
  );
}); */
//login
/* app.post("/login", (req, res) => {
  const { email, password_hash } = req.body;
  dbConnection.query(
    `SELECT * FROM users WHERE email="${email}"`,
    (error, userData) => {
      if (error) {
        res.status(500).send("server error");
        console.error("Error fetching user data:", error);
      } else {
        console.log("userData", userData);

        if (userData.length == 0) {
          res.status(401).send("User not found");
        } else {
          // user found - compate password using bcrypt
          const user = userData[0];
          const isPasswordValid = bcrypt.compareSync(
            password,
            user.password_hash
          );
          if (isPasswordValid) {
            // password is valid - create session - express session middleware
            req.session.user = user; // creating a session for the user
            res.redirect("/"); // redirect to home page
          } else {
            // password is invalid
            res.status(401).send("Invalid password");
          }
        }
      }
    }
  );
}); */
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
