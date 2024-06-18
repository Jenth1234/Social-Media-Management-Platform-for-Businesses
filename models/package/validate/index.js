const Joi = require('joi');

class PackageValidate {
    packageCreate = Joi.object({
        TITLE: Joi.string().required().messages({
            'string.base': 'Title must be a string',
            'any.required': 'Title is required'
        }),
        LEVEL: Joi.number().integer().min(1).max(10).required().messages({
            'number.base': 'LEVEL must be a number',
            'number.min': 'LEVEL must be at least 1',
            'number.max': 'LEVEL must be at most 10',
            'any.required': 'LEVEL is required'
        }),
        COST: Joi.number().min(0).required().messages({
            'number.base': 'COST must be a number',
            'number.min': 'COST must be at least 0',
            'any.required': 'COST is required'
        }),
        NUMBER_OF_PRODUCT: Joi.number().integer().min(0).required().messages({
            'number.base': 'NUMBER_OF_PRODUCT must be a number',
            'number.min': 'NUMBER_OF_PRODUCT must be at least 0',
            'any.required': 'NUMBER_OF_PRODUCT is required'
        }),
        NUMBER_OF_COMMENT: Joi.number().integer().min(0).required().messages({
            'number.base': 'NUMBER_OF_COMMENT must be a number',
            'number.min': 'NUMBER_OF_COMMENT must be at least 0',
            'any.required': 'NUMBER_OF_COMMENT is required'
        }),
        DESCRIPTION: Joi.string().required().messages({
            'string.base': 'DESCRIPTION must be a string',
            'any.required': 'DESCRIPTION is required'
        }),
        MONTH: Joi.number().integer().min(1).max(36).required().messages({
            'number.base': 'MONTH must be a number',
            'number.min': 'MONTH must be at least 1',
            'number.max': 'MONTH must be at most 36',
            'any.required': 'MONTH is required'
        }),
        DISCOUNT: Joi.number().integer().min(10).max(50).required().messages({
            'number.base': 'DISCOUNT must be a number',
            'number.min': 'DISCOUNT must be at least 10',
            'number.max': 'DISCOUNT must be at most 50',
            'any.required': 'DISCOUNT is required'
        })
    });

    updatePackage = Joi.object({
        TITLE: Joi.string().messages({
            'string.base': 'Title must be a string',
        }),
        LEVEL: Joi.number().integer().min(1).max(10).messages({
            'number.base': 'LEVEL must be a number',
            'number.min': 'LEVEL must be at least 1',
            'number.max': 'LEVEL must be at most 10',
        }),
        COST: Joi.number().min(0).messages({
            'number.base': 'COST must be a number',
            'number.min': 'COST must be at least 0',
        }),
        NUMBER_OF_PRODUCT: Joi.number().integer().min(1).messages({
            'number.base': 'NUMBER_OF_PRODUCT must be a number',
            'number.min': 'NUMBER_OF_PRODUCT must be at least 0',
        }),
        NUMBER_OF_COMMENT: Joi.number().integer().min(1).messages({
            'number.base': 'NUMBER_OF_COMMENT must be a number',
            'number.min': 'NUMBER_OF_COMMENT must be at least 0',
        }),
        DESCRIPTION: Joi.string().messages({
            'string.base': 'DESCRIPTION must be a string',
        }),
        DISCOUNT: Joi.number().integer().min(10).max(50).messages({
            'number.base': 'DISCOUNT must be a number',
            'number.min': 'DISCOUNT must be at least 10',
            'number.max': 'DISCOUNT must be at most 50',
        })
    });
}

module.exports = new PackageValidate();
