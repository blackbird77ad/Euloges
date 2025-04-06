import Joi from "joi";

export const postFeedValidator = Joi.object({
    // Validate the user ID (ObjectId)
    user: Joi.string().required(),

    // Validate interactions (arrays of ObjectIds)
    likes: Joi.array().items(Joi.string().hex().length(24)),
    views: Joi.array().items(Joi.string().hex().length(24)),
    tributes: Joi.array().items(Joi.string().hex().length(24)),
    condolences: Joi.array().items(Joi.string().hex().length(24)),
    donations: Joi.array().items(Joi.string().hex().length(24)),

    // Validate content (string, trimmed)
    content: Joi.string().trim(),

    // Validate uploadType (enum: "image", "video", "gif", "text")
    // uploadType: Joi.string().valid("image", "video", "gif", "text").required(),

    // Validate uploadUrl (string, optional)
    uploadUrl: Joi.string().allow(""),

    // Validate music array
    music: Joi.array().items(
        Joi.object({
            url: Joi.string(), // Validate URL (required)
            addedBy: Joi.string().hex().length(24), // Validate user ID (ObjectId)
            uploadedAt: Joi.date().default(Date.now), // Validate date (default to now)
            duration: Joi.number().max(90).required(), // Validate duration (max 90 seconds)
        })
    ),

    // Validate comments array
    comments: Joi.array().items(
        Joi.object({
            user: Joi.string().hex().length(24).required(), // Validate user ID (ObjectId)
            text: Joi.string(), // Validate comment text (required)
            createdAt: Joi.date().default(Date.now), // Validate date (default to now)
        })
    ),
});


export const updateFeedValidator = Joi.object({
    // Validate the user ID (ObjectId)
    user: Joi.string().required(),

    // Validate interactions (arrays of ObjectIds)
    likes: Joi.array().items(Joi.string().hex().length(24)),
    views: Joi.array().items(Joi.string().hex().length(24)),
    tributes: Joi.array().items(Joi.string().hex().length(24)),
    condolences: Joi.array().items(Joi.string().hex().length(24)),
    donations: Joi.array().items(Joi.string().hex().length(24)),

    // Validate content (string, trimmed)
    content: Joi.string().trim(),

    // Validate uploadType (enum: "image", "video", "gif", "text")
    uploadType: Joi.string().valid("image", "video", "gif", "text").required(),

    // Validate uploadUrl (string, optional)
    uploadUrl: Joi.string().allow(""),

    // Validate music array
    music: Joi.array().items(
        Joi.object({
            url: Joi.string(), // Validate URL (required)
            addedBy: Joi.string().hex().length(24), // Validate user ID (ObjectId)
            uploadedAt: Joi.date().default(Date.now), // Validate date (default to now)
            duration: Joi.number().max(90).required(), // Validate duration (max 90 seconds)
        })
    ),

    // Validate comments array
    comments: Joi.array().items(
        Joi.object({
            user: Joi.string().hex().length(24).required(), // Validate user ID (ObjectId)
            text: Joi.string(), // Validate comment text (required)
            createdAt: Joi.date().default(Date.now), // Validate date (default to now)
        })
    ),
});
