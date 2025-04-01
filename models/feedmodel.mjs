import { Schema, model, Types } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";

const feedSchema = new Schema(
    {
        // Identify the post owner
        user: { type: Types.ObjectId, ref: "User", required: true },

        // Interactions: Store multiple user IDs instead of single ones
        likes: [{ type: Types.ObjectId, ref: "User" }],
        views: [{ type: Types.ObjectId, ref: "User" }],
        tributes: [{ type: Types.ObjectId, ref: "User" }],
        condolences: [{ type: Types.ObjectId, ref: "User" }],
        donations: [{ type: Types.ObjectId, ref: "User" }],

        // Content details
        content: { type: String, trim: true },
        uploadType: {
            type: String,
            enum: ["image", "video", "gif", "text"],
            required: true,
        },
        uploadUrl: { type: String, default: "" },

        // Music Uploads (One per user per post, max 1.5 mins)
        music: [
            {
                url: { type: String, required: true },
               addedBy: { type: Types.ObjectId, ref: "User" },
                uploadedAt: { type: Date, default: Date.now },
                duration: { type: Number, required: true, max: 90 },
            },
        ],

        // Comments Section
        comments: [
            {
                user: { type: Types.ObjectId, ref: "User" },
                text: { type: String, required: true },
                createdAt: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true }
);

// Convert document to JSON format
feedSchema.plugin(toJSON);

export const FeedModel = model('Feed', feedSchema);
