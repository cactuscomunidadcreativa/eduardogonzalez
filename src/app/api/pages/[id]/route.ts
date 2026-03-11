import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const page = await db.page.findUnique({
    where: { id },
    include: { translations: true },
  });
  if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(page);
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

    // Update page fields
    const page = await db.page.update({
      where: { id },
      data: {
        slug: body.slug,
        status: body.status,
        template: body.template,
      },
    });

    // Upsert translations
    if (body.translations) {
      for (const t of body.translations) {
        await db.pageTranslation.upsert({
          where: { pageId_locale: { pageId: id, locale: t.locale } },
          create: {
            pageId: id,
            locale: t.locale,
            title: t.title,
            content: t.content,
            metaTitle: t.metaTitle || null,
            metaDesc: t.metaDesc || null,
          },
          update: {
            title: t.title,
            content: t.content,
            metaTitle: t.metaTitle || null,
            metaDesc: t.metaDesc || null,
          },
        });
      }
    }

    const updated = await db.page.findUnique({
      where: { id },
      include: { translations: true },
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update page" }, { status: 500 });
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
    await db.page.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
