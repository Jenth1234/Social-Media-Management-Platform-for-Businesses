const Joi = require('joi');
Joi.objectId = require("joi-objectid")(Joi);

const registerCategory = Joi.object({
    NAME_CATEGORY: Joi.string()
        .min(3)
        .max(100)
        .required()
        .messages({
            'string.base': 'Category name must be a string.',
            'string.empty': 'Category name cannot be empty.',
            'string.min': 'Category name must be at least {#limit} characters long.',
            'string.max': 'Category name cannot exceed {#limit} characters.',
            'any.required': 'Category name is required.'
        }),

    ORGANIZATION_ID: Joi.objectId()
        .required()
        .messages({
            'any.required': 'Organization ID is required.'
        }),

    CATEGORY_TYPE: Joi.string()
        .valid('product', 'post', 'video')
        .required()
        .messages({
            'string.base': 'Comment type must be a string.',
            'any.only': 'Comment type must be one of [product, post, video].',
            'any.required': 'Comment type is required.'
        })
});

module.exports = registerCategory;
