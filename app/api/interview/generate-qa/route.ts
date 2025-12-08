import { auth } from "@/auth"
import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

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

export const POST = async (req: NextRequest) => {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { message: "OPENAI_API_KEY is not configured on the server." },
      { status: 500 }
    )
  }

  try {
    const body: GenerateRequestBody = await req.json()
    const { jobTitle, companyName, jobDescription, skills = [], requirements = [] } = body

    if (!jobTitle || !jobDescription) {
      return NextResponse.json(
        { message: "jobTitle and jobDescription are required." },
        { status: 400 }
      )
    }

    const systemPrompt = `
You are an experienced technical interviewer. Generate five high-quality, role-specific interview questions
and model answers tailored to the candidate's upcoming interview.
Respond strictly with valid JSON matching this schema:
{
  "questions": [
    { "question": string, "answer": string }
  ]
}

Use the provided context to keep the questions specific and avoid duplicates.
`

    const userPrompt = `
Job Title: ${jobTitle}
Company: ${companyName || "N/A"}
Job Description: ${jobDescription}
Key Skills: ${skills.join(", ") || "Not specified"}
Requirements: ${requirements.join(", ") || "Not specified"}

Focus on behavioral + technical coverage where relevant. Keep answers concise (2-4 sentences).
`

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini"

    let rawOutput: string | undefined

    if ((client as any).responses?.create) {
      const response = await client.responses.create({
        model,
        input: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.5,
      })
      rawOutput = response.output_text?.trim()
    } else {
      const completion = await client.chat.completions.create({
        model,
        temperature: 0.5,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      })
      rawOutput = completion.choices?.[0]?.message?.content?.trim()
    }

    if (!rawOutput) {
      throw new Error("OpenAI returned an empty response.")
    }

    let parsed: { questions: QAItem[] }
    try {
      parsed = JSON.parse(rawOutput)
    } catch {
      // Attempt to extract JSON substring
      const jsonMatch = rawOutput.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error("Failed to parse AI response.")
      }
      parsed = JSON.parse(jsonMatch[0])
    }

    if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) {
      throw new Error("Generated response did not include questions.")
    }

    const trimmed = parsed.questions.slice(0, 5).map((qa) => ({
      question: qa.question?.trim(),
      answer: qa.answer?.trim(),
    }))

    return NextResponse.json({ questions: trimmed })
  } catch (error) {
    console.error("Interview prep generation failed:", error)
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 })
    }
    return NextResponse.json({ message: "Failed to generate interview prep." }, { status: 500 })
  }
}
