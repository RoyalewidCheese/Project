const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const {pool,verifyToken} = require("./Security");
const dashboardRoute = require("./routes/dashboard");
const borrowRoutes = require('./routes/borrow');
const app = express();


app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());

app.use("/dashboard",dashboardRoute)
app.use('/', borrowRoutes)
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
    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }
    );
    res.status(200).json({ success: true, redirectUrl: "/dashboard"});
  } else {
    res.status(401).json({ success: false, error: "Invalid credentials" });
  }
});

app.get('/items',(req,res)=>{
  res.render('items');
})


// Handle logout requests
app.get("/logout.html|/logout", (req, res) => {
  res.redirect("/login.html");
});



const _getlogin=(req,res)=>{
  if(!req.username)
      res.render('login');
  else res.redirect('dashboard')
}

app.get(/login|login.html/,verifyToken,_getlogin)


app.post('/data',async (req,res)=>{

  var sql = 'select sum(item_rawstock) as item_rawstock,i_category from item group by i_category';

  pool.getConnection(function(err, conn) {
    conn.query(sql,(err,result)=>{
      res.json(val)
    })
   
    pool.releaseConnection(conn);
 })

 console.log("--------------------------")
 console.log(req.body.key)

 
})

app.get('/borrow', (req, res) => {
  res.render('borrow');
});

app.get('/room', (req, res) => {
  res.render('room');
});

app.get('/inventory', (req, res) => {
  res.render('inventory')
});

app.get('/user', (req, res) => {
  res.render('user')
});

app.get('/reservation', (req, res) => {
  res.render('reservation')
});


app.get('/user_profile', (req, res) => {
  res.render('user_profile')
});

app.get('/report', (req, res) => {
  res.render('report')
});

app.get('/members', (req, res) => {
  res.render('members')
});

app.get('/new', (req, res) => {
  res.render('new')
});

app.get('/return', (req, res) => {
  res.render('return')
});


app.post('/display',async (req,res)=>{

    var sql = 'select sum(item_rawstock) as item_rawstock,i_category from item group by i_category';

    pool.getConnection(function(err, conn) {
      conn.query(sql,(err,result)=>{
        res.json(result)
      })
     
      pool.releaseConnection(conn);
   })

  //  console.log("--------------------------")
  //  console.log(req.body.key)

   
  })

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


module.exports ={  pool}