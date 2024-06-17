const express = require("express");
const router = express.Router();
const user_controller = require('../../controllers/user/user.controller');



const {verifyToken} = require("../../middleware/verifyToken");
router.post('/forgotPassword', verifyToken, user_controller.forgotPassword);
router.post('/forgotPassword', user_controller.forgotPassword);

router.post('/resetPassword', verifyToken, user_controller.resetPassword);
router.put('/updateUser', verifyToken, user_controller.updateUser);
////user không có quyền get
// router.get('/getUsers',verifyToken,user_controller.getUsers);

router.get('/totalUser',verifyToken,user_controller.getTotalUsers);
router.get('/info',verifyToken,user_controller.getUserInfo);
router.post("/register", user_controller.registerUser);
router.post("/loginUser", user_controller.login);






// router.get('/organization', verifyToken.checkOrganization,user_controller.login);

module.exports = router;