import { NextResponse, NextRequest } from "next/server";
import Groq from "groq-sdk";

// Initializing Groq with the API key from environment variables
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Define the system prompt
const systemPrompt = "You are a helpful assistant.";

// API route handler for POST requests
export async function POST(req: NextRequest) {
  const data = await req.json();

  try {
    // Get the chat completion stream from Groq
    const stream = await groq.chat.completions.create({
      messages: [{ role: "system", content: systemPrompt }, ...data],
      model: "llama3-8b-8192",
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
