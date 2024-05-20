const {RegisterOrganValiddate, loginOrganValidate} = require("../../models/organization/validate/index");
const organizationService = require("../../service/organization/organization.service");

class OrganController {
  async loginOrgan(req, res) {
    const payload = req.body;

    const { error, value } = loginOrganValidate.validate(payload);
    if (error) {
      return res.status(401).json({ message: error.details[0].message });
    }

    // Check for exiting user

    const existingOrgan = await organizationService.checkUsernameExists(
      payload.USERNAME
    );
    if (!existingUser) {
      return res
        .status(401)
        .json({ message: "Tài khoản hoặc mật khẩu không hợp lệ !!!" });
    }

    const passwordValid = await USER_SERVICE.checkPassword(
      payload.PASSWORD,
      existingUser.PASSWORD
    );
    if (!passwordValid) {
      return res
        .status(401)
        .json({ message: "Tài khoản hoặc mật khẩu không hợp lệ !!!" });
    }

    const accessToken = await USER_SERVICE.login(existingUser.USER_ID);

    return res.status(200).json({
      errorCode: 0,
      message: "Đăng nhập thành công!!",
      metadata: accessToken,
    });
  }
}

exports.createOrganization = async (req, res) => {
  try {
    const payload = req.body;

    // Validate payload
    const { error } = organizationSchema.validate(payload, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid data",
        errors: error.details.map((detail) => detail.message),
      });
    }

    const newOrganization = await organizationService.createOrganization(
      payload
    );

    return res.status(201).json({
      success: true,
      message: "The organization has been created successfully.",
      data: newOrganization,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};
