"""
Script to seed the recommendation engine with sample data.

Usage:
    python seed_data.py
"""

import requests
import sys
from utils.sample_data import get_sample_jobs


def seed_data(base_url: str = "http://localhost:8000"):
    """
    Seed the recommendation engine with sample jobs.
    
    Args:
        base_url: Base URL of the recommendation engine API
    """
    jobs = get_sample_jobs()
    
    print(f"Seeding {len(jobs)} jobs to {base_url}")
    
    # Check health first
    try:
        health = requests.get(f"{base_url}/api/health")
        health_data = health.json()
        print(f"Engine status: {health_data['status']}")
        print(f"Model loaded: {health_data['model_loaded']}")
        
        if not health_data['model_loaded']:
            print("Error: Model not loaded. Please wait for the engine to start.")
            sys.exit(1)
    except requests.exceptions.ConnectionError:
        print(f"Error: Cannot connect to {base_url}")
        print("Make sure the recommendation engine is running.")
        sys.exit(1)
    
    # Convert jobs to dict format
    jobs_data = [job.model_dump() for job in jobs]
    
    # Bulk add jobs
    response = requests.post(
        f"{base_url}/api/jobs/bulk",
        json=jobs_data
    )
    
    if response.status_code == 200:
        result = response.json()
        print(f"Successfully added {result['added_count']} jobs")
    else:
        print(f"Error adding jobs: {response.text}")
        sys.exit(1)
    
    # Check final health
    health = requests.get(f"{base_url}/api/health")
    health_data = health.json()
    print(f"\nFinal stats:")
    print(f"  Total jobs: {health_data['total_jobs']}")
    print(f"  Active jobs: {health_data['active_jobs']}")


if __name__ == "__main__":
    base_url = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8000"
    seed_data(base_url)
