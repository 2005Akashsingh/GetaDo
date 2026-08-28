const Doctor = require("../models/Doctor");
const User = require("../models/User");
const { isWithinBookingWindow } = require("../utils/dateWindow");

const DATE_FORMAT = /^\d{4}-\d{2}-\d{2}$/;

exports.createDoctorProfile = async (req, res) => {
  try {
    const userId = req.user.userId; 
    const { specialization, experience, fees, availableSlots } = req.body;

    if (!specialization || !experience || !fees) {
      return res.status(400).json({
        success: false,
        message: "Missing professional details",
      });
    }
    const existingDoctor = await Doctor.findOne({ userId });
    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: "Doctor profile already exists",
      });
    }

    const doctor = await Doctor.create({
      userId,
      specialization,
      experience,
      fees,
      availableSlots: availableSlots || [],
    });

    res.status(201).json({
      success: true,
      message: "Doctor profile Created",
      doctor,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate("userId", "name email");

    res.json({
      success: true,
      doctors,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate(
      "userId",
      "name email"
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.json({ success: true, doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateAvailability = async (req, res) => {
  try {
    const { availableSlots } = req.body;

    if (!Array.isArray(availableSlots)) {
      return res.status(400).json({
        success: false,
        message: "availableSlots must be an array of { date, slots }",
      });
    }

    for (const entry of availableSlots) {
      if (!entry.date || !DATE_FORMAT.test(entry.date)) {
        return res.status(400).json({
          success: false,
          message: `Invalid date "${entry.date}" - expected YYYY-MM-DD`,
        });
      }
      if (!isWithinBookingWindow(entry.date)) {
        return res.status(400).json({
          success: false,
          message: `${entry.date} is outside the 7-day availability window`,
        });
      }
    }

    const doctor = await Doctor.findOne({ userId: req.user.userId });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found",
      });
    }

    doctor.availableSlots = availableSlots;
    await doctor.save();

    res.json({
      success: true,
      message: "Availability updated",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
