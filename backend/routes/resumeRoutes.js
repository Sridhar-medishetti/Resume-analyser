const express = require("express");
const Resume = require("../models/Resume");
const multer = require("multer");
const parseResume = require("../utils/parser");
const matchResumeWithJD = require("../utils/jobMatcher");
const generateSuggestions = require("../utils/resumeSuggestions");

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
    const parsedData = await parseResume(req.file.path, req.file.mimetype);

    const savedResume = await Resume.create({
      ...parsedData,
      fileName: req.file.filename,
    });

    const suggestions = generateSuggestions(savedResume);

    res.json({
      message: "Resume parsed and saved successfully",
      data: savedResume,
      suggestions,
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

router.post("/match/:id", async (req, res) => {
  try {
    const { jobDescription } = req.body;

    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    const result = matchResumeWithJD(resume.skills, jobDescription);

    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: "Matching failed",
      error: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Resume.findByIdAndDelete(req.params.id);

    res.json({
      message: "Resume deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Delete failed",
      error: error.message,
    });
  }
});

module.exports = router;