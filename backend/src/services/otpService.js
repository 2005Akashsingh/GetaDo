const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Otp = require("../models/Otp");
const emailService = require("./emailService");
const env = require("../config/env");

const OTP_TTL_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

exports.generateAndSendOtp = async (email, purpose) => {
  const code = crypto.randomInt(100000, 999999).toString();
  const codeHash = await bcrypt.hash(code, 10);

  await Otp.deleteMany({ email, purpose });
  await Otp.create({
    email,
    codeHash,
    purpose,
    expiresAt: new Date(Date.now() + OTP_TTL_MS),
  });

  if (env.nodeEnv !== "production") {
    // Lets the flow be tested end-to-end before real SMTP credentials are configured
    console.log(`[otp] ${purpose} code for ${email}: ${code}`);
  }

  try {
    await emailService.sendOtpEmail(email, code, purpose);
  } catch (error) {
    console.error(`[otp] Failed to email OTP to ${email}:`, error.message);
    if (env.nodeEnv === "production") throw error;
  }
};

exports.verifyOtp = async (email, purpose, code) => {
  const otp = await Otp.findOne({ email, purpose }).sort({ createdAt: -1 });

  if (!otp) {
    const err = new Error("No OTP request found. Please request a new code.");
    err.statusCode = 400;
    throw err;
  }

  if (otp.expiresAt < new Date()) {
    await otp.deleteOne();
    const err = new Error("OTP expired. Please request a new code.");
    err.statusCode = 400;
    throw err;
  }

  if (otp.attempts >= MAX_ATTEMPTS) {
    await otp.deleteOne();
    const err = new Error("Too many incorrect attempts. Please request a new code.");
    err.statusCode = 429;
    throw err;
  }

  const isMatch = await bcrypt.compare(code, otp.codeHash);
  if (!isMatch) {
    otp.attempts += 1;
    await otp.save();
    const err = new Error("Invalid OTP");
    err.statusCode = 400;
    throw err;
  }

  await otp.deleteOne();
};
