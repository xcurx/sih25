# Recommendation Engine API Guide

## Overview
The recommendation engine now starts with an **empty database** and relies entirely on API endpoints to manage jobs.

## Initialization

Run once to create an empty FAISS index:
```bash
python init_db.py
```

## API Endpoints

### 1. Add Single Job
**POST** `/jobs/add`

Add a single job to the database.

**Request Body:**
```json
{
  "id": "job-001",
  "title": "Software Engineer Intern",
  "description": "Full stack development internship...",
  "type": "internship",
  "location": "Remote",
  "status": "active",
  "salary": "20k/month",
  "requirements": ["Currently enrolled in CS", "Available for 6 months"],
  "eligibleDepartments": ["Computer Science", "IT"],
  "skillsRequired": ["Python", "JavaScript", "React"],
  "additionalInfo": "Work with cutting edge tech"
}
```

**Response:**
```json
{
  "status": "added",
  "id": "job-001"
}
```

---

### 2. Add Multiple Jobs (Batch)
**POST** `/jobs/add_bulk`

Add multiple jobs in one request for better performance.

**Request Body:**
```json
[
  { /* job object 1 */ },
  { /* job object 2 */ },
  { /* job object 3 */ }
]
```

**Response:**
```json
{
  "status": "completed",
  "total": 10,
  "added_count": 8,
  "skipped_count": 1,
  "failed_count": 1,
  "results": {
    "added": ["job-001", "job-002", ...],
    "skipped": [
      { "id": "job-005", "reason": "Job already exists" }
    ],
    "failed": [
      { "id": "job-010", "reason": "Invalid embedding" }
    ]
  }
}
```

---

### 3. Get Recommendations
**POST** `/recommend/`

Get job recommendations based on student profile.

**Request Body:**
```json
{
  "department": "Computer Science",
  "batch": "2027",
  "skills": ["Python", "JavaScript", "React"],
  "resume": "Optional resume text...",
  "k": 10,
  "job_type": "internship"
}
```

**Parameters:**
- `department` (required): Student's department
- `batch` (required): Graduation batch (e.g., "2027")
- `skills` (required): Array of student's skills
- `resume` (optional): Full resume text for additional context
- `k` (optional, default: 10): Number of recommendations
- `job_type` (optional): Filter by "internship" or "full-time"

**Response:**
```json
[
  {
    "job_id": "job-001",
    "composite_score": 0.85,
    "s_vec": 0.80,
    "s_skill": 0.90,
    "highlights": [
      "✓ Skill match: python",
      "✓ Department eligible: Computer Science"
    ],
    "job_type": "internship",
    "location": "Remote"
  }
]
```

**Empty Database:** Returns `[]` if no jobs are in the database.

---

### 4. Get Database Statistics
**GET** `/jobs/stats`

Get information about the current job database.

**Response:**
```json
{
  "status": "ok",
  "total_jobs": 25,
  "active_jobs": 23,
  "job_types": {
    "internship": 18,
    "full-time": 7
  }
}
```

---

### 5. Upload Resume (Parse)
**POST** `/resume/upload`

Parse a resume file to extract text and skills.

**Request:** Multipart form with file upload

**Response:**
```json
{
  "text": "Resume text content...",
  "skills": ["Python", "JavaScript", "React"],
  "resume_score": 0.75
}
```

---

### 6. Health Check
**GET** `/health`

Check if the API is running.

**Response:**
```json
{
  "status": "ok"
}
```

## Workflow

### Initial Setup
1. Run `python init_db.py` to create empty database
2. Start the server: `uvicorn app.main:app --reload --port 8000`
3. Use `/jobs/add_bulk` to bulk load your job postings
4. Check `/jobs/stats` to verify jobs were added

### Regular Usage
1. When new jobs are posted, use `/jobs/add` endpoint
2. Students get recommendations via `/recommend/` endpoint
3. Monitor database with `/jobs/stats` endpoint

## Integration Examples

### Python
```python
import requests

# Add jobs
jobs = [{"id": "job-001", ...}, {"id": "job-002", ...}]
response = requests.post("http://localhost:8000/jobs/add_bulk", json=jobs)
print(f"Added {response.json()['added_count']} jobs")

# Get recommendations
student_data = {
    "department": "Computer Science",
    "batch": "2027",
    "skills": ["Python", "React"]
}
recommendations = requests.post("http://localhost:8000/recommend/", json=student_data)
print(f"Found {len(recommendations.json())} recommendations")
```

### JavaScript/Axios
```javascript
// Add jobs
const jobs = [{id: "job-001", ...}, {id: "job-002", ...}];
const addResponse = await axios.post('http://localhost:8000/jobs/add_bulk', jobs);
console.log(`Added ${addResponse.data.added_count} jobs`);

// Get recommendations
const studentData = {
  department: "Computer Science",
  batch: "2027",
  skills: ["Python", "React"]
};
const recommendations = await axios.post('http://localhost:8000/recommend/', studentData);
console.log(`Found ${recommendations.data.length} recommendations`);
```

## Notes

- Only jobs with `status: "active"` are added to the database
- Duplicate job IDs are automatically skipped
- The `/recommend` endpoint filters jobs by department eligibility
- Use `/add_jobs` for bulk operations (much faster than multiple `/add_job` calls)
- The database persists to disk automatically after each add operation
