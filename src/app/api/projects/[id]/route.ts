import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const project = await db.project.findUnique({
    where: { id },
    include: { translations: true, tags: true },
  });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(project);
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

    await db.project.update({
      where: { id },
      data: {
        slug: body.slug,
        status: body.status,
        featuredImage: body.featuredImage,
        externalUrl: body.externalUrl,
        sortOrder: body.sortOrder,
      },
    });

    if (body.translations) {
      for (const t of body.translations) {
        await db.projectTranslation.upsert({
          where: { projectId_locale: { projectId: id, locale: t.locale } },
          create: {
            projectId: id,
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

    const updated = await db.project.findUnique({
      where: { id },
      include: { translations: true },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
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
    await db.project.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
