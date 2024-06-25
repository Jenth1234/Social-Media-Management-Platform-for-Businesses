const express = require('express');
const router = express.Router();
const PackageController = require("../../controllers/package/package.controller")
// const verifyToken = require('../../middleware/verifyToken');


    
router.post('/create', PackageController.createPackage);
router.put('/update/:id',PackageController.updatePackage);
router.get('/getData',PackageController.getPackage);
router.delete('/delete/:id',PackageController.deletePackage);

module.exports = router;
