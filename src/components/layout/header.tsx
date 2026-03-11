"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { LocaleSwitcher } from "./locale-switcher";
import Image from "next/image";

const navKeys = [
  { key: "about", href: "/quien-soy" },
  { key: "whatIDo", href: "/que-hago" },
  { key: "projects", href: "/proyectos" },
  { key: "ideas", href: "/ideas" },
  { key: "books", href: "/libros" },
  { key: "lab", href: "/lab" },
  { key: "contact", href: "/contacto" },
] as const;

export function Header() {
  const t = useTranslations("navigation");
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const locale = pathname.split("/")[1] || "es";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-brand-blue/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <Image
            src="/images/logos/eg_logo_name_tagline_transparent.png?v=2"
            alt="Eduardo González"
            width={160}
            height={82}
            className="h-12 w-auto sm:h-14"
            unoptimized
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navKeys.map(({ key, href }) => {
            const fullHref = `/${locale}${href}`;
            const isActive = pathname.startsWith(fullHref);
            return (
              <Link
                key={key}
                href={fullHref}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-white/10 text-brand-orange"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {t(key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-white md:hidden"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="border-t border-white/10 bg-brand-blue px-4 py-4 md:hidden">
          {navKeys.map(({ key, href }) => {
            const fullHref = `/${locale}${href}`;
            const isActive = pathname.startsWith(fullHref);
            return (
              <Link
                key={key}
                href={fullHref}
                onClick={() => setMobileOpen(false)}
                className={`block rounded-lg px-4 py-3 text-sm font-medium ${
                  isActive
                    ? "bg-white/10 text-brand-orange"
                    : "text-white/70"
                }`}
              >
                {t(key)}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
