interface OpportunityEmailData {
  studentName: string
  opportunityTitle: string
  companyName: string
  location: string
  type: string
  salary?: string
  deadline: string
  description: string
  skillsRequired: string[]
  eligibleDepartments: string[]
  opportunityUrl: string
}

export function newOpportunityTemplate(data: OpportunityEmailData): string {
  const {
    studentName,
    opportunityTitle,
    companyName,
    location,
    type,
    salary,
    deadline,
    description,
    skillsRequired,
    eligibleDepartments,
    opportunityUrl,
  } = data

  const skillsList = skillsRequired.map((skill) => `<li style="margin: 4px 0;">${skill}</li>`).join("")
  const departmentsList = eligibleDepartments.join(", ")

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Opportunity Alert</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f1f5f9;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 32px 40px; background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%); border-radius: 16px 16px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">🎯 New Opportunity Alert!</h1>
              <p style="margin: 8px 0 0 0; color: #e0f2fe; font-size: 14px;">A new opportunity matching your profile is available</p>
            </td>
          </tr>
          
          <!-- Greeting -->
          <tr>
            <td style="padding: 32px 40px 16px 40px;">
              <p style="margin: 0; color: #334155; font-size: 16px;">Hi <strong>${studentName}</strong>,</p>
              <p style="margin: 12px 0 0 0; color: #64748b; font-size: 14px; line-height: 1.6;">
                Great news! A new opportunity has been posted that might interest you. Check out the details below:
              </p>
            </td>
          </tr>
          
          <!-- Opportunity Card -->
          <tr>
            <td style="padding: 0 40px;">
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
                <tr>
                  <td style="padding: 24px;">
                    <h2 style="margin: 0 0 8px 0; color: #0f172a; font-size: 20px; font-weight: 600;">${opportunityTitle}</h2>
                    <p style="margin: 0 0 16px 0; color: #3b82f6; font-size: 16px; font-weight: 500;">${companyName}</p>
                    
                    <!-- Info Pills -->
                    <table role="presentation" style="border-collapse: collapse;">
                      <tr>
                        <td style="padding: 4px 12px; background-color: #f0f9ff; border-radius: 20px; margin-right: 8px;">
                          <span style="color: #0369a1; font-size: 12px; font-weight: 500;">📍 ${location}</span>
                        </td>
                        <td style="width: 8px;"></td>
                        <td style="padding: 4px 12px; background-color: #f0f9ff; border-radius: 20px;">
                          <span style="color: #0369a1; font-size: 12px; font-weight: 500; text-transform: capitalize;">💼 ${type}</span>
                        </td>
                        ${
                          salary
                            ? `
                        <td style="width: 8px;"></td>
                        <td style="padding: 4px 12px; background-color: #ecfdf5; border-radius: 20px;">
                          <span style="color: #047857; font-size: 12px; font-weight: 500;">💰 ₹${salary}</span>
                        </td>
                        `
                            : ""
                        }
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Description -->
          <tr>
            <td style="padding: 24px 40px;">
              <h3 style="margin: 0 0 12px 0; color: #334155; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">About the Role</h3>
              <p style="margin: 0; color: #64748b; font-size: 14px; line-height: 1.6;">
                ${description.length > 300 ? description.substring(0, 300) + "..." : description}
              </p>
            </td>
          </tr>
          
          <!-- Skills Required -->
          <tr>
            <td style="padding: 0 40px 24px 40px;">
              <h3 style="margin: 0 0 12px 0; color: #334155; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Skills Required</h3>
              <ul style="margin: 0; padding-left: 20px; color: #64748b; font-size: 14px;">
                ${skillsList}
              </ul>
            </td>
          </tr>
          
          <!-- Eligible Departments -->
          <tr>
            <td style="padding: 0 40px 24px 40px;">
              <h3 style="margin: 0 0 8px 0; color: #334155; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Eligible Departments</h3>
              <p style="margin: 0; color: #64748b; font-size: 14px;">${departmentsList}</p>
            </td>
          </tr>
          
          <!-- Deadline Warning -->
          <tr>
            <td style="padding: 0 40px 24px 40px;">
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
                <tr>
                  <td style="padding: 12px 16px;">
                    <p style="margin: 0; color: #92400e; font-size: 14px;">
                      <strong>⏰ Application Deadline:</strong> ${deadline}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- CTA Button -->
          <tr>
            <td style="padding: 0 40px 32px 40px;" align="center">
              <a href="${opportunityUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%); color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px; box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.4);">
                View Opportunity Details
              </a>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #f8fafc; border-radius: 0 0 16px 16px; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 8px 0; color: #64748b; font-size: 12px; text-align: center;">
                This email was sent by the Placement Cell. If you have any questions, please contact us.
              </p>
              <p style="margin: 0; color: #94a3b8; font-size: 12px; text-align: center;">
                © ${new Date().getFullYear()} Placement Portal. All rights reserved.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}
