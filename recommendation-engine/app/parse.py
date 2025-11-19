import os
import pdfplumber
from docx import Document
from rapidfuzz import fuzz
from typing import List

CANON_SKILLS = [
    "python","java","react","django","flask","sql","aws",
    "machine learning","nlp","pytorch","tensorflow","javascript",
    "docker","git","html","css"
]

def extract_text_from_pdf(path: str) -> str:
    text = []
    with pdfplumber.open(path) as pdf:
        for p in pdf.pages:
            t = p.extract_text()
            if t:
                text.append(t)
    return "\n".join(text)

def extract_text_from_docx(path: str) -> str:
    doc = Document(path)
    lines = [p.text for p in doc.paragraphs if p.text.strip()]
    return "\n".join(lines)

def extract_text(path: str) -> str:
    ext = os.path.splitext(path)[1].lower()
    if ext == ".pdf":
        return extract_text_from_pdf(path)
    elif ext in [".docx", ".doc"]:
        return extract_text_from_docx(path)
    else:
        return open(path, "r", encoding="utf-8", errors="ignore").read()

def normalize_skills(text: str, canon=CANON_SKILLS, threshold=85) -> List[str]:
    t = text.lower()
    found = set()
    for s in canon:
        if s in t or fuzz.partial_ratio(s, t) >= threshold:
            found.add(s)
    return sorted(list(found))

def resume_strength(text: str, skills: List[str]) -> float:
    completeness = 20.0 if skills else 0.0
    depth = min(len(skills), 10) / 10 * 40

    exp_words = ["project","intern","research","experience","built","developed"]
    exp_score = sum([5 for w in exp_words if w in text.lower()])
    exp_score = min(exp_score, 20)

    length_score = min(len(text.split()), 1000) / 1000 * 20

    return round(completeness + depth + exp_score + length_score, 2)
