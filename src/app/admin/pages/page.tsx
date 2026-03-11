"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Home,
  User,
  Briefcase,
  FolderOpen,
  Lightbulb,
  BookOpen,
  FlaskConical,
  Mail,
  Globe,
  Edit2,
  ExternalLink,
  FileText,
  Loader2,
} from "lucide-react";

interface SitePage {
  slug: string;
  name: string;
  description: string;
  icon: React.ElementType;
  path: string;
  section: string;
}

const SITE_PAGES: SitePage[] = [
  {
    slug: "inicio",
    name: "Inicio",
    description: "Pagina principal con hero, pilares, proyectos destacados y newsletter",
    icon: Home,
    path: "/es",
    section: "home",
  },
  {
    slug: "quien-soy",
    name: "Quien Soy",
    description: "Historia personal, trayectoria, vision y meta noble",
    icon: User,
    path: "/es/quien-soy",
    section: "about",
  },
  {
    slug: "que-hago",
    name: "Que Hago",
    description: "Cuatro pilares: IE Aplicada, Emotional Budgeting, Tecnologia Emocional, Sistemas Humanos",
    icon: Briefcase,
    path: "/es/que-hago",
    section: "whatIDo",
  },
  {
    slug: "proyectos",
    name: "Proyectos",
    description: "Listado de proyectos: ROWI, Six Seconds, Cactus, Oveja Libre",
    icon: FolderOpen,
    path: "/es/proyectos",
    section: "projects",
  },
  {
    slug: "ideas",
    name: "Ideas",
    description: "Blog con articulos sobre emociones, decisiones, sistemas y liderazgo",
    icon: Lightbulb,
    path: "/es/ideas",
    section: "ideas",
  },
  {
    slug: "libros",
    name: "Libros",
    description: "Catalogo de libros publicados y proximos lanzamientos",
    icon: BookOpen,
    path: "/es/libros",
    section: "books",
  },
  {
    slug: "lab",
    name: "Lab",
    description: "Espacio experimental: modelos, diagramas, prototipos y exploraciones",
    icon: FlaskConical,
    path: "/es/lab",
    section: "lab",
  },
  {
    slug: "contacto",
    name: "Contacto",
    description: "Formulario de contacto para conferencias, consultoria y colaboraciones",
    icon: Mail,
    path: "/es/contacto",
    section: "contact",
  },
];

const LOCALES = ["ES", "EN", "PT"] as const;

export default function AdminPagesPage() {
  const [keyCount, setKeyCount] = useState<Record<string, Record<string, number>>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/site-content")
      .then((r) => r.json())
      .then((data: Record<string, Record<string, Record<string, string>>>) => {
        const counts: Record<string, Record<string, number>> = {};
        for (const [slug, locales] of Object.entries(data)) {
          counts[slug] = {};
          for (const [locale, keys] of Object.entries(locales)) {
            counts[slug][locale] = Object.keys(keys).length;
          }
        }
        setKeyCount(counts);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-title text-2xl font-bold text-brand-blue">
          Paginas del sitio
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Gestiona el contenido de todas las paginas. Cada pagina tiene traducciones en ES, EN y PT.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={24} className="animate-spin text-gray-400" />
          <span className="ml-3 text-gray-400">Cargando paginas...</span>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {SITE_PAGES.map((page) => {
            const Icon = page.icon;
            const counts = keyCount[page.slug];

            return (
              <div
                key={page.slug}
                className="group relative rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-brand-orange/30 hover:shadow-md"
              >
                {/* Top row: icon + name */}
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue transition-colors group-hover:bg-brand-orange/10 group-hover:text-brand-orange">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-brand-blue">{page.name}</h3>
                      <p className="text-xs text-gray-400">/{page.slug}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="mb-4 text-sm leading-relaxed text-gray-500">
                  {page.description}
                </p>

                {/* Translation badges */}
                <div className="mb-4 flex items-center gap-2">
                  <Globe size={13} className="text-gray-400" />
                  {LOCALES.map((locale) => {
                    const count = counts?.[locale.toLowerCase()] || 0;
                    return (
                      <span
                        key={locale}
                        className="inline-flex items-center gap-1 rounded-md bg-brand-orange/10 px-2 py-0.5 text-xs font-semibold text-brand-orange"
                      >
                        {locale}
                        {count > 0 && (
                          <span className="text-[10px] font-normal text-brand-orange/60">
                            ({count})
                          </span>
                        )}
                      </span>
                    );
                  })}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 border-t border-gray-100 pt-4">
                  <Link
                    href={`/admin/pages/${page.slug}`}
                    className="flex items-center gap-2 rounded-lg bg-brand-orange px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-orange/90"
                  >
                    <Edit2 size={14} />
                    Editar
                  </Link>
                  <Link
                    href={page.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:border-brand-blue/30 hover:text-brand-blue"
                  >
                    <ExternalLink size={14} />
                    Ver
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Info footer */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-blue/10 text-brand-blue">
            <FileText size={16} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-700">
              Sobre la edicion de paginas
            </h4>
            <p className="mt-1 text-sm leading-relaxed text-gray-500">
              El contenido de cada pagina se almacena en archivos de traduccion (ES, EN, PT).
              Al editar una pagina, puedes modificar cada campo en los tres idiomas.
              Usa el boton &quot;Auto-traducir&quot; para generar traducciones automaticas desde el espanol.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
