"use client";

import { useState, useEffect } from "react";
import {
  Mail,
  Users,
  Download,
  Trash2,
  Loader2,
  Globe,
  Check,
  X,
  Search,
} from "lucide-react";

interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  locale: string;
  confirmed: boolean;
  subscribedAt: string;
  unsubscribedAt: string | null;
}

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/newsletter")
      .then((r) => r.json())
      .then((data) => {
        setSubscribers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este suscriptor?")) return;
    const res = await fetch(`/api/newsletter/${id}`, { method: "DELETE" });
    if (res.ok) {
      setSubscribers((prev) => prev.filter((s) => s.id !== id));
    }
  }

  function handleExportCSV() {
    const headers = ["Email", "Nombre", "Idioma", "Fecha suscripción"];
    const rows = filtered.map((s) => [
      s.email,
      s.name || "",
      s.locale,
      new Date(s.subscribedAt).toLocaleDateString("es"),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `suscriptores-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = subscribers.filter(
    (s) =>
      !s.unsubscribedAt &&
      (s.email.toLowerCase().includes(search.toLowerCase()) ||
        (s.name || "").toLowerCase().includes(search.toLowerCase()))
  );

  const activeCount = subscribers.filter((s) => !s.unsubscribedAt).length;
  const unsubCount = subscribers.filter((s) => s.unsubscribedAt).length;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-title text-2xl font-bold text-brand-blue">
            Newsletter
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            {activeCount} suscriptor{activeCount !== 1 ? "es" : ""} activo{activeCount !== 1 ? "s" : ""}
            {unsubCount > 0 && (
              <span className="ml-1 text-gray-300">
                ({unsubCount} dado{unsubCount !== 1 ? "s" : ""} de baja)
              </span>
            )}
          </p>
        </div>
        {subscribers.length > 0 && (
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 rounded-lg bg-brand-blue px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-blue/90"
          >
            <Download size={16} />
            Exportar CSV
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-gray-400" size={24} />
        </div>
      ) : subscribers.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <Users className="mx-auto mb-4 text-gray-300" size={48} />
          <p className="text-gray-500">No hay suscriptores aún</p>
          <p className="mt-1 text-sm text-gray-400">
            Los suscriptores aparecerán aquí cuando alguien se registre al newsletter.
          </p>
        </div>
      ) : (
        <>
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por email o nombre..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Idioma</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-gray-400" />
                        <a
                          href={`mailto:${sub.email}`}
                          className="text-sm text-brand-blue hover:underline"
                        >
                          {sub.email}
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {sub.name || <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-0.5 text-xs font-medium uppercase text-gray-600">
                        <Globe size={10} />
                        {sub.locale}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {sub.confirmed ? (
                        <span className="inline-flex items-center gap-1 text-xs text-green-600">
                          <Check size={12} />
                          Confirmado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-yellow-600">
                          <X size={12} />
                          Pendiente
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {new Date(sub.subscribedAt).toLocaleDateString("es")}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(sub.id)}
                        className="rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                        title="Eliminar"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-400">
                      No se encontraron suscriptores
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
