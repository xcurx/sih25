import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertCircle, Briefcase, Calendar, CheckCircle, Clock, FileText, GraduationCap, TrendingUp, Users, Building2 } from "lucide-react"
import { Progress } from "../ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

import { mockJobs, mockStudents } from "@/lib/mock-data"

const chartData = [
  { name: "Jan", applications: 12, placements: 8 },
  { name: "Feb", applications: 19, placements: 12 },
  { name: "Mar", applications: 15, placements: 10 },
  { name: "Apr", applications: 22, placements: 18 },
  { name: "May", applications: 28, placements: 20 },
  { name: "Jun", applications: 35, placements: 25 },
]

const pieData = [
  // Updated colors to match the placement page's theme (or similar)
  { name: "Placed", value: 65, color: "#10b981" }, // Emerald-500
  { name: "In Process", value: 25, color: "#3b82f6" }, // Blue-500
  { name: "Not Applied", value: 10, color: "#ef4444" }, // Red-500
]

// Custom colors for the Bar Chart (Consistent with Blue/Green Theme)
const ACCENT_COLORS = {
    APPLICATIONS: "#3b82f6", // Blue-500
    PLACEMENTS: "#10b981", // Emerald-500
    BACKGROUND: "#e0f2fe", // Sky-100
    TEXT: "#0f172a", // Slate-900
}


export default function FacultyDashboard() {
  return (
    <div className="space-y-8 p-0"> {/* Changed space-y-6 to space-y-8 and added p-0 */}
      {/* 4 Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Students */}
        <Card className="border-slate-200 bg-white shadow-md rounded-xl transition hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Students</CardTitle>
            <div className="rounded-full p-2 bg-indigo-50 text-indigo-700">
                <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">156</div> {/* Increased text size, changed color */}
            <p className="text-xs text-slate-500">Under guidance</p> {/* Changed text color */}
          </CardContent>
        </Card>
        
        {/* Card 2: Pending Approvals */}
        <Card className="border-slate-200 bg-white shadow-md rounded-xl transition hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Pending Approvals</CardTitle>
            <div className="rounded-full p-2 bg-red-50 text-red-700"> {/* Accent color for attention */}
                <Clock className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">8</div>
            <p className="text-xs text-red-600 font-medium">Require attention</p> {/* Highlighted caption */}
          </CardContent>
        </Card>
        
        {/* Card 3: Placement Rate */}
        <Card className="border-slate-200 bg-white shadow-md rounded-xl transition hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Placement Rate</CardTitle>
            <div className="rounded-full p-2 bg-emerald-50 text-emerald-700"> {/* Accent color for success */}
                <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">78%</div>
            <p className="text-xs text-slate-500">This semester</p>
          </CardContent>
        </Card>
        
        {/* Card 4: Interviews */}
        <Card className="border-slate-200 bg-white shadow-md rounded-xl transition hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Interviews</CardTitle>
            <div className="rounded-full p-2 bg-sky-50 text-sky-700">
                <Calendar className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">24</div>
            <p className="text-xs text-slate-500">This week</p>
          </CardContent>
        </Card>
        
      </div>

      {/* Analytics & Distribution - Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Placement Trends Card (Bar Chart) */}
        <Card className="border-slate-200 bg-white shadow-lg rounded-xl">
          <CardHeader className="border-b border-slate-100 pb-4"> {/* Added border-b styling */}
            <CardTitle className="text-xl text-slate-900">Placement Trends</CardTitle> {/* Increased text size, changed color */}
            <CardDescription>Monthly application and placement statistics</CardDescription>
          </CardHeader>
          <CardContent className="pt-6"> {/* Added pt-6 for consistency */}
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}> {/* Adjusted margins */}
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /> {/* Lighter grid color */}
                <XAxis dataKey="name" stroke="#64748b" className="text-xs" /> {/* Axis styling */}
                <YAxis stroke="#64748b" className="text-xs" /> {/* Axis styling */}
                <Tooltip
                    cursor={{ fill: ACCENT_COLORS.BACKGROUND, opacity: 0.5 }}
                    contentStyle={{ borderRadius: '0.75rem', border: '1px solid #e2e8f0', background: 'white', padding: '0.5rem' }}
                />
                {/* Applied accent colors and radius */}
                <Bar dataKey="applications" fill={ACCENT_COLORS.APPLICATIONS} name="Applications" radius={[4, 4, 0, 0]} />
                <Bar dataKey="placements" fill={ACCENT_COLORS.PLACEMENTS} name="Placements" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Student Status Distribution Card (Pie Chart) */}
        <Card className="border-slate-200 bg-white shadow-lg rounded-xl">
          <CardHeader className="border-b border-slate-100 pb-4"> {/* Added border-b styling */}
            <CardTitle className="text-xl text-slate-900">Student Status Distribution</CardTitle> {/* Increased text size, changed color */}
            <CardDescription>Current placement status overview</CardDescription>
          </CardHeader>
          <CardContent className="pt-6"> {/* Added pt-6 for consistency */}
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
                    contentStyle={{ borderRadius: '0.75rem', border: '1px solid #e2e8f0', background: 'white', padding: '0.5rem' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-4 mt-4">
              {pieData.map((entry, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-sm text-slate-700"> {/* Changed text color */}
                    {entry.name}: <span className="font-semibold">{entry.value}%</span> {/* Added bolding for value */}
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