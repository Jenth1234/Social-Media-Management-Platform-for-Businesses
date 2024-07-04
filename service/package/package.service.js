const PACKAGE_MODEL = require("../../models/package/package.model");
class PackageService {
  async checkIdExits(_id) {
    return await PACKAGE_MODEL.findById(_id).lean();
  }

  async checkLevelExists(LEVEL) {
    return await PACKAGE_MODEL.findOne({ LEVEL: LEVEL }).lean();
  }
  async createPackage(payload) {
    const {
      TITLE,
      LEVEL,
      COST,
      NUMBER_OF_PRODUCT,
      NUMBER_OF_COMMENT,
      DESCRIPTION,
      MONTH,
      DISCOUNT,
    } = payload;
    const newPackage = new PACKAGE_MODEL({
      TITLE: TITLE,
      LEVEL: LEVEL,
      COST: COST,
      NUMBER_OF_PRODUCT: NUMBER_OF_PRODUCT,
      NUMBER_OF_COMMENT: NUMBER_OF_COMMENT,
      DESCRIPTION: DESCRIPTION,
      MONTH: MONTH,
      DISCOUNT: DISCOUNT,
    });
    const result = await newPackage.save();
    return result._doc;
  }
  
  async updatePackage(packageId, packageDataToUpdate) {
    const foundPackage = await PACKAGE_MODEL.findById(packageId);
    if (!foundPackage) {
      throw new Error("Package does not exist");
    }
    foundPackage.set(packageDataToUpdate);
    await foundPackage.save();
    return foundPackage;
  }

  async deletePackage(id) {
    const deletePackage = await PACKAGE_MODEL.findById(id);
    if (!deletePackage) {
      throw new Error("package not found");
    }
    deletePackage.IS_DELETE = true;
    await deletePackage.save();
    return deletePackage;
  }
  async getPackage() {
    return await PACKAGE_MODEL.find({});
  }
}

module.exports = new PackageService();
