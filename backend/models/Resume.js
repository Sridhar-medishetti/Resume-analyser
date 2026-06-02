const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    skills: [String],
    rawText: String,
    fileName: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resume", resumeSchema);