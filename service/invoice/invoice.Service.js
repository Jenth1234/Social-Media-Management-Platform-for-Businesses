const Invoice = require('../../models/Invoice/Invoice.model');
const Organization = require('../../models/organization/organization.model');
const PackageItem = require('../../models/package/package.model');

class InvoiceService {
    async buyPackage(organizationId, packageId) {
        try {
          
            const organization = await Organization.findById(organizationId);
            if (!organization) {
                throw new Error('Không tìm thấy tổ chức');
            }

     
            const packageItem  = await PackageItem.findById(packageId);
            if (!packageItem ) {
                throw new Error('Không tìm thấy gói');
            }

          
            const invoice = new Invoice({
                ORGANIZATION_ID: organizationId,
                PACKAGE_ID: packageId,
                LEVEL: packageItem.LEVEL,
                AMOUNT: packageItem.COST,
                DUE_DATE: new Date(new Date().setMonth(new Date().getMonth() + 1)) 
            });

           
            await invoice.save();

       
            organization.PACKAGE.PACKAGE_ID = packageId;
            organization.PACKAGE.LEVEL = packageItem.LEVEL;
            organization.PACKAGE.NUMBER_OF_PRODUCT = packageItem.NUMBER_OF_PRODUCT;
            organization.PACKAGE.NUMBER_OF_COMMENT = packageItem.NUMBER_OF_COMMENT;
            organization.PACKAGE.ACTIVE_FROM_DATE = new Date(); 
            organization.PACKAGE.ACTIVE_THRU_DATE = new Date(new Date().setFullYear(new Date().getFullYear() + 1)); 
            await organization.save();

            return { message: 'Mua gói thành công và tạo hóa đơn' };
        } catch (error) {
            console.error(error);
            throw new Error('Đã xảy ra lỗi khi mua gói');
        }
    }
}

module.exports = new InvoiceService();
