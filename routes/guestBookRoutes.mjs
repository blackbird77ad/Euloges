import express from "express";
import {
  createMessage,
  getMessagesForMemorial,
  getMessageById,
  updateMessage,
  deleteMessage
} from "../controllers/guestBookController.mjs";

const guestRouter = express.Router();

// POST a guestbook message
guestRouter.post("/memorials/:memorialId/guestbook", createMessage);

// GET all messages for a memorial
guestRouter.get("/memorials/:memorialId/guestbook", getMessagesForMemorial);

// GET single message
guestRouter.get("/guestbook/:id", getMessageById);

// PUT update
guestRouter.patch("/guestbook/:id", updateMessage);

// DELETE
guestRouter.delete("/guestbook/:id", deleteMessage);

export default guestRouter;
