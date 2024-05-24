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
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
);

// Conversations Model
const Conversation = mongoose.model("Conversations", ConversationsSchema);

module.exports = Conversation;
