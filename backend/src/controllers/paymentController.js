const Appointment = require("../models/Appointment");
const paymentService = require("../services/paymentService");
const env = require("../config/env");

exports.createOrder = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    if (!appointmentId) {
      return res.status(400).json({
        success: false,
        message: "appointmentId is required",
      });
    }

    const appointment = await Appointment.findById(appointmentId).populate("doctorId");
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    if (appointment.patientId.toString() !== req.user.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized for this appointment",
      });
    }

    if (appointment.paymentStatus === "paid") {
      return res.status(400).json({ success: false, message: "Appointment already paid" });
    }

    const order = await paymentService.createOrderForAppointment(appointment);

    res.json({
      success: true,
      data: order,
      key: env.razorpay.keyId,
    });
  } catch (error) {
    console.error("Razorpay order error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const payment = await paymentService.verifyAndRecordPayment(req.body);

    res.json({
      success: true,
      message: "Payment successfully verified",
      paymentId: payment.razorpayPaymentId,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};
