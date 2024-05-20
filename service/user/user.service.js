const USER_MODEL = require("../../models/user/user.model");
const { Types } = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
class USER_SERVICE {
  //check vailidateEmail
  // async validateEmail(email) {
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   return emailRegex.test(email);
  // }
  //   async validateUsername(username) {
  //      // Check if the username is empty
  //      if (!username.trim()) {
  //       return { valid: false, error: 'Username cannot be blank' };
  //     }
  //     // Check if user name contains spaces
  //     if (/\s/.test(username)) {
  //         return { valid: false, error: 'Username cannot contain spaces' };
  //     }

  //     // Check the length of the username
  //     const minLength = 8;
  //     const maxLength = 32;
  //     const usernameLength = username.length;
  //     if (usernameLength < minLength || usernameLength > maxLength) {
  //         return { valid: false, error: 'Username must be between 8 and 32 characters' };
  //     }

  //     return { valid: true };
  // }

  // async validatePassword(password) {
  //   //// // Check if password is empty
  //   if (!password.trim()) {
  //     return { valid: false, error: 'Mật khẩu không được để trống' };
  // }
  //     // Check if the password contains spaces
  //     if (/\s/.test(password)) {
  //         return { valid: false, error: 'Password must not contain spaces' };
  //     }

  //     // Check the length of the password
  //     const minLength = 8;
  //     const maxLength = 32;
  //     const passwordLength = password.length;
  //     if (passwordLength < minLength || passwordLength > maxLength) {
  //         return { valid: false, error: 'Password must be from 8 to 32 characters' };
  //     }

  //     return { valid: true };
  // }

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
