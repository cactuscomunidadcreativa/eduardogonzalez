import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const subscribeSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  locale: z.string().default("es"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = subscribeSchema.parse(body);

    await db.newsletterSubscriber.upsert({
      where: { email: data.email },
      update: { name: data.name, locale: data.locale, unsubscribedAt: null },
      create: data,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  // TODO: Add admin auth check
  const subscribers = await db.newsletterSubscriber.findMany({
    orderBy: { subscribedAt: "desc" },
  });
  return NextResponse.json(subscribers);
}
