import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const locale = req.nextUrl.searchParams.get("locale") || "es";
  const slug = req.nextUrl.searchParams.get("slug");

  if (slug) {
    const page = await db.page.findUnique({
      where: { slug },
      include: { translations: slug ? undefined : { where: { locale } } },
    });
    if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(page);
  }

  const pages = await db.page.findMany({
    include: { translations: true },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(pages);
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const page = await db.page.create({
      data: {
        slug: body.slug,
        status: body.status || "PUBLISHED",
        template: body.template || "default",
        translations: { create: body.translations },
      },
      include: { translations: true },
    });
    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create page" }, { status: 500 });
  }
}
