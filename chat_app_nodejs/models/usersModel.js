const { mongoose, model } = require("mongoose");

// Online Type
const OnlineType = mongoose.Schema({
  state: { type: String, enum: ["ONLINE", "OFFLINE"], default: false },
  time: { type: Date, default: Date.now },
});

// Users Schema
const UsersSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, trim: true },
    password: { type: String, required: true, minlength: 3, maxlength: 1024 },
    firstname: { type: String, required: true, maxlength: 50 },
    lastname: { type: String, required: true, maxlength: 50 },
    active: { type: Boolean, default: true },
    phone: { type: String, required: true, minlength: 10, maxlength: 10 },
    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "OTHER"],
      default: "OTHER",
    },
    roles: { type: [String], enum: ["USER", "ADMIN"], default: ["USER"] },
    avatar: { type: String, default: "" },
    online: { type: OnlineType },
    forward: {
      type: Boolean,
      default: false
  },
    reply: {
    type: String,
    default: ''
},
  },
  {
    timestamps: true,
  },
);

// User Model
const usersModel = model("User", UsersSchema);

module.exports = usersModel;
