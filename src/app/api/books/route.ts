import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const locale = req.nextUrl.searchParams.get("locale") || "es";

  const books = await db.book.findMany({
    include: { translations: true },
    orderBy: { publishYear: "desc" },
  });
  return NextResponse.json(books);
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const book = await db.book.create({
      data: {
        slug: body.slug,
        status: body.status || "DRAFT",
        coverImage: body.coverImage,
        publishYear: body.publishYear,
        buyUrl: body.buyUrl,
        translations: { create: body.translations },
      },
      include: { translations: true },
    });
    return NextResponse.json(book, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create book" }, { status: 500 });
  }
}
