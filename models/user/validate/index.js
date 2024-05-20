const Joi = require('joi');
const { model } = require('mongoose');

const registerSchema = Joi.object({
    USERNAME: Joi.string()
        .alphanum()
        .min(8)
        .max(32)
        .required()
        .messages({
            'string.base': 'Username must be a string.',
            'string.empty': 'Username cannot be empty.',
            'string.alphanum': 'Username must only contain alpha-numeric characters.',
            'string.min': 'Username must be at least {#limit} characters long.',
            'string.max': 'Username cannot exceed {#limit} characters.',
            'any.required': 'Username is required.'
        }),
    PASSWORD: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required()
        .messages({
            'string.base': 'Password must be a string.',
            'string.pattern.base': 'Password must contain only alphanumeric characters.',
            'any.required': 'Password is required.'
        }),
    FULLNAME: Joi.string()
        .min(1)
        .max(100)
        .required()
        .messages({
            'string.base': 'Full name must be a string.',
            'string.empty': 'Full name cannot be empty.',
            'string.min': 'Full name must be at least {#limit} characters long.',
            'string.max': 'Full name cannot exceed {#limit} characters.',
            'any.required': 'Full name is required.'
        }),
    ROLE: Joi.string()
        .valid('USER', 'IS_ADMIN') 
        .required()
        .messages({
            'string.base': 'Role must be a string.',
            'any.only': 'Role must be either "USER" or "IS_ADMIN".',
            'any.required': 'Role is required.'
        })
});

module.exports = {
    registerSchema
};
