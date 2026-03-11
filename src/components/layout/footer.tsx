"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("navigation");
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "es";

  return (
    <footer className="border-t border-brand-light bg-brand-blue text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <Image
                src="/images/logos/eg_logo_white.png"
                alt="Eduardo González"
                width={48}
                height={48}
                className="h-12 w-12"
              />
              <div>
                <h3 className="font-title text-lg font-bold">
                  Eduardo González
                </h3>
                <p className="text-sm text-brand-gray">{t("tagline")}</p>
              </div>
            </div>
            <p className="mt-4 max-w-md text-sm text-white/60">
              {t("tagline")}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-3 font-title text-sm font-semibold uppercase tracking-wider text-brand-orange">
              {tNav("home")}
            </h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <Link href={`/${locale}/quien-soy`} className="hover:text-white">
                  {tNav("about")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/que-hago`} className="hover:text-white">
                  {tNav("whatIDo")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/proyectos`} className="hover:text-white">
                  {tNav("projects")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/ideas`} className="hover:text-white">
                  {tNav("ideas")}
                </Link>
              </li>
            </ul>
          </div>

          {/* More links */}
          <div>
            <h4 className="mb-3 font-title text-sm font-semibold uppercase tracking-wider text-brand-orange">
              {tNav("contact")}
            </h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <Link href={`/${locale}/libros`} className="hover:text-white">
                  {tNav("books")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/lab`} className="hover:text-white">
                  {tNav("lab")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contacto`} className="hover:text-white">
                  {tNav("contact")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-8 text-center text-sm text-white/40">
          &copy; {new Date().getFullYear()} Eduardo González. {t("rights")}
        </div>
      </div>
    </footer>
  );
}
