const user = require("../../models/user/user.model");
const USER_SERVICE = require("../../service/user/user.service");
const {
  registerValidate,
  updateUserValidate,
  loginValidate,
  validateUserId,
  validateOrganizationId
} = require("../../models/user/validate/index");
const { response } = require("express");
class USER_CONTROLLER {
  registerUser = async (req, res) => {
    const payload = req.body;
    const { error, value } = registerValidate.validate(payload);
    if (error) {
      return res.status(401).json({ message: error.details[0].message });
    }
    const { USERNAME } = value;

    const existingUser = await USER_SERVICE.checkUsernameExists(USERNAME);
    if (existingUser) {
      return res.status(401).json({ message: "User already exists!!!" });
    }

    const { EMAIL } = value;
    const existingEmail = await USER_SERVICE.checkEmailExists(EMAIL);
    if (existingEmail) {
      return res.status(401).json({ message: "User email already exists" });
    }

  try {
    // If it doesn't exist, continue creating a new user
    const newUser = await USER_SERVICE.registerUser(payload);
    res.status(201).json(newUser);
  } catch (err) {
    return res.status(401).json({ message: "Fails to register user" });
  }
};

updateUser = async (req, res) => {
  const payload = req.body;
  const { error, value } = updateUserValidate.validate(payload);
  if (error) {
    return res.status(401).json({ message: error.details[0].message });
  }

  try {
    const userId = req.params.id;
    // const userDataToUpdate = req.body;
    const updatedUser = await USER_SERVICE.updateUser(userId, payload);
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: "Fails to edit user" });
  }
};

deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await USER_SERVICE.deleteUser(userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

getUsers = async (req, res) => {
  try {
    const users = await USER_SERVICE.getUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

login = async (req, res) => {
  const payload = req.body;

  const { error, value } = loginValidate.validate(payload);
  if (error) {
    return res.status(401).json({ message: error.details[0].message });
  }

  // Check for exiting user

  const existingUser = await USER_SERVICE.checkUsernameExists(payload.USERNAME);
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

  const accessToken = await USER_SERVICE.login(existingUser._id);

  return res.status(200).json({
    errorCode: 0,
    message: "Logged in successfully!!",
    metadata: accessToken,
  });
};
login_admin = async (req, res) => {
  try {
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

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
      const updatedUser = await USER_SERVICE.blockUser(userId, payload.IS_BLOCKED, blocked_byuserid);

      if (!updatedUser) {
          return res.status(404).json({ error: 'User not found' });
      }

      res.json(updatedUser);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

activeOrganization = async (req, res) => {
  const payload = req.body;
  const { organizationId } = payload;
  const active_byuserid = req.user_id;

  const { error }= validateOrganizationId(organizationId);
  if (error) {
    return res.status(400).json({ error: error.message });
  }

  try {
    const updatedOrganization = await USER_SERVICE.activeOrganization(organizationId, payload.IS_ACTIVE, active_byuserid);

    if (!updatedOrganization) {
      return res.status(404).json({ error: 'Organization not found'});
    }

    res.json(updatedOrganization);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

approvedOrganizations = async (req, res) => {
  const payload = req.body;
  const { organizationId } = payload;
  const active_byuserid = req.user_id;

  const { error } = validateOrganizationId(organizationId);
  if (error) {
    return res.status(400).json({ error: error.message });
  }

  try {
    const approvedOrganization = await USER_SERVICE.approvedOrganization(organizationId, payload.IS_APPROVED, active_byuserid);

    if (!approvedOrganization) {
      return res.status(500).json({ error: error.message });
    }

    res.json(approvedOrganization);
  } catch (error) {
    return res.status(500).json({error: error.message});
  }
};

}
module.exports = new USER_CONTROLLER();
