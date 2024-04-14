const mongoose = require("mongoose");

// Conversations Schema
const ConversationsSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["ROOM", "CHATS"],
      require: true,
    },
    last_message: { type: mongoose.Schema.Types.ObjectId, ref: "Messages" },
  },
  {
    timestamps: true,
  },
);

// Conversations Model
const Conversation = mongoose.model("Conversations", ConversationsSchema);

module.exports = Conversation;
