"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, TrendingUp, Users } from "lucide-react"
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

interface ChartDataPoint {
  name: string
  applications: number
  placements: number
}

const ACCENT_COLORS = {
  APPLICATIONS: "#3b82f6",
  PLACEMENTS: "#10b981",
  BACKGROUND: "#e0f2fe",
  TEXT: "#0f172a",
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
    <div className="space-y-8 p-0">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-slate-200 bg-white shadow-md rounded-xl transition hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Students</CardTitle>
            <div className="rounded-full p-2 bg-indigo-50 text-indigo-700">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{stats?.studentsCount ?? 0}</div>
            <p className="text-xs text-slate-500">Under guidance</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-md rounded-xl transition hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Pending Approvals</CardTitle>
            <div className="rounded-full p-2 bg-red-50 text-red-700">
              <Clock className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{stats?.pendingApprovalsCount ?? 0}</div>
            <p className="text-xs text-red-600 font-medium">
              {(stats?.pendingApprovalsCount ?? 0) > 0 ? "Require attention" : "All clear"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-md rounded-xl transition hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Placement Rate</CardTitle>
            <div className="rounded-full p-2 bg-emerald-50 text-emerald-700">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{stats?.placementRate ?? 0}%</div>
            <p className="text-xs text-slate-500">This semester</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-md rounded-xl transition hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Interviews</CardTitle>
            <div className="rounded-full p-2 bg-sky-50 text-sky-700">
              <Calendar className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{stats?.interviewsThisWeek ?? 0}</div>
            <p className="text-xs text-slate-500">This week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-slate-200 bg-white shadow-lg rounded-xl">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-xl text-slate-900">Placement Trends</CardTitle>
            <CardDescription>Monthly application and placement statistics</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" className="text-xs" />
                <YAxis stroke="#64748b" className="text-xs" />
                <Tooltip
                  cursor={{ fill: ACCENT_COLORS.BACKGROUND, opacity: 0.5 }}
                  contentStyle={{ borderRadius: "0.75rem", border: "1px solid #e2e8f0", background: "white", padding: "0.5rem" }}
                />
                <Bar dataKey="applications" fill={ACCENT_COLORS.APPLICATIONS} name="Applications" radius={[4, 4, 0, 0]} />
                <Bar dataKey="placements" fill={ACCENT_COLORS.PLACEMENTS} name="Placements" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-lg rounded-xl">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-xl text-slate-900">Student Status Distribution</CardTitle>
            <CardDescription>Current placement status overview</CardDescription>
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
                  contentStyle={{ borderRadius: "0.75rem", border: "1px solid #e2e8f0", background: "white", padding: "0.5rem" }}
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