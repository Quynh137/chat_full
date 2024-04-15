const mongoose = require("mongoose");

// Conversations Schema
const ConversationsSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["ROOMS", "CHATS"],
      require: true,
    },
    last_message: { type: String, default: "" },
    last_send: { type: Date, default: Date.now() },
  },
  {
    timestamps: true,
  },
);

// Conversations Model
const Conversation = mongoose.model("Conversations", ConversationsSchema);

module.exports = Conversation;
