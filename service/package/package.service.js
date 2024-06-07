
const PACKAGE_MODEL = require('../../models/package/package.model');
class PackageService {

  async checkLevelExists(LEVEL) {
    return await PACKAGE_MODEL.findOne({ LEVEL: LEVEL }).lean();
  }
    async createPackage(payload) {
      const {TITLE, LEVEL, COST, NUMBER_OF_PRODUCT, NUMBER_OF_COMMENT,DESCRIPTION,DISCOUNT } = payload;
        const newPackage = new PACKAGE_MODEL({
          TITLE:TITLE,
          LEVEL: LEVEL,
          COST: COST,
          NUMBER_OF_PRODUCT: NUMBER_OF_PRODUCT,
          NUMBER_OF_COMMENT: NUMBER_OF_COMMENT,
          DESCRIPTION: DESCRIPTION,
          DISCOUNT:DISCOUNT,
        });
        const result = await newPackage.save();
        return result._doc;
  }
  
  async updatePackage(level, packageDataToUpdate) {
    const foundPackage = await PACKAGE_MODEL.findById(level);
    if (!foundPackage) {
      throw new Error("User does not exist");
    }
    foundPackage.set(packageDataToUpdate);
    await foundPackage.save();
    return foundPackage;
  }

  async deletePackage(packageId) {
    const deletePackage = await PACKAGE_MODEL.findByIdAndDelete(packageId);
    if ( !deletePackage) {
      throw new Error("package not found");
    }
  }
  async getPackage() {
    return await PACKAGE_MODEL.find({});
  }
}

module.exports = new PackageService();
