import { Schema, model, Types } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";

const feedSchema = new Schema(
  {
    // Post owner
    user: { type: Types.ObjectId, ref: "User", required: true },

    // Interactions (just user references, populate when needed)
    likes: [{ type: Types.ObjectId, ref: "User" }],
    views: { type: Number, default: 0 },
    viewers: [{ type: Types.ObjectId, ref: "User" }],
    tributes: [{ type: Types.ObjectId, ref: "User" }],
    condolences: [{ type: Types.ObjectId, ref: "User" }],
    donations: [{ type: Types.ObjectId, ref: "User" }],

    // Content
    content: { type: String, trim: true },
    uploadUrl: { type: String },

    // Music uploads
    music: [
      {
        url: { type: String },
        addedBy: { type: Types.ObjectId, ref: "User" },
        uploadedAt: { type: Date, default: Date.now },
        duration: { type: Number, required: true, max: 90 },
      },
    ],

    // Comments section
    comments: [
      {
        _id: false,
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

export const FeedModel = model("Feed", feedSchema);
