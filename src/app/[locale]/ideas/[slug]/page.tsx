import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  return (
    <article className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <Link
        href={`/${locale}/ideas`}
        className="mb-8 inline-flex items-center gap-2 text-sm text-brand-orange hover:underline"
      >
        <ArrowLeft size={14} /> Volver a ideas
      </Link>
      <h1 className="font-title text-4xl font-bold text-brand-blue capitalize">
        {slug.replace(/-/g, " ")}
      </h1>
      <div className="mt-8 prose prose-lg max-w-none text-brand-blue/70">
        <p>Este artículo se cargará dinámicamente desde la base de datos.</p>
      </div>
    </article>
  );
}
