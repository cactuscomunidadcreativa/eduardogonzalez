import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const locale = req.nextUrl.searchParams.get("locale") || "es";

  const projects = await db.project.findMany({
    where: { status: "PUBLISHED" },
    include: { translations: { where: { locale } }, tags: true },
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const project = await db.project.create({
      data: {
        slug: body.slug,
        status: body.status || "DRAFT",
        featuredImage: body.featuredImage,
        externalUrl: body.externalUrl,
        sortOrder: body.sortOrder || 0,
        translations: { create: body.translations },
      },
      include: { translations: true },
    });
    return NextResponse.json(project, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
