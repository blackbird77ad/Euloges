// models/memorial.model.js

import { Schema, model, Types } from 'mongoose';
import { toJSON } from '@reis/mongoose-to-json';

const memorialSchema = new Schema(
  {
    fullName: { type: String, required: true },
    mainPhoto: { type: String }, // Cloudinary URL
    dateOfBirth: { type: Date },
    dateOfDeath: { type: Date },
    ageAtPassing: { type: Number },
    obituary: { type: String },
    time: { type: String }, // Event time (e.g. "2:00 PM")
    title: { type: String }, // Event title (e.g. "Celebration of Life")
    details: { type: String }, // Ceremony or funeral details
    photoGallery: [{ type: String }], // Array of Cloudinary image URLs
    tributeName: { type: String }, // Who wrote the tribute
    tributeRelation: { type: String }, // Their relation to the deceased
    tributeMessage: { type: String }, // Tribute message
    livestreamLink: { type: String }, // Link to livestream
    acknowledgement: { type: String }, // Family appreciation message
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Convert document to JSON format (remove __v, transform _id to id)
memorialSchema.plugin(toJSON);

const MemorialModel = model('Memorial', memorialSchema);
export { MemorialModel };
