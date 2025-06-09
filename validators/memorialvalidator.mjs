import Joi from 'joi';

export const postMemorialValidator = Joi.object({
  fullName: Joi.string().required(),
  dateOfBirth: Joi.date().optional(),
  dateOfDeath: Joi.date().optional(),
  ageAtPassing: Joi.number().optional(),
  obituary: Joi.string().optional(),
  time: Joi.string().optional(),
  title: Joi.string().optional(),
  details: Joi.string().optional(),
  tributeName: Joi.string().optional(),
  tributeRelation: Joi.string().optional(),
  tributeMessage: Joi.string().optional(),
  livestreamLink: Joi.string(),
  acknowledgement: Joi.string().optional(),
});


export const updateMemorialValidator = Joi.object({
  fullName: Joi.string().required(),
  dateOfBirth: Joi.date().optional(),
  dateOfDeath: Joi.date().optional(),
  ageAtPassing: Joi.number().optional(),
  obituary: Joi.string().optional(),
  time: Joi.string().optional(),
  title: Joi.string().optional(),
  details: Joi.string().optional(),
  tributeName: Joi.string().optional(),
  tributeRelation: Joi.string().optional(),
  tributeMessage: Joi.string().optional(),
  livestreamLink: Joi.string().uri().optional(),
  acknowledgement: Joi.string().optional(),
});
