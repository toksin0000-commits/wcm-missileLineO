import { NextResponse } from "next/server";
import Groq from "groq-sdk";

interface Conflict {
  id: string;
  name: string;
  summary_short: string;
  timeline: {
    date: string;
    title: string;
    description: string;
  }[];
}

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "Missing GROQ_API_KEY" },
        { status: 500 }
      );
    }

    // Minimální fallback data
    const baseConflict: Conflict = {
      id,
      name: id.replace(/-/g, " "),
      summary_short: "",
      timeline: [],
    };

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `Jsi analytický expert na globální konflikty. 
          Odpovídej POUZE ve formátu JSON.`.trim(),
        },
        {
          role: "user",
          content: `Aktualizuj data pro konflikt: ${baseConflict.name}.
          Vrať JSON:
          {
            "summary_short": "...",
            "timeline": [{"date": "...", "title": "...", "description": "..."}]
          }`.trim(),
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 1000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error("AI returned empty response");

    const update = JSON.parse(content);

    const updatedConflict: Conflict = {
      ...baseConflict,
      summary_short: update.summary_short || "",
      timeline: update.timeline || [],
    };

    return NextResponse.json({
      status: "success",
      conflict: updatedConflict,
    });
  } catch (err: any) {
    console.error("API Route Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error", details: err.message },
      { status: 500 }
    );
  }
}
