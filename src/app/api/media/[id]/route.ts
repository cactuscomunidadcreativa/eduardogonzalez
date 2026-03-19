import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// Serve image binary from database
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const media = await db.media.findUnique({
      where: { id },
      select: { data: true, mimeType: true, filename: true },
    });

    if (!media || !media.data) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return new Response(media.data, {
      headers: {
        "Content-Type": media.mimeType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Disposition": `inline; filename="${media.filename}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Update image (edit/replace)
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const session = await auth();
    if (
      !session?.user ||
      (session.user as Record<string, unknown>).role !== "ADMIN"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (id.startsWith("static-")) {
      return NextResponse.json(
        { error: "No se pueden editar archivos estáticos" },
        { status: 400 }
      );
    }

    const existing = await db.media.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    await db.media.update({
      where: { id },
      data: {
        data: buffer,
        size: buffer.length,
        mimeType: file.type || "image/png",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Media update error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
