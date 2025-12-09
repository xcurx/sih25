"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import type { ApprovalApplication } from "@/lib/types"
import {
    Building2,
    Calendar,
    CheckCircle,
    Eye,
    FileText,
    GraduationCap,
    Mail,
    MapPin,
    Phone,
    XCircle
} from "lucide-react"

const getStudentInitials = (name: string | undefined): string => {
    if (!name) return "NA";
    const parts = name.split(" ").map((n) => n[0]).join("");
    return parts.length > 2 ? parts.substring(0, 2) : parts;
};

const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
        case "applied":
            return <Badge className="bg-amber-500/10 text-amber-700 border border-amber-300 font-medium hover:bg-amber-500/20 rounded-full px-4 py-1 text-sm">Awaiting Faculty Review</Badge>
        case "reviewed":
            return <Badge className="bg-indigo-500/10 text-indigo-700 border border-indigo-300 font-medium hover:bg-indigo-500/20 rounded-full px-4 py-1 text-sm">Mentor Approved</Badge>
        case "shortlisted":
            return <Badge className="bg-sky-500/10 text-sky-700 border border-sky-300 font-medium hover:bg-sky-500/20 rounded-full px-4 py-1 text-sm">Shortlisted</Badge>
        case "rejected":
            return <Badge className="bg-red-500/10 text-red-700 border border-red-300 font-medium hover:bg-red-500/20 rounded-full px-4 py-1 text-sm">Rejected</Badge>
        case "accepted":
            return <Badge className="bg-emerald-500/10 text-emerald-700 border border-emerald-300 font-medium hover:bg-emerald-500/20 rounded-full px-4 py-1 text-sm">Accepted</Badge>
        default:
            return <Badge variant="secondary" className="rounded-full px-4 py-1 text-sm">{status}</Badge>
    }
}

// ✅ Added onViewDetails prop to the interface
export function ApplicationApprovalCard({
    application,
    onViewDetails,
    onApprove,
    onReject,
}: {
    application: ApprovalApplication
    onViewDetails: () => void  // ✅ Added this line
    onApprove: () => void
    onReject: () => void
}) {
    const currentYear = new Date().getFullYear();
    const studentYear = application.studentRel?.batch 
        ? (application.studentRel.batch - currentYear) + 4
        : null;
    
    const normalizedStatus = application.status
        .toString()
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    const isPendingForFacultyReview = application.status === "mentor_approval_needed";

    return (
        <Card className="border-slate-200 shadow-md rounded-xl hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start space-x-4 flex-1">
                        <Avatar className="h-14 w-14 border-2 border-blue-500/50">
                            <AvatarImage
                                src={application.studentRel?.avatar || "/placeholder.svg"}
                                alt={application.studentRel?.name}
                            />
                            <AvatarFallback className="text-lg bg-blue-600 text-white font-semibold">
                                {getStudentInitials(application.studentRel?.name)}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                                <div className="flex-1 min-w-0">
                                    <CardTitle className="text-xl font-bold text-slate-900 truncate">
                                        {application.studentRel?.name}
                                    </CardTitle>
                                    <CardDescription className="text-base text-slate-600">
                                        <span className="font-medium">{application.studentRel?.branch}</span>
                                        {studentYear && ` • Year ${studentYear}`}
                                    </CardDescription>
                                </div>
                                <div className="hidden sm:block">
                                    {getStatusBadge(normalizedStatus)}
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-6 gap-y-1 mt-3 text-sm text-slate-500">
                                <div className="flex items-center gap-1">
                                    <GraduationCap className="h-4 w-4 text-blue-500" />
                                    <span>CGPA: <span className="font-semibold text-slate-700">{application.studentRel?.cgpa || 'N/A'}</span></span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Mail className="h-4 w-4 text-blue-500" />
                                    <span className="truncate">{application.studentRel?.email}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Phone className="h-4 w-4 text-blue-500" />
                                    <span>{application.studentRel?.phone}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="sm:hidden mt-3 pt-2 border-t">
                    {getStatusBadge(normalizedStatus)}
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="p-4 border border-slate-200 bg-slate-50 rounded-xl">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Building2 className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-lg text-slate-800 truncate">{application.opportunityRel.title}</h4>
                            <p className="text-sm text-slate-600 truncate">
                                {application.opportunityRel.companyRel?.name}
                            </p>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-500">
                                <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    <span className="font-medium text-slate-700">{application.opportunityRel.location}</span>
                                </div>
                                <span className="text-slate-300">•</span>
                                <div className="flex items-center gap-1">
                                    <FileText className="h-3 w-3" />
                                    <span className="capitalize">{application.opportunityRel.type}</span>
                                </div>
                                <span className="text-slate-300">•</span>
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>Applied: {new Date(application.appliedAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {application.studentRel?.skills && application.studentRel.skills.length > 0 && (
                    <div>
                        <Label className="text-sm font-semibold text-slate-700 mb-2 block">Student Skills</Label>
                        <div className="flex flex-wrap gap-2">
                            {application.studentRel.skills.slice(0, 5).map((skill, index) => (
                                <Badge 
                                    key={index} 
                                    variant="secondary" 
                                    className="text-xs bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200"
                                >
                                    {skill}
                                </Badge>
                            ))}
                            {application.studentRel.skills.length > 5 && (
                                <Badge 
                                    variant="secondary" 
                                    className="text-xs bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200"
                                >
                                    +{application.studentRel.skills.length - 5} more
                                </Badge>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex items-center pt-4 border-t border-slate-100 gap-3">
                    {/* ✅ Changed from Link to Button with onClick handler */}
                    <Button 
                        variant="outline" 
                        className="flex-1 border-slate-300 text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                        onClick={onViewDetails}
                    >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                    </Button>
                    
                    {isPendingForFacultyReview ? (
                        <>
                            <Button 
                                variant="destructive" 
                                onClick={onReject} 
                                className="flex-1 bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white shadow-sm"
                            >
                                <XCircle className="mr-2 h-4 w-4" />
                                Reject
                            </Button>
                            <Button 
                                onClick={onApprove} 
                                className="flex-1 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white shadow-sm"
                            >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Approve
                            </Button>
                        </>
                    ) : (
                        <Button disabled className="flex-1 bg-slate-200 text-slate-600 border border-slate-300">
                            {application.mentorApproved ? "Already Approved" : normalizedStatus}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
