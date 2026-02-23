import type { Metadata } from "next";
import type { Lang } from "@/lib/i18n";
import { t, siteConfig } from "@/lib/i18n";
import Breadcrumbs from "@/components/Breadcrumbs";
import { createSocialMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const l = lang as Lang;
  const tr = t[l].editorial;
  const social = createSocialMetadata({
    title: tr.title,
    description: tr.subtitle,
    badge: l === "en" ? "Editorial" : "Redaktion",
  });
  return {
    title: tr.title,
    description: tr.subtitle,
    alternates: {
      canonical: `${siteConfig.domain}/${lang}/editorial-standards`,
      languages: {
        en: `${siteConfig.domain}/en/editorial-standards`,
        de: `${siteConfig.domain}/de/editorial-standards`,
      },
    },
    ...social,
  };
}

export default async function EditorialPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const l = lang as Lang;
  const tr = t[l].editorial;

  const principles = [
    { title: tr.principle1Title, desc: tr.principle1Desc },
    { title: tr.principle2Title, desc: tr.principle2Desc },
    { title: tr.principle3Title, desc: tr.principle3Desc },
  ];

  const steps = [tr.step1, tr.step2, tr.step3, tr.step4];

  return (
    <>
      <Breadcrumbs lang={l} items={[{ label: tr.title }]} />

      <section className="py-16 md:py-24">
        <div className="container-main max-w-3xl mx-auto text-center">
          <span className="badge mb-5">{tr.badge}</span>
          <h1 className="text-4xl md:text-5xl font-black leading-[1.05] tracking-tight mb-4">
            {tr.title}
          </h1>
          <p className="text-lg text-ink-2 leading-relaxed max-w-2xl mx-auto">{tr.subtitle}</p>
        </div>
      </section>

      <section className="pb-12">
        <div className="container-main max-w-3xl mx-auto">
          <h2 className="text-2xl font-black tracking-tight mb-6 text-center">
            {tr.principlesTitle}
          </h2>
          <div className="flex flex-col gap-5">
            {principles.map((p, i) => (
              <div key={i} className="content-shell text-center">
                <h3 className="text-lg font-black tracking-tight mt-0 mb-2">
                  {p.title}
                </h3>
                <p className="text-ink-2 leading-relaxed mb-0">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-main max-w-3xl mx-auto">
          <h2 className="text-2xl font-black tracking-tight mb-6 text-center">
            {tr.processTitle}
          </h2>
          <div className="content-shell">
            <div className="flex flex-col gap-4 text-center">
              {steps.map((step, i) => (
                <div key={i} className="step-item">
                  <span className="text-lg font-black text-accent-2">{i + 1}</span>
                  <div className="text-sm leading-relaxed">{step}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
