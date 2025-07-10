// routes/guestBookRoutes.mjs
import express from "express";
import {
  createMessage,
  getMessages,
  getMessageById,
  updateMessage,
  deleteMessage
} from "../controllers/guestBookController.mjs";

const guestRouter = express.Router();

guestRouter.post("/guest-book", createMessage);
guestRouter.get("/guest-book", getMessages);
guestRouter.get("/guest-book/:id", getMessageById);
guestRouter.put("/guest-book/:id", updateMessage);
guestRouter.delete("/guest-book/:id", deleteMessage);

export default guestRouter;
