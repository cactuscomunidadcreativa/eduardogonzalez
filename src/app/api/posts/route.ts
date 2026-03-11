import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const locale = searchParams.get("locale") || "es";
  const category = searchParams.get("category");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  const where: Record<string, unknown> = { status: "PUBLISHED" };
  if (category) where.category = category;

  const [posts, total] = await Promise.all([
    db.post.findMany({
      where,
      include: {
        translations: { where: { locale } },
        tags: true,
        _count: { select: { comments: { where: { status: "APPROVED" } } } },
      },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.post.count({ where }),
  ]);

  return NextResponse.json({
    posts,
    total,
    pages: Math.ceil(total / limit),
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const post = await db.post.create({
      data: {
        slug: body.slug,
        status: body.status || "DRAFT",
        category: body.category,
        featuredImage: body.featuredImage,
        readingTime: body.readingTime,
        publishedAt: body.status === "PUBLISHED" ? new Date() : null,
        translations: {
          create: body.translations,
        },
      },
      include: { translations: true },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
