"use client";

import { Plus, Save, Check } from "lucide-react";
import { useState } from "react";

export default function AdminAITrainingPage() {
  const [showForm, setShowForm] = useState(false);
  const [saved, setSaved] = useState(false);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("about");
  const [content, setContent] = useState("");
  const [active, setActive] = useState(true);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    // TODO: persist document to database
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setTitle("");
      setCategory("about");
      setContent("");
      setActive(true);
      setShowForm(false);
    }, 2000);
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-title text-2xl font-bold text-brand-blue">
            IA Training
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Documentos que alimentan el chat «Pregúntale a Eduardo»
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-lg bg-brand-orange px-4 py-2 text-sm font-medium text-white hover:bg-brand-orange/90"
        >
          <Plus size={16} />
          Nuevo documento
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSave}
          className="mb-8 rounded-xl border border-gray-200 bg-white p-6"
        >
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="mb-1 block text-sm text-gray-500">
                Título del documento
              </label>
              <input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand-orange"
                placeholder="Ej: Mi metodología de coaching"
              />
            </div>

            {/* Category */}
            <div>
              <label className="mb-1 block text-sm text-gray-500">
                Categoría
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand-orange"
              >
                <option value="about">Sobre Eduardo</option>
                <option value="methodology">Metodología</option>
                <option value="project">Proyecto</option>
                <option value="philosophy">Filosofía</option>
                <option value="testimonial">Testimonios</option>
                <option value="faq">Preguntas frecuentes</option>
              </select>
            </div>

            {/* Content */}
            <div>
              <label className="mb-1 block text-sm text-gray-500">
                Contenido
              </label>
              <textarea
                required
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand-orange"
                placeholder="Escribe aquí el contenido del documento de entrenamiento..."
              />
            </div>

            {/* Active toggle */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                role="switch"
                aria-checked={active}
                onClick={() => setActive(!active)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                  active ? "bg-brand-orange" : "bg-gray-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                    active ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
              <label className="text-sm text-gray-600">
                {active ? "Activo" : "Inactivo"} — el documento{" "}
                {active
                  ? "será utilizado por la IA"
                  : "no será utilizado por la IA"}
              </label>
            </div>

            {/* Save */}
            <div className="flex items-center gap-4 pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-lg bg-brand-orange px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-orange/90"
              >
                <Save size={16} />
                Guardar documento
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100"
              >
                Cancelar
              </button>
              {saved && (
                <span className="flex items-center gap-1.5 text-sm font-medium text-green-600">
                  <Check size={16} />
                  Documento guardado correctamente
                </span>
              )}
            </div>
          </div>
        </form>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
        <p className="text-gray-500">
          Añade documentos para entrenar la IA con el conocimiento de Eduardo.
        </p>
        <p className="mt-2 text-sm text-gray-400">
          Categorías: Sobre Eduardo, Metodología, Proyectos, Filosofía,
          Testimonios, Preguntas frecuentes
        </p>
      </div>
    </div>
  );
}
