"""
Pydantic schemas for the recommendation engine
"""

from typing import List, Optional
from pydantic import BaseModel, Field


class Opportunity(BaseModel):
    """Schema for a job/internship opportunity"""
    id: str
    title: str
    description: str
    type: str  # internship or full-time
    location: str
    status: str  # active or closed
    salary: Optional[str] = None
    cgpa: Optional[float] = None
    requirements: List[str] = []
    eligibleDepartments: List[str] = []
    skillsRequired: List[str] = []
    additionalInfo: Optional[str] = None


class Project(BaseModel):
    """Schema for a student's project"""
    id: str
    studentId: str
    title: str
    description: str
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    link: Optional[str] = None
    technologies: List[str] = []


class Student(BaseModel):
    """Schema for a student"""
    id: str
    email: str
    name: str
    branch: Optional[str] = None
    batch: Optional[int] = None
    cgpa: Optional[float] = None
    phone: Optional[str] = None
    skills: List[str] = []
    projects: List[Project] = []


class CandidateMatch(BaseModel):
    job_id: str
    student_id: str
    match_score: float
    matching_skills: List[str] = []


class StudentRecommendationResponse(BaseModel):
    success: bool
    message: str
    total_candidates: int
    candidates: List[Student] = []


class RecommendationRequest(BaseModel):
    """Schema for recommendation request input"""
    department: str
    batch: str  # e.g., "2027"
    skills: List[str]
    k: Optional[int] = Field(default=10, ge=1, le=100)
    job_type: Optional[str] = None  # internship, full-time, or None for all


class Highlights(BaseModel):
    """Schema for matching highlights in recommendation"""
    skills: List[str] = []
    department: Optional[str] = None
    batch: Optional[str] = None
    requirements: List[str] = []


class MatchResult(BaseModel):
    """Schema for a single recommendation result"""
    job_id: str
    composite_score: float
    s_vec: float  # Vector similarity score
    s_skill: float  # Skill match score
    highlights: Highlights
    job_type: str
    location: str


class RecommendationResponse(BaseModel):
    """Schema for recommendation response"""
    recommendations: List[MatchResult]
    total_active_jobs: int
    query_department: str
    query_batch: str


class AddJobResponse(BaseModel):
    """Schema for add job response"""
    success: bool
    message: str
    job_id: str


class RemoveJobResponse(BaseModel):
    """Schema for remove job response"""
    success: bool
    message: str
    job_id: str


class UpdateJobResponse(BaseModel):
    """Schema for update job response"""
    success: bool
    message: str
    job_id: str


class HealthResponse(BaseModel):
    """Schema for health check response"""
    status: str
    total_jobs: int
    active_jobs: int
    model_loaded: bool


class SkippedJob(BaseModel):
    """Schema for a skipped job in bulk add"""
    id: str
    reason: str


class FailedJob(BaseModel):
    """Schema for a failed job in bulk add"""
    id: str
    error: str


class BulkAddResults(BaseModel):
    """Schema for bulk add results details"""
    added: List[str] = []
    skipped: List[SkippedJob] = []
    failed: List[FailedJob] = []


class BulkAddJobsResponse(BaseModel):
    """Schema for bulk add jobs response"""
    success: bool
    message: str
    added_count: int
    skipped_count: int
    failed_count: int
    total_submitted: int
    results: BulkAddResults
