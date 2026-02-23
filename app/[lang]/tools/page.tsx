import type { Metadata } from "next";
import type { Lang } from "@/lib/i18n";
import { t, siteConfig } from "@/lib/i18n";
import Breadcrumbs from "@/components/Breadcrumbs";
import ToolsClient from "./ToolsClient";
import { createSocialMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const l = lang as Lang;
  const tr = t[l].tools;
  const social = createSocialMetadata({
    title: tr.title,
    description: tr.subtitle,
    badge: l === "en" ? "Tools" : "Tools",
  });
  return {
    title: tr.title,
    description: tr.subtitle,
    alternates: {
      canonical: `${siteConfig.domain}/${lang}/tools`,
      languages: {
        en: `${siteConfig.domain}/en/tools`,
        de: `${siteConfig.domain}/de/tools`,
      },
    },
    ...social,
  };
}

export default async function ToolsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const l = lang as Lang;
  const tr = t[l].tools;

  return (
    <>
      <Breadcrumbs lang={l} items={[{ label: tr.title }]} />

      <section className="py-16 md:py-24">
        <div className="container-main max-w-4xl mx-auto text-center">
          <span className="badge mb-5">{tr.practicalTools}</span>
          <h1 className="text-4xl md:text-5xl font-black leading-[1.05] tracking-tight mb-4">
            {tr.title}
          </h1>
          <p className="text-lg text-ink-2 max-w-2xl mx-auto">{tr.subtitle}</p>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-main">
          <ToolsClient lang={l} />
        </div>
      </section>
    </>
  );
}
