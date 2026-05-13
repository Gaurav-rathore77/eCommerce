import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const completion =
      await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful ecommerce AI support assistant.",
          },
          {
            role: "user",
            content: body.message,
          },
        ],
        temperature: 0.7,
      });

    return NextResponse.json({
      reply:
        completion.choices[0].message.content,
    });
  } catch (error: any) {
    console.log("GROQ ERROR:", error);

    return NextResponse.json(
      {
        reply: "AI unavailable",
      },
      {
        status: 500,
      }
    );
  }
}