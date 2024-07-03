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
    PACKAGE_NAME: Joi.string().required().messages({
        'string.base': 'Package Name must be a string.',
        'any.required': 'Package Name is required.'
    }),
    NUMBER_OF_PRODUCT: Joi.number().integer().min(0).required().messages({
        'number.base': 'Number of Product must be a number.',
        'number.integer': 'Number of Product must be an integer.',
        'number.min': 'Number of Product cannot be negative.',
        'any.required': 'Number of Product is required.'
    }),
    NUMBER_OF_COMMENT: Joi.number().integer().min(0).required().messages({
        'number.base': 'Number of Comment must be a number.',
        'number.integer': 'Number of Comment must be an integer.',
        'number.min': 'Number of Comment cannot be negative.',
        'any.required': 'Number of Comment is required.'
    }),
    LEVEL: Joi.number().integer().min(0).required().messages({
        'number.base': 'Level must be a number.',
        'number.integer': 'Level must be an integer.',
        'number.min': 'Level cannot be negative.',
        'any.required': 'Level is required.'
    }),
    COST: Joi.number().min(0).required().messages({
        'number.base': 'Cost must be a number.',
        'number.min': 'Cost cannot be negative.',
        'any.required': 'Cost is required.'
    }),
    AMOUNT: Joi.number().min(0).required().messages({
        'number.base': 'Amount must be a number.',
        'number.min': 'Amount cannot be negative.',
        'any.required': 'Amount is required.'
    }),
    MONTH: Joi.number().integer().min(1).max(12).required().messages({
        'number.base': 'Month must be a number.',
        'number.integer': 'Month must be an integer.',
        'number.min': 'Month must be between 1 and 12.',
        'number.max': 'Month must be between 1 and 12.',
        'any.required': 'Month is required.'
    }),
    DISCOUNT: Joi.number().min(0).max(100).required().messages({
        'number.base': 'Discount must be a number.',
        'number.min': 'Discount cannot be negative.',
        'number.max': 'Discount cannot be greater than 100.',
        'any.required': 'Discount is required.'
    }),
    PAID: Joi.boolean().required().messages({
        'boolean.base': 'Paid must be a boolean.',
        'any.required': 'Paid is required.'
    }),
    APP_TRANS_ID: Joi.string().required().messages({
        'string.base': 'Order ID must be a string.',
        'any.required': 'Order ID is required.'
    }),
    ORDER_ID: Joi.string().required().messages({
        'string.base': 'Order ID must be a string.',
        'any.required': 'Order ID is required.'
    }),
    DATE_ISSUED: Joi.date().default(Date.now).required().messages({
        'date.base': 'Date Issued must be a valid date.',
        'any.required': 'Date Issued is required.'
    }),
    THRU_DATE: Joi.date().required().messages({
        'date.base': 'Thru Date must be a valid date.',
        'any.required': 'Thru Date is required.'
    }),
    paymentGateway: Joi.string().valid('zalopay', 'momo').required().messages({
        'string.base': 'Payment Gateway must be a string.',
        'any.only': 'Payment Gateway must be either "zalopay" or "momo".',
        'any.required': 'Payment Gateway is required.'
    })
});

module.exports = {
    invoiceValidationSchema
};
