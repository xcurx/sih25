from fastapi import FastAPI
from app.vector_db import FaissStore
from app.routes import jobs_router, recommendations_router, resume_router, health_router

DIM = 384
app = FastAPI(title="Internship Recommender")

# Global store variable accessed by routes
store = None

@app.on_event("startup")
def load_store():
    """Initialize the vector store on application startup"""
    global store
    s = FaissStore.load()
    store = s if s else FaissStore(DIM)

# Include all routers
app.include_router(jobs_router)
app.include_router(recommendations_router)
app.include_router(resume_router)
app.include_router(health_router)
