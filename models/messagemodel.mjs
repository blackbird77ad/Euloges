import { Schema, model, Types } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";
import Joi from "joi";

const messageSchema = new Schema({
    sender: {type: Types.ObjectId, ref: "User", required: true},
    receiver: {type: Types.ObjectId, ref: "User", required: true},
    text: {type: String, required: true}, //message content goes here
    status:{type: String, enum: ["sent", "delivered",  "read"], default: "sent"},
    sendTime: {type: Date, default: Date.now}, //Time sent
    deletedBy: [{type: Types.ObjectId, ref: "User"}],
    attachments: [{type: String}],
    isEdited: {type: Boolean, default: false}
},

    {
        timestamps: true,
    });

//toJson Plugin
messageSchema.plugin(toJSON);

export const MessageModel = model("Message", messageSchema);

