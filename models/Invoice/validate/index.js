const Joi = require('joi');

const invoiceValidationSchema = Joi.object({
    ORGANIZATION_ID: Joi.string().required().messages({
        'string.base': 'Organization ID must be a string.',
        'any.required': 'Organization ID is required.'
    }),
    PACKAGE_ID: Joi.string().required().messages({
        'string.base': 'Package ID must be a string.',
        'any.required': 'Package ID is required.'
    }),
    LEVEL: Joi.number().required().messages({
        'number.base': 'Level must be a number.',
        'any.required': 'Level is required.'
    }),
    AMOUNT: Joi.number().min(0).required().messages({
        'number.base': 'Amount must be a number.',
        'number.min': 'Amount cannot be negative.',
        'any.required': 'Amount is required.'
    }),
    DATE_ISSUED: Joi.date().default(Date.now).required().messages({
        'date.base': 'Date Issued must be a valid date.',
        'any.required': 'Date Issued is required.'
    }),
    THRU_DATE: Joi.date().required().messages({
        'date.base': 'Thru Date must be a valid date.',
        'any.required': 'Thru Date is required.'
    }),
    PAID: Joi.boolean().required().messages({
        'boolean.base': 'Paid must be a boolean.',
        'any.required': 'Paid is required.'
    }),
    ORDER_ID: Joi.string().required().messages({
        'string.base': 'Order ID must be a string.',
        'any.required': 'Order ID is required.'
    })
});

module.exports = {
    invoiceValidationSchema
};
