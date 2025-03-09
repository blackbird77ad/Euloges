import {Schema, model, Types} from 'mongoose';
import {toJSON} from "@reis/mongoose-to-json";


const notificationSchema = new Schema({
    user: {type: Types.ObjectId, ref: "User", required: true}, //recipient of nofications
    type: {type: String, enum: ["message", "post", "tributes", "condolences", "donate", "advertisement"], required: true}, //Type of notification
    message: {type: String, required: true}, //Heading or text of the notification
    link: {type: String, required: true}, //url or page to view when clicked
    isRead: {type: Boolean, default: false},

},

    {timestamps: true});

//Add toJson plugin
notificationSchema.plugin(toJSON);

export const NotificationModel = model("Notification", notificationSchema);