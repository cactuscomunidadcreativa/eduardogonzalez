import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

interface ImageFile {
  name: string;
  path: string;
  url: string;
  size: number;
  category: string;
}

async function scanDirectory(
  dir: string,
  baseUrl: string,
  category: string
): Promise<ImageFile[]> {
  const files: ImageFile[] = [];
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile() && /\.(jpg|jpeg|png|gif|svg|webp|ico)$/i.test(entry.name)) {
        const filePath = path.join(dir, entry.name);
        const stat = await fs.stat(filePath);
        files.push({
          name: entry.name,
          path: filePath,
          url: `${baseUrl}/${entry.name}`,
          size: stat.size,
          category,
        });
      }
    }
  } catch {
    // Directory might not exist
  }
  return files;
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || (session.user as Record<string, unknown>).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const publicDir = path.join(process.cwd(), "public");
    const images: ImageFile[] = [];

    // Scan all image directories
    images.push(
      ...(await scanDirectory(path.join(publicDir, "images"), "/images", "General")),
      ...(await scanDirectory(path.join(publicDir, "images", "logos"), "/images/logos", "Logos")),
      ...(await scanDirectory(path.join(publicDir, "images", "books"), "/images/books", "Libros")),
    );

    return NextResponse.json(images);
  } catch (error) {
    console.error("Media GET error:", error);
    return NextResponse.json({ error: "Failed to list media" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as Record<string, unknown>).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const category = (formData.get("category") as string) || "General";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Determine target directory
    let targetDir: string;
    let urlPrefix: string;

    switch (category) {
      case "Logos":
        targetDir = path.join(process.cwd(), "public", "images", "logos");
        urlPrefix = "/images/logos";
        break;
      case "Libros":
        targetDir = path.join(process.cwd(), "public", "images", "books");
        urlPrefix = "/images/books";
        break;
      default:
        targetDir = path.join(process.cwd(), "public", "images");
        urlPrefix = "/images";
        break;
    }

    // Ensure directory exists
    await fs.mkdir(targetDir, { recursive: true });

    // Save file
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
    const filePath = path.join(targetDir, fileName);
    await fs.writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      url: `${urlPrefix}/${fileName}`,
      name: fileName,
    });
  } catch (error) {
    console.error("Media upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as Record<string, unknown>).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { filePath } = await req.json();

    if (!filePath || !filePath.startsWith(path.join(process.cwd(), "public"))) {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }

    await fs.unlink(filePath);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Media delete error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
