"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";

// SVG icons for social networks (lucide doesn't have brand icons)
function InstagramIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function LinkedInIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function YouTubeIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

function TwitterIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

interface SocialLinks {
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  twitter?: string;
  whatsapp?: string;
}

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("navigation");
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "es";
  const [socials, setSocials] = useState<SocialLinks>({});

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setSocials({
          instagram: data.instagram,
          linkedin: data.linkedin,
          youtube: data.youtube,
          twitter: data.twitter,
          whatsapp: data.whatsapp,
        });
      })
      .catch(() => {});
  }, []);

  const socialLinks = [
    { url: socials.instagram, icon: InstagramIcon, label: "Instagram" },
    { url: socials.linkedin, icon: LinkedInIcon, label: "LinkedIn" },
    { url: socials.youtube, icon: YouTubeIcon, label: "YouTube" },
    { url: socials.twitter, icon: TwitterIcon, label: "X / Twitter" },
    { url: socials.whatsapp, icon: WhatsAppIcon, label: "WhatsApp" },
  ].filter((s) => s.url);

  return (
    <footer className="border-t border-brand-light bg-brand-blue text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2 text-center md:text-left flex flex-col items-center md:items-start">
            <Image
              src="/images/logos/eg_logo_name_tagline_transparent.png?v=2"
              alt="Eduardo González"
              width={200}
              height={102}
              className="h-auto w-48 sm:w-56"
              unoptimized
            />
            <p className="mt-4 max-w-md text-sm text-white/60">
              {t("tagline")}
            </p>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="mt-6 flex items-center justify-center md:justify-start gap-3">
                {socialLinks.map(({ url, icon: Icon, label }) => (
                  <a
                    key={label}
                    href={label === "WhatsApp" ? `https://wa.me/${url?.replace(/\D/g, "")}` : url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/70 transition hover:bg-brand-orange hover:text-white"
                    title={label}
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Links */}
          <div className="text-center md:text-left">
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
          <div className="text-center md:text-left">
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
              <li>
                <Link href={`/${locale}/tarjeta`} className="hover:text-white">
                  📇 Tarjeta Digital
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
