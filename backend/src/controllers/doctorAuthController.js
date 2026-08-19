const User = require("../models/User");
const bcrypt = require("bcryptjs");
const otpService = require("../services/otpService");

exports.doctorSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "doctor", // SET BY ROUTE
    });

    await otpService.generateAndSendOtp(email, "signup");

    res.status(201).json({
      success: true,
      message: "Doctor account created. Please verify the OTP sent to your email.",
      userId: user._id,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
