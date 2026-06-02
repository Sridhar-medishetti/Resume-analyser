const matchResumeWithJD = (resumeSkills, jdText) => {
  const allSkills = [
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
    "Docker",
    "AWS",
  ];

  const jdSkills = allSkills.filter((skill) =>
    jdText.toLowerCase().includes(skill.toLowerCase())
  );

  const matchedSkills = jdSkills.filter((skill) =>
    resumeSkills.includes(skill)
  );

  const missingSkills = jdSkills.filter(
    (skill) => !resumeSkills.includes(skill)
  );

  const matchPercentage =
    jdSkills.length > 0
      ? Math.round(
          (matchedSkills.length / jdSkills.length) * 100
        )
      : 0;

  const recommendations = missingSkills.map(
    (skill) => `Learn ${skill} to improve your match score`
  );

  let verdict = "";

if (matchPercentage >= 80) {
  verdict = "Strong match for this job role";
} else if (matchPercentage >= 50) {
  verdict = "Moderate match, improve missing skills";
} else {
  verdict = "Low match, add more required skills";
}

  return {
    matchedSkills,
    missingSkills,
    recommendations,
    matchPercentage,
    verdict,
  };
};

module.exports = matchResumeWithJD;