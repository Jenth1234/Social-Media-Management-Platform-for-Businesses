const { registerOrganization, loginToOrganization, registerAccountOfOrganization } = require('../../models/organization/validate/index');
const organizationService = require('../../service/organization/organization.service');
const userService = require('../../service/user/user.service');
const MailService = require('../../utils/send.mail');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
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

            const UserId = req.user;

            // Kiểm tra xem người dùng đã đăng ký tổ chức chưa
            const userHasOrganization = await organizationService.checkUserHasOrganization(UserId);
            if (userHasOrganization) {
                return res.status(400).json({
                    success: false,
                    message: 'Người dùng này đã đăng ký tổ chức',
                });
            }

            const organizationName = payload.ORGANIZATION_NAME;

            // Kiểm tra xem Organization_name đã tồn tại hay chưa
            const organizationNameExists = await organizationService.checkOrganizationNameExists(organizationName);
            if (organizationNameExists) {
                return res.status(400).json({
                    success: false,
                    message: 'Tổ chức này đã được đăng ký.',
                });
            }

            const newOrganization = await organizationService.registerOrganization(payload);
            newOrganization.REGISTER_DATE = new Date();

            const data_update = {
                ORGANIZATION_ID: newOrganization._id,
                "ROLE.IS_ORGANIZATION": true
            };

            await organizationService.UpdateUser(UserId, data_update);

            return res.status(201).json({
                success: true,
                message: 'Đăng ký tổ chức thành công.',
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

    //const authHeader = req.header('ORGANIZATION_ID');

    registerAccountOfOrganization = async (req, res) => {
        try {
            // const organizationId = req.header('ORGANIZATION_ID');

            // const organizationStatus = await organizationService.checkOrganizationStatus(organizationId);
            // if (!organizationStatus.exists) {
            //     return res.status(400).json({
            //         success: false,
            //         message: 'Tổ chức không tồn tại',
            //     });
            // }
            // if (!organizationStatus.active) {
            //     return res.status(400).json({
            //         success: false,
            //         message: 'Tổ chức này đã dừng hoạt động',
            //     });
            // }
            // if (!organizationStatus.approved) {
            //     return res.status(400).json({
            //         success: false,
            //         message: 'Tổ chức này chưa được cấp phép',
            //     });
            // }

            const { USERNAME, EMAIL, PASSWORD, FULLNAME, ADDRESS, GENDER } = req.body;

            // Kiểm tra account đã được tạo chưa?
            const accountExists = await organizationService.checkAccountExists(USERNAME, EMAIL);
            if (accountExists) {
                return res.status(400).json({
                    success: false,
                    message: 'Tên người dùng hoặc địa chỉ email đã được sử dụng.',
                });
            }

            const { error } = registerAccountOfOrganization.validate(req.body, { abortEarly: false });
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid data',
                    errors: error.details.map(detail => detail.message)
                });
            }

            const newSubAccount = await organizationService.registerAccountOfOrganization({
                USERNAME,
                EMAIL,
                PASSWORD,
                FULLNAME,
                ADDRESS,
                GENDER,
                organizationId
            });

            // Gửi email xác nhận
            const sendMail = await MailService.sendVerifyEmail(EMAIL);

            // Xử lý hàng đợi gửi email
            await MailService.processMailQueue();

            return res.status(201).json({
                success: true,
                message: 'Đăng ký tài khoản tổ chức thành công.',
                data: newSubAccount
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: err.message
            });
        }
    };


    loginToOrganization = async (req, res) => {
        try {
            const payload = req.body;
            const { error } = loginToOrganization.validate(payload);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid data',
                    errors: error.details.map(detail => detail.message)
                });
            }

            const organizationId = req.header('ORGANIZATION_ID');

            // Kiểm tra xem người dùng có tồn tại và chưa bị khóa không
            const existingUser = await userService.checkUsernameExists(payload.USERNAME);
            if (!existingUser) {
                return res
                    .status(401)
                    .json({ message: "Tài khoản hoặc mật khẩu không chính xác" });
            }
            const passwordValid = await userService.checkPassword(
                payload.PASSWORD,
                existingUser.PASSWORD
            );
            if (!passwordValid) {
                return res
                    .status(401)
                    .json({ message: "Tài khoản hoặc mật khẩu không chính xác" });
            }

            if (existingUser.IS_BLOCKED && existingUser.IS_BLOCKED.CHECK === true) {
                return res.status(400).json({
                    success: false,
                    message: 'Tài khoản này đã bị khóa.'
                });
            }

            if (existingUser.ORGANIZATION_ID.toString() !== organizationId) {
                return res.status(400).json({
                    success: false,
                    message: 'Tổ chức bạn đang đăng nhập không chính xác'
                });
            }
            const data = {
                userId: existingUser._id,
                organizationId: existingUser.ORGANIZATION_ID
            }
            const accessToken = await organizationService.loginToOrganization(data);
            return res.status(200).json({
                errorCode: 0,
                message: "Logged in successfully!!",
                metadata: accessToken,
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: err.message
            });
        }
    };

    getUsersByOrganization = async (req, res) => {
        try {
            const organizationId = req.header('ORGANIZATION_ID');
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;

            const result = await organizationService.getUsersByOrganization(organizationId, page, limit);

            return res.status(200).json({
                success: true,
                data: result.users,
                totalUsers: result.totalUsers,
                totalPages: result.totalPages,
                currentPage: result.currentPage
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: err.message
            });
        }
    };

    editOrganization = async (req, res) => {
        try {
            const organizationId = req.header('ORGANIZATION_ID');
            const newData = req.body;

            const result = await organizationService.editOrganization(organizationId, newData);

            if (result) {
                return res.status(200).json({
                    success: true,
                    message: 'Hiệu chỉnh thông tin tổ chức thành công.',
                    data: {
                        ORGANIZATION_ID: result._id,
                        ORGANIZATION_NAME: result.ORGANIZATION_NAME,
                        ORGANIZATION_EMAIL: result.ORGANIZATION_EMAIL,
                        ORGANIZATION_PHONE: result.ORGANIZATION_PHONE
                    }
                });
            } else {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy tổ chức này'
                });
            }
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }
    };

    toggleBlockUserByOrganization = async (req, res) => {
        try {
            const { userId } = req.params;
            const organizationId = req.header('ORGANIZATION_ID');
            const currentUserId = req.user;

            // Tìm người dùng
            const user = await organizationService.findUserByIdAndOrganization(userId, organizationId);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Người dùng không tồn tại hoặc không thuộc về tổ chức này.'
                });
            }

            let result;
            if (user.IS_BLOCKED?.CHECK === true) {
                result = await organizationService.unlockUserByOrganization(userId, organizationId, currentUserId);
            } else {
                result = await organizationService.lockUserByOrganization(userId, organizationId, currentUserId);
            }

            return res.status(200).json({
                success: true,
                message: user.IS_BLOCKED?.CHECK === true ? 'Người dùng đã được mở khóa.' : 'Người dùng đã bị khóa bởi tổ chức.',
                data: {
                    IS_BLOCKED: result.IS_BLOCKED,
                    USER_ID: result._id,
                    ORGANIZATION_ID: result.ORGANIZATION_ID
                }
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: err.message
            });
        }
    };

    getProductsWithCommentCount = async (req, res) => {
        try {
            const organizationId = req.header('ORGANIZATION_ID');

            const products = await organizationService.getProductsWithCommentCount(organizationId);

            return res.status(200).json({
                success: true,
                data: products
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: err.message
            });
        }
    };

    getOrganizations = async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage) || 5;

        try {
            const result = await organizationService.getOrganizations(page, perPage);

            return res.status(200).json({
                success: true,
                total: result.total,
                currentPage: result.currentPage,
                perPage: result.perPage,
                data: result.data
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: err.message
            });
        }
    };


    getUserDetails = async (req, res) => {
        try {
            const { userId } = req.params;

            const user = await organizationService.getUserDetails(userId);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Người dùng không tồn tại hoặc không thuộc về tổ chức này.'
                });
            }

            return res.status(200).json({
                success: true,
                data: {
                    USER_ID: user._id,
                    USERNAME: user.USERNAME,
                    EMAIL: user.EMAIL,
                    FULLNAME: user.FULLNAME,
                    ADDRESS: user.ADDRESS,
                    GENDER: user.GENDER,
                    IS_BLOCKED: user.IS_BLOCKED.CHECK
                }
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
