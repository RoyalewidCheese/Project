const jwt = require('jsonwebtoken');



function verifyToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).send('Unauthorized');
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
  

