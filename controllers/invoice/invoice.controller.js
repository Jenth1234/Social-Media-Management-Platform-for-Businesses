const InvoiceService = require('../../service/invoice/invoice.Service');
const PackageService = require('../../service/package/package.Service');
const OrganizationService = require('../../service/organization/organization.Service');
const CryptoJS = require('crypto-js'); 
const qs = require('qs');
const axios = require('axios');

const config = {
  app_id: '2553',
  key1: 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL',
  key2: 'kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz',
  endpoint: 'https://sb-openapi.zalopay.vn/v2/create',
};

class InvoiceController {
  constructor() {
    // ... Khai báo các service và cấu hình khác
    this.data_invoice = null; // Khởi tạo data_invoice là một thuộc tính của InvoiceController
    // Bind các phương thức để duy trì ngữ cảnh của this
    this.checkOrderStatus = this.checkOrderStatus.bind(this);
    this.buyPackage = this.buyPackage.bind(this);
    this.handleCallback = this.handleCallback.bind(this);
  }

  async buyPackage(req, res) {
    const user = req.user._doc;
    const { packageId, paymentGateway } = req.body;
  
    try {
      console.log('User info:', user);
      console.log('packageId:', packageId);
      const existingIdPackage = await PackageService.checkIdExits(packageId);
      if (!existingIdPackage) {
        return res.status(401).json({ message: "Mã gói không hợp lệ!!!" });
      }

      const existingOrganizationId = await OrganizationService.findUserByIdAndOrganization(user._id, user.ORGANIZATION_ID);
      if (!existingOrganizationId) {
        return res.status(401).json({ message: "Tổ chức không hợp lệ!!!" });
      }
  
      const money = existingIdPackage.COST - (existingIdPackage.COST * existingIdPackage.DISCOUNT / 100);
      const month = existingIdPackage.MONTH;
  
      let resultPay;
      if (paymentGateway === 'zalopay') {
        resultPay = await InvoiceService.createBillZalopay(money, month);
      } else if (paymentGateway === 'momo') {
        resultPay = await InvoiceService.createBill(money, month);
      } else {
        return res.status(400).json({ message: "Cổng thanh toán không hợp lệ!!!" });
      }
  
      this.data_invoice = {
        ORGANIZATION_ID: existingOrganizationId.ORGANIZATION_ID,
        PACKAGE_ID: packageId,
        PACKAGE_NAME: existingIdPackage.TITLE,
        LEVEL: existingIdPackage.LEVEL,
        COST: existingIdPackage.COST,
        MONTH: existingIdPackage.MONTH,
        NUMBER_OF_PRODUCT: existingIdPackage.NUMBER_OF_PRODUCT,
        NUMBER_OF_COMMENT: existingIdPackage.NUMBER_OF_COMMENT,
        DISCOUNT: existingIdPackage.DISCOUNT,
        AMOUNT: money,
        URL: resultPay.order_url,
        ORDER_ID: resultPay.orderId,
        APP_TRANS_ID: resultPay.app_trans_id,  // Sửa lỗi chính tả ở đây
        TYPE_ORDER: resultPay.partnerCode,
        PAID: null
      };
  
      const due_date = new Date();
      due_date.setMonth(due_date.getMonth() + month);
      due_date.setHours(due_date.getHours() + 0);
  
      const data_bill = {
        ORGANIZATION_ID: user.ORGANIZATION_ID,
        // ORGANIZATION_NAME:existingOrganizationId.ORGANIZATION_NAME,
        PACKAGE_ID: packageId,
        NUMBER_OF_PRODUCT: existingIdPackage.NUMBER_OF_PRODUCT,
        NUMBER_OF_COMMENT: existingIdPackage.NUMBER_OF_COMMENT,
        ACTIVE_THRU_DATE: due_date,
      };

      await InvoiceService.buyPackage(this.data_invoice, data_bill); // Đảm bảo data_bill được truyền đúng cách
  
      let responseMessage, responseUrl;
      if (paymentGateway === 'zalopay') {
        responseMessage = "Tạo hóa đơn Zalopay thành công";
        responseUrl = resultPay.order_url;
      } else if (paymentGateway === 'momo') {
        responseMessage = "Tạo hóa đơn Momo thành công";
        responseUrl = resultPay.redirectUrl; // Sửa tên thuộc tính thành redirectUrl
      }
  
      res.status(200).json({ message: responseMessage, url: responseUrl });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Đã xảy ra lỗi khi mua gói' });
    }
  }
  

  async handleCallback(req, res) {
    let result = {};
    console.log(req.body);
    try {
      let dataStr = req.body.data;
      let reqMac = req.body.mac;

      let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
      console.log('mac =', mac);

      // Kiểm tra callback hợp lệ từ ZaloPay server
      if (reqMac !== mac) {
        // Callback không hợp lệ
        result.return_code = -1;
        result.return_message = 'mac not equal';
      } else {
        let dataJson = JSON.parse(dataStr);
        console.log("update order's status = success where app_trans_id =", dataJson['app_trans_id']);

        // Gọi hàm kiểm tra trạng thái đơn hàng và cập nhật
        await this.checkOrderStatus(dataJson['app_trans_id'], this.data_invoice.MONTH);

        result.return_code = 1;
        result.return_message = 'success';
      }
    } catch (ex) {
      console.log('Lỗi: ' + ex.message);
      result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
      result.return_message = ex.message;
    }

    // Trả về kết quả cho ZaloPay server
    res.json(result);
  }

  async checkOrderStatus(app_trans_id, month) {
    let postData = {
      app_id: config.app_id,
      app_trans_id, // Input your app_trans_id
    };

    let data = postData.app_id + '|' + postData.app_trans_id + '|' + config.key1; // appid|app_trans_id|key1
    postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    let postConfig = {
      method: 'post',
      url: 'https://sb-openapi.zalopay.vn/v2/query',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: qs.stringify(postData),
    };

    try {
      const result = await axios(postConfig);
      console.log(result.data);
      if (result.data.return_code === 1) {
        console.log('Payment confirmed for app_trans_id:', app_trans_id);
        await InvoiceService.updateOrderStatus(app_trans_id, month); // Assuming InvoiceService has this method
      }
    } catch (error) {
      console.log('Error checking order status:', error);
    }
  }

  async getInvoicesByOrganization(req, res) {
    const user = req.user._doc;;
  
    try {
      const invoices = await InvoiceService.getInvoicebyOrgan(user.ORGANIZATION_ID);
      return res.json(invoices);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      res.status(500).json({ error: 'Failed to fetch invoices' });
    }
  }
}

module.exports = new InvoiceController();

