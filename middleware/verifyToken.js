const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

class AuthMiddleware {
  constructor() {
    this.verifyToken = this.verifyToken.bind(this);
    this.checkAdmin = this.checkAdmin.bind(this);
    this.checkOrganization = this.checkOrganization.bind(this);
  }

  verifyToken(req, res, next) {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authorization token is required.' });
    }

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.user_id = decoded.userId;
      req.role = decoded.role;

      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token.' });
    }
  }

  checkAdmin(req, res, next) {
    this.verifyToken(req, res, () => {
      if (req.role && req.role.IS_ADMIN === true) {
        next()
      } else {
        return res.status(403).send("Bạn không có quyền truy cập.");
      }

    });
  }

  checkOrganization(req, res, next) {
    this.verifyToken(req, res, () => {
      if (req.role && req.role.IS_ORGANIZATION === true) {
        next(); 
      } else {
        return res.status(403).send("Bạn không có quyền truy cập.");
      }
    });
  }
}

module.exports = new AuthMiddleware();
