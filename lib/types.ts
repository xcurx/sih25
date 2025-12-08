export interface StudentResume {
  id: string
  name: string
  resumeUrl: string
  uploadedAt: string
}

export interface Student {
  id: string
  name: string
  email: string
  phone: string
  branch: string
  batch: number
  cgpa: number
  avatar?: string
  skills: string[]
  projects: Project[]
  certifications: Certification[]
  preferences: JobPreferences
  applications: Application[]
  resumes?: StudentResume[]
}

export interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  startDate: string
  endDate?: string
}

export interface Certification {
  id: string
  name: string
  issuer: string
  issueDate: string
  expiryDate?: string
  credentialUrl?: string
}

export interface JobPreferences {
  jobTypes: string[]
  locations: string[]
  salaryRange: {
    min: number
    max: number
  }
  industries: string[]
}

export interface Company {
  id: string
  name: string
  description: string
  website?: string
  industry?: string
  type?: string
  location?: string
  employees?: Employer[]
}

export interface Employer {
  id: string
  email: string
  name: string
  postition?: string
  linkedin?: string
  avatar?: string
  companyId: string
  companyRel?: Company
}

export interface Opportunity {
  id: string
  title: string
  description: string
  type: string
  location: string
  status: "active" | "closed" | "draft"
  salary: number
  postedAt: string
  applicationDeadline: string
  cgpa?: number | null
  requirements: string[]
  eligibleDepartments: string[]
  skillsRequired: string[]
  additionalInfo?: string
  employerId: string
  companyId: string
  _count: {
    applications: number
  }
  startDate: string
  endDate: string
  applied?: boolean
  companyRel?: Company
}

export interface Application {
  id: string
  opportunityId: string
  studentId: string
  status: "applied" | "reviewed" | "shortlisted" | "rejected" | "accepted" | "mentor_approval_needed"
  appliedAt: string
  coverLetter?: string
  resumeId?: string
  resumeRel?: StudentResume
  opportunityRel: Opportunity
  mentorApproved?: boolean
}

export type ApplicationStatus = "mentor_approval_needed" | "applied" | "reviewed" | "shortlisted" | "interviewed" | "rejected" | "accepted"

export interface StudentApplication {
  id: string
  opportunityId: string
  studentId: string
  status: "applied" | "under_review" | "shortlisted" | "rejected" | "accepted"
  appliedAt: string
  coverLetter?: string
  studentRel: Omit<Student, "applications" | "preferences" | "projects" | "certifications" | "skills" | "resumes" | "avatar">
}
export interface Interview {
  id: string
  applicationId: string
  scheduledAt: string
  interviewLink: string
  status: InterviewStatus
  interviewDetails?: string
  remark?: string
}

export interface InterviewApplication extends Application {
  interviewRel?: Interview
}

export type InterviewStatus = "scheduled" | "completed" | "canceled" | "rejected" | "accepted"
export interface Faculty {
  id: string
  name: string
  email: string
  department: string
  avatar?: string
}

export interface ApprovalApplication extends Application {
  studentRel?: {
    id: string
    name: string
    email: string
    phone: string
    branch: string
    batch: number
    cgpa: number
    avatar?: string
    skills: string[]
  }
}

export interface Internship {
  id: string
  applicationId: string
  opportunityId: string
  studentId: string
  startDate: string
  endDate: string
  salary?: string | null
  performanceReview?: string | null
  employerRemarks?: string | null
  studentRel: InternshipStudent
  opportunityRel: InternshipOpportunity
  applicationRel?: { id: string }
  certificateRel?: InternshipCertificate | null
}

export interface InternshipCertificate {
  id: string
  title: string
  issuer: string
  issueDate: string
  certificateUrl: string
}

export interface InternshipStudent {
  id: string
  name: string
  email: string
  phone?: string | null
  branch?: string | null
  batch?: number | null
  cgpa?: number | null
}

export interface InternshipOpportunity {
  id: string
  title: string
  type: string
  location: string
  salary?: string | null
  startDate: string
  endDate: string
  companyRel: InternshipCompany
}

export interface InternshipCompany {
  id: string
  name: string
  location?: string | null
  industry?: string | null
}

export interface StudentProfileProject {
  id: string
  title: string
  description: string
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  startDate: string
  endDate?: string
}

export interface StudentProfileCertificate {
  id: string
  title: string
  issuer: string
  issueDate: string
  certificateUrl?: string
}

export interface StudentProfileApplication {
  id: string
  status: string
  appliedAt: string
  opportunityRel: {
    id: string
    title: string
    type: string
    companyRel?: {
      name: string
    }
  }
  interviewRel?: {
    id: string
    status: string
    scheduledAt: string
  }
}

export interface StudentProfileInternship {
  id: string
  startDate: string
  endDate: string
  salary?: string
  performanceReview?: string
  opportunityRel: {
    title: string
    companyRel?: {
      name: string
    }
  }
  certificateRel?: {
    id: string
    title: string
    certificateUrl: string
  }
}

export interface StudentProfile {
  id: string
  name: string
  email: string
  phone?: string
  branch?: string
  batch?: number
  cgpa?: number
  skills: string[]
  github?: string
  linkedin?: string
  applications: StudentProfileApplication[]
  internships: StudentProfileInternship[]
  projects: StudentProfileProject[]
  certificates: StudentProfileCertificate[]
  resumes?: StudentResume[]
}

export interface StudentProfileStats {
  totalApplications: number
  accepted: number
  rejected: number
  pending: number
  interviews: number
  internships: number
}

export interface CompanyEmployee {
  id: string
  name: string
  email: string
  position?: string
  linkedin?: string
  avatar?: string
}

export interface CompanyApplication {
  id: string
  status: string
  appliedAt: string
  studentRel: {
    id: string
    name: string
    email: string
    branch?: string
    batch?: number
    cgpa?: number
  }
}

export interface CompanyOpportunity {
  id: string
  title: string
  description: string
  type: string
  location: string
  status: string
  salary: number
  postedAt: string
  applicationDeadline: string
  applications: CompanyApplication[]
}

export interface CompanyProfile {
  id: string
  name: string
  description?: string
  website?: string
  industry?: string
  location?: string
  employees: CompanyEmployee[]
  opportunities: CompanyOpportunity[]
}

export interface CompanyProfileStats {
  totalOpportunities: number
  activeOpportunities: number
  totalApplications: number
  acceptedApplications: number
  pendingApplications: number
  recruiters: number
}

export interface OpportunityDetail {
  id: string
  title: string
  description: string
  type: string
  location: string
  status: string
  salary: number
  postedAt: string
  applicationDeadline: string
  cgpa?: number | null
  requirements: string[]
  eligibleDepartments: string[]
  skillsRequired: string[]
  additionalInfo?: string
  startDate: string
  endDate: string
  applied?: boolean
  userApplication?: {
    id: string
    status: string
    appliedAt: string
    resume?: StudentResume
  }
  companyRel?: {
    id: string
    name: string
    description?: string
    website?: string
    industry?: string
    location?: string
  }
  employerRel?: {
    id: string
    name: string
    position?: string
    email: string
    linkedin?: string
  }
  _count?: {
    applications: number
  }
}

export interface ApplicationDetail {
  id: string
  opportunityId: string
  studentId: string
  status: string
  appliedAt: string
  coverLetter?: string
  resumeId?: string
  resumeRel?: StudentResume
  mentorApproved?: boolean
  opportunityRel: {
    id: string
    title: string
    description: string
    type: string
    location: string
    salary: number
    postedAt: string
    applicationDeadline: string
    requirements: string[]
    eligibleDepartments: string[]
    skillsRequired: string[]
    additionalInfo?: string
    startDate: string
    endDate: string
    companyRel?: {
      id: string
      name: string
      description?: string
      website?: string
      industry?: string
      location?: string
    }
    employerRel?: {
      id: string
      name: string
      position?: string
      email: string
      linkedin?: string
    }
  }
  interviewRel?: {
    id: string
    scheduledAt: string
    interviewLink?: string
    status: string
    interviewDetails?: string
    remark?: string
  }
  internshipRel?: {
    id: string
    startDate: string
    endDate: string
    salary?: string
    performanceReview?: string
    certificateRel?: {
      id: string
      title: string
      issuer: string
      issueDate: string
      certificateUrl: string
    }
  }
}

// Feedback types
export interface Feedback {
  id: string
  internshipId: string
  studentId: string
  feedbackText: string
  description: string
  createdAt: string
  studentRel?: {
    id: string
    name: string
    email: string
    branch?: string | null
    batch?: number | null
  }
  internshipRel?: {
    id: string
    startDate: string
    endDate: string
    opportunityRel?: {
      id: string
      title: string
      companyRel?: {
        id: string
        name: string
      }
    }
  }
}

export interface CompanyFeedback extends Feedback {
  internshipRel: {
    id: string
    startDate: string
    endDate: string
    studentRel?: {
      id: string
      name: string
      email: string
      branch?: string | null
      batch?: number | null
    }
    opportunityRel: {
      id: string
      title: string
      type: string
    }
  }
}
