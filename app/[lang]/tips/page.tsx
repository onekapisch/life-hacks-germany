import type { Metadata } from "next";
import type { Lang, PillarKey } from "@/lib/i18n";
import { t, pillars, siteConfig } from "@/lib/i18n";
import { getGuide } from "@/lib/guides";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import TipsExplorer from "@/components/TipsExplorer";
import { createSocialMetadata } from "@/lib/seo";

const tipSlugs = [
  "buergeramt-appointment-blitz",
  "first-14-days",
  "online-anmeldung",
  "post-preview-forwarding-hack",
  "bureaucracy-ai-hack",
  "bureaucracy-deadline-tracker-hack",
  "consumer-contract-cancellation-hack",
  "tax-return-setup",
  "warm-rent-ratio-hack",
  "mietspiegel-alert-hack",
  "rental-contract-checklist",
  "deutschlandticket",
  "public-transport-decision",
  "fuel-price-timing-hack",
  "offline-gps-safety-hack",
  "doctor-appointment-booking-hack",
  "essential-germany-app-stack",
  "sunday-shopping-survival-hack",
  "local-library-networking-hack",
  "kulturpass-maximizer-hack",
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const l = lang as Lang;
  const tr = t[l].tips;
  const social = createSocialMetadata({
    title: tr.title,
    description: tr.subtitle,
    badge: l === "en" ? "Tips" : "Tipps",
  });
  return {
    title: tr.title,
    description: tr.subtitle,
    alternates: {
      canonical: `${siteConfig.domain}/${lang}/tips`,
      languages: {
        en: `${siteConfig.domain}/en/tips`,
        de: `${siteConfig.domain}/de/tips`,
      },
    },
    ...social,
  };
}

export default async function TipsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const l = lang as Lang;
  const tr = t[l].tips;
  const base = `/${l}`;

  const tips = tipSlugs
    .map((slug) => getGuide(l, slug))
    .filter(
      (guide): guide is NonNullable<ReturnType<typeof getGuide>> =>
        guide !== null
    );

  const tipItems = tips.map((tip) => {
    const fm = tip.frontmatter;
    const toolMentions = fm.sources.filter((source) =>
      source.url.includes("tminusai.com") ||
      source.url.includes("tankalert.de") ||
      source.url.includes("skylocation.app")
    );

    return {
      slug: fm.slug,
      href: `${base}/guides/${fm.pillar}/${fm.slug}`,
      title: fm.title,
      summary: fm.summary,
      updated: fm.updated,
      pillar: fm.pillar as PillarKey,
      pillarTitle: pillars[fm.pillar][l].title,
      toolCount: toolMentions.length,
    };
  });

  return (
    <>
      <JsonLd
        type="breadcrumb"
        lang={l}
        data={{
          items: [
            { name: l === "en" ? "Home" : "Start", url: `${siteConfig.domain}/${l}` },
            { name: tr.title, url: `${siteConfig.domain}/${l}/tips` },
          ],
        }}
      />

      <Breadcrumbs
        lang={l}
        items={[{ label: tr.title }]}
      />

      <section className="py-16 md:py-24">
        <div className="container-main max-w-4xl mx-auto text-center">
          <span className="badge mb-5">{tr.badge}</span>
          <h1 className="text-4xl md:text-5xl font-black leading-[1.05] tracking-tight mb-4">
            {tr.title}
          </h1>
          <p className="text-lg text-ink-2 max-w-3xl mx-auto">{tr.subtitle}</p>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-main">
          <TipsExplorer lang={l} tips={tipItems} openTipLabel={tr.openTip} />
        </div>
      </section>
    </>
  );
}
