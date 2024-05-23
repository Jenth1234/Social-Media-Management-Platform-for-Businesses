const user = require("../../models/user/user.model");
const USER_SERVICE = require("../../service/user/user.service");
const {
  registerValidate,
  editUserValidate,
  loginValidate,
} = require("../../models/user/validate/index");
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

editUser = async (req, res) => {
  const payload = req.body;
  const { error, value } = editUserValidate.validate(payload);
  if (error) {
    return res.status(401).json({ message: error.details[0].message });
  }
  const { USERNAME } = value;

  const existingUser = await USER_SERVICE.checkUsernameExists(USERNAME);
  if (existingUser) {
    return res.status(401).json({ message: "User already exists!!!" });
  }

  try {
    const userId = req.params.id;
    // const userDataToUpdate = req.body;
    const updatedUser = await USER_SERVICE.editUser(userId, payload);
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

}
module.exports = new USER_CONTROLLER();
