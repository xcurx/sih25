def skill_fraction(resume_skills, required_skills):
    if not required_skills:
        return 0.0
    rs = set(s.lower() for s in resume_skills)
    jr = set(s.lower() for s in required_skills)
    return len(rs & jr) / len(jr)

def composite_score(s_vec, s_skill, w_vec=0.5, w_skill=0.35, w_elig=0.15):
    return w_vec*s_vec + w_skill*s_skill + w_elig*1.0
