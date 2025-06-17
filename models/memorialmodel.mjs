import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

// Main memorial schema
const memorialSchema = new Schema({
  fullName: { type: String, required: true },
  dateOfBirth: { type: Date },
  dateOfDeath: { type: Date },
  ageAtPassing: { type: Number },
  obituary: { type: String },
  livestreamLink: { type: String },
  acknowledgement: { type: String },
  mainPhoto: { type: String },
  photoGallery: [{ type: String }],

  program: [
    {
      time: { type: String },
      title: { type: String },
      details: { type: String }
    }
  ],
  tribute: [
    {
      tributeName: { type: String },
      tributeRelation: { type: String },
      tributeMessage: { type: String }
    }
  ],

  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export const MemorialModel = model("Memorial", memorialSchema);

