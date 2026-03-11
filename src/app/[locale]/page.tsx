import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Brain, Lightbulb, MessageCircle } from "lucide-react";

export default function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const t = useTranslations("home");
  const tNav = useTranslations("navigation");

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-blue py-24 sm:py-32">
        {/* Decorative nodes */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute left-[10%] top-[20%] h-3 w-3 rounded-full bg-brand-green" />
          <div className="absolute left-[25%] top-[60%] h-2 w-2 rounded-full bg-brand-orange" />
          <div className="absolute right-[15%] top-[30%] h-4 w-4 rounded-full bg-brand-green" />
          <div className="absolute right-[30%] top-[70%] h-2 w-2 rounded-full bg-brand-orange" />
          <div className="absolute left-[50%] top-[15%] h-3 w-3 rounded-full bg-brand-gray" />
          <div className="absolute left-[70%] top-[80%] h-3 w-3 rounded-full bg-brand-green" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Image
            src="/images/logos/eg_logo_white.png"
            alt="EG"
            width={80}
            height={80}
            className="mx-auto mb-8 h-20 w-20"
          />
          <h1 className="font-title text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            {t("heroTitle")}
          </h1>
          <p className="mt-4 font-title text-lg text-brand-orange sm:text-xl">
            {t("heroTagline")}
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/70">
            {t("heroSubtitle")}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="ideas"
              className="flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3 font-title text-sm font-semibold text-white transition hover:bg-brand-orange/90"
            >
              <Lightbulb size={18} />
              {t("exploreIdeas")}
            </Link>
            <Link
              href="proyectos"
              className="flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 font-title text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <ArrowRight size={18} />
              {t("viewProjects")}
            </Link>
          </div>
        </div>
      </section>

      {/* Principle */}
      <section className="bg-brand-light py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="font-title text-xl leading-relaxed text-brand-blue sm:text-2xl">
            {t("principle")}
          </p>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-end justify-between">
            <h2 className="font-title text-3xl font-bold text-brand-blue">
              {t("featuredProjects")}
            </h2>
            <Link
              href="proyectos"
              className="flex items-center gap-1 text-sm font-medium text-brand-orange hover:underline"
            >
              {t("viewAll")} <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                name: "Six Seconds LATAM",
                desc: "Inteligencia Emocional",
                color: "bg-brand-green",
              },
              {
                name: "Emotional Budgeting",
                desc: "Modelo Organizacional",
                color: "bg-brand-orange",
              },
              {
                name: "ROWI",
                desc: "Tecnolog\u00eda Emocional",
                color: "bg-brand-blue",
              },
              {
                name: "Cactus",
                desc: "Comunidad Creativa",
                color: "bg-brand-green",
              },
            ].map((project) => (
              <div
                key={project.name}
                className="group rounded-xl border border-brand-light p-6 transition hover:shadow-lg"
              >
                <div
                  className={`mb-4 h-2 w-12 rounded-full ${project.color}`}
                />
                <h3 className="font-title text-lg font-semibold text-brand-blue">
                  {project.name}
                </h3>
                <p className="mt-2 text-sm text-brand-gray">{project.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-brand-blue py-16">
        <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
          <h2 className="font-title text-2xl font-bold text-white">
            {t("newsletterTitle")}
          </h2>
          <p className="mt-3 text-white/60">{t("newsletterDescription")}</p>
          <form className="mt-6 flex gap-2">
            <input
              type="email"
              placeholder={t("newsletterPlaceholder")}
              className="flex-1 rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 outline-none focus:border-brand-orange"
            />
            <button
              type="submit"
              className="rounded-lg bg-brand-orange px-6 py-3 font-title text-sm font-semibold text-white transition hover:bg-brand-orange/90"
            >
              {t("newsletterButton")}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
