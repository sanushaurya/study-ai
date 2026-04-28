import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json(
        { error: "No text provided" },
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
You are StudyAI Quiz Engine.

Generate a professional quiz from study material.

FORMAT:

## Quiz Questions

1. Question
A)
B)
C)
D)
Answer:
Explanation:

Generate 5 high-quality MCQs.
Mix conceptual + factual + application questions.
Make it beginner-friendly but educational.
`,
            },
            {
              role: "user",
              content: `Generate quiz from:\n\n${text}`,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log("Quiz Response:", data);

    const quiz =
      data?.choices?.[0]?.message?.content ||
      "No quiz generated.";

    return NextResponse.json({ quiz });
  } catch (error) {
    console.error("Quiz Error:", error);

    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}