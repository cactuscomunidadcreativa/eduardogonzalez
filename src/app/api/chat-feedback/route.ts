import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messageId, feedback } = await req.json();
    // For now just log it - can be stored in DB later
    console.log(`Chat feedback: ${feedback} for message ${messageId}`);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
