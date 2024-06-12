const Category = require('../../models/category/category.model');
const Organization = require('../../models/organization/organization.model');

class CATEGORY_SERVICE {
    async getCategoryByNameAndOrganization(name, organizationId) {
        const category = await Category.findOne({ NAME_CATEGORY: name, ORGANIZATION_ID: organizationId });
        return category;
    }

    async getCategoryByTypeAndOrganization(categoryType, organizationId) {
        const category = await Category.findOne({ CATEGORY_TYPE: categoryType, ORGANIZATION_ID: organizationId });
        return category;
    }

    async registerCategory(categoryData) {
        const existingCategoryWithName = await this.getCategoryByNameAndOrganization(categoryData.NAME_CATEGORY, categoryData.ORGANIZATION_ID);
        if (existingCategoryWithName) {
            return existingCategoryWithName;
        }

        const existingCategoryWithType = await this.getCategoryByTypeAndOrganization(categoryData.CATEGORY_TYPE, categoryData.ORGANIZATION_ID);
        if (existingCategoryWithType) {
            return existingCategoryWithType;
        }

        const newCategory = new Category(categoryData);
        const savedCategory = await newCategory.save();
        return savedCategory;
    }

    async updateOrganizationListCategory(organizationId, categoryId) {
        const updatedOrganization = await Organization.findByIdAndUpdate(
            organizationId,
            {
                $push: {
                    LIST_CATEGORY: {
                        CATEGORY_ID: categoryId,
                        LIST_PRODUCT: []
                    }
                }
            },
            { new: true }
        );
        return updatedOrganization;
    }
}

module.exports = new CATEGORY_SERVICE();
