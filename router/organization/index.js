const express = require('express');
const router = express.Router();
const organizationController = require('../../controllers/organization/organization.controller');
const verifyToken = require('../../middleware/verifyToken');
const verifyOrganization = require('../../middleware/verifyOrganization');

router.post('/register', verifyToken, organizationController.registerOrganization);
router.post('/login', verifyToken, verifyOrganization, organizationController.loginToOrganization);
router.post('/registerAccountOfOrganization', organizationController.registerAccountOfOrganization);
router.get('/getUserByOrganization', verifyOrganization, organizationController.getUsersByOrganization);
router.delete('/deleteUserByOrganization/:userId', verifyOrganization, organizationController.deleteUserByOrganization);
router.put('/editOrganization', verifyOrganization, organizationController.editOrganization);

module.exports = router;
