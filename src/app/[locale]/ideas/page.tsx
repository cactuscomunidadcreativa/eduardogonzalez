import { useTranslations } from "next-intl";

const categories = [
  "allCategories",
  "emotions",
  "decisions",
  "systems",
  "technology",
  "leadership",
];

export default function IdeasPage() {
  const t = useTranslations("ideas");

  return (
    <>
      <section className="bg-brand-light py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="font-title text-4xl font-bold text-brand-blue sm:text-5xl">
            {t("title")}
          </h1>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Category filter */}
          <div className="mb-12 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                className="rounded-full bg-white px-4 py-2 text-sm font-medium text-brand-blue/70 border border-brand-light transition hover:border-brand-orange hover:text-brand-orange"
              >
                {t(cat)}
              </button>
            ))}
          </div>

          {/* Empty state */}
          <div className="py-20 text-center">
            <p className="text-lg text-brand-blue/50">{t("noArticles")}</p>
            <p className="mt-2 text-sm text-brand-gray">
              Los artículos se publican desde el panel de administración.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
