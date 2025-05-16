const express = require("express");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcrypt");
const ejs = require("ejs");
const session = require("express-session");
const mysql = require("mysql");
const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const dbConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "fitjourney_db",
});

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

//authorization middleware
//routes
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
//post routes
app.post("/signup", (req, res) => {
  console.log(req.body);
  dbConnection.query(
    `SELECT * FROM users WHERE email ="${req.body.email}"`,
    (err, result) => {
      if (err) {
        res.json(err);
      } else {
        console.log("DB result- Email Check:", result);
        if (result.length > 0) {
          res.send("Email already exists, please use another email or login");
        } else {
          const hashedPassword = bcrypt.hashSync(req.body.password_hash, 10);
          dbConnection.query(
            `INSERT INTO users (username, email, password_hash) VALUES ("${req.body.username}", "${req.body.email}", "${hashedPassword}")`,

            (err) => {
              if (err) {
                console.error(err);
                res.status(500).send("Error signing up");
              } else {
                res.redirect("/login");
              }
            }
          );
        }
      }
    }
  );
});
app.post("/login", (req, res) => {
  console.log(req.body);
  const { email, password_hash } = req.body;
  dbConnection.query(
    `SELECT * FROM users WHERE email ="${email}"`,
    (err, data) => {
      console.log(data);
      if (err) {
        res.status(500).send("Error logging in");
      } else {
        if (data.length == 0) {
          res.status(401).send("User not found");
        } else {
          const user = data[0];
          const isPasswordValid = bcrypt.compareSync(
            password_hash,
            user.password_hash
          );
          if (isPasswordValid) {
            req.session.user = user;
            res.redirect("regular_user/dashboard_R.ejs");
          } else {
            res.status(401).send("Invalid password");
          }
        }
      }
    }
  );
});

//port
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
