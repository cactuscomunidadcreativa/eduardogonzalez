import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const post = await db.post.findUnique({
    where: { id },
    include: { translations: true, tags: true },
  });

  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const post = await db.post.update({
    where: { id },
    data: {
      slug: body.slug,
      status: body.status,
      category: body.category,
      featuredImage: body.featuredImage,
      readingTime: body.readingTime,
      publishedAt:
        body.status === "PUBLISHED" ? body.publishedAt || new Date() : null,
    },
    include: { translations: true },
  });

  // Upsert translations
  if (body.translations) {
    for (const t of body.translations) {
      await db.postTranslation.upsert({
        where: { postId_locale: { postId: id, locale: t.locale } },
        update: t,
        create: { ...t, postId: id },
      });
    }
  }

  return NextResponse.json(post);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.post.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
