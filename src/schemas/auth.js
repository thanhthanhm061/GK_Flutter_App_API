import Joi from "joi";

export const registerSchema = Joi.object({
    username: Joi.string().required().trim().messages({
        "any.required": "Username là trường bắt buộc",
        "string.empty": "Username không được để trống",
        "string.trim": "Username không được để khoảng trắng đầu/cuối"
    }),
    email: Joi.string().email().required().messages({
        "any.required": "Email là trường bắt buộc",
        "string.email": "Email không đúng định dạng",
        "string.trim": "Email không được để khoảng trắng đầu/cuối"
    }),
    password: Joi.string().min(6).required().messages({
        "any.required": "Password là trường bắt buộc",
        "string.min": "Password phải có ít nhất {#limit} ký tự",
        "string.empty": "Password không được để trống"
    }),
    confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({
        "any.required": "Confirm Password là trường bắt buộc",
        "any.only": "Confirm Password không trùng khớp",
        "string.empty": "Confirm Password không được để trống"
    }),
    age: Joi.number().max(100).messages({
        "number.max": "Tuổi không hợp lệ",
    }),
});
