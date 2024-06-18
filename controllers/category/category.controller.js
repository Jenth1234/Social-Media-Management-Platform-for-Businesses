const categoryService = require('../../service/category/category.service');
const registerCategory = require('../../models/category/validate/index');

class CATEGORY_CONTROLLER {
    registerCategory = async (req, res) => {
        try {
            const { NAME_CATEGORY, CATEGORY_TYPE } = req.body;
            const ORGANIZATION_ID = req.header('ORGANIZATION_ID');

            const existingCategoryWithName = await categoryService.getCategoryByNameAndOrganization(NAME_CATEGORY, ORGANIZATION_ID);
            if (existingCategoryWithName) {
                return res.status(400).json({ success: false, message: "Tên danh mục đã tồn tại." });
            }

            const existingCategoryWithType = await categoryService.getCategoryByTypeAndOrganization(CATEGORY_TYPE, ORGANIZATION_ID);
            if (existingCategoryWithType) {
                return res.status(400).json({ success: false, message: "Loại danh mục đã được đăng ký." });
            }

            const validationData = { NAME_CATEGORY, ORGANIZATION_ID, CATEGORY_TYPE };
            const { error } = registerCategory.validate(validationData);

            if (error) {
                return res.status(400).json({ success: false, message: error.details[0].message });
            }

            const savedCategory = await categoryService.registerCategory(validationData);

            return res.status(201).json({ success: true, message: "Category registered successfully", category: savedCategory });

        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }
}
// list danh mục nằm trong tổ chức.
module.exports = new CATEGORY_CONTROLLER();
