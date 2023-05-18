const jwt = require('jsonwebtoken');
const mysql = require("mysql2");
require("dotenv").config()

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: process.env.MYSQL_PASSWORD,
  database: 'Project',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});



function verifyToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        res.render('login');
        return 
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.password = decoded.username;
      req.isAdmin = decoded.isAdmin;
      next();
    } catch (err) {
      return res.status(401).send('Invalid token');
    }
  }

module.exports = {verifyToken,pool};
  

