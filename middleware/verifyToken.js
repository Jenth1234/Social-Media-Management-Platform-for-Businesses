const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const USER_SERVICE = require('../service/user/user.service');
// const USER_CONTROLLER = require('../controllers/user/user.Controller');

dotenv.config();

const verifyToken = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) {
    return res.status(401).json({ message: 'Authorization token is required.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // req.user_id = decoded.userId;
    const user_info = await USER_SERVICE.getUserInfo(decoded.userId);
    req.user = user_info;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports = verifyToken;