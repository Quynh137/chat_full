const mongoose = require("mongoose");

// Rooms Schema
const RoomsSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversations",
      unique: true,
      require: true
    },
    name: { type: String, required: true, maxlength: 255 },
    image: { type: String, default: "" },
    member_count: { type: Number, require: true },
  },
  {
    timestamps: true,
  },
);

// Rooms Model
const RoomsModel = mongoose.model("Rooms", RoomsSchema);

module.exports = RoomsModel;
