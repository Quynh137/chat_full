const jwt = require('jsonwebtoken');
require('dotenv').config();

// Get .env variable
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRE_MINUTES = process.env.ACCESS_TOKEN_EXPIRE_MINUTES;


const auth_MiddleWare = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      req.user = user;
      next();
    });
};

module.exports = auth_MiddleWare;