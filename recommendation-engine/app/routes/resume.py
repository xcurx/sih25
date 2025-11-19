from fastapi import APIRouter, UploadFile, File
import os
from app.models import ParseResult
from app.parse import extract_text, normalize_skills, resume_strength

router = APIRouter(prefix="/resume", tags=["resume"])

@router.post("/upload", response_model=ParseResult)
async def upload_resume(file: UploadFile = File(...)):
    """Upload and parse a resume file to extract text and skills"""
    tmp = f"tmp_{file.filename}"
    with open(tmp, "wb") as f:
        f.write(await file.read())

    text = extract_text(tmp)
    os.remove(tmp)

    skills = normalize_skills(text)
    score = resume_strength(text, skills)

    return ParseResult(text=text[:2000], skills=skills, resume_score=score)
