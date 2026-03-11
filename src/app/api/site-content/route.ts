import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

const LOCALES = ["es", "en", "pt"] as const;

// Map page slugs to their i18n section keys
const SLUG_TO_SECTION: Record<string, string> = {
  inicio: "home",
  "quien-soy": "about",
  "que-hago": "whatIDo",
  proyectos: "projects",
  ideas: "ideas",
  libros: "books",
  lab: "lab",
  contacto: "contact",
};

function getMessagesPath(locale: string): string {
  return path.join(process.cwd(), "src", "i18n", "messages", `${locale}.json`);
}

async function readMessages(locale: string): Promise<Record<string, unknown>> {
  const filePath = getMessagesPath(locale);
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw);
}

async function writeMessages(
  locale: string,
  data: Record<string, unknown>
): Promise<void> {
  const filePath = getMessagesPath(locale);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2) + "\n", "utf-8");
}

// Flatten a nested object into dot-notation keys
function flattenObject(
  obj: unknown,
  prefix = ""
): Record<string, string> {
  const result: Record<string, string> = {};
  if (obj && typeof obj === "object" && !Array.isArray(obj)) {
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (value && typeof value === "object" && !Array.isArray(value)) {
        Object.assign(result, flattenObject(value, fullKey));
      } else {
        result[fullKey] = String(value ?? "");
      }
    }
  }
  return result;
}

// Unflatten dot-notation keys back into a nested object
function unflattenObject(
  flat: Record<string, string>
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(flat)) {
    const parts = key.split(".");
    let current: Record<string, unknown> = result;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!(parts[i] in current) || typeof current[parts[i]] !== "object") {
        current[parts[i]] = {};
      }
      current = current[parts[i]] as Record<string, unknown>;
    }
    current[parts[parts.length - 1]] = value;
  }
  return result;
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as Record<string, unknown>).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      // Return all sections for all locales (for the pages list)
      const allData: Record<string, Record<string, Record<string, string>>> = {};

      for (const locale of LOCALES) {
        const messages = await readMessages(locale);
        for (const [pageSlug, sectionKey] of Object.entries(SLUG_TO_SECTION)) {
          if (!allData[pageSlug]) {
            allData[pageSlug] = {};
          }
          const sectionData = messages[sectionKey];
          allData[pageSlug][locale] = flattenObject(sectionData);
        }
      }

      return NextResponse.json(allData);
    }

    // Return data for a specific page slug
    const sectionKey = SLUG_TO_SECTION[slug];
    if (!sectionKey) {
      return NextResponse.json({ error: "Unknown page slug" }, { status: 404 });
    }

    const result: Record<string, Record<string, string>> = {};
    for (const locale of LOCALES) {
      const messages = await readMessages(locale);
      const sectionData = messages[sectionKey];
      result[locale] = flattenObject(sectionData);
    }

    return NextResponse.json({ slug, section: sectionKey, content: result });
  } catch (error) {
    console.error("Site content GET error:", error);
    return NextResponse.json(
      { error: "Failed to read content" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as Record<string, unknown>).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug, content } = (await req.json()) as {
      slug: string;
      content: Record<string, Record<string, string>>;
    };

    if (!slug || !content) {
      return NextResponse.json(
        { error: "Missing slug or content" },
        { status: 400 }
      );
    }

    const sectionKey = SLUG_TO_SECTION[slug];
    if (!sectionKey) {
      return NextResponse.json({ error: "Unknown page slug" }, { status: 404 });
    }

    for (const locale of LOCALES) {
      if (!content[locale]) continue;

      const messages = await readMessages(locale);
      const unflattened = unflattenObject(content[locale]);
      messages[sectionKey] = unflattened;
      await writeMessages(locale, messages);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Site content PUT error:", error);
    return NextResponse.json(
      { error: "Failed to save content" },
      { status: 500 }
    );
  }
}
