import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Eduardo Gonz\u00e1lez | Emotions \u00b7 Decisions \u00b7 Systems",
    template: "%s | Eduardo Gonz\u00e1lez",
  },
  description:
    "Exploro c\u00f3mo las emociones influyen en decisiones, liderazgo y sistemas humanos.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://eduardogonzalez.coach"
  ),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body className={`${inter.variable} ${sora.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
