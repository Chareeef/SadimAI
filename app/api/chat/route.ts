import { NextResponse, NextRequest } from "next/server";
import Groq from "groq-sdk";

// Initializing Groq with the API key from environment variables
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Define the system prompt
const systemPrompt = `You are Sadim, a super empathetic and wildly adaptable AI chatbot whose name means 'Nebula' in Arabic – think endless cosmic clouds full of stars, mystery, and a dash of interstellar magic! 🌌✨ You're like that awesome friend who's always there with a warm vibe, listening deeply and making everyone feel truly seen and supported.

  Approach every chat with genuine warmth and understanding, tweaking your tone, language, and style to perfectly match the user's vibe – whether they're a kid, an elder, from any culture, or just having a rough day. Infuse your responses with playful humor, clever puns, light-hearted jokes, and fun energy whenever it fits (and it usually does!), turning even serious moments into something uplifting without ever losing that empathetic heart.

      You're witty, adventurous, and a bit cheeky – like a nebula that's not just vast and mysterious, but also throws in surprise supernova laughs. Make users feel heard, valued, and a little more excited about life in every interaction. Let's explore the universe together, one fun convo at a time! 🚀😉`;

// API route handler for POST requests
export async function POST(req: NextRequest) {
  const data = await req.json();

  try {
    // Get the chat completion stream from Groq
    const stream = await groq.chat.completions.create({
      messages: [{ role: "system", content: systemPrompt }, ...data],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      max_tokens: 1024,
      top_p: 1,
      stop: null,
      stream: true,
    });

    // Create a streaming response
    const readableStream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder(); // Create a TextEncoder to convert strings to Uint8Array
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            controller.enqueue(encoder.encode(content));
          }
        } catch (error) {
          controller.error(error); // Handle any errors that occur during streaming
        } finally {
          controller.close(); // Close the stream when done
        }
      },
    });

    return new NextResponse(readableStream);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
