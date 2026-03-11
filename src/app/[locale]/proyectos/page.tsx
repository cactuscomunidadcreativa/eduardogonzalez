import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const projects = [
  {
    slug: "six-seconds-latam",
    name: "Six Seconds LATAM",
    desc: "Inteligencia Emocional para Latinoam\u00e9rica",
    color: "bg-brand-green",
  },
  {
    slug: "rowiia",
    name: "ROWIIA",
    desc: "Tecnolog\u00eda de an\u00e1lisis emocional con IA",
    color: "bg-brand-blue",
  },
  {
    slug: "rowi",
    name: "ROWI",
    desc: "Patrones emocionales y decisiones",
    color: "bg-brand-orange",
  },
  {
    slug: "emotional-budgeting",
    name: "Emotional Budgeting",
    desc: "Gesti\u00f3n de recursos emocionales organizacionales",
    color: "bg-brand-orange",
  },
  {
    slug: "cactus-comunidad-creativa",
    name: "Cactus Comunidad Creativa",
    desc: "Comunidad de innovaci\u00f3n y creatividad",
    color: "bg-brand-green",
  },
  {
    slug: "oveja-libre",
    name: "Oveja Libre",
    desc: "Pensamiento independiente y transformaci\u00f3n",
    color: "bg-brand-gray",
  },
];

export default function ProjectsPage() {
  const t = useTranslations("projects");

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
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project.slug}
                href={`proyectos/${project.slug}`}
                className="group rounded-2xl border border-brand-light bg-white p-6 transition hover:shadow-lg"
              >
                <div className={`mb-4 h-2 w-16 rounded-full ${project.color}`} />
                <h3 className="font-title text-xl font-semibold text-brand-blue">
                  {project.name}
                </h3>
                <p className="mt-2 text-sm text-brand-blue/60">{project.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-brand-orange opacity-0 transition group-hover:opacity-100">
                  {t("viewProject")} <ArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
