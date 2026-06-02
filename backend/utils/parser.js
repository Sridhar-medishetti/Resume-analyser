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

const extractEducation = (text) => {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const education = [];
  let isEducationSection = false;

  for (const line of lines) {
    const lowerLine = line.toLowerCase();

    if (lowerLine === "education") {
      isEducationSection = true;
      continue;
    }

    if (
      isEducationSection &&
      (
        lowerLine === "internships" ||
        lowerLine === "technical skills" ||
        lowerLine === "projects" ||
        lowerLine === "professional training and certifications"
      )
    ) {
      break;
    }

    if (isEducationSection) {
      education.push(line);
    }
  }

  return education;
};

const extractExperience = (text) => {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const experience = [];
  let capture = false;

  for (const line of lines) {
    const lowerLine = line.toLowerCase();

    if (
      lowerLine === "internships" ||
      lowerLine === "projects"
    ) {
      capture = true;
      continue;
    }

    if (
      lowerLine === "technical skills" ||
      lowerLine === "professional training and certifications" ||
      lowerLine === "languages" ||
      lowerLine === "extracurricular activities"
    ) {
      capture = false;
    }

    if (
      capture &&
      !line.startsWith("Page") &&
      !line.includes("linkedin.com") &&
      !line.includes("github.com")
    ) {
      experience.push(line);
    }
  }

  return experience;
};

const calculateResumeScore = ({
  name,
  email,
  phone,
  skills,
  education,
  experience,
}) => {
  let score = 0;

  if (name) score += 10;
  if (email) score += 10;
  if (phone) score += 10;

  score += Math.min(skills.length * 3, 30);

  if (education.length > 0) score += 20;

  if (experience.length > 0) score += 20;

  return Math.min(score, 100);
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

const parsedData = {
  name: extractName(text),
  email: extractEmail(text),
  phone: extractPhone(text),
  skills: extractSkills(text),
  education: extractEducation(text),
  experience: extractExperience(text),
  rawText: text,
};

parsedData.score = calculateResumeScore(parsedData);

return parsedData;

};

module.exports = parseResume;