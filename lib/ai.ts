import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_KEY });

interface ConflictData {
  name: string;
  [key: string]: any;
}

export async function askAI(conflict: ConflictData, question: string) {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
Jsi neutrální AI, která vysvětluje konflikty bez taktických detailů,
bez predikcí a bez vojenských návodů. Drž se faktů a kontextu.
        `
      },
      {
        role: "user",
        content: `
Konflikt: ${conflict.name}
Otázka: ${question}
        `
      }
    ]
  });

  return response.choices[0].message.content;
}
