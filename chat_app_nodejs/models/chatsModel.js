const mongoose = require("mongoose");

// Chater Type
const ChaterType = mongoose.Schema({
  nickname: { type: String, required: true, maxlength: 255, index: 'text'},
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  image: { type: String, default: "" },
});

// Chats Schema
const ChatsSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversations",
    },
    inviter: { type: ChaterType },
    friend: { type: ChaterType },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  }
);

// Chats Model
const ChatsModel = mongoose.model("Chats", ChatsSchema);

module.exports = ChatsModel;
