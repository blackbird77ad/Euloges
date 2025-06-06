import Joi from 'joi';

export const postMemorialValidator= Joi.object({
  fullName: Joi.string().required(),
  mainPhoto: Joi.string(),
  dateOfBirth: Joi.date(),
  dateOfDeath: Joi.date(),
  ageAtPassing: Joi.number(),
  obituary: Joi.string(),
  time: Joi.string().optional(),
  title: Joi.string().trim(),
  details: Joi.string(),
  photoGallery: Joi.array(),
  tribute: Joi.string(),
  livestreamLink: Joi.string(),
  acknowledgement: Joi.string()
});


export const updateMemorialValidator = Joi.object({
  fullName: Joi.string().required(),
  mainPhoto: Joi.string(),
  dateOfBirth: Joi.date(),
  dateOfDeath: Joi.date(),
  ageAtPassing: Joi.number(),
  obituary: Joi.string(),
  time: Joi.string().optional(),
  title: Joi.string().trim(),
  details: Joi.string(),
  photoGallery: Joi.array(),
  tribute: Joi.string(),
  livestreamLink: Joi.string(),
  acknowledgement: Joi.string()
});
