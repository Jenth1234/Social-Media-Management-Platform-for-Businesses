const Joi = require('joi');

const createSchema = Joi.object({
    ORGANIZATION_ID: Joi.string().required().messages({
        'string.base': 'Organization ID must be a string.',
        'any.required': 'Organization ID is required.'
    }),
    LIST_COMMENT: Joi.array().items(
        Joi.object({
            USER_ID: Joi.string().required().messages({
                'string.base': 'User ID must be a string.',
                'any.required': 'User ID is required.'
            }),
            CONTENT: Joi.string().min(1).max(500).pattern(new RegExp('^[a-zA-Z0-9\\s.,!?]+$')).required().messages({
                'string.base': 'Comment must be a string.',
                'string.empty': 'Comment cannot be empty.',
                'string.min': 'Comment must be at least {#limit} characters long.',
                'string.max': 'Comment cannot exceed {#limit} characters.',
                'string.pattern.base': 'Comment contains invalid characters.',
                'any.required': 'Comment is required.'
            }),
            IS_ATTACHMENTS: Joi.array().items(Joi.object()).optional().messages({
                'array.base': 'Attachments must be an array.'
            })
        })
    ).required().messages({
        'array.base': 'List Comment must be an array.',
        'any.required': 'List Comment is required.'
    }),
    PRODUCT_ID: Joi.string().required().messages({
        'string.base': 'Product ID must be a string.',
        'any.required': 'Product ID is required.'
    }),
    LIST_COMMENT_MAX_NUMBER: Joi.number().required().messages({
        'number.base': 'List Comment Max Number must be a number.',
        'any.required': 'List Comment Max Number is required.'
    })
});

module.exports = {
    createSchema
};
