const express = require('express');
const router = express.Router();
const PackageController = require('../../controllers/package/package.controller');
const packageService = require('../../service/package/package.service');
const packageController = require('../../controllers/package/package.controller');
const user_controller = require('../../controllers/user/user.controller');
const {verifyToken, verifyTokenAdmin} = require("../../middleware/verifyToken");

router.post('/create', packageController.createPackage);
router.put('/update/:level', packageController.updatePackage);
// router.delete('/delete/:level', packageController.deletePackage);
router.get('/', packageController.getPackage);

router.post('/approvedOrganizations', verifyTokenAdmin, user_controller.approvedOrganizations);
router.post('/activeOrganization', verifyTokenAdmin, user_controller.activeOrganization);
router.put('/blockUser', verifyTokenAdmin, user_controller.blockUser);
router.post("/getUserInfoAdmin",verifyToken, user_controller.getUserInfoAdmin);
module.exports = router;
