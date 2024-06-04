const USER_MODEL = require("../../models/user/user.model");
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
    });
    const result = await newUser.save();
    return result._doc;
  }

  async editUser(userId, userDataToUpdate) {
    const foundUser = await USER_MODEL.findById(userId);
    if (!foundUser) {
      throw new Error("User does not exist");
    }
    foundUser.set(userDataToUpdate);
    await foundUser.save();
    return foundUser;
  }

  async deleteUser(userId) {
    const deletedUser = await USER_MODEL.findByIdAndDelete(userId);
    if (!deletedUser) {
      throw new Error("User not found");
    }
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
}

module.exports = new USER_SERVICE();
