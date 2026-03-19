import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(200),
  type: z.enum(["CONFERENCE", "CONSULTING", "COLLABORATION", "MEDIA", "OTHER"]),
  message: z.string().min(1).max(5000),
  _t: z.number().optional(),
});

// Simple in-memory rate limit: max 3 submissions per IP per 10 minutes
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX = 3;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW);
  rateLimitMap.set(ip, recent);
  if (recent.length >= RATE_LIMIT_MAX) return true;
  recent.push(now);
  return false;
}

// Detect bot-like patterns in text
function looksLikeSpam(name: string, message: string): boolean {
  // Random string pattern: mostly consonants, very few vowels
  const vowelRatio = (s: string) => {
    const vowels = s.toLowerCase().match(/[aeiouáéíóú]/g)?.length || 0;
    const letters = s.replace(/[^a-záéíóúñ]/gi, "").length || 1;
    return vowels / letters;
  };
  // Normal names have >20% vowels, random strings have ~15% or less
  if (name.length > 8 && vowelRatio(name) < 0.15) return true;
  if (message.length > 10 && vowelRatio(message) < 0.12) return true;

  // Check for excessive uppercase or special chars in name
  if (/^[A-Z]{5,}/.test(name)) return true;

  return false;
}

export async function GET(req: NextRequest) {
  const countOnly = req.nextUrl.searchParams.get("count") === "true";

  if (countOnly) {
    const count = await db.contactSubmission.count();
    return NextResponse.json({ count });
  }

  const submissions = await db.contactSubmission.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(submissions);
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") || "unknown";

    // Rate limit
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await req.json();
    const parsed = contactSchema.parse(body);

    // Time-based check: form must be open for at least 3 seconds
    if (parsed._t) {
      const elapsed = Date.now() - parsed._t;
      if (elapsed < 3000) {
        // Bot filled it too fast — fake success
        return NextResponse.json({ success: true, id: "ok" });
      }
    }

    // Spam pattern detection
    if (looksLikeSpam(parsed.name, parsed.message)) {
      // Fake success so bot doesn't retry
      return NextResponse.json({ success: true, id: "ok" });
    }

    const { _t, ...data } = parsed;
    const submission = await db.contactSubmission.create({ data });

    return NextResponse.json({ success: true, id: submission.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
