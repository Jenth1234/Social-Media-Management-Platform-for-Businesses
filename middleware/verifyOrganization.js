const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Joi = require('joi');
const { validateHeader } = require('../models/organization/validate/index');
const organizationService = require('../service/organization/organization.service');

dotenv.config();

const verifyOrganization = async (req, res, next) => {
    // Xác thực token
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Authorization token is required.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRECT);
        req.user = decoded;
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token.' });
    }

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
