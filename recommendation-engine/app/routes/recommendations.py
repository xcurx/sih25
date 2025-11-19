from fastapi import APIRouter, HTTPException
from app.models import MatchResult, RecommendationRequest
from app.embeddings import embed_text
from app.parse import normalize_skills
from app.scoring import skill_fraction, composite_score

router = APIRouter(prefix="/recommend", tags=["recommendations"])

def get_store():
    """Helper function to get the store from main app"""
    from app.main import store
    return store

@router.post("", response_model=list[MatchResult])
async def recommend(request: RecommendationRequest):
    store = get_store()
    
    # Check if store is initialized
    if store is None:
        raise HTTPException(status_code=500, detail="Vector store not initialized")
    
    # Return empty array if no jobs in the database
    if len(store.metadatas) == 0:
        return []
    
    # Build search text from department, batch, skills, and optional resume
    text_parts = [
        f"Department: {request.department}",
        f"Batch: {request.batch}",
        f"Skills: {', '.join(request.skills)}"
    ]
    
    if request.resume:
        text_parts.append(request.resume)
    
    search_text = ". ".join(text_parts)
    
    # Create embedding from the combined text
    resume_vec = embed_text(search_text)
    
    # Fetch more results to account for filtering
    results = store.search(resume_vec, request.k * 2)
    
    # Use provided skills for skill matching
    resume_skills = [skill.lower() for skill in request.skills]
    
    # Add normalized skills from resume if provided
    if request.resume:
        resume_skills.extend(normalize_skills(request.resume))
    
    # Remove duplicates
    resume_skills = list(set(resume_skills))
    
    search_text_lower = search_text.lower()

    out = []
    for dist, job_meta in results:
        # Filter: only include active jobs
        if job_meta.get("status", "").lower() != "active":
            continue
        
        # Filter by department - check if student's department is eligible
        eligible_depts = [dept.lower() for dept in job_meta.get("eligibleDepartments", [])]
        if eligible_depts and request.department.lower() not in eligible_depts:
            continue
        
        # Optional filter by job type (internship vs full-time)
        if request.job_type and job_meta.get("type", "").lower() != request.job_type.lower():
            continue
        
        s_vec = (dist + 1) / 2
        s_skill = skill_fraction(resume_skills, job_meta.get("skillsRequired", []))
        comp = composite_score(s_vec, s_skill)

        # Build structured highlights
        matched_skills = []
        matched_department = None
        matched_batch = None
        matched_requirements = []
        
        # Collect matched skills
        for skill in resume_skills:
            if skill in [s.lower() for s in job_meta.get("skillsRequired", [])]:
                matched_skills.append(skill)
        
        # Check matched department
        if request.department.lower() in eligible_depts:
            matched_department = request.department
        
        # Check matched batch (if mentioned in requirements)
        for req in job_meta.get("requirements", []):
            if request.batch in req:
                matched_batch = request.batch
                break
        
        # Collect matched requirements
        if request.resume:
            resume_lower = request.resume.lower()
            for req in job_meta.get("requirements", []):
                req_words = set(req.lower().split())
                if any(word in resume_lower for word in req_words if len(word) > 3):
                    matched_requirements.append(req)

        from app.models import Highlights
        highlights = Highlights(
            skills=matched_skills,
            department=matched_department,
            batch=matched_batch,
            requirements=matched_requirements
        )

        out.append(MatchResult(
            job_id=job_meta["id"],
            composite_score=round(comp, 3),
            s_vec=round(s_vec, 3),
            s_skill=round(s_skill, 3),
            highlights=highlights,
            job_type=job_meta.get("type", ""),
            location=job_meta.get("location", "")
        ))
        
        # Stop once we have enough results
        if len(out) >= request.k:
            break

    return out
