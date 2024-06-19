const Invoice = require("../../models/Invoice/Invoice.model");
const Organization_data = require("../../models/metadata_organization/metadata_organization");
const PackageItem = require("../../models/package/package.model")
const payment = require("../../controllers/payment/payment.Controller");
const express = require("express");
const axios = require("axios");
const crypto = require("crypto");

const accessKey = process.env.accessKey;
const secretKey = process.env.secretKey;

class InvoiceService {


  async buyPackage(data_invoice) {
    try {
      const invoice = new Invoice(data_invoice);
      const organization_data = new Organization_data(data_invoice);
      await invoice.save();
      await organization_data.save();
      return invoice,organization_data;
    } catch (error) {
      console.error(error);
      throw new Error("Đã xảy ra lỗi khi mua gói");
    }
  }

  createBill = async (money, month) => {
    const accessKey = "F8BBA842ECF85";
    const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    const orderInfo = "pay with MoMo";
    const partnerCode = "MOMO";
    const redirectUrl = "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b";
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
      console.error(error);
      throw new Error("Đã xảy ra lỗi khi tạo hóa đơn");
    }
  };

  async updateOrderStatus(orderId, months) {
    try {
      const due_date = new Date();
      due_date.setMonth(due_date.getMonth() + months);
      due_date.setHours(due_date.getHours() + 0);

      const invoice = await Invoice.findOneAndUpdate(
        { ORDER_ID: orderId },
        {
          $set: {
            THRU_DATE: due_date,
            PAID: true
          }
        },
        { new: true }
      );
      return invoice;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to update order status");
    }
  }
async updatePaidStatus(orderId, status) {
    try {
      await Invoice.findOneAndUpdate({ ORDER_ID: orderId }, { PAID: status });
    } catch (error) {
      console.error('Error updating paid status:', error);
      throw error;
    }
  }
  async getOP() {
    return await Invoice.find({});
  }
 
}


 
module.exports = new InvoiceService();
