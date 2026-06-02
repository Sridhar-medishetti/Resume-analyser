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

const recommendations = missingSkills.map(
  (skill) => `Learn ${skill}`
);


  return {
    matchedSkills,
    missingSkills,
    recommendations,
    matchPercentage,
  };
};

module.exports = matchResumeWithJD;