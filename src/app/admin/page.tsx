"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  FileText,
  FolderKanban,
  BookOpen,
  Mail,
  Users,
  Plus,
  Settings,
  ExternalLink,
  LayoutDashboard,
  Home,
  User,
  Briefcase,
  Lightbulb,
  FlaskConical,
  Phone,
  RefreshCw,
  Loader2,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Stats {
  posts: number | null;
  projects: number | null;
  books: number | null;
  subscribers: number | null;
  contacts: number | null;
}

/* ------------------------------------------------------------------ */
/*  Animated counter                                                   */
/* ------------------------------------------------------------------ */

function AnimatedCount({ value, duration = 800 }: { value: number | null; duration?: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (value === null) return;
    if (value === 0) {
      setDisplay(0);
      return;
    }

    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * value!);
      setDisplay(current);
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [value, duration]);

  if (value === null) {
    return <Loader2 className="h-7 w-7 animate-spin text-gray-300" />;
  }

  return <>{display}</>;
}

/* ------------------------------------------------------------------ */
/*  Static data                                                        */
/* ------------------------------------------------------------------ */

const sitePages = [
  { label: "Inicio", slug: "inicio", icon: Home },
  { label: "Quien Soy", slug: "quien-soy", icon: User },
  { label: "Que Hago", slug: "que-hago", icon: Briefcase },
  { label: "Proyectos", slug: "proyectos", icon: FolderKanban },
  { label: "Ideas", slug: "ideas", icon: Lightbulb },
  { label: "Libros", slug: "libros", icon: BookOpen },
  { label: "Lab", slug: "lab", icon: FlaskConical },
  { label: "Contacto", slug: "contacto", icon: Phone },
];

const quickActions = [
  { label: "Editar paginas", href: "/admin/pages", icon: FileText, color: "bg-brand-blue" },
  { label: "Nuevo post", href: "/admin/posts/new", icon: Plus, color: "bg-brand-orange" },
  { label: "Nuevo proyecto", href: "/admin/projects/new", icon: FolderKanban, color: "bg-brand-green" },
  { label: "Nuevo libro", href: "/admin/books/new", icon: BookOpen, color: "bg-brand-orange" },
  { label: "Ajustes", href: "/admin/settings", icon: Settings, color: "bg-brand-gray" },
  { label: "Ver sitio", href: "/", icon: ExternalLink, color: "bg-brand-blue", external: true },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    posts: null,
    projects: null,
    books: null,
    subscribers: null,
    contacts: null,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setLoading(true);

    const results = await Promise.allSettled([
      fetch("/api/posts?admin=true").then((r) => r.json()),
      fetch("/api/projects?all=true").then((r) => r.json()),
      fetch("/api/books").then((r) => r.json()),
      fetch("/api/newsletter").then((r) => r.json()),
      fetch("/api/contact?count=true").then((r) => r.json()),
    ]);

    setStats({
      posts:
        results[0].status === "fulfilled"
          ? Array.isArray(results[0].value)
            ? results[0].value.length
            : 0
          : 0,
      projects:
        results[1].status === "fulfilled"
          ? Array.isArray(results[1].value)
            ? results[1].value.length
            : 0
          : 0,
      books:
        results[2].status === "fulfilled"
          ? Array.isArray(results[2].value)
            ? results[2].value.length
            : 0
          : 0,
      subscribers:
        results[3].status === "fulfilled"
          ? Array.isArray(results[3].value)
            ? results[3].value.length
            : 0
          : 0,
      contacts:
        results[4].status === "fulfilled"
          ? results[4].value?.count ?? 0
          : 0,
    });

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const statCards = [
    { label: "Posts", key: "posts" as const, icon: FileText, color: "bg-brand-orange", href: "/admin/posts" },
    { label: "Proyectos", key: "projects" as const, icon: FolderKanban, color: "bg-brand-green", href: "/admin/projects" },
    { label: "Libros", key: "books" as const, icon: BookOpen, color: "bg-brand-blue", href: "/admin/books" },
    { label: "Suscriptores", key: "subscribers" as const, icon: Mail, color: "bg-brand-orange", href: "/admin/newsletter" },
    { label: "Contactos", key: "contacts" as const, icon: Users, color: "bg-brand-gray", href: "/admin/contacts" },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      {/* Welcome header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-title text-2xl font-bold text-brand-blue">
            Bienvenido, Eduardo
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Panel de administracion &mdash; gestiona todo el contenido de tu sitio.
          </p>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Actualizar
        </button>
      </div>

      {/* ---- Stats cards ---- */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {statCards.map(({ label, key, icon: Icon, color, href }) => (
          <Link
            key={key}
            href={href}
            className="group rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${color} text-white`}
              >
                <Icon size={18} />
              </div>
            </div>
            <p className="mt-4 text-3xl font-bold text-brand-blue">
              <AnimatedCount value={stats[key]} />
            </p>
            <p className="mt-1 text-sm text-gray-500 group-hover:text-brand-orange transition-colors">
              {label}
            </p>
          </Link>
        ))}
      </div>

      {/* ---- Quick actions ---- */}
      <div className="mt-10">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-400">
          <LayoutDashboard size={14} />
          Acciones rapidas
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map(({ label, href, icon: Icon, color, external }) => (
            <Link
              key={label}
              href={href}
              {...(external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-brand-orange/30 hover:shadow-md"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${color} text-white`}
              >
                <Icon size={18} />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {label}
              </span>
              {external && (
                <ExternalLink size={12} className="ml-auto text-gray-400" />
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* ---- Site pages ---- */}
      <div className="mt-10">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-400">
          <FileText size={14} />
          Paginas del sitio
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {sitePages.map(({ label, slug, icon: Icon }) => (
            <Link
              key={slug}
              href={`/admin/pages/${slug}`}
              className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-brand-green/30 hover:shadow-md"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-blue/10 text-brand-blue transition-colors group-hover:bg-brand-green/10 group-hover:text-brand-green">
                <Icon size={16} />
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-brand-blue">
                  {label}
                </span>
                <p className="text-xs text-gray-400">/{slug}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ---- Footer info ---- */}
      <div className="mt-10 rounded-xl border border-gray-200 bg-white p-6 text-center">
        <p className="text-sm text-gray-400">
          Panel de administracion &middot; Eduardo Gonzalez Coach
        </p>
      </div>
    </div>
  );
}
