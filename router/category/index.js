const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/category/category.controller');

router.post("/registerCategory", categoryController.registerCategory);

module.exports = router;