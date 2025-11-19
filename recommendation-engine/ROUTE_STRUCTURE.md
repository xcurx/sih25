# Route Structure

The API routes are organized in a modular structure under the `app/routes/` directory.

## Directory Structure

```
app/
├── main.py                      # Main FastAPI app, includes all routers
├── routes/
│   ├── __init__.py             # Exports all routers
│   ├── jobs.py                 # Job management endpoints
│   ├── recommendations.py      # Recommendation endpoint
│   ├── resume.py               # Resume parsing endpoint
│   └── health.py               # Health check endpoint
├── models.py                   # Pydantic models
├── embeddings.py               # Text embedding functions
├── vector_db.py                # FAISS vector store
├── parse.py                    # Resume parsing utilities
└── scoring.py                  # Scoring algorithms
```

## Route Modules

### 1. `jobs.py`
**Prefix:** `/jobs`  
**Tag:** `jobs`

Endpoints:
- `POST /jobs/add` - Add a single job
- `POST /jobs/add_bulk` - Add multiple jobs
- `GET /jobs/stats` - Get database statistics

### 2. `recommendations.py`
**Prefix:** `/recommend`  
**Tag:** `recommendations`

Endpoints:
- `POST /recommend/` - Get job recommendations for a student

### 3. `resume.py`
**Prefix:** `/resume`  
**Tag:** `resume`

Endpoints:
- `POST /resume/upload` - Upload and parse a resume file

### 4. `health.py`
**No prefix**  
**Tag:** `health`

Endpoints:
- `GET /health` - Health check

## Complete Endpoint List

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/jobs/add` | Add single job |
| POST | `/jobs/add_bulk` | Add multiple jobs |
| GET | `/jobs/stats` | Get database stats |
| POST | `/recommend/` | Get recommendations |
| POST | `/resume/upload` | Parse resume file |
| GET | `/health` | Health check |

## Benefits of This Structure

1. **Modularity** - Each route file handles a specific domain
2. **Maintainability** - Easy to locate and update specific functionality
3. **Scalability** - Simple to add new route modules
4. **Clear Organization** - Related endpoints grouped together
5. **Better Documentation** - Auto-generated docs organized by tags

## Accessing the Store

All route modules access the global `store` variable from `main.py` using a helper function:

```python
def get_store():
    """Helper function to get the store from main app"""
    from app.main import store
    return store
```

This pattern keeps the store centralized while allowing routes to access it when needed.
