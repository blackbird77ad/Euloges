import Joi from 'joi';

export const advertValidator = Joi.object({
    title: Joi.string().required().trim(),
    description: Joi.string().required().trim(),
    imageUrl: Joi.string().uri().required(),
    status: Joi.string().valid('active', 'inactive').default('active'),
    startDate: Joi.date().default(Date.now),
    endDate: Joi.date().greater(Joi.ref('startDate')),
});