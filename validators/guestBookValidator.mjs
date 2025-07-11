// validators/guestBookValidator.mjs
import Joi from "joi";

export const guestBookSchema = Joi.object({
  yourName: Joi.string().trim().min(1).required(),
  yourMessage: Joi.string().trim().min(1).required()
});

export const guestBookUpdateSchema = Joi.object({
  yourName: Joi.string().trim().min(1),
  yourMessage: Joi.string().trim().min(1)
});
