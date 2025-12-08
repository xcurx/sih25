"""
API routes for the recommendation engine
"""

from typing import List
from fastapi import APIRouter, HTTPException, status

from models.schemas import (
    Opportunity,
    RecommendationRequest,
    RecommendationResponse,
    AddJobResponse,
    RemoveJobResponse,
    UpdateJobResponse,
    HealthResponse,
    BulkAddJobsResponse,
    BulkAddResults
)
from models.schemas import Student, StudentRecommendationResponse
from core.engine import get_engine

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint.
    Returns the status of the recommendation engine.
    """
    engine = get_engine()
    return HealthResponse(
        status="healthy" if engine.is_model_loaded else "degraded",
        total_jobs=engine.get_total_jobs(),
        active_jobs=engine.get_active_jobs_count(),
        model_loaded=engine.is_model_loaded
    )


@router.post("/recommendations", response_model=RecommendationResponse)
async def get_recommendations(request: RecommendationRequest):
    """
    Get personalized job recommendations based on user profile.
    
    - **department**: User's department (e.g., "Computer Science")
    - **batch**: User's batch year (e.g., "2027")
    - **skills**: List of user's skills
    - **k**: Number of recommendations to return (default: 10)
    - **job_type**: Filter by job type ("internship" or "full-time"), optional
    """
    engine = get_engine()
    
    if not engine.is_model_loaded:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Recommendation model is not loaded"
        )
    
    recommendations = engine.get_recommendations(request)
    
    return RecommendationResponse(
        recommendations=recommendations,
        total_active_jobs=engine.get_active_jobs_count(),
        query_department=request.department,
        query_batch=request.batch
    )


@router.post("/jobs", response_model=AddJobResponse)
async def add_job(job: Opportunity):
    """
    Add a new job to the recommendation system.
    
    The job will be indexed and available for recommendations immediately.
    """
    engine = get_engine()
    
    if not engine.is_model_loaded:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Recommendation model is not loaded"
        )
    
    # Check if job already exists
    if job.id in engine.jobs:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Job with ID {job.id} already exists. Use PUT to update."
        )
    
    success = engine.add_job(job)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to add job to recommendation system"
        )
    
    return AddJobResponse(
        success=True,
        message=f"Job '{job.title}' added successfully",
        job_id=job.id
    )


@router.post("/jobs/bulk", response_model=BulkAddJobsResponse)
async def bulk_add_jobs(jobs: List[Opportunity]):
    """
    Add multiple jobs to the recommendation system at once.
    
    Useful for initial data loading or batch updates.
    Returns detailed information about added, skipped, and failed jobs.
    """
    engine = get_engine()
    
    if not engine.is_model_loaded:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Recommendation model is not loaded"
        )
    
    results = engine.bulk_add_jobs(jobs)
    
    added_count = len(results["added"])
    skipped_count = len(results["skipped"])
    failed_count = len(results["failed"])
    
    return BulkAddJobsResponse(
        success=True,
        message=f"Processed {len(jobs)} jobs: {added_count} added, {skipped_count} skipped, {failed_count} failed",
        added_count=added_count,
        skipped_count=skipped_count,
        failed_count=failed_count,
        total_submitted=len(jobs),
        results=BulkAddResults(
            added=results["added"],
            skipped=results["skipped"],
            failed=results["failed"]
        )
    )


@router.put("/jobs/{job_id}", response_model=UpdateJobResponse)
async def update_job(job_id: str, job: Opportunity):
    """
    Update an existing job in the recommendation system.
    
    The job embedding will be recalculated.
    """
    engine = get_engine()
    
    if not engine.is_model_loaded:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Recommendation model is not loaded"
        )
    
    if job.id != job_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Job ID in path and body must match"
        )
    
    if job_id not in engine.jobs:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Job with ID {job_id} not found"
        )
    
    # Remove and re-add to update embedding
    engine.remove_job(job_id)
    success = engine.add_job(job)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update job"
        )
    
    return UpdateJobResponse(
        success=True,
        message=f"Job '{job.title}' updated successfully",
        job_id=job.id
    )


@router.delete("/jobs/{job_id}", response_model=RemoveJobResponse)
async def remove_job(job_id: str):
    """
    Remove a job from the recommendation system.
    
    The job will no longer appear in recommendations.
    """
    engine = get_engine()
    
    if job_id not in engine.jobs:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Job with ID {job_id} not found"
        )
    
    success = engine.remove_job(job_id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to remove job"
        )
    
    return RemoveJobResponse(
        success=True,
        message=f"Job {job_id} removed successfully",
        job_id=job_id
    )


@router.get("/jobs/{job_id}", response_model=Opportunity)
async def get_job(job_id: str):
    """
    Get a specific job by ID.
    """
    engine = get_engine()
    
    if job_id not in engine.jobs:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Job with ID {job_id} not found"
        )
    
    return engine.jobs[job_id]


@router.post("/students")
async def add_student(student: Student):
    """Add a new student to the recommendation system."""
    engine = get_engine()

    if not engine.is_model_loaded:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Recommendation model is not loaded"
        )

    if student.id in engine.students:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Student with ID {student.id} already exists."
        )

    success = engine.add_student(student)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to add student to recommendation system"
        )

    return {"success": True, "message": f"Student '{student.name}' added successfully", "student_id": student.id}


@router.post("/students/bulk")
async def bulk_add_students(students: List[Student]):
    """Bulk add students to the system."""
    engine = get_engine()

    if not engine.is_model_loaded:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Recommendation model is not loaded"
        )

    results = engine.bulk_add_students(students)
    return {
        "success": True,
        "message": f"Processed {len(students)} students",
        "added_count": len(results.get('added', [])),
        "skipped_count": len(results.get('skipped', [])),
        "failed_count": len(results.get('failed', [])),
        "results": results
    }


@router.get("/opportunities/{opportunity_id}/students", response_model=StudentRecommendationResponse)
async def get_students_for_opportunity(opportunity_id: str):
    """Get candidate students for a given opportunity ID."""
    engine = get_engine()

    if not engine.is_model_loaded:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,    
            detail="Recommendation model is not loaded"
        )

    candidates = engine.get_students_for_opportunity(opportunity_id)

    return StudentRecommendationResponse(
        success=True,
        message=f"Found {len(candidates)} candidate(s)",
        total_candidates=len(candidates),
        candidates=candidates
    )


@router.get("/jobs", response_model=List[Opportunity])
async def list_jobs(
    status_filter: str = None,
    job_type: str = None,
    limit: int = 100
):
    """
    List all jobs in the recommendation system.
    
    - **status_filter**: Filter by status ("active" or "closed")
    - **job_type**: Filter by type ("internship" or "full-time")
    - **limit**: Maximum number of jobs to return
    """
    engine = get_engine()
    
    jobs = list(engine.jobs.values())
    
    if status_filter:
        jobs = [j for j in jobs if j.status.lower() == status_filter.lower()]
    
    if job_type:
        jobs = [j for j in jobs if j.type.lower() == job_type.lower()]
    
    return jobs[:limit]


@router.delete("/jobs", response_model=dict)
async def clear_all_jobs():
    """
    Clear all jobs from the recommendation system.
    
    WARNING: This will remove all jobs from both memory and database.
    Use with caution!
    """
    engine = get_engine()
    
    job_count = engine.get_total_jobs()
    engine.clear_all_jobs()
    
    return {
        "success": True,
        "message": f"Cleared {job_count} jobs from the system",
        "cleared_count": job_count
    }
