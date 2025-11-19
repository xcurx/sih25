from app.vector_db import FaissStore

DIM = 384

if __name__ == "__main__":
    # Initialize an empty FAISS index
    # Jobs will be added via the /add_job or /add_jobs endpoints
    store = FaissStore(DIM)
    store.save()
    
    print("Initialized empty FAISS index.")
    print("Use /add_job or /add_jobs endpoints to populate the database.")
