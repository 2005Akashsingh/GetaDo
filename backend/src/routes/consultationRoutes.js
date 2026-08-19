const express = require("express");
const { getConsultation } = require("../controllers/consultationController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:appointmentId", authMiddleware, getConsultation);

module.exports = router;
