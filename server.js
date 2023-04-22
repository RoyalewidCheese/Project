const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const session = require("express-session");
const bcrypt = require("bcrypt");
const path = require("path");

const app = express();

// Parse JSON request bodies
app.use(bodyParser.json());

// Create a MySQL connection pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "0000",
  database: "project",
});

// Serve static files in the public directory
app.use(express.static("public"));

// Set up session management
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.COOKIE_SECURE === "true" },
  })
);

// Middleware function to check if user is authenticated
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    // Redirect to login page if not authenticated
    res.redirect("/login.html");
    return;
  }
  next();
};

// Handle the login request on a POST request to the /login endpoint
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    // Return error if either field is empty
    res
      .status(400)
      .json({ error: "Please enter both a username and password" });
    return;
  }

  // Check if username and password are correct
  if (username === "user" && password === "password") {
    req.session.userId = username;
    res.status(200).json({ success: true, redirectUrl: "/dashboard.html" });
  } else {
    res.status(401).json({ success: false, error: "Invalid credentials" });
  }
});

// Serve the login page on a GET request to the /login endpoint
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Handle logout requests
app.get("/logout", (req, res) => {
  // Clear user ID from session and redirect to login page
  req.session.userId = undefined;
  res.redirect("/login.html");
});

// Handle requests for main page
app.get("/dashboard.html", requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
