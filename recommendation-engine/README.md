# Internship Recommendation Engine

A hybrid recommendation engine for internship and job opportunities built with FastAPI and Sentence Transformers. Designed to integrate with Next.js applications.

## Features

- **Semantic Matching**: Uses sentence transformers (`all-MiniLM-L6-v2`) for text similarity
- **Skill-based Matching**: Calculates skill overlap between user and job requirements
- **Department Eligibility**: Filters jobs based on eligible departments
- **Batch Filtering**: Considers graduation year for internship vs full-time matching
- **Real-time Updates**: Add, update, or remove jobs dynamically
- **REST API**: Easy integration with any frontend framework

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Frontend                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  RecommendationsPage  │  Job Management  │  Profile  │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP/REST
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                 Recommendation Engine API                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ FastAPI     │  │ Routes      │  │ Pydantic Schemas    │  │
│  │ Server      │──│ /api/*      │──│ Validation          │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│                           │                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Core Recommendation Engine              │   │
│  │  ┌───────────────┐  ┌───────────────────────────┐   │   │
│  │  │ Sentence      │  │ Scoring Components        │   │   │
│  │  │ Transformers  │  │ - Vector Similarity       │   │   │
│  │  │ (Embeddings)  │  │ - Skill Match             │   │   │
│  │  └───────────────┘  │ - Department Eligibility  │   │   │
│  │                     │ - Batch Filtering         │   │   │
│  │                     └───────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Installation

### Prerequisites

- Python 3.9+
- pip

### Setup

1. **Create a virtual environment:**

```bash
cd engine
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Install dependencies:**

```bash
pip install -r requirements.txt
```

3. **Set up environment variables (optional):**

```bash
cp .env.example .env
# Edit .env as needed
```

4. **Start the server:**

```bash
python main.py
# Or with uvicorn directly:
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The first startup will download the sentence transformer model (~90MB).

5. **Seed sample data (optional):**

```bash
python seed_data.py
```

6. **Test the engine:**

```bash
python test_engine.py
```

## API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check and stats |
| POST | `/api/recommendations` | Get personalized recommendations |
| POST | `/api/jobs` | Add a new job |
| POST | `/api/jobs/bulk` | Add multiple jobs |
| PUT | `/api/jobs/{job_id}` | Update a job |
| DELETE | `/api/jobs/{job_id}` | Remove a job |
| GET | `/api/jobs/{job_id}` | Get a specific job |
| GET | `/api/jobs` | List all jobs |

### Get Recommendations

```bash
curl -X POST http://localhost:8000/api/recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "department": "Computer Science",
    "batch": "2027",
    "skills": ["Python", "JavaScript", "React", "Machine Learning"],
    "k": 5,
    "job_type": "internship"
  }'
```

**Response:**

```json
{
  "recommendations": [
    {
      "job_id": "job_001",
      "composite_score": 0.8542,
      "s_vec": 0.7823,
      "s_skill": 0.8000,
      "highlights": {
        "skills": ["Python", "JavaScript", "React"],
        "department": "Computer Science",
        "batch": "Batch 2027 eligible for internship",
        "requirements": []
      },
      "job_type": "internship",
      "location": "Bangalore"
    }
  ],
  "total_active_jobs": 11,
  "query_department": "Computer Science",
  "query_batch": "2027"
}
```

### Add a Job

```bash
curl -X POST http://localhost:8000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "id": "job_new",
    "title": "Frontend Developer Intern",
    "description": "Build user interfaces with React and TypeScript",
    "type": "internship",
    "location": "Remote",
    "status": "active",
    "requirements": ["Knowledge of React", "Good communication"],
    "eligibleDepartments": ["Computer Science", "IT"],
    "skillsRequired": ["React", "TypeScript", "CSS"]
  }'
```

## Integration with Next.js

### 1. Copy the TypeScript client

Copy `client/recommendation-client.ts` to your Next.js project (e.g., `lib/recommendation-client.ts`).

### 2. Set environment variable

Add to your `.env.local`:

```
RECOMMENDATION_ENGINE_URL=http://localhost:8000
```

### 3. Use in your components

```typescript
// app/api/recommendations/route.ts
import { RecommendationClient } from '@/lib/recommendation-client';

export async function POST(request: Request) {
  const body = await request.json();
  const client = new RecommendationClient(process.env.RECOMMENDATION_ENGINE_URL);
  
  const recommendations = await client.getRecommendations({
    department: body.department,
    batch: body.batch,
    skills: body.skills,
    k: body.k || 10,
    job_type: body.job_type,
  });
  
  return Response.json(recommendations);
}
```

### 4. Sync jobs when created

```typescript
// When creating a new opportunity in your app
import { syncJobToRecommendationEngine } from '@/lib/recommendation-client';

async function createOpportunity(data: OpportunityData) {
  // Save to your database
  const job = await db.opportunities.create({ data });
  
  // Sync to recommendation engine
  await syncJobToRecommendationEngine(job);
  
  return job;
}
```

## Scoring Algorithm

The recommendation engine uses a composite scoring approach:

```
composite_score = batch_multiplier × (
    0.40 × vector_similarity +
    0.35 × skill_match +
    0.15 × department_match +
    0.10 × requirement_match
)
```

### Components:

1. **Vector Similarity (40%)**: Semantic similarity using sentence embeddings
2. **Skill Match (35%)**: Jaccard-like similarity between user skills and job requirements
3. **Department Match (15%)**: Binary/partial match for department eligibility
4. **Requirement Match (10%)**: How well user skills align with job requirements
5. **Batch Multiplier**: Adjusts score based on graduation timeline vs job type

## Project Structure

```
engine/
├── main.py                 # FastAPI application entry point
├── requirements.txt        # Python dependencies
├── .env.example           # Environment variables template
├── seed_data.py           # Script to seed sample data
├── test_engine.py         # Integration tests
├── api/
│   ├── __init__.py
│   └── routes.py          # API route handlers
├── core/
│   ├── __init__.py
│   └── engine.py          # Core recommendation logic
├── models/
│   ├── __init__.py
│   └── schemas.py         # Pydantic models
├── utils/
│   ├── __init__.py
│   └── sample_data.py     # Sample job data
└── client/
    ├── recommendation-client.ts  # TypeScript client for Next.js
    └── example-usage.ts          # Usage examples
```

## Configuration

### Scoring Weights

Modify weights in `core/engine.py`:

```python
self.weights = {
    "vector_similarity": 0.4,
    "skill_match": 0.35,
    "department_match": 0.15,
    "requirement_match": 0.10
}
```

### Model Selection

Change the sentence transformer model in `core/engine.py`:

```python
def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
```

Available models:
- `all-MiniLM-L6-v2` (default, fast, good quality)
- `all-mpnet-base-v2` (slower, better quality)
- `paraphrase-multilingual-MiniLM-L12-v2` (multilingual support)

## Development

### Running in Development

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Running Tests

```bash
# Start the server first, then:
python test_engine.py
```

## Production Deployment

### Docker

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Download model during build
RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 8000 |
| `HOST` | Server host | 0.0.0.0 |
| `CORS_ORIGINS` | Allowed CORS origins (comma-separated) | http://localhost:3000 |

## License

MIT
