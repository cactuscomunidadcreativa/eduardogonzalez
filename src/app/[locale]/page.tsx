import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Lightbulb,
  Heart,
  Target,
  Network,
  Quote,
} from "lucide-react";
import { AnimatedNodes } from "@/components/brand/animated-nodes";

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
      <section className="relative overflow-hidden bg-brand-blue py-28 sm:py-40">
        {/* Animated node network background */}
        <div className="absolute inset-0">
          <AnimatedNodes nodeCount={30} interactive={true} className="h-full w-full" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          {/* Logo grande sobre la animación */}
          <Image
            src="/images/logos/eg_logo_white.png"
            alt="Eduardo González"
            width={180}
            height={180}
            className="mx-auto mb-10 h-32 w-32 drop-shadow-2xl sm:h-44 sm:w-44"
            priority
          />
          <h1 className="font-title text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-7xl">
            {t("heroTitle")}
          </h1>
          <p className="mt-4 font-title text-lg tracking-widest text-brand-orange sm:text-xl">
            {t("heroTagline")}
          </p>
          <p className="mx-auto mt-2 max-w-xl text-sm text-white/50">
            {t("heroRole")}
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
            {t("heroSubtitle")}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="ideas"
              className="flex items-center gap-2 rounded-full bg-brand-orange px-8 py-3.5 font-title text-sm font-semibold text-white shadow-lg shadow-brand-orange/25 transition hover:bg-brand-orange/90 hover:shadow-xl hover:shadow-brand-orange/30"
            >
              <Lightbulb size={18} />
              {t("exploreIdeas")}
            </Link>
            <Link
              href="proyectos"
              className="flex items-center gap-2 rounded-full border border-white/30 px-8 py-3.5 font-title text-sm font-semibold text-white transition hover:border-white/50 hover:bg-white/10"
            >
              <ArrowRight size={18} />
              {t("viewProjects")}
            </Link>
          </div>
        </div>
      </section>

      {/* Concept */}
      <section className="bg-brand-light py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <span className="mb-4 inline-block font-title text-xs font-semibold uppercase tracking-widest text-brand-orange">
            {t("conceptTitle")}
          </span>
          <p className="font-title text-xl leading-relaxed text-brand-blue sm:text-2xl">
            {t("conceptText")}
          </p>
        </div>
      </section>

      {/* Three Pillars */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-16 text-center font-title text-3xl font-bold text-brand-blue sm:text-4xl">
            {t("pillarsTitle")}
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {/* Emotions */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-green/5 to-brand-green/10 p-8 transition hover:shadow-xl">
              <div className="absolute right-4 top-4 h-20 w-20 rounded-full bg-brand-green/5 transition group-hover:scale-150" />
              <div className="relative">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-green text-white shadow-lg shadow-brand-green/25">
                  <Heart size={28} />
                </div>
                <h3 className="mb-3 font-title text-xl font-bold text-brand-blue">
                  {t("pillarEmotionsTitle")}
                </h3>
                <p className="leading-relaxed text-brand-blue/60">
                  {t("pillarEmotionsDesc")}
                </p>
              </div>
            </div>

            {/* Decisions */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-orange/5 to-brand-orange/10 p-8 transition hover:shadow-xl">
              <div className="absolute right-4 top-4 h-20 w-20 rounded-full bg-brand-orange/5 transition group-hover:scale-150" />
              <div className="relative">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-orange text-white shadow-lg shadow-brand-orange/25">
                  <Target size={28} />
                </div>
                <h3 className="mb-3 font-title text-xl font-bold text-brand-blue">
                  {t("pillarDecisionsTitle")}
                </h3>
                <p className="leading-relaxed text-brand-blue/60">
                  {t("pillarDecisionsDesc")}
                </p>
              </div>
            </div>

            {/* Human Systems */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-blue/5 to-brand-blue/10 p-8 transition hover:shadow-xl">
              <div className="absolute right-4 top-4 h-20 w-20 rounded-full bg-brand-blue/5 transition group-hover:scale-150" />
              <div className="relative">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-blue text-white shadow-lg shadow-brand-blue/25">
                  <Network size={28} />
                </div>
                <h3 className="mb-3 font-title text-xl font-bold text-brand-blue">
                  {t("pillarSystemsTitle")}
                </h3>
                <p className="leading-relaxed text-brand-blue/60">
                  {t("pillarSystemsDesc")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="bg-brand-light py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-end justify-between">
            <h2 className="font-title text-3xl font-bold text-brand-blue">
              {t("featuredProjects")}
            </h2>
            <Link
              href="proyectos"
              className="flex items-center gap-1 text-sm font-medium text-brand-orange transition hover:gap-2"
            >
              {t("viewAll")} <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                name: "Six Seconds LATAM",
                desc: "Red global de inteligencia emocional. Dirección estratégica para Latinoamérica.",
                color: "bg-brand-green",
                textColor: "text-brand-green",
              },
              {
                name: "Emotional Budgeting",
                desc: "Modelo para gestionar recursos emocionales: energía, confianza, compromiso.",
                color: "bg-brand-orange",
                textColor: "text-brand-orange",
              },
              {
                name: "ROWI / ROWIIA",
                desc: "Ecosistema tecnológico para registrar emociones y mejorar decisiones con IA.",
                color: "bg-brand-blue",
                textColor: "text-brand-blue",
              },
              {
                name: "Cactus",
                desc: "Laboratorio de sistemas, plataformas digitales, IA y automatización.",
                color: "bg-brand-green",
                textColor: "text-brand-green",
              },
            ].map((project) => (
              <Link
                key={project.name}
                href="proyectos"
                className="group rounded-2xl border border-brand-light bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div
                  className={`mb-4 h-1.5 w-12 rounded-full ${project.color}`}
                />
                <h3 className="font-title text-lg font-semibold text-brand-blue">
                  {project.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-blue/60">
                  {project.desc}
                </p>
                <div
                  className={`mt-4 flex items-center gap-1 text-sm font-medium ${project.textColor} opacity-0 transition group-hover:opacity-100`}
                >
                  <ArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Quote className="mx-auto mb-6 text-brand-orange/30" size={48} />
          <blockquote className="font-title text-2xl font-medium leading-relaxed text-brand-blue sm:text-3xl">
            {t("quoteText")}
          </blockquote>
          <p className="mt-6 text-sm font-medium tracking-wide text-brand-orange">
            — {t("quoteAuthor")}
          </p>
        </div>
      </section>

      {/* Newsletter */}
      <section className="relative overflow-hidden bg-brand-blue py-20">
        <div className="absolute inset-0 opacity-40">
          <AnimatedNodes nodeCount={10} interactive={false} className="h-full w-full" />
        </div>
        <div className="relative mx-auto max-w-xl px-4 text-center sm:px-6">
          <h2 className="font-title text-2xl font-bold text-white">
            {t("newsletterTitle")}
          </h2>
          <p className="mt-3 text-white/60">{t("newsletterDescription")}</p>
          <form className="mt-8 flex gap-2">
            <input
              type="email"
              placeholder={t("newsletterPlaceholder")}
              className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-3.5 text-sm text-white placeholder-white/40 outline-none transition focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/50"
            />
            <button
              type="submit"
              className="rounded-xl bg-brand-orange px-6 py-3.5 font-title text-sm font-semibold text-white shadow-lg shadow-brand-orange/25 transition hover:bg-brand-orange/90"
            >
              {t("newsletterButton")}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
