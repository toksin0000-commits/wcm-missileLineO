import Redis from "ioredis";
import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const redis = new Redis(process.env.REDIS_URL!);
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: Request) {
  // Default fallback – přesně jak chceš
  let reply = "ERROR: NEURAL LINK INTERRUPTED.";

  try {
    const { messages, conflictId } = await request.json();

    // Safe Redis write
    try {
      await redis.set(`chat:${conflictId}`, JSON.stringify(messages));
    } catch (e) {
      console.error("REDIS ERROR:", e);
    }

    // Safe GROQ call
    try {
      const completion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",


        messages: [
          {
            role: "system",
            content: `You are an analytical conflict expert. Respond concisely and factually.`
          },
          ...messages
        ],
      });

      const content = completion.choices?.[0]?.message?.content;

      // Pokud GROQ vrátí validní text → použijeme ho
      if (typeof content === "string") {
        reply = content;
      }

    } catch (e) {
      console.error("GROQ ERROR:", e);
    }

  } catch (e) {
    console.error("REQUEST PARSE ERROR:", e);
  }

  // Vždy vrátíme JSON – UI už nikdy nespadne
  return NextResponse.json({ message: reply });
}


