const Invoice = require("../../models/Invoice/Invoice.model");
const Organization = require("../../models/organization/organization.model");

const payment = require("../../controllers/payment/payment.Controller");
const express = require("express");
const axios = require("axios");
const crypto = require("crypto");

const accessKey = process.env.accessKey
const secretKey = process.env.secretKey
class InvoiceService {
  async buyPackage(organizationId, packageId) {
    try {
      const invoice = new Invoice();

      const data_invoice = await invoice.save();

      //   organization.PACKAGE.PACKAGE_ID = packageId;
      //   organization.PACKAGE.LEVEL = packageItem.LEVEL;
      //   organization.PACKAGE.NUMBER_OF_PRODUCT = packageItem.NUMBER_OF_PRODUCT;
      //   organization.PACKAGE.NUMBER_OF_COMMENT = packageItem.NUMBER_OF_COMMENT;
      //   organization.PACKAGE.ACTIVE_FROM_DATE = new Date();
      //   organization.PACKAGE.ACTIVE_THRU_DATE = new Date(
      //     new Date().setFullYear(new Date().getFullYear() + 1)
      //   );
      //   await organization.save();

      return data_invoice;
    } catch (error) {
      console.error(error);
      throw new Error("Đã xảy ra lỗi khi mua gói");
    }
  }

  createBill = async (money) => {
    const accessKey = "F8BBA842ECF85";
    const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    const orderInfo = "pay with MoMo";
    const partnerCode = "MOMO";
    const redirectUrl =
      "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b";
    const ipnUrl = "https://5812-14-230-62-193.ngrok-free.app/invoice/callback";
    const requestType = "payWithMethod";
    const amount = money.toString();
    const orderId = partnerCode + Date.now().toString();

    const requestId = orderId;
    const extraData = "";
    const orderGroupId = "";
    const autoCapture = true;
    const lang = "vi";

    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    const crypto = require("crypto");
    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    const requestBody = {
      partnerCode: partnerCode,
      partnerName: "Test",
      storeId: "MomoTestStore",
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      lang: lang,
      requestType: requestType,
      autoCapture: autoCapture,
      extraData: extraData,
      orderGroupId: orderGroupId,
      signature: signature,
    };

    try {
      const response = await axios.post(
        "https://test-payment.momo.vn/v2/gateway/api/create",
        requestBody
      );
      return response.data;
    } catch (error) {
      return error;
    }
  };
  async updatePaymentStatus(orderId, status) {
    try {
      const updatedInvoice = await Invoice.findOneAndUpdate(
        { ORDER_ID: orderId },
        { PAID: status },
        { new: true } // Return the updated document
      );
      return updatedInvoice;
    } catch (error) {
      console.error(error);
      throw new Error("Error occurred while updating payment status");
    }
  }
}
module.exports = new InvoiceService();
