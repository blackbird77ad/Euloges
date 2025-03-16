import  {Router} from 'express';
import { sendMessage, getMessages, editMessage, deleteMessage } from "../controllers/messageController.mjs";
import {verifyToken} from "../middlewares/auth.mjs";

const messageRouter = Router();

messageRouter.post("/send",verifyToken, sendMessage);
messageRouter.get("/:userId", verifyToken, getMessages);
messageRouter.patch("/edit/:messageId", verifyToken, editMessage);
messageRouter.delete("/delete/:messageId", verifyToken, deleteMessage);

export default messageRouter;
