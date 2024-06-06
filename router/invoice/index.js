const express = require('express');
const router = express.Router();
const InvoiceController = require("../../controllers/invoice/invoice.controller")
const verifyToken = require('../../middleware/verifyToken');

    
router.post('/buy-package', InvoiceController.buyPackage);


module.exports = router;
