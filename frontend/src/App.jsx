import { useState, useEffect } from "react";
import API from "./api";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [matchResult, setMatchResult] = useState(null);
  const [allResumes, setAllResumes] = useState([]);

  const fetchResumes = async () => {
    try {
      const res = await API.get("/resumes");
      setAllResumes(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleUpload = async () => {
    try {
      if (!file) {
        alert("Please select a resume");
        return;
      }

      const formData = new FormData();
      formData.append("resume", file);

      const res = await API.post("/resumes/upload", formData);

      setResumeData(res.data.data);
      setMatchResult(null);
      fetchResumes();
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

      const res = await API.post(`/resumes/match/${resumeData._id}`, {
        jobDescription,
      });

      setMatchResult(res.data);
    } catch (error) {
      console.error(error);
      alert("Matching failed");
    }
  };

  const deleteResume = async (id) => {
  try {
    await API.delete(`/resumes/${id}`);
    fetchResumes();
  } catch (error) {
    console.log(error);
  }
};

  return (
    <div className="container">
      <h1 className="title">AI Resume Parser & Job Match Analyzer</h1>

      <div className="card">
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button className="upload-btn" onClick={handleUpload}>
          Upload Resume
        </button>
      </div>

      {resumeData && (
        <div className="card">
          <h2>{resumeData.name}</h2>

          <p>
            <strong>Email:</strong> {resumeData.email}
          </p>

          <p>
            <strong>Phone:</strong> {resumeData.phone}
          </p>

          <p className="score">Resume Score: {resumeData.score}</p>

          <h3>Skills</h3>
          <div className="skills">
            {resumeData.skills?.map((skill) => (
              <span className="skill" key={skill}>
                {skill}
              </span>
            ))}
          </div>

          <h3>Education</h3>
          <ul>
            {resumeData.education?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h3>Experience</h3>
          <ul>
            {resumeData.experience?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h3>Job Description</h3>
          <textarea
            rows="8"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste Job Description here..."
          />

          <br />
          <br />

          <button className="upload-btn" onClick={handleMatch}>
            Match Resume
          </button>

          {matchResult && (
            <div className="card">
              <h2>Match Percentage: {matchResult.matchPercentage}%</h2>

              <h3 className="match">Matched Skills</h3>
              <div className="skills">
                {matchResult.matchedSkills?.map((skill) => (
                  <span className="skill" key={skill}>
                    {skill}
                  </span>
                ))}
              </div>

              <h3 className="missing">Missing Skills</h3>
              <ul>
                {matchResult.missingSkills?.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="card">
        <h2>Uploaded Resumes Dashboard</h2>

        {allResumes.length === 0 ? (
          <p>No resumes uploaded yet.</p>
        ) : (
          allResumes.map((resume) => (
            <div key={resume._id}>
              <h3>{resume.name}</h3>
              <p>{resume.email}</p>
              <p>Score: {resume.score}</p>

              <div className="skills">
                {resume.skills?.slice(0, 5).map((skill) => (
                  <span className="skill" key={skill}>
                    {skill}
                  </span>
                ))}
              </div>
<button
      className="upload-btn"
      onClick={() => deleteResume(resume._id)}
    >
      Delete Resume
    </button>
              <hr />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;