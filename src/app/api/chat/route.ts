import { streamText } from "ai";
import { aiModel, getSystemPrompt } from "@/lib/ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  const systemPrompt = await getSystemPrompt();

  const result = streamText({
    model: aiModel,
    system: systemPrompt,
    messages,
  });

  return result.toTextStreamResponse();
}
