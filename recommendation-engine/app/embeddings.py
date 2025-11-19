from sentence_transformers import SentenceTransformer
import numpy as np
import gc

# Use smaller, more memory-efficient model for 512MB limit
# Options (smaller to larger):
# - "paraphrase-MiniLM-L3-v2" (61MB, fast, 384 dim) ← Current (best for 512MB)
# - "all-MiniLM-L6-v2" (90MB, best quality but may OOM on free tier, 384 dim)
MODEL_NAME = "paraphrase-MiniLM-L3-v2"  # Best balance for Render free tier
_model = None

def get_model():
    global _model
    if _model is None:
        _model = SentenceTransformer(MODEL_NAME, device='cpu')
    return _model

def embed_text(text: str) -> np.ndarray:
    model = get_model()
    v = model.encode(text, convert_to_numpy=True, show_progress_bar=False)
    norm = np.linalg.norm(v)
    if norm > 0:
        v = v / norm
    
    # Force garbage collection to free memory
    gc.collect()
    
    return v.astype("float32")
