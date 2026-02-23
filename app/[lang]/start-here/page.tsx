import type { Metadata } from "next";
import type { Lang } from "@/lib/i18n";
import { t, siteConfig } from "@/lib/i18n";
import Breadcrumbs from "@/components/Breadcrumbs";
import StartHereClient from "./StartHereClient";
import { createSocialMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const l = lang as Lang;
  const tr = t[l].startHere;
  const social = createSocialMetadata({
    title: tr.title,
    description: tr.subtitle,
    badge: l === "en" ? "Start Here" : "Start hier",
  });
  return {
    title: tr.title,
    description: tr.subtitle,
    alternates: {
      canonical: `${siteConfig.domain}/${lang}/start-here`,
      languages: {
        en: `${siteConfig.domain}/en/start-here`,
        de: `${siteConfig.domain}/de/start-here`,
      },
    },
    ...social,
  };
}

export default async function StartHerePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const l = lang as Lang;
  const tr = t[l].startHere;

  return (
    <>
      <Breadcrumbs lang={l} items={[{ label: tr.title }]} />

      <section className="py-16 md:py-24">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="badge mb-5">{tr.personalizedRoutes}</span>
              <h1 className="text-4xl md:text-5xl font-black leading-[1.05] tracking-tight mb-4">
                {tr.title}
              </h1>
              <p className="text-lg text-ink-2 max-w-lg">{tr.subtitle}</p>
            </div>
            <div className="card p-6">
              <h3 className="text-sm font-bold uppercase tracking-[0.1em] mt-0 mb-4">
                {tr.whatYouGet}
              </h3>
              <div className="flex flex-col gap-3">
                <div className="glass-tile text-sm">
                  {tr.stepByStep}
                </div>
                <div className="glass-tile text-sm">
                  {tr.verifiedLinks}
                </div>
                <div className="glass-tile text-sm">
                  {tr.costTools}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <StartHereClient lang={l} />
    </>
  );
}
