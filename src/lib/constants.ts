export const SITE_NAME = "Eduardo González";
export const SITE_TAGLINE = "Emotions · Decisions · Systems";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://eduardogonzalez.coach";

export const NAV_ITEMS = [
  { key: "home", href: "/" },
  { key: "about", href: "/quien-soy" },
  { key: "whatIDo", href: "/que-hago" },
  { key: "projects", href: "/proyectos" },
  { key: "ideas", href: "/ideas" },
  { key: "books", href: "/libros" },
  { key: "lab", href: "/lab" },
  { key: "contact", href: "/contacto" },
] as const;

export const CATEGORIES = [
  "EMOTIONS",
  "DECISIONS",
  "SYSTEMS",
  "TECHNOLOGY",
  "LEADERSHIP",
] as const;

export const LOCALES = ["es", "en", "pt"] as const;
export type Locale = (typeof LOCALES)[number];

export const ADMIN_NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
  { label: "Posts", href: "/admin/posts", icon: "FileText" },
  { label: "Proyectos", href: "/admin/projects", icon: "Folder" },
  { label: "Libros", href: "/admin/books", icon: "BookOpen" },
  { label: "Comentarios", href: "/admin/comments", icon: "MessageSquare" },
  { label: "Media", href: "/admin/media", icon: "Image" },
  { label: "Newsletter", href: "/admin/newsletter", icon: "Mail" },
  { label: "IA Training", href: "/admin/ai-training", icon: "Brain" },
  { label: "Contactos", href: "/admin/contacts", icon: "Users" },
  { label: "Ajustes", href: "/admin/settings", icon: "Settings" },
] as const;
