const USER_MODEL = require("../../models/user/user.model");
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
      FULL_NAME: body.FULL_NAME,
      EMAIL: body.EMAIL,
      IS_BLOCKED: null,
      ROLE: {
        IS_ADMIN: false,
        IS_ORGANIZATION: false,
      },
    });
    const result = await newUser.save();
    return result._doc;
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

  login = async (userId) => {
    const secret = process.env.ACCESS_TOKEN_SECRECT;
    const expiresIn = "1h";
    const accessToken = jwt.sign({ userId }, secret, { expiresIn });
    return accessToken;
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
      IS_APPROVED: {
        "CHECK": isApproved,
        "TIME": Date.now(),
        "APPROVED_BY_USER_ID": approved_byuserid
      }
    }
    const options = { new: true };
    const foundOrganization = await ORGANIZATION_MODEL.findOneAndUpdate(condition, data, options);

    return foundOrganization;
  }

  //organization

  checkUserHasOrganization = async (UserId) => {

    const user = await USER_MODEL.findById(UserId);
    return user && user.ORGANIZATION_ID ? true : false;

  };

  findUserByIdAndOrganization = async (userId, organizationId) => {
    try {
      return await USER_MODEL.findOne({ _id: userId, ORGANIZATION_ID: organizationId });
    } catch (error) {
      throw new Error('Unable to find user: ' + error.message);
    }
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


}

module.exports = new USER_SERVICE();
