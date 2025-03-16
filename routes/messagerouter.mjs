import  {Router} from 'express';
import {
    sendMessage,
    editMessage,
    getMessages,
    deleteMessage}
    from "../controllers/messagecontroller.mjs";
import {verifyToken} from "../middlewares/auth.mjs";

const messageRouter = Router();

messageRouter.post("/send",verifyToken, sendMessage);
messageRouter.get("/:userId", verifyToken, getMessages);
messageRouter.patch("/edit/:messageId", verifyToken, editMessage);
messageRouter.delete("/delete/:messageId", verifyToken, deleteMessage);

export default messageRouter;
