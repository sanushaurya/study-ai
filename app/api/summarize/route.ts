import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: "Text is required." },
        { status: 400 }
      );
    }

    const prompt = `
You are StudyAI’s elite Mind Notes Architect — a world-class AI tutor designed to transform raw educational material into premium learning notes.

Your mission:
Convert the following study material into deeply structured, beginner-friendly, retention-optimized Mind Notes.

STRICT OUTPUT FORMAT:
## Summary
(2–4 concise paragraphs explaining the core concept clearly)

## Key Concepts
- Concept 1
- Concept 2
- Concept 3

## Important Points
- High-yield point
- Critical exam insight
- Practical understanding

## Example
(Real-world or memory-friendly example)

QUALITY STANDARDS:
- Make it feel like premium YC-backed edtech
- Clear for beginners, useful for advanced learners
- Simplify complexity without losing meaning
- Prioritize retention, understanding, and exam readiness
- No fluff
- No markdown outside specified headings
- Clean formatting only

Study Material:
${text}
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

    const summary =
      data.choices?.[0]?.message?.content ||
      "Failed to generate Mind Notes.";

    return NextResponse.json({
      summary,
    });
  } catch (error) {
    console.error("Summarizer API Error:", error);

    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}