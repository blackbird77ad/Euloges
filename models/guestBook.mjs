// models/guestBook.mjs
import mongoose from "mongoose";

const guestBookSchema = new mongoose.Schema(
  {
    memorial: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Memorial",
      required: true
    },
    yourName: {
      type: String,
      required: true,
      trim: true
    },
    yourMessage: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("GuestBook", guestBookSchema);
