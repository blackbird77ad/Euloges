import mongoose from "mongoose";
import {MessageModel} from "../models/messagemodel.mjs";

//Send message to another user
export const sendMessage = async (req, res, next) => {
    try {
      const { receiver, text } = req.body;
  
      const attachments = req.files?.map(file => file.path);
  
      const newMessage = new MessageModel({
        sender: req.user.id,
        receiver,
        text,
        attachments,
        sendTime: new Date(),
      });
  
      await newMessage.save();
  
      res.status(201).json(newMessage);
    } catch (error) {
      next(error);
    }
  };
  

//Get messages for a user (both sent & received)
export const getMessages = async (req, res, next) => {
    try {
        const userId = req.params.userId;

        const messages = await MessageModel.find({
            $or: [{ sender: userId }, { receiver: userId }],
        }).sort({ sendTime: -1 });

        res.status(200).json(messages);
    } catch (error) {
        next(error);
    }
};

//Edit a message
export const editMessage = async (req, res, next) => {
    try {
        const { messageId } = req.params;
        const { text } = req.body;

        const updatedMessage = await MessageModel.findByIdAndUpdate(
            messageId,
            { text, isEdited: true },
            { new: true }
        );

        if (!updatedMessage) {
            return res.status(404).json({ error: "Message not found" });
        }

        res.status(200).json(updatedMessage);
    } catch (error) {
        next(error);
    }
};

//Delete message
export const deleteMessage = async (req, res, next) => {
    try {
        const { messageId } = req.params;

        const deletedMessage = await MessageModel.findByIdAndDelete(messageId);
        if (!deletedMessage) {
            return res.status(404).json({ error: "Message not found" });
        }

        res.status(200).json({ message: "Message deleted successfully" });
    } catch (error) {
        next(error);
    }
};

