import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Heart,
  Target,
  Network,
  Cpu,
  Users,
  User,
} from "lucide-react";
import { db } from "@/lib/db";

const categoryConfig: Record<
  string,
  { icon: typeof Heart; color: string; bgLight: string; textColor: string }
> = {
  EMOTIONS: {
    icon: Heart,
    color: "bg-brand-green",
    bgLight: "bg-brand-green/10",
    textColor: "text-brand-green",
  },
  DECISIONS: {
    icon: Target,
    color: "bg-brand-orange",
    bgLight: "bg-brand-orange/10",
    textColor: "text-brand-orange",
  },
  SYSTEMS: {
    icon: Network,
    color: "bg-brand-blue",
    bgLight: "bg-brand-blue/10",
    textColor: "text-brand-blue",
  },
  TECHNOLOGY: {
    icon: Cpu,
    color: "bg-brand-blue",
    bgLight: "bg-brand-blue/10",
    textColor: "text-brand-blue",
  },
  LEADERSHIP: {
    icon: Users,
    color: "bg-brand-orange",
    bgLight: "bg-brand-orange/10",
    textColor: "text-brand-orange",
  },
};

function formatDate(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale === "pt" ? "pt-BR" : locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations("ideas");

  const post = await db.post.findUnique({
    where: { slug },
    include: {
      translations: { where: { locale } },
      tags: true,
    },
  });

  if (!post || post.status !== "PUBLISHED" || post.translations.length === 0) {
    notFound();
  }

  const translation = post.translations[0];
  const config = categoryConfig[post.category] ?? {
    icon: Heart,
    color: "bg-brand-blue",
    bgLight: "bg-brand-blue/10",
    textColor: "text-brand-blue",
  };
  const CategoryIcon = config.icon;
  const categoryKey = post.category.toLowerCase();

  return (
    <>
      {/* Featured image hero */}
      {post.featuredImage ? (
        <section className="relative h-[300px] w-full overflow-hidden sm:h-[400px]">
          <Image
            src={post.featuredImage}
            alt={translation.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/80 via-brand-blue/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
            <div className="mx-auto max-w-3xl">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full ${config.color} px-3 py-1 text-xs font-semibold text-white shadow-lg`}
              >
                <CategoryIcon size={12} />
                {t(categoryKey)}
              </span>
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-brand-light py-12 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full ${config.color} px-3 py-1 text-xs font-semibold text-white`}
            >
              <CategoryIcon size={12} />
              {t(categoryKey)}
            </span>
          </div>
        </section>
      )}

      {/* Article */}
      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
        {/* Back link */}
        <Link
          href={`/${locale}/ideas`}
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-brand-orange transition hover:gap-3"
        >
          <ArrowLeft size={14} />
          {t("backToIdeas")}
        </Link>

        {/* Title */}
        <h1 className="font-title text-3xl font-bold leading-tight text-brand-blue sm:text-4xl lg:text-5xl">
          {translation.title}
        </h1>

        {/* Meta */}
        <div className="mt-6 flex flex-wrap items-center gap-4 border-b border-brand-light pb-6 text-sm text-brand-blue/50">
          <span className="flex items-center gap-2">
            <User size={14} className="text-brand-orange" />
            {t("author")}
          </span>
          {post.publishedAt && (
            <span className="flex items-center gap-2">
              <Calendar size={14} className="text-brand-green" />
              {formatDate(post.publishedAt, locale)}
            </span>
          )}
          {post.readingTime && (
            <span className="flex items-center gap-2">
              <Clock size={14} className="text-brand-blue/40" />
              {t("minuteRead", { minutes: post.readingTime })}
            </span>
          )}
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-brand-blue/60"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-lg mt-10 max-w-none
            prose-headings:font-title prose-headings:text-brand-blue
            prose-p:text-brand-blue/70 prose-p:leading-relaxed
            prose-a:text-brand-orange prose-a:no-underline hover:prose-a:underline
            prose-strong:text-brand-blue
            prose-blockquote:border-brand-orange prose-blockquote:text-brand-blue/60
            prose-img:rounded-xl prose-img:shadow-lg
            prose-li:text-brand-blue/70
            prose-code:text-brand-orange prose-code:bg-brand-light prose-code:rounded prose-code:px-1.5 prose-code:py-0.5
            prose-pre:bg-brand-blue prose-pre:text-white/80
            prose-hr:border-brand-light"
          dangerouslySetInnerHTML={{ __html: translation.content }}
        />

        {/* Bottom navigation */}
        <div className="mt-16 border-t border-brand-light pt-8">
          <Link
            href={`/${locale}/ideas`}
            className="inline-flex items-center gap-2 rounded-full bg-brand-light px-6 py-3 text-sm font-medium text-brand-blue transition hover:bg-brand-orange hover:text-white"
          >
            <ArrowLeft size={14} />
            {t("backToIdeas")}
          </Link>
        </div>
      </article>
    </>
  );
}
