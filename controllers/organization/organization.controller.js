const { registerOrganization, loginToOrganization, registerAccountOfOrganization } = require('../../models/organization/validate/index');
const organizationService = require('../../service/organization/organization.service');
const userService = require('../../service/user/user.service');
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

            const UserId = req.user_id;

            // Kiểm tra xem người dùng đã đăng ký tổ chức chưa
            const userHasOrganization = await userService.checkUserHasOrganization(UserId);
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
            const organizationId = req.header('ORGANIZATION_ID');

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
                    message: 'Tổ chức này chưa được cấp phép',
                });
            }

            const { USERNAME, EMAIL, PASSWORD, FULL_NAME } = req.body;

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
                FULL_NAME,
                organizationId
            });

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
            const { error } = loginToOrganization.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid data',
                    errors: error.details.map(detail => detail.message)
                });
            }

            const { USERNAME, PASSWORD } = req.body;
            const organizationId = req.header('ORGANIZATION_ID');



            const user = await organizationService.authenticate(USERNAME, PASSWORD);
            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: 'Tài khoản hoặc mật khẩu không đúng.'
                });
            }

            if (user.ORGANIZATION_ID.toString() !== organizationId) {
                return res.status(400).json({
                    success: false,
                    message: 'Tổ chức không hợp lệ'
                });
            }

            const token = organizationService.generateToken(user);

            return res.status(200).json({
                success: true,
                message: 'Đăng nhập thành công',
                token: token,
                user: {
                    id: user._id,
                    username: user.USERNAME,
                    organizationId: user.ORGANIZATION_ID
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

    deleteUserByOrganization = async (req, res) => {
        try {
            const userId = req.params.userId;
            const result = await organizationService.deleteUserByOrganization(userId);

            if (result) {
                return res.status(200).json({
                    success: true,
                    message: 'Đã xóa người dùng thành công.'
                });
            } else {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy người dùng này.'
                });
            }
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
                    data: result
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


}

module.exports = new ORGANIZATION_CONTROLLER();
