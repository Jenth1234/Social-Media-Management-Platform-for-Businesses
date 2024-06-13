const express = require('express');
const router = express.Router();
const InvoiceController = require('../../controllers/invoice/invoice.controller');
const {verifyToken, verifyTokenAdmin} = require("../../middleware/verifyToken");
const axios = require('axios');
const crypto = require("crypto");

router.post('/buy',verifyToken,InvoiceController.buyPackage);
router.post('/ipn',InvoiceController.handleIPN);
router.post('/callback',async(req,res)=>{

    console.log('callback: ');
    console.log(req.body);
     return res.status(200).json(req.body);
})

module.exports = router;
