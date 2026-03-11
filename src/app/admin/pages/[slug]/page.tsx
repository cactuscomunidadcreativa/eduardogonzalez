"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Check,
  Languages,
  Loader2,
  ExternalLink,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

const LOCALES = ["es", "en", "pt"] as const;
const LOCALE_LABELS: Record<string, string> = {
  es: "Espanol",
  en: "English",
  pt: "Portugues",
};

const SLUG_META: Record<
  string,
  { name: string; section: string; path: string }
> = {
  inicio: { name: "Inicio", section: "home", path: "/es" },
  "quien-soy": { name: "Quien Soy", section: "about", path: "/es/quien-soy" },
  "que-hago": { name: "Que Hago", section: "whatIDo", path: "/es/que-hago" },
  proyectos: { name: "Proyectos", section: "projects", path: "/es/proyectos" },
  ideas: { name: "Ideas", section: "ideas", path: "/es/ideas" },
  libros: { name: "Libros", section: "books", path: "/es/libros" },
  lab: { name: "Lab", section: "lab", path: "/es/lab" },
  contacto: { name: "Contacto", section: "contact", path: "/es/contacto" },
};

// Heuristic: use textarea for values longer than 80 chars or containing line breaks
function isLongValue(value: string): boolean {
  return value.length > 80 || value.includes("\n");
}

export default function EditSitePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const meta = SLUG_META[slug];

  const [activeLocale, setActiveLocale] = useState<string>("es");
  const [content, setContent] = useState<Record<string, Record<string, string>>>({
    es: {},
    en: {},
    pt: {},
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [translating, setTranslating] = useState<string | null>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch(`/api/site-content?slug=${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.content) {
          setContent(data.content);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  function updateField(locale: string, key: string, value: string) {
    setContent((prev) => ({
      ...prev,
      [locale]: { ...prev[locale], [key]: value },
    }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/site-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, content }),
      });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert("Error al guardar: " + (data.error || "Unknown error"));
      }
    } catch {
      alert("Error al guardar");
    }
    setSaving(false);
  }

  async function handleAutoTranslate(targetLocale: string) {
    const source = content.es;
    if (!source || Object.keys(source).length === 0) {
      alert("Primero debe haber contenido en espanol");
      return;
    }

    setTranslating(targetLocale);
    try {
      const translated = { ...content[targetLocale] };

      // Translate all keys from ES to target locale
      for (const [key, value] of Object.entries(source)) {
        if (!value || value.trim() === "") continue;

        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: value,
            fromLocale: "es",
            toLocale: targetLocale,
            context: `${meta?.name || slug} page - field: ${key}`,
          }),
        });
        const data = await res.json();
        if (data.translated) {
          translated[key] = data.translated;
        }
      }

      setContent((prev) => ({
        ...prev,
        [targetLocale]: translated,
      }));
    } catch {
      alert("Error en la traduccion automatica");
    }
    setTranslating(null);
  }

  function toggleGroup(group: string) {
    setCollapsedGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  }

  if (!meta) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">Pagina no encontrada: {slug}</p>
        <Link
          href="/admin/pages"
          className="mt-4 inline-block text-sm text-brand-orange hover:underline"
        >
          Volver a paginas
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={24} className="animate-spin text-gray-400" />
        <span className="ml-3 text-gray-400">Cargando contenido...</span>
      </div>
    );
  }

  const currentLocaleContent = content[activeLocale] || {};
  const keys = Object.keys(content.es || {});

  // Group keys by prefix (e.g., "timeline.t1Year" -> group "timeline")
  const groups: Record<string, string[]> = {};
  const ungrouped: string[] = [];

  for (const key of keys) {
    if (key.includes(".")) {
      const group = key.split(".")[0];
      if (!groups[group]) groups[group] = [];
      groups[group].push(key);
    } else {
      ungrouped.push(key);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/pages"
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-brand-blue"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="font-title text-2xl font-bold text-brand-blue">
              {meta.name}
            </h1>
            <p className="text-sm text-gray-400">
              Seccion: <span className="font-mono text-brand-orange">{meta.section}</span>
              {" / "}
              {keys.length} campos
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={meta.path}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:border-brand-blue/30 hover:text-brand-blue"
          >
            <ExternalLink size={14} />
            Ver pagina
          </Link>
          {saved && (
            <span className="flex items-center gap-1.5 text-sm font-medium text-green-600">
              <Check size={16} />
              Guardado
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-brand-orange px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-orange/90 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            Guardar
          </button>
        </div>
      </div>

      {/* Locale tabs */}
      <div className="mb-6 flex items-center gap-2">
        {LOCALES.map((locale) => (
          <button
            key={locale}
            onClick={() => setActiveLocale(locale)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              activeLocale === locale
                ? "bg-brand-orange text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {LOCALE_LABELS[locale]}
          </button>
        ))}

        {/* Auto-translate button */}
        {activeLocale !== "es" && (
          <button
            onClick={() => handleAutoTranslate(activeLocale)}
            disabled={translating !== null}
            className="ml-auto flex items-center gap-2 rounded-lg border border-brand-blue/20 px-4 py-2 text-sm font-medium text-brand-blue transition hover:bg-brand-blue/5 disabled:opacity-50"
          >
            {translating === activeLocale ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Languages size={14} />
            )}
            {translating === activeLocale
              ? "Traduciendo..."
              : "Auto-traducir desde ES"}
          </button>
        )}
      </div>

      {/* Ungrouped fields */}
      {ungrouped.length > 0 && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold text-gray-700">
            Campos principales ({LOCALE_LABELS[activeLocale]})
          </h3>
          <div className="space-y-4">
            {ungrouped.map((key) => {
              const esValue = content.es?.[key] || "";
              const currentValue = currentLocaleContent[key] || "";
              const isLong = isLongValue(esValue);

              return (
                <div key={key}>
                  <label className="mb-1 flex items-center gap-2 text-sm text-gray-500">
                    <span className="font-mono text-xs text-gray-400">{key}</span>
                    {activeLocale !== "es" && esValue && (
                      <span className="truncate text-xs text-gray-300" title={esValue}>
                        ES: {esValue.substring(0, 60)}
                        {esValue.length > 60 ? "..." : ""}
                      </span>
                    )}
                  </label>
                  {isLong ? (
                    <textarea
                      value={currentValue}
                      onChange={(e) => updateField(activeLocale, key, e.target.value)}
                      rows={Math.min(6, Math.max(2, Math.ceil(esValue.length / 100)))}
                      className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm leading-relaxed outline-none transition focus:border-brand-orange"
                    />
                  ) : (
                    <input
                      type="text"
                      value={currentValue}
                      onChange={(e) => updateField(activeLocale, key, e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-brand-orange"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Grouped fields */}
      {Object.entries(groups).map(([group, groupKeys]) => {
        const isCollapsed = collapsedGroups[group];

        return (
          <div
            key={group}
            className="mb-4 rounded-xl border border-gray-200 bg-white"
          >
            <button
              onClick={() => toggleGroup(group)}
              className="flex w-full items-center justify-between p-6 text-left"
            >
              <div className="flex items-center gap-2">
                {isCollapsed ? (
                  <ChevronRight size={16} className="text-gray-400" />
                ) : (
                  <ChevronDown size={16} className="text-gray-400" />
                )}
                <h3 className="text-sm font-semibold text-gray-700">
                  {group}
                </h3>
                <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-400">
                  {groupKeys.length} campos
                </span>
              </div>
              <span className="text-xs text-gray-400">
                {LOCALE_LABELS[activeLocale]}
              </span>
            </button>

            {!isCollapsed && (
              <div className="space-y-4 border-t border-gray-100 px-6 pb-6 pt-4">
                {groupKeys.map((key) => {
                  const shortKey = key.split(".").slice(1).join(".");
                  const esValue = content.es?.[key] || "";
                  const currentValue = currentLocaleContent[key] || "";
                  const isLong = isLongValue(esValue);

                  return (
                    <div key={key}>
                      <label className="mb-1 flex items-center gap-2 text-sm text-gray-500">
                        <span className="font-mono text-xs text-gray-400">
                          {shortKey}
                        </span>
                        {activeLocale !== "es" && esValue && (
                          <span
                            className="truncate text-xs text-gray-300"
                            title={esValue}
                          >
                            ES: {esValue.substring(0, 60)}
                            {esValue.length > 60 ? "..." : ""}
                          </span>
                        )}
                      </label>
                      {isLong ? (
                        <textarea
                          value={currentValue}
                          onChange={(e) =>
                            updateField(activeLocale, key, e.target.value)
                          }
                          rows={Math.min(
                            6,
                            Math.max(2, Math.ceil(esValue.length / 100))
                          )}
                          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm leading-relaxed outline-none transition focus:border-brand-orange"
                        />
                      ) : (
                        <input
                          type="text"
                          value={currentValue}
                          onChange={(e) =>
                            updateField(activeLocale, key, e.target.value)
                          }
                          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-brand-orange"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
