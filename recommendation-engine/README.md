# Internship Recommender — Minimal, understandable, full-stack prototype


## Overview
A simple, self-contained prototype to: parse student resumes (PDF/DOCX), extract skills, embed resumes and job postings using sentence-transformers, store job vectors in FAISS, and return ranked internship recommendations with subscores and a resume strength score.


## Tech stack
- Python 3.10+
- FastAPI (HTTP API)
- sentence-transformers (embeddings)
- faiss-cpu (vector store)
- pdfplumber + python-docx (resume text extraction)
- rapidfuzz (skill fuzzy matching)


## Run (local)
1. Create and activate a venv:


```bash
python -m venv .venv
source .venv/bin/activate # Linux/Mac
.venv\\Scripts\\activate # Windows
```
2. Install requirements:


```bash
pip install -r requirements.txt
```


3. Initialize empty database (creates FAISS index):


```bash
python init_db.py
```


4. Run API server:


```bash
uvicorn app.main:app --reload --port 8000
```


5. Open http://127.0.0.1:8000/docs to try the endpoints.


## Adding Jobs

The engine starts with an **empty database**. Add jobs using the API:

```bash
# Add a single job
curl -X POST "http://127.0.0.1:8000/add_job" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "job-001",
    "title": "Software Engineer Intern",
    "description": "Full stack development...",
    "type": "internship",
    "location": "Remote",
    "status": "active",
    "requirements": ["Currently enrolled"],
    "eligibleDepartments": ["Computer Science"],
    "skillsRequired": ["Python", "JavaScript"]
  }'

# Add multiple jobs (faster)
curl -X POST "http://127.0.0.1:8000/add_jobs" \
  -H "Content-Type: application/json" \
  -d @jobs.json
```

See [API_GUIDE.md](./API_GUIDE.md) for complete documentation.


## What to extend
- Improve skill ontology (load from campus master list)
- Replace FAISS with Milvus/Pinecone for production
- Add authentication & RBAC
- Add eligibility classifier (XGBoost) and training pipeline


"""