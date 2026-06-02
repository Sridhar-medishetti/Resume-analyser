# AI Resume Parser & Job Match Analyzer

A full-stack MERN application that parses PDF/DOCX resumes, extracts candidate details, calculates resume score, and matches resumes with job descriptions.

## Features

- Upload PDF/DOCX resumes
- Extract name, email, phone, skills, education, and experience
- Store parsed resume data in MongoDB
- View uploaded resumes in dashboard
- Delete resumes
- Calculate resume score
- Match resume with job description
- Show matched skills, missing skills, recommendations, and match verdict
- Search resumes by name, email, or skill

## Tech Stack

### Frontend
- React
- Axios
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Multer
- pdf-parse
- mammoth

## API Endpoints

### Upload Resume

POST /api/resumes/upload

### Get All Resumes

GET /api/resumes

### Delete Resume

DELETE /api/resumes/:id

### Match Resume with Job Description

POST /api/resumes/match/:id

## Project Highlights

- Built REST APIs for resume upload, parsing, storage, retrieval, deletion, and job matching
- Implemented skill extraction and job description matching algorithm
- Designed a responsive React dashboard with resume analytics
- Used MongoDB Atlas for cloud database storage

## Future Improvements

- JWT authentication
- Deployment on Vercel and Render
- Better NLP-based parsing
- Resume improvement suggestions