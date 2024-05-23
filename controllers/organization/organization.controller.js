const { registerOrganization } = require('../../models/organization/validate/index');
const organizationService = require('../../service/organization/organization.service');
class ORGANIZATION_CONTROLLER {
    registerOrganization = async (req, res) => {
        try {
            const payload = req.body;

            // Validate payload
            const { error } = registerOrganization.validate(payload, { abortEarly: false });

            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid data',
                    errors: error.details.map(detail => detail.message)
                });
            }

            const UserId = req.user_id;

            const organizationName = payload.ORGANIZATION_NAME;

            // Kiểm tra xem Organization_name đã tồn tại hay chưa
            const organizationNameExists = await organizationService.checkOrganizationNameExists(organizationName);
            if (organizationNameExists) {
                return res.status(400).json({
                    success: false,
                    message: 'Organization name already exists',
                });
            }

            const newOrganization = await organizationService.registerOrganization(payload);

            const data_update = {
                ORGANIZATION_ID: newOrganization._id,
                "ROLE.IS_ORGANIZATION": true
            };

            await organizationService.UpdateUser(UserId, data_update);

            return res.status(201).json({
                success: true,
                message: 'The organization has been created successfully.',
                data: newOrganization
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: err.message
            });
        }
    };
}

module.exports = new ORGANIZATION_CONTROLLER();