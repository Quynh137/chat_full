const mongoose = require("mongoose");

const ChaterType = mongoose.Schema({
  nickname: { type: String, required: true, maxlength: 255, index: 'text'},
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  image: { type: String, default: "" },
});

// Friend Schema
const FriendsSchema = new mongoose.Schema(
  {
    inviter: { type: ChaterType },
    friend: { type: ChaterType },
    state: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REQUEST"],
      default: "PENDING",
    },
    block: { type: Boolean, default: false },
    friend_at: { type: Date, default: Date.now },
  }
);

// Friend Model
const FriendModel = mongoose.model("Friends", FriendsSchema);

module.exports = FriendModel;
