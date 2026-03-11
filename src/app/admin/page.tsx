import Link from "next/link";
import {
  FileText,
  MessageSquare,
  Mail,
  Users,
  Plus,
  FolderPlus,
  ExternalLink,
} from "lucide-react";

const stats = [
  { label: "Posts", value: "0", icon: FileText, color: "bg-brand-orange" },
  { label: "Comentarios", value: "0", icon: MessageSquare, color: "bg-brand-green" },
  { label: "Suscriptores", value: "0", icon: Mail, color: "bg-brand-blue" },
  { label: "Contactos", value: "0", icon: Users, color: "bg-brand-gray" },
];

const quickActions = [
  {
    label: "Gestionar páginas",
    href: "/admin/pages",
    icon: FileText,
    color: "bg-brand-orange",
  },
  {
    label: "Crear nuevo post",
    href: "/admin/posts/new",
    icon: Plus,
    color: "bg-brand-orange",
  },
  {
    label: "Crear nuevo proyecto",
    href: "/admin/projects/new",
    icon: FolderPlus,
    color: "bg-brand-green",
  },
  {
    label: "Ver sitio",
    href: "/",
    icon: ExternalLink,
    color: "bg-brand-blue",
    external: true,
  },
];

export default function AdminDashboard() {
  return (
    <div>
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="font-title text-2xl font-bold text-brand-blue">
          ¡Bienvenido, Eduardo!
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Este es tu panel de administración. Desde aquí puedes gestionar todo el
          contenido de tu sitio web.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-xl border border-gray-200 bg-white p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="mt-1 text-3xl font-bold text-brand-blue">
                  {value}
                </p>
              </div>
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${color} text-white`}
              >
                <Icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-10">
        <h2 className="mb-4 text-sm font-semibold text-gray-700">
          Acciones rápidas
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {quickActions.map(({ label, href, icon: Icon, color, external }) => (
            <Link
              key={label}
              href={href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${color} text-white`}
              >
                <Icon size={18} />
              </div>
              <span className="text-sm font-medium text-gray-700">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Info banner */}
      <div className="mt-10 rounded-xl border border-gray-200 bg-white p-8 text-center">
        <p className="text-gray-500">
          Panel de administración de Eduardo González
        </p>
        <p className="mt-2 text-sm text-gray-400">
          Conecta tu base de datos Neon para comenzar a gestionar contenido.
        </p>
      </div>
    </div>
  );
}
