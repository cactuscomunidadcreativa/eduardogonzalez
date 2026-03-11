import Link from "next/link";
import { Plus } from "lucide-react";

export default function AdminProjectsPage() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-title text-2xl font-bold text-brand-blue">
          Proyectos
        </h1>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 rounded-lg bg-brand-orange px-4 py-2 text-sm font-medium text-white hover:bg-brand-orange/90"
        >
          <Plus size={16} />
          Nuevo Proyecto
        </Link>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
        <p className="text-gray-500">No hay proyectos aún.</p>
      </div>
    </div>
  );
}
