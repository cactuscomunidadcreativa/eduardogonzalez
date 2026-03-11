import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const book = await db.book.findUnique({
    where: { id },
    include: { translations: true },
  });
  if (!book) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(book);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const body = await req.json();

    await db.book.update({
      where: { id },
      data: {
        slug: body.slug,
        status: body.status,
        coverImage: body.coverImage,
        publishYear: body.publishYear,
        buyUrl: body.buyUrl,
      },
    });

    if (body.translations) {
      for (const t of body.translations) {
        await db.bookTranslation.upsert({
          where: { bookId_locale: { bookId: id, locale: t.locale } },
          create: {
            bookId: id,
            locale: t.locale,
            title: t.title,
            subtitle: t.subtitle || null,
            description: t.description,
            content: t.content,
            metaTitle: t.metaTitle || null,
            metaDesc: t.metaDesc || null,
          },
          update: {
            title: t.title,
            subtitle: t.subtitle || null,
            description: t.description,
            content: t.content,
            metaTitle: t.metaTitle || null,
            metaDesc: t.metaDesc || null,
          },
        });
      }
    }

    const updated = await db.book.findUnique({
      where: { id },
      include: { translations: true },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update book" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    await db.book.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
