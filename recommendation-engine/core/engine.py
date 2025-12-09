"""
Recommendation Engine Core

This module implements the core recommendation logic using:
1. HuggingFace Inference API for embeddings (memory efficient)
2. Skill-based matching with Jaccard similarity
3. Department and batch eligibility filtering
4. Composite scoring combining all factors
5. PostgreSQL pgvector for vector similarity search
"""

import os
from typing import List, Dict, Optional, Tuple
import threading
import logging

from models.schemas import (
    Opportunity,
    RecommendationRequest,
    Highlights,
    MatchResult
)
from models.schemas import Student
from core.database import get_database, DatabaseManager
from core.embeddings import get_embedding_service, EmbeddingService

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class RecommendationEngine:
    """
    Hybrid recommendation engine combining:
    - Semantic similarity using HuggingFace Inference API (memory efficient)
    - Skill-based matching
    - Department eligibility filtering
    - Batch year filtering
    - PostgreSQL persistence with pgvector for vector search
    """
    
    def __init__(self):
        """
        Initialize the recommendation engine.
        Uses HuggingFace Inference API for embeddings instead of local models.
        """
        self.jobs: Dict[str, Opportunity] = {}  # job_id -> Opportunity (metadata only)
        self.students: Dict[str, Student] = {}  # student_id -> Student (metadata only)
        self._lock = threading.Lock()
        self._model_loaded = False
        self._db: DatabaseManager = get_database()
        self._embedding_service: EmbeddingService = get_embedding_service()
        
        # Scoring weights
        self.weights = {
            "vector_similarity": 0.4,  # Semantic similarity weight
            "skill_match": 0.35,       # Skill matching weight
            "department_match": 0.15,  # Department eligibility weight
            "requirement_match": 0.10  # Requirements matching weight
        }

    
    def load_model(self) -> bool:
        """Initialize the embedding service and restore jobs from database."""
        try:
            logger.info("Initializing HuggingFace Inference API embedding service...")
            
            if self._embedding_service.initialize():
                self._model_loaded = True
                logger.info("Embedding service initialized successfully")
                
                # Initialize database and load persisted jobs
                self._initialize_persistence()
                return True
            else:
                logger.error("Failed to initialize embedding service")
                return False
                
        except Exception as e:
            logger.error(f"Failed to initialize: {e}")
            return False
    
    def _initialize_persistence(self):
        """Initialize database and load persisted jobs."""
        if not self._db.is_configured:
            logger.info("Database not configured, running in memory-only mode")
            return
        
        # Initialize tables
        if self._db.initialize_tables():
            # Load jobs from database (metadata only)
            self._load_jobs_from_db()
            # Load students from database (metadata only)
            self._load_students_from_db()
        else:
            logger.warning("Failed to initialize database tables")
    
    def _load_jobs_from_db(self):
        """Load all jobs metadata from database into memory (no embeddings)."""
        jobs_data = self._db.load_all_jobs()
        
        if not jobs_data:
            logger.info("No jobs found in database")
            return
        
        loaded_count = 0
        for job_data in jobs_data:
            try:
                # Reconstruct Opportunity object (metadata only)
                job = Opportunity(
                    id=job_data['id'],
                    title=job_data['title'],
                    description=job_data['description'],
                    type=job_data['type'],
                    location=job_data['location'],
                    skillsRequired=job_data['skillsRequired'],
                    requirements=job_data['requirements'],
                    eligibleDepartments=job_data['eligibleDepartments'],
                    additionalInfo=job_data['additionalInfo'],
                    status=job_data['status'],
                    cgpa=job_data.get('cgpa')
                )
                
                # Store only metadata in memory (embeddings stay in DB)
                self.jobs[job.id] = job
                loaded_count += 1
                
            except Exception as e:
                logger.error(f"Failed to load job {job_data.get('id')}: {e}")
        
        logger.info(f"Loaded {loaded_count} jobs metadata from database")

    def _load_students_from_db(self):
        """Load all student metadata from database into memory (no embeddings)."""
        students_data = self._db.load_all_students()

        if not students_data:
            logger.info("No students found in database")
            return

        loaded_count = 0
        for s in students_data:
            try:
                student = Student(
                    id=s['id'],
                    email=s['email'],
                    name=s['name'],
                    branch=s.get('branch'),
                    batch=s.get('batch'),
                    cgpa=s.get('cgpa'),
                    phone=s.get('phone'),
                    skills=s.get('skills') or [],
                    projects=s.get('projects') or [],
                    placed=s.get('placed', False)
                )

                self.students[student.id] = student
                loaded_count += 1
            except Exception as e:
                logger.error(f"Failed to load student {s.get('id')}: {e}")

        logger.info(f"Loaded {loaded_count} students metadata from database")
    
    @property
    def is_model_loaded(self) -> bool:
        """Check if the model is loaded."""
        return self._model_loaded
    
    def _create_job_text(self, job: Opportunity) -> str:
        """
        Create a text representation of a job for embedding.
        
        Args:
            job: The opportunity to create text for
            
        Returns:
            Concatenated text representation
        """
        parts = [
            job.title,
            job.description,
            f"Type: {job.type}",
            f"Location: {job.location}",
        ]
        
        if job.skillsRequired:
            parts.append(f"Skills: {', '.join(job.skillsRequired)}")
        
        if job.requirements:
            parts.append(f"Requirements: {', '.join(job.requirements)}")
        
        if job.eligibleDepartments:
            parts.append(f"Departments: {', '.join(job.eligibleDepartments)}")
        
        if job.additionalInfo:
            parts.append(job.additionalInfo)
        
        return " ".join(parts)

    def _create_student_text(self, student: Student) -> str:
        """Create a text representation of a student for embedding."""
        parts = [student.name]
        if student.skills:
            parts.append(f"Skills: {', '.join(student.skills)}")
        # include project titles and descriptions
        proj_texts = []
        for p in student.projects or []:
            try:
                # p may be dict if loaded from DB
                title = p.get('title') if isinstance(p, dict) else getattr(p, 'title', None)
                desc = p.get('description') if isinstance(p, dict) else getattr(p, 'description', None)
                if title:
                    proj_texts.append(title)
                if desc:
                    proj_texts.append(desc)
            except Exception:
                continue

        if proj_texts:
            parts.append("Projects: " + " ".join(proj_texts))

        return " ".join(parts)
    
    def _create_user_query_text(self, request: RecommendationRequest) -> str:
        """
        Create a text representation of user preferences for embedding.
        
        Args:
            request: The recommendation request
            
        Returns:
            Concatenated text representation
        """
        parts = [
            f"Department: {request.department}",
            f"Skills: {', '.join(request.skills)}",
        ]
        
        if request.job_type:
            parts.append(f"Looking for: {request.job_type}")
        
        return " ".join(parts)
    
    def add_job(self, job: Opportunity) -> bool:
        """
        Add a new job to the recommendation system.
        
        Args:
            job: The opportunity to add
            
        Returns:
            True if successful, False otherwise
        """
        if not self._model_loaded:
            logger.error("Embedding service not ready. Cannot add job.")
            return False
        
        with self._lock:
            try:
                # Create text representation
                job_text = self._create_job_text(job)
                
                # Generate embedding using HuggingFace API
                embedding = self._embedding_service.get_embedding(job_text)
                
                if embedding is None:
                    logger.error(f"Failed to get embedding for job {job.id}")
                    return False
                
                # Store job metadata in memory (no embeddings)
                self.jobs[job.id] = job
                
                # Persist job and embedding to database
                self._db.save_job(job, embedding)
                
                logger.info(f"Added job: {job.id} - {job.title}")
                return True
            except Exception as e:
                logger.error(f"Failed to add job {job.id}: {e}")
                return False

    def add_student(self, student: Student) -> bool:
        """Add a student to the system (generate embedding and persist)."""
        if not self._model_loaded:
            logger.error("Embedding service not ready. Cannot add student.")
            return False

        with self._lock:
            try:
                student_text = self._create_student_text(student)
                embedding = self._embedding_service.get_embedding(student_text)

                if embedding is None:
                    logger.error(f"Failed to get embedding for student {student.id}")
                    return False

                # Store metadata in memory
                self.students[student.id] = student

                # Persist
                self._db.save_student(student, embedding)

                logger.info(f"Added student: {student.id} - {student.name}")
                return True
            except Exception as e:
                logger.error(f"Failed to add student {student.id}: {e}")
                return False

    def bulk_add_students(self, students: List[Student]) -> dict:
        """
        Bulk add students. Returns results dict with added/skipped/failed lists.
        """
        results = {"added": [], "skipped": [], "failed": []}

        if not self._model_loaded:
            logger.error("Embedding service not ready. Cannot add students.")
            for s in students:
                results['failed'].append({"id": s.id, "error": "Embedding service not ready"})
            return results

        students_with_embeddings = []

        with self._lock:
            for s in students:
                try:
                    if s.id in self.students:
                        results['skipped'].append({"id": s.id, "reason": "Student already exists"})
                        continue

                    text = self._create_student_text(s)
                    embedding = self._embedding_service.get_embedding(text)
                    if embedding is None:
                        results['failed'].append({"id": s.id, "error": "Failed to get embedding"})
                        continue

                    self.students[s.id] = s
                    students_with_embeddings.append((s, embedding))
                    results['added'].append(s.id)
                except Exception as e:
                    results['failed'].append({"id": s.id, "error": str(e)})

            if students_with_embeddings:
                self._db.save_students_bulk(students_with_embeddings)

        return results

    def get_students_for_opportunity(self, opportunity_id: str) -> List[Student]:
        """Return list of students matching an opportunity.

        Rules:
        - Only suggest unplaced students (placed=False)
        - Strict: CGPA must be >= opportunity.cgpa (if specified, skip if not)
        - Loose: skills overlap >= 20% of opportunity.skillsRequired
        """
        if opportunity_id not in self.jobs:
            logger.warning(f"Opportunity {opportunity_id} not found in memory")
            return []

        job = self.jobs[opportunity_id]
        required_skills = job.skillsRequired or []
        
        logger.info(f"Matching students for opportunity: {opportunity_id}")
        logger.info(f"  Job CGPA requirement: {job.cgpa}")
        logger.info(f"  Job required skills: {required_skills}")
        logger.info(f"  Total students in system: {len(self.students)}")

        matches: List[Student] = []
        for s in self.students.values():
            # Only suggest unplaced students
            if s.placed:
                logger.debug(f"  Student {s.id} skipped: already placed")
                continue

            # Strict CGPA check (only if opportunity specifies cgpa)
            if job.cgpa is not None:
                try:
                    if s.cgpa is None or float(s.cgpa) < float(job.cgpa):
                        logger.debug(f"  Student {s.id} skipped: CGPA {s.cgpa} < required {job.cgpa}")
                        continue
                except Exception:
                    continue
            # If job.cgpa is None, skip CGPA check entirely - all students pass

            # Loose skills check (>= 20% match required)
            if required_skills:
                student_skills = [x.lower().strip() for x in (s.skills or [])]
                req_skills = [x.lower().strip() for x in required_skills]

                matching = set(student_skills).intersection(set(req_skills))
                pct = len(matching) / len(req_skills) if req_skills else 0
                logger.debug(f"  Student {s.id}: skills {student_skills}, matching {matching}, pct {pct:.2f}")
                if pct < 0.2:
                    logger.debug(f"  Student {s.id} skipped: skill match {pct:.2f} < 0.2")
                    continue

            # If passed checks, include
            logger.debug(f"  Student {s.id} MATCHED")
            matches.append(s)

        logger.info(f"Found {len(matches)} candidate(s) for opportunity {opportunity_id}")
        return matches
    
    def remove_job(self, job_id: str) -> bool:
        """
        Remove a job from the recommendation system.
        
        Args:
            job_id: The ID of the job to remove
            
        Returns:
            True if successful, False otherwise
        """
        with self._lock:
            if job_id in self.jobs:
                del self.jobs[job_id]
                
                # Remove from database
                self._db.delete_job(job_id)
                
                logger.info(f"Removed job: {job_id}")
                return True
            return False
    
    def update_job(self, job: Opportunity) -> bool:
        """
        Update an existing job in the recommendation system.
        
        Args:
            job: The updated opportunity
            
        Returns:
            True if successful, False otherwise
        """
        with self._lock:
            if job.id not in self.jobs:
                logger.warning(f"Job {job.id} not found for update")
                return False
            
            # Remove old and add new
            self.remove_job(job.id)
            return self.add_job(job)
    
    def _calculate_skill_match(
        self, 
        user_skills: List[str], 
        job_skills: List[str]
    ) -> Tuple[float, List[str]]:
        """
        Calculate skill match score using Jaccard-like similarity.
        
        Args:
            user_skills: List of user's skills
            job_skills: List of required skills for job
            
        Returns:
            Tuple of (score, matching_skills)
        """
        if not job_skills:
            return 1.0, []  # No skills required means full match
        
        user_skills_lower = {s.lower().strip() for s in user_skills}
        job_skills_lower = {s.lower().strip() for s in job_skills}
        
        matching = user_skills_lower.intersection(job_skills_lower)
        
        if not job_skills_lower:
            return 1.0, []
        
        # Score based on how many required skills the user has
        score = len(matching) / len(job_skills_lower)
        
        # Get original case matching skills
        matching_skills = [
            s for s in job_skills 
            if s.lower().strip() in matching
        ]
        
        return score, matching_skills
    
    def _check_department_eligibility(
        self, 
        user_department: str, 
        eligible_departments: List[str]
    ) -> Tuple[float, Optional[str]]:
        """
        Check if user's department is eligible for the job.
        
        Args:
            user_department: User's department
            eligible_departments: List of eligible departments
            
        Returns:
            Tuple of (score, matching_department if found)
        """
        if not eligible_departments:
            return 1.0, None  # No department restriction
        
        user_dept_lower = user_department.lower().strip()
        
        for dept in eligible_departments:
            if dept.lower().strip() == user_dept_lower:
                return 1.0, dept
            # Partial match (e.g., "CS" matches "Computer Science")
            if user_dept_lower in dept.lower() or dept.lower() in user_dept_lower:
                return 0.8, dept
        
        return 0.0, None
    
    def _check_batch_eligibility(
        self, 
        user_batch: str, 
        job: Opportunity
    ) -> Tuple[float, Optional[str]]:
        """
        Check batch eligibility based on job type and requirements.
        
        For internships, typically prefer students (future batches).
        For full-time, typically prefer graduating/graduated students.
        
        Args:
            user_batch: User's batch year (e.g., "2027")
            job: The job opportunity
            
        Returns:
            Tuple of (score, batch_highlight if relevant - just the batch number)
        """
        try:
            batch_year = int(user_batch)
            current_year = 2025  # Could be made dynamic
            
            years_to_graduate = batch_year - current_year
            
            if job.type.lower() == "internship":
                # Internships prefer current students (1-3 years to graduate)
                if 1 <= years_to_graduate <= 3:
                    return 1.0, user_batch
                elif years_to_graduate > 0:
                    return 0.7, user_batch
                else:
                    return 0.3, None
            else:  # full-time
                # Full-time prefers graduating soon or recent graduates
                if -1 <= years_to_graduate <= 1:
                    return 1.0, user_batch
                elif years_to_graduate <= 2:
                    return 0.6, user_batch
                else:
                    return 0.3, None
        except ValueError:
            return 0.5, None
    
    def _calculate_requirement_match(
        self, 
        user_skills: List[str], 
        requirements: List[str]
    ) -> Tuple[float, List[str]]:
        """
        Calculate how well user matches job requirements.
        
        Args:
            user_skills: User's skills
            requirements: Job requirements
            
        Returns:
            Tuple of (score, matching_requirements)
        """
        if not requirements:
            return 1.0, []
        
        user_skills_text = " ".join(user_skills).lower()
        matching_reqs = []
        
        for req in requirements:
            req_lower = req.lower()
            # Check if any skill appears in requirement
            for skill in user_skills:
                if skill.lower() in req_lower:
                    matching_reqs.append(req)
                    break
        
        score = len(matching_reqs) / len(requirements) if requirements else 1.0
        return score, matching_reqs
    
    def get_recommendations(
        self, 
        request: RecommendationRequest
    ) -> List[MatchResult]:
        """
        Get personalized job recommendations using pgvector for similarity search.
        
        Args:
            request: The recommendation request with user preferences
            
        Returns:
            List of MatchResult sorted by composite score
        """
        if not self._model_loaded:
            logger.error("Embedding service not ready. Cannot get recommendations.")
            return []
        
        # Create user query embedding using HuggingFace API
        query_text = self._create_user_query_text(request)
        query_embedding = self._embedding_service.get_embedding(query_text)
        
        if query_embedding is None:
            logger.error("Failed to get query embedding")
            return []
        
        # Use pgvector to search for similar jobs in database
        if self._db.is_configured:
            similar_jobs = self._db.search_similar_jobs(
                query_embedding=query_embedding,
                status_filter="active",
                job_type_filter=request.job_type,
                limit=request.k * 3  # Get more candidates for re-ranking
            )
        else:
            # Fallback to in-memory search if no database
            similar_jobs = self._fallback_in_memory_search(request)
        
        if not similar_jobs:
            return []
        
        results = []
        
        for job_data in similar_jobs:
            job_id = job_data['id']
            vec_sim = job_data.get('similarity', 0.5)
            
            # Get job from memory cache or use job_data
            job = self.jobs.get(job_id)
            if not job:
                # Reconstruct from job_data if not in memory
                job = Opportunity(
                    id=job_data['id'],
                    title=job_data['title'],
                    description=job_data['description'],
                    type=job_data['type'],
                    location=job_data['location'],
                    skillsRequired=job_data['skillsRequired'],
                    requirements=job_data['requirements'],
                    eligibleDepartments=job_data['eligibleDepartments'],
                    additionalInfo=job_data['additionalInfo'],
                    status=job_data['status']
                )
            
            # 2. Skill match
            skill_score, matching_skills = self._calculate_skill_match(
                request.skills, job.skillsRequired
            )
            
            # 3. Department eligibility
            dept_score, matching_dept = self._check_department_eligibility(
                request.department, job.eligibleDepartments
            )
            
            # 4. Batch eligibility
            batch_score, batch_highlight = self._check_batch_eligibility(
                request.batch, job
            )
            
            # 5. Requirement match
            req_score, matching_reqs = self._calculate_requirement_match(
                request.skills, job.requirements
            )
            
            # Skip if department doesn't match at all
            if dept_score == 0.0 and job.eligibleDepartments:
                continue
            
            # Calculate composite score
            composite_score = (
                self.weights["vector_similarity"] * vec_sim +
                self.weights["skill_match"] * skill_score +
                self.weights["department_match"] * dept_score +
                self.weights["requirement_match"] * req_score
            ) * batch_score  # Batch acts as a multiplier
            
            # Create highlights
            highlights = Highlights(
                skills=matching_skills,
                department=matching_dept,
                batch=batch_highlight,
                requirements=matching_reqs[:3]  # Top 3 matching requirements
            )
            
            result = MatchResult(
                job_id=job_id,
                composite_score=round(composite_score, 4),
                s_vec=round(float(vec_sim), 4),
                s_skill=round(skill_score, 4),
                highlights=highlights,
                job_type=job.type,
                location=job.location
            )
            
            results.append(result)
        
        # Sort by composite score descending
        results.sort(key=lambda x: x.composite_score, reverse=True)
        
        # Return top k results
        return results[:request.k]
    
    def _fallback_in_memory_search(
        self, 
        request: RecommendationRequest
    ) -> List[Dict]:
        """
        Fallback search when database is not configured.
        Returns job data in the same format as database search.
        """
        active_jobs = [
            {
                'id': job.id,
                'title': job.title,
                'description': job.description,
                'type': job.type,
                'location': job.location,
                'skillsRequired': job.skillsRequired,
                'requirements': job.requirements,
                'eligibleDepartments': job.eligibleDepartments,
                'additionalInfo': job.additionalInfo,
                'status': job.status,
                'similarity': 0.5  # Default similarity when no DB
            }
            for job in self.jobs.values()
            if job.status.lower() == "active"
            and (not request.job_type or job.type.lower() == request.job_type.lower())
        ]
        return active_jobs
    
    def get_total_jobs(self) -> int:
        """Get total number of jobs in the system."""
        if self._db.is_configured:
            return self._db.get_job_count()
        return len(self.jobs)
    
    def get_active_jobs_count(self) -> int:
        """Get number of active jobs."""
        if self._db.is_configured:
            return self._db.get_active_job_count()
        return sum(
            1 for job in self.jobs.values() 
            if job.status.lower() == "active"
        )
    
    def bulk_add_jobs(self, jobs: List[Opportunity]) -> dict:
        """
        Add multiple jobs at once with optimized database writes.
        
        Args:
            jobs: List of opportunities to add
            
        Returns:
            Dictionary with added, skipped, and failed job details
        """
        results = {
            "added": [],
            "skipped": [],
            "failed": []
        }
        
        if not self._model_loaded:
            logger.error("Embedding service not ready. Cannot add jobs.")
            for job in jobs:
                results["failed"].append({
                    "id": job.id,
                    "error": "Embedding service not ready"
                })
            return results
        
        jobs_with_embeddings = []
        
        with self._lock:
            for job in jobs:
                try:
                    # Check if job already exists
                    if job.id in self.jobs:
                        results["skipped"].append({
                            "id": job.id,
                            "reason": "Job already exists"
                        })
                        logger.info(f"Skipped job (already exists): {job.id} - {job.title}")
                        continue
                    
                    # Create text representation
                    job_text = self._create_job_text(job)
                    
                    # Get embedding from HuggingFace API
                    embedding = self._embedding_service.get_embedding(job_text)
                    
                    if embedding is None:
                        results["failed"].append({
                            "id": job.id,
                            "error": "Failed to get embedding"
                        })
                        logger.error(f"Failed to get embedding for job {job.id}")
                        continue
                    
                    # Store only metadata in memory (no embeddings)
                    self.jobs[job.id] = job
                    
                    jobs_with_embeddings.append((job, embedding))
                    results["added"].append(job.id)
                    
                    logger.info(f"Added job: {job.id} - {job.title}")
                except Exception as e:
                    results["failed"].append({
                        "id": job.id,
                        "error": str(e)
                    })
                    logger.error(f"Failed to add job {job.id}: {e}")
            
            # Bulk save to database (embeddings stored in DB, not memory)
            if jobs_with_embeddings:
                self._db.save_jobs_bulk(jobs_with_embeddings)
        
        return results
    
    def clear_all_jobs(self) -> bool:
        """
        Clear all jobs from memory and database.
        
        Returns:
            True if successful, False otherwise
        """
        with self._lock:
            self.jobs.clear()
            self._db.clear_all_jobs()
            logger.info("Cleared all jobs")
            return True


# Singleton instance
_engine_instance: Optional[RecommendationEngine] = None


def get_engine() -> RecommendationEngine:
    """Get or create the recommendation engine singleton."""
    global _engine_instance
    if _engine_instance is None:
        _engine_instance = RecommendationEngine()
    return _engine_instance
