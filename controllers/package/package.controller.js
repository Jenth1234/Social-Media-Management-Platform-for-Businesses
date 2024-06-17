const packageService = require("../../service/package/package.service");
const PackageValidate = require("../../models/package/validate/index");

class PACKAGE {
  createPackage = async (req, res) => {
    const payload = req.body;
    const { error, value } = PackageValidate.packageCreate.validate(payload, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid data",
        errors: error.details.map((detail) => detail.message),
      });
    }

    const { LEVEL, DISCOUNT } = value; 

    try {
      const existingLevel = await packageService.checkLevelExists(LEVEL);
      if (existingLevel) {
        return res.status(400).json({ success: false, message: "Level already exists" });
      }

      const result = await packageService.createPackage(payload);
      return res.status(201).json({ success: true, data: result });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "An error occurred while creating the package",
        error: error.message,
      });
    }
  };

  updatePackage = async (req, res) => {
    const payload = req.body;
    const { error, value } = PackageValidate.updatePackage.validate(payload);

    if (error) {
        return res.status(400).json({
            success: false,
            message: "Invalid data",
            errors: error.details.map((detail) => detail.message),
        });
    }

    try {
        const id = req.params.id;
        const updatedPackage = await packageService.updatePackage(id, payload);
        return res.status(200).json({ success: true, data: updatedPackage });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating the package",
            error: error.message,
        });
    }
};

  deletePackage = async (req, res) => {
    try {
      const id = req.params.id;
      await packageService.deletePackage(id);
      return res.status(200).json({ success: true, message: "Package deleted successfully" });
  } catch (error) {
      return res.status(500).json({
          success: false,
          message: "An error occurred while deleting the package",
          error: error.message,
      });
  }
  };

  getPackage = async (req, res) => {
    try {
      const packages = await packageService.getPackage();
      return res.status(200).json({ success: true, data: packages });
    } catch (error) { 
      return res.status(500).json({
        success: false,
        message: "An error occurred while retrieving packages",
        error: error.message,
      });
    }
  };

  DiscountedCost(cost, discount) {
    const discountAmount = cost * (discount / 100);
    return cost - discountAmount;
  }
  
}

module.exports = new PACKAGE();
