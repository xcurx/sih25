"""
Test script to verify the recommendation engine is working correctly.

Usage:
    python test_engine.py
"""

import requests
import json


def test_recommendations(base_url: str = "http://localhost:8000"):
    """
    Test the recommendation engine with sample queries.
    """
    print("=" * 60)
    print("Testing Recommendation Engine")
    print("=" * 60)
    
    # Test 1: CS student looking for internships
    print("\n--- Test 1: CS Student (Batch 2027) looking for internships ---")
    request_data = {
        "department": "Computer Science",
        "batch": "2027",
        "skills": ["Python", "JavaScript", "React", "Machine Learning"],
        "k": 5,
        "job_type": "internship"
    }
    
    response = requests.post(
        f"{base_url}/api/recommendations",
        json=request_data
    )
    
    if response.status_code == 200:
        result = response.json()
        print(f"Found {len(result['recommendations'])} recommendations")
        for i, rec in enumerate(result['recommendations'], 1):
            print(f"\n{i}. Job ID: {rec['job_id']}")
            print(f"   Composite Score: {rec['composite_score']:.4f}")
            print(f"   Vector Similarity: {rec['s_vec']:.4f}")
            print(f"   Skill Match: {rec['s_skill']:.4f}")
            print(f"   Type: {rec['job_type']}")
            print(f"   Location: {rec['location']}")
            if rec['highlights']['skills']:
                print(f"   Matching Skills: {', '.join(rec['highlights']['skills'])}")
    else:
        print(f"Error: {response.text}")
    
    # Test 2: Data Science student looking for full-time
    print("\n--- Test 2: Data Science Student (Batch 2025) looking for full-time ---")
    request_data = {
        "department": "Data Science",
        "batch": "2025",
        "skills": ["Python", "TensorFlow", "PyTorch", "Deep Learning", "SQL"],
        "k": 5,
        "job_type": "full-time"
    }
    
    response = requests.post(
        f"{base_url}/api/recommendations",
        json=request_data
    )
    
    if response.status_code == 200:
        result = response.json()
        print(f"Found {len(result['recommendations'])} recommendations")
        for i, rec in enumerate(result['recommendations'], 1):
            print(f"\n{i}. Job ID: {rec['job_id']}")
            print(f"   Composite Score: {rec['composite_score']:.4f}")
            print(f"   Type: {rec['job_type']}")
            print(f"   Location: {rec['location']}")
            if rec['highlights']['skills']:
                print(f"   Matching Skills: {', '.join(rec['highlights']['skills'])}")
    else:
        print(f"Error: {response.text}")
    
    # Test 3: All job types for IT student
    print("\n--- Test 3: IT Student (Batch 2026) - All job types ---")
    request_data = {
        "department": "Information Technology",
        "batch": "2026",
        "skills": ["Java", "Spring Boot", "Docker", "AWS"],
        "k": 5
    }
    
    response = requests.post(
        f"{base_url}/api/recommendations",
        json=request_data
    )
    
    if response.status_code == 200:
        result = response.json()
        print(f"Found {len(result['recommendations'])} recommendations")
        for i, rec in enumerate(result['recommendations'], 1):
            print(f"\n{i}. Job ID: {rec['job_id']}")
            print(f"   Composite Score: {rec['composite_score']:.4f}")
            print(f"   Type: {rec['job_type']}")
            if rec['highlights']['skills']:
                print(f"   Matching Skills: {', '.join(rec['highlights']['skills'])}")
    else:
        print(f"Error: {response.text}")
    
    print("\n" + "=" * 60)
    print("Tests completed!")
    print("=" * 60)


if __name__ == "__main__":
    test_recommendations()
