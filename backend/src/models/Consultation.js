const mongoose = require("mongoose");

const consultationSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "ongoing", "ended"],
      default: "scheduled",
    },
    startedAt: {
      type: Date,
    },
    endedAt: {
      type: Date,
    },
    transcript: [
      {
        speaker: { type: String, enum: ["doctor", "patient"] },
        text: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    aiNotes: {
      summary: { type: String },
      keySymptoms: [{ type: String }],
      doctorInstructions: [{ type: String }],
      followUps: [{ type: String }],
    },
    rawAiResponse: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Consultation", consultationSchema);
