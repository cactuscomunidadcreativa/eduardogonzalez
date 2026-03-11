import { useTranslations } from "next-intl";
import { FlaskConical } from "lucide-react";

export default function LabPage() {
  const t = useTranslations("lab");

  return (
    <>
      <section className="bg-brand-light py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="font-title text-4xl font-bold text-brand-blue sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg text-brand-orange">{t("subtitle")}</p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <FlaskConical size={48} className="mx-auto mb-6 text-brand-gray" />
          <p className="text-lg text-brand-blue/70">{t("description")}</p>
          <p className="mt-4 text-sm text-brand-gray">
            Experimentos y modelos visuales pr\u00f3ximamente.
          </p>
        </div>
      </section>
    </>
  );
}
