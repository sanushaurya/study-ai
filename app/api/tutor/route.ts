import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    if (!question) {
      return NextResponse.json(
        { error: "No question provided" },
        { status: 400 }
      );
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "StudyAI",
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `
You are StudyAI Tutor — an elite educational AI teacher.

Your job:
- Explain concepts clearly
- Teach step-by-step
- Be beginner-friendly
- Use examples
- Simplify difficult concepts
- Focus on understanding, not just answers

FORMAT:

## Answer
## Step-by-Step Explanation
## Simple Example
## Quick Revision
`,
            },
            {
              role: "user",
              content: question,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log("Tutor Response:", data);

    const answer =
      data?.choices?.[0]?.message?.content ||
      "No answer generated.";

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Tutor Error:", error);

    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}