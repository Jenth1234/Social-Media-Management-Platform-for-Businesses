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

    // checkUserIdHasOrganizationId = async (UserId) => {
    //     try {
    //         // Tìm người dùng với UserId
    //         const user = await User.findById({ _id: UserId });
    //         // Kiểm tra nếu người dùng đã có ORGANIZATION_ID
    //         return !!user && !!user.toObject.ORGANIZATION_ID;
    //     } catch (error) {
    //         // Xử lý lỗi nếu có
    //         throw new Error('Unable to check if UserId has OrganizationId: ' + error.message);
    //     }
    // };

    checkOrganizationNameExists = async (organizationName) => {
        try {
            // Tìm tổ chức có Organization_name tương ứng
            const organization = await Organization.findOne({ ORGANIZATION_NAME: organizationName });
            // Nếu tổ chức tồn tại, trả về true, ngược lại trả về false
            return !!organization;
        } catch (error) {
            // Xử lý lỗi nếu có
            throw new Error('Unable to check if Organization_name exists: ' + error.message);
        }
    };
}

module.exports = new ORGANIZATION_SERVICE();
