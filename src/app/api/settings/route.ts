import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  const page = await db.page.findUnique({
    where: { slug: "site-settings" },
    include: { translations: true },
  });
  if (!page) {
    return NextResponse.json({
      siteName: "Eduardo González",
      siteDescription: "Emotions · Decisions · Systems",
      contactEmail: "",
      seoTitle: "",
      seoDescription: "",
      instagram: "",
      linkedin: "",
      youtube: "",
      twitter: "",
      botPersonality: "",
      botGreeting: "",
      botName: "Pregúntale a Eduardo",
    });
  }
  const t = page.translations.find((t: { locale: string }) => t.locale === "es");
  try {
    return NextResponse.json(t ? JSON.parse(t.content) : {});
  } catch {
    return NextResponse.json({});
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const content = JSON.stringify(body);

    let page = await db.page.findUnique({ where: { slug: "site-settings" } });
    if (!page) {
      page = await db.page.create({
        data: {
          slug: "site-settings",
          status: "PUBLISHED",
          template: "settings",
          translations: {
            create: { locale: "es", title: "Configuración del sitio", content },
          },
        },
      });
    } else {
      await db.pageTranslation.upsert({
        where: { pageId_locale: { pageId: page.id, locale: "es" } },
        create: { pageId: page.id, locale: "es", title: "Configuración del sitio", content },
        update: { content },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Settings save error:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
