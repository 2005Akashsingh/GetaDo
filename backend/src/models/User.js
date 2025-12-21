const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      default: "patient",
    },
    resetOtp: {
      type: String,
      default: "",
    },
    resetOtpExpire: {
      type: Date,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model('User', userSchema);