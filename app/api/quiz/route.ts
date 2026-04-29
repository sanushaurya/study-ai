import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { topic, pdfText, difficulty } = await req.json();

    const sourceMaterial = pdfText?.trim()
      ? pdfText
      : topic?.trim();

    if (!sourceMaterial) {
      return NextResponse.json(
        {
          error:
            "Topic or PDF content is required.",
        },
        { status: 400 }
      );
    }

    const sourceType = pdfText?.trim()
      ? "uploaded study material"
      : "topic";

    const prompt = `
You are StudyAI’s elite Quiz Architect — a world-class AI learning designer trusted to create highly engaging, retention-optimized quizzes.

Your mission:
Generate exactly 5 ${difficulty}-level multiple-choice questions based on this ${sourceType}:

"${sourceMaterial}"

STRICT REQUIREMENTS:
- Return ONLY valid raw JSON
- No markdown
- No code blocks
- No extra text
- Output must be a JSON array only

REQUIRED JSON FORMAT:
[
  {
    "question": "string",
    "options": {
      "A": "string",
      "B": "string",
      "C": "string",
      "D": "string"
    },
    "correctAnswer": "A",
    "explanation": "string"
  }
]

QUALITY STANDARDS:
- Prioritize conceptual understanding
- Wrong answers must be plausible
- Optimize for exam prep + active recall
- Questions should feel like Duolingo + elite tutor
- If PDF material is provided, quiz ONLY from provided material
- No outside assumptions
`;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    const rawContent =
      data.choices?.[0]?.message?.content || "";

    let parsedQuiz;

    try {
      parsedQuiz = JSON.parse(rawContent);
    } catch (parseError) {
      console.error(
        "Quiz JSON Parse Error:",
        parseError
      );

      return NextResponse.json(
        {
          error:
            "Failed to generate structured quiz. Try again.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      quiz: parsedQuiz,
    });
  } catch (error) {
    console.error("Quiz API Error:", error);

    return NextResponse.json(
      {
        error: "Something went wrong.",
      },
      { status: 500 }
    );
  }
}