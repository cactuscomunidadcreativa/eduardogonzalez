"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Upload,
  Loader2,
  Copy,
  Check,
  ImageIcon,
  FolderOpen,
  X,
  Pencil,
  Trash2,
  DatabaseZap,
} from "lucide-react";
import ImageEditor from "@/components/admin/image-editor";

interface MediaFile {
  id: string;
  name: string;
  url: string;
  size: number;
  category: string;
  source?: "static" | "db";
}

const CATEGORIES = ["Todos", "General", "Logos", "Libros"];

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminMediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [copied, setCopied] = useState<string | null>(null);
  const [preview, setPreview] = useState<MediaFile | null>(null);
  const [uploadCategory, setUploadCategory] = useState("General");
  const [editing, setEditing] = useState<MediaFile | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [migrating, setMigrating] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  async function fetchMedia() {
    try {
      const res = await fetch("/api/media");
      const data = await res.json();
      setFiles(Array.isArray(data) ? data : []);
    } catch {
      // ignore
    }
    setLoading(false);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    setUploading(true);
    let successCount = 0;
    for (const file of Array.from(fileList)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", uploadCategory);

      try {
        const res = await fetch("/api/media", { method: "POST", body: formData });
        if (res.ok) successCount++;
      } catch {
        // ignore individual errors
      }
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
    setUploading(false);
    if (successCount > 0) {
      await fetchMedia();
    }
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  }

  async function handleDelete(file: MediaFile) {
    if (!confirm(`¿Eliminar "${file.name}"? Esta acción no se puede deshacer.`)) return;
    setDeleting(file.id);
    try {
      const res = await fetch("/api/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: file.id }),
      });
      if (res.ok) {
        await fetchMedia();
        if (preview?.id === file.id) setPreview(null);
      }
    } catch {
      // ignore
    }
    setDeleting(null);
  }

  async function handleMigrate(file: MediaFile) {
    setMigrating(file.id);
    try {
      const res = await fetch("/api/media", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staticUrl: file.url, category: file.category }),
      });
      if (res.ok) {
        await fetchMedia();
      }
    } catch {
      // ignore
    }
    setMigrating(null);
  }

  const isEditable = (file: MediaFile) => file.source !== "static" && !file.id.startsWith("static-");
  const isStatic = (file: MediaFile) => file.source === "static" || file.id.startsWith("static-");

  const filteredFiles =
    activeCategory === "Todos"
      ? files
      : files.filter((f) => f.category === activeCategory);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-title text-2xl font-bold text-brand-blue">
            Media
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestiona todas las imágenes del sitio: fotos, logos, carátulas de libros.
          </p>
        </div>
      </div>

      {/* Upload zone */}
      <div className="mb-6 rounded-xl border-2 border-dashed border-gray-300 bg-white p-8 transition hover:border-brand-orange/50">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-brand-orange/10 text-brand-orange">
            <Upload size={28} />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-sm font-semibold text-gray-700">Subir imágenes</h3>
            <p className="mt-1 text-xs text-gray-400">
              JPG, PNG, GIF, SVG, WebP. Haz click para seleccionar.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <select
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value)}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-orange"
              >
                <option value="General">General (perfil, etc.)</option>
                <option value="Logos">Logos</option>
                <option value="Libros">Carátulas de Libros</option>
              </select>
              <label className="cursor-pointer rounded-lg bg-brand-orange px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-orange/90">
                {uploading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin" />
                    Subiendo...
                  </span>
                ) : (
                  "Seleccionar archivos"
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div className="mb-6 flex items-center gap-2">
        <FolderOpen size={16} className="text-gray-400" />
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              activeCategory === cat
                ? "bg-brand-orange text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat}
            {cat !== "Todos" && (
              <span className="ml-1 text-xs opacity-70">
                ({files.filter((f) => f.category === cat).length})
              </span>
            )}
          </button>
        ))}
        <span className="ml-auto text-sm text-gray-400">
          {filteredFiles.length} archivos
        </span>
      </div>

      {/* Gallery */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={24} className="animate-spin text-gray-400" />
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <ImageIcon className="mx-auto mb-4 text-gray-300" size={48} />
          <p className="text-gray-500">
            {activeCategory === "Todos"
              ? "No hay imágenes aún"
              : `No hay imágenes en "${activeCategory}"`}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredFiles.map((file) => (
            <div
              key={file.id || file.url}
              className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:shadow-md"
            >
              <button
                onClick={() => setPreview(file)}
                className="relative block aspect-square w-full overflow-hidden bg-gray-50"
              >
                <Image
                  src={file.url}
                  alt={file.name}
                  fill
                  className="object-contain p-2 transition group-hover:scale-105"
                  unoptimized
                />
              </button>

              {/* Action buttons overlay - DB files */}
              {isEditable(file) && (
                <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition group-hover:opacity-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditing(file);
                    }}
                    className="rounded-lg bg-white/90 p-2 text-gray-600 shadow-sm transition hover:bg-brand-orange hover:text-white"
                    title="Editar imagen"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(file);
                    }}
                    disabled={deleting === file.id}
                    className="rounded-lg bg-white/90 p-2 text-gray-600 shadow-sm transition hover:bg-red-500 hover:text-white disabled:opacity-50"
                    title="Eliminar imagen"
                  >
                    {deleting === file.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                </div>
              )}

              {/* Migrate button overlay - static files */}
              {isStatic(file) && (
                <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition group-hover:opacity-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMigrate(file);
                    }}
                    disabled={migrating === file.id}
                    className="rounded-lg bg-white/90 p-2 text-gray-600 shadow-sm transition hover:bg-brand-blue hover:text-white disabled:opacity-50"
                    title="Migrar a DB para poder editar"
                  >
                    {migrating === file.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <DatabaseZap size={14} />
                    )}
                  </button>
                </div>
              )}

              <div className="p-3">
                <p className="truncate text-sm font-medium text-gray-700" title={file.name}>
                  {file.name}
                </p>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-xs text-gray-400">{formatSize(file.size)}</span>
                  <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                    {file.category}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-1">
                  <button
                    onClick={() => copyUrl(file.url)}
                    className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-gray-500 transition hover:bg-gray-100 hover:text-brand-blue"
                  >
                    {copied === file.url ? (
                      <>
                        <Check size={12} className="text-green-500" />
                        <span className="text-green-500">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        Copiar URL
                      </>
                    )}
                  </button>
                  {isEditable(file) && (
                    <button
                      onClick={() => setEditing(file)}
                      className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-gray-500 transition hover:bg-gray-100 hover:text-brand-orange"
                    >
                      <Pencil size={12} />
                      Editar
                    </button>
                  )}
                  {isStatic(file) && (
                    <button
                      onClick={() => handleMigrate(file)}
                      disabled={migrating === file.id}
                      className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-gray-500 transition hover:bg-gray-100 hover:text-brand-blue"
                    >
                      {migrating === file.id ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <DatabaseZap size={12} />
                      )}
                      Migrar a DB
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview modal */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="relative max-h-[90vh] max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <button
              onClick={() => setPreview(null)}
              className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-2 text-gray-600 transition hover:bg-white hover:text-red-500"
            >
              <X size={20} />
            </button>
            <div className="relative max-h-[70vh] overflow-auto bg-gray-50 p-4">
              <Image
                src={preview.url}
                alt={preview.name}
                width={800}
                height={600}
                className="mx-auto h-auto max-h-[60vh] w-auto object-contain"
                unoptimized
              />
            </div>
            <div className="border-t border-gray-200 px-6 py-4">
              <h3 className="font-medium text-gray-700">{preview.name}</h3>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span>{formatSize(preview.size)}</span>
                <span>{preview.category}</span>
                <code className="rounded bg-gray-100 px-2 py-1 text-xs">
                  {preview.url}
                </code>
                <div className="ml-auto flex items-center gap-2">
                  {isEditable(preview) && (
                    <button
                      onClick={() => {
                        setPreview(null);
                        setEditing(preview);
                      }}
                      className="flex items-center gap-1 rounded-lg bg-brand-blue px-3 py-1.5 text-xs font-medium text-white transition hover:bg-brand-blue/90"
                    >
                      <Pencil size={12} />
                      Editar
                    </button>
                  )}
                  <button
                    onClick={() => copyUrl(preview.url)}
                    className="flex items-center gap-1 rounded-lg bg-brand-orange px-3 py-1.5 text-xs font-medium text-white transition hover:bg-brand-orange/90"
                  >
                    {copied === preview.url ? <Check size={12} /> : <Copy size={12} />}
                    Copiar URL
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image editor modal */}
      {editing && (
        <ImageEditor
          imageUrl={editing.url}
          mediaId={editing.id}
          mediaName={editing.name}
          onSave={() => {
            setEditing(null);
            fetchMedia();
          }}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
