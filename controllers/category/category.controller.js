const categoryService = require('../../service/category/category.service');
const registerCategory = require('../../models/category/validate/index');

class CATEGORY_CONTROLLER {
    registerCategory = async (req, res) => {
        try {
            const { NAME_CATEGORY, ORGANIZATION_ID } = req.body;

            if (!ORGANIZATION_ID) {
                return res.status(400).json({ success: false, message: "ORGANIZATION_ID is required." });
            }

            const { error } = registerCategory.validate({ NAME_CATEGORY, ORGANIZATION_ID });

            if (error) {
                return res.status(400).json({ success: false, message: error.details[0].message });
            }

            const savedCategory = await categoryService.registerCategory({ NAME_CATEGORY, ORGANIZATION_ID });

            return res.status(201).json({ success: true, message: "Danh mục đã được đăng ký thành công", category: savedCategory });

        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }
}

module.exports = new CATEGORY_CONTROLLER();
