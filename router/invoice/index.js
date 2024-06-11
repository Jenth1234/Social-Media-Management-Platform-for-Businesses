const express = require('express');
const router = express.Router();
const InvoiceController = require('../../controllers/invoice/invoice.controller');
const {verifyToken, verifyTokenAdmin} = require("../../middleware/verifyToken");
const axios = require('axios');
const crypto = require("crypto");

    
const accessKey = process.env.accessKey
const secretKey = process.env.secretKey
router.post('/buy',verifyToken,InvoiceController.buyPackage);
router.post('/ipn',async(req,res)=>{
    const { orderId } = req.body;

    // const signature = accessKey=$accessKey&orderId=$orderId&partnerCode=$partnerCode
    // &requestId=$requestId
    const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;
  
    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');
  
    const requestBody = JSON.stringify({
      partnerCode: 'MOMO',
      requestId: orderId,
      orderId: orderId,
      signature: signature,
      lang: 'vi',
    });
  
    // options for axios
    const options = {
      method: 'POST',
      url: 'https://test-payment.momo.vn/v2/gateway/api/query',
      headers: {
        'Content-Type': 'application/json',
      },
      data: requestBody,
    };
  
    const result = await axios(options);
  
    return res.status(200).json(result.data);

}); 
router.post('/callback',async(req,res)=>{
   
    console.log('callback: ');
    console.log(req.body);
     return res.status(200).json(req.body);
})

module.exports = router;
