const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Import your User model

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔹 Fetch the full user from DB using the ID in the token
    const user = await User.findById(decoded.userId).select("name email role");

    if (!user) {
      return res.status(404).json({ success: false, message: "User no longer exists" });
    }

    // 🔹 Attach everything to req.user
    req.user = {
      userId: user._id,
      role: user.role,
      name: user.name,
      email: user.email,
    };

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;