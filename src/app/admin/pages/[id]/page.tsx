"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Save, Check, Languages, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Translation {
  locale: string;
  title: string;
  content: string;
  metaTitle: string;
  metaDesc: string;
}

const LOCALES = ["es", "en", "pt"] as const;
const LOCALE_LABELS: Record<string, string> = {
  es: "Español",
  en: "English",
  pt: "Português",
};

export default function EditPagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState("PUBLISHED");
  const [template, setTemplate] = useState("default");
  const [activeLocale, setActiveLocale] = useState<string>("es");
  const [translations, setTranslations] = useState<Record<string, Translation>>({
    es: { locale: "es", title: "", content: "", metaTitle: "", metaDesc: "" },
    en: { locale: "en", title: "", content: "", metaTitle: "", metaDesc: "" },
    pt: { locale: "pt", title: "", content: "", metaTitle: "", metaDesc: "" },
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [translating, setTranslating] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id === "new") {
      setLoading(false);
      return;
    }
    fetch(`/api/pages/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setSlug(data.slug || "");
        setStatus(data.status || "PUBLISHED");
        setTemplate(data.template || "default");
        const trans: Record<string, Translation> = {
          es: { locale: "es", title: "", content: "", metaTitle: "", metaDesc: "" },
          en: { locale: "en", title: "", content: "", metaTitle: "", metaDesc: "" },
          pt: { locale: "pt", title: "", content: "", metaTitle: "", metaDesc: "" },
        };
        if (data.translations) {
          for (const t of data.translations) {
            trans[t.locale] = {
              locale: t.locale,
              title: t.title || "",
              content: t.content || "",
              metaTitle: t.metaTitle || "",
              metaDesc: t.metaDesc || "",
            };
          }
        }
        setTranslations(trans);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  function updateTranslation(locale: string, field: keyof Translation, value: string) {
    setTranslations((prev) => ({
      ...prev,
      [locale]: { ...prev[locale], [field]: value },
    }));
  }

  async function handleSave() {
    setSaving(true);
    const body = {
      slug,
      status,
      template,
      translations: Object.values(translations).filter((t) => t.title || t.content),
    };

    try {
      if (id === "new") {
        const res = await fetch("/api/pages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (data.id) {
          router.push(`/admin/pages/${data.id}`);
        }
      } else {
        await fetch(`/api/pages/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      alert("Error al guardar");
    }
    setSaving(false);
  }

  async function handleAutoTranslate(targetLocale: string) {
    const sourceLocale = "es";
    const source = translations[sourceLocale];
    if (!source.title && !source.content) {
      alert("Primero escribe el contenido en español");
      return;
    }

    setTranslating(targetLocale);
    try {
      // Translate title
      if (source.title) {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: source.title,
            fromLocale: sourceLocale,
            toLocale: targetLocale,
            context: "page title",
          }),
        });
        const data = await res.json();
        if (data.translated) {
          updateTranslation(targetLocale, "title", data.translated);
        }
      }

      // Translate content
      if (source.content) {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: source.content,
            fromLocale: sourceLocale,
            toLocale: targetLocale,
            context: "page content",
          }),
        });
        const data = await res.json();
        if (data.translated) {
          updateTranslation(targetLocale, "content", data.translated);
        }
      }

      // Translate meta
      if (source.metaTitle) {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: source.metaTitle,
            fromLocale: sourceLocale,
            toLocale: targetLocale,
            context: "SEO title",
          }),
        });
        const data = await res.json();
        if (data.translated) {
          updateTranslation(targetLocale, "metaTitle", data.translated);
        }
      }

      if (source.metaDesc) {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: source.metaDesc,
            fromLocale: sourceLocale,
            toLocale: targetLocale,
            context: "SEO description",
          }),
        });
        const data = await res.json();
        if (data.translated) {
          updateTranslation(targetLocale, "metaDesc", data.translated);
        }
      }
    } catch {
      alert("Error en la traducción automática");
    }
    setTranslating(null);
  }

  if (loading) {
    return <div className="py-12 text-center text-gray-400">Cargando...</div>;
  }

  const current = translations[activeLocale];

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
          <h1 className="font-title text-2xl font-bold text-brand-blue">
            {id === "new" ? "Nueva página" : "Editar página"}
          </h1>
        </div>
        <div className="flex items-center gap-3">
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
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Guardar
          </button>
        </div>
      </div>

      {/* Page settings */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-sm font-semibold text-gray-700">Configuración</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm text-gray-500">Slug (URL)</label>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="mi-pagina"
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none focus:border-brand-orange"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-500">Estado</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none focus:border-brand-orange"
            >
              <option value="DRAFT">Borrador</option>
              <option value="PUBLISHED">Publicado</option>
              <option value="ARCHIVED">Archivado</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-500">Plantilla</label>
            <select
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none focus:border-brand-orange"
            >
              <option value="default">Por defecto</option>
              <option value="landing">Landing</option>
              <option value="manifesto">Manifiesto</option>
            </select>
          </div>
        </div>
      </div>

      {/* Locale tabs */}
      <div className="mb-4 flex items-center gap-2">
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
            {translating === activeLocale ? "Traduciendo..." : "Auto-traducir desde ES"}
          </button>
        )}
      </div>

      {/* Content editor */}
      <div className="space-y-4">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold text-gray-700">
            Contenido ({LOCALE_LABELS[activeLocale]})
          </h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-gray-500">Título</label>
              <input
                value={current.title}
                onChange={(e) => updateTranslation(activeLocale, "title", e.target.value)}
                placeholder="Título de la página"
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-lg font-medium outline-none focus:border-brand-orange"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-500">Contenido</label>
              <textarea
                value={current.content}
                onChange={(e) => updateTranslation(activeLocale, "content", e.target.value)}
                placeholder="Escribe el contenido de la página..."
                rows={16}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm leading-relaxed outline-none focus:border-brand-orange"
              />
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold text-gray-700">
            SEO ({LOCALE_LABELS[activeLocale]})
          </h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-gray-500">Título SEO</label>
              <input
                value={current.metaTitle}
                onChange={(e) => updateTranslation(activeLocale, "metaTitle", e.target.value)}
                placeholder="Título para buscadores"
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none focus:border-brand-orange"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-500">Descripción SEO</label>
              <textarea
                value={current.metaDesc}
                onChange={(e) => updateTranslation(activeLocale, "metaDesc", e.target.value)}
                placeholder="Descripción para buscadores"
                rows={3}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none focus:border-brand-orange"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
