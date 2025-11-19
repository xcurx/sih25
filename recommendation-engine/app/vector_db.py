import faiss
import numpy as np
import pickle

INDEX_PATH = "faiss_index.bin"
META_PATH = "faiss_meta.pkl"

class FaissStore:
    def __init__(self, dim: int):
        self.dim = dim
        self.index = faiss.IndexFlatIP(dim)
        self.metadatas = []

    def add(self, vecs: np.ndarray, metas):
        if vecs.ndim == 1:
            vecs = vecs.reshape(1, -1)
        self.index.add(vecs)
        self.metadatas.extend(metas)

    def search(self, vec: np.ndarray, k=10):
        vec = vec.reshape(1, -1)
        D, I = self.index.search(vec, k)
        result = []
        for dist, idx in zip(D[0], I[0]):
            if idx >= 0 and idx < len(self.metadatas):
                result.append((float(dist), self.metadatas[idx]))
        return result

    def save(self):
        faiss.write_index(self.index, INDEX_PATH)
        with open(META_PATH, "wb") as f:
            pickle.dump(self.metadatas, f)

    @classmethod
    def load(cls):
        try:
            index = faiss.read_index(INDEX_PATH)
            metas = pickle.load(open(META_PATH, "rb"))
            obj = cls(index.d)
            obj.index = index
            obj.metadatas = metas
            return obj
        except:
            return None
