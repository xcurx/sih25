import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "../ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Briefcase, Calendar, CheckCircle, FileText, GraduationCap, TrendingUp, Users, Clock, Building2 } from "lucide-react"

// Custom colors for the Bar Chart (Consistent with Blue Theme)
const ACCENT_COLORS = {
    APPLICATIONS: "#3b82f6", // Blue-500
    PLACEMENTS: "#10b981", // Emerald-500
    BACKGROUND: "#e0f2fe", // Sky-100
    TEXT: "#0f172a", // Slate-900
}

const chartData = [
    { name: "Jan", applications: 12, placements: 8 },
    { name: "Feb", applications: 19, placements: 12 },
    { name: "Mar", applications: 15, placements: 10 },
    { name: "Apr", applications: 22, placements: 18 },
    { name: "May", applications: 28, placements: 20 },
    { name: "Jun", applications: 35, placements: 25 },
]

export default function PlacementCellDashboard() {
    return (
        <div className="space-y-8 p-0">
            
            {/* GRADIENT HEADER SECTION (Similar to Employer Dashboard) */}
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

                    {/* 4 Main Stats - Adjusted to new unified styling */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { title: "Active Jobs", value: 42, caption: "+5 this week", icon: Briefcase, accent: "bg-sky-50 text-sky-700" },
                            { title: "Total Students", value: "1,247", caption: "Eligible for placement", icon: GraduationCap, accent: "bg-indigo-50 text-indigo-700" },
                            { title: "Partner Companies", value: 89, caption: "Active partnerships", icon: Building2, accent: "bg-purple-50 text-purple-700" },
                            { title: "Placement Rate", value: "82%", caption: "Current year", icon: TrendingUp, accent: "bg-emerald-50 text-emerald-700" },
                        ].map((stat) => (
                            <Card 
                                key={stat.title} 
                                // Added shadow-md and hover effects for lift
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
                                    <p className={`text-xs ${stat.caption.startsWith('+') ? 'text-emerald-600 font-medium' : 'text-slate-500'}`}>{stat.caption}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>


            {/* Analytics & Recent Activities - Two column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Placement Analytics Card (Bar Chart) - Styling kept consistent */}
                <Card className="lg:col-span-2 border-slate-200 bg-white shadow-lg rounded-xl">
                    <CardHeader className="border-b border-slate-100 pb-4">
                        <CardTitle className="text-xl text-slate-900">Placement Analytics</CardTitle>
                        <CardDescription>Monthly application and placement trends</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <ResponsiveContainer width="100%" height={300}>
                            {/* Chart colors are already blue/green consistent */}
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
                    </CardContent>
                </Card>

                {/* Recent Activities Card - Styling kept consistent */}
                <Card className="border-slate-200 bg-white shadow-lg rounded-xl">
                    <CardHeader className="border-b border-slate-100 pb-4">
                        <CardTitle className="text-xl text-slate-900">Recent Activities</CardTitle>
                        <CardDescription>Latest system activities</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        
                        {/* New job posted */}
                        <div className="flex items-start space-x-4 p-3 rounded-lg hover:bg-slate-50 transition">
                            <div className="p-2 bg-emerald-100 rounded-full shrink-0">
                                <CheckCircle className="h-4 w-4 text-emerald-600" />
                            </div>
                            <div className="flex-1 text-sm">
                                <p className="font-semibold text-slate-800">New job posted</p>
                                <p className="text-slate-600">TechCorp Inc. - Software Intern</p>
                                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    2 hours ago
                                </p>
                            </div>
                        </div>
                        
                        {/* Student applied */}
                        <div className="flex items-start space-x-4 p-3 rounded-lg hover:bg-slate-50 transition">
                            <div className="p-2 bg-blue-100 rounded-full shrink-0">
                                <Users className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="flex-1 text-sm">
                                <p className="font-semibold text-slate-800">Student applied</p>
                                <p className="text-slate-600">John Doe applied for Data Science role</p>
                                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    4 hours ago
                                </p>
                            </div>
                        </div>
                        
                        {/* Interview scheduled */}
                        <div className="flex items-start space-x-4 p-3 rounded-lg hover:bg-slate-50 transition">
                            <div className="p-2 bg-yellow-100 rounded-full shrink-0">
                                <Calendar className="h-4 w-4 text-yellow-600" /> 
                            </div>
                            <div className="flex-1 text-sm">
                                <p className="font-semibold text-slate-800">Interview scheduled</p>
                                <p className="text-slate-600">DataTech Solutions - Tomorrow 2 PM</p>
                                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    6 hours ago
                                </p>
                            </div>
                        </div>
                        
                        {/* View all button - Updated to use sky theme */}
                        <Button variant="ghost" className="w-full justify-center text-sky-600 hover:bg-sky-50 rounded-lg mt-4">
                            View All Activities
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Optional: Placement Status & Top Recruiters sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Placement Status Card - Styling kept consistent */}
                <Card className="border-slate-200 bg-white shadow-lg rounded-xl">
                    <CardHeader>
                        <CardTitle className="text-xl text-slate-900">Placement Status</CardTitle>
                        <CardDescription>Overall progress towards placement goals</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-center">
                            <h3 className="text-4xl font-extrabold text-sky-600">1023 / 1247</h3>
                            <p className="text-slate-500">Students Placed / Total Eligible</p>
                        </div>
                        
                        {/* Progress bar - Styling updated to use sky theme */}
                        <div className="w-full bg-sky-100 rounded-full h-3">
                            <div className="bg-sky-600 h-3 rounded-full" style={{ width: `82%` }} /> 
                        </div>
                        
                        <div className="grid grid-cols-3 text-center pt-2">
                            <div className="space-y-1">
                                <p className="text-lg font-bold text-slate-900">18</p>
                                <p className="text-xs text-slate-500">Highest Offer</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-lg font-bold text-slate-900">6.5</p>
                                <p className="text-xs text-slate-500">Average CTC (LPA)</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-lg font-bold text-slate-900">22</p>
                                <p className="text-xs text-slate-500">Multiple Offers</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Top Recruiters Card - Styling kept consistent */}
                <Card className="border-slate-200 bg-white shadow-lg rounded-xl">
                    <CardHeader>
                        <CardTitle className="text-xl text-slate-900">Top Recruiters</CardTitle>
                        <CardDescription>Companies with the highest placement count</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {[
                            { name: "GlobalTech Solutions", count: 45, logo: "/globaltech.png" },
                            { name: "Innovate AI", count: 38, logo: "/innovateai.png" },
                            { name: "FinEdge Corp", count: 31, logo: "/finedge.png" },
                            { name: "CyberSec Pro", count: 25, logo: "/cybersec.png" },
                        ].map((recruiter, index) => (
                            <div key={recruiter.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <div className="flex items-center space-x-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={recruiter.logo} alt={recruiter.name} />
                                        <AvatarFallback className="bg-sky-100 text-sky-700">{recruiter.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <p className="font-medium text-slate-800">{recruiter.name}</p>
                                </div>
                                {/* Badge updated to use sky theme */}
                                <Badge variant="secondary" className="bg-sky-100 text-sky-700 font-bold">
                                    {recruiter.count} Placements
                                </Badge>
                            </div>
                        ))}
                        {/* Button updated to use sky theme */}
                        <Button variant="ghost" className="w-full justify-center text-sky-600 hover:bg-sky-50 rounded-lg mt-4">
                            View All Partners
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}