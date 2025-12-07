// src/components/faculty/ApplicationApprovalCard.tsx - UPDATED UI

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
    FileText,
    GraduationCap,
    Mail,
    MapPin,
    Phone,
    XCircle
} from "lucide-react"

// --- Helper Functions for UI Consistency ---

const getStudentInitials = (name: string | undefined): string => {
    if (!name) return "NA";
    const parts = name.split(" ").map((n) => n[0]).join("");
    return parts.length > 2 ? parts.substring(0, 2) : parts;
};

const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
        case "applied":
            // Pending Review by Mentor/Faculty
            return <Badge className="bg-amber-500/10 text-amber-700 border border-amber-300 font-medium hover:bg-amber-500/20">Awaiting Faculty Review</Badge>
        case "reviewed":
            // Mentor has approved, waiting for employer review
            return <Badge className="bg-sky-500/10 text-sky-700 border border-sky-300 font-medium hover:bg-sky-500/20">Mentor Approved</Badge>
        case "shortlisted":
            // Employer is reviewing
            return <Badge className="bg-sky-500/10 text-sky-700 border border-sky-300 font-medium hover:bg-sky-500/20">Shortlisted</Badge>
        case "rejected":
            return <Badge className="bg-red-500/10 text-red-700 border border-red-300 font-medium hover:bg-red-500/20">Rejected</Badge>
        case "accepted":
            return <Badge className="bg-emerald-500/10 text-emerald-700 border border-emerald-300 font-medium hover:bg-emerald-500/20">Accepted</Badge>
        default:
            return <Badge variant="secondary">{status}</Badge>
    }
}

// --- ApplicationApprovalCard Component ---

export function ApplicationApprovalCard({
    application,
    onViewDetails,
    onApprove,
    onReject,
}: {
    application: ApprovalApplication
    onViewDetails: () => void
    onApprove: () => void
    onReject: () => void
}) {
    // Calculate current year based on batch (assuming batch is graduation year)
    const currentYear = new Date().getFullYear();
    const studentYear = application.studentRel?.batch 
        ? (application.studentRel.batch - currentYear) + 4 // e.g., 2028 - 2025 = 3 (Final year) -> 3+1 = Year 4, assuming a 4-year degree
        : null;
    
    // Status normalization for badge
    const normalizedStatus = application.status.toString().split("_").map(w => w[0].toUpperCase() + w.slice(1)).join(" ");

    // Determine if actions should be visible
    const isPendingForFacultyReview = application.status === 'applied' && application.mentorApproved === false;


    return (
        <Card className="border-slate-200 bg-white shadow-md rounded-xl hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start space-x-4 flex-1">
                        {/* Student Avatar */}
                        <Avatar className="h-14 w-14 border-2 border-sky-200">
                            <AvatarImage
                                src={application.studentRel?.avatar || "/placeholder.svg"}
                                alt={application.studentRel?.name}
                            />
                            {/* Improved fallback UI */}
                            <AvatarFallback className="text-lg bg-sky-600 text-white font-semibold">
                                {getStudentInitials(application.studentRel?.name)}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                                <div className="flex-1 min-w-0">
                                    {/* Student Name */}
                                    <CardTitle className="text-xl font-bold text-slate-900 truncate">
                                        {application.studentRel?.name}
                                    </CardTitle>
                                    {/* Branch and Year */}
                                    <CardDescription className="text-base text-slate-600">
                                        <span className="font-medium">{application.studentRel?.branch}</span>
                                        {studentYear && ` • Year ${studentYear}`}
                                    </CardDescription>
                                </div>
                                {/* Status Badge */}
                                <div className="hidden sm:block">
                                    {getStatusBadge(normalizedStatus)}
                                </div>
                            </div>

                            {/* Contact & CGPA Info */}
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-1 mt-3 text-sm text-slate-500">
                                <div className="flex items-center gap-1">
                                    <GraduationCap className="h-4 w-4 text-sky-600" />
                                    <span>CGPA: <span className="font-semibold text-slate-700">{application.studentRel?.cgpa || 'N/A'}</span></span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Mail className="h-4 w-4 text-sky-600" />
                                    <span className="truncate">{application.studentRel?.email}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Phone className="h-4 w-4 text-sky-600" />
                                    <span>{application.studentRel?.phone}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Mobile Status Badge */}
                <div className="sm:hidden mt-3 pt-2 border-t border-slate-100">
                    {getStatusBadge(normalizedStatus)}
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Job/Company Info Block - Subtle Accent */}
                <div className="p-4 border border-slate-200 bg-slate-50 rounded-xl">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-white border border-slate-200 rounded-lg shadow-sm">
                            <Building2 className="h-5 w-5 text-sky-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            {/* Job Title */}
                            <h4 className="font-bold text-lg text-slate-800 truncate">{application.opportunityRel.title}</h4>
                            {/* Company Name */}
                            <p className="text-sm text-slate-600 truncate font-medium">
                                {application.opportunityRel.companyRel?.name}
                            </p>
                            {/* Opportunity Details */}
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-500">
                                <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3 text-sky-600" />
                                    <span className="font-medium text-slate-700">{application.opportunityRel.location}</span>
                                </div>
                                <span className="text-slate-300">•</span>
                                <div className="flex items-center gap-1">
                                    <FileText className="h-3 w-3 text-sky-600" />
                                    <span className="capitalize">{application.opportunityRel.type}</span>
                                </div>
                                <span className="text-slate-300">•</span>
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3 text-sky-600" />
                                    <span>Applied: {new Date(application.appliedAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Skills Section */}
                {application.studentRel?.skills && application.studentRel.skills.length > 0 && (
                    <div>
                        <Label className="text-sm font-semibold text-slate-700 mb-2 block">Student Skills</Label>
                        <div className="flex flex-wrap gap-2">
                            {application.studentRel.skills.slice(0, 5).map((skill, index) => (
                                <Badge 
                                    key={index} 
                                    className="text-xs bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100"
                                >
                                    {skill}
                                </Badge>
                            ))}
                            {application.studentRel.skills.length > 5 && (
                                <Badge 
                                    className="text-xs bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200"
                                >
                                    +{application.studentRel.skills.length - 5} more
                                </Badge>
                            )}
                        </div>
                    </div>
                )}

                {/* Action Buttons - Use consistent, clear full-width style */}
                <div className="flex items-center pt-4 border-t border-slate-100 gap-3">
                    <Button 
                        variant="outline" 
                        onClick={onViewDetails} 
                        className="flex-1 border-slate-300 text-slate-700 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-300"
                    >
                        <FileText className="mr-2 h-4 w-4" />
                        View Full Details
                    </Button>
                    
                    {isPendingForFacultyReview ? (
                        <>
                            <Button 
                                variant="destructive" 
                                onClick={onReject} 
                                className="flex-1 bg-red-500 hover:bg-red-600"
                            >
                                <XCircle className="mr-2 h-4 w-4" />
                                Reject
                            </Button>
                            <Button 
                                onClick={onApprove} 
                                className="flex-1 bg-sky-600 hover:bg-sky-700 text-white"
                            >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Approve
                            </Button>
                        </>
                    ) : (
                        // Display status of review if not pending
                        <Button disabled className="flex-1 bg-slate-200 text-slate-600 border border-slate-300">
                            {application.mentorApproved ? "Already Approved" : normalizedStatus}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}