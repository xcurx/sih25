import { auth } from "@/auth"
import { NextRequest, NextResponse } from "next/server"

type GenerateRequestBody = {
  jobTitle?: string
  companyName?: string
  jobDescription?: string
  skills?: string[]
  requirements?: string[]
}

type QAItem = {
  question: string
  answer: string
}

const buildLocalQuestionSet = ({
  jobTitle,
  companyName,
  description,
  skills,
  requirements,
}: {
  jobTitle: string
  companyName?: string
  description: string
  skills: string[]
  requirements: string[]
}): QAItem[] => {
  const trimmedSkills = skills.filter(Boolean)
  const trimmedRequirements = requirements.filter(Boolean)
  const summaryPoints = description
    .split(/[\n\.]/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
  const primaryFocus = summaryPoints.slice(0, 2)
  const primarySkill = trimmedSkills[0]
  const secondarySkill = trimmedSkills[1]
  const requirementSnippet = trimmedRequirements.slice(0, 2)
  const companyLabel = companyName || "the company"

  const questions: QAItem[] = []

  questions.push({
    question: `How would you position yourself for the ${jobTitle} role at ${companyLabel}?`,
    answer: `I would begin by summarizing the most relevant results that align with ${companyLabel}'s product and team priorities. Specifically, I would highlight my experience with ${
      primarySkill || "the core technologies mentioned"
    } and tie it back to the business focus described in the job overview.`,
  })

  if (primarySkill) {
    questions.push({
      question: `Can you walk me through a project where you applied ${primarySkill}?`,
      answer: `A recent project required heavy use of ${primarySkill}. I led the effort by defining acceptance criteria, setting up instrumentation, and validating the solution end-to-end. The outcome improved key KPIs and mirrors the expectations listed for this role.`,
    })
  }

  if (requirementSnippet.length) {
    questions.push({
      question: `How would you handle ${
        requirementSnippet[0]
      } if you joined ${companyLabel}?`,
      answer: `I would start by breaking the requirement into measurable milestones, collaborating with cross-functional teams, and ensuring we have reliable telemetry. A similar initiative I owned helped us de-risk rollout and shorten feedback loops.`,
    })
  }

  if (secondarySkill) {
    questions.push({
      question: `The job description emphasizes ${secondarySkill}. What makes you confident here?`,
      answer: `My background includes multiple deliveries in ${secondarySkill}. I typically begin by auditing existing gaps, drafting an execution plan, and then pairing with teammates to ensure the design meets both technical and user-facing constraints.`,
    })
  }

  questions.push({
    question: "Describe your approach to behavioral or stakeholder questions for this opportunity.",
    answer:
      "I map my responses to the STAR format, focusing on fast context-setting, quantifying the impact, and showing how I partner with PMs, designers, and leadership. This keeps the conversation structured and relevant to the hiring panel.",
  })

  if (primaryFocus.length) {
    questions.push({
      question: "Based on the team's focus, what would be your first 30-60-90 day priorities?",
      answer: `In the first month I would build relationships, understand the current deployment pipeline, and document quick wins described in the job summary: ${
        primaryFocus[0]
      }. Next, I would tackle deeper optimization areas like ${
        primaryFocus[1] || "the remaining scope mentioned"
      } to accelerate impact.`,
    })
  }

  return questions.slice(0, 5)
}

export const POST = async (req: NextRequest) => {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const body: GenerateRequestBody = await req.json()
    const { jobTitle, companyName, jobDescription, skills = [], requirements = [] } = body

    if (!jobTitle || !jobDescription) {
      return NextResponse.json(
        { message: "jobTitle and jobDescription are required." },
        { status: 400 },
      )
    }

    const questions = buildLocalQuestionSet({
      jobTitle,
      companyName,
      description: jobDescription,
      skills,
      requirements,
    })

    return NextResponse.json({ questions })
  } catch (error) {
    console.error("Interview prep generation failed:", error)
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 })
    }
    return NextResponse.json({ message: "Failed to generate interview prep." }, { status: 500 })
  }
}
