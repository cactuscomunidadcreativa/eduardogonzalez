import { NextResponse } from "next/server";

// Generate vCard 3.0 format
function generateVCard(): string {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    // Name
    "N:González;Eduardo;;;",
    "FN:Eduardo González",
    // Title and Organization
    "TITLE:Director Regional LATAM",
    "ORG:Six Seconds - The Emotional Intelligence Network",
    // Phone
    "TEL;TYPE=CELL:+17863954654",
    // Email
    "EMAIL;TYPE=WORK:eduardo.gonzalez@6seconds.org",
    // Websites
    "URL;TYPE=WORK:https://www.eduardogonzalez.coach",
    "URL;TYPE=pref:https://www.6seconds.org",
    "URL:https://www.esp.6seconds.org",
    // Social profiles
    "X-SOCIALPROFILE;TYPE=instagram:https://www.instagram.com/eduardogonzalez.coach/",
    "X-SOCIALPROFILE;TYPE=linkedin:https://www.linkedin.com/in/eduhgonzalez",
    // Note
    "NOTE:Emotions · Decisions · Human Systems | Director LATAM en Six Seconds | Creador de ROWI | Emotional Budgeting",
    // Categories
    "CATEGORIES:Coaching,Inteligencia Emocional,Liderazgo",
    "END:VCARD",
  ];

  return lines.join("\r\n");
}

export async function GET() {
  const vcard = generateVCard();

  return new Response(vcard, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": 'attachment; filename="Eduardo_Gonzalez.vcf"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
