import { auth } from "@/auth";
import { PrismaClient } from "@/lib/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = async (req: NextRequest) => {
  const session = await auth();

  if (!session || session.user.role !== "student") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const studentId = session.user.id;

  try {
    // Fetch student details
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        name: true,
        email: true,
        branch: true,
        batch: true,
        cgpa: true,
        phone: true,
        skills: true,
        resumes: {
          select: {
            id: true,
          },
        },
        linkedin: true,
        github: true,
        mentorId: true,
      },
    });

    if (!student) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    // Calculate profile completeness
    const profileFields = [
      student.name,
      student.email,
      student.branch,
      student.batch,
      student.cgpa,
      student.phone,
      student.skills && student.skills.length > 0,
      student.resumes && student.resumes.length > 0,
      student.linkedin,
      student.github,
    ];
    const filledFields = profileFields.filter(Boolean).length;
    const profileCompleteness = Math.round((filledFields / profileFields.length) * 100);

    // Get current month date range
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    // Get last month date range for comparison
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    // Applications this month
    const applicationsThisMonth = await prisma.application.count({
      where: {
        studentId,
        appliedAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    // Applications last month for comparison
    const applicationsLastMonth = await prisma.application.count({
      where: {
        studentId,
        appliedAt: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
    });

    // Total applications
    const totalApplications = await prisma.application.count({
      where: { studentId },
    });

    // Applications by status
    const applicationsByStatus = await prisma.application.groupBy({
      by: ["status"],
      where: { studentId },
      _count: { status: true },
    });

    const shortlistedCount = applicationsByStatus.find((a) => a.status === "shortlisted")?._count.status || 0;
    const appliedCount = applicationsByStatus.find((a) => a.status === "applied")?._count.status || 0;
    const acceptedCount = applicationsByStatus.find((a) => a.status === "accepted")?._count.status || 0;
    const rejectedCount = applicationsByStatus.find((a) => a.status === "rejected")?._count.status || 0;

    // Interviews (applications with interviews)
    const interviews = await prisma.interview.findMany({
      where: {
        applicationRel: {
          studentId,
        },
      },
      include: {
        applicationRel: {
          include: {
            opportunityRel: {
              include: {
                companyRel: true,
              },
            },
          },
        },
      },
      orderBy: {
        scheduledAt: "asc",
      },
    });

    const totalInterviews = interviews.length;
    const upcomingInterviews = interviews.filter(
      (i) => new Date(i.scheduledAt) >= now && i.status === "scheduled"
    );
    const scheduledInterviewsCount = upcomingInterviews.length;

    // Format upcoming interviews for display
    const formattedUpcomingInterviews = upcomingInterviews.slice(0, 5).map((interview) => ({
      id: interview.id,
      title: interview.applicationRel.opportunityRel.title,
      company: interview.applicationRel.opportunityRel.companyRel.name,
      scheduledAt: interview.scheduledAt,
      status: interview.status,
      interviewLink: interview.interviewLink,
    }));

    // Internships count
    const internshipsCount = await prisma.internship.count({
      where: { studentId },
    });

    // Active internships
    const activeInternships = await prisma.internship.count({
      where: {
        studentId,
        startDate: { lte: now },
        endDate: { gte: now },
      },
    });

    // Certificates count
    const certificatesCount = await prisma.certificate.count({
      where: { studentId },
    });

    // Projects count
    const projectsCount = await prisma.project.count({
      where: { studentId },
    });

    // Recent opportunities (active, not expired) - show all active opportunities
    const recentOpportunities = await prisma.opportunity.findMany({
      where: {
        status: "active",
        applicationDeadline: { gte: now },
      },
      include: {
        companyRel: true,
        _count: {
          select: { applications: true },
        },
      },
      orderBy: {
        postedAt: "desc",
      },
      take: 4,
    });

    // Check which opportunities the student has already applied to
    const appliedOpportunityIds = await prisma.application.findMany({
      where: { studentId },
      select: { opportunityId: true },
    });
    const appliedIds = new Set(appliedOpportunityIds.map((a) => a.opportunityId));

    const formattedOpportunities = recentOpportunities.map((opp) => ({
      id: opp.id,
      title: opp.title,
      company: opp.companyRel.name,
      companyId: opp.companyId,
      type: opp.type,
      location: opp.location,
      salary: opp.salary,
      applicationDeadline: opp.applicationDeadline,
      applied: appliedIds.has(opp.id),
      applicationsCount: opp._count.applications,
    }));

    // Notifications count (unread)
    const unreadNotifications = await prisma.notification.count({
      where: {
        studentId,
        isRead: false,
      },
    });

    return NextResponse.json({
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
        branch: student.branch,
        batch: student.batch,
        cgpa: student.cgpa,
      },
      profileCompleteness,
      stats: {
        applicationsThisMonth,
        applicationsLastMonth,
        applicationsDiff: applicationsThisMonth - applicationsLastMonth,
        totalApplications,
        shortlistedCount,
        appliedCount,
        acceptedCount,
        rejectedCount,
        totalInterviews,
        scheduledInterviewsCount,
        internshipsCount,
        activeInternships,
        certificatesCount,
        projectsCount,
        unreadNotifications,
      },
      upcomingInterviews: formattedUpcomingInterviews,
      recentOpportunities: formattedOpportunities,
    });
  } catch (error) {
    console.error("Error fetching student dashboard stats:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 }
    );
  }
};
