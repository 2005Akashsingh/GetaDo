const consultationService = require("../services/consultationService");

module.exports = function registerTranscriptHandlers(io, socket) {
  socket.on("transcript-chunk", async ({ appointmentId, text }) => {
    if (!text || socket.appointmentId !== appointmentId) return;

    try {
      await consultationService.appendTranscriptChunk(appointmentId, {
        speaker: socket.user.role,
        text,
      });

      // Broadcast to the other participant so both sides can show a live transcript
      socket.to(appointmentId).emit("transcript-chunk", {
        speaker: socket.user.role,
        text,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("[transcript] failed to persist chunk:", error.message);
    }
  });

  socket.on("end-call", async ({ appointmentId }) => {
    if (socket.appointmentId !== appointmentId) return;

    try {
      await consultationService.endCall(appointmentId);
      io.to(appointmentId).emit("call-ended", { by: socket.user.role });
    } catch (error) {
      console.error("[consultation] failed to end call:", error.message);
    }
  });
};
