const express = require("express");
const router = express.Router();

const { bookAppointment, getMyAppointments, updateAppointmentStatus, deleteAppointment } = require("../controllers/appointmentController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/book", authMiddleware, bookAppointment);

router.get("/my-appointments", authMiddleware, getMyAppointments);

router.put("/:id/status", authMiddleware, updateAppointmentStatus);

router.delete("/:id", authMiddleware, deleteAppointment);

module.exports = router;
