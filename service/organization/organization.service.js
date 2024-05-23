const Organization = require('../../models/organization/organization.model');
const User = require('../../models/user/user.model');

class ORGANIZATION_SERVICE {
    registerOrganization = async (payload) => {
        try {
            const newOrganization = new Organization({
                ORGANIZATION_NAME: payload.ORGANIZATION_NAME,
                ORGANIZATION_EMAIL: payload.ORGANIZATION_EMAIL,
                ORGANIZATION_PHONE: payload.ORGANIZATION_PHONE,
                ORGANIZATION_ACTIVE: false,
                IS_APPROVED: null
            });
            const result = await newOrganization.save();
            return result._doc;
        } catch (error) {
            throw new Error('Unable to create organization: ' + error.message);
        }
    };

    UpdateUser = async (UserId, data_update) => {
        try {
            const user = await User.findOneAndUpdate(
                { _id: UserId },
                data_update,
                { new: true }
            );
            if (data_update.ORGANIZATION_ID) {
                await Organization.findByIdAndUpdate(
                    data_update.ORGANIZATION_ID,
                    { $push: { USERS: UserId } }
                );
            }
            return user;
        } catch (error) {
            return { message: error.message, status: 500 };
        }
    };

    checkOrganizationNameExists = async (organizationName) => {
        try {
            const normalizedOrganizationName = organizationName.toLowerCase();
            const organization = await Organization.findOne({
                ORGANIZATION_NAME: { $regex: `^${normalizedOrganizationName}$`, $options: 'i' }
            });
            return !!organization;
        } catch (error) {
            throw new Error('Unable to check if Organization_name exists: ' + error.message);
        }
    };
}

module.exports = new ORGANIZATION_SERVICE();
