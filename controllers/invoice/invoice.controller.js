const axios = require('axios');
const qs = require('qs');
const crypto = require('crypto');
const CryptoJS = require('crypto-js');
const moment = require('moment');
const InvoiceService = require('../../service/invoice/invoice.Service');
const PackageService = require('../../service/package/package.Service');
const OrganizationService = require('../../service/organization/organization.Service');
const { accessKey, secretKey } = process.env;

class InvoiceController {
  constructor() {
    this.buyPackage = this.buyPackage.bind(this);
    this.checkOrganizationPackage = this.checkOrganizationPackage.bind(this);
    // this.handleCallback = this.handleCallback.bind(this);
  }

  async buyPackage(req, res) {
    const user = req.user._doc;
    const { packageId, paymentGateway } = req.body;

    try {
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

      await InvoiceService.buyPackage(data_invoice, data_bill);

      let responseMessage, responseUrl;
      if (paymentGateway === 'zalopay') {
        responseMessage = "Tạo hóa đơn Zalopay thành công";
        responseUrl = resultPay.order_url;
      } else if (paymentGateway === 'momo') {
        responseMessage = "Tạo hóa đơn Momo thành công";
        responseUrl = resultPay.payUrl;
      }

      res.status(200).json({ message: responseMessage, url: responseUrl });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Đã xảy ra lỗi khi mua gói' });
    }
  }

  async handleCallback(req, res) {
    const { orderId, month, paymentGateway, app_trans_id, mac } = req.body;

    try {
      const result = await this.processPaymentCallback(orderId, month, paymentGateway, app_trans_id,mac);
      console.log(result); // Log kết quả từ xử lý callback
      res.sendStatus(200); // Trả về mã HTTP 200 OK để xác nhận đã nhận được thông báo callback thành công
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Đã xảy ra lỗi khi xử lý thông báo callback' });
    }
  }

  async processPaymentCallback(orderId, month, paymentGateway, app_trans_id) {
    try {
      let result;

      if (paymentGateway === 'zalopay') {
        const config = {
          app_id: '2553',
          key1: 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL',
          key2: 'kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz',
        };
        if (!verifyCallback(app_trans_id, mac, config)) {
          return res.status(400).json({ message: 'Invalid MAC' });
        }
        const postData = {
          app_id: config.app_id,
          app_trans_id,
        };

        const data = postData.app_id + '|' + postData.app_trans_id + '|' + config.key1;
        postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

        const postConfig = {
          method: 'post',
          url: 'https://sb-openapi.zalopay.vn/v2/query',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          data: qs.stringify(postData),
        };

        const response = await axios(postConfig);
        result = response.data;
      } else if (paymentGateway === 'momo') {
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

        const response = await axios(options);
        result = response.data;
      } else {
        throw new Error('Invalid payment gateway');
      }

      console.log('Trạng thái thanh toán:', result);
      if (result.return_code === 1) {
        await InvoiceService.updateOrderStatus(orderId, month);
        // Thực hiện các hành động cần thiết sau khi xác nhận thanh toán thành công
      }

      return result;
    } catch (error) {
      console.error('Lỗi xử lý callback:', error);
      throw error;
    }
  }

  async checkOrganizationPackage(req, res) {
    const user = req.user._doc;

    try {
      const existingOrganizationId = await OrganizationService.findUserByIdAndOrganization(user._id, user.ORGANIZATION_ID);
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
