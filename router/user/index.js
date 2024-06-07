const express = require("express");
const router = express.Router();
const user_controller = require('../../controllers/user/user.controller');

// const verifyToken = require("../../middleware/verifyToken");
const {verifyToken, verifyTokenAdmin} = require("../../middleware/verifyToken");


router.post('/approvedOrganizations', verifyTokenAdmin, user_controller.approvedOrganizations);
router.post('/activeOrganization', verifyTokenAdmin, user_controller.activeOrganization);
router.put('/blockUser', verifyTokenAdmin, user_controller.blockUser);
router.post('/forgotPassword', user_controller.forgotPassword);
router.post('/resetPassword', verifyToken, user_controller.resetPassword);

router.put('/updateUser', verifyToken, user_controller.updateUser);

router.get('/getUsers',verifyToken,user_controller.getUsers);
router.post("/register", user_controller.registerUser);

router.post("/loginUser", user_controller.login);
router.post("/getUserInfoAdmin",verifyToken, user_controller.getUserInfoAdmin);





// router.get('/organization', verifyToken.checkOrganization,user_controller.login);

module.exports = router;