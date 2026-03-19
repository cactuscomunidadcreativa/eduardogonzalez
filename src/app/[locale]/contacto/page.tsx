"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Send, CheckCircle, QrCode, Download, UserCircle } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ContactPage() {
  const t = useTranslations("contact");
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "es";
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [loadedAt] = useState(() => Date.now());

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);

    const form = e.currentTarget;

    // Honeypot check — bots fill hidden fields
    const honeypot = (form.elements.namedItem("website") as HTMLInputElement).value;
    if (honeypot) {
      // Fake success so bot thinks it worked
      setSent(true);
      return;
    }

    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      type: (form.elements.namedItem("type") as HTMLSelectElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
      _t: loadedAt,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setSent(true);
        toast.success(t("success"));
      }
    } catch {
      toast.error("Error");
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <CheckCircle size={48} className="mx-auto mb-4 text-brand-green" />
          <h2 className="font-title text-2xl font-bold text-brand-blue">
            {t("success")}
          </h2>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="bg-brand-light py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="font-title text-4xl font-bold text-brand-blue sm:text-5xl">
            {t("title")}
          </h1>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-xl px-4 sm:px-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Honeypot — invisible to humans, bots fill it */}
            <div className="absolute -left-[9999px] opacity-0" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input type="text" name="website" id="website" tabIndex={-1} autoComplete="off" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-brand-blue">
                {t("name")}
              </label>
              <input
                name="name"
                required
                className="w-full rounded-lg border border-brand-light px-4 py-3 text-sm outline-none focus:border-brand-orange"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-brand-blue">
                {t("email")}
              </label>
              <input
                name="email"
                type="email"
                required
                className="w-full rounded-lg border border-brand-light px-4 py-3 text-sm outline-none focus:border-brand-orange"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-brand-blue">
                {t("type")}
              </label>
              <select
                name="type"
                required
                className="w-full rounded-lg border border-brand-light px-4 py-3 text-sm outline-none focus:border-brand-orange"
              >
                <option value="CONFERENCE">{t("conference")}</option>
                <option value="CONSULTING">{t("consulting")}</option>
                <option value="COLLABORATION">{t("collaboration")}</option>
                <option value="MEDIA">{t("media")}</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-brand-blue">
                {t("message")}
              </label>
              <textarea
                name="message"
                required
                rows={5}
                className="w-full rounded-lg border border-brand-light px-4 py-3 text-sm outline-none focus:border-brand-orange"
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-orange px-6 py-3 font-title text-sm font-semibold text-white transition hover:bg-brand-orange/90 disabled:opacity-50"
            >
              <Send size={16} />
              {t("send")}
            </button>
          </form>
        </div>
      </section>

      {/* vCard / Digital Contact Card */}
      <section className="border-t border-brand-light bg-brand-light/50 py-16">
        <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-black/5">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-blue/10">
              <UserCircle size={28} className="text-brand-blue" />
            </div>
            <h3 className="font-title text-lg font-bold text-brand-blue">
              Tarjeta de Contacto Digital
            </h3>
            <p className="mt-2 text-sm text-brand-blue/50">
              Escanea el QR o descarga mi contacto directamente a tu teléfono con todos mis datos, redes y páginas web.
            </p>

            {/* QR Preview */}
            <div className="mt-6 flex justify-center">
              <div className="rounded-xl bg-brand-light p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/api/vcard/qr"
                  alt="QR Code - Contacto Eduardo González"
                  width={140}
                  height={140}
                  className="h-36 w-36"
                />
              </div>
            </div>

            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-brand-blue/30">
              <QrCode size={12} />
              Escanea con tu cámara
            </p>

            {/* Action buttons */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href="/api/vcard"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-orange py-3 text-sm font-semibold text-white shadow-md shadow-brand-orange/20 transition hover:bg-brand-orange/90"
              >
                <Download size={16} />
                Guardar contacto
              </a>
              <Link
                href={`/${locale}/tarjeta`}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-brand-blue/15 py-3 text-sm font-semibold text-brand-blue transition hover:bg-brand-light"
              >
                <QrCode size={16} />
                Ver tarjeta completa
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
