const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  getAllUsers,
  getAllAppointments,
} = require("../controllers/adminController");

// 🔒 Admin only
router.get(
  "/users",
  authMiddleware,
  roleMiddleware("admin"),
  getAllUsers
);

router.get(
  "/appointments",
  authMiddleware,
  roleMiddleware("admin"),
  getAllAppointments
);

module.exports = router;
