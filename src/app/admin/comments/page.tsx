"use client";

import { useState, useEffect } from "react";
import {
  MessageSquare,
  Check,
  X,
  Trash2,
  Loader2,
  User,
  FileText,
  Clock,
  Filter,
} from "lucide-react";

interface Comment {
  id: string;
  postId: string;
  authorName: string | null;
  authorEmail: string | null;
  content: string;
  status: string;
  createdAt: string;
  post?: { id: string; translations: { title: string; locale: string }[] };
  user?: { name: string | null; image: string | null } | null;
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Pendiente", color: "bg-yellow-100 text-yellow-700" },
  APPROVED: { label: "Aprobado", color: "bg-green-100 text-green-700" },
  REJECTED: { label: "Rechazado", color: "bg-red-100 text-red-700" },
};

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");

  useEffect(() => {
    fetch("/api/comments?all=true")
      .then((r) => r.json())
      .then((data) => {
        setComments(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/api/comments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setComments((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status } : c))
      );
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este comentario?")) return;
    const res = await fetch(`/api/comments/${id}`, { method: "DELETE" });
    if (res.ok) {
      setComments((prev) => prev.filter((c) => c.id !== id));
    }
  }

  const filtered =
    filter === "ALL" ? comments : comments.filter((c) => c.status === filter);

  const pendingCount = comments.filter((c) => c.status === "PENDING").length;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-title text-2xl font-bold text-brand-blue">
            Comentarios
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            {comments.length} comentario{comments.length !== 1 ? "s" : ""}
            {pendingCount > 0 && (
              <span className="ml-2 rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-700">
                {pendingCount} pendiente{pendingCount !== 1 ? "s" : ""}
              </span>
            )}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-gray-400" size={24} />
        </div>
      ) : comments.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <MessageSquare className="mx-auto mb-4 text-gray-300" size={48} />
          <p className="text-gray-500">No hay comentarios aún</p>
          <p className="mt-1 text-sm text-gray-400">
            Los comentarios aparecerán aquí cuando los usuarios los envíen.
          </p>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="mb-4 flex items-center gap-2">
            <Filter size={14} className="text-gray-400" />
            {[
              { key: "ALL", label: "Todos" },
              { key: "PENDING", label: "Pendientes" },
              { key: "APPROVED", label: "Aprobados" },
              { key: "REJECTED", label: "Rechazados" },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  filter === f.key
                    ? "bg-brand-blue text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Comments */}
          <div className="space-y-3">
            {filtered.map((comment) => {
              const postTitle =
                comment.post?.translations.find((t) => t.locale === "es")
                  ?.title || "Post sin título";
              const statusConf =
                STATUS_CONFIG[comment.status] || STATUS_CONFIG.PENDING;
              const authorName =
                comment.user?.name || comment.authorName || "Anónimo";

              return (
                <div
                  key={comment.id}
                  className={`rounded-xl border bg-white p-4 transition ${
                    comment.status === "PENDING"
                      ? "border-yellow-200"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      {/* Author & post */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1 font-medium text-brand-blue">
                          <User size={12} />
                          {authorName}
                        </span>
                        {comment.authorEmail && (
                          <span className="text-gray-400">
                            {comment.authorEmail}
                          </span>
                        )}
                        <span className="text-gray-300">•</span>
                        <span className="flex items-center gap-1">
                          <FileText size={10} />
                          {postTitle}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={10} />
                          {new Date(comment.createdAt).toLocaleDateString("es")}
                        </span>
                      </div>

                      {/* Content */}
                      <p className="mt-2 text-sm leading-relaxed text-gray-700">
                        {comment.content}
                      </p>
                    </div>

                    {/* Status & actions */}
                    <div className="flex flex-shrink-0 items-center gap-1">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${statusConf.color}`}
                      >
                        {statusConf.label}
                      </span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="mt-3 flex items-center gap-2 border-t border-gray-100 pt-3">
                    {comment.status !== "APPROVED" && (
                      <button
                        onClick={() => updateStatus(comment.id, "APPROVED")}
                        className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-green-600 transition hover:bg-green-50"
                      >
                        <Check size={12} />
                        Aprobar
                      </button>
                    )}
                    {comment.status !== "REJECTED" && (
                      <button
                        onClick={() => updateStatus(comment.id, "REJECTED")}
                        className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                      >
                        <X size={12} />
                        Rechazar
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-400 transition hover:bg-gray-50 hover:text-red-500"
                    >
                      <Trash2 size={12} />
                      Eliminar
                    </button>
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                <p className="text-sm text-gray-400">
                  No hay comentarios con este filtro
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
