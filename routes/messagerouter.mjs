import  {Router} from 'express';
import {
    sendMessage,
    editMessage,
    getMessages,
    deleteMessage}
    from "../controllers/messagecontroller.mjs";
import {verifyToken} from "../middlewares/auth.mjs";


import { uploadMessage } from '../config/cloudinary.mjs';

const messageRouter = Router();

messageRouter.post("/send", verifyToken, uploadMessage.array("attachments"), sendMessage);
//messageRouter.get("/:userId", verifyToken, getMessages);
messageRouter.patch("/edit/:messageId", verifyToken, editMessage);
messageRouter.delete("/delete/:messageId", verifyToken, deleteMessage);

export default messageRouter;
