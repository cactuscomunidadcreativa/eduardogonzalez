import { getTranslations } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Heart,
  Target,
  Network,
  Cpu,
  Users,
  Clock,
  Lightbulb,
} from "lucide-react";
import { AnimatedNodes } from "@/components/brand/animated-nodes";
import { db } from "@/lib/db";

const categoryConfig: Record<
  string,
  { icon: typeof Heart; color: string; gradient: string; textColor: string }
> = {
  EMOTIONS: {
    icon: Heart,
    color: "bg-brand-green",
    gradient: "from-brand-green/10 to-brand-green/5",
    textColor: "text-brand-green",
  },
  DECISIONS: {
    icon: Target,
    color: "bg-brand-orange",
    gradient: "from-brand-orange/10 to-brand-orange/5",
    textColor: "text-brand-orange",
  },
  SYSTEMS: {
    icon: Network,
    color: "bg-brand-blue",
    gradient: "from-brand-blue/10 to-brand-blue/5",
    textColor: "text-brand-blue",
  },
  TECHNOLOGY: {
    icon: Cpu,
    color: "bg-brand-blue",
    gradient: "from-brand-blue/10 to-brand-blue/5",
    textColor: "text-brand-blue",
  },
  LEADERSHIP: {
    icon: Users,
    color: "bg-brand-orange",
    gradient: "from-brand-orange/10 to-brand-orange/5",
    textColor: "text-brand-orange",
  },
};

const categories = [
  "allCategories",
  "emotions",
  "decisions",
  "systems",
  "technology",
  "leadership",
];

export default async function IdeasPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("ideas");

  const posts = await db.post.findMany({
    where: { status: "PUBLISHED" },
    include: {
      translations: { where: { locale } },
      tags: true,
    },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-blue py-24 sm:py-28">
        <div className="absolute inset-0">
          <AnimatedNodes
            nodeCount={25}
            interactive={true}
            className="h-full w-full"
          />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="font-title text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {t("title")}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/60">
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Category filter */}
          <div className="mb-12 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <span
                key={cat}
                className="rounded-full bg-white px-4 py-2 text-sm font-medium text-brand-blue/70 border border-brand-light transition hover:border-brand-orange hover:text-brand-orange cursor-default"
              >
                {t(cat)}
              </span>
            ))}
          </div>

          {posts.length === 0 ? (
            /* Empty state */
            <div className="py-20 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-light">
                <Lightbulb className="text-brand-orange/40" size={36} />
              </div>
              <p className="text-lg text-brand-blue/50">{t("noArticles")}</p>
            </div>
          ) : (
            /* Posts grid */
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => {
                const translation = post.translations[0];
                if (!translation) return null;

                const config = categoryConfig[post.category] ?? {
                  icon: Lightbulb,
                  color: "bg-brand-blue",
                  gradient: "from-brand-blue/10 to-brand-blue/5",
                  textColor: "text-brand-blue",
                };
                const CategoryIcon = config.icon;
                const categoryKey = post.category.toLowerCase();

                return (
                  <Link
                    key={post.id}
                    href={`/${locale}/ideas/${post.slug}`}
                    className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    {/* Image or placeholder */}
                    {post.featuredImage ? (
                      <div className="relative h-48 w-full overflow-hidden">
                        <Image
                          src={post.featuredImage}
                          alt={translation.title}
                          fill
                          className="object-cover transition duration-300 group-hover:scale-105"
                        />
                        {/* Category badge on image */}
                        <div className="absolute left-4 top-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full ${config.color} px-3 py-1 text-xs font-semibold text-white shadow-lg`}
                          >
                            <CategoryIcon size={12} />
                            {t(categoryKey)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`relative flex h-48 w-full items-center justify-center bg-gradient-to-br ${config.gradient}`}
                      >
                        <CategoryIcon
                          className={`${config.textColor} opacity-20`}
                          size={64}
                        />
                        {/* Category badge */}
                        <div className="absolute left-4 top-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full ${config.color} px-3 py-1 text-xs font-semibold text-white shadow-lg`}
                          >
                            <CategoryIcon size={12} />
                            {t(categoryKey)}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-6">
                      <h2 className="font-title text-lg font-bold leading-snug text-brand-blue group-hover:text-brand-orange transition-colors">
                        {translation.title}
                      </h2>
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-brand-blue/60 line-clamp-3">
                        {translation.excerpt}
                      </p>

                      {/* Footer */}
                      <div className="mt-4 flex items-center justify-between border-t border-brand-light pt-4">
                        {post.readingTime && (
                          <span className="flex items-center gap-1.5 text-xs text-brand-blue/40">
                            <Clock size={12} />
                            {t("minuteRead", { minutes: post.readingTime })}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-sm font-medium text-brand-orange opacity-0 transition group-hover:opacity-100">
                          {t("readMore")} <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
