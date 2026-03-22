import { NextResponse } from "next/server";
import Groq from "groq-sdk";

// Definice typu pro typovou bezpečnost
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

// Pomocná funkce pro načtení konfliktů z JSON
async function getConflictsFromFile() {
  const conflictsData = await import("@/data/conflicts.json");
  return conflictsData.default;
}

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

    // 2. Získání dat z JSON souboru (místo KV)
    let conflict: Conflict | null = null;
    try {
      const conflicts = await getConflictsFromFile();
      conflict = conflicts.find((c: any) => c.id === id) || null;
    } catch (e) {
      console.warn("Failed to load conflicts from file:", e);
    }

    const baseConflict: Conflict = conflict || {
      id,
      name: id.replace(/-/g, " "),
      summary_short: "",
      timeline: [],
    };

    const completion = await client.chat.completions.create({
      model: "mixtral-8x7b-32768",
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
      temperature: 0.3,
      max_tokens: 1000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error("AI returned empty response");

    const update = JSON.parse(content);

    const updatedConflict: Conflict = {
      ...baseConflict,
      summary_short: update.summary_short || baseConflict.summary_short,
      timeline: [...(update.timeline || []), ...baseConflict.timeline]
        .filter((item, index, self) =>
          index === self.findIndex((t) => t.title === item.title)
        )
        .slice(0, 20),
    };

    console.log(`Updated conflict ${id}:`, updatedConflict.summary_short);

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
