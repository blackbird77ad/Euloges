import GuestBook from "../models/guestBook.mjs";
import { guestBookSchema, guestBookUpdateSchema } from "../validators/guestBookValidator.mjs";

// Create a guestbook message linked to a memorial
export const createMessage = async (req, res, next) => {
  const { error } = guestBookSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const message = new GuestBook({
      memorial: req.params.memorialId, // coming from URL param
      yourName: req.body.yourName,
      yourMessage: req.body.yourMessage
    });
    const saved = await message.save();
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
};

// Get all messages for a specific memorial
export const getMessagesForMemorial = async (req, res, next) => {
  try {
    const messages = await GuestBook.find({ memorial: req.params.memorialId })
      .sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    next(err);
  }
};

// Get one message
export const getMessageById = async (req, res, next) => {
  try {
    const message = await GuestBook.findById(req.params.id);
    if (!message) return res.status(404).json({ message: "Message not found." });
    res.json(message);
  } catch (err) {
    next(err);
  }
};

// Update message
export const updateMessage = async (req, res, next) => {
  const { error } = guestBookUpdateSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const message = await GuestBook.findById(req.params.id);
    if (!message) return res.status(404).json({ message: "Message not found." });

    if (req.body.yourName) message.yourName = req.body.yourName;
    if (req.body.yourMessage) message.yourMessage = req.body.yourMessage;

    const updated = await message.save();
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// Delete message
export const deleteMessage = async (req, res, next) => {
  try {
    const message = await GuestBook.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ message: "Message not found." });
    res.json({ message: "Message deleted successfully." });
  } catch (err) {
    next(err);
  }
};
