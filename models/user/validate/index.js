const Joi = require("joi");
const { Types } = require("mongoose");

const registerValidate = Joi.object({
  USERNAME: Joi.string().trim().alphanum().min(5).max(32).required()
    .messages({
      "string.base": "Tên người dùng phải là một chuỗi ký tự.",
      "string.empty": "Tên người dùng không được để trống.",
      "string.min": "Tên người dùng phải có ít nhất {#limit} ký tự.",
      "string.max": "Tên người dùng phải có nhiều nhất {#limit} ký tự.",
      "any.required": "Tên người dùng là bắt buộc."
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
      "string.pattern.base":
        "Mật khẩu phải bao gồm ít nhất một chữ cái viết hoa, một chữ cái viết thường, một số và một ký tự đặc biệt, và không được chứa khoảng trắng.",
      "string.min": "Mật khẩu phải có độ dài ít nhất là {#limit} ký tự.",
      "string.max": "Mật khẩu phải có độ dài nhiều nhất là {#limit} ký tự.",
      "any.required": "Mật khẩu là bắt buộc."
    }),

  FULLNAME: Joi.string()
    .trim()
    .pattern(/^[A-Za-z\s]+$/)
    .min(5)
    .max(100)
    .custom((value, helpers) => {
      if (value.split(" ").length < 2) {
        return helpers.message("Họ và tên phải chứa ít nhất hai từ.");
      }
      return value;
    })
    .required()
    .messages({
      "string.base": "Họ và tên phải là một chuỗi ký tự.",
      "string.pattern.base": "Họ và tên chỉ được chứa các chữ cái và khoảng trắng.",
      "string.empty": "Họ và tên không được để trống.",
      "string.min": "Họ và tên phải có ít nhất {#limit} ký tự.",
      "string.max": "Họ và tên phải có nhiều nhất {#limit} ký tự.",
      "any.required": "Họ và tên là bắt buộc."
    }),

  EMAIL: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }).required().messages({
    "string.email": "Email phải là một địa chỉ email hợp lệ.",
    "any.required": "Email là bắt buộc."
  }),

  ADDRESS: Joi.string().trim().max(255).optional().messages({
    "string.max": "Địa chỉ phải có nhiều nhất {#limit} ký tự."
  }),


  GENDER: Joi.string().valid('Male', 'Female', 'Other').optional().messages({
    "any.only": "Giới tính phải là 'Male', 'Female', hoặc 'Other'."
  })

});

const updateUserValidate = Joi.object({
  FULLNAME: Joi.string()
    .trim()
    .pattern(/^[A-Za-z\s]+$/)
    .min(5)
    .max(100)
    .custom((value, helpers) => {
      if (value.split(" ").length < 2) {
        return helpers.message("Họ và tên phải chứa ít nhất hai từ.");
      }
      return value;
    })
    .messages({
      "string.base": "Họ và tên phải là một chuỗi ký tự.",
      "string.pattern.base": "Họ và tên chỉ được chứa các chữ cái và khoảng trắng.",
      "string.empty": "Họ và tên không được để trống.",
      "string.min": "Họ và tên phải có ít nhất {#limit} ký tự.",
      "string.max": "Họ và tên phải có nhiều nhất {#limit} ký tự."
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
    .optional()
    .messages({
      "string.pattern.base":
        "Mật khẩu phải bao gồm ít nhất một chữ cái viết hoa, một chữ cái viết thường, một số và một ký tự đặc biệt, và không được chứa khoảng trắng.",
      "string.min": "Mật khẩu phải có độ dài ít nhất là {#limit} ký tự.",
      "string.max": "Mật khẩu phải có độ dài nhiều nhất là {#limit} ký tự."
    }),

  EMAIL: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }).optional().messages({
    "string.email": "Email phải là một địa chỉ email hợp lệ."
  }),

  ADDRESS: Joi.string().trim().max(255).optional().messages({
    "string.max": "Địa chỉ phải có nhiều nhất {#limit} ký tự."
  }),

  GENDER: Joi.string().valid('Male', 'Female', 'Other').optional().messages({
    "any.only": "Giới tính phải là 'Male', 'Female', hoặc 'Other'."
  })
}).or('FULLNAME', 'PASSWORD', 'EMAIL', 'ADDRESS', 'GENDER')
.messages({
  "object.missing": "Ít nhất một trường phải được cập nhật."
});

const loginValidate = Joi.object({
  USERNAME: Joi.string().trim().min(5).max(32).required()
    .messages({
      "string.base": "Tên người dùng phải là một chuỗi ký tự.",
      "string.empty": "Tên người dùng không được để trống.",
      "string.min": "Tên người dùng phải có ít nhất {#limit} ký tự.",
      "string.max": "Tên người dùng phải có nhiều nhất {#limit} ký tự.",
      "any.required": "Tên người dùng là bắt buộc."
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
      "string.pattern.base":
        "Mật khẩu phải bao gồm ít nhất một chữ cái viết hoa, một chữ cái viết thường, một số và một ký tự đặc biệt, và không được chứa khoảng trắng.",
      "string.min": "Mật khẩu phải có độ dài ít nhất là {#limit} ký tự.",
      "string.max": "Mật khẩu phải có độ dài nhiều nhất là {#limit} ký tự.",
      "any.required": "Mật khẩu là bắt buộc."
    }),
});

function validateUserId(userId) {
  const schema = Joi.string().custom((value, helpers) => {
    if (!Types.ObjectId.isValid(value)) {
      return helpers.error('any.invalid');
    }
    return value;
  }, 'ObjectId validation').required().messages({
    "any.invalid": "ID người dùng không hợp lệ.",
    "any.required": "ID người dùng là bắt buộc."
  });

  return schema.validate(userId);
}

function validateOrganizationId(orgId) {
  const schema = Joi.string().custom((value, helpers) => {
    if (!Types.ObjectId.isValid(value)) {
      return helpers.error('any.invalid');
    }
    return value;
  }, 'ObjectId validation').required().messages({
    "any.invalid": "ID tổ chức không hợp lệ.",
    "any.required": "ID tổ chức là bắt buộc."
  });

  return schema.validate(orgId);
}

module.exports = {
  registerValidate,
  updateUserValidate,
  loginValidate,
  validateUserId,
  validateOrganizationId
};
