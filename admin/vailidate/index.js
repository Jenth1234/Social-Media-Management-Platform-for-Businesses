const Joi = require('joi');
const { model } = require('mongoose');

const registerSchema = Joi.object({
    USERNAME: Joi.string()
        .alphanum()
        .min(8)
        .max(32)
        .required(),
    PASSWORD: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required(),
    FULLNAME: Joi.string()
        .min(1)
        .max(100)
        .required(),
    EMAIL: Joi.string()
        .email({ tlds: { allow: false } }) // Không giới hạn các miền cấp cao nhất (TLDs)
        .required(),
    ROLE: Joi.string()
        .valid('USER', 'ORGANIZATION', 'ADMIN') // Cập nhật các vai trò có thể có
        .required()
});

module.exports={
    checkUsernameExists

}  
