import Joi from 'joi';

export const notificationValidator = Joi.object({
    user: Joi.string().required(), // Assuming user ID is a string
    type: Joi.string().valid('message', 'post', 'tributes', 'condolences', 'donate', 'advertisement').required(),
    message: Joi.string().required(),
    link: Joi.string().uri().required(), // Ensure it’s a valid URL format
    isRead: Joi.boolean().default(false), // Default to false if not provided
});