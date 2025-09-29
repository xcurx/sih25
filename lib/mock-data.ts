import type { Student, Application, Faculty, Employer, Opportunity } from "./types"

export const mockStudents: Student[] = [
  {
    id: "1",
    name: "John Doe",
    email: "student@college.edu",
    phone: "+1234567890",
    branch: "Computer Science",
    batch: 3,
    cgpa: 8.5,
    avatar: "/diverse-students-studying.png",
    resume: "/resume-john-doe.pdf",
    skills: ["React", "Node.js", "Python", "Machine Learning", "SQL"],
    projects: [
      {
        id: "1",
        title: "E-commerce Platform",
        description: "Full-stack e-commerce application with React and Node.js",
        technologies: ["React", "Node.js", "MongoDB", "Express"],
        githubUrl: "https://github.com/johndoe/ecommerce",
        liveUrl: "https://ecommerce-demo.com",
        startDate: "2024-01-15",
        endDate: "2024-03-20",
      },
      {
        id: "2",
        title: "ML Prediction Model",
        description: "Machine learning model for stock price prediction",
        technologies: ["Python", "TensorFlow", "Pandas", "NumPy"],
        githubUrl: "https://github.com/johndoe/ml-stocks",
        startDate: "2024-02-01",
        endDate: "2024-04-15",
      },
    ],
    certifications: [
      {
        id: "1",
        name: "AWS Cloud Practitioner",
        issuer: "Amazon Web Services",
        issueDate: "2024-01-10",
        credentialUrl: "https://aws.amazon.com/verification",
      },
    ],
    preferences: {
      jobTypes: ["internship", "full-time"],
      locations: ["Remote", "Bangalore", "Mumbai"],
      salaryRange: { min: 300000, max: 800000 },
      industries: ["Technology", "Fintech", "E-commerce"],
    },
    applications: [],
  },
]

export const mockJobs: Opportunity[] = [
  {
    id: "1",
    title: "Software Development Intern",
    companyId: "TechCorp Inc.",
    description:
      "Join our dynamic team as a software development intern. Work on cutting-edge projects using modern technologies.",
    requirements: ["React", "Node.js", "JavaScript", "Git"],
    location: "Bangalore",
    type: "internship",
    salary: 56745,
    applicationDeadline: "2024-12-31",
    postedAt: "2024-11-01",
    eligibleDepartments: ["Computer Science", "Information Technology"],
    skillsRequired: ["React", "Node.js", "JavaScript"],
    employerId: "1",
    status: "active",
    _count: { applications: 5 },
  },
]

export const mockApplications: Application[] = [
  {
    id: "1",
    opportunityId: "1",
    studentId: "1",
    status: "applied",
    appliedAt: "2024-11-15",
    coverLetter: "I am excited to apply for this internship position...",
    opportunityRel: mockJobs[0],
  },
]

export const mockFaculty: Faculty[] = [
  {
    id: "1",
    name: "Dr. Jane Smith",
    email: "faculty@college.edu",
    department: "Computer Science",
    avatar: "/diverse-professor-lecturing.png",
  },
]

export const mockEmployers: Employer[] = [
  {
    id: "1",
    name: "Mike Johnson",
    email: "hr@techcorp.com",
    companyId: "TechCorp Inc.",
    avatar: "/employer-meeting.png",
  },
]
