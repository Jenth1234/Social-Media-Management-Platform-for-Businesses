const InvoiceService = require('../../service/invoice/invoice.Service');
const packageService = require('../../service/package/package.service');
const Organization = require('../../service/organization/organization.service');
const crypto = require("crypto"); 
const axios = require("axios");
const { response } = require('express');


const accessKey = process.env.accessKey
const secretKey = process.env.secretKey
class InvoiceController {
  constructor() {
      this.buyPackage = this.buyPackage.bind(this);
      this.handleIPN = this.handleIPN.bind(this);
  }

  async buyPackage(req, res) {
      const user = req.user._doc;

      const { organizationId, packageId } = req.body;
      const existingIdPackage = await packageService.checkIdExits(packageId);
      if (!existingIdPackage) {
          return res.status(401).json({ message: "Invalid !!!" });
      }
      const existingOrganizationId = await Organization.findUserByIdAndOrganization(user._id, user.ORGANIZATION_ID);
      if (!existingOrganizationId) {
          return res.status(401).json({ message: "Invalid  organization!!!" });
      }
      
      const money = existingIdPackage.COST - (existingIdPackage.COST * existingIdPackage.DISCOUNT / 100);
      const due_date = new Date(new Date().setMonth(new Date().getMonth() + existingIdPackage.MONTH));
      due_date.setHours(due_date.getHours() + 0);
      const result_momo = await InvoiceService.createBill(money);
      
      const data_invoice = {
          ORGANIZATION_ID: existingOrganizationId.ORGANIZATION_ID,
          PACKAGE_ID: packageId,
          LEVEL: existingIdPackage.LEVEL,
          AMOUNT: money,
          DUE_DATE: due_date,
          PAID: null,
          ORDER_ID: result_momo.orderId  
      };

      try {
          const result = await InvoiceService.buyPackage(data_invoice);
          await this.handleIPN({ body: { orderId: result_momo.orderId } }, res);
      } catch (error) {
          console.error(error.message);
          res.status(500).json({ message: 'Đã xảy ra lỗi khi mua gói' });
      }
  }

  async handleIPN(req, res) {
      const { orderId } = req.body;
  
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
          await InvoiceService.updateOrderStatus(orderId); 
      }else if(result.data.responseTime === 0){
          
      }
      return res.status(200).json(result.data);
  }; 
}

    

module.exports = new InvoiceController();