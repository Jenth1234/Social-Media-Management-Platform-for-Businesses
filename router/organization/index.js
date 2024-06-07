const express = require('express');
const router = express.Router();
const organizationController = require('../../controllers/organization/organization.controller');
// const verifyToken = require('../../middleware/verifyToken');
const {verifyToken, verifyTokenAdmin} = require("../../middleware/verifyToken");
const verifyOrganization = require('../../middleware/verifyOrganization');
const verifyOrganizationToken = require('../../middleware/verifyOrganizationToken');

router.post('/registerOrganization', verifyToken, organizationController.registerOrganization);
router.post('/loginToOrganization', verifyToken, verifyOrganization, organizationController.loginToOrganization);
router.post('/registerAccountOfOrganization', organizationController.registerAccountOfOrganization);
router.get('/getUserByOrganization', verifyOrganizationToken, verifyOrganization, organizationController.getUsersByOrganization);
router.put('/blockUserByOrganization/:userId', verifyOrganizationToken, verifyOrganization, organizationController.toggleBlockUserByOrganization);
router.put('/editOrganization', verifyOrganizationToken, verifyOrganization, organizationController.editOrganization);

module.exports = router;
