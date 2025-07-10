// validators/guestBookValidator.mjs
import Joi from "joi";

export const guestBookSchema = Joi.object({
  memorial: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid memorial ID format."
    }),
  user: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid user ID format."
    }),
  yourName: Joi.string().trim().min(1).required(),
  yourMessage: Joi.string().trim().min(1).required()
});


export const guestBookUpdateSchema = Joi.object({
  yourName: Joi.string().trim().min(1),
  yourMessage: Joi.string().trim().min(1)
});