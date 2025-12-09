import { auth } from "@/auth"
import { NextRequest, NextResponse } from "next/server"

type ScoreRequest = {
  responses: {
    question: string
    userAnswer: string
    expectedAnswer: string
  }[]
}

const STOP_WORDS = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "to",
  "of",
  "in",
  "for",
  "on",
  "with",
  "at",
  "by",
  "from",
  "is",
  "are",
  "was",
  "were",
  "be",
  "this",
  "that",
  "as",
  "it",
  "we",
  "i",
  "our",
  "their",
  "they",
  "you",
])

const tokenize = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w))

const buildBigrams = (tokens: string[]) =>
  tokens
    .map((_, index) => `${tokens[index]} ${tokens[index + 1]}`)
    .slice(0, Math.max(0, tokens.length - 1))

const intersectionScore = (userSet: Set<string>, expectedSet: Set<string>) => {
  if (!expectedSet.size) return 0
  let overlap = 0
  expectedSet.forEach((token) => {
    if (userSet.has(token)) overlap++
  })
  return overlap / expectedSet.size
}

const lcsRatio = (a: string, b: string) => {
  if (!a.length || !b.length) return 0
  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0))
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }
  return dp[a.length][b.length] / Math.max(a.length, b.length)
}

const summarizeMissingConcepts = (user: Set<string>, expected: Set<string>) => {
  const missing: string[] = []
  expected.forEach((word) => {
    if (!user.has(word) && missing.length < 3) {
      missing.push(word)
    }
  })
  return missing
}

const buildFeedback = (score: number, missingConcepts: string[]) => {
  if (score >= 80) return "Strong response. You communicated the right intent and supporting details."
  if (score >= 60)
    return `Good attempt. Clarify impact and expand on ${missingConcepts.join(", ") || "key results"}.`
  if (score >= 40)
    return `Partially aligned. Make sure to mention ${missingConcepts.join(", ") || "your responsibilities"} and quantify outcomes.`
  return `Answer feels off-track. Revisit ${missingConcepts.join(", ") || "the main idea"} and describe your contribution with measurable context.`
}

export const POST = async (req: NextRequest) => {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const body: ScoreRequest = await req.json()
    if (!Array.isArray(body.responses) || !body.responses.length) {
      return NextResponse.json({ message: "responses array is required" }, { status: 400 })
    }

    const results = body.responses.map((response) => {
      const userTokens = tokenize(response.userAnswer || "")
      const expectedTokens = tokenize(response.expectedAnswer || "")

      const userSet = new Set(userTokens)
      const expectedSet = new Set(expectedTokens)

      const keywordCoverage = intersectionScore(userSet, expectedSet)
      const userBigrams = new Set(buildBigrams(userTokens))
      const expectedBigrams = new Set(buildBigrams(expectedTokens))
      const bigramCoverage = intersectionScore(userBigrams, expectedBigrams)
      const structureSimilarity = lcsRatio(
        (response.userAnswer || "").toLowerCase(),
        (response.expectedAnswer || "").toLowerCase(),
      )

      const score = Math.min(
        100,
        Math.round(
          100 *
            (0.55 * keywordCoverage + 0.25 * bigramCoverage + 0.2 * structureSimilarity),
        ),
      )

      const missingConcepts = summarizeMissingConcepts(userSet, expectedSet)

      return {
        question: response.question,
        score,
        feedback: buildFeedback(score, missingConcepts),
        suggestedAnswer: response.expectedAnswer,
      }
    })

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Scoring answers failed:", error)
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 })
    }
    return NextResponse.json({ message: "Failed to score answers." }, { status: 500 })
  }
}
