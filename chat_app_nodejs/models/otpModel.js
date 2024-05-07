const mongoose = require("mongoose");

const OtpSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 60, 
    },
  });
  const OTPModel = mongoose.model("OTP", OtpSchema);

  module.exports = OTPModel;