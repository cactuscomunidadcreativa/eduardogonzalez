import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import fs from "fs/promises";
import path from "path";

interface MediaItem {
  id: string;
  name: string;
  url: string;
  size: number;
  category: string;
  source: "static" | "db";
}

// Scan static files in public/images (for images shipped with the repo)
async function scanStaticDir(
  dir: string,
  baseUrl: string,
  category: string
): Promise<MediaItem[]> {
  const files: MediaItem[] = [];
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (
        entry.isFile() &&
        /\.(jpg|jpeg|png|gif|svg|webp|ico)$/i.test(entry.name)
      ) {
        const filePath = path.join(dir, entry.name);
        const stat = await fs.stat(filePath);
        files.push({
          id: `static-${baseUrl}/${entry.name}`,
          name: entry.name,
          url: `${baseUrl}/${entry.name}`,
          size: stat.size,
          category,
          source: "static",
        });
      }
    }
  } catch {
    // Directory might not exist in serverless
  }
  return files;
}

export async function GET() {
  try {
    const session = await auth();
    if (
      !session?.user ||
      (session.user as Record<string, unknown>).role !== "ADMIN"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get DB images (without the binary data)
    const dbMedia = await db.media.findMany({
      select: {
        id: true,
        filename: true,
        url: true,
        size: true,
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const dbFiles: MediaItem[] = dbMedia.map((m) => ({
      id: m.id,
      name: m.filename,
      url: m.url,
      size: m.size,
      category: m.category,
      source: "db" as const,
    }));

    // Also scan static files (works locally and on Vercel for repo files)
    const publicDir = path.join(process.cwd(), "public");
    const staticFiles: MediaItem[] = [];
    try {
      staticFiles.push(
        ...(await scanStaticDir(
          path.join(publicDir, "images"),
          "/images",
          "General"
        )),
        ...(await scanStaticDir(
          path.join(publicDir, "images", "logos"),
          "/images/logos",
          "Logos"
        )),
        ...(await scanStaticDir(
          path.join(publicDir, "images", "books"),
          "/images/books",
          "Libros"
        ))
      );
    } catch {
      // Ignore static scan errors on serverless
    }

    // Combine: DB files first, then static files not already migrated to DB
    const dbUrls = new Set(dbFiles.map((f) => f.url));
    const dbFilenames = new Set(dbFiles.map((f) => f.name.toLowerCase()));
    const uniqueStatic = staticFiles.filter(
      (f) => !dbUrls.has(f.url) && !dbFilenames.has(f.name.toLowerCase())
    );

    return NextResponse.json([...dbFiles, ...uniqueStatic]);
  } catch (error) {
    console.error("Media GET error:", error);
    return NextResponse.json(
      { error: "Failed to list media" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (
      !session?.user ||
      (session.user as Record<string, unknown>).role !== "ADMIN"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const category = (formData.get("category") as string) || "General";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Read file data
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();

    // Store in database
    const media = await db.media.create({
      data: {
        filename: fileName,
        url: "", // Temp - will update with ID
        mimeType: file.type || "image/jpeg",
        size: buffer.length,
        category,
        data: buffer,
      },
    });

    // Set URL to the serve endpoint
    const url = `/api/media/${media.id}`;
    await db.media.update({
      where: { id: media.id },
      data: { url },
    });

    return NextResponse.json({
      success: true,
      id: media.id,
      url,
      name: fileName,
    });
  } catch (error) {
    console.error("Media upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

// Migrate a static file to database so it can be edited
export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (
      !session?.user ||
      (session.user as Record<string, unknown>).role !== "ADMIN"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { staticUrl, category } = await req.json();

    if (!staticUrl || typeof staticUrl !== "string") {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    // Read the static file from disk
    const filePath = path.join(process.cwd(), "public", staticUrl);
    const buffer = await fs.readFile(filePath);
    const fileName = path.basename(staticUrl);

    // Determine mime type from extension
    const ext = path.extname(fileName).toLowerCase();
    const mimeMap: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".svg": "image/svg+xml",
      ".webp": "image/webp",
      ".ico": "image/x-icon",
    };
    const mimeType = mimeMap[ext] || "image/jpeg";

    // Store in database
    const media = await db.media.create({
      data: {
        filename: fileName,
        url: "",
        mimeType,
        size: buffer.length,
        category: category || "General",
        data: buffer,
      },
    });

    const url = `/api/media/${media.id}`;
    await db.media.update({
      where: { id: media.id },
      data: { url },
    });

    return NextResponse.json({
      success: true,
      id: media.id,
      url,
      name: fileName,
    });
  } catch (error) {
    console.error("Media migrate error:", error);
    return NextResponse.json({ error: "Migration failed" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (
      !session?.user ||
      (session.user as Record<string, unknown>).role !== "ADMIN"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "No ID provided" }, { status: 400 });
    }

    // Don't delete static files
    if (typeof id === "string" && id.startsWith("static-")) {
      return NextResponse.json(
        { error: "No se pueden eliminar archivos estáticos" },
        { status: 400 }
      );
    }

    await db.media.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Media delete error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
