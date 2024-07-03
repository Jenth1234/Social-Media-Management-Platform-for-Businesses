const express = require('express');
const router = express.Router();
const InvoiceController = require('../../controllers/invoice/invoice.controller');
const {verifyToken, verifyTokenAdmin} = require("../../middleware/verifyToken");
const axios = require('axios');
const CryptoJS = require('crypto-js'); 
const crypto = require("crypto");
const qs = require('qs');
const invoice = require('../../service/invoice/invoice.Service')



router.post('/getInvoicebyOrgan', verifyToken, InvoiceController.getInvoicesByOrganization);
router.post('/buy',verifyToken,InvoiceController.buyPackage);

router.post('/callback',InvoiceController.handleCallback);
const config = {
  app_id: '2553',
  key1: 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL',
  key2: 'kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz',
  endpoint: 'https://sb-openapi.zalopay.vn/v2/create',
};


  module.exports = router;