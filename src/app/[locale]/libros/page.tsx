import { useTranslations } from "next-intl";
import { Clock, Music, ShoppingCart } from "lucide-react";
import { AnimatedNodes } from "@/components/brand/animated-nodes";
import Image from "next/image";

const upcomingBooks = [
  {
    slug: "emotional-budgeting",
    title: "Emotional Budgeting",
    desc: "Cómo las organizaciones pueden gestionar sus recursos emocionales con la misma intención estratégica que sus recursos financieros.",
  },
  {
    slug: "human-systems",
    title: "Human Systems",
    desc: "Una exploración de cómo las emociones, las decisiones y las estructuras se entrelazan para crear los sistemas en los que vivimos.",
  },
  {
    slug: "emotions-and-decision-making",
    title: "Emotions & Decision Making",
    desc: "La ciencia detrás de cómo las emociones moldean cada decisión que tomamos — y cómo usar eso a nuestro favor.",
  },
  {
    slug: "leadership-emotional-infrastructure",
    title: "Leadership & Emotional Infrastructure",
    desc: "Construir la infraestructura emocional que necesita un líder para transformar equipos y organizaciones.",
  },
];

export default function BooksPage() {
  const t = useTranslations("books");

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-blue py-24 sm:py-28">
        <div className="absolute inset-0">
          <AnimatedNodes nodeCount={20} interactive={true} className="h-full w-full" />
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

      {/* Featured Book: Redención */}
      <section className="py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-blue to-brand-blue/90 shadow-2xl">
            <div className="grid items-center md:grid-cols-5">
              {/* Book cover */}
              <div className="flex items-center justify-center bg-gradient-to-br from-brand-orange/20 to-brand-orange/10 p-8 sm:p-12 md:col-span-2">
                <div className="relative">
                  <div className="absolute -inset-3 rounded-xl bg-brand-orange/20 blur-xl" />
                  <Image
                    src="/images/books/redencion.jpg"
                    alt="Redención — De Oveja Negra a Oveja Libre"
                    width={240}
                    height={382}
                    className="relative h-auto w-48 rounded-lg shadow-2xl sm:w-56"
                  />
                </div>
              </div>

              {/* Book info */}
              <div className="p-8 sm:p-12 md:col-span-3">
                <span className="inline-block rounded-full bg-brand-green/20 px-3 py-1 text-xs font-bold text-brand-green">
                  {t("published")} · 2025
                </span>
                <h2 className="mt-4 font-title text-3xl font-bold text-white sm:text-4xl">
                  Redención
                </h2>
                <p className="mt-4 leading-relaxed text-white/60">
                  Redención es un libro sobre el poder transformador de las emociones. Explora cómo nuestras emociones pueden redefinir nuestra vida, nuestras relaciones y nuestras decisiones cuando aprendemos a comprenderlas y utilizarlas conscientemente.
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <span className="text-3xl font-bold text-brand-orange">$12 USD</span>
                  <span className="text-sm text-white/40">+ envío</span>
                </div>
                <a
                  href="mailto:eduardo@cactuscomunidadcreativa.com?subject=Pedido%20Redención&body=Hola%20Eduardo,%20me%20gustaría%20pedir%20el%20libro%20Redención."
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand-orange/30 transition hover:bg-brand-orange/90 hover:shadow-xl"
                >
                  <ShoppingCart size={18} />
                  Pedir ahora
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* In Development: Reencontrándonos */}
      <section className="bg-brand-light py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-blue to-brand-blue/90 shadow-2xl">
            <div className="grid items-center md:grid-cols-5">
              {/* Book cover */}
              <div className="flex items-center justify-center bg-gradient-to-br from-brand-green/20 to-brand-green/10 p-8 sm:p-12 md:col-span-2">
                <div className="relative">
                  <div className="absolute -inset-3 rounded-xl bg-brand-green/20 blur-xl" />
                  <Image
                    src="/images/books/reencontrandonos.jpg"
                    alt="Reencontrándonos — Porque el amor... también madura..."
                    width={240}
                    height={240}
                    className="relative h-auto w-48 rounded-lg shadow-2xl sm:w-56"
                  />
                </div>
              </div>

              {/* Book info */}
              <div className="p-8 sm:p-12 md:col-span-3">
                <span className="inline-block rounded-full bg-brand-orange/20 px-3 py-1 text-xs font-bold text-brand-orange">
                  {t("comingSoon")}
                </span>
                <h2 className="mt-4 font-title text-3xl font-bold text-white sm:text-4xl">
                  Reencontrándonos
                </h2>
                <p className="mt-4 leading-relaxed text-white/60">
                  Un libro sobre algo que muchas personas viven en silencio: volver a enamorarse y volver a vivir después de los 40. Es una historia de segundas oportunidades, de sanar heridas del pasado, de redescubrir quién eres y de permitirte abrir el corazón nuevamente.
                </p>
                <p className="mt-3 leading-relaxed text-white/60">
                  Cada capítulo tiene su propia canción. La música acompaña la historia y las emociones de cada etapa del camino: el recuerdo, la sanación, el miedo de volver a sentir, y finalmente el valor de amar otra vez.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href="https://music.apple.com/us/album/reencontr%C3%A1ndonos/1875832467"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
                  >
                    <Music size={16} />
                    Apple Music
                  </a>
                  <a
                    href="https://open.spotify.com/album/0d1A59kNuzEAO8AgQW6czn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
                  >
                    <Music size={16} />
                    Spotify
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Books */}
      <section className="py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <h2 className="font-title text-3xl font-bold text-brand-blue">
              {t("upcomingTitle")}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-brand-blue/60">
              {t("upcomingSubtitle")}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {upcomingBooks.map((book) => (
              <div
                key={book.slug}
                className="group rounded-2xl bg-white p-8 shadow-sm transition hover:shadow-lg"
              >
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-blue/5 text-brand-blue">
                    <Clock size={20} />
                  </div>
                  <span className="rounded-full bg-brand-orange/10 px-3 py-1 text-xs font-medium text-brand-orange">
                    {t("comingSoon")}
                  </span>
                </div>
                <h3 className="font-title text-xl font-bold text-brand-blue">
                  {book.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-brand-blue/60">
                  {book.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
