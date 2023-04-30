const express = require("express");
// const mysql = require("mysql2");
const session = require("express-session");
const bcrypt = require("bcrypt");
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const verifyToken = require("./Security");

require("dotenv").config()

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());



// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: 'mysqlpass',
//   database: 'labstock',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });




async function getUsers() {
  let connection;
  try {
    // get a connection from the pool
    connection = await pool.getConnection();

    // execute the query
    const [rows, fields] = await connection.execute('SELECT * FROM users');

    // log the results
    console.log(rows);
  } catch (err) {
    console.error(err);
  } finally {
    // release the connection back to the pool
    if (connection) {
      connection.release();
    }
  }
}


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
    const payload = { username,isAdmin:true };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
    res.status(200).json({ success: true, redirectUrl: "/dashboard.html"});
  } else {
    res.status(401).json({ success: false, error: "Invalid credentials" });
  }
});

app.get('/items',(req,res)=>{
  res.render('items');
})


// Handle logout requests
app.get("/logout", (req, res) => {
  req.session.userId = undefined;
  res.redirect("/login.html");
});

app.get("/dashboard.html",verifyToken,(req,res)=>{
  res.render('dashboard', { isAdmin: req.isAdmin });
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
