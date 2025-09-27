"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/contexts/auth-context"
import { mockEmployers } from "@/lib/mock-data"
import {
  Search,
  Plus,
  Building2,
  Mail,
  MapPin,
  Users,
  Briefcase,
  Calendar,
  Star,
  Eye,
  MessageSquare,
} from "lucide-react"

// Extended mock data for employers
const extendedEmployers = [
  ...mockEmployers,
  {
    id: "2",
    name: "Sarah Chen",
    email: "sarah.chen@datatech.com",
    company: "DataTech Solutions",
    avatar: "/employer-meeting.png",
  },
  {
    id: "3",
    name: "David Rodriguez",
    email: "david@startupxyz.com",
    company: "StartupXYZ",
    avatar: "/employer-meeting.png",
  },
  {
    id: "4",
    name: "Emily Watson",
    email: "emily.watson@megacorp.com",
    company: "MegaCorp Ltd.",
    avatar: "/employer-meeting.png",
  },
]

// Extended company information
const companyDetails = {
  "TechCorp Inc.": {
    industry: "Technology",
    size: "1000-5000",
    location: "Bangalore",
    website: "https://techcorp.com",
    description: "Leading technology company specializing in software development and cloud solutions.",
    activeJobs: 5,
    totalHires: 25,
    avgSalary: 650000,
    rating: 4.5,
    established: "2010",
  },
  "DataTech Solutions": {
    industry: "Data Analytics",
    size: "500-1000",
    location: "Mumbai",
    website: "https://datatech.com",
    description: "Data analytics and business intelligence solutions provider.",
    activeJobs: 3,
    totalHires: 18,
    avgSalary: 580000,
    rating: 4.2,
    established: "2015",
  },
  StartupXYZ: {
    industry: "Fintech",
    size: "50-200",
    location: "Remote",
    website: "https://startupxyz.com",
    description: "Innovative fintech startup revolutionizing digital payments.",
    activeJobs: 4,
    totalHires: 15,
    avgSalary: 720000,
    rating: 4.7,
    established: "2020",
  },
  "MegaCorp Ltd.": {
    industry: "Enterprise Software",
    size: "5000+",
    location: "Delhi",
    website: "https://megacorp.com",
    description: "Global enterprise software solutions and consulting services.",
    activeJobs: 6,
    totalHires: 22,
    avgSalary: 540000,
    rating: 4.0,
    established: "1995",
  },
}

export default function EmployersPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [industryFilter, setIndustryFilter] = useState("all")
  const [selectedEmployer, setSelectedEmployer] = useState<(typeof extendedEmployers)[0] | null>(null)

  if (user?.role !== "placement_cell") {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
          <p className="text-muted-foreground">This page is only accessible to placement cell.</p>
        </div>
      </div>
    )
  }

  const filteredEmployers = extendedEmployers.filter((employer) => {
    const company = companyDetails[employer.company as keyof typeof companyDetails]
    const matchesSearch =
      employer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employer.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesIndustry = industryFilter === "all" || (company && company.industry === industryFilter)

    return matchesSearch && matchesIndustry
  })

  const industries = Array.from(new Set(Object.values(companyDetails).map((c) => c.industry)))
  const totalCompanies = Object.keys(companyDetails).length
  const totalActiveJobs = Object.values(companyDetails).reduce((sum, company) => sum + company.activeJobs, 0)
  const totalHires = Object.values(companyDetails).reduce((sum, company) => sum + company.totalHires, 0)

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">Employer Management</h1>
          <p className="text-muted-foreground">Manage company partnerships and employer relationships</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New Employer
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Partner Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCompanies}</div>
            <p className="text-xs text-muted-foreground">Active partnerships</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalActiveJobs}</div>
            <p className="text-xs text-muted-foreground">Currently hiring</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hires</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHires}</div>
            <p className="text-xs text-muted-foreground">This academic year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Package</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹6.2L</div>
            <p className="text-xs text-muted-foreground">Average offered</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employers or companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={industryFilter} onValueChange={setIndustryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Industries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Employer Cards */}
      <div className="grid gap-6">
        {filteredEmployers.map((employer) => (
          <EmployerCard
            key={employer.id}
            employer={employer}
            companyInfo={companyDetails[employer.company as keyof typeof companyDetails]}
            onViewDetails={setSelectedEmployer}
          />
        ))}
      </div>

      {/* Employer Details Dialog */}
      <EmployerDetailsDialog
        employer={selectedEmployer}
        companyInfo={selectedEmployer ? companyDetails[selectedEmployer.company as keyof typeof companyDetails] : null}
        onClose={() => setSelectedEmployer(null)}
      />
    </div>
  )
}

function EmployerCard({
  employer,
  companyInfo,
  onViewDetails,
}: {
  employer: (typeof extendedEmployers)[0]
  companyInfo: any
  onViewDetails: (employer: (typeof extendedEmployers)[0]) => void
}) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <CardTitle className="text-xl">{employer.company}</CardTitle>
                {companyInfo && (
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-current text-yellow-500" />
                    <span className="text-sm font-medium">{companyInfo.rating}</span>
                  </div>
                )}
              </div>
              <CardDescription className="text-base font-medium">Contact: {employer.name}</CardDescription>
              <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Mail className="h-4 w-4" />
                  <span>{employer.email}</span>
                </div>
                {companyInfo && (
                  <>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{companyInfo.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{companyInfo.size} employees</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <Badge variant="secondary">{companyInfo?.industry}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {companyInfo && (
          <>
            <p className="text-muted-foreground line-clamp-2">{companyInfo.description}</p>

            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-lg font-bold">{companyInfo.activeJobs}</div>
                <div className="text-xs text-muted-foreground">Active Jobs</div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-lg font-bold">{companyInfo.totalHires}</div>
                <div className="text-xs text-muted-foreground">Total Hires</div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-lg font-bold">₹{(companyInfo.avgSalary / 100000).toFixed(1)}L</div>
                <div className="text-xs text-muted-foreground">Avg. Package</div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-lg font-bold">
                  {new Date().getFullYear() - Number.parseInt(companyInfo.established)}
                </div>
                <div className="text-xs text-muted-foreground">Years Old</div>
              </div>
            </div>
          </>
        )}

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Last interaction: 2 days ago</span>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <MessageSquare className="mr-2 h-4 w-4" />
              Contact
            </Button>
            <Button size="sm" onClick={() => onViewDetails(employer)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function EmployerDetailsDialog({
  employer,
  companyInfo,
  onClose,
}: {
  employer: (typeof extendedEmployers)[0] | null
  companyInfo: any
  onClose: () => void
}) {
  if (!employer || !companyInfo) return null

  return (
    <Dialog open={!!employer} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Building2 className="h-5 w-5" />
            <span>{employer.company}</span>
          </DialogTitle>
          <DialogDescription>
            {companyInfo.industry} • {companyInfo.size} employees • Est. {companyInfo.established}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Company Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Company Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{companyInfo.description}</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Website</label>
                  <p className="text-primary hover:underline cursor-pointer">{companyInfo.website}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Location</label>
                  <p>{companyInfo.location}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Company Size</label>
                  <p>{companyInfo.size} employees</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Rating</label>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-current text-yellow-500" />
                    <span>{companyInfo.rating}/5.0</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Primary Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={employer.avatar || "/placeholder.svg"} alt={employer.name} />
                  <AvatarFallback className="text-lg">
                    {employer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{employer.name}</h3>
                  <p className="text-muted-foreground">HR Representative</p>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <p>{employer.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Company</label>
                      <p>{employer.company}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recruitment Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Recruitment Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">{companyInfo.activeJobs}</div>
                  <div className="text-sm text-muted-foreground">Active Job Postings</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-secondary">{companyInfo.totalHires}</div>
                  <div className="text-sm text-muted-foreground">Students Hired</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-accent">₹{(companyInfo.avgSalary / 100000).toFixed(1)}L</div>
                  <div className="text-sm text-muted-foreground">Average Package</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{companyInfo.rating}</div>
                  <div className="text-sm text-muted-foreground">Company Rating</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="p-1 bg-green-100 rounded-full">
                  <Briefcase className="h-3 w-3 text-green-600" />
                </div>
                <div className="flex-1 text-sm">
                  <p className="font-medium">Posted new job: Senior Software Engineer</p>
                  <p className="text-muted-foreground">2 days ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-1 bg-blue-100 rounded-full">
                  <Users className="h-3 w-3 text-blue-600" />
                </div>
                <div className="flex-1 text-sm">
                  <p className="font-medium">Interviewed 5 candidates</p>
                  <p className="text-muted-foreground">1 week ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-1 bg-yellow-100 rounded-full">
                  <Star className="h-3 w-3 text-yellow-600" />
                </div>
                <div className="flex-1 text-sm">
                  <p className="font-medium">Selected 3 students for internship</p>
                  <p className="text-muted-foreground">2 weeks ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
