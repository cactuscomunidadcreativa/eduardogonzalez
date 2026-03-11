import { useTranslations } from "next-intl";
import {
  Scale,
  Camera,
  Briefcase,
  Brain,
  Rocket,
  Eye,
  Heart,
  Cpu,
  BookOpen,
  Sprout,
} from "lucide-react";
import { AnimatedNodes } from "@/components/brand/animated-nodes";

const timelineItems = [
  { key: "t1", icon: Rocket, color: "bg-brand-orange" },
  { key: "t2", icon: Cpu, color: "bg-brand-blue" },
  { key: "t3", icon: Brain, color: "bg-brand-green" },
  { key: "t4", icon: BookOpen, color: "bg-brand-orange" },
  { key: "t5", icon: Sprout, color: "bg-brand-blue" },
];

const storyChapters = [
  { key: "storyP1", icon: Scale, bgClass: "bg-brand-orange/10", textClass: "text-brand-orange" },
  { key: "storyP2", icon: Camera, bgClass: "bg-brand-green/10", textClass: "text-brand-green" },
  { key: "storyP3", icon: Briefcase, bgClass: "bg-brand-blue/10", textClass: "text-brand-blue" },
  { key: "storyP4", icon: Brain, bgClass: "bg-brand-orange/10", textClass: "text-brand-orange" },
];

export default function AboutPage() {
  const t = useTranslations("about");

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-blue py-28 sm:py-36">
        {/* Animated node network background */}
        <div className="absolute inset-0">
          <AnimatedNodes
            nodeCount={24}
            interactive={true}
            className="h-full w-full"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-blue/40 via-transparent to-brand-blue/60" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-brand-green animate-pulse" />
            Director Regional LATAM — Six Seconds
          </div>
          <h1 className="font-title text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {t("title")}
          </h1>
          <p className="mx-auto mt-8 max-w-3xl text-lg leading-relaxed text-white/70 sm:text-xl">
            {t("introText")}
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-3">
              <div className="h-px w-12 bg-brand-orange/40" />
              <span className="text-sm font-semibold uppercase tracking-widest text-brand-orange">
                {t("storyTitle")}
              </span>
              <div className="h-px w-12 bg-brand-orange/40" />
            </div>
          </div>

          <div className="space-y-12">
            {storyChapters.map(({ key, icon: Icon, bgClass, textClass }, index) => (
              <div
                key={key}
                className={`flex gap-6 sm:gap-8 ${index % 2 === 0 ? "" : "sm:flex-row-reverse"}`}
              >
                {/* Icon marker */}
                <div className="flex flex-shrink-0 pt-1">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${bgClass} ${textClass}`}
                  >
                    <Icon size={22} />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <p className="text-lg leading-relaxed text-brand-blue/75 sm:text-xl sm:leading-relaxed">
                    {t(key)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-brand-light py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="mb-16 text-center">
            <h2 className="font-title text-3xl font-bold text-brand-blue sm:text-4xl">
              {t("timelineTitle")}
            </h2>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[23px] top-0 hidden h-full w-px bg-gradient-to-b from-brand-orange/30 via-brand-blue/20 to-brand-green/30 sm:block" />

            <div className="space-y-8">
              {timelineItems.map(({ key, icon: Icon, color }) => (
                <div key={key} className="group flex gap-6 sm:gap-8">
                  {/* Icon + connector */}
                  <div className="relative flex flex-shrink-0 flex-col items-center">
                    <div
                      className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl ${color} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Icon size={20} />
                    </div>
                  </div>

                  {/* Content card */}
                  <div className="flex-1 rounded-2xl border border-brand-blue/5 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-brand-blue/10 sm:p-8">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="inline-block rounded-full bg-brand-orange/10 px-4 py-1.5 text-sm font-bold tabular-nums text-brand-orange">
                        {t(`timeline.${key}Year`)}
                      </span>
                      <h3 className="font-title text-lg font-bold text-brand-blue">
                        {t(`timeline.${key}Role`)}
                      </h3>
                    </div>
                    <p className="mt-3 text-base leading-relaxed text-brand-blue/60">
                      {t(`timeline.${key}Desc`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision + Noble Goal */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Vision */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-green/5 via-brand-green/10 to-brand-green/5 p-8 sm:p-10">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand-green/5" />
              <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-brand-green/5" />
              <div className="relative">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-green text-white shadow-lg">
                  <Eye size={26} />
                </div>
                <h2 className="mb-4 font-title text-2xl font-bold text-brand-blue">
                  {t("visionTitle")}
                </h2>
                <p className="text-lg leading-relaxed text-brand-blue/70">
                  {t("visionText")}
                </p>
              </div>
            </div>

            {/* Noble Goal */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-orange/5 via-brand-orange/10 to-brand-orange/5 p-8 sm:p-10">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand-orange/5" />
              <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-brand-orange/5" />
              <div className="relative">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-orange text-white shadow-lg">
                  <Heart size={26} />
                </div>
                <h2 className="mb-4 font-title text-2xl font-bold text-brand-blue">
                  {t("nobleGoalTitle")}
                </h2>
                <p className="text-xl font-medium leading-relaxed text-brand-blue/80 italic">
                  &ldquo;{t("nobleGoalText")}&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
