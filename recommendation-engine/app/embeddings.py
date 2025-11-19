from sentence_transformers import SentenceTransformer
import numpy as np

MODEL_NAME = "all-MiniLM-L6-v2"
_model = None

def get_model():
    global _model
    if _model is None:
        _model = SentenceTransformer(MODEL_NAME, device='cpu')
    return _model

def embed_text(text: str) -> np.ndarray:
    model = get_model()
    v = model.encode(text, convert_to_numpy=True)
    norm = np.linalg.norm(v)
    if norm > 0:
        v = v / norm
    return v.astype("float32")
