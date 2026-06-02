const express = require("express");
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

    res.json({
  message: "Resume parsed successfully",
  data: parsedData,
});
  } catch (error) {
    res.status(500).json({
      message: "Resume parsing failed",
      error: error.message,
    });
  }
});

module.exports = router;