const Invoice = require("../../models/Invoice/Invoice.model");
const Organization_data = require("../../models/metadata_organization/metadata_organization");
const PackageItem = require("../../models/package/package.model");
const payment = require("../../controllers/payment/payment.Controller");
const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const CryptoJS = require('crypto-js'); 
const moment = require('moment');
const { url } = require("inspector");

const accessKey = process.env.accessKey;
const secretKey = process.env.secretKey;

class InvoiceService {

  // Lưu dữ liệu hóa đơn và tổ chức vào cơ sở dữ liệu
  async buyPackage(data_invoice) {
    try {
      const invoice = new Invoice(data_invoice);
      const organization_data = new Organization_data(data_invoice);
      await Promise.all([
        invoice.save(),
        organization_data.save()
      ]);
      return { invoice, organization_data };
    } catch (error) {
      console.error(error);
      throw new Error("Đã xảy ra lỗi khi mua gói");
    }
  }

  // Tạo hóa đơn MoMo
  createBill = async (money, month) => {
    const accessKey = "F8BBA842ECF85";
    const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    const orderInfo = "pay with MoMo";
    const partnerCode = "MOMO";
    const redirectUrl = "http://localhost:3001/pages/menu";
    const ipnUrl = "https://tough-words-design.loca.lt/invoice/callback";
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

  // Tạo hóa đơn ZaloPay
  createBillZalopay = async (money, month) => {
    const partnerCode = "ZALO";
    const orderId = partnerCode + Date.now().toString();

    const embed_data = {
      //sau khi hoàn tất thanh toán sẽ đi vào link này (thường là link web thanh toán thành công của mình)
      redirecturl: 'http://localhost:3001/pages/history',
    };
  
    const config = {
      app_id: '2553',
      key1: 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL',
      key2: 'kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz',
      endpoint: 'https://sb-openapi.zalopay.vn/v2/create',
    };
    const items = [];
    const transID = Math.floor(Math.random() * 1000000);
  
    const app_trans_id = `${moment().format('YYMMDD')}_${transID}`;
    const order = {
      app_id: config.app_id,
      app_trans_id: app_trans_id,
      app_user: 'user123',
      app_time: Date.now(),
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount: money.toString(),

      callback_url: 'https://2153-113-170-51-144.ngrok-free.app/callback',

      description: `Lazada - Payment for the order #${transID}`,
      bank_code: '',
      // orderId:orderId
    };
  
    const data = 
      config.app_id + '|' +
      order.app_trans_id + '|' +
      order.app_user + '|' +
      order.amount + '|' +
      order.app_time + '|' +
      order.embed_data + '|' +
    
      order.item;
      
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
  
    try {
      const result = await axios.post(config.endpoint, null, { params: order });
      // Trả về app_trans_id cùng với các thông tin khác
      return { orderId, app_trans_id, ...result.data };
    } catch (error) {
      console.error(error);
      throw new Error('Error creating ZaloPay bill');
    }
  };

  // Cập nhật trạng thái đơn hàng
  async updateOrderStatus(app_trans_id, months) {
    try {
      const due_date = new Date();
      due_date.setMonth(due_date.getMonth() + months);
      due_date.setHours(due_date.getHours() + 0);
  
      const invoice = await Invoice.findOneAndUpdate(
        { APP_TRANS_ID: app_trans_id },
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
      throw new Error("Cập nhật trạng thái đơn hàng thất bại");
    }
  }
  

  // Cập nhật trạng thái thanh toán
  async updatePaidStatus(orderId, status) {
    try {
      await Invoice.findOneAndUpdate({ ORDER_ID: orderId }, { PAID: status });
    } catch (error) {
      console.error('Error updating paid status:', error);
      throw error;
    }
  }

  // Lấy tất cả hóa đơn
  async getOP() {
    return await Invoice.find({});
  }

  async getInvoicebyOrgan (OrganizationId) {
    const invoices = await Invoice.find({ ORGANIZATION_ID: OrganizationId });
    return invoices;
  }
}

module.exports = new InvoiceService();
