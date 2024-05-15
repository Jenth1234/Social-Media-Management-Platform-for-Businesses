const express = require('express');
const router = express.Router();
const user_controller = require('../../controllers/user.Controller')
router.post('/register',user_controller.registerUser);
module.exports = router;