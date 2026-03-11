"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Folder, Plus, Edit2, Trash2, Globe } from "lucide-react";

interface ProjectItem {
  id: string;
  slug: string;
  status: string;
  sortOrder: number;
  translations: { locale: string; title: string }[];
  updatedAt: string;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects?all=true")
      .then((r) => r.json())
      .then((data) => {
        setProjects(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este proyecto?")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    setProjects(projects.filter((p) => p.id !== id));
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-title text-2xl font-bold text-brand-blue">
          Proyectos
        </h1>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 rounded-lg bg-brand-orange px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-orange/90"
        >
          <Plus size={16} />
          Nuevo proyecto
        </Link>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-400">Cargando...</div>
      ) : projects.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <Folder className="mx-auto mb-4 text-gray-300" size={48} />
          <p className="text-gray-500">No hay proyectos aún</p>
          <p className="mt-1 text-sm text-gray-400">
            Crea tu primer proyecto para comenzar
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => {
            const esTitle = project.translations.find((t) => t.locale === "es")?.title || project.slug;
            const locales = project.translations.map((t) => t.locale);
            return (
              <div
                key={project.id}
                className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-blue/10 text-brand-blue">
                    <Folder size={18} />
                  </div>
                  <div>
                    <h3 className="font-medium text-brand-blue">{esTitle}</h3>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                      <span>/{project.slug}</span>
                      <span>·</span>
                      <span
                        className={
                          project.status === "PUBLISHED"
                            ? "text-green-500"
                            : project.status === "ARCHIVED"
                              ? "text-red-400"
                              : "text-yellow-500"
                        }
                      >
                        {project.status}
                      </span>
                      <span>·</span>
                      <div className="flex items-center gap-1">
                        <Globe size={10} />
                        {["es", "en", "pt"].map((l) => (
                          <span
                            key={l}
                            className={`uppercase ${locales.includes(l) ? "font-bold text-brand-orange" : "text-gray-300"}`}
                          >
                            {l}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/projects/${project.id}`}
                    className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-brand-blue"
                  >
                    <Edit2 size={16} />
                  </Link>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
