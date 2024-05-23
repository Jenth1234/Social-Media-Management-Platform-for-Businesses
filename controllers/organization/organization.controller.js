const Organization = require('../../models/organization/organization.model')
const organizationService = require('../../service/organization/organization.service');
class ORGANIZATION_CONTROLLER{
    createOrganization = async (req, res) => {
        try {
            const payload = req.body;

        // Validate payload
        const { error } = organizationSchema.validate(payload, {
        abortEarly: false,
        });

        if (error) {
        return res.status(400).json({
            success: false,
            message: "Invalid data",
            errors: error.details.map((detail) => detail.message),
        });
        }

        const newOrganization = await organizationService.createOrganization(
        payload
        );

        return res.status(201).json({
        success: true,
        message: "The organization has been created successfully.",
        data: newOrganization,
        });
    } catch (err) {
        return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: err.message,
        });
    }
    };
};///
module.exports = new ORGANIZATION_CONTROLLER();
