const axios = require("axios");
const express = require("express");
const router = express.Router();
const payment_controller = require("../../controllers/payment/payment.Controller");
const verifyToken = require("../../middleware/verifyToken");
const InvoiceController = require('../../controllers/invoice/invoice.controller');

router.post("/pay",payment_controller.sendPaymentRequest);
 

module.exports = router;