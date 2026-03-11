import { useTranslations } from "next-intl";
import { Brain, Wallet, Cpu, Network } from "lucide-react";

const pillars = [
  { key: "pillar1", icon: Brain, color: "bg-brand-green", border: "border-brand-green" },
  { key: "pillar2", icon: Wallet, color: "bg-brand-orange", border: "border-brand-orange" },
  { key: "pillar3", icon: Cpu, color: "bg-brand-blue", border: "border-brand-blue" },
  { key: "pillar4", icon: Network, color: "bg-brand-gray", border: "border-brand-gray" },
];

export default function WhatIDoPage() {
  const t = useTranslations("whatIDo");

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
          <div className="grid gap-8 md:grid-cols-2">
            {pillars.map(({ key, icon: Icon, color, border }) => (
              <div
                key={key}
                className={`rounded-2xl border-l-4 ${border} bg-white p-8 shadow-sm transition hover:shadow-lg`}
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${color} text-white`}
                >
                  <Icon size={24} />
                </div>
                <h3 className="font-title text-xl font-bold text-brand-blue">
                  {t(`${key}Title`)}
                </h3>
                <p className="mt-3 text-brand-blue/70">
                  {t(`${key}Desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
