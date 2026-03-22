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
  context: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Příprava ID a kontrola prostředí
    const { id } = await context.params;

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "Missing GROQ_API_KEY" }, { status: 500 });
    }

    // 2. Získání dat z JSON souboru (místo KV)
    let conflict: Conflict | null = null;
    try {
      const conflicts = await getConflictsFromFile();
      conflict = conflicts.find((c: any) => c.id === id) || null;
    } catch (e) {
      console.warn("Failed to load conflicts from file:", e);
    }

    // Pokud konflikt v DB není, vytvoříme základní z ID
    const baseConflict: Conflict = conflict || {
      id,
      name: id.replace(/-/g, " "),
      summary_short: "",
      timeline: [],
    };

    // 3. Volání Groq AI
    const completion = await client.chat.completions.create({
      model: "mixtral-8x7b-32768",
      messages: [
        {
          role: "system",
          content: `Jsi analytický expert na globální konflikty. 
          Vždy odpovídej POUZE ve formátu JSON. 
          Zaměř se na fakta, humanitární dopady a diplomacii.`.trim(),
        },
        {
          role: "user",
          content: `Aktualizuj data pro konflikt: ${baseConflict.name}.
          Vrať JSON: 
          {
            "summary_short": "stručné shrnutí (max 3 věty)",
            "timeline": [{"date": "YYYY-MM-DD", "title": "název", "description": "popis"}]
          }`.trim(),
        },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error("AI returned empty response");

    const update = JSON.parse(content);

    // 4. Sloučení dat (Nové události jdou na začátek)
    const updatedConflict: Conflict = {
      ...baseConflict,
      summary_short: update.summary_short || baseConflict.summary_short,
      timeline: [...(update.timeline || []), ...baseConflict.timeline]
        .filter((item, index, self) => 
          index === self.findIndex((t) => t.title === item.title) // Odstraní duplicity podle názvu
        )
        .slice(0, 20), // Udržíme historii na 20 bodech
    };

    // TODO: Zatím neukládáme – později přidáme Redis
    console.log(`Updated conflict ${id}:`, updatedConflict.summary_short);

    return NextResponse.json({ 
      status: "success", 
      conflict: updatedConflict 
    });

  } catch (err: any) {
    console.error("API Route Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error", details: err.message },
      { status: 500 }
    );
  }
}