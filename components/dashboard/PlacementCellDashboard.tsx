"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Briefcase, Calendar, CheckCircle, GraduationCap, TrendingUp, Users, Clock, Building2, FileText, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import axios from "axios"
import { formatDistanceToNow } from "date-fns"
import { useRouter } from "next/navigation"

// Custom colors for the Bar Chart
const ACCENT_COLORS = {
    APPLICATIONS: "#94b8f2",
    PLACEMENTS: "#49cca1",
    BACKGROUND: "#e0f2fe",
    TEXT: "#64748b",
}

interface DashboardStats {
    activeJobs: number
    activeJobsChange: string
    totalStudents: number
    partnerCompanies: number
    placementRate: string
    placedStudents: number
}

interface ChartData {
    name: string
    applications: number
    placements: number
}

interface Activity {
    id: string
    type: "job_posted" | "application" | "interview" | "placement"
    title: string
    description: string
    timestamp: string
}

interface TopRecruiter {
    id: string
    name: string
    placementCount: number
}

export default function PlacementCellDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [chartData, setChartData] = useState<ChartData[]>([])
    const [activities, setActivities] = useState<Activity[]>([])
    const [topRecruiters, setTopRecruiters] = useState<TopRecruiter[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true)
            try {
                const [statsRes, analyticsRes, activitiesRes, recruitersRes] = await Promise.all([
                    axios.get("/api/placementcell/dashboard/stats"),
                    axios.get("/api/placementcell/dashboard/analytics"),
                    axios.get("/api/placementcell/dashboard/activities"),
                    axios.get("/api/placementcell/dashboard/top-recruiters"),
                ])

                if (statsRes.status === 200) setStats(statsRes.data.stats)
                if (analyticsRes.status === 200) setChartData(analyticsRes.data.chartData)
                if (activitiesRes.status === 200) setActivities(activitiesRes.data.activities)
                if (recruitersRes.status === 200) setTopRecruiters(recruitersRes.data.topRecruiters)
            } catch (error) {
                console.error("Error fetching dashboard data:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchDashboardData()
    }, [])

    const getActivityIcon = (type: Activity["type"]) => {
        switch (type) {
            case "job_posted":
                return <CheckCircle className="h-4 w-4 text-emerald-600" />
            case "application":
                return <Users className="h-4 w-4 text-blue-600" />
            case "interview":
                return <Calendar className="h-4 w-4 text-yellow-600" />
            case "placement":
                return <Briefcase className="h-4 w-4 text-purple-600" />
            default:
                return <FileText className="h-4 w-4 text-slate-600" />
        }
    }

    const getActivityIconBg = (type: Activity["type"]) => {
        switch (type) {
            case "job_posted":
                return "bg-emerald-100"
            case "application":
                return "bg-blue-100"
            case "interview":
                return "bg-yellow-100"
            case "placement":
                return "bg-purple-100"
            default:
                return "bg-slate-100"
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
            </div>
        )
    }

    return (
        <div className="space-y-8 p-0">
            
            {/* GRADIENT HEADER SECTION */}
            <section className="relative overflow-hidden rounded-[32px] border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-blue-50 p-8 shadow-lg">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.08),transparent_55%)]" />

                <div className="relative space-y-6">
                    {/* PLACEMENT CELL HEADER TEXT */}
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Placement Control Center</p>
                        <h1 className="mt-3 text-3xl font-bold text-slate-900">Unified placement operations and real-time analytics.</h1>
                        <p className="mt-2 text-sm text-slate-600">
                            Monitor campus placement metrics and track partner engagement in one view.
                        </p>
                    </div>

                    {/* 4 Main Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { 
                                title: "Active Jobs", 
                                value: stats?.activeJobs ?? 0, 
                                caption: stats?.activeJobsChange ?? "", 
                                icon: Briefcase, 
                                accent: "bg-sky-50 text-sky-700" 
                            },
                            { 
                                title: "Total Students", 
                                value: stats?.totalStudents?.toLocaleString() ?? "0", 
                                caption: "Eligible for placement", 
                                icon: GraduationCap, 
                                accent: "bg-indigo-50 text-indigo-700" 
                            },
                            { 
                                title: "Partner Companies", 
                                value: stats?.partnerCompanies ?? 0, 
                                caption: "Active partnerships", 
                                icon: Building2, 
                                accent: "bg-purple-50 text-purple-700" 
                            },
                            { 
                                title: "Placement Rate", 
                                value: stats?.placementRate ?? "0%", 
                                caption: "Current year", 
                                icon: TrendingUp, 
                                accent: "bg-emerald-50 text-emerald-700" 
                            },
                        ].map((stat) => (
                            <Card 
                                key={stat.title} 
                                className="border-slate-200 bg-white shadow-md rounded-xl transition-shadow hover:shadow-xl"
                            >
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-slate-500">{stat.title}</CardTitle>
                                    <div className={`rounded-full p-2 ${stat.accent}`}>
                                        <stat.icon className="h-4 w-4" aria-hidden="true" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                                    <p className={`text-xs ${String(stat.caption).startsWith('+') ? 'text-emerald-600 font-medium' : 'text-slate-500'}`}>{stat.caption}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Placement Analytics Card (Full Width) */}
            <div className="grid grid-cols-1 gap-6">
                <Card className="border-slate-200 bg-white shadow-lg rounded-xl">
                    <CardHeader className="border-b border-slate-100 pb-4">
                        <CardTitle className="text-xl text-slate-900">Placement Analytics</CardTitle>
                        <CardDescription>Monthly application and placement trends</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="name" stroke="#64748b" className="text-xs" />
                                    <YAxis stroke="#64748b" className="text-xs" />
                                    <Tooltip
                                        cursor={{ fill: ACCENT_COLORS.BACKGROUND, opacity: 0.5 }}
                                        contentStyle={{ borderRadius: '0.75rem', border: '1px solid #e2e8f0', background: 'white', padding: '0.5rem' }}
                                    />
                                    <Bar dataKey="applications" fill={ACCENT_COLORS.APPLICATIONS} name="Applications" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="placements" fill={ACCENT_COLORS.PLACEMENTS} name="Placements" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-[300px] text-slate-500">
                                No data available
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activities & Top Recruiters (Side by Side) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                              {/* Recent Activities Card */}
                <Card className="border-slate-200 bg-white shadow-lg rounded-xl">
                    <CardHeader className="border-b border-slate-100 pb-4">
                        <CardTitle className="text-xl text-slate-900">Recent Activities</CardTitle>
                        <CardDescription>Latest system activities</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 pt-4">
                        {activities.length > 0 ? (
                            activities.slice(0, 5).map((activity) => (
                                <div key={activity.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-slate-50 transition">
                                    <div className={`p-2 rounded-full shrink-0 ${getActivityIconBg(activity.type)}`}>
                                        {getActivityIcon(activity.type)}
                                    </div>
                                    <div className="flex-1 text-sm min-w-0">
                                        <p className="font-semibold text-slate-800">{activity.title}</p>
                                        <p className="text-slate-600 truncate text-xs">{activity.description}</p>
                                        <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-slate-500">
                                No recent activities
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Top Recruiters Card */}
                <Card className="border-slate-200 bg-white shadow-lg rounded-xl">
                    <CardHeader className="border-b border-slate-100 pb-4">
                        <CardTitle className="text-xl text-slate-900">Top Recruiters</CardTitle>
                        <CardDescription>Companies with the highest placement count</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {topRecruiters.length > 0 ? (
                            topRecruiters.map((recruiter) => (
                                <div key={recruiter.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="flex items-center space-x-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback className="bg-sky-100 text-sky-700 font-semibold">
                                                {recruiter.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <p className="font-medium text-slate-800">{recruiter.name}</p>
                                    </div>
                                    <Badge variant="secondary" className="bg-sky-100 text-sky-700 font-bold">
                                        {recruiter.placementCount} Placement{recruiter.placementCount !== 1 ? 's' : ''}
                                    </Badge>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-slate-500">
                                No placement data available
                            </div>
                        )}
                        <Button
                            variant="ghost"
                            className="w-full justify-center text-sky-600 hover:bg-sky-50 rounded-lg mt-4"
                            onClick={() => router.push("/employers")}
                        >
                            View All Partners
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Placement Status (Bottom) */}
            <div className="grid grid-cols-1 gap-6">
                <Card className="border-slate-200 bg-white shadow-lg rounded-xl">
                    <CardHeader>
                        <CardTitle className="text-xl text-slate-900">Placement Status</CardTitle>
                        <CardDescription>Overall progress towards placement goals</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-center">
                            <h3 className="text-4xl font-extrabold text-sky-600">
                                {stats?.placedStudents ?? 0} / {stats?.totalStudents ?? 0}
                            </h3>
                            <p className="text-slate-500">Students Placed / Total Eligible</p>
                        </div>
                        
                        {/* Progress bar */}
                        <div className="w-full bg-sky-100 rounded-full h-3">
                            <div 
                                className="bg-sky-600 h-3 rounded-full transition-all duration-500" 
                                style={{ 
                                    width: `${stats?.totalStudents ? Math.min((stats.placedStudents / stats.totalStudents) * 100, 100) : 0}%` 
                                }} 
                            />
                        </div>
                        
                        <div className="grid grid-cols-3 text-center pt-2">
                            <div className="space-y-1">
                                <p className="text-lg font-bold text-slate-900">{stats?.activeJobs ?? 0}</p>
                                <p className="text-xs text-slate-500">Active Jobs</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-lg font-bold text-slate-900">{stats?.partnerCompanies ?? 0}</p>
                                <p className="text-xs text-slate-500">Companies</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-lg font-bold text-slate-900">{stats?.placedStudents ?? 0}</p>
                                <p className="text-xs text-slate-500">Placements</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
