const express = require("express");
const router = express.Router();
const user_controller = require('../../controllers/user/user.Controller');
const verifyToken = require("../../middleware/verifyToken");

router.post("/register", user_controller.registerUser);
router.post("/loginUser", user_controller.login);

module.exports = router;

