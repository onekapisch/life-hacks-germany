import type { Metadata } from "next";
import type { Lang } from "@/lib/i18n";
import { t, siteConfig } from "@/lib/i18n";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { createSocialMetadata } from "@/lib/seo";

type AboutSection = {
  title: string;
  body: string;
};

const extras: Record<Lang, AboutSection[]> = {
  en: [
    {
      title: "Who this is for",
      body: "People moving to Germany, students, and residents who want clear, step-by-step guidance without noise.",
    },
    {
      title: "How to use this site",
      body: "Start with Start Here, then move into one pillar at a time. Use tools for planning and the blog for monthly legal and system updates.",
    },
    {
      title: "What makes it different",
      body: "Each guide is tied to official sources, practical actions, and common mistakes so readers can move from confusion to execution.",
    },
    {
      title: "What we are not",
      body: "We do not replace legal, tax, or immigration professionals. We provide structured orientation and verified links.",
    },
  ],
  de: [
    {
      title: "Fuer wen diese Seite ist",
      body: "Fuer Menschen beim Umzug nach Deutschland, Studierende und Residents, die klare Schritt-fuer-Schritt-Hilfe ohne Rauschen brauchen.",
    },
    {
      title: "So nutzt du die Seite",
      body: "Starte mit Start hier und arbeite dann Bereich fuer Bereich. Nutze Tools fuer Planung und den Blog fuer monatliche Rechts- und Systemupdates.",
    },
    {
      title: "Was den Unterschied macht",
      body: "Jeder Guide ist mit offiziellen Quellen, konkreten Schritten und typischen Fehlern verbunden, damit aus Unsicherheit Umsetzung wird.",
    },
    {
      title: "Was wir nicht sind",
      body: "Wir ersetzen keine Rechts-, Steuer- oder Migrationsberatung. Wir liefern strukturierte Orientierung und verifizierte Links.",
    },
  ],
};

const stats: Record<Lang, string[]> = {
  en: ["Bilingual EN/DE", "5 core pillars", "Official-source-driven"],
  de: ["Zweisprachig EN/DE", "5 Kernbereiche", "Auf offiziellen Quellen aufgebaut"],
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const l = lang as Lang;
  const tr = t[l].about;
  const social = createSocialMetadata({
    title: tr.title,
    description: tr.subtitle,
    badge: l === "en" ? "About" : "Ueber uns",
  });

  return {
    title: tr.title,
    description: tr.subtitle,
    alternates: {
      canonical: `${siteConfig.domain}/${lang}/about`,
      languages: {
        en: `${siteConfig.domain}/en/about`,
        de: `${siteConfig.domain}/de/about`,
      },
    },
    ...social,
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const l = lang as Lang;
  const tr = t[l].about;
  const cards = extras[l];
  const badges = stats[l];

  return (
    <>
      <JsonLd type="organization" lang={l} />
      <Breadcrumbs lang={l} items={[{ label: tr.title }]} />

      <section className="py-16 md:py-24">
        <div className="container-main max-w-5xl mx-auto text-center">
          <span className="badge mb-5">{tr.badge}</span>
          <h1 className="text-4xl md:text-5xl font-black leading-[1.05] tracking-tight mb-4">
            {tr.title}
          </h1>
          <p className="text-lg text-ink-2 leading-relaxed max-w-3xl mx-auto">
            {tr.subtitle}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {badges.map((item) => (
              <span
                key={item}
                className="px-3 py-1 rounded-full border border-[rgba(15,23,42,0.1)] bg-paper-2 text-xs font-semibold text-ink-2"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-main max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <article className="content-shell text-center">
              <h2 className="text-xl font-black tracking-tight mt-0 mb-3">{tr.whyTitle}</h2>
              <p className="text-ink-2 leading-relaxed m-0 max-w-2xl mx-auto">{tr.whyDesc}</p>
            </article>
            <article className="content-shell text-center">
              <h2 className="text-xl font-black tracking-tight mt-0 mb-3">{tr.howTitle}</h2>
              <p className="text-ink-2 leading-relaxed m-0 max-w-2xl mx-auto">{tr.howDesc}</p>
            </article>
            <article className="content-shell md:col-span-2 text-center">
              <h2 className="text-xl font-black tracking-tight mt-0 mb-3">{tr.whoTitle}</h2>
              <p className="text-ink-2 leading-relaxed m-0 max-w-3xl mx-auto">{tr.whoDesc}</p>
            </article>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
            {cards.map((card) => (
              <article key={card.title} className="card flex flex-col gap-2 text-center">
                <h3 className="text-lg font-black tracking-tight m-0">{card.title}</h3>
                <p className="text-sm text-ink-2 m-0 leading-relaxed">{card.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
