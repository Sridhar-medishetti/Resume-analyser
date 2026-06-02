import { useState, useEffect } from "react";
import API from "./api";
import "./App.css";
import jsPDF from "jspdf";

function App() {
  const [file, setFile] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [matchResult, setMatchResult] = useState(null);
  const [allResumes, setAllResumes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const fetchResumes = async () => {
    try {
      const res = await API.get("/api/resumes");
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
      if (!file) return alert("Please select a resume");

      const formData = new FormData();
      formData.append("resume", file);

      const res = await API.post("/api/resumes/upload", formData);

      setResumeData(res.data.data);
      setSuggestions(res.data.suggestions || []);
      setMatchResult(null);
      fetchResumes();
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    }
  };

  const handleMatch = async () => {
    try {
      if (!resumeData?._id) return alert("Upload resume first");

      const res = await API.post(`/api/resumes/match/${resumeData._id}`, {
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
      await API.delete(`/api/resumes/${id}`);
      fetchResumes();
    } catch (error) {
      console.log(error);
    }
  };

  const totalSkills = resumeData?.skills?.length || 0;
  const latestScore = resumeData?.score || 0;
  const totalResumes = allResumes.length;
  const filteredResumes = allResumes.filter((resume) => {
  const search = searchTerm.toLowerCase();

  return (
    resume.name?.toLowerCase().includes(search) ||
    resume.email?.toLowerCase().includes(search) ||
    resume.skills?.some((skill) =>
      skill.toLowerCase().includes(search)
    )
  );
});

const downloadReport = () => {
  if (!resumeData) {
    alert("Upload resume first");
    return;
  }

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("AI Resume Analysis Report", 20, 20);

  doc.setFontSize(12);
  doc.text(`Name: ${resumeData.name || "N/A"}`, 20, 35);
  doc.text(`Email: ${resumeData.email || "N/A"}`, 20, 45);
  doc.text(`Phone: ${resumeData.phone || "N/A"}`, 20, 55);
  doc.text(`Resume Score: ${resumeData.score || 0}`, 20, 65);

  doc.text("Skills:", 20, 80);
  doc.text(resumeData.skills?.join(", ") || "N/A", 20, 90, {
    maxWidth: 170,
  });

  let y = 110;

  if (matchResult) {
    doc.text(`Match Percentage: ${matchResult.matchPercentage}%`, 20, y);
    y += 10;

    doc.text(`Verdict: ${matchResult.verdict || "N/A"}`, 20, y);
    y += 15;

    doc.text("Matched Skills:", 20, y);
    y += 10;
    doc.text(matchResult.matchedSkills?.join(", ") || "None", 20, y, {
      maxWidth: 170,
    });
    y += 20;

    doc.text("Missing Skills:", 20, y);
    y += 10;
    doc.text(matchResult.missingSkills?.join(", ") || "None", 20, y, {
      maxWidth: 170,
    });
    y += 20;

    doc.text("Recommendations:", 20, y);
    y += 10;

    matchResult.recommendations?.forEach((item) => {
      doc.text(`- ${item}`, 20, y, { maxWidth: 170 });
      y += 10;
    });
  }

  doc.save(`${resumeData.name || "resume"}-analysis-report.pdf`);
};

  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>Resume AI</h2>
        <p>Parser & Job Matcher</p>

        <nav>
  <a href="#dashboard">Dashboard</a>
  <a href="#upload">Upload Resume</a>
  <a href="#job-match">Job Match</a>
  <a href="#resumes">Parsed Resumes</a>
</nav>
      </aside>

      <main className="main">
        <div className="hero">
          <div>
            <h1>AI Resume Parser</h1>
            <p>Upload resumes, extract candidate details, and match them with job descriptions.</p>
          </div>
        </div>

        <div className="stats" id="dashboard">
          <div className="stat-card">
            <span>Total Resumes</span>
            <h2>{totalResumes}</h2>
          </div>

          <div className="stat-card">
            <span>Resume Score</span>
            <h2>{latestScore}</h2>
          </div>

          <div className="stat-card">
            <span>Total Skills</span>
            <h2>{totalSkills}</h2>
          </div>

          <div className="stat-card">
            <span>Match Score</span>
            <h2>{matchResult ? `${matchResult.matchPercentage}%` : "--"}</h2>
          </div>
        </div>

        <section className="card upload-card" id="upload">
          <h2>Upload Resume</h2>

          <div className="upload-row">
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <button onClick={handleUpload}>Upload Resume</button>
          </div>
        </section>

        {resumeData && (
          <section className="grid">
            <div className="card">
              <h2>{resumeData.name}</h2>
              <p><strong>Email:</strong> {resumeData.email}</p>
              <p><strong>Phone:</strong> {resumeData.phone}</p>
              <p className="score">Resume Score: {resumeData.score}</p>
<h3>Resume Suggestions</h3>

<ul>
  {suggestions.map((item, index) => (
    <li key={index}>{item}</li>
  ))}
</ul>
              <h3>Skills</h3>
              <div className="skills">
                {resumeData.skills?.map((skill) => (
                  <span className="skill" key={skill}>{skill}</span>
                ))}
              </div>
            </div>

            <div className="card">
              <h2>Education</h2>
              <ul>
                {resumeData.education?.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>

              <h2>Experience</h2>
              <ul>
                {resumeData.experience?.slice(0, 8).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="card wide" id="job-match">
              <h2>Job Description Match</h2>

              <textarea
                rows="7"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste job description here..."
              />

              <button onClick={handleMatch}>Analyze Match</button>
<button onClick={downloadReport}>
  Download Report
</button>
              {matchResult && (
                <div className="match-box">
                  <h2>Match Percentage: {matchResult.matchPercentage}%</h2>
<p className="score">{matchResult.verdict}</p>
                  <h3 className="green">Matched Skills</h3>
                  <div className="skills">
                    {matchResult.matchedSkills?.map((skill) => (
                      <span className="skill green-chip" key={skill}>{skill}</span>
                    ))}
                  </div>

                  <h3 className="red">Missing Skills</h3>
                  <div className="skills">
                    {matchResult.missingSkills?.map((skill) => (
                      <span className="skill red-chip" key={skill}>{skill}</span>
                    ))}
                  </div>
                  <h3>Recommendations</h3>
<ul>
  {matchResult.recommendations?.map((item, index) => (
    <li key={index}>{item}</li>
  ))}
</ul>
                </div>
              )}
            </div>
          </section>
        )}

        <section className="card" id="resumes">
          <h2>Uploaded Resumes Dashboard</h2>
          <input
  className="search-input"
  type="text"
  placeholder="Search by name, email, or skill..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>

          {filteredResumes.length === 0 ? (
            <p>No resumes uploaded yet.</p>
          ) : (
            <div className="resume-list">
              {filteredResumes.map((resume) => (
                <div className="resume-item" key={resume._id}>
                  <div>
                    <h3>{resume.name}</h3>
                    <p>{resume.email}</p>
                    <p>Score: {resume.score}</p>

                    <div className="skills">
                      {resume.skills?.slice(0, 5).map((skill) => (
                        <span className="skill" key={skill}>{skill}</span>
                      ))}
                    </div>
                  </div>

                  <button className="delete-btn" onClick={() => deleteResume(resume._id)}>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;