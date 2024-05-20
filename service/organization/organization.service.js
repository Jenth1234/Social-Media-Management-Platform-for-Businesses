const Organization = require("../../models/organization/organization.model");
const USER_SERVICE = require("../../services/user/user.service");
const { Types } = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
class Organization_Service {
    async createOrganization (payload) {
        try {
          // Create a new organization
          const newOrganization = new Organization(payload);
          // Save to the database
          await newOrganization.save();
          return newOrganization;
        } catch (error) {
          throw new Error("Unable to create organization: " + error.message);
        }
      };
      
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
        
    async checkOrganExists(username) {
        return await USER_MODEL.findOne({ USERNAME: username }).lean();
    }

}


module.exports = {
  createOrganization,
};
