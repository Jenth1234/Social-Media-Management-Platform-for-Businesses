const InvoiceService = require('../../service/invoice/invoice.Service');
const packageService = require('../../service/package/package.service');

class InvoiceController {
    async  buyPackage(req, res) {
        const user = req.user;

        const { organizationId, packageId } = req.body;
        const existingIdPackage = await packageService.checkIdExits(packageId);
    if (!existingIdPackage) {
      return res
        .status(401)
        .json({ message: "Invalid !!!" });
    }
        const money =existingIdPackage.COST -  (existingIdPackage.COST * existingIdPackage.DISCOUNT/100)
        
       
        const result_momo = await InvoiceService.createBill(money);
        
        const data_invoice =  {
            ORGANIZATION_ID: organizationId,
            PACKAGE_ID: packageId,
            // LEVEL: existingIdPackage.LEVEL,
            AMOUNT: 10000,
            DUE_DATE: new Date(new Date().setMonth(new Date().getMonth() + 1)),
           PAID : null,
           ORDER_ID: result_momo.orderId  
        }    

        try {
            const result = await  InvoiceService.buyPackage(data_invoice);
            res.status(200).json(result_momo);
            // res.status(200).json(data_invoice);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Đã xảy ra lỗi khi mua gói' });
        }
    }
    async handleIPN(req, res) {
        const { requestId, orderId, resultCode } = req.body;
    
        if (resultCode === 0) { // Payment successful
          try {
            const updatedInvoice = await InvoiceService.updatePaymentStatus(orderId, true);
            res.status(200).json({ message: 'Payment status updated successfully', invoice: updatedInvoice });
          } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Error occurred while updating payment status' });
          }
        } else {
          res.status(400).json({ message: 'Payment failed or canceled' });
        }
      }
}
    

module.exports = new InvoiceController();