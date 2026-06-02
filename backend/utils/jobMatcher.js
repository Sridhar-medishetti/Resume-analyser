const matchResumeWithJD = (resumeSkills, jdText) => {
  const jdLower = jdText.toLowerCase();

  const matchedSkills = resumeSkills.filter((skill) =>
    jdLower.includes(skill.toLowerCase())
  );

  const missingSkills = resumeSkills.filter(
    (skill) => !jdLower.includes(skill.toLowerCase())
  );

  const matchPercentage =
    resumeSkills.length > 0
      ? Math.round(
          (matchedSkills.length / resumeSkills.length) * 100
        )
      : 0;

  return {
    matchedSkills,
    missingSkills,
    matchPercentage,
  };
};

module.exports = matchResumeWithJD;