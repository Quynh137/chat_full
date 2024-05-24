const mongoose = require("mongoose");

// Chater Type
const ChaterType = mongoose.Schema({
  nickname: { type: String, required: true, maxlength: 255, index: "text" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  image: { type: String, default: "" },
});

// Message Schema
const MessagesSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversations",
    },
    files: { type: Array },
    type: {
      type: String,
      enum: ["TEXT", "FILES", "VOICE"],
      require: true,
    },
    state: {
      type: String,
      enum: ["REVEIVER", "BOTH", "NONE"],
      default: "BOTH",
      require: true,
    },
    messages: { type: String, require: true },
    seen_at: { type: Date, default: Date.now },
    send_at: { type: Date, default: Date.now },
    seenders: { type: [ChaterType], default: [] },
    sender: { type: ChaterType, require: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  }
);

// Message Model
const MessagesModel = mongoose.model("Messages", MessagesSchema);

module.exports = MessagesModel;
