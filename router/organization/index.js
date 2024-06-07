const express = require('express');
const router = express.Router();
const organizationController = require('../../controllers/organization/organization.controller');
const { verifyToken } = require('../../middleware/verifyToken');
const verifyOrganization = require('../../middleware/verifyOrganization');
const verifyOrganizationToken = require('../../middleware/verifyOrganizationToken');

// router.post('/registerOrganization', verifyToken, organizationController.registerOrganization);
router.post('/loginToOrganization', verifyOrganization, organizationController.loginToOrganization);
router.post('/registerAccountOfOrganization', verifyOrganization, organizationController.registerAccountOfOrganization);
router.get('/getUserByOrganization', verifyOrganization, verifyOrganizationToken, organizationController.getUsersByOrganization);
router.put('/blockUserByOrganization/:userId', verifyOrganization, verifyOrganizationToken, organizationController.toggleBlockUserByOrganization);
router.put('/editOrganization', verifyOrganization, verifyOrganizationToken, organizationController.editOrganization);
router.get('/getProductsWithCommentCount', verifyOrganization, verifyOrganizationToken, organizationController.getProductsWithCommentCount);

module.exports = router;
