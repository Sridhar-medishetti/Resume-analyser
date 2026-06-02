const express = require("express");
const Resume = require("../models/Resume");
const multer = require("multer");
const parseResume = require("../utils/parser");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    const parsedData = await parseResume(
  req.file.path,
  req.file.mimetype
);

    const savedResume = await Resume.create({
  ...parsedData,
  fileName: req.file.filename,
});

res.json({
  message: "Resume parsed and saved successfully",
  data: savedResume,
});
  } catch (error) {
    res.status(500).json({
      message: "Resume parsing failed",
      error: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const resumes = await Resume.find().sort({ createdAt: -1 });

    res.json(resumes);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch resumes",
      error: error.message,
    });
  }
});

module.exports = router;