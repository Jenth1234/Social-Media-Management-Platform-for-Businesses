const Joi = require('joi');
const { model } = require('mongoose');

const createOrganizationValidate = Joi.object({
    ORGANIZATION_NAME: Joi.string()
        .min(3)
        .max(100)
        .required()
        .messages({
            'string.base': 'Organization name must be a string.',
            'string.empty': 'Organization name cannot be empty.',
            'string.min': 'Organization name must be at least {#limit} characters long.',
            'string.max': 'Organization name cannot exceed {#limit} characters.',
            'any.required': 'Organization name is required.'
        }),
    ORGANIZATION_EMAIL: Joi.string()
        .email()
        .required()
        .messages({
            'string.base': 'Email must be a string.',
            'string.empty': 'Email cannot be empty.',
            'string.email': 'Please provide a valid email address.',
            'any.required': 'Organization email is required.'
        }),
    ORGANIZATION_PHONE: Joi.string()
        .pattern(/^\d{10,15}$/)
        .required()
        .messages({
            'string.base': 'Phone number must be a string.',
            'string.empty': 'Phone number cannot be empty.',
            'string.pattern.base': 'Please provide a valid phone number.',
            'any.required': 'Organization phone number is required.'
        }),
    ORGANIZATION_ACTIVE: Joi.boolean()
        .required()
        .messages({
            'boolean.base': 'Active status must be a boolean.',
            'any.required': 'Organization active status is required.'
        }),
    IS_APPROVED: Joi.object({
        TIME: Joi.date()
            .default(Date.now)
            .messages({
                'date.base': 'Time must be a valid date.'
            }),
        CHECK: Joi.boolean()
            .required()
            .messages({
                'boolean.base': 'Approval check status must be a boolean.',
                'any.required': 'Approval check status is required.'
            }),
        BLOCK_BY_USER_ID: Joi.string()
            .required()
            .messages({
                'string.base': 'Blocked user ID must be a string.',
                'any.required': 'Blocked user ID is required.'
            })
    })
});

const registerOrganization = Joi.object({
    ORGANIZATION_NAME: Joi.string()
        .min(3)
        .max(100)
        .required()
        .messages({
            'string.base': 'Organization name must be a string.',
            'string.empty': 'Organization name cannot be empty.',
            'string.min': 'Organization name must be at least {#limit} characters long.',
            'string.max': 'Organization name cannot exceed {#limit} characters.',
            'any.required': 'Organization name is required.'
        }),
    ORGANIZATION_EMAIL: Joi.string()
        .email()
        .required()
        .messages({
            'string.base': 'Email must be a string.',
            'string.empty': 'Email cannot be empty.',
            'string.email': 'Please provide a valid email address.',
            'any.required': 'Organization email is required.'
        }),
    ORGANIZATION_PHONE: Joi.string()
        .pattern(/^\d{10,15}$/)
        .required()
        .messages({
            'string.base': 'Phone number must be a string.',
            'string.empty': 'Phone number cannot be empty.',
            'string.pattern.base': 'Please provide a valid phone number.',
            'any.required': 'Organization phone number is required.'
        }),
});

module.exports = {

    organizationSchema,
    registerOrganization,
    createOrganizationValidate

};
