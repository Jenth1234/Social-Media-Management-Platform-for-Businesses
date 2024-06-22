const Organization = require('../../models/organization/organization.model');
const User = require('../../models/user/user.model');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const MetadataCommentProduct = require('../../models/metadata_cmt_product/metadatacmtproduct.model');

class ORGANIZATION_SERVICE {
    registerOrganization = async (payload) => {
        try {
            const newOrganization = new Organization({
                ORGANIZATION_NAME: payload.ORGANIZATION_NAME,
                ORGANIZATION_EMAIL: payload.ORGANIZATION_EMAIL,
                ORGANIZATION_PHONE: payload.ORGANIZATION_PHONE,
                REGISTER_DATE: new Date(),
                ORGANIZATION_ACTIVE: {
                    TIME: null,
                    CHECK: false,
                    ACTIVE_BY_USER_ID: null
                },
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
        const normalizedOrganizationName = organizationName.toLowerCase();
        const organization = await Organization.findOne({
            ORGANIZATION_NAME: { $regex: `^${normalizedOrganizationName}$`, $options: 'i' }
        });
        return !!organization;
    };

    registerAccountOfOrganization = async (body) => {
        try {
            const hash = await this.hashPassword(body.PASSWORD);
            const newUser = new User({
                USERNAME: body.USERNAME,
                PASSWORD: hash,
                FULLNAME: body.FULLNAME,
                EMAIL: body.EMAIL,
                IS_BLOCKED: null,
                ROLE: {
                    IS_ADMIN: false,
                    IS_ORGANIZATION: false,
                },
                ADDRESS: body.ADDRESS,
                GENDER: body.GENDER,
                IS_ACTIVATED: false,
                ORGANIZATION_ID: body.organizationId
            });
            const result = await newUser.save();
            return result._doc;
        } catch (error) {
            throw new Error('Không thể thêm tài khoản con: ' + error.message);
        }
    };

    loginToOrganization = async (payload) => {
        const secret = process.env.ACCESS_TOKEN_SECRET_2;
        const expiresIn = "5h";
        const accessToken = jwt.sign(payload, secret, { expiresIn });
        return accessToken;
    };

    hashPassword = async (password) => {
        const saltRounds = 10;
        const hash = await bcrypt.hashSync(password, saltRounds);
        return hash;
    };

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
            active: ORGANIZATION_ACTIVE.CHECK,
            approved: OBJECT_APPROVED.CHECK,
            approvalTime: OBJECT_APPROVED.TIME,
            approvedBy: OBJECT_APPROVED.APPROVED_BY_USER_ID
        };
    };

    getUsersByOrganization = async (organizationId, page = 1, limit = 5, search = '') => {
        const skip = (page - 1) * limit;
        let query = { ORGANIZATION_ID: organizationId };

        if (search) {
            query.$or = [
                { USERNAME: { $regex: new RegExp(search, 'i') } },
                { FULLNAME: { $regex: new RegExp(search, 'i') } }
            ];
        }

        const users = await User.find(query)
            .skip(skip)
            .limit(limit)
            .select('USERNAME EMAIL FULLNAME ADDRESS GENDER IS_BLOCKED.CHECK');

        const totalUsers = await User.countDocuments(query);
        const totalPages = Math.ceil(totalUsers / limit);

        return {
            users,
            totalUsers,
            totalPages,
            currentPage: page
        };
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

    //organization

    checkUserHasOrganization = async (UserId) => {

        const user = await User.findById(UserId);
        return user && user.ORGANIZATION_ID ? true : false;

    };

    findUserByIdAndOrganization = async (userId, organizationId) => {
        return await User.findOne({ _id: userId, ORGANIZATION_ID: organizationId })
    };

    getUserDetails = async (userId) => {
        return await User.findOne({ _id: userId })
            .select('USERNAME EMAIL FULLNAME ADDRESS GENDER IS_BLOCKED.CHECK');
    };

    lockUserByOrganization = async (userId, organizationId, currentUserId) => {
        try {
            const user = await this.findUserByIdAndOrganization(userId, organizationId);

            if (!user) {
                throw new Error('Người dùng không tồn tại hoặc không thuộc về tổ chức này.');
            }

            user.IS_BLOCKED = {
                TIME: new Date(),
                CHECK: true,
                BLOCK_BY_USER_ID: currentUserId
            };

            await user.save();
            return user;
        } catch (error) {
            throw new Error('Không thể khóa người dùng: ' + error.message);
        }
    };

    unlockUserByOrganization = async (userId, organizationId, currentUserId) => {
        try {
            const user = await this.findUserByIdAndOrganization(userId, organizationId);

            if (!user) {
                throw new Error('Người dùng không tồn tại hoặc không thuộc về tổ chức này.');
            }

            user.IS_BLOCKED = {
                TIME: new Date(),
                CHECK: false,
                BLOCK_BY_USER_ID: currentUserId
            };

            await user.save();
            return user;
        } catch (error) {
            throw new Error('Không thể mở khóa người dùng: ' + error.message);
        }
    };

    getProductsWithCommentCount = async (organizationId) => {

        const productsWithComments = await MetadataCommentProduct.find({ ORGANIZATION_ID: organizationId })
            .select('PRODUCT_ID COMMENT_COUNT');

        return productsWithComments;
    };

    getOrganizations = async (page, perPage) => {
        const skip = (page - 1) * perPage;

        // Projection để chỉ lấy các trường mong muốn
        const organizations = await Organization.find({})
            .select('_id ORGANIZATION_NAME ORGANIZATION_EMAIL ORGANIZATION_PHONE ORGANIZATION_ACTIVE.CHECK OBJECT_APPROVED.CHECK REGISTER_DATE PACKAGE')
            .skip(skip)
            .limit(perPage)
            .lean();

        const organizationsWithUserCount = await Promise.all(
            organizations.map(async (org) => {
                const userCount = await User.countDocuments({ ORGANIZATION_ID: org._id });
                return {
                    _id: org._id,
                    ORGANIZATION_NAME: org.ORGANIZATION_NAME,
                    ORGANIZATION_EMAIL: org.ORGANIZATION_EMAIL,
                    ORGANIZATION_PHONE: org.ORGANIZATION_PHONE,
                    ORGANIZATION_ACTIVE: org.ORGANIZATION_ACTIVE,
                    OBJECT_APPROVED: org.OBJECT_APPROVED,
                    REGISTER_DATE: org.REGISTER_DATE,
                    PACKAGE: org.PACKAGE,
                    USER_COUNT: userCount
                };
            })
        );

        return {
            total: await Organization.countDocuments(),
            perPage: perPage,
            currentPage: page,
            data: organizationsWithUserCount
        };
    };




}

module.exports = new ORGANIZATION_SERVICE();
