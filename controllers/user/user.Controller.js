const user = require("../../models/user/user.model");
const MailService = require("../../utils/send.mail");
const USER_SERVICE = require("../../service/user/user.service");
const { upload } = require("../azure/azure.controller");
// const {sendForgotPasswordEmail, verifyOTP} = require("../../utils/send.mail")
const MailQueue = require("../../utils/send.mail");
const { storeMetadata } = require("../../service/azure/azure.Service");

const {
  registerValidate,
  updateUserValidate,
  loginValidate,
  validateUserId,
  validateOrganizationId,
} = require("../../models/user/validate/index");
const { response } = require("express");
class USER_CONTROLLER {
  registerUser = async (req, res) => {
    const payload = req.body;
    const { error, value } = registerValidate.validate(payload);
  
    if (error) {
      const errors = error.details.reduce((acc, current) => {
        acc[current.context.key] = current.message;
        return acc;
      }, {});
      return res.status(400).json({ errors });
    }
  
    const { USERNAME, EMAIL } = value;
  
    const otpType = 'create_account';
  
    try {
      const existingUser = await USER_SERVICE.checkUsernameExists(USERNAME);
      if (existingUser) {
        return res.status(400).json({ errors: { USERNAME: "Username đã tồn tại" } });
      }
  
      const existingEmail = await USER_SERVICE.checkEmailExists(EMAIL);
      if (existingEmail) {
        return res.status(400).json({ errors: { EMAIL: "Email đã tồn tại" } });
      }
  
      // Tải lên ảnh đại diện nếu tồn tại
      if (req.file) {
        const avatarUrl = await upload(req.file);
        if (!avatarUrl) {
          throw new Error("Tải lên ảnh đại diện thất bại");
        }
  
        const avatarMetadata = await storeMetadata(req.file.originalname, "Avatar image", req.file.mimetype, avatarUrl);
  
        payload.AVATAR = avatarMetadata._id; 
      }
  
      await USER_SERVICE.registerUser(payload);
      const sendMail = await MailQueue.sendVerifyEmail(EMAIL, otpType);
      if (!sendMail) {
        throw new Error("Gửi email xác minh thất bại");
      }
  
      return res.status(201).json({
        success: true,
        message: "Đăng ký người dùng thành công. Vui lòng kiểm tra email để xác thực.",
      });
  
    } catch (err) {
      return res.status(500).json({ errors: { general: "Đăng ký người dùng thất bại" } });
    }
  };
  
 forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
      const existingEmail = await USER_SERVICE.checkEmailExists(email);
      if (!existingEmail) {
        return res.status(404).json({ message: "Email not found!!" });
      }
      const sendMail = await MailQueue.sendForgotPasswordEmail(email);
      if (!sendMail) {
        throw new Error("Gửi email xác minh thất bại");
      }

      return res.status(201).json({
        message:
          "Vui lòng kiểm tra email để xác thực.",
      });

    } catch (error) {
      console.error("Error handling forgot password request:", error);
      return res
        .status(500)
        .json({ message: "Đã xảy ra lỗi khi xử lý yêu cầu." });
    }
  };

  ResendOTP = async (req, res) => {
    try {
      const { email } = req.body;
      const existingEmail = await USER_SERVICE.checkEmailExists(email);
      if (!existingEmail) {
        return res.status(404).json({ message: "Email not found!!" });
      }
      const sendMail = await MailQueue.ResendOtp(email);
      if (!sendMail) {
        throw new Error("Gửi email xác minh thất bại");
      }

      return res.status(201).json({
        message:
          "Vui lòng kiểm tra email của bạn.",
      });

    } catch (error) {
      console.error("Error handling resendOTP request:", error);
      return res
        .status(500)
        .json({ message: "Đã xảy ra lỗi khi xử lý yêu cầu." });
    }
  };

  resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    try {
      const isValid = await MailService.verifyOTP(email, otp, "reset_password");
      if (!isValid) {
        return res.status(500).json({ error: "Invalid or expired OTP." });
      }
      await USER_SERVICE.resetPassword(email, newPassword);
      return res
        .status(200)
        .json({ message: "Password reset was successfully." });
    } catch (err) {
      res.status(500).json({ error: "Error resetting password" });
    }
  };

  verifyOTPAndActivateUser = async (req, res) => {
    const { email, otp } = req.body;
  
    try {
      const user = await USER_SERVICE.verifyOTPAndActivateUser(email, otp);
  
      if (!user) {
        return res.status(404).json({ errors: { otp: "Mã OTP không chính xác" } });
      }
  
      const otpDetail = user.OTP.find((item) => item.CODE === otp);
      const currentTime = Date.now();
  
      if (otpDetail.EXP_TIME < currentTime) {
        return res.status(400).json({ errors: { otp: "Mã OTP đã hết hạn" } });
      }
  
      res.status(200).json({ message: "Kích hoạt người dùng thành công!", user });
    } catch (error) {
      console.error("Error verifying OTP and activating user:", error);
      res.status(400).json({ errors: { otp: error.message } });
    }
  };
  

  getUsers = async (req, res) => {
    try {
      const { tabStatus, page, limit, search } = req.query;
      const users = await USER_SERVICE.getUsers(
        tabStatus,
        parseInt(page),
        parseInt(limit),
        search
      );
      res.status(200).json(users);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  getTotalUsers = async (req, res) => {
    try {
      const totalUsers = await USER_SERVICE.countUsers();
      res.status(200).json({ total: totalUsers });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  login = async (req, res) => {
    const payload = req.body;
    console.log(payload);
    const { error } = loginValidate.validate(payload);
    if (error) {
      return res.status(401).json({ message: error.details[0].message });
    }
    // Check for exiting user
    const existingUser = await USER_SERVICE.checkUsernameExists(
      payload.USERNAME
    );
    if (!existingUser) {
      return res
        .status(401)
        .json({ message: "Invalid account or password!!!" });
    }
    const passwordValid = await USER_SERVICE.checkPassword(
      payload.PASSWORD,
      existingUser.PASSWORD
    );
    if (!passwordValid) {
      return res
        .status(401)
        .json({ message: "Invalid account or password !!!" });
    }
    const data_sign = {
      userId: existingUser._id,
    };
    const accessToken = await USER_SERVICE.login(data_sign);
    return res.status(200).json({
      errorCode: 0,
      metadata: accessToken,
      message: existingUser,
    });
  };
  updateUser = async (req, res) => {
    const payload = req.body;
    const { error, value } = updateUserValidate.validate(payload);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    console.log(req.headers);
    try {
      const userId = req.user;
      const updatedUser = await USER_SERVICE.updateUser(userId, value);
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(400).json({ message: "Cập nhật người dùng thất bại" });
    }
  };

//   updateUser = async (req, res) => {
//     const payload = req.body;

//     // Lọc bỏ các trường không hợp lệ
//     const allowedFields = ['USERNAME', 'FULLNAME', 'EMAIL', 'ADDRESS', 'GENDER'];
//     const filteredPayload = Object.keys(payload)
//         .filter(key => allowedFields.includes(key))
//         .reduce((obj, key) => {
//             obj[key] = payload[key];
//             return obj;
//         }, {});

//     const { error, value } = updateUserValidate.validate(filteredPayload);

//     if (error) {
//         return res.status(400).json({ message: error.details[0].message });
//     }

//     try {
//         const userId = req.user;
//         const updatedUser = await USER_SERVICE.updateUser(userId, value);
//         res.status(200).json(updatedUser);
//     } catch (err) {
//       console.error("Lỗi khi cập nhật người dùng:", err);
//         res.status(400).json({ message: "Cập nhật người dùng thất bại" });
//     }
// };


  login_admin = async (req, res) => {
    try {
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  getUserInfo = async (req, res) => {
    try {
      const userInfo = req.user;
      res.json(userInfo);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  getUserInfoAdmin = async (req, res) => {
    try {
      const userInfo = req.user;
      const IS_ADMIN = userInfo.ROLE.IS_ADMIN;
      if (!IS_ADMIN) {
        return res.status(400).json({ error: "Invalid!!!" });
      }

      res.json(userInfo);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // checkAdmin = async (req, res, next) => {
  //   try {
  //     const userInfo = req.user;
  //     const IS_ADMIN = userInfo.ROLE.IS_ADMIN;
  //     if (!IS_ADMIN) {
  //       return res.status(403).json({ error: 'Access denied. Admins only.' });
  //     }
  //     next();
  //   } catch (error) {
  //     res.status(500).json({ error: error.message });
  //   }
  // };

  blockUser = async (req, res) => {
    const payload = req.body;
    const { userId } = payload;
    const blocked_byuserid = req.user_id;

    // Validate userId
    const { error } = validateUserId(userId);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    try {
      const updatedUser = await USER_SERVICE.blockUser(
        userId,
        payload.IS_BLOCKED,
        blocked_byuserid
      );

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  async search(req, res) {
    const query = req.params.query;
    try {
      const results = await USER_SERVICE.searchUsers(query);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  activeOrganization = async (req, res) => {
    const payload = req.body;
    const { organizationId } = payload;
    const active_byuserid = req.user_id;

    const { error } = validateOrganizationId(organizationId);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    try {
      const updatedOrganization = await USER_SERVICE.activeOrganization(
        organizationId,
        payload.ORGANIZATION_ACTIVE,
        active_byuserid
      );

      if (!updatedOrganization) {
        return res.status(404).json({ error: "Organization not found" });
      }

      res.json(updatedOrganization);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

  approvedOrganizations = async (req, res) => {
    const payload = req.body;
    const { organizationId } = payload;
    const active_byuserid = req.user_id;

    const { error } = validateOrganizationId(organizationId);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    try {
      const approvedOrganization = await USER_SERVICE.approvedOrganization(
        organizationId,
        payload.OBJECT_APPROVED,
        active_byuserid
      );

      if (!approvedOrganization) {
        return res.status(500).json({ error: error.message });
      }

      res.json(approvedOrganization);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

  getDashboardData = async (req, res) => {
    try {
      const dashboardData = await USER_SERVICE.getDashboardData();
      res.json(dashboardData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      res.status(500).send('Internal server error');
    }
  };

  // checkUsernameExists = async (req, res) => {
  //   const existingUser = await USER_SERVICE.checkUsernameExists(USERNAME);
  //     if (existingUser) {
  //       return res.json(existingUser);
  //     }
  // }
}
module.exports = new USER_CONTROLLER();
