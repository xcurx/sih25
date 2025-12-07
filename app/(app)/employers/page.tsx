"use client"

import EmployerDetailsDialog from "@/components/employer/EmployerDetailsDialog"
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
  ExternalLink,
  Plus,
  Search,
  Star,
  Users,
  DollarSign,
  Mail,
  MapPin,
  Clock,
  Eye,
  MessageSquare
} from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"

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

interface CustomEmployerCardProps {
    company: Company;
    onViewDetails: (company: Company) => void;
    companyInfo: typeof companyDetails[keyof typeof companyDetails] | undefined;
}

const CustomEmployerCard = ({ company, onViewDetails, companyInfo }: CustomEmployerCardProps) => {
    const contactPerson = company.employees?.[0]?.name || "N/A";
    const contactEmail = company.employees?.[0]?.email || "contact@email.com";
    const companyLocation = companyInfo?.location || "N/A";
    const industry = companyInfo?.industry || "Software";
    const rating = companyInfo?.rating || 4.0;
    const lastInteraction = "2 days ago"; 

    return (
        <Card className="border-slate-200 shadow-md rounded-xl transition hover:shadow-lg hover:border-sky-300">
            <CardContent className="p-5 space-y-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-sky-50 rounded-lg text-sky-700">
                            <Building2 className="h-6 w-6" />
                        </div>
                        <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                                <h3 className="text-xl font-bold text-slate-800">{company.name}</h3>
                                <span className="flex items-center text-sm text-amber-500 font-medium">
                                    <Star className="h-4 w-4 fill-amber-500 mr-1" />
                                    {rating.toFixed(1)}
                                </span>
                            </div>
                            <p className="text-sm text-slate-600">Contact: {contactPerson}</p>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 mt-1">
                                <span className="flex items-center gap-1">
                                    <Mail className="h-4 w-4" />
                                    {contactEmail}
                                </span>
                                <span className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {companyLocation}
                                </span>
                                <Users className="h-4 w-4" /> 
                            </div>
                        </div>
                    </div>

                    <Badge variant="secondary" className="bg-slate-100 text-slate-700 rounded-full font-medium">
                        {industry}
                    </Badge>
                </div>
                
                <hr className="border-slate-100" />

                <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-slate-500">
                        <Clock className="h-4 w-4 mr-2" />
                        Last interaction: {lastInteraction}
                    </div>
                    <div className="flex gap-2">
                        <Link href={`/employers/${company.id}/feedbacks`}>
                            <Button variant="outline" size="sm" className="rounded-full text-amber-600 border-amber-300 hover:bg-amber-50">
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Feedbacks
                            </Button>
                        </Link>
                        <Button variant="outline" size="sm" className="rounded-full text-slate-700 border-slate-300 hover:bg-slate-100">
                            Contact
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => onViewDetails(company)} className="rounded-full text-sky-600 border-sky-300 hover:bg-sky-50">
                            <Eye className="h-4 w-4 mr-2" />
                            Quick View
                        </Button>
                        <Link href={`/employers/${company.id}`}>
                            <Button variant="default" size="sm" className="rounded-full bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View Full Profile
                            </Button>
                        </Link>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};


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
      const res = await axios.get("/api/placementcell/get-companies", { withCredentials: true });
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
        <div className="text-center py-12 rounded-xl border-2 border-red-300 bg-red-50">
          <h1 className="text-2xl font-bold text-red-700">Access Denied</h1>
          <p className="text-red-500 mt-2">This page is only accessible to placement cell members.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl w-full mx-auto space-y-8">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Employer Management</h1>
          <p className="text-base text-slate-500 mt-1">Manage company partnerships and employer relationships.</p>
        </div>
        
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <Card className="border-slate-200 bg-white shadow-sm rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Partner Companies</CardTitle>
            <div className={`rounded-full p-2 bg-sky-50 text-sky-700`}>
              <Building2 className="h-4 w-4" aria-hidden="true" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{totalCompanies}</div>
            <p className="text-xs text-slate-500">Active partnerships</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Active Jobs</CardTitle>
            <div className={`rounded-full p-2 bg-emerald-50 text-emerald-700`}>
              <Briefcase className="h-4 w-4" aria-hidden="true" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{totalActiveJobs}</div>
            <p className="text-xs text-slate-500">Currently open positions</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Hires</CardTitle>
            <div className={`rounded-full p-2 bg-indigo-50 text-indigo-700`}>
              <Users className="h-4 w-4" aria-hidden="true" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{totalHires}</div>
            <p className="text-xs text-slate-500">This academic year</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Avg. Package</CardTitle>
            <div className={`rounded-full p-2 bg-amber-50 text-amber-700`}>
              <DollarSign className="h-4 w-4" aria-hidden="true" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">₹6.2L</div>
            <p className="text-xs text-slate-500">Average offered CTC</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg border-slate-100 rounded-xl">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search employers by name or contact..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 border-slate-300 focus:border-sky-500 rounded-lg transition"
              />
            </div>
            <Select value={industryFilter} onValueChange={setIndustryFilter}>
              <SelectTrigger className="w-full md:w-48 h-10 border-slate-300 focus:ring-sky-500 rounded-lg">
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

      <div className="grid gap-6">
        {filteredEmployers.map((company) => (
          <CustomEmployerCard
            key={company.id}
            company={company}
            companyInfo={companyDetails[company.name as keyof typeof companyDetails]}
            onViewDetails={setSelectedEmployer}
          />
        ))}
        {filteredEmployers.length === 0 && (
          <div className="text-center py-10 border border-slate-200 rounded-xl bg-slate-50">
            <Building2 className="h-8 w-8 text-slate-400 mx-auto mb-3" />
            <p className="text-lg font-medium text-slate-600">No companies found matching your criteria.</p>
          </div>
        )}
      </div>

      <EmployerDetailsDialog
        company={selectedEmployer}
        onClose={() => setSelectedEmployer(null)}
      />
    </div>
  )
}