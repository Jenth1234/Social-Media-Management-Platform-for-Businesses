const Joi = require('joi');
Joi.objectId = require("joi-objectid")(Joi);

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
        .email({
            minDomainSegments: 2,
            tlds: { allow: ["com", "net"] }
        })
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

const loginToOrganization = Joi.object({
    USERNAME: Joi.string()
        .trim()
        .alphanum()
        .min(5)
        .max(32)
        .required()
        .messages({
            'string.base': 'Username must be a string.',
            'string.empty': 'Username cannot be empty.',
            'string.min': 'Username must be at least {#limit} characters long.',
            'string.max': 'Username cannot exceed {#limit} characters.',
            'any.required': 'Username is required.'
        }),
    PASSWORD: Joi.string()
        .trim()
        .min(8)
        .max(32)
        .pattern(
            new RegExp(
                "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?!.*\\s).*$"
            )
        )
        .required()
        .messages({
            'string.pattern.base': 'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character, and must not contain spaces.',
            'string.min': 'Password should have a minimum length of {#limit}.',
            'string.max': 'Password should have a maximum length of {#limit}.',
            'any.required': 'Password is required.'
        }),
});

const registerAccountOfOrganization = Joi.object({
    USERNAME: Joi.string().trim().alphanum().min(5).max(32).required(),

    PASSWORD: Joi.string()
        .trim()
        .min(8)
        .max(32)
        .pattern(
            new RegExp(
                "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?!.*\\s).*$"
            )
        )
        .required()
        .messages({
            "string.pattern.base":
                "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character, and must not contain spaces.",
            "string.min": "Password should have a minimum length of {#limit}.",
            "string.max": "Password should have a maximum length of {#limit}.",
        }),

    FULLNAME: Joi.string()
        .trim()
        .pattern(/^[A-Za-z\s]+$/)
        .min(5)
        .max(100)
        .custom((value, helpers) => {
            if (value.split(" ").length < 2) {
                return helpers.message("Full name must contain at least two words.");
            }
            return value;
        })
        .required()
        .messages({
            "string.base": "Full name must be a string.",
            "string.pattern.base": "Full name must contain only letters and spaces.",
            "string.empty": "Full name cannot be empty.",
            "string.min": "Full name must be at least {#limit} characters long.",
            "string.max": "Full name must be at most {#limit} characters long.",
        }),

    EMAIL: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
    }),
});

const validateHeader = Joi.object({
    ORGANIZATION_ID: Joi.objectId().required()
});

module.exports = {
    registerOrganization,
    loginToOrganization,
    registerAccountOfOrganization,
    validateHeader,
};
