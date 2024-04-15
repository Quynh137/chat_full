const mongoose = require("mongoose");

// Chater Type
const ChaterType = mongoose.Schema({
  nickname: { type: String, required: true, maxlength: 255, index: 'text'},
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
      enum: ["TEXT", "FILES", 'VOICE'],
      require: true,
    },
    state:{
      type: String,
      enum: ["REVEIVER", "BOTH", "NONE"],
      default: "BOTH",
      require: true,
    },
    messages: { type: String, require: true},
    media:  {
      name: {
          type: String,
          default: ''
      },
      type: {
          type: String,
          default: ''
      },
      size: {
          type: Number,
          default: 0
      },
      url: {
          type: String,
          default: ''
      }
  },
    seen_at: { type: Date, default: Date.now },
    send_at: { type: Date, default: Date.now },
    seenders: { type: [ChaterType], default: [] },
    sender: { type: ChaterType, require: true },
    reply: {
      type: String,
      default: ''
  },
  },
  {
    timestamps: true,
  },
);

// Message Model
const MessagesModel = mongoose.model("Messages", MessagesSchema);

module.exports = MessagesModel;
