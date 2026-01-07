import { auth } from "@/auth"
import { PrismaClient } from "@/lib/generated/prisma"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

const HF_API_URL = "https://router.huggingface.co/hf-inference/models/mistralai/Mistral-7B-Instruct-v0.3/v1/chat/completions"

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

async function callAI(prompt: string, maxTokens: number = 300): Promise<string | null> {
  const apiToken = process.env.HF_API_TOKEN

  if (!apiToken) {
    return null
  }

  try {
    const response = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistralai/Mistral-7B-Instruct-v0.3",
        messages: [
          { role: "user", content: prompt }
        ],
        max_tokens: maxTokens,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data.choices?.[0]?.message?.content?.trim() || null
  } catch (error) {
    console.error("Error calling AI:", error)
    return null
  }
}

async function generateSummary(studentData: {
  name: string
  branch: string | null
  skills: string[]
  hasProjects: boolean
  hasInternships: boolean
}): Promise<string> {
  const prompt = `Write a comprehensive, professional 4-5 sentence resume summary for a ${studentData.branch || "Engineering"} student. 
Focus on their technical abilities, passion for software development, key strengths from their skills: ${studentData.skills.slice(0, 8).join(", ") || "various technologies"}.
${studentData.hasInternships ? "Highlight their industry experience and ability to work in professional environments." : ""}
${studentData.hasProjects ? "Highlight their hands-on project experience and problem-solving capabilities." : ""}

DO NOT mention specific numbers like "0 projects" or "1 internship". 
Write a strong narrative paragraph about their career goals, technical proficiency, and value they bring as a developer.
Write ONLY the summary paragraph, no labels or headers.`

  const result = await callAI(prompt, 300)

  if (result) {
    return result
  }

  // Fallback summary
  const skillsText = studentData.skills.slice(0, 3).join(", ") || "modern technologies"
  return `Passionate and dedicated ${studentData.branch || "Engineering"} student with a comprehensive skill set in ${skillsText}. Demonstrates exceptional problem-solving abilities and a strong commitment to continuous professional growth. Eager to leverage technical knowledge and innovative thinking to contribute effectively to challenging real-world projects. Possesses a solid foundation in software development principles with a keen focus on delivering high-quality, scalable solutions and collaborating within cross-functional teams.`
}

async function generateInternshipDescription(internship: {
  title: string
  company: string
}): Promise<string> {
  const prompt = `Write a detailed 3-4 sentence professional description for a resume about working as a "${internship.title}" at "${internship.company}".
Focus on specific responsibilities, technical skills applied, and tangible contributions or impact.
Write ONLY the description, no labels. Use strong action verbs and professional language.`

  const result = await callAI(prompt, 250)

  if (result) {
    return result
  }

  // Fallback description
  return `Actively contributed to ${internship.company}'s core development initiatives as a ${internship.title}, working closely with senior developers. Applied advanced technical skills to design and implement robust solutions, ensuring high code quality and performance. Gained extensive hands-on experience in professional software development lifecycles and collaborative team workflows.`
}

async function generateCertificateDescription(certificate: {
  title: string
  issuer: string
}): Promise<string> {
  const prompt = `Write a detailed 2-3 sentence professional description for a resume about earning the certification "${certificate.title}" from "${certificate.issuer}".
Focus on the specific concepts mastered, skills acquired, and their relevance to professional development.
Write ONLY the description, no labels.`

  const result = await callAI(prompt, 150)

  if (result) {
    return result
  }

  // Fallback description
  return `Demonstrated advanced proficiency in ${certificate.title.toLowerCase().includes("python") ? "Python programming" : certificate.title.toLowerCase().includes("web") ? "web development" : "relevant technical concepts"} through rigorous coursework and practical assessments. Validated comprehensive understanding of industry-standard practices and methodologies.`
}

async function generateProjectDescription(project: {
  title: string
  technologies: string[]
  existingDescription: string
}): Promise<string> {
  // If there's already a good description, enhance it slightly
  if (project.existingDescription && project.existingDescription.length > 80) {
    return project.existingDescription
  }

  const techStack = project.technologies.join(", ") || "various technologies"
  const prompt = `Write a detailed 3-4 sentence professional project description for a resume about a project titled "${project.title}" built using ${techStack}.
Focus on the specific problem solved, the technical architecture, implementation details, and the resulting impact or functionality.
Write ONLY the description, no labels. Use strong action verbs.`

  const result = await callAI(prompt, 250)

  if (result) {
    return result
  }

  // Fallback description
  return `Architected and developed ${project.title}, a complex solution utilizing ${techStack} to address specific user needs. Implemented core functionality with a strong focus on clean, maintainable code and scalable architecture. Successfully demonstrated the ability to translate requirements into a practical, working application with a polished user experience.`
}

export const POST = async () => {
  const session = await auth()

  if (!session || session.user.role !== "student") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Fetch complete student profile
    const student = await prisma.student.findUnique({
      where: { id: session.user.id },
      include: {
        projects: {
          orderBy: { startDate: "desc" },
          take: 5
        },
        internships: {
          include: {
            opportunityRel: {
              include: {
                companyRel: true
              }
            }
          },
          orderBy: { startDate: "desc" },
          take: 5
        },
        certificates: {
          orderBy: { issueDate: "desc" },
          take: 5
        }
      }
    })

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    // Generate AI-enhanced summary
    const summary = await generateSummary({
      name: student.name,
      branch: student.branch,
      skills: student.skills,
      hasProjects: student.projects.length > 0,
      hasInternships: student.internships.length > 0
    })

    // Generate descriptions for internships
    const internshipsWithDescriptions = await Promise.all(
      student.internships.map(async (i) => {
        const existingDesc = i.performanceReview
        let description = existingDesc

        if (!existingDesc || existingDesc.length < 30) {
          description = await generateInternshipDescription({
            title: i.opportunityRel.title,
            company: i.opportunityRel.companyRel.name
          })
        }

        return {
          title: i.opportunityRel.title,
          company: i.opportunityRel.companyRel.name,
          duration: `${i.startDate.toLocaleDateString("en-US", { month: "short", year: "numeric" })} - ${i.endDate.toLocaleDateString("en-US", { month: "short", year: "numeric" })}`,
          description: description || ""
        }
      })
    )

    // Generate descriptions for certificates
    const certificatesWithDescriptions = await Promise.all(
      student.certificates.map(async (c) => {
        const description = await generateCertificateDescription({
          title: c.title,
          issuer: c.issuer
        })

        return {
          title: c.title,
          issuer: c.issuer,
          issueDate: c.issueDate.toISOString(),
          description: description || ""
        }
      })
    )

    // Generate/enhance project descriptions
    const projectsWithDescriptions = await Promise.all(
      student.projects.map(async (p) => {
        const description = await generateProjectDescription({
          title: p.title,
          technologies: p.technologies,
          existingDescription: p.description
        })

        return {
          title: p.title,
          description: description,
          technologies: p.technologies,
          link: p.link,
          startDate: p.startDate.toISOString(),
          endDate: p.endDate?.toISOString() || null
        }
      })
    )

    // Format resume data
    const resumeData: ResumeData = {
      name: student.name,
      email: student.email,
      phone: student.phone,
      branch: student.branch,
      batch: student.batch,
      cgpa: student.cgpa,
      skills: student.skills,
      linkedin: student.linkedin,
      github: student.github,
      summary,
      projects: projectsWithDescriptions,
      internships: internshipsWithDescriptions,
      certificates: certificatesWithDescriptions
    }

    return NextResponse.json({ resume: resumeData })
  } catch (error) {
    console.error("Failed to generate resume:", error)
    return NextResponse.json({ error: "Failed to generate resume" }, { status: 500 })
  }
}
