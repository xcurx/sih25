"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Star, MapPin, DollarSign, Calendar, Briefcase, TrendingUp, Target } from "lucide-react"

interface JobMatch {
  matchScore: number
  matchReasons: string[]
  skillsMatch: number
  locationMatch: boolean
  salaryMatch: boolean
  typeMatch: boolean
}

// function calculateJobMatch(student: Student, job: Job): JobMatch {
//   let matchScore = 0
//   const matchReasons: string[] = []

//   // Skills matching (40% weight)
//   const studentSkills = student.skills.map((s) => s.toLowerCase())
//   const jobSkills = job.skills.map((s) => s.toLowerCase())
//   const matchingSkills = studentSkills.filter((skill) =>
//     jobSkills.some((jobSkill) => jobSkill.includes(skill) || skill.includes(jobSkill)),
//   )
//   const skillsMatch = (matchingSkills.length / jobSkills.length) * 100
//   matchScore += (skillsMatch / 100) * 40

//   if (matchingSkills.length > 0) {
//     matchReasons.push(`${matchingSkills.length} matching skills`)
//   }

//   // Location preference (20% weight)
//   const locationMatch =
//     student.preferences.locations.includes(job.location) ||
//     (student.preferences.locations.includes("Remote") && job.location === "Remote")
//   if (locationMatch) {
//     matchScore += 20
//     matchReasons.push("Preferred location")
//   }

//   // Salary range (20% weight)
//   const salaryMatch =
//     job.salary.min >= student.preferences.salaryRange.min && job.salary.max <= student.preferences.salaryRange.max
//   if (salaryMatch) {
//     matchScore += 20
//     matchReasons.push("Salary in range")
//   }

//   // Job type preference (10% weight)
//   const typeMatch = student.preferences.jobTypes.includes(job.type)
//   if (typeMatch) {
//     matchScore += 10
//     matchReasons.push("Preferred job type")
//   }

//   // Department match (10% weight)
//   const departmentMatch = job.department.includes(student.department)
//   if (departmentMatch) {
//     matchScore += 10
//     matchReasons.push("Department match")
//   }

//   return {
//     job,
//     matchScore: Math.min(matchScore, 100),
//     matchReasons,
//     skillsMatch,
//     locationMatch,
//     salaryMatch,
//     typeMatch,
//   }
// }

// export function JobRecommendations({ student }: { student: Student }) {
//   const [showAll, setShowAll] = useState(false)

//   const jobMatches = useMemo(() => {
//     return mockJobs.map((job) => calculateJobMatch(student, job)).sort((a, b) => b.matchScore - a.matchScore)
//   }, [student])

//   const displayedJobs = showAll ? jobMatches : jobMatches.slice(0, 3)
//   const highMatchJobs = jobMatches.filter((match) => match.matchScore >= 70)

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Target className="h-5 w-5" />
//             Job Recommendations
//           </CardTitle>
//           <CardDescription>Jobs matched to your profile and preferences</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//             <div className="text-center p-4 bg-muted rounded-lg">
//               <div className="text-2xl font-bold text-primary">{jobMatches.length}</div>
//               <div className="text-sm text-muted-foreground">Total Jobs</div>
//             </div>
//             <div className="text-center p-4 bg-muted rounded-lg">
//               <div className="text-2xl font-bold text-secondary">{highMatchJobs.length}</div>
//               <div className="text-sm text-muted-foreground">High Match (70%+)</div>
//             </div>
//             <div className="text-center p-4 bg-muted rounded-lg">
//               <div className="text-2xl font-bold text-accent">
//                 {jobMatches.length > 0 ? Math.round(jobMatches[0].matchScore) : 0}%
//               </div>
//               <div className="text-sm text-muted-foreground">Best Match</div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       <div className="space-y-4">
//         {displayedJobs.map((match, index) => (
//           <JobMatchCard key={match.job.id} match={match} rank={index + 1} />
//         ))}
//       </div>

//       {!showAll && jobMatches.length > 3 && (
//         <div className="text-center">
//           <Button variant="outline" onClick={() => setShowAll(true)}>
//             Show All {jobMatches.length} Recommendations
//           </Button>
//         </div>
//       )}
//     </div>
//   )
// }

// function JobMatchCard({ match, rank }: { match: JobMatch; rank: number }) {
//   const getMatchColor = (score: number) => {
//     if (score >= 80) return "text-green-600"
//     if (score >= 60) return "text-yellow-600"
//     return "text-red-600"
//   }

//   const getMatchBadgeColor = (score: number) => {
//     if (score >= 80) return "default"
//     if (score >= 60) return "secondary"
//     return "destructive"
//   }

//   return (
//     <Card className="hover:shadow-lg transition-shadow">
//       <CardHeader>
//         <div className="flex items-start justify-between">
//           <div className="flex items-start space-x-4">
//             <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold">
//               {rank}
//             </div>
//             <div className="flex-1">
//               <div className="flex items-center space-x-2 mb-1">
//                 <CardTitle className="text-xl">{match.job.title}</CardTitle>
//                 <Badge variant={getMatchBadgeColor(match.matchScore)}>{Math.round(match.matchScore)}% Match</Badge>
//               </div>
//               <CardDescription className="text-lg font-medium text-foreground">{match.job.company}</CardDescription>
//               <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
//                 <div className="flex items-center space-x-1">
//                   <MapPin className="h-4 w-4" />
//                   <span>{match.job.location}</span>
//                 </div>
//                 <div className="flex items-center space-x-1">
//                   <Briefcase className="h-4 w-4" />
//                   <span className="capitalize">{match.job.type}</span>
//                 </div>
//                 <div className="flex items-center space-x-1">
//                   <DollarSign className="h-4 w-4" />
//                   <span>
//                     ₹{match.job.salary.min.toLocaleString()} - ₹{match.job.salary.max.toLocaleString()}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="text-right">
//             <div className={`text-2xl font-bold ${getMatchColor(match.matchScore)}`}>
//               {Math.round(match.matchScore)}%
//             </div>
//             <div className="text-xs text-muted-foreground">Match Score</div>
//           </div>
//         </div>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         <div>
//           <div className="flex items-center justify-between mb-2">
//             <span className="text-sm font-medium">Skills Match</span>
//             <span className="text-sm text-muted-foreground">{Math.round(match.skillsMatch)}%</span>
//           </div>
//           <Progress value={match.skillsMatch} className="h-2" />
//         </div>

//         <div>
//           <h4 className="font-medium mb-2">Why this matches you:</h4>
//           <div className="flex flex-wrap gap-2">
//             {match.matchReasons.map((reason, index) => (
//               <Badge key={index} variant="outline" className="text-xs">
//                 <TrendingUp className="mr-1 h-3 w-3" />
//                 {reason}
//               </Badge>
//             ))}
//           </div>
//         </div>

//         <div>
//           <h4 className="font-medium mb-2">Required Skills:</h4>
//           <div className="flex flex-wrap gap-2">
//             {match.job.skills.map((skill, index) => {
//               const studentHasSkill = mockStudents[0].skills.some(
//                 (s) => s.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(s.toLowerCase()),
//               )
//               return (
//                 <Badge
//                   key={index}
//                   variant={studentHasSkill ? "default" : "outline"}
//                   className={studentHasSkill ? "bg-green-100 text-green-800" : ""}
//                 >
//                   {skill}
//                   {studentHasSkill && <Star className="ml-1 h-3 w-3 fill-current" />}
//                 </Badge>
//               )
//             })}
//           </div>
//         </div>

//         <div className="flex items-center justify-between pt-4 border-t">
//           <div className="flex items-center space-x-2 text-sm text-muted-foreground">
//             <Calendar className="h-4 w-4" />
//             <span>Deadline: {new Date(match.job.deadline).toLocaleDateString()}</span>
//           </div>
//           <div className="flex space-x-2">
//             <Button variant="outline" size="sm">
//               View Details
//             </Button>
//             <Button size="sm">Apply Now</Button>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }
