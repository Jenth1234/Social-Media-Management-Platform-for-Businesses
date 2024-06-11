const express = require('express');
const router = express.Router();
const InvoiceController = require('../../controllers/invoice/invoice.controller');
const {verifyToken, verifyTokenAdmin} = require("../../middleware/verifyToken");


    
router.post('/buy',verifyToken,InvoiceController.buyPackage);
router.post('/ipn', InvoiceController.handleIPN);  // Endpoint để xử lý IPN từ MoMo

module.exports = router;
