import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateText } from "ai";
import { aiModel } from "@/lib/ai";

const LOCALE_NAMES: Record<string, string> = {
  es: "Spanish",
  en: "English",
  pt: "Brazilian Portuguese",
};

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { text, fromLocale, toLocale, context } = await req.json();

    if (!text || !fromLocale || !toLocale) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const fromLang = LOCALE_NAMES[fromLocale] || fromLocale;
    const toLang = LOCALE_NAMES[toLocale] || toLocale;

    const result = await generateText({
      model: aiModel,
      system: `You are a professional translator for Eduardo González's personal website. Translate content naturally and accurately, preserving:
- The tone and voice (warm, reflective, intellectually curious)
- Technical terms related to emotional intelligence (keep "Six Seconds", "KCG model", brand names as-is)
- HTML/markdown formatting if present
- Line breaks and paragraph structure
- Brand terms: "Emotional Budgeting", "ROWI", "ROWIIA", "Oveja Libre", "Cactus Comunidad Creativa", "Redención" should stay in their original form
- The personal, first-person voice of Eduardo

Only output the translated text. No explanations or notes.`,
      prompt: `Translate the following ${context ? `(${context}) ` : ""}from ${fromLang} to ${toLang}:\n\n${text}`,
    });

    return NextResponse.json({ translated: result.text });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
