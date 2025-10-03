"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
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
import { TrendingUp, Award, Download, GraduationCap, Building2, Target, AlertCircle } from "lucide-react"
import { useSession } from "next-auth/react"

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

const salaryDistribution = [
  { range: "3-5 LPA", count: 45, color: "#84cc16" },
  { range: "5-8 LPA", count: 78, color: "#164e63" },
  { range: "8-12 LPA", count: 52, color: "#ea580c" },
  { range: "12+ LPA", count: 28, color: "#dc2626" },
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

export default function AnalyticsPage() {
  const { data:session } = useSession();
  const [timeRange, setTimeRange] = useState("6months")
  const [selectedDepartment, setSelectedDepartment] = useState("all")

  if (session?.user?.role !== "placement-cell") {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
          <p className="text-muted-foreground">This page is only accessible to placement cell and faculty.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive placement and recruitment insights</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Placement Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78.5%</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +5.2% from last semester
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">Eligible for placement</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Partner Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +12 new partnerships
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Package</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹6.8L</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +8.5% from last year
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="companies">Companies</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Placement Funnel</CardTitle>
                <CardDescription>Student journey from application to placement</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={placementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="applications" fill="#164e63" name="Applications" />
                    <Bar dataKey="interviews" fill="#84cc16" name="Interviews" />
                    <Bar dataKey="placements" fill="#ea580c" name="Placements" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Salary Distribution</CardTitle>
                <CardDescription>Distribution of placement packages</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={salaryDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {salaryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {salaryDistribution.map((entry, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span className="text-sm">
                        {entry.range}: {entry.count}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Trends</CardTitle>
              <CardDescription>Placement activity over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={placementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="applications"
                    stackId="1"
                    stroke="#164e63"
                    fill="#164e63"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="interviews"
                    stackId="1"
                    stroke="#84cc16"
                    fill="#84cc16"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="placements"
                    stackId="1"
                    stroke="#ea580c"
                    fill="#ea580c"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Department-wise Performance</CardTitle>
              <CardDescription>Placement statistics by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentData.map((dept, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{dept.name}</h3>
                      <Badge
                        variant={
                          dept.percentage >= 80 ? "default" : dept.percentage >= 70 ? "secondary" : "destructive"
                        }
                      >
                        {dept.percentage}%
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground mb-3">
                      <div>Total Students: {dept.students}</div>
                      <div>Placed: {dept.placed}</div>
                      <div>Remaining: {dept.students - dept.placed}</div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
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
          <Card>
            <CardHeader>
              <CardTitle>Top Recruiting Companies</CardTitle>
              <CardDescription>Companies with highest hiring numbers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {companyData.map((company, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{company.name}</h3>
                        <p className="text-sm text-muted-foreground">{company.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{company.hires} hires</div>
                      <div className="text-sm text-muted-foreground">
                        Avg: ₹{(company.avgSalary / 100000).toFixed(1)}L
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>In-Demand Skills</CardTitle>
              <CardDescription>Most requested skills by employers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skillDemand.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{skill.skill}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">{skill.jobs} jobs</span>
                        <span className="font-bold">{skill.demand}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
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
            <Card>
              <CardHeader>
                <CardTitle>Application Success Rate</CardTitle>
                <CardDescription>Percentage of applications leading to placements</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={placementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="placements"
                      stroke="#84cc16"
                      strokeWidth={3}
                      dot={{ fill: "#84cc16", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Company Engagement</CardTitle>
                <CardDescription>Number of companies recruiting each month</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={placementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="companies" fill="#164e63" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Key Insights</CardTitle>
              <CardDescription>Important trends and observations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-800">Positive Trends</span>
                    </div>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• 15% increase in tech company partnerships</li>
                      <li>• Average salary increased by 8.5%</li>
                      <li>• Interview-to-offer ratio improved to 67%</li>
                    </ul>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <span className="font-medium text-yellow-800">Areas for Improvement</span>
                    </div>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Civil Engineering placement rate below target</li>
                      <li>• Need more companies for non-tech roles</li>
                      <li>• Student skill gaps in emerging technologies</li>
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
