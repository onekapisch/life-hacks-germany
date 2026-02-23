import Link from "next/link";
import type { Metadata } from "next";
import type { Lang, PillarKey } from "@/lib/i18n";
import { t, pillars, siteConfig } from "@/lib/i18n";
import { getGuidesByPillar } from "@/lib/guides";
import Breadcrumbs from "@/components/Breadcrumbs";
import { createSocialMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const l = lang as Lang;
  const tr = t[l].guides;
  const social = createSocialMetadata({
    title: tr.title,
    description: tr.subtitle,
    badge: l === "en" ? "Guides" : "Guides",
  });
  return {
    title: tr.title,
    description: tr.subtitle,
    alternates: {
      canonical: `${siteConfig.domain}/${lang}/guides`,
      languages: {
        en: `${siteConfig.domain}/en/guides`,
        de: `${siteConfig.domain}/de/guides`,
      },
    },
    ...social,
  };
}

const pillarEmoji: Record<PillarKey, string> = {
  bureaucracy: "📋",
  "money-taxes": "💶",
  housing: "🏠",
  mobility: "🚄",
  everyday: "❤️",
};

export default async function GuidesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const l = lang as Lang;
  const tr = t[l].guides;
  const base = `/${l}`;

  return (
    <>
      <Breadcrumbs
        lang={l}
        items={[{ label: tr.title }]}
      />

      <section className="py-16 md:py-24">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="badge mb-5">{tr.structuredLearning}</span>
              <h1 className="text-4xl md:text-5xl font-black leading-[1.05] tracking-tight mb-4">
                {tr.title}
              </h1>
              <p className="text-lg text-ink-2 max-w-lg">{tr.subtitle}</p>
            </div>
            <div className="card p-6">
              <h3 className="text-sm font-bold uppercase tracking-[0.1em] mt-0 mb-4">
                {tr.howWeOrganize}
              </h3>
              <div className="flex flex-col gap-3">
                <div className="glass-tile text-sm">
                  {tr.pillarsDesc}
                </div>
                <div className="glass-tile text-sm">
                  {tr.guidesDesc}
                </div>
                <div className="glass-tile text-sm">
                  {tr.toolsDesc}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-main">
          <div className="flex flex-col gap-12">
            {(Object.entries(pillars) as [PillarKey, (typeof pillars)[PillarKey]][]).map(
              ([key, data]) => {
                const entry = data[l];
                const pillarGuides = getGuidesByPillar(l, key);
                return (
                  <div key={key} className="content-shell">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">{pillarEmoji[key]}</span>
                      <h2 className="text-xl font-black tracking-tight m-0">
                        {entry.title}
                      </h2>
                    </div>
                    <p className="text-ink-2 text-sm mb-5">{entry.summary}</p>
                    {pillarGuides.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {pillarGuides.map((guide) => (
                          <Link
                            key={guide.frontmatter.slug}
                            href={`${base}/guides/${key}/${guide.frontmatter.slug}`}
                            className="glass-card-link p-4 transition-colors no-underline text-ink group"
                          >
                            <span className="font-bold text-sm group-hover:text-accent-2 transition-colors">
                              {guide.frontmatter.title}
                            </span>
                            <p className="text-xs text-ink-2 mt-1 mb-0 line-clamp-2">
                              {guide.frontmatter.summary}
                            </p>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <Link
                        href={`${base}/guides/${key}`}
                        className="btn btn-secondary text-sm"
                      >
                        {tr.guidesInPillar} &rarr;
                      </Link>
                    )}
                  </div>
                );
              }
            )}
          </div>
        </div>
      </section>
    </>
  );
}
