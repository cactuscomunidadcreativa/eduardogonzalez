import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  const docs = await db.aITrainingDocument.findMany({
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(docs);
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const doc = await db.aITrainingDocument.create({
      data: {
        title: body.title,
        content: body.content,
        category: body.category,
        active: body.active ?? true,
      },
    });
    return NextResponse.json(doc, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create document" }, { status: 500 });
  }
}
