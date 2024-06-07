const Category = require('../../models/category/category.model');

class CATEGORY_SERVICE {

    registerCategory = async (categoryData) => {
        const newCategory = new Category(categoryData);
        const savedCategory = await newCategory.save();
        return savedCategory;
    }
}

module.exports = new CATEGORY_SERVICE();
