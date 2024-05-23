const Joi = require('joi');

const createCommentValidate = Joi.object({
    ORGANIZATION_ID: Joi.string().required().messages({
        'string.base': 'Organization ID must be a string.',
        'any.required': 'Organization ID is required.'
    }),
    CONTENT: Joi.string().min(1).max(500).pattern(new RegExp('^[a-zA-Z0-9\\s.,!?]+$')).required().messages({
        'string.base': 'Comment must be a string.',
        'string.empty': 'Comment cannot be empty.',
        'string.min': 'Comment must be at least {#limit} characters long.',
        'string.max': 'Comment cannot exceed {#limit} characters.',
        'string.pattern.base': 'Comment contains invalid characters.',
        'any.required': 'Comment is required.'
    }),
    ATTACHMENTS: Joi.array().items(Joi.object()).optional().messages({
        'array.base': 'Attachments must be an array.'
    }),
    PRODUCT_ID: Joi.string().required().messages({
        'string.base': 'Product ID must be a string.',
        'any.required': 'Product ID is required.'
    }),
    
});

module.exports = {
    createCommentValidate
};
