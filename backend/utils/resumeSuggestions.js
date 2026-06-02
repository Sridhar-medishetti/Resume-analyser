const generateSuggestions = (resume) => {
  const suggestions = [];

  if (resume.skills?.length < 5) {
    suggestions.push("Add more technical skills.");
  }

  if (!resume.email) {
    suggestions.push("Add an email address.");
  }

  if (!resume.phone) {
    suggestions.push("Add a phone number.");
  }

  if (!resume.education?.length) {
    suggestions.push("Add education details.");
  }

  if (!resume.experience?.length) {
    suggestions.push("Add experience or projects.");
  }

  if (suggestions.length === 0) {
    suggestions.push("Resume looks strong.");
  }

  return suggestions;
};

module.exports = generateSuggestions;