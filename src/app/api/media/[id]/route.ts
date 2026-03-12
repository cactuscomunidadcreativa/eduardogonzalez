import { NextResponse } from "next/server";
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
