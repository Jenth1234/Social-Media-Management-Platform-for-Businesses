const Organization = require('../../models/organization/organization.model');
const User = require('../../models/user/user.model');
class ORGANIZATION_SERVICE {
    registerOrganization = async (payload) => {
        try {
            // Create a new organization
            const newOrganization = new Organization({
                ORGANIZATION_NAME: payload.ORGANIZATION_NAME,
                ORGANIZATION_EMAIL: payload.ORGANIZATION_EMAIL,
                ORGANIZATION_PHONE: payload.ORGANIZATION_PHONE,
                ORGANIZATION_ACTIVE: false,
                IS_APPROVED: null
            });
            // Save to the database
            await newOrganization.save();
            return newOrganization;
        } catch (error) {
            throw new Error('Unable to create organization: ' + error.message);
        }
    };

    UpdateUser = async (UserId, updateData) => {
        try {

            const User = await User.findOneAndUpdate(
                {
                    _id: UserId
                },
                updateData
            );
            return User

        } catch (error) {
            return { message: error.message, status: 500 };
        }
    }
}

module.exports = new ORGANIZATION_SERVICE();
