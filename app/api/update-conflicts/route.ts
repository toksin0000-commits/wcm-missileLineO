import { NextResponse } from "next/server";
import OpenAI from "openai";

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

// Použij Groq API místo OpenAI
const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

export async function GET(_req: Request) {
  // Tohle by se nemělo spouštět během buildu
  if (process.env.NODE_ENV === 'production' && !process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: "Missing API key" }, { status: 500 });
  }

  const conflictKeys = ["ukraine", "israel-iran"];

  for (const key of conflictKeys) {
    // Zatím nemáme KV, takže přeskoč
    console.log(`Skipping ${key} - KV not configured yet`);
    continue;
    
    /* TODO: Později až nastavíme Redis/KV
    const conflict = await kv.get<Conflict>(`conflict:${key}`);
    if (!conflict) continue;

    const response = await client.chat.completions.create({
      model: "mixtral-8x7b-32768", // Groq model
      messages: [
        {
          role: "system",
          content: `
Jsi neutrální AI, která vytváří bezpečná shrnutí konfliktů.
Neposkytuj taktické, operační ani vojenské detaily.
Nepředpovídej budoucí vývoj.
Drž se pouze veřejných informací, humanitárních dopadů a diplomacie.
Vrať JSON bez komentářů.
          `
        },
        {
          role: "user",
          content: `
Aktualizuj konflikt: ${conflict.name}

Vrať JSON ve formátu:
{
  "summary_short": "...",
  "timeline": [
    { "date": "YYYY-MM-DD", "title": "...", "description": "..." }
  ]
}
          `
        }
      ]
    });

    const content = response.choices[0].message.content;
    if (!content) continue;

    let update: any;
    try {
      update = JSON.parse(content);
    } catch (err) {
      console.error("Invalid JSON from AI:", content);
      continue;
    }

    const updatedConflict: Conflict = {
      ...conflict,
      summary_short: update.summary_short || conflict.summary_short,
      timeline: [...update.timeline, ...conflict.timeline].slice(0, 20)
    };

    await kv.set(`conflict:${key}`, updatedConflict);
    */
  }

  return NextResponse.json({ status: "ok", message: "KV not configured yet" });
}