import { auth } from "@/auth"
import { NextResponse } from "next/server"
import React from "react"
import { Document, Page, Text, View, StyleSheet, pdf, Link } from "@react-pdf/renderer"

// Resume data interface
interface ResumeData {
  name: string
  email: string
  phone: string | null
  branch: string | null
  batch: number | null
  cgpa: number | null
  skills: string[]
  linkedin: string | null
  github: string | null
  summary: string
  projects: {
    title: string
    description: string
    technologies: string[]
    link: string | null
    startDate: string
    endDate: string | null
  }[]
  internships: {
    title: string
    company: string
    duration: string
    description: string
  }[]
  certificates: {
    title: string
    issuer: string
    issueDate: string
    description: string
  }[]
}

// PDF Styles - Classic Technical Resume Template
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.4,
    backgroundColor: "#ffffff",
  },
  // Header
  header: {
    textAlign: "center",
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: "#000000",
    marginBottom: 2,
  },
  contactRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 4,
  },
  contactItem: {
    fontSize: 9,
    color: "#000000",
  },
  contactSeparator: {
    fontSize: 9,
    color: "#666666",
  },
  link: {
    color: "#000000",
    textDecoration: "none",
  },
  // Section
  section: {
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    borderBottom: "1 solid #000000",
    paddingBottom: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#000000",
  },
  // Education
  educationItem: {
    marginBottom: 6,
  },
  educationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 1,
  },
  institutionName: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#000000",
  },
  dateText: {
    fontSize: 10,
    color: "#000000",
  },
  degreeText: {
    fontSize: 10,
    fontStyle: "italic",
    color: "#000000",
  },
  locationText: {
    fontSize: 10,
    fontStyle: "italic",
    color: "#000000",
    textAlign: "right",
  },
  // Skills in columns
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 2,
  },
  skillColumn: {
    width: "25%",
    paddingRight: 8,
  },
  skillItem: {
    fontSize: 9,
    color: "#000000",
    marginBottom: 2,
  },
  bulletText: {
    fontSize: 9,
    color: "#000000",
  },
  // Experience Item
  experienceItem: {
    marginBottom: 8,
  },
  experienceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 1,
  },
  companyName: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#000000",
  },
  roleTitle: {
    fontSize: 10,
    fontStyle: "italic",
    color: "#000000",
    marginBottom: 3,
  },
  bulletPoint: {
    flexDirection: "row",
    marginBottom: 2,
    paddingLeft: 8,
  },
  bullet: {
    width: 8,
    fontSize: 9,
  },
  bulletContent: {
    flex: 1,
    fontSize: 9,
    color: "#000000",
    lineHeight: 1.4,
  },
  // Project Item
  projectItem: {
    marginBottom: 8,
  },
  projectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  projectTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  projectTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#000000",
  },
  projectTech: {
    fontSize: 10,
    fontStyle: "italic",
    color: "#000000",
  },
  projectDate: {
    fontSize: 10,
    color: "#000000",
  },
  // Technical Skills
  techSkillsRow: {
    flexDirection: "row",
    marginBottom: 3,
  },
  techSkillLabel: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#000000",
    width: 130,
  },
  techSkillValue: {
    fontSize: 10,
    color: "#000000",
    flex: 1,
  },
  // Certifications
  certItem: {
    marginBottom: 6,
  },
  certHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 1,
  },
  certName: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#000000",
  },
  certIssuer: {
    fontSize: 10,
    fontStyle: "italic",
    color: "#000000",
  },
  certDate: {
    fontSize: 10,
    color: "#000000",
  },
})

// Helper to split description into bullet points
const splitIntoBullets = (text: string): string[] => {
  if (!text) return []
  // Split by period or newline, filter empty strings
  const sentences = text.split(/[.]\s*/).filter(s => s.trim().length > 10)
  return sentences.slice(0, 4) // Max 4 bullet points
}

// PDF Document Component
const ResumeDocument = ({ data }: { data: ResumeData }) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  const formatDateFull = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  // Group skills into categories (simple heuristic)
  const categorizeSkills = (skills: string[]) => {
    const languages: string[] = []
    const tools: string[] = []
    const frameworks: string[] = []

    const langKeywords = ["python", "java", "javascript", "c++", "c#", "typescript", "go", "rust", "sql", "html", "css", "php", "ruby", "swift", "kotlin"]
    const toolKeywords = ["vs code", "git", "docker", "kubernetes", "aws", "azure", "gcp", "jenkins", "jira", "postman", "figma", "android studio", "eclipse", "intellij"]

    skills.forEach(skill => {
      const lower = skill.toLowerCase()
      if (langKeywords.some(k => lower.includes(k))) {
        languages.push(skill)
      } else if (toolKeywords.some(k => lower.includes(k))) {
        tools.push(skill)
      } else {
        frameworks.push(skill)
      }
    })

    return { languages, tools, frameworks }
  }

  const skillCategories = categorizeSkills(data.skills)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.name}</Text>
          <View style={styles.contactRow}>
            {data.phone && (
              <>
                <Text style={styles.contactItem}>📞 {data.phone}</Text>
                <Text style={styles.contactSeparator}>|</Text>
              </>
            )}
            <Text style={styles.contactItem}>✉ {data.email}</Text>
            {data.linkedin && (
              <>
                <Text style={styles.contactSeparator}>|</Text>
                <Link src={data.linkedin} style={[styles.contactItem, styles.link]}>
                  🔗 linkedin.com/in/{data.linkedin.split('/').pop()}
                </Link>
              </>
            )}
            {data.github && (
              <>
                <Text style={styles.contactSeparator}>|</Text>
                <Link src={data.github} style={[styles.contactItem, styles.link]}>
                  💻 github.com/{data.github.split('/').pop()}
                </Link>
              </>
            )}
          </View>
        </View>

        {/* Professional Summary */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
          </View>
          <Text style={{ fontSize: 10, color: "#000000", lineHeight: 1.4 }}>{data.summary}</Text>
        </View>

        {/* Education */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Education</Text>
          </View>
          <View style={styles.educationItem}>
            <View style={styles.educationRow}>
              <Text style={styles.institutionName}>University</Text>
              <Text style={styles.dateText}>
                {data.batch ? `Sep. ${data.batch - 4} – May ${data.batch}` : "Present"}
              </Text>
            </View>
            <View style={styles.educationRow}>
              <Text style={styles.degreeText}>{data.branch || "Bachelor of Engineering"}</Text>
              <Text style={styles.locationText}>CGPA: {data.cgpa || "N/A"}</Text>
            </View>
          </View>
        </View>

        {/* Experience */}
        {data.internships.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Experience</Text>
            </View>
            {data.internships.map((internship, index) => {
              const bullets = splitIntoBullets(internship.description)
              return (
                <View key={index} style={styles.experienceItem}>
                  <View style={styles.experienceHeader}>
                    <Text style={styles.companyName}>{internship.company}</Text>
                    <Text style={styles.dateText}>{internship.duration}</Text>
                  </View>
                  <Text style={styles.roleTitle}>{internship.title}</Text>
                  {bullets.map((bullet, bIndex) => (
                    <View key={bIndex} style={styles.bulletPoint}>
                      <Text style={styles.bullet}>•</Text>
                      <Text style={styles.bulletContent}>{bullet.trim()}.</Text>
                    </View>
                  ))}
                </View>
              )
            })}
          </View>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Projects</Text>
            </View>
            {data.projects.map((project, index) => {
              const bullets = splitIntoBullets(project.description)
              return (
                <View key={index} style={styles.projectItem}>
                  <View style={styles.projectHeader}>
                    <View style={styles.projectTitleRow}>
                      <Text style={styles.projectTitle}>{project.title}</Text>
                      {project.technologies.length > 0 && (
                        <Text style={styles.projectTech}> | {project.technologies.slice(0, 3).join(", ")}</Text>
                      )}
                    </View>
                    <Text style={styles.projectDate}>{formatDate(project.startDate)}</Text>
                  </View>
                  {bullets.map((bullet, bIndex) => (
                    <View key={bIndex} style={styles.bulletPoint}>
                      <Text style={styles.bullet}>•</Text>
                      <Text style={styles.bulletContent}>{bullet.trim()}.</Text>
                    </View>
                  ))}
                </View>
              )
            })}
          </View>
        )}

        {/* Technical Skills */}
        {data.skills.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Technical Skills</Text>
            </View>
            {skillCategories.languages.length > 0 && (
              <View style={styles.techSkillsRow}>
                <Text style={styles.techSkillLabel}>Languages:</Text>
                <Text style={styles.techSkillValue}>{skillCategories.languages.join(", ")}</Text>
              </View>
            )}
            {skillCategories.tools.length > 0 && (
              <View style={styles.techSkillsRow}>
                <Text style={styles.techSkillLabel}>Developer Tools:</Text>
                <Text style={styles.techSkillValue}>{skillCategories.tools.join(", ")}</Text>
              </View>
            )}
            {skillCategories.frameworks.length > 0 && (
              <View style={styles.techSkillsRow}>
                <Text style={styles.techSkillLabel}>Technologies/Frameworks:</Text>
                <Text style={styles.techSkillValue}>{skillCategories.frameworks.join(", ")}</Text>
              </View>
            )}
          </View>
        )}

        {/* Certifications */}
        {data.certificates.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Certifications</Text>
            </View>
            {data.certificates.map((cert, index) => {
              const bullets = splitIntoBullets(cert.description)
              return (
                <View key={index} style={styles.certItem}>
                  <View style={styles.certHeader}>
                    <Text style={styles.certName}>{cert.title}</Text>
                    <Text style={styles.certDate}>{formatDate(cert.issueDate)}</Text>
                  </View>
                  <Text style={styles.certIssuer}>{cert.issuer}</Text>
                  {bullets.map((bullet, bIndex) => (
                    <View key={bIndex} style={styles.bulletPoint}>
                      <Text style={styles.bullet}>•</Text>
                      <Text style={styles.bulletContent}>{bullet.trim()}.</Text>
                    </View>
                  ))}
                </View>
              )
            })}
          </View>
        )}
      </Page>
    </Document>
  )
}

export const POST = async (request: Request) => {
  const session = await auth()

  if (!session || session.user.role !== "student") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { resume } = await request.json()

    if (!resume) {
      return NextResponse.json({ error: "Resume data is required" }, { status: 400 })
    }

    // Generate PDF blob
    const pdfBlob = await pdf(<ResumeDocument data={resume} />).toBlob()

    // Convert blob to buffer for response
    const buffer = await pdfBlob.arrayBuffer()

    // Return PDF as downloadable file
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${resume.name.replace(/\s+/g, "_")}_Resume.pdf"`,
      },
    })
  } catch (error) {
    console.error("Failed to generate PDF:", error)
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 })
  }
}
