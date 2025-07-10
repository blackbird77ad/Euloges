// controllers/guestBookController.mjs
import GuestBook from "../models/guestBook.mjs";
import { guestBookSchema, guestBookUpdateSchema } from "../validators/guestBookValidator.mjs";


// CREATE a guest book message
export const createMessage = async (req, res) => {
  const { error } = guestBookSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const message = new GuestBook(req.body);
    const saved = await message.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ all guest book messages
export const getMessages = async (req, res) => {
  try {
    const messages = await GuestBook.find()
      .populate("memorial", "title")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ a single message by ID
export const getMessageById = async (req, res) => {
  try {
    const message = await GuestBook.findById(req.params.id)
      .populate("memorial", "title")
      .populate("user", "name email");

    if (!message) {
      return res.status(404).json({ message: "Message not found." });
    }

    res.json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE a message
export const updateMessage = async (req, res) => {
  const { error } = guestBookUpdateSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const message = await GuestBook.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: "Message not found." });
    }

    if (req.body.yourName !== undefined) message.yourName = req.body.yourName;
    if (req.body.yourMessage !== undefined) message.yourMessage = req.body.yourMessage;

    const updated = await message.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// DELETE a message
export const deleteMessage = async (req, res) => {
  try {
    const message = await GuestBook.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({ message: "Message not found." });
    }

    res.json({ message: "Message deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
