"use client"

import EmployerCard from "@/components/employer/EmployerCard"
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
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"

// Extended company information (Logic/Data kept untouched)
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

// --- START: NEW LIST CARD COMPONENT ---
interface CustomEmployerCardProps {
    company: Company;
    onViewDetails: (company: Company) => void;
    // Assuming you'd pass industry/rating info for consistent look
    companyInfo: typeof companyDetails[keyof typeof companyDetails] | undefined;
}

const CustomEmployerCard = ({ company, onViewDetails, companyInfo }: CustomEmployerCardProps) => {
    // Fallback data for required fields
    const contactPerson = company.employees?.[0]?.name || "N/A";
    const contactEmail = company.employees?.[0]?.email || "contact@email.com";
    const companyLocation = companyInfo?.location || "N/A";
    const industry = companyInfo?.industry || "Software";
    const rating = companyInfo?.rating || 4.0;
    
    // Placeholder for last interaction (not available in Company type, using a static value)
    const lastInteraction = "2 days ago"; 

    return (
        <Card className="border-slate-200 bg-white shadow-sm rounded-2xl transition hover:shadow-md hover:border-sky-200">
            <CardContent className="p-5 space-y-4">
                {/* Header Section */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        {/* Placeholder for Logo/Icon */}
                        <div className="p-3 bg-sky-50 rounded-lg text-sky-600">
                            <Building2 className="h-6 w-6" />
                        </div>
                        <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                                <h3 className="text-base font-semibold text-slate-900">{company.name}</h3>
                                {/* Rating Star */}
                                <span className="flex items-center text-xs text-amber-500 font-medium">
                                    <Star className="h-3.5 w-3.5 fill-amber-500 mr-1" />
                                    {rating.toFixed(1)}
                                </span>
                            </div>
                            <p className="text-sm text-slate-600">Contact: {contactPerson}</p>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
                                <span className="flex items-center gap-1">
                                    <Mail className="h-3.5 w-3.5" />
                                    {contactEmail}
                                </span>
                                <span className="flex items-center gap-1">
                                    <MapPin className="h-3.5 w-3.5" />
                                    {companyLocation}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Industry Badge */}
                    <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 rounded-full font-medium text-xs">
                        {industry}
                    </Badge>
                </div>
                
                <hr className="border-slate-100" />

                {/* Footer Section: Last Interaction and Actions */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center text-xs text-slate-500">
                        <Clock className="h-3.5 w-3.5 mr-2" />
                        Last interaction: {lastInteraction}
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="rounded-full text-slate-600 hover:bg-slate-100 text-xs">
                            Contact
                        </Button>
                        <Button size="sm" onClick={() => onViewDetails(company)} className="rounded-full bg-sky-600 hover:bg-sky-700 text-white text-xs">
                            <Eye className="h-3.5 w-3.5 mr-1.5" />
                            View Details
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
// --- END: NEW LIST CARD COMPONENT ---


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

  // Data helpers (kept logic untouched)
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
      
      {/* Hero Section with Stats - matching employer dashboard style */}
      <section className="relative overflow-hidden rounded-[32px] border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-blue-50 p-8 shadow space-y-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.08),transparent_55%)]" />
        <div className="relative space-y-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Employer Management</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Partner Companies</h1>
            <p className="mt-2 text-sm text-slate-600">
              Manage company partnerships and employer relationships.
            </p>
          </div>
          <div className="flex justify-end pt-4">
            <Button className="bg-sky-600 hover:bg-sky-700 rounded-full shadow-sm transition">
              <Plus className="mr-2 h-4 w-4" />
              Add New Employer
            </Button>
          </div>
        </div>

        {/* Stats Cards inside gradient */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Partner Companies */}
          <Card className="border-slate-200 bg-white/90 shadow-sm rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Partner Companies</CardTitle>
              <div className="rounded-full p-2 bg-sky-50 text-sky-600">
                <Building2 className="h-4 w-4" aria-hidden="true" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-slate-900">{totalCompanies}</div>
              <p className="text-xs text-slate-500">Active partnerships</p>
            </CardContent>
          </Card>

          {/* Active Jobs */}
          <Card className="border-slate-200 bg-white/90 shadow-sm rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Active Jobs</CardTitle>
              <div className="rounded-full p-2 bg-emerald-50 text-emerald-600">
                <Briefcase className="h-4 w-4" aria-hidden="true" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-slate-900">{totalActiveJobs}</div>
              <p className="text-xs text-slate-500">Currently open positions</p>
            </CardContent>
          </Card>

          {/* Total Hires */}
          <Card className="border-slate-200 bg-white/90 shadow-sm rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Total Hires</CardTitle>
              <div className="rounded-full p-2 bg-sky-50 text-sky-600">
                <Users className="h-4 w-4" aria-hidden="true" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-slate-900">{totalHires}</div>
              <p className="text-xs text-slate-500">This academic year</p>
            </CardContent>
          </Card>

          {/* Avg. Package */}
          <Card className="border-slate-200 bg-white/90 shadow-sm rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Avg. Package</CardTitle>
              <div className="rounded-full p-2 bg-amber-50 text-amber-600">
                <DollarSign className="h-4 w-4" aria-hidden="true" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-slate-900">₹6.2L</div>
              <p className="text-xs text-slate-500">Average offered CTC</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Search and Filter */}
      <Card className="shadow-sm border-slate-200 rounded-2xl bg-white">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search employers by name or contact..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 border-slate-200 focus:border-sky-500 rounded-lg transition"
              />
            </div>
            <Select value={industryFilter} onValueChange={setIndustryFilter}>
              <SelectTrigger className="w-full md:w-48 h-10 border-slate-200 focus:ring-sky-500 rounded-lg">
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

      {/* Employer Cards - Using Custom List Structure */}
      <div className="grid gap-4">
        {filteredEmployers.map((company) => (
          <CustomEmployerCard
            key={company.id}
            company={company}
            // Passing the mock data to simulate the required fields for the new card design
            companyInfo={companyDetails[company.name as keyof typeof companyDetails]}
            onViewDetails={setSelectedEmployer}
          />
        ))}
        {/* Fallback for no results */}
        {filteredEmployers.length === 0 && (
          <div className="text-center py-10 border border-slate-200 rounded-2xl bg-slate-50">
            <Building2 className="h-8 w-8 text-slate-400 mx-auto mb-3" />
            <p className="text-lg font-medium text-slate-600">No companies found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Employer Details Dialog */}
      <EmployerDetailsDialog
        company={selectedEmployer}
        // companyInfo={selectedEmployer ? companyDetails[selectedEmployer.name as keyof typeof companyDetails] : null}
        onClose={() => setSelectedEmployer(null)}
      />
    </div>
  )
}