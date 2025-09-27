export interface Student {
  id: string
  name: string
  email: string
  phone: string
  department: string
  year: number
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

export interface Job {
  id: string
  title: string
  company: string
  description: string
  requirements: string[]
  location: string
  type: "internship" | "full-time"
  salary: {
    min: number
    max: number
  }
  deadline: string
  postedDate: string
  department: string[]
  skills: string[]
  status: "active" | "closed" | "draft"
}

export interface Application {
  id: string
  jobId: string
  studentId: string
  status: "pending" | "approved" | "rejected" | "interview" | "selected"
  appliedDate: string
  coverLetter?: string
  facultyApproval?: {
    approved: boolean
    facultyId: string
    comments?: string
    date: string
  }
  interviews: Interview[]
}

export interface Interview {
  id: string
  applicationId: string
  date: string
  time: string
  type: "online" | "offline"
  location?: string
  meetingLink?: string
  status: "scheduled" | "completed" | "cancelled"
  feedback?: string
}

export interface Faculty {
  id: string
  name: string
  email: string
  department: string
  avatar?: string
}

export interface Employer {
  id: string
  name: string
  email: string
  company: string
  avatar?: string
}
