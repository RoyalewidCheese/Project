const express = require("express");
// const mysql = require("mysql2");
const session = require("express-session");
const bcrypt = require("bcrypt");
require("dotenv").config()

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// Create a MySQL connection pool
// const pool = mysql.createPool({
//   connectionLimit: 10,
//   host: "localhost",
//   user: "root",
//   password: "0000",
//   database: "project",
// });



// Set up session management
app.use(
  session({
    secret: process.env.SESSION,
    resave: false,
    saveUninitialized: true
  })
);


// Middleware function to check if user is authenticated
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
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



// Handle logout requests
app.get("/logout", (req, res) => {
  req.session.userId = undefined;
  res.redirect("/login.html");
});

app.get("/dashboard.html",requireAuth,(req,res)=>{
  res.render('dashboard', { title: 'Jithu' });
})

const _getlogin=(req,res)=>{
  if(!req.session.userId)
      res.render('login');
  else res.redirect('dashboard.html')
}

app.get("/",_getlogin)
app.get("/login",_getlogin)
app.get("/login.html",_getlogin)

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
