const express = require('express');
const router = express.Router();
const PackageController = require('../../controllers/package/package.controller');
const packageService = require('../../service/package/package.service');
const packageController = require('../../controllers/package/package.controller');



router.post('/create', packageController.createPackage);
router.put('/update/:level', packageController.updatePackage);
router.delete('/delete/:level', packageController.deletePackage);
router.get('/', packageController.getPackage);

module.exports = router;
