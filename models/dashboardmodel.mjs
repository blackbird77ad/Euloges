import { Schema, model, Types } from "mongoose";
import {toJSON} from "@reis/mongoose-to-json";

const dashboardSchema = new Schema(
    {
        user: { type: Types.ObjectId, ref: "User", required: true, unique: true }, // User-specific dashboard
        totalPosts: { type: Number, default: 0 }, // User's total posts
        totalLikes: { type: Number, default: 0 }, // Likes on user's posts
        totalComments: { type: Number, default: 0 }, // User's comments count
        totalViews: { type: Number, default: 0 }, // Views on user's posts
        lastActive: { type: Date, default: Date.now }, // Last login or activity time
    },
    { timestamps: true }
);

dashboardSchema.plugin(toJSON);

export const DashboardModel = model("Dashboard", dashboardSchema);
