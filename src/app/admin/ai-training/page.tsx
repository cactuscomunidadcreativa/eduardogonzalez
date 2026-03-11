"use client";

import { useState, useEffect } from "react";
import { Brain, Plus, Edit2, Trash2, Save, Check, X, Loader2 } from "lucide-react";

interface TrainingDoc {
  id: string;
  title: string;
  content: string;
  category: string;
  active: boolean;
}

const CATEGORIES = [
  "identity",
  "projects",
  "methodology",
  "philosophy",
  "experience",
  "other",
];

export default function AdminAITrainingPage() {
  const [docs, setDocs] = useState<TrainingDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);

  // New doc form
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("identity");
  const [newActive, setNewActive] = useState(true);
  const [saving, setSaving] = useState(false);

  // Edit form
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editActive, setEditActive] = useState(true);

  useEffect(() => {
    fetchDocs();
  }, []);

  async function fetchDocs() {
    try {
      const res = await fetch("/api/ai-training");
      const data = await res.json();
      setDocs(Array.isArray(data) ? data : []);
    } catch {}
    setLoading(false);
  }

  async function handleCreate() {
    if (!newTitle.trim()) return;
    setSaving(true);
    try {
      await fetch("/api/ai-training", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, content: newContent, category: newCategory, active: newActive }),
      });
      setNewTitle("");
      setNewContent("");
      setNewCategory("identity");
      setShowNew(false);
      await fetchDocs();
    } catch {}
    setSaving(false);
  }

  async function handleUpdate(id: string) {
    setSaving(true);
    try {
      await fetch(`/api/ai-training/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle, content: editContent, category: editCategory, active: editActive }),
      });
      setEditing(null);
      await fetchDocs();
    } catch {}
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este documento?")) return;
    await fetch(`/api/ai-training/${id}`, { method: "DELETE" });
    setDocs(docs.filter((d) => d.id !== id));
  }

  function startEdit(doc: TrainingDoc) {
    setEditing(doc.id);
    setEditTitle(doc.title);
    setEditContent(doc.content);
    setEditCategory(doc.category);
    setEditActive(doc.active);
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-title text-2xl font-bold text-brand-blue">
          Entrenamiento IA
        </h1>
        <button
          onClick={() => setShowNew(!showNew)}
          className="flex items-center gap-2 rounded-lg bg-brand-orange px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-orange/90"
        >
          <Plus size={16} />
          Nuevo documento
        </button>
      </div>

      <p className="mb-6 text-sm text-gray-500">
        Estos documentos alimentan la base de conocimiento del chat IA. El asistente responderá como Eduardo usando esta información.
      </p>

      {/* New document form */}
      {showNew && (
        <div className="mb-6 rounded-xl border border-brand-orange/30 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold text-gray-700">Nuevo documento</h3>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm text-gray-500">Título</label>
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ej: Mi filosofía sobre liderazgo"
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none focus:border-brand-orange"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-500">Categoría</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none focus:border-brand-orange"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-500">Contenido</label>
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Escribe la información que el IA debe conocer..."
                rows={6}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none focus:border-brand-orange"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={newActive}
                  onChange={(e) => setNewActive(e.target.checked)}
                  className="rounded"
                />
                Activo
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowNew(false)}
                  className="rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreate}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-lg bg-brand-orange px-4 py-2 text-sm font-medium text-white hover:bg-brand-orange/90 disabled:opacity-50"
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document list */}
      {loading ? (
        <div className="py-12 text-center text-gray-400">Cargando...</div>
      ) : docs.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <Brain className="mx-auto mb-4 text-gray-300" size={48} />
          <p className="text-gray-500">No hay documentos de entrenamiento</p>
        </div>
      ) : (
        <div className="space-y-3">
          {docs.map((doc) => (
            <div key={doc.id} className="rounded-xl border border-gray-200 bg-white p-4">
              {editing === doc.id ? (
                <div className="space-y-3">
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium outline-none focus:border-brand-orange"
                  />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={6}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-orange"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={editActive}
                          onChange={(e) => setEditActive(e.target.checked)}
                        />
                        Activo
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditing(null)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100">
                        <X size={16} />
                      </button>
                      <button
                        onClick={() => handleUpdate(doc.id)}
                        disabled={saving}
                        className="flex items-center gap-1 rounded-lg bg-brand-orange px-3 py-1.5 text-sm text-white disabled:opacity-50"
                      >
                        {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                        Guardar
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-brand-blue">{doc.title}</h3>
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                        {doc.category}
                      </span>
                      {!doc.active && (
                        <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-600">
                          Inactivo
                        </span>
                      )}
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                      {doc.content}
                    </p>
                  </div>
                  <div className="ml-4 flex items-center gap-1">
                    <button
                      onClick={() => startEdit(doc)}
                      className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-brand-blue"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
