const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const consultationService = require("../services/consultationService");
const { isWithinJoinWindow } = require("../utils/dateWindow");

const isParticipant = async (appointment, user) => {
  if (user.role === "patient") {
    return appointment.patientId.toString() === user.userId;
  }
  if (user.role === "doctor") {
    const doctorProfile = await Doctor.findOne({ userId: user.userId });
    return !!doctorProfile && appointment.doctorId.toString() === doctorProfile._id.toString();
  }
  return false;
};

module.exports = function registerSignalingHandlers(io, socket) {
  // Room name = appointmentId, so each consultation gets its own isolated signaling channel
  socket.on("join-room", async (appointmentId, callback) => {
    try {
      const appointment = await Appointment.findById(appointmentId);
      if (!appointment) {
        return callback?.({ success: false, message: "Appointment not found" });
      }
      if (appointment.status !== "approved") {
        return callback?.({ success: false, message: "Appointment is not approved yet" });
      }
      if (appointment.paymentStatus !== "paid") {
        return callback?.({ success: false, message: "Appointment payment is not complete" });
      }
      if (!isWithinJoinWindow(appointment.date, appointment.time)) {
        return callback?.({
          success: false,
          message: "You can only join this call during its scheduled time slot",
        });
      }

      const authorized = await isParticipant(appointment, socket.user);
      if (!authorized) {
        return callback?.({ success: false, message: "Not authorized for this consultation" });
      }

      socket.appointmentId = appointmentId;
      await socket.join(appointmentId);
      await consultationService.markOngoing(appointmentId);

      const room = io.sockets.adapter.rooms.get(appointmentId);
      const otherParticipants = room ? room.size - 1 : 0;

      socket.to(appointmentId).emit("peer-joined", {
        role: socket.user.role,
        name: socket.user.name,
      });

      callback?.({ success: true, otherParticipants });
    } catch (error) {
      callback?.({ success: false, message: error.message });
    }
  });

  socket.on("webrtc-offer", ({ appointmentId, offer }) => {
    if (socket.appointmentId !== appointmentId) return;
    socket.to(appointmentId).emit("webrtc-offer", { offer });
  });

  socket.on("webrtc-answer", ({ appointmentId, answer }) => {
    if (socket.appointmentId !== appointmentId) return;
    socket.to(appointmentId).emit("webrtc-answer", { answer });
  });

  socket.on("webrtc-ice-candidate", ({ appointmentId, candidate }) => {
    if (socket.appointmentId !== appointmentId) return;
    socket.to(appointmentId).emit("webrtc-ice-candidate", { candidate });
  });

  socket.on("leave-room", (appointmentId) => {
    if (socket.appointmentId !== appointmentId) return;
    socket.leave(appointmentId);
    socket.to(appointmentId).emit("peer-left", { role: socket.user.role });
    socket.appointmentId = null;
  });

  socket.on("disconnect", () => {
    if (socket.appointmentId) {
      socket.to(socket.appointmentId).emit("peer-left", { role: socket.user.role });
    }
  });
};
