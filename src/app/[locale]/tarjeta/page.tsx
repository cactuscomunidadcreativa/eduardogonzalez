import Image from "next/image";
import {
  Mail,
  Phone,
  Globe,
  Instagram,
  Linkedin,
  Download,
  QrCode,
  ExternalLink,
  CalendarCheck,
} from "lucide-react";

const contactInfo = {
  name: "Eduardo González",
  title: "Director Regional LATAM",
  org: "Six Seconds — The Emotional Intelligence Network",
  tagline: "Emotions · Decisions · Human Systems",
  email: "eduardo.gonzalez@6seconds.org",
  phone: "+1 (786) 395-4654",
  websites: [
    { label: "eduardogonzalez.coach", url: "https://www.eduardogonzalez.coach" },
    { label: "6seconds.org", url: "https://www.6seconds.org" },
    { label: "esp.6seconds.org", url: "https://www.esp.6seconds.org" },
  ],
  social: [
    {
      label: "Instagram",
      url: "https://www.instagram.com/eduardogonzalez.coach/",
      icon: "instagram",
    },
    {
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/eduhgonzalez",
      icon: "linkedin",
    },
  ],
};

function SocialIcon({ type, size = 18 }: { type: string; size?: number }) {
  if (type === "instagram") return <Instagram size={size} />;
  if (type === "linkedin") return <Linkedin size={size} />;
  return <Globe size={size} />;
}

export default function TarjetaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-blue via-brand-blue/95 to-brand-blue flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-2xl">
          {/* Header with gradient */}
          <div className="relative bg-gradient-to-br from-brand-blue to-brand-blue/80 px-6 pb-20 pt-8 text-center">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute left-1/4 top-1/4 h-32 w-32 rounded-full bg-brand-orange blur-3xl" />
              <div className="absolute right-1/4 bottom-1/4 h-24 w-24 rounded-full bg-brand-green blur-2xl" />
            </div>
            <div className="relative">
              {/* Logo */}
              <Image
                src="/images/logos/eg_logo_name_tagline_transparent.png?v=2"
                alt="Eduardo González"
                width={180}
                height={92}
                className="mx-auto h-auto w-44"
                unoptimized
              />
              <p className="mt-2 text-xs font-medium tracking-widest text-white/50 uppercase">
                {contactInfo.tagline}
              </p>
            </div>
          </div>

          {/* Profile info overlapping header */}
          <div className="-mt-12 px-6 relative z-10">
            <div className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-black/5">
              <h1 className="font-title text-xl font-bold text-brand-blue">
                {contactInfo.name}
              </h1>
              <p className="text-sm font-medium text-brand-orange">
                {contactInfo.title}
              </p>
              <p className="mt-1 text-xs text-brand-blue/50">
                {contactInfo.org}
              </p>
            </div>
          </div>

          {/* Contact details */}
          <div className="space-y-1 px-6 py-5">
            {/* Email */}
            <a
              href={`mailto:${contactInfo.email}`}
              className="flex items-center gap-4 rounded-xl px-4 py-3 transition hover:bg-brand-light"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-xs text-brand-blue/40">Email</p>
                <p className="text-sm font-medium text-brand-blue">
                  {contactInfo.email}
                </p>
              </div>
            </a>

            {/* Phone */}
            <a
              href={`tel:${contactInfo.phone.replace(/[^+\d]/g, "")}`}
              className="flex items-center gap-4 rounded-xl px-4 py-3 transition hover:bg-brand-light"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
                <Phone size={18} />
              </div>
              <div>
                <p className="text-xs text-brand-blue/40">Teléfono</p>
                <p className="text-sm font-medium text-brand-blue">
                  {contactInfo.phone}
                </p>
              </div>
            </a>

            {/* Websites */}
            {contactInfo.websites.map((site) => (
              <a
                key={site.url}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-xl px-4 py-3 transition hover:bg-brand-light"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
                  <Globe size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-brand-blue/40">Web</p>
                  <p className="text-sm font-medium text-brand-blue">
                    {site.label}
                  </p>
                </div>
                <ExternalLink size={14} className="text-brand-blue/30" />
              </a>
            ))}

            {/* Calendly */}
            <a
              href="https://calendly.com/eduardo-gonzalez/15min"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-xl px-4 py-3 transition hover:bg-brand-light"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
                <CalendarCheck size={18} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-brand-blue/40">Agendar reunión</p>
                <p className="text-sm font-medium text-brand-blue">
                  Calendly — 15 min
                </p>
              </div>
              <ExternalLink size={14} className="text-brand-blue/30" />
            </a>

            {/* Social */}
            <div className="flex items-center gap-3 px-4 pt-3">
              {contactInfo.social.map((s) => (
                <a
                  key={s.url}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-light text-brand-blue/60 transition hover:bg-brand-orange hover:text-white"
                  title={s.label}
                >
                  <SocialIcon type={s.icon} />
                </a>
              ))}
            </div>
          </div>

          {/* QR Code section */}
          <div className="border-t border-brand-light px-6 py-6">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 text-sm font-medium text-brand-blue/50">
                <QrCode size={14} />
                Escanea para guardar contacto
              </div>
              <div className="rounded-2xl bg-white p-3 shadow-md ring-1 ring-black/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/api/vcard/qr"
                  alt="QR Code - Contacto Eduardo González"
                  width={180}
                  height={180}
                  className="h-44 w-44"
                />
              </div>
            </div>
          </div>

          {/* Download button */}
          <div className="px-6 pb-8">
            <a
              href="/api/vcard"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-orange py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-orange/25 transition hover:bg-brand-orange/90 active:scale-[0.98]"
            >
              <Download size={18} />
              Guardar contacto
            </a>
          </div>
        </div>

        {/* Footer text */}
        <p className="mt-6 text-center text-xs text-white/30">
          © {new Date().getFullYear()} Eduardo González
        </p>
      </div>
    </div>
  );
}
