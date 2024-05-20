const express = require('express');
const router = express.Router();
const organizationController = require('../../controllers/organization/organization.controller');

router.post('/register', organizationController.createOrganization);

module.exports = router;
