"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const t = useTranslations("contact");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      type: (form.elements.namedItem("type") as HTMLSelectElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
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
    </>
  );
}
