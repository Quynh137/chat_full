const mongoose = require("mongoose");


// RoomMembers Schema
const RoomMembersSchema = new mongoose.Schema(
  {
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Rooms" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    nickname: { type: String, required: true, maxlength: 255, index: 'text'},
    role: { type: String, enum: ["MANAGER", "MEMBER"], default: "MEMBER" },
    block: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

// RoomMembers Model
const RoomMembersModel = mongoose.model("RoomMembers", RoomMembersSchema);

module.exports = RoomMembersModel;
