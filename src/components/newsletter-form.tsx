"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

export function NewsletterForm() {
  const t = useTranslations("home");
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "es";
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="mt-4 text-sm font-medium text-brand-green">
        {t("newsletterSuccess")}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t("newsletterPlaceholder")}
        required
        className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-3.5 text-sm text-white placeholder-white/40 outline-none transition focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/50"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-xl bg-brand-orange px-6 py-3.5 font-title text-sm font-semibold text-white shadow-lg shadow-brand-orange/25 transition hover:bg-brand-orange/90 disabled:opacity-50"
      >
        {status === "loading" ? "..." : t("newsletterButton")}
      </button>
      {status === "error" && (
        <p className="mt-2 text-xs text-red-400">{t("newsletterError")}</p>
      )}
    </form>
  );
}
