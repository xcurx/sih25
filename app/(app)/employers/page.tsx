"use client"

import EmployerCard from "@/components/emplyer/EmployerCard"
import EmployerDetailsDialog from "@/components/emplyer/EmployerDetailsDialog"
import Loader from "@/components/loader/Loader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Company } from "@/lib/types"
import axios from "axios"
import {
  Briefcase,
  Building2,
  Plus,
  Search,
  Star,
  Users
} from "lucide-react"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

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
  const { data:session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState("")
  const [industryFilter, setIndustryFilter] = useState("all")
  const [selectedEmployer, setSelectedEmployer] = useState<Company | null>(null)
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(false)

  const getCompanies = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/get-companies", { withCredentials: true });
      if (res.status === 200) {
        setCompanies(res.data.companies);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredEmployers = companies.filter((comp) => {
    const matchesSearch =
      comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (comp.employees && comp.employees[0].name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (comp.employees && comp.employees[0].email.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesIndustry = industryFilter === "all" || (comp.industry === industryFilter)

    return matchesSearch && matchesIndustry
  })

  const industries = Array.from(new Set(Object.values(companyDetails).map((c) => c.industry)))
  const totalCompanies = Object.keys(companyDetails).length
  const totalActiveJobs = Object.values(companyDetails).reduce((sum, company) => sum + company.activeJobs, 0)
  const totalHires = Object.values(companyDetails).reduce((sum, company) => sum + company.totalHires, 0)

  useEffect(() => {
    if (status === "unauthenticated" || status === "loading") return;
    getCompanies();
  }, [status])

  if (status === "loading" || status === "unauthenticated" || loading) {
    return <Loader/>
  }

  if (session?.user?.role !== "placement-cell") {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
          <p className="text-muted-foreground">This page is only accessible to placement cell.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl w-full mx-auto">
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
        {filteredEmployers.map((company) => (
          <EmployerCard
            key={company.id}
            company={company}
            // companyInfo={companyDetails[employer.company as keyof typeof companyDetails]}
            onViewDetails={setSelectedEmployer}
          />
        ))}
      </div>

      {/* Employer Details Dialog */}
      <EmployerDetailsDialog
        company={selectedEmployer}
        // companyInfo={selectedEmployer ? companyDetails[selectedEmployer.company as keyof typeof companyDetails] : null}
        onClose={() => setSelectedEmployer(null)}
      />
    </div>
  )
}