const Razorpay = require("razorpay");
const crypto = require("crypto");
const env = require("../config/env");
const Payment = require("../models/Payment");
const Appointment = require("../models/Appointment");

const razorpay = new Razorpay({
  key_id: env.razorpay.keyId,
  key_secret: env.razorpay.keySecret,
});

// appointment must be populated with doctorId (for fees)
exports.createOrderForAppointment = async (appointment) => {
  const amount = appointment.doctorId.fees * 100; // paise

  const order = await razorpay.orders.create({
    amount,
    currency: "INR",
    receipt: `receipt_${appointment._id}_${Date.now()}`,
  });

  await Payment.create({
    appointmentId: appointment._id,
    patientId: appointment.patientId,
    doctorId: appointment.doctorId._id,
    razorpayOrderId: order.id,
    amount: appointment.doctorId.fees,
    status: "created",
  });

  return order;
};

exports.verifyAndRecordPayment = async ({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}) => {
  const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
  if (!payment) {
    const err = new Error("Payment record not found");
    err.statusCode = 404;
    throw err;
  }

  const sha = crypto.createHmac("sha256", env.razorpay.keySecret);
  sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = sha.digest("hex");

  if (digest !== razorpay_signature) {
    payment.status = "failed";
    await payment.save();
    const err = new Error("Invalid Transaction / Signature Mismatch");
    err.statusCode = 400;
    throw err;
  }

  payment.razorpayPaymentId = razorpay_payment_id;
  payment.razorpaySignature = razorpay_signature;
  payment.status = "paid";
  await payment.save();

  await Appointment.findByIdAndUpdate(payment.appointmentId, {
    paymentStatus: "paid",
  });

  return payment;
};
