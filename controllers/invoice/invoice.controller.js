const InvoiceService = require('../../service/invoice/invoice.Service');
const packageService = require('../../service/package/package.service');
const Organization = require('../../service/organization/organization.service');
const moment = require('moment');
const crypto = require("crypto");
const axios = require("axios");

const accessKey = process.env.accessKey;
const secretKey = process.env.secretKey;

class InvoiceController {
  constructor() {
    this.buyPackage = this.buyPackage.bind(this);
    this.handleIPN = this.handleIPN.bind(this);
    this.updatePaidStatusAfterOneMinute = this.updatePaidStatusAfterOneMinute.bind(this);
    this.checkOrganizationPackage = this.checkOrganizationPackage.bind(this);
  }

  async buyPackage(req, res) {
    const user = req.user._doc;
    const { packageId } = req.body;

    try {
      const existingIdPackage = await packageService.checkIdExits(packageId);
      if (!existingIdPackage) {
        return res.status(401).json({ message: "Invalid package ID!!!" });
      }

      const existingOrganizationId = await Organization.findUserByIdAndOrganization(user._id, user.ORGANIZATION_ID);
      if (!existingOrganizationId) {
        return res.status(401).json({ message: "Invalid organization!!!" });
      }

      // // Check if organization has any active package
      // const organizationPackage = await InvoiceService.checkOrganizationHasPackage(existingOrganizationId.ORGANIZATION_ID);
      // if (organizationPackage) {
      //   // If organization has a package, check if the new package level is higher
      //   if (existingIdPackage.LEVEL <= organizationPackage.LEVEL) {
      //     return res.status(401).json({ message: "Bạn chỉ có thể mua gói có cấp độ cao hơn gói hiện tại." });
      //   }
      // }

      const money = existingIdPackage.COST - (existingIdPackage.COST * existingIdPackage.DISCOUNT / 100);
      const month = existingIdPackage.MONTH;
      const result_momo = await InvoiceService.createBill(money, month);

      const data_invoice = {
        ORGANIZATION_ID: existingOrganizationId.ORGANIZATION_ID,
        // ORGANIZATION_NAME:existingOrganizationId.ORGANIZATION_NAME,
        PACKAGE_ID: packageId,
        PACKAGE_NAME:existingIdPackage.TITLE,
        LEVEL: existingIdPackage.LEVEL,
        COST:existingIdPackage.COST,
        MONTH:existingIdPackage.MONTH,
        NUMBER_OF_PRODUCT:existingIdPackage.NUMBER_OF_PRODUCT,
        NUMBER_OF_COMMENT:existingIdPackage.NUMBER_OF_COMMENT,
        DISCOUNT:existingIdPackage.DISCOUNT,
        AMOUNT: money,
        ORDER_ID: result_momo.orderId,
        PAID: null
      };

      const due_date = new Date();
      due_date.setMonth(due_date.getMonth() + month);
      due_date.setHours(due_date.getHours() + 0);

      const data_bill = {
        ORGANIZATION_ID: existingOrganizationId.ORGANIZATION_ID,
        // ORGANIZATION_NAME:existingOrganizationId.ORGANIZATION_NAME,
        PACKAGE_ID: packageId,
        NUMBER_OF_PRODUCT:existingIdPackage.NUMBER_OF_PRODUCT,
        NUMBER_OF_COMMENT:existingIdPackage.NUMBER_OF_COMMENT,
        ACTIVE_THRU_DATE: due_date,
     
 
        // ORDER_ID: result_momo.orderId,
      };

      const result = await InvoiceService.buyPackage(data_invoice,data_bill);

      await this.handleIPN({ body: { orderId: result_momo.orderId, month } }, res);
      this.updatePaidStatusAfterOneMinute(result_momo.orderId);
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ message: 'Đã xảy ra lỗi khi mua gói' });
    }
  }

  async handleIPN(req, res) {
    const { orderId, month } = req.body;

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

      res.status(200).json(result.data);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Đã xảy ra lỗi khi xử lý IPN' });
    }
  }

  async updatePaidStatusAfterOneMinute(orderId) {
    setTimeout(async () => {
      try {
        await InvoiceService.updatePaidStatus(orderId, false);
        console.log('Updated paid status for invoice after 1 minute:', orderId);
      } catch (error) {
        console.error('Error updating paid status:', error);
      }
    }, 1 * 30 * 1000); // 1 phút
  }

  async checkOrganizationPackage(req, res) {
    const user = req.user._doc;

    try {
      const existingOrganizationId = await Organization.findUserByIdAndOrganization(user._id, user.ORGANIZATION_ID);
      if (!existingOrganizationId) {
        return res.status(401).json({ message: "Invalid organization!!!" });
      }

      // Check if organization has any active package
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
