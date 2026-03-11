import { useTranslations } from "next-intl";
import Link from "next/link";
import { Brain, Wallet, Cpu, Network, ArrowRight } from "lucide-react";

const pillars = [
  {
    key: "pillar1",
    icon: Brain,
    color: "bg-brand-green",
    gradient: "from-brand-green/5 to-brand-green/15",
    shadow: "shadow-brand-green/20",
    tagColor: "bg-brand-green/10 text-brand-green",
    number: "01",
  },
  {
    key: "pillar2",
    icon: Wallet,
    color: "bg-brand-orange",
    gradient: "from-brand-orange/5 to-brand-orange/15",
    shadow: "shadow-brand-orange/20",
    tagColor: "bg-brand-orange/10 text-brand-orange",
    number: "02",
  },
  {
    key: "pillar3",
    icon: Cpu,
    color: "bg-brand-blue",
    gradient: "from-brand-blue/5 to-brand-blue/15",
    shadow: "shadow-brand-blue/20",
    tagColor: "bg-brand-blue/10 text-brand-blue",
    number: "03",
  },
  {
    key: "pillar4",
    icon: Network,
    color: "bg-brand-green",
    gradient: "from-brand-green/5 to-brand-green/15",
    shadow: "shadow-brand-green/20",
    tagColor: "bg-brand-green/10 text-brand-green",
    number: "04",
  },
];

export default function WhatIDoPage() {
  const t = useTranslations("whatIDo");

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-blue py-24 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-blue via-brand-blue to-brand-blue/80" />
        <div className="absolute inset-0 opacity-5">
          <div className="absolute left-[20%] top-[30%] h-3 w-3 animate-node-pulse rounded-full bg-brand-orange" />
          <div className="absolute right-[25%] top-[50%] h-4 w-4 animate-node-pulse rounded-full bg-brand-green" />
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

      {/* Pillars */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {pillars.map(
              ({ key, icon: Icon, color, gradient, shadow, tagColor, number }) => (
                <div
                  key={key}
                  className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-8 transition hover:shadow-xl sm:p-10`}
                >
                  {/* Number watermark */}
                  <span className="absolute right-6 top-4 font-title text-7xl font-bold text-brand-blue/[0.03] sm:text-8xl">
                    {number}
                  </span>

                  <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
                    {/* Icon */}
                    <div
                      className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl ${color} text-white shadow-lg ${shadow}`}
                    >
                      <Icon size={28} />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="font-title text-2xl font-bold text-brand-blue">
                        {t(`${key}Title`)}
                      </h3>
                      <p className="mt-3 max-w-2xl leading-relaxed text-brand-blue/70">
                        {t(`${key}Desc`)}
                      </p>
                      {/* Tags */}
                      <div className="mt-5 flex flex-wrap gap-2">
                        {t(`${key}Tags`)
                          .split(", ")
                          .map((tag) => (
                            <span
                              key={tag}
                              className={`rounded-full ${tagColor} px-3 py-1 text-xs font-medium`}
                            >
                              {tag}
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-light py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-title text-2xl font-bold text-brand-blue sm:text-3xl">
            {t("ctaTitle")}
          </h2>
          <Link
            href="contacto"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-orange px-8 py-4 font-title text-sm font-semibold text-white shadow-lg shadow-brand-orange/25 transition hover:bg-brand-orange/90 hover:shadow-xl hover:shadow-brand-orange/30"
          >
            {t("ctaButton")}
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
