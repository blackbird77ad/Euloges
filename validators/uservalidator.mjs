import Joi from 'joi';

export const userSignUpValidator = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().min(2).max(100).pattern(/^[a-zA-Z\s]+$/).trim().required(),
    dateOfBirth: Joi.date().iso().required(), // ISO format for date
    profilePicture: Joi.string().optional(),
    role: Joi.string()
        .valid("bereaved", "admin")
});

export const userSignInValidator = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    role: Joi.string()
        .valid("bereaved", "admin")
})

export const userUpdateValidator = Joi.object({
    email: Joi.string().email(),
    password: Joi.string().min(8),
    confirmPassword: Joi.string().min(8),
    name: Joi.string().min(2).max(100).pattern(/^[a-zA-Z\s]+$/).trim(),
    dateOfBirth: Joi.date(),
    profilePicture: Joi.string(),
    message: Joi.string(),
    notification: Joi.string(),
    role: Joi.string()
        .valid("bereaved", "admin")

})