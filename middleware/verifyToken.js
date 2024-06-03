const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { CACHE_INFO_USER } = require('../constants/keyCache'); 
const { cache } = require("../cache/index");

dotenv.config();

const verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) {
    return res.status(401).json({ message: 'Authorization token is required.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRECT);
    req.user_id = decoded.userId;
    const userId = decoded.userId;
    const key_cache_info_user = CACHE_INFO_USER + userId;

    // cache[key_cache_info_user] = decoded; 
    console.log('Decoded token data:', decoded);
    C
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token.' });
  }
}


module.exports = verifyToken;