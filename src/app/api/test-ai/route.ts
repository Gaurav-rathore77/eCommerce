import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: "Missing API Key",
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const result = await model.generateContent(
      "Hello"
    );

    const text = result.response.text();

    return NextResponse.json({
      success: true,
      reply: text,
    });
  } catch (error: any) {
    console.log(error);

    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}