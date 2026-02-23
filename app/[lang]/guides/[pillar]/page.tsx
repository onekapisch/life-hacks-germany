import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Lang, PillarKey } from "@/lib/i18n";
import { t, pillars, siteConfig } from "@/lib/i18n";
import { getGuidesByPillar } from "@/lib/guides";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { createSocialMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  const pillarKeys = Object.keys(pillars);
  const params = [];
  for (const lang of ["en", "de"]) {
    for (const pillar of pillarKeys) {
      params.push({ lang, pillar });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; pillar: string }>;
}): Promise<Metadata> {
  const { lang, pillar } = await params;
  const l = lang as Lang;
  const p = pillar as PillarKey;
  if (!pillars[p]) return {};
  const entry = pillars[p][l];
  const social = createSocialMetadata({
    title: entry.title,
    description: entry.summary,
    badge: l === "en" ? "Pillar" : "Bereich",
  });
  return {
    title: entry.title,
    description: entry.summary,
    alternates: {
      canonical: `${siteConfig.domain}/${lang}/guides/${pillar}`,
      languages: {
        en: `${siteConfig.domain}/en/guides/${pillar}`,
        de: `${siteConfig.domain}/de/guides/${pillar}`,
      },
    },
    ...social,
  };
}

export default async function PillarPage({
  params,
}: {
  params: Promise<{ lang: string; pillar: string }>;
}) {
  const { lang, pillar } = await params;
  const l = lang as Lang;
  const p = pillar as PillarKey;

  if (!pillars[p]) notFound();

  const entry = pillars[p][l];
  const tr = t[l].guides;
  const base = `/${l}`;
  const guides = getGuidesByPillar(l, p);

  return (
    <>
      <JsonLd
        type="breadcrumb"
        lang={l}
        data={{
          items: [
            { name: l === "en" ? "Home" : "Start", url: `${siteConfig.domain}/${l}` },
            { name: tr.title, url: `${siteConfig.domain}/${l}/guides` },
            { name: entry.title, url: `${siteConfig.domain}/${l}/guides/${pillar}` },
          ],
        }}
      />

      <Breadcrumbs
        lang={l}
        items={[
          { label: tr.title, href: `${base}/guides` },
          { label: entry.title },
        ]}
      />

      <section className="py-16 md:py-24">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="badge mb-5">{tr.pillarGuide}</span>
              <h1 className="text-4xl md:text-5xl font-black leading-[1.05] tracking-tight mb-4">
                {entry.title}
              </h1>
              <p className="text-lg text-ink-2 max-w-lg">{entry.summary}</p>
              <div className="flex gap-3 mt-6">
                <Link href={`${base}/start-here`} className="btn btn-primary">
                  {t[l].home.startHere}
                </Link>
                <Link href={`${base}/tools`} className="btn btn-secondary">
                  {tr.seeTools}
                </Link>
              </div>
            </div>
            <div className="card p-6">
              <h3 className="text-sm font-bold uppercase tracking-[0.1em] mt-0 mb-4">
                {tr.quickWins}
              </h3>
              <div className="flex flex-col gap-3">
                {guides.slice(0, 3).map((guide) => (
                  <div
                    key={guide.frontmatter.slug}
                    className="glass-tile text-sm"
                  >
                    {guide.frontmatter.summary}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-main">
          <div className="content-shell">
            <h2 className="text-xl font-black tracking-tight mt-0 mb-5">
              {tr.guidesInPillar}
            </h2>
            <div className="flex flex-col gap-3">
              {guides.map((guide) => (
                <Link
                  key={guide.frontmatter.slug}
                  href={`${base}/guides/${pillar}/${guide.frontmatter.slug}`}
                  className="glass-card-link p-5 transition-all no-underline text-ink group flex flex-col sm:flex-row sm:items-center gap-3"
                >
                  <div className="flex-1">
                    <span className="font-bold group-hover:text-accent-2 transition-colors">
                      {guide.frontmatter.title}
                    </span>
                    <p className="text-sm text-ink-2 mt-1 mb-0">
                      {guide.frontmatter.summary}
                    </p>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-[0.1em] text-accent-2 whitespace-nowrap">
                    {l === "en" ? "Read" : "Lesen"} &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
