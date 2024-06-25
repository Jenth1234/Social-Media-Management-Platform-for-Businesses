const InvoiceService = require('../../service/invoice/invoice.Service');
const packageService = require('../../service/package/package.service');
const Organization = require('../../service/organization/organization.service');
const moment = require('moment');
const crypto = require("crypto");
const axios = require("axios");
const CryptoJS = require('crypto-js');
const qs = require('qs');

const accessKey = process.env.accessKey;
const secretKey = process.env.secretKey;

class InvoiceController {
  constructor() {
    this.buyPackage = this.buyPackage.bind(this);
    this.handleIPN = this.handleIPN.bind(this);
    this.checkOrganizationPackage = this.checkOrganizationPackage.bind(this);
  }

  async buyPackage(req, res) {
    const user = req.user._doc;
    const { packageId, paymentGateway } = req.body;

    try {
      const existingIdPackage = await packageService.checkIdExits(packageId);
      if (!existingIdPackage) {
        return res.status(401).json({ message: "Invalid package ID!!!" });
      }
      
      const existingOrganizationId = await Organization.findUserByIdAndOrganization(user._id, user.ORGANIZATION_ID);
      if (!existingOrganizationId) {
        return res.status(401).json({ message: "Invalid organization!!!" });
      }

      const money = existingIdPackage.COST - (existingIdPackage.COST * existingIdPackage.DISCOUNT / 100);
      const month = existingIdPackage.MONTH;
      
      let resultPay;
      if (paymentGateway === 'zalopay') {
        resultPay = await InvoiceService.createBillZalopay(money, month);
      } else if (paymentGateway === 'momo') {
        resultPay = await InvoiceService.createBill(money, month);
      } else {
        return res.status(400).json({ message: "Invalid payment gateway!!!" });
      }

      const data_invoice = {
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
        ORDER_ID: resultPay.orderId,
        TYPE_ORDER: resultPay.partnerCode,
        PAID: null
      };

      const due_date = new Date();
      due_date.setMonth(due_date.getMonth() + month);
      due_date.setHours(due_date.getHours() + 0);

      const data_bill = {
        ORGANIZATION_ID: existingOrganizationId.ORGANIZATION_ID,
        PACKAGE_ID: packageId,
        NUMBER_OF_PRODUCT: existingIdPackage.NUMBER_OF_PRODUCT,
        NUMBER_OF_COMMENT: existingIdPackage.NUMBER_OF_COMMENT,
        ACTIVE_THRU_DATE: due_date,
      };

      const result = await InvoiceService.buyPackage(data_invoice, data_bill);
      await this.handleIPN({ body: { orderId: resultPay.orderId, month, paymentGateway } }, res);

      if (paymentGateway === 'zalopay') {
        return res.status(200).json({ message: "Tạo hóa đơn thành công Zalopay " , url: resultPay.order_url });
      } else if (paymentGateway === 'momo') {
        return res.status(200).json({ message: "Tạo hóa đơn thành công " + resultPay.partnerCode, url: resultPay.payUrl });
      }
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ message: 'Đã xảy ra lỗi khi mua gói' });
    }
  }

  async handleIPN(req, res) {
    const { orderId, month, paymentGateway, app_trans_id } = req.body;

    if (paymentGateway === 'zalopay') {
      const config = {
        app_id: '2553',
        key1: 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL',
        key2: 'kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz',
      };

      const postData = {
        app_id: config.app_id,
        app_trans_id, // ID giao dịch của ứng dụng
      };

      const data = postData.app_id + '|' + postData.app_trans_id + '|' + config.key1; // appid|app_trans_id|key1
      postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

      const postConfig = {
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
          await InvoiceService.updateOrderStatus(orderId, month);
        }

        return res.status(200).json(result.data);
      } catch (error) {
        console.error('ZaloPay IPN error:', error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi khi xử lý IPN từ ZaloPay' });
      }
    } else if (paymentGateway === 'momo') {
      try {
        const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;
        const signature = crypto.createHmac('sha256', secretKey)
          .update(rawSignature)
          .digest('hex');

        const requestBody = JSON.stringify({
          partnerCode: 'MOMO',
          requestId: orderId,
          orderId: orderId,
          signature: signature,
          lang: 'vi',
        });

        const options = {
          method: 'POST',
          url: 'https://test-payment.momo.vn/v2/gateway/api/query',
          headers: {
            'Content-Type': 'application/json',
          },
          data: requestBody,
        };

        const result = await axios(options);
        if (result.data.resultCode === 0) {
          await InvoiceService.updateOrderStatus(orderId, month);
        }

        return res.status(200).json(result.data);
      } catch (error) {
        console.error('MoMo IPN error:', error.message);
        return res.status(500).json({ message: 'Đã xảy ra lỗi khi xử lý IPN từ MoMo' });
      }
    } else {
      return res.status(400).json({ message: 'Invalid payment gateway' });
    }
  }

  async checkOrganizationPackage(req, res) {
    const user = req.user._doc;

    try {
      const existingOrganizationId = await Organization.findUserByIdAndOrganization(user._id, user.ORGANIZATION_ID);
      if (!existingOrganizationId) {
        return res.status(401).json({ message: "Invalid organization!!!" });
      }

      const organizationPackage = await InvoiceService.checkOrganizationHasPackage(existingOrganizationId.ORGANIZATION_ID);

      if (!organizationPackage) {
        return res.status(404).json({ message: "Tổ chức chưa mua gói nào." });
      }

      res.status(200).json({ organizationPackage });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ message: 'Đã xảy ra lỗi khi kiểm tra gói mua của tổ chức' });
    }
  }
}

module.exports = new InvoiceController();
