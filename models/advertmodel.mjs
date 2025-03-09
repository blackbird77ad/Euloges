import { Schema, model, Types } from "mongoose";

const advertSchema = new Schema(
    {
        admin: { type: Types.ObjectId, ref: "User", required: true }, // Only admin can post ads
        title: { type: String, required: true, trim: true }, // Short ad title
        description: { type: String, required: true, trim: true }, // Ad text content
        imageUrl: { type: String, required: true }, // Image for the ad
        status: { type: String, enum: ["active", "inactive"], default: "active" }, // Ad status
        startDate: { type: Date, default: Date.now }, // When the ad starts
        endDate: { type: Date }, // When the ad expires
    },
    { timestamps: true }
);

export const AdvertModel = model("Advertisement", advertSchema);

