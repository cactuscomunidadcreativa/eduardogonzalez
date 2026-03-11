"use client";

import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

const categories = ["EMOTIONS", "DECISIONS", "SYSTEMS", "TECHNOLOGY", "LEADERSHIP"];
const locales = ["es", "en", "pt"];

export default function NewPostPage() {
  const [activeLocale, setActiveLocale] = useState("es");
  const [saving, setSaving] = useState(false);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/posts"
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-title text-2xl font-bold text-brand-blue">
            Nuevo Post
          </h1>
        </div>
        <button
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-brand-orange px-4 py-2 text-sm font-medium text-white hover:bg-brand-orange/90 disabled:opacity-50"
        >
          <Save size={16} />
          Guardar
        </button>
      </div>

      {/* Locale tabs */}
      <div className="mb-6 flex gap-1 rounded-lg bg-gray-100 p-1">
        {locales.map((loc) => (
          <button
            key={loc}
            onClick={() => setActiveLocale(loc)}
            className={`rounded-md px-4 py-2 text-sm font-medium uppercase transition ${
              activeLocale === loc
                ? "bg-white text-brand-orange shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {loc}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Editor */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Título ({activeLocale.toUpperCase()})
              </label>
              <input
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-lg font-title font-bold outline-none focus:border-brand-orange"
                placeholder="Título del artículo..."
              />
            </div>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Extracto ({activeLocale.toUpperCase()})
              </label>
              <textarea
                rows={2}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand-orange"
                placeholder="Breve descripción..."
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Contenido ({activeLocale.toUpperCase()})
              </label>
              <div className="min-h-[400px] rounded-lg border border-gray-200 p-4">
                <p className="text-gray-400">
                  Editor TipTap se integrará aquí. Por ahora usa el textarea.
                </p>
                <textarea
                  rows={15}
                  className="mt-2 w-full border-0 outline-none"
                  placeholder="Escribe tu artículo aquí..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold text-gray-700">
              Publicación
            </h3>
            <select className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none">
              <option value="DRAFT">Borrador</option>
              <option value="PUBLISHED">Publicado</option>
            </select>
          </div>

          {/* Category */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold text-gray-700">
              Categoría
            </h3>
            <select className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none">
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Slug */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold text-gray-700">Slug</h3>
            <input
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-orange"
              placeholder="mi-articulo"
            />
          </div>

          {/* SEO */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold text-gray-700">SEO</h3>
            <div className="space-y-3">
              <input
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none"
                placeholder="Meta título"
              />
              <textarea
                rows={2}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none"
                placeholder="Meta descripción"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
