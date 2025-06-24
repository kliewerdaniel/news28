import { NextRequest, NextResponse } from "next/server";

// Specify Node.js runtime
export const runtime = "nodejs";

// Define types for the request body
type Article = {
  title: string;
  url: string;
  source: string;
};

type Cluster = {
  topic: string;
  summary: string;
  articles: Article[];
};

type GenerateRequest = {
  persona: Record<string, any>;
  cluster: Cluster;
};

// Only allow POST requests
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json() as GenerateRequest;

    // Validate request body
    if (!body.persona || !body.cluster) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Build persona description by merging traits
    const personaDescription = Object.entries(body.persona)
      .filter(([key]) => key !== "name")
      .map(([key, val]) => `${key}: ${val}`)
      .join(", ");

    // Construct prompt
    const prompt = `
      You are a persona with the following traits: ${personaDescription}.
      Topic: ${body.cluster.topic}
      Summary: ${body.cluster.summary}

      Write a short opinion or reaction to this topic in the voice of the persona.
    `;

    try {
      // Call Ollama API
      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, model: "llama2" }),
      });

      if (!response.ok) {
        throw new Error("LLM API call failed");
      }

      const stream = await response.text();

      return NextResponse.json({ output: stream });
    } catch (error) {
      console.error("LLM generation error:", error);
      return NextResponse.json(
        { error: "Failed to generate response" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Request parsing error:", error);
    return NextResponse.json(
      { error: "Invalid request format" },
      { status: 400 }
    );
  }
}
