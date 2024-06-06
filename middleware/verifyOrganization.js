const Joi = require('joi');
const { validateHeader } = require('../models/organization/validate/index');
const organizationService = require('../service/organization/organization.service');

const verifyOrganization = async (req, res, next) => {
    // Xác thực ID tổ chức
    const organizationId = req.header('ORGANIZATION_ID');
    const headerValidationResult = validateHeader.validate({ ORGANIZATION_ID: organizationId });
    if (headerValidationResult.error) {
        return res.status(400).json({
            success: false,
            message: headerValidationResult.error.message,
        });
    }

    const organizationStatus = await organizationService.checkOrganizationStatus(organizationId);

    if (!organizationStatus.exists) {
        return res.status(400).json({
            success: false,
            message: 'Tổ chức không tồn tại',
        });
    }
    if (!organizationStatus.active) {
        return res.status(400).json({
            success: false,
            message: 'Tổ chức này đã dừng hoạt động',
        });
    }
    if (!organizationStatus.approved) {
        return res.status(400).json({
            success: false,
            message: 'Tổ chức này chưa được phê duyệt',
        });
    }

    req.organizationId = organizationId;

    next();
};

module.exports = verifyOrganization;
