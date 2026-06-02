import { useState } from "react";
import API from "./api";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [resumeData, setResumeData] = useState(null);

  const [jobDescription, setJobDescription] = useState("");
  const [matchResult, setMatchResult] = useState(null);

  const handleUpload = async () => {
    try {
      if (!file) {
        alert("Please select a resume");
        return;
      }

      const formData = new FormData();
      formData.append("resume", file);

      const res = await API.post(
        "/resumes/upload",
        formData
      );

      setResumeData(res.data.data);
      setMatchResult(null);
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    }
  };

  const handleMatch = async () => {
    try {
      if (!resumeData?._id) {
        alert("Upload resume first");
        return;
      }

      const res = await API.post(
        `/resumes/match/${resumeData._id}`,
        {
          jobDescription,
        }
      );

      setMatchResult(res.data);
    } catch (error) {
      console.error(error);
      alert("Matching failed");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>AI Resume Parser & Job Match Analyzer</h1>

      <input
        type="file"
        accept=".pdf,.docx"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={handleUpload}>
        Upload Resume
      </button>

      {resumeData && (
        <div style={{ marginTop: "20px" }}>
          <h2>{resumeData.name}</h2>

          <p>
            <strong>Email:</strong>{" "}
            {resumeData.email}
          </p>

          <p>
            <strong>Phone:</strong>{" "}
            {resumeData.phone}
          </p>

          <p>
            <strong>Resume Score:</strong>{" "}
            {resumeData.score}
          </p>

          <h3>Skills</h3>

          <ul>
            {resumeData.skills?.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>

          <h3>Education</h3>

          <ul>
            {resumeData.education?.map(
              (item, index) => (
                <li key={index}>{item}</li>
              )
            )}
          </ul>

          <h3>Experience</h3>

          <ul>
            {resumeData.experience?.map(
              (item, index) => (
                <li key={index}>{item}</li>
              )
            )}
          </ul>

          <hr />

          <h3>Job Description</h3>

          <textarea
            rows="8"
            cols="70"
            value={jobDescription}
            onChange={(e) =>
              setJobDescription(
                e.target.value
              )
            }
            placeholder="Paste Job Description here..."
          />

          <br />
          <br />

          <button onClick={handleMatch}>
            Match Resume
          </button>

          {matchResult && (
            <div style={{ marginTop: "20px" }}>
              <h2>
                Match Percentage:
                {" "}
                {matchResult.matchPercentage}%
              </h2>

              <h3>Matched Skills</h3>

              <ul>
                {matchResult.matchedSkills?.map(
                  (skill) => (
                    <li key={skill}>{skill}</li>
                  )
                )}
              </ul>

              <h3>Missing Skills</h3>

              <ul>
                {matchResult.missingSkills?.map(
                  (skill) => (
                    <li key={skill}>{skill}</li>
                  )
                )}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;