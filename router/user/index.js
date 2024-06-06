const express = require("express");
const router = express.Router();
const user_controller = require('../../controllers/user/user.controller');
const verifyToken = require("../../middleware/verifyToken");

router.post('/approvedOrganizations', verifyToken, user_controller.checkAdmin, user_controller.approvedOrganizations);
router.post('/activeOrganization', verifyToken, user_controller.checkAdmin, user_controller.activeOrganization);
router.put('/blockUser', verifyToken, user_controller.checkAdmin, user_controller.blockUser);

router.put('/updateUser/:id', verifyToken, user_controller.updateUser);//CHECK LAI LỖI 
// router.delete('/deleteUser/:id',verifyToken,user_controller.deleteUser);//check lại lỗi
router.get('/getUsers',verifyToken,user_controller.getUsers);
router.post("/register", user_controller.registerUser);
router.post("/loginUser", user_controller.login);
router.post("/loginAdmin", verifyToken, user_controller.checkAdmin, user_controller.login);
router.post("/getUserInfoAdmin",verifyToken, user_controller.getUserInfoAdmin);

module.exports = router;

