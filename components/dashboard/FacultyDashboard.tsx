"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertCircle, Briefcase, Calendar, CheckCircle, Clock, FileText, GraduationCap, TrendingUp, Users, Building2 } from "lucide-react"
import { Progress } from "../ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { useEffect, useState } from "react"
import axios from "axios"
import Loader from "@/components/loader/Loader"

interface DashboardStats {
  studentsCount: number
  pendingApprovalsCount: number
  placementRate: number
  interviewsThisWeek: number
}

interface PieData {
  placed: number
  inProcess: number
  notApplied: number
}

const pieData = [
  { name: "Placed", value: 65, color: "#10b981" },
  { name: "In Process", value: 25, color: "#3b82f6" },
  { name: "Not Applied", value: 10, color: "#ef4444" },
]

const ACCENT_COLORS = {
    APPLICATIONS: "#3b82f6",
    PLACEMENTS: "#10b981",
    BACKGROUND: "#e0f2fe",
    TEXT: "#64748b",
    GRID: "#f1f5f9",
}


export default function FacultyDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [pieData, setPieData] = useState<{ name: string; value: number; color: string }[]>([])
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get("/api/faculty/dashboard-stats", {
          withCredentials: true,
        })
        if (res.status === 200) {
          setStats(res.data.stats)
          setChartData(res.data.chartData)

          const total = res.data.pieData.placed + res.data.pieData.inProcess + res.data.pieData.notApplied
          const placedPercent = total > 0 ? Math.round((res.data.pieData.placed / total) * 100) : 0
          const inProcessPercent = total > 0 ? Math.round((res.data.pieData.inProcess / total) * 100) : 0
          const notAppliedPercent = total > 0 ? 100 - placedPercent - inProcessPercent : 0

          setPieData([
            { name: "Placed", value: placedPercent, color: "#10b981" },
            { name: "In Process", value: inProcessPercent, color: "#3b82f6" },
            { name: "Not Applied", value: notAppliedPercent, color: "#ef4444" },
          ])
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return <Loader />
  }

  return (
    <div className="space-y-8">
      {/* Hero Section with Stats */}
      <section className="relative overflow-hidden rounded-[32px] border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-blue-50 p-8 shadow space-y-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.08),transparent_55%)]" />
        <div className="relative space-y-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Faculty Dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Student Guidance Overview</h1>
            <p className="mt-2 text-sm text-slate-600">
              Monitor and guide your students through their placement journey
            </p>
          </div>
        </div>

        {/* Stats Cards inside gradient */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Students */}
          <Card className="border-slate-200 bg-white/90 shadow-md rounded-xl transition-shadow hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Students</CardTitle>
              <div className="rounded-full p-2 bg-indigo-50 text-indigo-600">
                  <Users className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-slate-900">156</div>
              <p className="text-xs text-slate-500">Under guidance</p>
            </CardContent>
          </Card>
          
          {/* Card 2: Pending Approvals */}
          <Card className="border-slate-200 bg-white/90 shadow-md rounded-xl transition-shadow hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Pending Approvals</CardTitle>
              <div className="rounded-full p-2 bg-red-50 text-red-600">
                  <Clock className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-slate-900">8</div>
              <p className="text-xs text-red-600 font-medium">Require attention</p>
            </CardContent>
          </Card>
          
          {/* Card 3: Placement Rate */}
          <Card className="border-slate-200 bg-white/90 shadow-md rounded-xl transition-shadow hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Placement Rate</CardTitle>
              <div className="rounded-full p-2 bg-emerald-50 text-emerald-600">
                  <TrendingUp className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-slate-900">78%</div>
              <p className="text-xs text-slate-500">This semester</p>
            </CardContent>
          </Card>
          
          {/* Card 4: Interviews */}
          <Card className="border-slate-200 bg-white/90 shadow-md rounded-xl transition-shadow hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Interviews</CardTitle>
              <div className="rounded-full p-2 bg-sky-50 text-sky-600">
                  <Calendar className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-slate-900">24</div>
              <p className="text-xs text-slate-500">This week</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Analytics & Distribution - Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Placement Trends Card (Bar Chart) */}
        <Card className="border-slate-200 bg-white shadow-lg rounded-xl">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-lg text-slate-900">Placement Trends</CardTitle>
            <CardDescription className="text-sm">Monthly application and placement statistics</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={ACCENT_COLORS.GRID} />
                <XAxis dataKey="name" stroke={ACCENT_COLORS.TEXT} className="text-xs" />
                <YAxis stroke={ACCENT_COLORS.TEXT} className="text-xs" />
                <Tooltip
                    cursor={{ fill: ACCENT_COLORS.BACKGROUND, opacity: 0.5 }}
                    contentStyle={{ borderRadius: '0.5rem', border: '1px solid #e2e8f0', background: 'white', padding: '0.5rem' }}
                />
                <Bar dataKey="applications" fill={ACCENT_COLORS.APPLICATIONS} name="Applications" radius={[4, 4, 0, 0]} />
                <Bar dataKey="placements" fill={ACCENT_COLORS.PLACEMENTS} name="Placements" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Student Status Distribution Card (Pie Chart) */}
        <Card className="border-slate-200 bg-white shadow-lg rounded-xl">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-lg text-slate-900">Student Status Distribution</CardTitle>
            <CardDescription className="text-sm">Current placement status overview</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                    contentStyle={{ borderRadius: '0.5rem', border: '1px solid #e2e8f0', background: 'white', padding: '0.5rem' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-4 mt-4">
              {pieData.map((entry, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-sm text-slate-700">
                    {entry.name}: <span className="font-semibold">{entry.value}%</span>
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
