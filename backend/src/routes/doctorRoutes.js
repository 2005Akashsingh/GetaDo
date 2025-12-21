const express = require("express");
const router = express.Router();
const { createDoctorProfile, getAllDoctors, getDoctorById, updateAvailability } = require("../controllers/doctorController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware"); // Add this

router.post("/create", authMiddleware, roleMiddleware("doctor"), createDoctorProfile);

router.get("/", getAllDoctors);

router.get("/:id", getDoctorById);

router.put("/availability", authMiddleware, roleMiddleware("doctor"), updateAvailability);

module.exports = router;