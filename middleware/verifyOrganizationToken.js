const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/user/user.model');
const USER_SERVICE = require('../service/user/user.service');

dotenv.config();

const verifyOrganizationToken = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    const organizationId = req.header('ORGANIZATION_ID');

    if (!token) {
        return res.status(401).json({ message: 'Authorization token is required.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_2);
        const userId = decoded.userId;
        const userOrganizationId = decoded.organizationId;
        const userInfo = await USER_SERVICE.getUserInfo(userId);
        req.user = userInfo;

        if (!req.user || !req.user.ROLE || !req.user.ROLE.IS_ORGANIZATION) {
            return res.status(403).json({ message: 'Truy cập thất bại, thao tác vừa rồi chỉ tài khoản thuộc tổ chức được thực hiện.' });
        }

        if (!organizationId || userOrganizationId !== organizationId) {
            return res.status(403).json({ message: 'Truy cập bị từ chối, tài khoản không thuộc tổ chức' });
        }

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token.' });
    }
};

module.exports = verifyOrganizationToken;
