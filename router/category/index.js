const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/category/category.controller');
const verifyOrganization = require('../../middleware/verifyOrganization');
const verifyOrganizationToken = require('../../middleware/verifyOrganizationToken');

router.post("/registerCategory", verifyOrganization, categoryController.registerCategory);

module.exports = router;