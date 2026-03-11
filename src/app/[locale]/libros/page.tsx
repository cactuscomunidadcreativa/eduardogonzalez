import { useTranslations } from "next-intl";
import { BookOpen } from "lucide-react";

const books = [
  {
    slug: "redencion",
    title: "Redenci\u00f3n",
    status: "published",
    year: 2019,
  },
  {
    slug: "emotional-budgeting",
    title: "Emotional Budgeting",
    status: "coming",
    year: null,
  },
  {
    slug: "human-systems",
    title: "Human Systems",
    status: "coming",
    year: null,
  },
  {
    slug: "emotions-and-decisions",
    title: "Emotions and Decisions",
    status: "coming",
    year: null,
  },
];

export default function BooksPage() {
  const t = useTranslations("books");

  return (
    <>
      <section className="bg-brand-light py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="font-title text-4xl font-bold text-brand-blue sm:text-5xl">
            {t("title")}
          </h1>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="grid gap-8 sm:grid-cols-2">
            {books.map((book) => (
              <div
                key={book.slug}
                className="rounded-2xl border border-brand-light bg-white p-8 transition hover:shadow-lg"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-brand-blue text-white">
                  <BookOpen size={28} />
                </div>
                <h3 className="font-title text-xl font-bold text-brand-blue">
                  {book.title}
                </h3>
                {book.year && (
                  <span className="mt-2 inline-block text-sm text-brand-gray">
                    {book.year}
                  </span>
                )}
                {book.status === "coming" && (
                  <span className="mt-2 inline-block rounded-full bg-brand-orange/10 px-3 py-1 text-xs font-medium text-brand-orange">
                    {t("comingSoon")}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
