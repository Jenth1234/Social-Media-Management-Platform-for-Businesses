const express = require('express');
const router = express.Router();
const PackageController = require("../../controllers/package/package.controller")
// const verifyToken = require('../../middleware/verifyToken');


    
router.post('/create', PackageController.createPackage);
router.put('/update',PackageController.updatePackage);
router.get('/getData',PackageController.getPackage);
router.delete('/delete',PackageController.deletePackage);

module.exports = router;
