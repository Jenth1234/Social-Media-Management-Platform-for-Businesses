const USER_MODEL = require("../../models/user/user.model");
const MailService = require("../../utils/send.mail");
const ORGANIZATION_MODEL = require("../../models/organization/organization.model");
const PACKAGE_MODEL = require("../../models/package/package.model");
const INVOICE_MODEL = require("../../models/Invoice/Invoice.model")
const { Types } = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

class USER_SERVICE {
  async checkUsernameExists(username) {
    return await USER_MODEL.findOne({ $or: [
      {
        EMAIL: username
      }, {
        USERNAME: username
      }
    ]}).lean();
  }

  async checkEmailExists(email) {
    return await USER_MODEL.findOne({ EMAIL: email }).lean();
  }

  async registerUser(body) {
    const hash = await this.hashPassword(body.PASSWORD);
    const newUser = new USER_MODEL({
      USERNAME: body.USERNAME,
      PASSWORD: hash,
      FULLNAME: body.FULLNAME,
      EMAIL: body.EMAIL,
      IS_BLOCKED: null,
      ROLE: {
        IS_ADMIN: false,
        IS_ORGANIZATION: false,
      },
      AVATAR: body.AVATAR,
      ADDRESS: body.ADDRESS,
      GENDER: body.GENDER,
      IS_ACTIVATED: false,
    });
    const result = await newUser.save();
    return result._doc;
  }

  async updateUserOTP(email, otp, otpType, expTime) {
    try {
      const user = await USER_MODEL.findOneAndUpdate(
        { EMAIL: email },
        {
          $push: {
            OTP: {
              TYPE: otpType,
              CODE: otp,
              TIME: Date.now(),
              EXP_TIME: expTime,
              CHECK_USING: false,
            },
          },
        },
        { new: true }
      );
    } catch (error) {
      console.error("Error updating user OTP:", error);
    }
  }

  async updateOTPstatus(email, otp) {
    try {
      const user = await USER_MODEL.findOneAndUpdate(
        { EMAIL: email, "OTP.CODE": otp },
        { $set: { "OTP.$.CHECK_USING": true } },
        { new: true }
      );
      return user;
    } catch (error) {
      console.error("Error updating user OTP:", error);
    }
  }

  async verifyOTPAndActivateUser(email, otp) {
    const updatedUser = await USER_MODEL.findOneAndUpdate(
      { EMAIL: email, "OTP.CODE": otp },
      { $set: { IS_ACTIVATED: true, "OTP.$.CHECK_USING": true } },
      { new: true }
    );

    return updatedUser;
  }

  async resetPassword(email, newPassword) {
    const hash = await this.hashPassword(newPassword);
    const result = await USER_MODEL.updateOne(
      { EMAIL: email },
      { $set: { PASSWORD: hash } }
    );

    if (result.nModified === 0) {
      throw new Error("Failed to update password. User may not exist.");
    }

    return { success: true, message: "Password updated successfully." };
  }

  async updateUser(userId, userDataToUpdate) {
    const condition = { _id: userId };
    const data = {};

    if (userDataToUpdate.FULLNAME) {
      data.FULLNAME = userDataToUpdate.FULLNAME;
    }

    if (userDataToUpdate.EMAIL) {
      data.EMAIL = userDataToUpdate.EMAIL;
    }

    if (userDataToUpdate.ADDRESS) {
      data.ADDRESS = userDataToUpdate.ADDRESS;
    }

    if (userDataToUpdate.GENDER) {
      data.GENDER = userDataToUpdate.GENDER;
    }

    const options = { new: true };
    const foundUser = await USER_MODEL.findOneAndUpdate(
      condition,
      data,
      options
    );

    if (!foundUser) {
      throw new Error("Không tìm thấy người dùng");
    }

    return foundUser;
  }

//   async updateUser(userId, userDataToUpdate) {
//     const condition = { _id: userId };
//     const allowedFields = ['USERNAME', 'FULLNAME', 'EMAIL', 'ADDRESS', 'GENDER'];
//     const data = {};

//     allowedFields.forEach(field => {
//         if (userDataToUpdate[field]) {
//             data[field] = userDataToUpdate[field];
//         }
//     });

//     // if (data.PASSWORD) {
//     //     data.PASSWORD = await this.hashPassword(data.PASSWORD);
//     // }

//     const options = { new: true };
//     const foundUser = await USER_MODEL.findOneAndUpdate(
//         condition,
//         data,
//         options
//     );

//     if (!foundUser) {
//         throw new Error("Không tìm thấy người dùng");
//     }

//     return foundUser;
// }


  async getUsers(tabStatus, page, limit, search = "") {
    let query = {};

    switch (tabStatus) {
      case "1":
        query = { $or: [{ IS_ACTIVATED: false }, { IS_BLOCKED: null }] };
        break;
      case "2":
        query = { IS_ACTIVATED: true, "IS_BLOCKED.CHECK": false };
        break;
      case "3":
        query = { "IS_BLOCKED.CHECK": true };
        break;
      case "4":
        query = {};
        break;
      default:
        throw new Error("Invalid tab status");
    }

    if (search) {
      query.$or = [
        { USERNAME: { $regex: new RegExp(search, "i") } },
        { FULLNAME: { $regex: new RegExp(search, "i") } },
      ];
    }

    try {
      const totalCount = await USER_MODEL.countDocuments(query);
      const totalPages = Math.ceil(totalCount / limit);
      const offset = (page - 1) * limit;

      const users = await USER_MODEL.find(query).skip(offset).limit(limit);

      if (users.length === 0) {
        throw new Error("Không tìm thấy người dùng");
      }

      return {
        users,
        totalPages,
        totalCount,
      };
    } catch (error) {
      if (error.message === "Không tìm thấy người dùng") {
        return {
          users: [],
          totalPages: 0,
          totalCount: 0,
        };
      }
      throw new Error("Lỗi khi truy vấn người dùng");
    }
  }

  async countUsers() {
    return await USER_MODEL.countDocuments();
  }

  hashPassword = async (password) => {
    const saltRounds = 10;
    const hash = await bcrypt.hashSync(password, saltRounds);
    return hash;
  };

  checkPassword = async (password, passworDB) => {
    try {
      const checkedPassword = await bcrypt.compare(password, passworDB);
      return checkedPassword;
    } catch (err) {
      return error;
    }
  };

  login = async (payload) => {
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const expiresIn = "5h";
    const accessToken = jwt.sign(payload, secret, { expiresIn });
    return accessToken;
  };

  async getUserInfo(user_id) {
    const user = await USER_MODEL.findById(user_id);

    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  // admin

  async blockUser(userId, isBlocked, blocked_byuserid) {
    const condition = { _id: userId };
    const data = {
      IS_BLOCKED: {
        CHECK: isBlocked,
        TIME: Date.now(),
        BLOCK_BY_USER_ID: blocked_byuserid,
      },
    };
    const options = { new: true };

    const foundUser = await USER_MODEL.findOneAndUpdate(
      condition,
      data,
      options
    );

    return foundUser;
  }

  // async activeOrganization(organizationId, isActive, active_byuserid) {
  //   const data = {
  //     "CHECK": isBlocked,
  //     "TIME": Date.now(),
  //     "BLOCK_BY_USER_ID": blocked_byuserid
  //   };
  //   const options = { new: true };

  //   const foundUser = await USER_MODEL.findOneAndUpdate(condition, data, options);

  //   return foundUser;
  // }

  async activeOrganization(
    organizationId,
    organizationActive,
    active_byuserid
  ) {
    const condition = { _id: organizationId };
    const data = {
      ORGANIZATION_ACTIVE: {
        CHECK: organizationActive,
        TIME: Date.now(),
        ACTIVE_BY_USER_ID: active_byuserid,
      },
    };

    const options = { new: true };
    const foundOrganization = await ORGANIZATION_MODEL.findOneAndUpdate(
      condition,
      data,
      options
    );

    return foundOrganization;
  }

  async approvedOrganization(
    organizationId,
    objectApproved,
    approved_byuserid
  ) {
    const condition = { _id: organizationId };

    const data = {
      OBJECT_APPROVED: {
        CHECK: objectApproved,
        TIME: Date.now(),
        APPROVED_BY_USER_ID: approved_byuserid,
      },
    };

    const options = { new: true };
    const foundOrganization = await ORGANIZATION_MODEL.findOneAndUpdate(
      condition,
      data,
      options
    );

    return foundOrganization;
  }

  async getDashboardData() {
    const [totalUserCount, totalOrganizationCount, totalPackagesCount, totalRevenueResult] = await Promise.all([
      USER_MODEL.countDocuments(), // Đếm tất cả người dùng
      ORGANIZATION_MODEL.countDocuments(), // Đếm tất cả tổ chức
      PACKAGE_MODEL.countDocuments({ IS_DELETE: false }), // Đếm tất cả gói không bị xóa
      INVOICE_MODEL.aggregate([
        {
          $match: { PAID: true }
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: '$AMOUNT' }
          }
        }
      ])
    ]);
  
    const response = {
      totalUser: totalUserCount,
      totalOrganization: totalOrganizationCount, // Tổng số tổ chức
      totalPackages: totalPackagesCount,
      totalRevenue: totalRevenueResult[0] ? totalRevenueResult[0].totalAmount : 0
    };
  
    return response;
  }
  
}

module.exports = new USER_SERVICE();
