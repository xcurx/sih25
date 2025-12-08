"""
PostgreSQL Database Module with pgvector support

This module handles:
1. Connection to Neon PostgreSQL
2. Job persistence (save/load/delete)
3. Embedding storage using pgvector
"""

import os
import json
import logging
from typing import List, Optional, Dict, Any
from contextlib import contextmanager

import psycopg2
from psycopg2.extras import RealDictCursor, execute_values
import numpy as np
from dotenv import load_dotenv

from models.schemas import Opportunity, Student

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)


class DatabaseManager:
    def __init__(self):
        self.database_url = os.getenv("DATABASE_URL")
        self._initialized = False
        
        if not self.database_url:
            logger.warning(
                "DATABASE_URL not set. Running in memory-only mode. "
                "Set DATABASE_URL environment variable for persistence."
            )
    
    @property
    def is_configured(self) -> bool:
        return self.database_url is not None
    
    @contextmanager
    def get_connection(self):
        if not self.database_url:
            raise RuntimeError("Database not configured")
        
        conn = psycopg2.connect(self.database_url)
        try:
            yield conn
            conn.commit()
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()
    
    def initialize_tables(self) -> bool:
        if not self.is_configured:
            logger.warning("Database not configured, skipping initialization")
            return False
        
        try:
            with self.get_connection() as conn:
                with conn.cursor() as cur:
                    # Enable pgvector extension
                    cur.execute("CREATE EXTENSION IF NOT EXISTS vector;")
                    
                    # Create jobs table
                    cur.execute("""
                        CREATE TABLE IF NOT EXISTS jobs (
                            id VARCHAR(255) PRIMARY KEY,
                            title VARCHAR(500) NOT NULL,
                            description TEXT NOT NULL,
                            type VARCHAR(50) NOT NULL,
                            location VARCHAR(255) NOT NULL,
                            skills_required JSONB DEFAULT '[]',
                            requirements JSONB DEFAULT '[]',
                            eligible_departments JSONB DEFAULT '[]',
                            additional_info TEXT,
                            status VARCHAR(50) DEFAULT 'active',
                            cgpa FLOAT,
                            embedding vector(384),
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                        );
                    """)
                    
                    # Add cgpa column if it doesn't exist (migration for existing tables)
                    cur.execute("""
                        ALTER TABLE jobs ADD COLUMN IF NOT EXISTS cgpa FLOAT;
                    """)
                    
                    # Create index on status for faster filtering
                    cur.execute("""
                        CREATE INDEX IF NOT EXISTS idx_jobs_status 
                        ON jobs(status);
                    """)
                    
                    # Create vector index for similarity search (optional optimization)
                    cur.execute("""
                        CREATE INDEX IF NOT EXISTS idx_jobs_embedding 
                        ON jobs USING ivfflat (embedding vector_cosine_ops)
                        WITH (lists = 100);
                    """)

                    # Create students table
                    cur.execute("""
                        CREATE TABLE IF NOT EXISTS students (
                            id VARCHAR(255) PRIMARY KEY,
                            email VARCHAR(255) UNIQUE NOT NULL,
                            name VARCHAR(500) NOT NULL,
                            branch VARCHAR(255),
                            batch INTEGER,
                            cgpa FLOAT,
                            phone VARCHAR(50),
                            skills JSONB DEFAULT '[]',
                            projects JSONB DEFAULT '[]',
                            embedding vector(384),
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                        );
                    """)

                    cur.execute("""
                        CREATE INDEX IF NOT EXISTS idx_students_embedding 
                        ON students USING ivfflat (embedding vector_cosine_ops)
                        WITH (lists = 100);
                    """)
                    
            self._initialized = True
            logger.info("Database tables initialized successfully")
            return True
            
        except Exception as e:
            logger.error(f"Failed to initialize database: {e}")
            return False
    
    def save_job(
        self, 
        job: Opportunity, 
        embedding: np.ndarray
    ) -> bool:
        if not self.is_configured:
            return False
        
        try:
            with self.get_connection() as conn:
                with conn.cursor() as cur:
                    # Convert embedding to list for pgvector (handle both numpy arrays and lists)
                    embedding_list = embedding.tolist() if hasattr(embedding, 'tolist') else embedding
                    
                    cur.execute("""
                        INSERT INTO jobs (
                            id, title, description, type, location,
                            skills_required, requirements, eligible_departments,
                            additional_info, status, cgpa, embedding
                        ) VALUES (
                            %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
                        )
                        ON CONFLICT (id) DO UPDATE SET
                            title = EXCLUDED.title,
                            description = EXCLUDED.description,
                            type = EXCLUDED.type,
                            location = EXCLUDED.location,
                            skills_required = EXCLUDED.skills_required,
                            requirements = EXCLUDED.requirements,
                            eligible_departments = EXCLUDED.eligible_departments,
                            additional_info = EXCLUDED.additional_info,
                            status = EXCLUDED.status,
                            cgpa = EXCLUDED.cgpa,
                            embedding = EXCLUDED.embedding,
                            updated_at = CURRENT_TIMESTAMP;
                    """, (
                        job.id,
                        job.title,
                        job.description,
                        job.type,
                        job.location,
                        json.dumps(job.skillsRequired or []),
                        json.dumps(job.requirements or []),
                        json.dumps(job.eligibleDepartments or []),
                        job.additionalInfo,
                        job.status,
                        job.cgpa,
                        embedding_list
                    ))
                    
            logger.debug(f"Saved job to database: {job.id}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to save job {job.id}: {e}")
            return False
    
    def save_jobs_bulk(
        self, 
        jobs_with_embeddings: List[tuple]
    ) -> int:
        if not self.is_configured or not jobs_with_embeddings:
            return 0
        
        try:
            with self.get_connection() as conn:
                with conn.cursor() as cur:
                    values = []
                    for job, embedding in jobs_with_embeddings:
                        # Handle both numpy arrays and lists
                        embedding_list = embedding.tolist() if hasattr(embedding, 'tolist') else embedding
                        values.append((
                            job.id,
                            job.title,
                            job.description,
                            job.type,
                            job.location,
                            json.dumps(job.skillsRequired or []),
                            json.dumps(job.requirements or []),
                            json.dumps(job.eligibleDepartments or []),
                            job.additionalInfo,
                            job.status,
                            job.cgpa,
                            embedding_list
                        ))
                    
                    execute_values(
                        cur,
                        """
                        INSERT INTO jobs (
                            id, title, description, type, location,
                            skills_required, requirements, eligible_departments,
                            additional_info, status, cgpa, embedding
                        ) VALUES %s
                        ON CONFLICT (id) DO UPDATE SET
                            title = EXCLUDED.title,
                            description = EXCLUDED.description,
                            type = EXCLUDED.type,
                            location = EXCLUDED.location,
                            skills_required = EXCLUDED.skills_required,
                            requirements = EXCLUDED.requirements,
                            eligible_departments = EXCLUDED.eligible_departments,
                            additional_info = EXCLUDED.additional_info,
                            status = EXCLUDED.status,
                            cgpa = EXCLUDED.cgpa,
                            embedding = EXCLUDED.embedding,
                            updated_at = CURRENT_TIMESTAMP;
                        """,
                        values
                    )
                    
            logger.info(f"Bulk saved {len(jobs_with_embeddings)} jobs to database")
            return len(jobs_with_embeddings)
            
        except Exception as e:
            logger.error(f"Failed to bulk save jobs: {e}")
            return 0
    
    def save_student(self, student: Student, embedding: np.ndarray) -> bool:
        """Save a single student with embedding."""
        if not self.is_configured:
            return False

        try:
            with self.get_connection() as conn:
                with conn.cursor() as cur:
                    embedding_list = embedding.tolist() if hasattr(embedding, 'tolist') else embedding

                    cur.execute("""
                        INSERT INTO students (
                            id, email, name, branch, batch, cgpa, phone, skills, projects, embedding
                        ) VALUES (
                            %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
                        )
                        ON CONFLICT (id) DO UPDATE SET
                            email = EXCLUDED.email,
                            name = EXCLUDED.name,
                            branch = EXCLUDED.branch,
                            batch = EXCLUDED.batch,
                            cgpa = EXCLUDED.cgpa,
                            phone = EXCLUDED.phone,
                            skills = EXCLUDED.skills,
                            projects = EXCLUDED.projects,
                            embedding = EXCLUDED.embedding,
                            updated_at = CURRENT_TIMESTAMP;
                    """, (
                        student.id,
                        student.email,
                        student.name,
                        student.branch,
                        student.batch,
                        student.cgpa,
                        student.phone,
                        json.dumps(student.skills or []),
                        json.dumps([p.dict() for p in (student.projects or [])]),
                        embedding_list
                    ))

            logger.debug(f"Saved student to database: {student.id}")
            return True

        except Exception as e:
            logger.error(f"Failed to save student {student.id}: {e}")
            return False

    def save_students_bulk(self, students_with_embeddings: List[tuple]) -> int:
        """Bulk save students with embeddings."""
        if not self.is_configured or not students_with_embeddings:
            return 0

        try:
            with self.get_connection() as conn:
                with conn.cursor() as cur:
                    values = []
                    for student, embedding in students_with_embeddings:
                        embedding_list = embedding.tolist() if hasattr(embedding, 'tolist') else embedding
                        values.append((
                            student.id,
                            student.email,
                            student.name,
                            student.branch,
                            student.batch,
                            student.cgpa,
                            student.phone,
                            json.dumps(student.skills or []),
                            json.dumps([p.dict() for p in (student.projects or [])]),
                            embedding_list
                        ))

                    execute_values(
                        cur,
                        """
                        INSERT INTO students (
                            id, email, name, branch, batch, cgpa, phone, skills, projects, embedding
                        ) VALUES %s
                        ON CONFLICT (id) DO UPDATE SET
                            email = EXCLUDED.email,
                            name = EXCLUDED.name,
                            branch = EXCLUDED.branch,
                            batch = EXCLUDED.batch,
                            cgpa = EXCLUDED.cgpa,
                            phone = EXCLUDED.phone,
                            skills = EXCLUDED.skills,
                            projects = EXCLUDED.projects,
                            embedding = EXCLUDED.embedding,
                            updated_at = CURRENT_TIMESTAMP;
                        """,
                        values
                    )

            logger.info(f"Bulk saved {len(students_with_embeddings)} students to database")
            return len(students_with_embeddings)

        except Exception as e:
            logger.error(f"Failed to bulk save students: {e}")
            return 0

    def load_all_students(self) -> List[Dict[str, Any]]:
        """Load all students with embeddings from the database."""
        if not self.is_configured:
            return []

        try:
            with self.get_connection() as conn:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute("""
                        SELECT id, email, name, branch, batch, cgpa, phone, skills, projects, embedding
                        FROM students;
                    """)
                    rows = cur.fetchall()

            students_data = []
            for row in rows:
                embedding = None
                if row['embedding']:
                    embedding_str = row['embedding']
                    if isinstance(embedding_str, str):
                        embedding = np.array(json.loads(embedding_str))
                    else:
                        embedding = np.array(embedding_str)

                students_data.append({
                    'id': row['id'],
                    'email': row['email'],
                    'name': row['name'],
                    'branch': row['branch'],
                    'batch': row['batch'],
                    'cgpa': row['cgpa'],
                    'phone': row['phone'],
                    'skills': row['skills'] or [],
                    'projects': row['projects'] or [],
                    'embedding': embedding
                })

            logger.info(f"Loaded {len(students_data)} students from database")
            return students_data

        except Exception as e:
            logger.error(f"Failed to load students from database: {e}")
            return []

    def get_student_count(self) -> int:
        if not self.is_configured:
            return 0
        try:
            with self.get_connection() as conn:
                with conn.cursor() as cur:
                    cur.execute("SELECT COUNT(*) FROM students;")
                    return cur.fetchone()[0]
        except Exception as e:
            logger.error(f"Failed to get student count: {e}")
            return 0
    
    def load_all_jobs(self) -> List[Dict[str, Any]]:
        if not self.is_configured:
            return []
        
        try:
            with self.get_connection() as conn:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute("""
                        SELECT 
                            id, title, description, type, location,
                            skills_required, requirements, eligible_departments,
                            additional_info, status, cgpa, embedding
                        FROM jobs;
                    """)
                    
                    rows = cur.fetchall()
                    
            jobs_data = []
            for row in rows:
                # Parse embedding string to numpy array
                embedding = None
                if row['embedding']:
                    # pgvector returns embedding as string like "[0.1, 0.2, ...]"
                    embedding_str = row['embedding']
                    if isinstance(embedding_str, str):
                        embedding = np.array(json.loads(embedding_str))
                    else:
                        embedding = np.array(embedding_str)
                
                jobs_data.append({
                    'id': row['id'],
                    'title': row['title'],
                    'description': row['description'],
                    'type': row['type'],
                    'location': row['location'],
                    'skillsRequired': row['skills_required'] or [],
                    'requirements': row['requirements'] or [],
                    'eligibleDepartments': row['eligible_departments'] or [],
                    'additionalInfo': row['additional_info'],
                    'status': row['status'],
                    'cgpa': row['cgpa'],
                    'embedding': embedding
                })
            
            logger.info(f"Loaded {len(jobs_data)} jobs from database")
            return jobs_data
            
        except Exception as e:
            logger.error(f"Failed to load jobs from database: {e}")
            return []
    
    def delete_job(self, job_id: str) -> bool:
        if not self.is_configured:
            return False
        
        try:
            with self.get_connection() as conn:
                with conn.cursor() as cur:
                    cur.execute("DELETE FROM jobs WHERE id = %s;", (job_id,))
                    
            logger.debug(f"Deleted job from database: {job_id}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to delete job {job_id}: {e}")
            return False
    
    def clear_all_jobs(self) -> bool:
        if not self.is_configured:
            return False
        
        try:
            with self.get_connection() as conn:
                with conn.cursor() as cur:
                    cur.execute("TRUNCATE TABLE jobs;")
                    
            logger.info("Cleared all jobs from database")
            return True
            
        except Exception as e:
            logger.error(f"Failed to clear jobs: {e}")
            return False
    
    def get_job_count(self) -> int:
        if not self.is_configured:
            return 0
        
        try:
            with self.get_connection() as conn:
                with conn.cursor() as cur:
                    cur.execute("SELECT COUNT(*) FROM jobs;")
                    return cur.fetchone()[0]
        except Exception as e:
            logger.error(f"Failed to get job count: {e}")
            return 0
    
    def search_similar_jobs(
        self,
        query_embedding: List[float],
        status_filter: Optional[str] = "active",
        job_type_filter: Optional[str] = None,
        limit: int = 50
    ) -> List[Dict[str, Any]]:
        if not self.is_configured:
            return []
        
        try:
            with self.get_connection() as conn:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    # Build query with filters
                    query = """
                        SELECT 
                            id, title, description, type, location,
                            skills_required, requirements, eligible_departments,
                            additional_info, status,
                            1 - (embedding <=> %s::vector) as similarity
                        FROM jobs
                        WHERE 1=1
                    """
                    params = [query_embedding]
                    
                    if status_filter:
                        query += " AND LOWER(status) = LOWER(%s)"
                        params.append(status_filter)
                    
                    if job_type_filter:
                        query += " AND LOWER(type) = LOWER(%s)"
                        params.append(job_type_filter)
                    
                    query += " ORDER BY embedding <=> %s::vector LIMIT %s"
                    params.extend([query_embedding, limit])
                    
                    cur.execute(query, params)
                    rows = cur.fetchall()
            
            jobs_data = []
            for row in rows:
                jobs_data.append({
                    'id': row['id'],
                    'title': row['title'],
                    'description': row['description'],
                    'type': row['type'],
                    'location': row['location'],
                    'skillsRequired': row['skills_required'] or [],
                    'requirements': row['requirements'] or [],
                    'eligibleDepartments': row['eligible_departments'] or [],
                    'additionalInfo': row['additional_info'],
                    'status': row['status'],
                    'similarity': float(row['similarity']) if row['similarity'] else 0.0
                })
            
            return jobs_data
            
        except Exception as e:
            logger.error(f"Failed to search similar jobs: {e}")
            return []
    
    def get_active_job_count(self) -> int:
        if not self.is_configured:
            return 0
        
        try:
            with self.get_connection() as conn:
                with conn.cursor() as cur:
                    cur.execute("SELECT COUNT(*) FROM jobs WHERE LOWER(status) = 'active';")
                    return cur.fetchone()[0]
        except Exception as e:
            logger.error(f"Failed to get active job count: {e}")
            return 0


# Singleton instance
_db_instance: Optional[DatabaseManager] = None


def get_database() -> DatabaseManager:
    global _db_instance
    if _db_instance is None:
        _db_instance = DatabaseManager()
    return _db_instance
