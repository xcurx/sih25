export type UserRole = "student" | "faculty" | "placement_cell" | "employer"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  department?: string
  year?: number
  company?: string
  avatar?: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

// Mock authentication - in real app would connect to backend
export const mockUsers: User[] = [
  {
    id: "1",
    email: "student@college.edu",
    name: "Dipesh Kumar",
    role: "student",
    department: "Computer Science",
    year: 3,
    avatar: "/diverse-students-studying.png",
  },
  {
    id: "2",
    email: "faculty@college.edu",
    name: "Anup Thakre",
    role: "faculty",
    department: "Computer Science",
    avatar: "/diverse-professor-lecturing.png",
  },
  {
    id: "3",
    email: "placement@college.edu",
    name: "Tanishq Devre",
    role: "placement_cell",
    avatar: "/admin-interface.png",
  },
  {
    id: "4",
    email: "hr@techcorp.com",
    name: "Shubh Goel",
    role: "employer",
    company: "TechCorp Inc.",
    avatar: "/employer-meeting.png",
  },
]

export const authenticateUser = async (email: string, password: string): Promise<User | null> => {
  // Mock authentication logic
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return mockUsers.find((user) => user.email === email) || null
}
