const Joi = require("joi");
const { model } = require("mongoose");

const checkUsernameExists = Joi.object({
  USERNAME: Joi.string().alphanum().min(8).max(32).required(),

  PASSWORD: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),

  // repeat_password: Joi.ref('password'),

  // access_token: [
  //     Joi.string(),
  //     Joi.number()
  // ],

  // birth_year: Joi.number()
  //     .integer()
  //     .min(1900)
  //     .max(2013),

  // email: Joi.string()
  //     .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
});

module.exports = {
  checkUsernameExists,
};
