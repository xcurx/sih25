export interface Student {
  id: string
  name: string
  email: string
  phone: string
  branch: string
  batch: number
  cgpa: number
  avatar?: string
  resume?: string
  skills: string[]
  projects: Project[]
  certifications: Certification[]
  preferences: JobPreferences
  applications: Application[]
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
  requirements: string[]
  eligibleDepartments: string[]
  skillsRequired: string[]
  additionalInfo?: string
  employerId: string
  companyId: string
  _count: {
    applications: number
  }
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
  studentRel: Omit<Student, "applications" | "preferences" | "projects" | "certifications" | "skills" | "resume" | "avatar">
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
