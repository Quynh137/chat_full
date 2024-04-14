const mongoose = require("mongoose");

// Rooms Schema
const RoomsSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversations",
    },
    name: { type: String, required: true, maxlength: 255 },
    image: { type: String, default: "" },
    member_count: { type: Number, require: true },
    isDefault: {
      type: Boolean,
      default: false,
  },
  },
  {
    timestamps: true,
  },
);

// Rooms Model
const RoomsModel = mongoose.model("Rooms", RoomsSchema);

module.exports = RoomsModel;
