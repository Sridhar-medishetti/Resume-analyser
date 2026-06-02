const fs = require("fs");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

const skillsList = [
  "HTML",
  "CSS",
  "JavaScript",
  "React",
  "Node.js",
  "Express.js",
  "MongoDB",
  "SQL",
  "MySQL",
  "Python",
  "Java",
  "Git",
  "GitHub",
  "REST API",
  "JWT",
  "Bootstrap",
  "Tailwind",
  "Machine Learning",
  "NLP"
];

const extractEmail = (text) => {
  const emailRegex =
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/;

  const match = text.match(emailRegex);

  return match ? match[0] : "";
};

const extractPhone = (text) => {
  const phoneRegex =
    /(\+91[\s-]?)?[6-9]\d{9}/;

  const match = text.match(phoneRegex);

  return match ? match[0] : "";
};

const extractName = (text) => {
  const lines = text
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean);

  for (const line of lines) {
    if (
      line.length > 3 &&
      !line.toLowerCase().includes("page") &&
      !line.includes("@") &&
      /^[A-Z\s]+$/.test(line)
    ) {
      return line;
    }
  }

  return "";
};

const extractSkills = (text) => {
  const lowerText = text.toLowerCase();

  return skillsList.filter((skill) =>
    lowerText.includes(skill.toLowerCase())
  );
};

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

  return {
  name: extractName(text),
  email: extractEmail(text),
  phone: extractPhone(text),
  skills: extractSkills(text),
  rawText: text,
};

};

module.exports = parseResume;