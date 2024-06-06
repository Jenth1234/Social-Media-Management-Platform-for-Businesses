const Joi = require("joi");
// const { model } = require("mongoose");
const { Types } = require("mongoose");

const registerValidate = Joi.object({
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

  FULL_NAME: Joi.string()
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

  ADDRESS: Joi.string().trim().max(255),

  GENDER: Joi.string().valid('Male', 'Female', 'Other') 
});

const updateUserValidate = Joi.object({

  FULL_NAME: Joi.string()
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

});

const loginValidate = Joi.object({
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
});

function validateUserId(userId) {
  const schema = Joi.string().custom((value, helpers) => {
    if (!Types.ObjectId.isValid(value)) {
      return helpers.error('any.invalid');
    }
    return value;
  }, 'ObjectId validation').required();

  return schema.validate(userId);
}

function validateOrganizationId(orgId) {
  const schema = Joi.string().custom((value, helpers) => {
    if (!Types.ObjectId.isValid(value)) {
      return helpers.error('any.invalid');
    }
    return value;
  }, 'ObjectId validation').required();

  return schema.validate(orgId);
}

module.exports = {
  registerValidate,
  updateUserValidate,
  loginValidate,
  validateUserId,
  validateOrganizationId
};
