const fs = require("fs");
const pdfParse = require("pdf-parse/lib/pdf-parse.js");
const mammoth = require("mammoth");

const parseResume = async (filePath, mimetype) => {
  let text = "";

  if (mimetype === "application/pdf") {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    text = data.text;
  } else if (
    mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({ path: filePath });
    text = result.value;
  } else {
    throw new Error("Unsupported file type");
  }

  return text;
};

module.exports = parseResume;