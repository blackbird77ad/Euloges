import { Schema, model, Types } from 'mongoose';
import { toJSON } from '@reis/mongoose-to-json';

const userSchema = new Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    resetToken: { type: String, default: null }, // For forgot password
    name: { type: String },
    dateOfBirth: { type: Date, default: Date.now },
    profilePicture: { type: String },
    coverPhoto: { type: String, default: "" },
    message: { type: Types.ObjectId, ref: 'Message' },
    notification: { type: Types.ObjectId, ref: 'Notification' },
    feed: { type: Types.ObjectId, ref: 'Feed' },
    role: { type: String, enum: ['bereaved', 'admin'], default: 'bereaved', required: true },
    dashboard: { type: Schema.Types.ObjectId, ref: 'Dashboard' },
    followers: [{ type: Types.ObjectId, ref: 'User' }], // Array of User IDs that follow this user
    following: [{ type: Types.ObjectId, ref: 'User' }]  // Array of User IDs that this user follows
}, {
    timestamps: true,
});

// Add the toJSON plugin
userSchema.plugin(toJSON);

export const UserModel = model('User', userSchema);