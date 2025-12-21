const express = require("express");
const router = express.Router();


const { signup, login, forgotPassword, resetPassword, logout, getMe} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// Register new user
router.post("/signup", signup);

// Login user
router.post("/login", login);

//Get user
router.get("/me", authMiddleware, getMe);

//Logout user
router.post("/logout", logout);

// Send OTP for password reset
router.post("/forgot-password", forgotPassword);

// Reset password using OTP
router.post("/reset-password", resetPassword);

module.exports = router;
