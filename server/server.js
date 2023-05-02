const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const verifyToken = require("./Security");

require("dotenv").config()


const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: process.env.MYSQL_PASSWORD,
  database: 'lms19',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});



const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());



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
app.get("/logout.html|logout/", (req, res) => {
  req.session.userId = undefined;
  res.redirect("/login.html");
});

app.get(/dashboard.html|dashboard/,verifyToken,(req,res)=>{
  res.render('dashboard', { isAdmin: req.isAdmin });
})

const _getlogin=(req,res)=>{
  if(!req.username)
      res.render('login');
  else res.redirect('dashboard.html')
}

app.get(/login|login.html/,verifyToken,_getlogin)






app.post('/display',async (req,res)=>{

    var sql = 'select sum(item_rawstock) as item_rawstock,i_category from item group by i_category';

    pool.getConnection(function(err, conn) {
      conn.query(sql,(err,result)=>{
        const val=[]
        for(let i=0;i<result.length;i++){
          val.push({'country':result[i]["i_category"],'litres':result[i]["item_rawstock"]})
        }
        res.json(val)
      })
     
      pool.releaseConnection(conn);
   })

   console.log("--------------------------")
   console.log(req.body.key)

   
  })

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
