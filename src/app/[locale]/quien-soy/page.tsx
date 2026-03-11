import { useTranslations } from "next-intl";
import { Briefcase, Eye, Compass, Clock } from "lucide-react";

const timeline = [
  { year: "2024", role: "roles.sixSeconds", icon: Briefcase },
  { year: "2023", role: "roles.rowi", icon: Compass },
  { year: "2022", role: "roles.budgeting", icon: Eye },
  { year: "2020", role: "roles.cactus", icon: Briefcase },
  { year: "2019", role: "roles.author", icon: Clock },
];

export default function AboutPage() {
  const t = useTranslations("about");

  return (
    <>
      {/* Hero */}
      <section className="bg-brand-light py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="font-title text-4xl font-bold text-brand-blue sm:text-5xl">
            {t("title")}
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="mb-8 font-title text-2xl font-bold text-brand-blue">
            {t("storyTitle")}
          </h2>
          <div className="space-y-4 text-lg leading-relaxed text-brand-blue/70">
            <p>{t("roles.sixSeconds")}</p>
            <p>{t("roles.rowi")}</p>
            <p>{t("roles.budgeting")}</p>
            <p>{t("roles.cactus")}</p>
            <p>{t("roles.author")}</p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-brand-light py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="mb-12 text-center font-title text-2xl font-bold text-brand-blue">
            {t("timelineTitle")}
          </h2>
          <div className="space-y-8">
            {timeline.map(({ year, role, icon: Icon }) => (
              <div key={year} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange text-white">
                    <Icon size={18} />
                  </div>
                  <div className="mt-2 h-full w-px bg-brand-orange/20" />
                </div>
                <div className="pb-8">
                  <span className="text-sm font-bold text-brand-orange">
                    {year}
                  </span>
                  <p className="mt-1 text-lg text-brand-blue">{t(role)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="mb-6 font-title text-2xl font-bold text-brand-blue">
            {t("visionTitle")}
          </h2>
          <p className="text-lg text-brand-blue/70">
            {t("exploringTitle")}
          </p>
        </div>
      </section>
    </>
  );
}
