const Organization = require('../../models/organization/organization.model');
const User = require('../../models/user/user.model');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

class ORGANIZATION_SERVICE {
    registerOrganization = async (payload) => {
        try {
            const newOrganization = new Organization({
                ORGANIZATION_NAME: payload.ORGANIZATION_NAME,
                ORGANIZATION_EMAIL: payload.ORGANIZATION_EMAIL,
                ORGANIZATION_PHONE: payload.ORGANIZATION_PHONE,
                ORGANIZATION_ACTIVE: false,
                OBJECT_APPROVED: {
                    TIME: null,
                    CHECK: false,
                    APPROVED_BY_USER_ID: null
                }
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

    authenticate = async (username, password) => {
        try {
            const user = await User.findOne({ USERNAME: username });
            if (!user) return { error: 'Invalid username' };

            const isPasswordValid = await bcrypt.compare(password, user.PASSWORD);
            if (!isPasswordValid) return { error: 'Invalid password' };

            return user;
        } catch (error) {
            throw new Error('Unable to authenticate user: ' + error.message);
        }
    };

    generateToken = (user) => {
        const payload = {
            id: user._id,
            username: user.USERNAME,
            organizationId: user.ORGANIZATION_ID
        };
        const secret = process.env.ACCESS_TOKEN_SECRECT;
        const options = { expiresIn: '1h' };

        return jwt.sign(payload, secret, options);
    };

    registerAccountOfOrganization = async (body) => {
        try {
            const hash = await this.hashPassword(body.PASSWORD);
            const newUser = new User({
                USERNAME: body.USERNAME,
                PASSWORD: hash,
                FULL_NAME: body.FULL_NAME,
                EMAIL: body.EMAIL,
                IS_BLOCKED: null,
                ROLE: {
                    IS_ADMIN: false,
                    IS_ORGANIZATION: false,
                },
                ORGANIZATION_ID: body.organizationId
            });
            const result = await newUser.save();
            return result._doc;
        } catch (error) {
            throw new Error('Unable to add sub account: ' + error.message);
        }
    };

    hashPassword = async (password) => {
        const saltRounds = 10;
        const hash = await bcrypt.hashSync(password, saltRounds);
        return hash;
    };

    // checkOrganizationExists = async (organizationId) => {
    //     const organization = await Organization.findById(organizationId);
    //     return organization;
    // };

    checkAccountExists = async (username, email) => {
        try {
            const userByUsername = await User.findOne({ USERNAME: username });
            const userByEmail = await User.findOne({ EMAIL: email });
            return !!userByUsername || !!userByEmail;
        } catch (error) {
            throw new Error('Unable to check if account exists: ' + error.message);
        }
    };

    checkOrganizationStatus = async (organizationId) => {
        const organization = await Organization.findById(organizationId);
        if (!organization) {
            return { exists: false };
        }
        const { ORGANIZATION_ACTIVE, OBJECT_APPROVED } = organization;
        return {
            exists: true,
            active: ORGANIZATION_ACTIVE,
            approved: OBJECT_APPROVED.CHECK,
            approvalTime: OBJECT_APPROVED.TIME,
            approvedBy: OBJECT_APPROVED.APPROVED_BY_USER_ID
        };
    };

    getUsersByOrganization = async (organizationId, page = 1, limit = 10) => {
        const skip = (page - 1) * limit;
        const users = await User.find({ ORGANIZATION_ID: organizationId })
            .skip(skip)
            .limit(limit);
        const totalUsers = await User.countDocuments({ ORGANIZATION_ID: organizationId });
        const totalPages = Math.ceil(totalUsers / limit);

        return {
            users,
            totalUsers,
            totalPages,
            currentPage: page
        };
    };

    deleteUserByOrganization = async (userId) => {
        const result = await User.findByIdAndDelete(userId);
        return result;
    };

    editOrganization = async (organizationId, newData) => {
        const allowedFields = ['ORGANIZATION_NAME', 'ORGANIZATION_EMAIL', 'ORGANIZATION_PHONE'];
        const updateData = {};

        const invalidFields = Object.keys(newData).filter(field => !allowedFields.includes(field));

        if (invalidFields.length > 0) {
            throw new Error(`Bạn không được phép thay đổi thuộc tính này: ${invalidFields.join(', ')}`);
        }

        if (newData.ORGANIZATION_NAME) {
            const existingOrganization = await Organization.findOne({
                ORGANIZATION_NAME: { $regex: new RegExp(`^${newData.ORGANIZATION_NAME}$`, 'i') }
            });

            if (existingOrganization && existingOrganization._id.toString() !== organizationId) {
                throw new Error('Tên tổ chức này đã tồn tại');
            }
        }

        for (const field of allowedFields) {
            if (newData[field]) {
                updateData[field] = newData[field];
            }
        }

        const result = await Organization.findByIdAndUpdate(organizationId, updateData, { new: true });
        return result;
    };
}

module.exports = new ORGANIZATION_SERVICE();
