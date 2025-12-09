"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts"
import { TrendingUp, Award, Download, GraduationCap, Building2, Target, AlertCircle, Users, DollarSign, Zap } from "lucide-react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

const placementData = [
  { month: "Jan", applications: 45, interviews: 28, placements: 18, companies: 12 },
  { month: "Feb", applications: 52, interviews: 35, placements: 22, companies: 15 },
  { month: "Mar", applications: 38, interviews: 25, placements: 16, companies: 10 },
  { month: "Apr", applications: 65, interviews: 42, placements: 28, companies: 18 },
  { month: "May", applications: 78, interviews: 55, placements: 35, companies: 22 },
  { month: "Jun", applications: 92, interviews: 68, placements: 45, companies: 28 },
]

const departmentData = [
  { name: "Computer Science", students: 156, placed: 128, percentage: 82 },
  { name: "Information Technology", students: 134, placed: 105, percentage: 78 },
  { name: "Electronics & Comm.", students: 98, placed: 72, percentage: 73 },
  { name: "Mechanical", students: 112, placed: 78, percentage: 70 },
  { name: "Civil", students: 89, placed: 58, percentage: 65 },
]

const companyData = [
  { name: "TechCorp Inc.", hires: 25, avgSalary: 650000, type: "Technology" },
  { name: "DataTech Solutions", hires: 18, avgSalary: 580000, type: "Analytics" },
  { name: "StartupXYZ", hires: 15, avgSalary: 720000, type: "Startup" },
  { name: "MegaCorp Ltd.", hires: 22, avgSalary: 540000, type: "Enterprise" },
  { name: "InnovateTech", hires: 12, avgSalary: 680000, type: "Technology" },
]

// Updated salaryDistribution to match the new color scheme concept
const salaryDistribution = [
  { range: "3-5 LPA", count: 45, color: "#94b8f2" }, // Previously a darker green/blue
  { range: "5-8 LPA", count: 78, color: "#49cca1" }, // Previously a darker blue - now the main placement color
  { range: "8-12 LPA", count: 52, color: "#f97316" }, // Kept for high contrast/alert (Orange)
  { range: "12+ LPA", count: 28, color: "#fa7f7f" }, // New high salary color (Red/Error like)
]

const skillDemand = [
  { skill: "React", demand: 85, jobs: 24 },
  { skill: "Python", demand: 78, jobs: 32 },
  { skill: "Java", demand: 72, jobs: 28 },
  { skill: "Node.js", demand: 68, jobs: 18 },
  { skill: "Machine Learning", demand: 65, jobs: 15 },
  { skill: "SQL", demand: 82, jobs: 35 },
  { skill: "AWS", demand: 58, jobs: 12 },
  { skill: "Docker", demand: 45, jobs: 8 },
]

// Updated CHART_COLORS based on the requested color scheme
const CHART_COLORS = {
    APPLICATIONS: "#94b8f2", // Light Blue (In Process)
    INTERVIEWS: "#6a97f5",    // Slightly darker blue for contrast
    PLACEMENTS: "#49cca1",   // Teal Green (Placed)
    COMPANIES: "#9ca3af",    // Gray for non-core data
    GRID: "#f1f5f9",
    TEXT: "#64748b",
}

const escapeCsvValue = (value: string | number) => {
  const stringValue = String(value ?? "").replace(/\r?\n/g, " ").trim()
  return /[",\n]/.test(stringValue) ? `"${stringValue.replace(/"/g, '""')}"` : stringValue
}

const buildAnalyticsCsv = () => {
  const lines: string[] = []

  lines.push("Section,Month,Applications,Interviews,Placements,Companies")
  placementData.forEach((entry) => {
    lines.push(
      [
        "Placement Funnel",
        escapeCsvValue(entry.month),
        entry.applications,
        entry.interviews,
        entry.placements,
        entry.companies,
      ].join(","),
    )
  })
  lines.push("")

  lines.push("Section,Department,Total Students,Placed,Placement %")
  departmentData.forEach((dept) => {
    lines.push(
      [
        "Department Performance",
        escapeCsvValue(dept.name),
        dept.students,
        dept.placed,
        `${dept.percentage}%`,
      ].join(","),
    )
  })
  lines.push("")

  lines.push("Section,Company,Type,Hires,Avg Salary (INR)")
  companyData.forEach((company) => {
    lines.push(
      [
        "Top Companies",
        escapeCsvValue(company.name),
        escapeCsvValue(company.type),
        company.hires,
        company.avgSalary,
      ].join(","),
    )
  })
  lines.push("")

  lines.push("Section,Skill,Demand %,Open Roles")
  skillDemand.forEach((skill) => {
    lines.push(
      ["Skill Demand", escapeCsvValue(skill.skill), `${skill.demand}%`, skill.jobs].join(","),
    )
  })
  lines.push("")

  lines.push("Section,Salary Range,Student Count")
  salaryDistribution.forEach((band) => {
    lines.push(["Salary Distribution", escapeCsvValue(band.range), band.count].join(","))
  })

  return lines.join("\n")
}

export default function AnalyticsPage() {
  const { data:session } = useSession();
  const [timeRange, setTimeRange] = useState("6months")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [isExporting, setIsExporting] = useState(false)

  const handleExportReport = () => {
    try {
      setIsExporting(true)
      const csvContent = buildAnalyticsCsv()
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `placement-analytics-${timeRange}-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      toast.success("Analytics report exported")
    } catch (error) {
      console.error("Analytics export failed:", error)
      toast.error("Failed to export analytics report")
    } finally {
      setIsExporting(false)
    }
  }

  if (session?.user?.role !== "placement-cell" && session?.user?.role !== "faculty") {
    return (
      <div className="p-6">
        <div className="text-center py-12 rounded-xl border-2 border-red-300 bg-red-50">
          <h1 className="text-2xl font-bold text-red-700">Access Denied</h1>
          <p className="text-red-500 mt-2">This page is only accessible to placement cell and faculty.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Hero Section with Stats */}
      <section className="relative overflow-hidden rounded-[32px] border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-blue-50 p-8 shadow space-y-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.08),transparent_55%)]" />
        <div className="relative space-y-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Analytics Dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Placement Analytics</h1>
            <p className="mt-2 text-sm text-slate-600">
              Comprehensive placement and recruitment insights
            </p>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40 border-slate-200 rounded-lg h-10 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">Last Month</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={handleExportReport}
              disabled={isExporting}
              className="rounded-full border-sky-600 text-sky-600 hover:bg-sky-50 hover:text-sky-700 disabled:cursor-not-allowed"
            >
              <Download className="mr-2 h-4 w-4" />
              {isExporting ? "Exporting..." : "Export Report"}
            </Button>
          </div>
        </div>

        {/* Key Metrics Cards inside gradient */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Overall Placement Rate", value: "78.5%", caption: "+5.2% from last semester", icon: Target, accent: "bg-sky-50 text-sky-600", trend: true },
            { title: "Total Students", value: "1,247", caption: "Eligible for placement", icon: GraduationCap, accent: "bg-indigo-50 text-indigo-600", trend: false },
            { title: "Partner Companies", value: "89", caption: "+12 new partnerships", icon: Building2, accent: "bg-purple-50 text-purple-600", trend: true },
            { title: "Avg. Package", value: "₹6.8L", caption: "+8.5% from last year", icon: DollarSign, accent: "bg-emerald-50 text-emerald-600", trend: true },
          ].map((stat) => (
            <Card key={stat.title} className="border-slate-200 bg-white/90 shadow-md rounded-xl transition-shadow hover:shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">{stat.title}</CardTitle>
                <div className={`rounded-full p-2 ${stat.accent}`}>
                  <stat.icon className="h-4 w-4" aria-hidden="true" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-slate-900">{stat.value}</div>
                {stat.trend && (
                  <p className="text-xs text-emerald-600 font-medium flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {stat.caption}
                  </p>
                )}
                {!stat.trend && (
                  <p className="text-xs text-slate-500">
                    {stat.caption}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-slate-100 p-1 h-auto rounded-full">
          {["Overview", "Departments", "Companies", "Skills", "Trends"].map((tab) => (
            <TabsTrigger 
              key={tab}
              value={tab.toLowerCase()} 
              className="rounded-full data-[state=active]:bg-sky-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition text-slate-700 hover:text-slate-900"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Placement Funnel - Updated Colors */}
            <Card className="border-slate-200 bg-white shadow-lg rounded-xl">
              <CardHeader className="border-b border-slate-100 pb-4">
                <CardTitle className="text-lg text-slate-900">Placement Funnel</CardTitle>
                <CardDescription className="text-sm">Student journey from application to placement</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={placementData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.GRID} />
                    <XAxis dataKey="month" stroke={CHART_COLORS.TEXT} className="text-xs" />
                    <YAxis stroke={CHART_COLORS.TEXT} className="text-xs" />
                    <Tooltip contentStyle={{ borderRadius: '0.5rem', border: '1px solid #e2e8f0' }} />
                    <Bar dataKey="applications" fill={CHART_COLORS.APPLICATIONS} name="Applications" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="interviews" fill={CHART_COLORS.INTERVIEWS} name="Interviews" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="placements" fill={CHART_COLORS.PLACEMENTS} name="Placements" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Salary Distribution - Updated Colors and Data */}
            <Card className="border-slate-200 bg-white shadow-lg rounded-xl">
              <CardHeader className="border-b border-slate-100 pb-4">
                <CardTitle className="text-lg text-slate-900">Salary Distribution</CardTitle>
                <CardDescription className="text-sm">Distribution of placement packages</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <ResponsiveContainer width="100%" height={200} className="w-full md:w-1/2">
                    <PieChart>
                      <Pie
                        data={salaryDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="count"
                        labelLine={false}
                      >
                        {salaryDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '0.5rem', border: '1px solid #e2e8f0' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-3 mt-4 md:mt-0 w-full md:w-1/2">
                    {salaryDistribution.map((entry, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                        <span className="text-sm text-slate-700">
                          {entry.range}: <span className="font-semibold">{entry.count}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Trends - Updated Colors */}
          <Card className="border-slate-200 bg-white shadow-lg rounded-xl">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-lg text-slate-900">Monthly Trends</CardTitle>
              <CardDescription className="text-sm">Placement activity over time</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={placementData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.GRID} />
                  <XAxis dataKey="month" stroke={CHART_COLORS.TEXT} className="text-xs" />
                  <YAxis stroke={CHART_COLORS.TEXT} className="text-xs" />
                  <Tooltip contentStyle={{ borderRadius: '0.5rem', border: '1px solid #e2e8f0' }} />
                  <Area
                    type="monotone"
                    dataKey="applications"
                    stackId="1"
                    stroke={CHART_COLORS.APPLICATIONS}
                    fill={CHART_COLORS.APPLICATIONS}
                    fillOpacity={0.4}
                  />
                  <Area
                    type="monotone"
                    dataKey="interviews"
                    stackId="1"
                    stroke={CHART_COLORS.INTERVIEWS}
                    fill={CHART_COLORS.INTERVIEWS}
                    fillOpacity={0.4}
                  />
                  <Area
                    type="monotone"
                    dataKey="placements"
                    stackId="1"
                    stroke={CHART_COLORS.PLACEMENTS}
                    fill={CHART_COLORS.PLACEMENTS}
                    fillOpacity={0.4}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          <Card className="border-slate-200 bg-white shadow-lg rounded-xl">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-lg text-slate-900">Department-wise Performance</CardTitle>
              <CardDescription className="text-sm">Placement statistics by department</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {departmentData.map((dept, index) => (
                  <div key={index} className="p-4 border border-slate-200 bg-slate-50 rounded-2xl transition hover:border-sky-200 hover:bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-slate-800">{dept.name}</h3>
                      <Badge
                        className={`text-xs font-semibold rounded-full px-3 ${
                          dept.percentage >= 80 ? "bg-emerald-600 hover:bg-emerald-600 text-white" : 
                          dept.percentage >= 70 ? "bg-sky-600 hover:bg-sky-600 text-white" : 
                          "bg-amber-600 hover:bg-amber-600 text-white"
                        }`}
                      >
                        {dept.percentage}%
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm text-slate-500 mb-3 border-t border-slate-100 pt-3">
                      <div>Total: <span className="font-medium text-slate-700">{dept.students}</span></div>
                      <div>Placed: <span className="font-medium text-emerald-600">{dept.placed}</span></div>
                      <div>Remaining: <span className="font-medium text-amber-600">{dept.students - dept.placed}</span></div>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-sky-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${dept.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="companies" className="space-y-6">
          <Card className="border-slate-200 bg-white shadow-lg rounded-xl">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-lg text-slate-900">Top Recruiting Companies</CardTitle>
              <CardDescription className="text-sm">Companies with highest hiring numbers</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {companyData.map((company, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-slate-200 bg-slate-50 rounded-2xl transition hover:border-sky-200 hover:bg-white">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-sky-50 rounded-xl shrink-0">
                        <Building2 className="h-5 w-5 text-sky-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">{company.name}</h3>
                        <p className="text-sm text-slate-500">{company.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-emerald-600">{company.hires} hires</div>
                      <div className="text-sm text-slate-500">
                        Avg: <span className="font-medium text-slate-700">₹{(company.avgSalary / 100000).toFixed(1)}L</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <Card className="border-slate-200 bg-white shadow-lg rounded-xl">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-lg text-slate-900">In-Demand Skills</CardTitle>
              <CardDescription className="text-sm">Most requested skills by employers</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {skillDemand.map((skill, index) => (
                  <div key={index} className="space-y-2 p-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-700">{skill.skill}</span>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-slate-500">{skill.jobs} jobs</span>
                        <span className="font-bold text-sky-600">{skill.demand}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-sky-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${skill.demand}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Placements Over Time - Updated Colors */}
            <Card className="border-slate-200 bg-white shadow-lg rounded-xl">
              <CardHeader className="border-b border-slate-100 pb-4">
                <CardTitle className="text-lg text-slate-900">Placements Over Time</CardTitle>
                <CardDescription className="text-sm">Number of placements secured each month</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={placementData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.GRID} />
                    <XAxis dataKey="month" stroke={CHART_COLORS.TEXT} className="text-xs" />
                    <YAxis stroke={CHART_COLORS.TEXT} className="text-xs" />
                    <Tooltip contentStyle={{ borderRadius: '0.5rem', border: '1px solid #e2e8f0' }} />
                    <Line
                      type="monotone"
                      dataKey="placements"
                      stroke={CHART_COLORS.PLACEMENTS}
                      strokeWidth={3}
                      dot={{ fill: CHART_COLORS.PLACEMENTS, strokeWidth: 2, r: 4 }}
                      name="Placements"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Company Engagement - Updated Colors */}
            <Card className="border-slate-200 bg-white shadow-lg rounded-xl">
              <CardHeader className="border-b border-slate-100 pb-4">
                <CardTitle className="text-lg text-slate-900">Company Engagement</CardTitle>
                <CardDescription className="text-sm">Number of unique companies recruiting each month</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={placementData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.GRID} />
                    <XAxis dataKey="month" stroke={CHART_COLORS.TEXT} className="text-xs" />
                    <YAxis stroke={CHART_COLORS.TEXT} className="text-xs" />
                    <Tooltip contentStyle={{ borderRadius: '0.5rem', border: '1px solid #e2e8f0' }} />
                    <Bar dataKey="companies" fill={CHART_COLORS.COMPANIES} name="Companies" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="border-slate-200 bg-white shadow-lg rounded-xl">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-lg text-slate-900">Key Insights & Actions</CardTitle>
              <CardDescription className="text-sm">Important trends and observations for strategic planning</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <Zap className="h-5 w-5 text-emerald-600" />
                      <span className="font-bold text-emerald-800 text-base">Positive Trends</span>
                    </div>
                    <ul className="text-sm text-emerald-700 space-y-2 list-disc pl-5">
                      <li>15% increase in tech company partnerships year-over-year.</li>
                      <li>Average salary increased by 8.5%, indicating high-quality placements.</li>
                      <li>Interview-to-offer ratio improved to 67%, showing better candidate matching.</li>
                    </ul>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                      <span className="font-bold text-amber-800 text-base">Areas for Improvement</span>
                    </div>
                    <ul className="text-sm text-amber-700 space-y-2 list-disc pl-5">
                      <li>Civil Engineering placement rate below target (65%); needs dedicated drives.</li>
                      <li>Need more companies actively recruiting for non-tech roles.</li>
                      <li>Student skill gaps observed in emerging technologies like AI/DevOps.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
