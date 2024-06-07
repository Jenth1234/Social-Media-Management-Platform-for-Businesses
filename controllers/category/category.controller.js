const categoryService = require('../../service/category/category.service');
const registerCategory = require('../../models/category/validate/index');

class CATEGORY_CONTROLLER {
    registerCategory = async (req, res) => {
        try {
            const { NAME_CATEGORY, COMMENT_TYPE } = req.body;
            const ORGANIZATION_ID = req.header('ORGANIZATION_ID');

            if (!ORGANIZATION_ID) {
                return res.status(400).json({ success: false, message: "ORGANIZATION_ID is required." });
            }

            const validationData = { NAME_CATEGORY, ORGANIZATION_ID, COMMENT_TYPE };
            const { error } = registerCategory.validate(validationData);

            if (error) {
                return res.status(400).json({ success: false, message: error.details[0].message });
            }

            const savedCategory = await categoryService.registerCategory(validationData);

            return res.status(201).json({ success: true, message: "Danh mục đã được đăng ký thành công", category: savedCategory });

        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }
}

module.exports = new CATEGORY_CONTROLLER();
