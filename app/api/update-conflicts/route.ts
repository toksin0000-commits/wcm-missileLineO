import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
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
  apiKey: process.env.GROQ_API_KEY
});

export async function GET(_req: Request) {
  const conflictKeys = ["ukraine", "israel-iran"];

  for (const key of conflictKeys) {
    const conflict = await kv.get<Conflict>(`conflict:${key}`);

    if (!conflict) continue;

    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
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

    if (!content) {
      console.warn(`AI returned null content for conflict ${key}`);
      continue;
    }

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
  }

  return NextResponse.json({ status: "ok" });
}
