const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const Consultation = require("../models/Consultation");

exports.getConsultation = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    if (
      req.user.role === "patient" &&
      appointment.patientId.toString() !== req.user.userId.toString()
    ) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    if (req.user.role === "doctor") {
      const doctorProfile = await Doctor.findOne({ userId: req.user.userId });
      if (!doctorProfile || appointment.doctorId.toString() !== doctorProfile._id.toString()) {
        return res.status(403).json({ success: false, message: "Not authorized" });
      }
    }

    const consultation = await Consultation.findOne({ appointmentId });

    res.json({ success: true, consultation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
