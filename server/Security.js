const jwt = require('jsonwebtoken');



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

module.exports = verifyToken;
  

