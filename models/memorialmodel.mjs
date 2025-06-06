import { Schema, model, Types} from 'mongoose'
import {toJSON} from '@reis/mongoose-to-json'

const memorialSchema = new Schema({
  fullName: { type: String, required: true },
  mainPhoto: { type: String },
  dateOfBirth: { type: Date },
  dateOfDeath: { type: Date },
  ageAtPassing: { type: Number },
  obituary: { type: String },
  time: { type: String },
  title: { type: String },
  details: { type: String },
  photoGallery: [{ type: String }],
  tribute: { type: String },
  livestreamLink: { type: String },
  acknowledgement: { type: String },
  user: {
    type: Types.ObjectId,
    ref: 'User',
    required: true 
  }
}, { timestamps: true });


// Convert document to JSON format
memorialSchema.plugin(toJSON);

export const MemorialModel = model('Memorial', memorialSchema)