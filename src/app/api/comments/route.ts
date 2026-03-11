import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const commentSchema = z.object({
  postId: z.string(),
  content: z.string().min(1).max(2000),
  authorName: z.string().optional(),
  authorEmail: z.string().email().optional(),
});

export async function GET(req: NextRequest) {
  const postId = req.nextUrl.searchParams.get("postId");
  if (!postId) {
    return NextResponse.json({ error: "postId required" }, { status: 400 });
  }

  const comments = await db.comment.findMany({
    where: { postId, status: "APPROVED", parentId: null },
    include: {
      user: { select: { name: true, image: true } },
      replies: {
        where: { status: "APPROVED" },
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(comments);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = commentSchema.parse(body);

    const comment = await db.comment.create({ data });
    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
