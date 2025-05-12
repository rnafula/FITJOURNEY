const express = require("express");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcrypt");
const ejs = require("ejs");
const session = require("express-session");
const mysql = require("mysql");
const app = express();

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

//port
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
