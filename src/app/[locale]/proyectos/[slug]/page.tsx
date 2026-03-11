import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  return (
    <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
      <Link
        href={`/${locale}/proyectos`}
        className="mb-8 inline-flex items-center gap-2 text-sm text-brand-orange hover:underline"
      >
        <ArrowLeft size={14} /> Volver a proyectos
      </Link>
      <h1 className="font-title text-4xl font-bold text-brand-blue capitalize">
        {slug.replace(/-/g, " ")}
      </h1>
      <div className="mt-8 prose prose-lg max-w-none text-brand-blue/70">
        <p>Contenido del proyecto próximamente. Este proyecto será gestionado desde el panel de administración.</p>
      </div>
    </div>
  );
}
