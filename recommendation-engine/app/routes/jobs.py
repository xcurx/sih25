from fastapi import APIRouter, HTTPException
import numpy as np
from app.models import JobPosting, BulkJobRequest
from app.embeddings import embed_text

router = APIRouter(prefix="/jobs", tags=["jobs"])

def get_store():
    """Helper function to get the store from main app"""
    from app.main import store
    return store

@router.post("/add")
async def add_job(job: JobPosting):
    store = get_store()
    
    # Check if store is initialized
    if store is None:
        raise HTTPException(status_code=500, detail="Vector store not initialized")
    
    # Only add active jobs
    if job.status.lower() != "active":
        return {"status": "skipped", "id": job.id, "reason": "Job is not active"}
    
    # Check for duplicate job IDs
    existing_ids = [meta.get("id") for meta in store.metadatas]
    if job.id in existing_ids:
        return {"status": "skipped", "id": job.id, "reason": "Job already exists"}
    
    try:
        # Create rich text for embedding from all relevant fields
        text_parts = [
            job.title,
            job.description,
            job.type,
            job.location,
            " ".join(job.requirements),
            " ".join(job.skillsRequired),
            " ".join(job.eligibleDepartments)
        ]
        if job.additionalInfo:
            text_parts.append(job.additionalInfo)
        
        text = ". ".join(text_parts)
        vec = embed_text(text)
        
        # Store metadata for scoring and filtering
        metadata = {
            "id": job.id,
            "title": job.title,
            "status": job.status,
            "type": job.type,
            "location": job.location,
            "skillsRequired": job.skillsRequired,
            "eligibleDepartments": job.eligibleDepartments,
            "requirements": job.requirements
        }
        store.add(vec, [metadata])
        store.save()
        return {"status": "added", "id": job.id}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add job: {str(e)}")

@router.post("/add_bulk")
async def add_jobs(request: BulkJobRequest):
    store = get_store()
    
    # Check if store is initialized
    if store is None:
        raise HTTPException(status_code=500, detail="Vector store not initialized")
    
    jobs = request.jobs
    
    if not jobs:
        return {"status": "error", "message": "No jobs provided"}
    
    # Get existing job IDs
    existing_ids = set(meta.get("id") for meta in store.metadatas)
    
    results = {
        "added": [],
        "skipped": [],
        "failed": []
    }
    
    vectors_to_add = []
    metadata_to_add = []
    
    for job in jobs:
        try:
            # Skip non-active jobs
            if job.status.lower() != "active":
                results["skipped"].append({
                    "id": job.id,
                    "reason": "Job is not active"
                })
                continue
            
            # Skip duplicates
            if job.id in existing_ids:
                results["skipped"].append({
                    "id": job.id,
                    "reason": "Job already exists"
                })
                continue
            
            # Create rich text for embedding from all relevant fields
            text_parts = [
                job.title,
                job.description,
                job.type,
                job.location,
                " ".join(job.requirements),
                " ".join(job.skillsRequired),
                " ".join(job.eligibleDepartments)
            ]
            if job.additionalInfo:
                text_parts.append(job.additionalInfo)
            
            text = ". ".join(text_parts)
            vec = embed_text(text)
            
            # Store metadata for scoring and filtering
            metadata = {
                "id": job.id,
                "title": job.title,
                "status": job.status,
                "type": job.type,
                "location": job.location,
                "skillsRequired": job.skillsRequired,
                "eligibleDepartments": job.eligibleDepartments,
                "requirements": job.requirements
            }
            
            vectors_to_add.append(vec)
            metadata_to_add.append(metadata)
            existing_ids.add(job.id)  # Add to set to prevent duplicates within the batch
            results["added"].append(job.id)
            
        except Exception as e:
            results["failed"].append({
                "id": job.id,
                "reason": str(e)
            })
    
    # Batch add all vectors at once
    if vectors_to_add:
        try:
            vectors_array = np.vstack(vectors_to_add)
            store.add(vectors_array, metadata_to_add)
            store.save()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to save jobs: {str(e)}")
    
    return {
        "status": "completed",
        "total": len(jobs),
        "added_count": len(results["added"]),
        "skipped_count": len(results["skipped"]),
        "failed_count": len(results["failed"]),
        "results": results
    }

@router.get("/stats")
def get_stats():
    """Get statistics about the job database"""
    store = get_store()
    
    if store is None:
        return {"status": "error", "message": "Vector store not initialized"}
    
    total_jobs = len(store.metadatas)
    active_jobs = sum(1 for meta in store.metadatas if meta.get("status", "").lower() == "active")
    
    job_types = {}
    for meta in store.metadatas:
        job_type = meta.get("type", "unknown")
        job_types[job_type] = job_types.get(job_type, 0) + 1
    
    return {
        "status": "ok",
        "total_jobs": total_jobs,
        "active_jobs": active_jobs,
        "job_types": job_types
    }
