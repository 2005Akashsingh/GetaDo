const Consultation = require("../models/Consultation");

exports.getOrCreateConsultation = async (appointmentId) => {
  let consultation = await Consultation.findOne({ appointmentId });
  if (!consultation) {
    consultation = await Consultation.create({ appointmentId });
  }
  return consultation;
};

exports.markOngoing = async (appointmentId) => {
  const consultation = await exports.getOrCreateConsultation(appointmentId);
  if (consultation.status === "scheduled") {
    consultation.status = "ongoing";
    consultation.startedAt = new Date();
    await consultation.save();
  }
  return consultation;
};

exports.appendTranscriptChunk = async (appointmentId, { speaker, text }) => {
  const consultation = await exports.getOrCreateConsultation(appointmentId);
  consultation.transcript.push({ speaker, text, timestamp: new Date() });
  await consultation.save();
  return consultation;
};

exports.endCall = async (appointmentId) => {
  const consultation = await exports.getOrCreateConsultation(appointmentId);
  if (consultation.status !== "ended") {
    consultation.status = "ended";
    consultation.endedAt = new Date();
    await consultation.save();
  }
  return consultation;
};
