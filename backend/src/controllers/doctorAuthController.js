const User = require("../models/User");
const bcrypt = require("bcryptjs");
const transporter = require('../config/nodemailer');

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

     await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to GetaDoc – Doctor Account Created",
      html: `
        <h2>Hello Dr. ${name},</h2>
        <p>Your doctor account has been successfully created on <b>GetaDoc</b>.</p>
        <p>Please log in and complete your doctor profile to start receiving appointments.</p>
        <br />
        <p>Regards,<br/>GetaDoc Team</p>
      `,
    });

    res.status(201).json({
      success: true,
      message: "Doctor account created. Please complete your profile.",
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
