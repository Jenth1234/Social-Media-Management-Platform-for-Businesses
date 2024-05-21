const express = require('express');
const router = express.Router();
const organizationController = require('../../controllers/organization/organization.controller');
const verifyToken = require('../../middleware/verifyToken');

router.post('/register', verifyToken, organizationController.registerOrganization);


module.exports = router;
