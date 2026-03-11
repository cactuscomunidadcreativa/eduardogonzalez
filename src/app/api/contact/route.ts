import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  type: z.enum(["CONFERENCE", "CONSULTING", "COLLABORATION", "MEDIA", "OTHER"]),
  message: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = contactSchema.parse(body);

    const submission = await db.contactSubmission.create({
      data,
    });

    return NextResponse.json({ success: true, id: submission.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
