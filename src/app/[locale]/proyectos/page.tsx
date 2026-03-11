import { useTranslations } from "next-intl";
import {
  ArrowRight,
  Brain,
  Cpu,
  Smartphone,
  Wallet,
  Code2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { AnimatedNodes } from "@/components/brand/animated-nodes";

const projects = [
  {
    slug: "six-seconds-latam",
    name: "Six Seconds LATAM",
    role: "Director Regional",
    desc: "Red global más grande de inteligencia emocional. Modelo KCG, medición emocional, desarrollo de liderazgo y transformación de culturas organizacionales en toda Latinoamérica.",
    icon: Brain,
    color: "bg-brand-green",
    gradient: "from-brand-green/5 to-brand-green/15",
    textColor: "text-brand-green",
  },
  {
    slug: "rowi",
    name: "ROWI",
    role: "Creador",
    desc: "App para registrar emociones, identificar patrones emocionales y mejorar decisiones. Si registramos datos financieros, ¿por qué no datos emocionales?",
    icon: Smartphone,
    color: "bg-brand-orange",
    gradient: "from-brand-orange/5 to-brand-orange/15",
    textColor: "text-brand-orange",
  },
  {
    slug: "rowiia",
    name: "ROWIIA",
    role: "Creador",
    desc: "Ecosistema tecnológico que conecta emociones, datos y decisiones con inteligencia artificial. La capa avanzada que traduce patrones emocionales en analítica accionable.",
    icon: Cpu,
    color: "bg-brand-blue",
    gradient: "from-brand-blue/5 to-brand-blue/15",
    textColor: "text-brand-blue",
  },
  {
    slug: "emotional-budgeting",
    name: "Emotional Budgeting",
    role: "Desarrollador",
    desc: "Modelo organizacional: gestionar recursos emocionales — energía, confianza, atención, compromiso — como recursos financieros. Nace del concepto de recesión emocional.",
    icon: Wallet,
    color: "bg-brand-orange",
    gradient: "from-brand-orange/5 to-brand-orange/15",
    textColor: "text-brand-orange",
  },
  {
    slug: "cactus-comunidad-creativa",
    name: "Cactus Comunidad Creativa",
    role: "Impulsor",
    desc: "Laboratorio de sistemas, plataformas digitales, IA, automatización y analítica. El espacio donde experimento y construyo soluciones.",
    icon: Code2,
    color: "bg-brand-green",
    gradient: "from-brand-green/5 to-brand-green/15",
    textColor: "text-brand-green",
  },
  {
    slug: "oveja-libre",
    name: "Oveja Libre",
    role: "Creador",
    desc: "Movimiento de autenticidad, conciencia emocional y liderazgo humano. Una invitación a cuestionar las normas, ser genuino y liderar desde la vulnerabilidad consciente.",
    icon: Sparkles,
    color: "bg-brand-blue",
    gradient: "from-brand-blue/5 to-brand-blue/15",
    textColor: "text-brand-blue",
  },
];

export default function ProjectsPage() {
  const t = useTranslations("projects");

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-blue py-24 sm:py-28">
        <div className="absolute inset-0">
          <AnimatedNodes nodeCount={22} interactive={true} className="h-full w-full" />
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

      {/* Projects Grid */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => {
              const Icon = project.icon;
              return (
                <Link
                  key={project.slug}
                  href={`proyectos/${project.slug}`}
                  className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${project.gradient} p-8 transition hover:-translate-y-1 hover:shadow-xl`}
                >
                  {/* Decorative circle */}
                  <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/[0.03] transition group-hover:scale-150" />

                  <div className="relative">
                    {/* Icon */}
                    <div
                      className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${project.color} text-white shadow-lg`}
                    >
                      <Icon size={24} />
                    </div>

                    {/* Role badge */}
                    <span
                      className={`inline-block rounded-full ${project.textColor} bg-white/50 px-3 py-1 text-xs font-medium`}
                    >
                      {project.role}
                    </span>

                    {/* Name */}
                    <h3 className="mt-3 font-title text-xl font-bold text-brand-blue">
                      {project.name}
                    </h3>

                    {/* Description */}
                    <p className="mt-3 text-sm leading-relaxed text-brand-blue/60">
                      {project.desc}
                    </p>

                    {/* Arrow */}
                    <div
                      className={`mt-6 flex items-center gap-1 text-sm font-medium ${project.textColor} opacity-0 transition group-hover:opacity-100`}
                    >
                      {t("learnMore")} <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
