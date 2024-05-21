const express = require("express");
const router = express.Router();
const user_controller = require('../../controllers/user/user.controller');
const verifyToken = require("../../middleware/verifyToken");

router.put('/editUser/:id', verifyToken,user_controller.editUser);//CHECK LAI LỖI 
router.delete('/deleteUser/:id',verifyToken,user_controller.deleteUser);//check lại lỗi
router.get('/getUsers',verifyToken,user_controller.getUsers);
router.post("/register", user_controller.registerUser);
router.post("/loginUser", user_controller.login);

module.exports = router;

