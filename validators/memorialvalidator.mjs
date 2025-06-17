import Joi from "joi";

export const postMemorialValidator = Joi.object({
  fullName: Joi.string().required(),
  dateOfBirth: Joi.date().required(),
  dateOfDeath: Joi.date().required(),
  ageAtPassing: Joi.number().required(),
  obituary: Joi.string().required(),
  livestreamLink: Joi.string(),
  acknowledgement: Joi.string().required(),
  program: Joi.array().items(
    Joi.object({
      time: Joi.string().required(),
      title: Joi.string().required(),
      details: Joi.string().required()
    })
  ).required(),
  tribute: Joi.array().items(
    Joi.object({
      tributeName: Joi.string().required(),
      tributeRelation: Joi.string().required(),
      tributeMessage: Joi.string().required()
    })
  ).required()
}).unknown(true); 

export const updateMemorialValidator = Joi.object({
  fullName: Joi.string(),
  dateOfBirth: Joi.date(),
  dateOfDeath: Joi.date(),
  ageAtPassing: Joi.number(),
  obituary: Joi.string(),
  livestreamLink: Joi.string(),
  acknowledgement: Joi.string(),
  program: Joi.array().items(
    Joi.object({
      time: Joi.string(),
      title: Joi.string(),
      details: Joi.string()
    })
  ),
  tribute: Joi.array().items(
    Joi.object({
      tributeName: Joi.string(),
      tributeRelation: Joi.string(),
      tributeMessage: Joi.string()
    })
  ).required()
}).unknown(true); 