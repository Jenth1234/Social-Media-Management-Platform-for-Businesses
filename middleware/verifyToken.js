const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

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
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

const verifyTokenAdmin = (req, res, next) => {
  verifyToken(req, res); 
  const userRole = req.user.ROLE;
  if (userRole && userRole.IS_ADMIN) { 
    next(); 
  } else {
    return res.status(403).json({ message: 'Access denied. You do not have admin permission.' });
  }
};

module.exports = {
  verifyToken,
  verifyTokenAdmin
};