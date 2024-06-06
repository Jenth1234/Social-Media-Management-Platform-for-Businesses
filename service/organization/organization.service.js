const Organization = require('../../models/organization/organization.model');
const User = require('../../models/user/user.model');

class ORGANIZATION_SERVICE {
    registerOrganization = async (payload) => {
        try {
            // Tạo một tổ chức mới
            const newOrganization = new Organization({
                ORGANIZATION_NAME: payload.ORGANIZATION_NAME,
                ORGANIZATION_EMAIL: payload.ORGANIZATION_EMAIL,
                ORGANIZATION_PHONE: payload.ORGANIZATION_PHONE,
                ORGANIZATION_ACTIVE: false,

                PACKAGE:payload.PACKAGE,
                


                IS_APPROVED: null
            });
            // Lưu vào cơ sở dữ liệu
            const result = await newOrganization.save();
            return result._doc;
        } catch (error) {
            throw new Error('Unable to create organization: ' + error.message);
        }
    };

    UpdateUser = async (UserId, data_update) => {
        try {
            // Tiếp tục cập nhật thông tin người dùng
            const user = await User.findOneAndUpdate(
                { _id: UserId },
                data_update
            );
            return user;
        } catch (error) {
            return { message: error.message, status: 500 };
        }
    };

    checkOrganizationNameExists = async (organizationName) => {
        try {
            // Chuyển organizationName sang chữ thường
            const normalizedOrganizationName = organizationName.toLowerCase();
            // Tìm tổ chức với Organization_name chuyển sang chữ thường
            const organization = await Organization.findOne({
                ORGANIZATION_NAME: { $regex: `^${normalizedOrganizationName}$`, $options: 'i' }
            });
            // Nếu tổ chức tồn tại, trả về true, ngược lại trả về false
            return !!organization;
        } catch (error) {
            // Xử lý lỗi nếu có
            throw new Error('Unable to check if Organization_name exists: ' + error.message);
        }
    };
}

module.exports = new ORGANIZATION_SERVICE();