import { streamText, convertToModelMessages } from "ai";
import { getAIModel, getSystemPrompt } from "@/lib/ai";
import { NextResponse } from "next/server";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const [model, systemPrompt] = await Promise.all([
      getAIModel(),
      getSystemPrompt(),
    ]);

    // Convert UI messages (from useChat) to model messages (for streamText)
    const modelMessages = await convertToModelMessages(messages);

    const result = streamText({
      model,
      system: systemPrompt,
      messages: modelMessages,
    });

    return result.toUIMessageStreamResponse();
  } catch (error: unknown) {
    console.error("Chat API error:", error);
    const message =
      error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      { error: `Error en el chat: ${message}` },
      { status: 500 }
    );
  }
}
