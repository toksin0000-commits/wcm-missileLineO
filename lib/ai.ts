import Groq from "groq-sdk";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

interface ConflictData {
  name: string;
  [key: string]: any;
}

export async function askAI(conflict: ConflictData, question: string) {
  const response = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",
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
