"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Folder,
  BookOpen,
  MessageSquare,
  Image,
  Mail,
  Brain,
  Users,
  Settings,
  LogOut,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Páginas", href: "/admin/pages", icon: FileText },
  { label: "Posts", href: "/admin/posts", icon: FileText },
  { label: "Proyectos", href: "/admin/projects", icon: Folder },
  { label: "Libros", href: "/admin/books", icon: BookOpen },
  { label: "Comentarios", href: "/admin/comments", icon: MessageSquare },
  { label: "Media", href: "/admin/media", icon: Image },
  { label: "Newsletter", href: "/admin/newsletter", icon: Mail },
  { label: "IA Training", href: "/admin/ai-training", icon: Brain },
  { label: "Contactos", href: "/admin/contacts", icon: Users },
  { label: "Ajustes", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Login page uses its own full-screen layout
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 flex h-full w-60 flex-col border-r border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-4">
          <Link href="/admin" className="font-title text-lg font-bold text-brand-blue">
            EG Admin
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive =
              href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-brand-orange/10 text-brand-orange"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-gray-200 px-3 py-4">
          <Link
            href="/api/auth/signout"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            <LogOut size={18} />
            Cerrar sesión
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-60 flex-1 p-8">{children}</main>
    </div>
  );
}
