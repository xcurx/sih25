"""
Recommendation Engine API Server

A FastAPI-based recommendation engine for internship/job opportunities.
"""

import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from api.routes import router
from core.engine import get_engine

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for startup and shutdown events.
    """
    # Startup
    logger.info("Starting recommendation engine...")
    engine = get_engine()
    
    # Load the ML model
    model_loaded = engine.load_model()
    if model_loaded:
        logger.info("Recommendation engine started successfully")
    else:
        logger.error("Failed to load recommendation model")
    
    yield
    
    # Shutdown
    logger.info("Shutting down recommendation engine...")


# Create FastAPI app
app = FastAPI(
    title="Internship Recommendation Engine",
    description="""
    A hybrid recommendation engine for internship and job opportunities.
    
    ## Features
    - **Semantic Matching**: Uses sentence transformers for text similarity
    - **Skill-based Matching**: Matches user skills with job requirements
    - **Department Eligibility**: Filters jobs based on eligible departments
    - **Batch Filtering**: Considers batch year for internship vs full-time matching
    
    ## Usage
    1. Add jobs using POST /api/jobs
    2. Get recommendations using POST /api/recommendations
    """,
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS for Next.js frontend
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router, prefix="/api")


@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "name": "Internship Recommendation Engine",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/api/health"
    }


if __name__ == "__main__":
    import uvicorn
    
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=True
    )
