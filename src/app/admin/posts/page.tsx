import Link from "next/link";
import { Plus } from "lucide-react";

export default function AdminPostsPage() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-title text-2xl font-bold text-brand-blue">
          Posts
        </h1>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 rounded-lg bg-brand-orange px-4 py-2 text-sm font-medium text-white hover:bg-brand-orange/90"
        >
          <Plus size={16} />
          Nuevo Post
        </Link>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
        <p className="text-gray-500">No hay posts a\u00fan.</p>
        <p className="mt-2 text-sm text-gray-400">
          Conecta la base de datos y crea tu primer art\u00edculo.
        </p>
      </div>
    </div>
  );
}
