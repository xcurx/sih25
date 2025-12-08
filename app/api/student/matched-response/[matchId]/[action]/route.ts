import { PrismaClient } from "@/lib/generated/prisma"
import { NextRequest, NextResponse } from "next/server"

const prisma = new PrismaClient()

// This endpoint handles student responses to matched opportunity emails
// It's called when students click "Accept" or "Reject" in the email
export const GET = async (req: NextRequest, context: { params: Promise<{ matchId: string; action: string }> }) => {
    const { matchId, action } = await context.params

    // Validate action
    if (action !== "accept" && action !== "reject") {
        return new Response(getErrorHTML("Invalid action. Please use the links provided in the email."), {
            status: 400,
            headers: { "Content-Type": "text/html" },
        })
    }

    try {
        // Find the matched student record
        const matchedStudent = await prisma.matchedStudent.findUnique({
            where: { id: matchId },
            include: {
                studentRel: {
                    select: { name: true }
                },
                opportunityRel: {
                    select: { title: true, companyRel: { select: { name: true } } }
                }
            }
        })

        if (!matchedStudent) {
            return new Response(getErrorHTML("This link is no longer valid or the match has been removed."), {
                status: 404,
                headers: { "Content-Type": "text/html" },
            })
        }

        // Check if already responded
        if (matchedStudent.status !== "pending") {
            return new Response(getAlreadyRespondedHTML(
                matchedStudent.status,
                matchedStudent.opportunityRel.title,
                matchedStudent.opportunityRel.companyRel?.name || "Company"
            ), {
                status: 200,
                headers: { "Content-Type": "text/html" },
            })
        }

        // Update the status
        const newStatus = action === "accept" ? "accepted" : "rejected"
        await prisma.matchedStudent.update({
            where: { id: matchId },
            data: { status: newStatus }
        })

        // Return success HTML page
        return new Response(getSuccessHTML(
            newStatus,
            matchedStudent.studentRel.name,
            matchedStudent.opportunityRel.title,
            matchedStudent.opportunityRel.companyRel?.name || "Company"
        ), {
            status: 200,
            headers: { "Content-Type": "text/html" },
        })
    } catch (error) {
        console.error("Error updating matched student status:", error)
        return new Response(getErrorHTML("Something went wrong. Please try again later or contact the placement cell."), {
            status: 500,
            headers: { "Content-Type": "text/html" },
        })
    }
}

function getSuccessHTML(status: string, studentName: string, opportunityTitle: string, companyName: string): string {
    const isAccepted = status === "accepted"
    const bgColor = isAccepted ? "#10b981" : "#ef4444"
    const lightBg = isAccepted ? "#ecfdf5" : "#fef2f2"
    const icon = isAccepted ? "✓" : "✗"
    const title = isAccepted ? "Interest Confirmed!" : "Response Recorded"
    const message = isAccepted 
        ? `Thank you for your interest in the <strong>${opportunityTitle}</strong> position at <strong>${companyName}</strong>. The placement cell has been notified and may reach out to you with next steps.`
        : `Your response has been recorded. We'll continue to match you with other opportunities that fit your profile.`

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 24px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
            max-width: 480px;
            width: 100%;
            overflow: hidden;
        }
        .header {
            background: ${bgColor};
            padding: 40px;
            text-align: center;
        }
        .icon {
            width: 80px;
            height: 80px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 16px;
            font-size: 40px;
            color: white;
        }
        .header h1 {
            color: white;
            font-size: 28px;
            font-weight: 700;
        }
        .content {
            padding: 40px;
            text-align: center;
        }
        .greeting {
            color: #334155;
            font-size: 18px;
            margin-bottom: 16px;
        }
        .message {
            color: #64748b;
            font-size: 15px;
            line-height: 1.7;
            margin-bottom: 24px;
        }
        .info-box {
            background: ${lightBg};
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 24px;
        }
        .info-box p {
            color: #475569;
            font-size: 14px;
        }
        .footer {
            border-top: 1px solid #e2e8f0;
            padding: 24px;
            text-align: center;
        }
        .footer p {
            color: #94a3b8;
            font-size: 13px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="icon">${icon}</div>
            <h1>${title}</h1>
        </div>
        <div class="content">
            <p class="greeting">Hi ${studentName}!</p>
            <p class="message">${message}</p>
            <div class="info-box">
                <p><strong>${opportunityTitle}</strong><br>${companyName}</p>
            </div>
        </div>
        <div class="footer">
            <p>You can close this window now.</p>
        </div>
    </div>
</body>
</html>
`
}

function getAlreadyRespondedHTML(status: string, opportunityTitle: string, companyName: string): string {
    const statusText = status === "accepted" ? "expressed interest in" : "declined"
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Already Responded</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 24px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
            max-width: 480px;
            width: 100%;
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            padding: 40px;
            text-align: center;
        }
        .icon {
            width: 80px;
            height: 80px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 16px;
            font-size: 40px;
        }
        .header h1 {
            color: white;
            font-size: 24px;
            font-weight: 700;
        }
        .content {
            padding: 40px;
            text-align: center;
        }
        .message {
            color: #64748b;
            font-size: 15px;
            line-height: 1.7;
        }
        .footer {
            border-top: 1px solid #e2e8f0;
            padding: 24px;
            text-align: center;
        }
        .footer p {
            color: #94a3b8;
            font-size: 13px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="icon">ℹ️</div>
            <h1>Already Responded</h1>
        </div>
        <div class="content">
            <p class="message">
                You have already ${statusText} the <strong>${opportunityTitle}</strong> position at <strong>${companyName}</strong>. 
                No further action is needed.
            </p>
        </div>
        <div class="footer">
            <p>You can close this window now.</p>
        </div>
    </div>
</body>
</html>
`
}

function getErrorHTML(message: string): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Error</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 24px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
            max-width: 480px;
            width: 100%;
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
            padding: 40px;
            text-align: center;
        }
        .icon {
            width: 80px;
            height: 80px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 16px;
            font-size: 40px;
        }
        .header h1 {
            color: white;
            font-size: 24px;
            font-weight: 700;
        }
        .content {
            padding: 40px;
            text-align: center;
        }
        .message {
            color: #64748b;
            font-size: 15px;
            line-height: 1.7;
        }
        .footer {
            border-top: 1px solid #e2e8f0;
            padding: 24px;
            text-align: center;
        }
        .footer p {
            color: #94a3b8;
            font-size: 13px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="icon">⚠️</div>
            <h1>Oops!</h1>
        </div>
        <div class="content">
            <p class="message">${message}</p>
        </div>
        <div class="footer">
            <p>Please contact the placement cell for assistance.</p>
        </div>
    </div>
</body>
</html>
`
}
