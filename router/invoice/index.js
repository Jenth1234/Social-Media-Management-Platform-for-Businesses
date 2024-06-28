const express = require('express');
const router = express.Router();
const InvoiceController = require('../../controllers/invoice/invoice.controller');
const {verifyToken, verifyTokenAdmin} = require("../../middleware/verifyToken");
const axios = require('axios');
const CryptoJS = require('crypto-js'); 
const crypto = require("crypto");
const qs = require('qs');
const invoice = require('../../service/invoice/invoice.Service')



router.post('/buy',verifyToken,InvoiceController.buyPackage);
// router.post('/ipn',InvoiceController.handleIPN);
router.post('/callback',InvoiceController.handleCallback);
const config = {
  app_id: '2553',
  key1: 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL',
  key2: 'kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz',
  endpoint: 'https://sb-openapi.zalopay.vn/v2/create',
};
// router.post('/callbackzalo', async (req, res) => {
//   let result = {};
//   console.log(req.body);
//   try {
//     let dataStr = req.body.data;
//     let reqMac = req.body.mac;

//     let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
//     console.log('mac =', mac);

//     // kiểm tra callback hợp lệ (đến từ ZaloPay server)
//     if (reqMac !== mac) {
//       // callback không hợp lệ
//       result.return_code = -1;
//       result.return_message = 'mac not equal';
//     } else {
//       // thanh toán thành công
//       // merchant cập nhật trạng thái cho đơn hàng ở đây
//       let dataJson = JSON.parse(dataStr);
//       console.log(
//         "update order's status = success where app_trans_id =",
//         dataJson['app_trans_id'],
//       );

//       // Call the check status function after updating order status
//       await checkOrderStatus(dataJson['app_trans_id']);

//       result.return_code = 1;
//       result.return_message = 'success';
//     }
//   } catch (ex) {
//     console.log('lỗi:::' + ex.message);
//     result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
//     result.return_message = ex.message;
//   }

//   // thông báo kết quả cho ZaloPay server
//   res.json(result);
// });

// async function checkOrderStatus(app_trans_id,) {
//   let postData = {
//     app_id: config.app_id,
//     app_trans_id, // Input your app_trans_id
//   };

//   let data = postData.app_id + '|' + postData.app_trans_id + '|' + config.key1; // appid|app_trans_id|key1
//   postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

//   let postConfig = {
//     method: 'post',
//     url: 'https://sb-openapi.zalopay.vn/v2/query',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//     },
//     data: qs.stringify(postData),
//   };

//   try {
//     const result = await axios(postConfig);
//     console.log(result.data);
//     if (result.data.return_code === 1) {
//       console.log('Payment confirmed for app_trans_id:', app_trans_id);
//       await invoice.updateOrderStatus(orderId, month);
//     }
//   } catch (error) {
//     console.log('Error checking order status:', error);
//   }
// }


  module.exports = router;