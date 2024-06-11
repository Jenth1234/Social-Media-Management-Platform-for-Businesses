const USER_MODEL = require("../../models/user/user.model");
const MailService = require('../../utils/send.mail')
const ORGANIZATION_MODEL = require("../../models/organization/organization.model");
const { Types } = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
class USER_SERVICE {

  async checkUsernameExists(username) {
    return await USER_MODEL.findOne({ USERNAME: username }).lean();
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
              CHECK_USING: false
            }
          }
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

  async resetPassword(email, newPassword) {
    const hash = await this.hashPassword(newPassword);
    const result = await USER_MODEL.updateOne({ EMAIL: email }, { PASSWORD: hash });

    if (result.nModified === 0) {
      throw new Error('Failed to update password. User may not exist.');
    }

    return { success: true, message: 'Password updated successfully.' };
  }

  async updateUser(userId, userDataToUpdate) {
    const condition = {
      "_id": userId,
    }
    const data = {};
    if (userDataToUpdate.FULLNAME) {
      data.FULLNAME = userDataToUpdate.FULLNAME;
    }

    const options = { new: true };
    const foundUser = await USER_MODEL.findOneAndUpdate(condition, data, options);

    return foundUser;
  }

  async getUsers() {
    return await USER_MODEL.find({});
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
      throw new Error('User not found');
    }
    return user;
  };

  // admin

  async blockUser(userId, isBlocked, blocked_byuserid) {
    const condition = { "_id": userId };
    const data = {
      IS_BLOCKED: {
        "CHECK": isBlocked,
        "TIME": Date.now(),
        "BLOCK_BY_USER_ID": blocked_byuserid
      }
    };
    const options = { new: true };

    const foundUser = await USER_MODEL.findOneAndUpdate(condition, data, options);

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

  async activeOrganization(organizationId, isActive, active_byuserid) {
    const condition = { "_id": organizationId };
    const data = {
      ORGANIZATION_ACTIVE: {
        "CHECK": isActive,
        "TIME": Date.now(),
        "ACTIVE_BY_USER_ID": active_byuserid
      }
    };

    const options = { new: true };
    const foundOrganization = await ORGANIZATION_MODEL.findOneAndUpdate(condition, data, options);

    return foundOrganization;
  }

  async approvedOrganization(organizationId, isApproved, approved_byuserid) {
    const condition = { "_id": organizationId };

    const data = {
      IS_APPROVED: { //cái này là OBJECT_APPROVED nha Thảo ơi, bữa anh Kỳ kêu sửa tên á.
        "CHECK": isApproved,
        "TIME": Date.now(),
        "APPROVED_BY_USER_ID": approved_byuserid
      }
    }
    const options = { new: true };
    const foundOrganization = await ORGANIZATION_MODEL.findOneAndUpdate(condition, data, options);

    return foundOrganization;
  }
}

module.exports = new USER_SERVICE();
