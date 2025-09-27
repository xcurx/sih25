import type { Student, Job, Application, Faculty, Employer } from "./types"

export const mockStudents: Student[] = [
  {
    id: "1",
    name: "John Doe",
    email: "student@college.edu",
    phone: "+1234567890",
    department: "Computer Science",
    year: 3,
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

export const mockJobs: Job[] = [
  {
    id: "1",
    title: "Software Development Intern",
    company: "TechCorp Inc.",
    description:
      "Join our dynamic team as a software development intern. Work on cutting-edge projects using modern technologies.",
    requirements: ["React", "Node.js", "JavaScript", "Git"],
    location: "Bangalore",
    type: "internship",
    salary: { min: 25000, max: 35000 },
    deadline: "2024-12-31",
    postedDate: "2024-11-01",
    department: ["Computer Science", "Information Technology"],
    skills: ["React", "Node.js", "JavaScript"],
    status: "active",
  },
  {
    id: "2",
    title: "Data Science Intern",
    company: "DataTech Solutions",
    description: "Work with our data science team to build predictive models and analyze large datasets.",
    requirements: ["Python", "Machine Learning", "SQL", "Statistics"],
    location: "Mumbai",
    type: "internship",
    salary: { min: 30000, max: 40000 },
    deadline: "2024-12-25",
    postedDate: "2024-10-15",
    department: ["Computer Science", "Mathematics"],
    skills: ["Python", "Machine Learning", "SQL"],
    status: "active",
  },
  {
    id: "3",
    title: "Full Stack Developer",
    company: "StartupXYZ",
    description: "Full-time position for experienced developers to work on our core product.",
    requirements: ["React", "Node.js", "MongoDB", "AWS"],
    location: "Remote",
    type: "full-time",
    salary: { min: 600000, max: 1000000 },
    deadline: "2024-12-20",
    postedDate: "2024-10-20",
    department: ["Computer Science"],
    skills: ["React", "Node.js", "MongoDB"],
    status: "active",
  },
]

export const mockApplications: Application[] = [
  {
    id: "1",
    jobId: "1",
    studentId: "1",
    status: "pending",
    appliedDate: "2024-11-15",
    coverLetter: "I am excited to apply for this internship position...",
    interviews: [],
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
    company: "TechCorp Inc.",
    avatar: "/employer-meeting.png",
  },
]
