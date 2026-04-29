import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const {
      topic,
      pdfText,
      question,
      mode,
    } = await req.json();

    const sourceMaterial = pdfText?.trim()
      ? pdfText
      : topic?.trim();

    if (!sourceMaterial || !question?.trim()) {
      return NextResponse.json(
        {
          error:
            "Topic/PDF material and question are required.",
        },
        { status: 400 }
      );
    }

    let modeInstruction = "";

    switch (mode) {
      case "Beginner":
        modeInstruction = `
Explain in the simplest possible way, assuming the learner is completely new.
Use easy language, relatable analogies, step-by-step clarity, and zero jargon unless explained.
Focus on understanding over complexity.
`;
        break;

      case "Exam":
        modeInstruction = `
Teach like an elite exam coach.
Prioritize high-yield concepts, likely test points, memory shortcuts, important definitions, and exam-oriented clarity.
Be concise but strategic.
`;
        break;

      case "Genius":
        modeInstruction = `
Teach like a world-class professor.
Go deep into conceptual understanding, advanced insights, systems thinking, and nuanced reasoning.
Prioritize mastery, not simplicity.
`;
        break;

      default:
        modeInstruction = `
Explain clearly, intelligently, and helpfully.
`;
    }

    const sourceType = pdfText?.trim()
      ? "uploaded study material"
      : "topic";

    const prompt = `
You are StudyAI’s Personal AI Professor — an elite tutor combining pedagogy, clarity, and adaptive intelligence.

Your mission:
Answer the learner’s question based ONLY on the provided ${sourceType}.

SOURCE MATERIAL:
${sourceMaterial}

LEARNER QUESTION:
${question}

TEACHING MODE:
${mode}

MODE INSTRUCTIONS:
${modeInstruction}

STRICT REQUIREMENTS:
- Use ONLY the provided source material when PDF is given
- No hallucination
- Be deeply accurate
- Structure response clearly
- Use headings where useful
- Optimize for retention and understanding
- Make the answer feel premium, personalized, and world-class
- No unnecessary fluff
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

    const answer =
      data.choices?.[0]?.message?.content ||
      "Failed to generate explanation.";

    return NextResponse.json({
      answer,
    });
  } catch (error) {
    console.error("Tutor API Error:", error);

    return NextResponse.json(
      {
        error: "Something went wrong.",
      },
      { status: 500 }
    );
  }
}