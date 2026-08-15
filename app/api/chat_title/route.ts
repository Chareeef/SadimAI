import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const systemPrompt = `
You are an assistant that generates short, clear, and meaningful titles for chat conversations.

Rules:
- The title must be concise (3–7 words)
- Capture the core intent or topic
- No emojis
- No punctuation at the end
- Output MUST be valid JSON only

JSON format:
{
  "title": "string"
}
`;

export async function POST(req: NextRequest) {
  try {
    const { conversation } = await req.json();

    if (!conversation || !Array.isArray(conversation)) {
      return NextResponse.json(
        { error: "Invalid conversation payload" },
        { status: 400 },
      );
    }

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      temperature: 0.2,
      max_tokens: 50,
      response_format: { type: "json_object" }, // ✅ JSON MODE
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `
Conversation:
${conversation
  .slice(0, 2)
  .map((m) => `${m.role}: ${m.content}`)
  .join("\n")}

Generate a title.
          `,
        },
      ],
    });

    const json = completion.choices[0].message.content;
    return NextResponse.json(JSON.parse(json as string));
  } catch (error) {
    console.error("Title generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate title" },
      { status: 500 },
    );
  }
}
