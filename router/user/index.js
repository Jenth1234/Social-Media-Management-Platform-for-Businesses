const express = require("express");
const router = express.Router();
const user_controller = require('../../controllers/user/user.controller');
// const verifyToken = require("../../middleware/verifyToken");
const { verifyToken, verifyAdmin } = require("../../middleware/verifyToken");

router.post('/approvedOrganizations', verifyToken, user_controller.approvedOrganizations);
router.post('/activeOrganization', verifyToken, user_controller.activeOrganization);
router.put('/blockUser', verifyAdmin, user_controller.blockUser);

router.put('/updateUser/:id', verifyToken, user_controller.updateUser);//CHECK LAI LỖI
router.get('/getUsers', verifyToken, user_controller.getUsers);
router.post("/register", user_controller.registerUser);
router.post("/loginUser", user_controller.login);

module.exports = router;

