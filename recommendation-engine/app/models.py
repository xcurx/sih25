from pydantic import BaseModel
from typing import List, Optional

class JobPosting(BaseModel):
    id: str
    title: str
    description: str
    type: str  # internship or full-time
    location: str
    status: str  # active or closed
    salary: Optional[str] = None
    requirements: List[str] = []
    eligibleDepartments: List[str] = []
    skillsRequired: List[str] = []
    additionalInfo: Optional[str] = None

class ParseResult(BaseModel):
    text: str
    skills: List[str]
    resume_score: float

class BulkJobRequest(BaseModel):
    jobs: List[JobPosting]

class RecommendationRequest(BaseModel):
    department: str
    batch: str  # e.g., "2027"
    skills: List[str]
    resume: Optional[str] = None
    k: Optional[int] = 10
    job_type: Optional[str] = None

class Highlights(BaseModel):
    skills: List[str] = []
    department: Optional[str] = None
    batch: Optional[str] = None
    requirements: List[str] = []

class MatchResult(BaseModel):
    job_id: str
    composite_score: float
    s_vec: float
    s_skill: float
    highlights: Highlights
    job_type: str
    location: str
