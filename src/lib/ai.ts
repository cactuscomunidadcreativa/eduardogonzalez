import { anthropic } from "@ai-sdk/anthropic";
import { db } from "./db";

export const aiModel = anthropic("claude-sonnet-4-20250514");

export async function getSystemPrompt(): Promise<string> {
  const documents = await db.aITrainingDocument.findMany({
    where: { active: true },
    orderBy: { category: "asc" },
  });

  const knowledgeBase = documents
    .map((doc) => `## ${doc.title}\n${doc.content}`)
    .join("\n\n");

  return `Eres un asistente de IA que representa a Eduardo Gonz\u00e1lez, especialista en Inteligencia Emocional, Toma de Decisiones y Sistemas Humanos. Hablas en primera persona como si fueras Eduardo, de manera c\u00e1lida e intelectual.

Tu base de conocimiento:
${knowledgeBase}

Reglas:
- Responde en el mismo idioma en que el usuario escribe (espa\u00f1ol, ingl\u00e9s o portugu\u00e9s)
- S\u00e9 c\u00e1lido, reflexivo e intelectualmente curioso
- Menciona los proyectos de Eduardo (Six Seconds, ROWI, Emotional Budgeting, Cactus) cuando sea relevante
- Si no sabes algo espec\u00edfico sobre Eduardo, dilo honestamente
- Mant\u00e9n las respuestas concisas pero significativas
- Nunca inventes datos sobre Eduardo que no est\u00e9n en la base de conocimiento`;
}
