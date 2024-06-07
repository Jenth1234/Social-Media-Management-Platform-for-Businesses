const express = require("express");
const router = express.Router();
const user_controller = require('../../controllers/user/user.controller');
// const verifyToken = require("../../middleware/verifyToken");
const {verifyToken, verifyTokenAdmin} = require("../../middleware/verifyToken");

router.post('/approvedOrganizations', verifyTokenAdmin, user_controller.approvedOrganizations);
router.post('/activeOrganization', verifyTokenAdmin, user_controller.activeOrganization);
router.put('/blockUser', verifyTokenAdmin, user_controller.blockUser);
router.post('/forgotPassword', verifyToken, user_controller.forgotPassword);
router.post('/resetPassword', verifyToken, user_controller.resetPassword);

router.put('/updateUser/:id', verifyToken, user_controller.updateUser);//CHECK LAI LỖI 
// router.delete('/deleteUser/:id',verifyToken,user_controller.deleteUser);//check lại lỗi
router.get('/getUsers',verifyToken,user_controller.getUsers);
router.post("/register", user_controller.registerUser);
router.post("/loginUser", user_controller.login);
router.post("/getUserInfoAdmin",verifyToken, user_controller.getUserInfoAdmin);

module.exports = router;

