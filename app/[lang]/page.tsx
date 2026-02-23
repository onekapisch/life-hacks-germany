import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import type { Lang, PillarKey } from "@/lib/i18n";
import { t, pillars, siteConfig } from "@/lib/i18n";
import { getAllGuides } from "@/lib/guides";
import EmailCapture from "@/components/EmailCapture";
import JsonLd from "@/components/JsonLd";
import { createSocialMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const l = lang as Lang;
  const tr = t[l].home;
  const social = createSocialMetadata({
    title: tr.heroTitle,
    description: t[l].description,
    badge: l === "en" ? "Start Here" : "Start hier",
  });
  return {
    title: tr.heroTitle,
    description: t[l].description,
    alternates: {
      canonical: `${siteConfig.domain}/${lang}`,
      languages: { en: `${siteConfig.domain}/en`, de: `${siteConfig.domain}/de` },
    },
    ...social,
  };
}

const pillarImages: Record<PillarKey, string> = {
  bureaucracy: "/images/pillars/bureaucracy-berlin-buergeramt.jpg",
  "money-taxes": "/images/pillars/money-finanzamt-hamburg.jpg",
  housing: "/images/pillars/housing-berlin-prenzlauer-berg.jpg",
  mobility: "/images/pillars/mobility-db-ice-munich.jpg",
  everyday: "/images/pillars/everyday-berlin-supermarket.jpg",
};

const pillarIcons: Record<PillarKey, string> = {
  bureaucracy: "📋",
  "money-taxes": "💶",
  housing: "🏠",
  mobility: "🚄",
  everyday: "❤️",
};

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const l = lang as Lang;
  const tr = t[l].home;
  const base = `/${l}`;
  const guides = getAllGuides(l);
  const guideCount = guides.length;

  return (
    <>
      <JsonLd
        type="faq"
        lang={l}
        data={{
          faqs: [
            {
              q: l === "en" ? "What is the Anmeldung deadline in Germany?" : "Was ist die Anmeldefrist in Deutschland?",
              a: l === "en"
                ? "You must register your address within two weeks of moving in, as required by the Federal Registration Act (BMG)."
                : "Du musst deine Adresse innerhalb von zwei Wochen nach dem Einzug anmelden, gemaess dem Bundesmeldegesetz (BMG).",
            },
            {
              q: l === "en" ? "How much does the Deutschlandticket cost?" : "Wie viel kostet das Deutschlandticket?",
              a: l === "en"
                ? "The Deutschlandticket costs EUR 63 per month (as of January 2026) and covers regional and local transport."
                : "Das Deutschlandticket kostet 63 Euro pro Monat (seit Januar 2026) und gilt im Regional- und Nahverkehr.",
            },
            {
              q: l === "en" ? "What is the Rundfunkbeitrag?" : "Was ist der Rundfunkbeitrag?",
              a: l === "en"
                ? "The Rundfunkbeitrag is a broadcasting contribution of EUR 18.36 per household per month, mandatory for all households in Germany."
                : "Der Rundfunkbeitrag betraegt 18,36 Euro pro Haushalt und Monat und ist fuer alle Haushalte in Deutschland verpflichtend.",
            },
          ],
        }}
      />

      {/* Hero */}
      <section className="hero-stage relative py-20 md:py-28 overflow-hidden">
        <div className="hero-glow hero-glow-right" />
        <div className="hero-glow hero-glow-left" />
        <div className="container-main relative z-[1]">
          <div className="hero-premium-panel">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="badge mb-6">{tr.verificationFirst}</span>
                <h1 className="text-4xl md:text-5xl lg:text-[3.4rem] font-black leading-[1.08] tracking-tight mb-5 text-balance">
                  {tr.heroTitle}
                </h1>
                <p className="text-lg text-ink-2 leading-relaxed mb-8 max-w-xl">
                  {tr.heroCopy}
                </p>
                <div className="flex gap-3 flex-wrap mb-10">
                  <Link href={`${base}/start-here`} className="btn btn-primary">
                    {tr.startHere}
                  </Link>
                  <Link href={`${base}/guides`} className="btn btn-secondary">
                    {tr.browseGuides}
                  </Link>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="glass-card-link p-3.5 text-center">
                    <strong className="block text-xl font-black text-accent-2">{tr.verified}</strong>
                    <span className="text-[0.7rem] text-ink-3">{tr.officialSources}</span>
                  </div>
                  <div className="glass-card-link p-3.5 text-center">
                    <strong className="block text-xl font-black text-accent-2">5</strong>
                    <span className="text-[0.7rem] text-ink-3">{tr.corePillars}</span>
                  </div>
                  <div className="glass-card-link p-3.5 text-center">
                    <strong className="block text-xl font-black text-accent-2">{guideCount}</strong>
                    <span className="text-[0.7rem] text-ink-3">{l === "en" ? "guides" : "Guides"}</span>
                  </div>
                </div>
              </div>

              {/* Hero Image */}
              <div className="hero-image-wrapper aspect-[4/3]">
                <Image
                  src="/images/hero/berlin-brandenburg-gate.jpg"
                  alt="Brandenburg Gate in Berlin, Germany"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="trust-band py-5">
        <div className="container-main">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-accent-4" />
              <span className="text-xs font-semibold text-ink-2">{tr.trustedBy}</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <strong className="block text-sm font-black text-ink">{guideCount}</strong>
                <span className="text-[0.65rem] text-ink-3">{l === "en" ? "Verified Guides" : "Verifizierte Guides"}</span>
              </div>
              <div className="w-px h-6 bg-ink-3/20" />
              <div className="text-center">
                <strong className="block text-sm font-black text-ink">100%</strong>
                <span className="text-[0.65rem] text-ink-3">{l === "en" ? "Official Sources" : "Offizielle Quellen"}</span>
              </div>
              <div className="w-px h-6 bg-ink-3/20" />
              <div className="text-center">
                <strong className="block text-sm font-black text-ink">{l === "en" ? "Ongoing" : "Laufend"}</strong>
                <span className="text-[0.65rem] text-ink-3">{l === "en" ? "Review cadence" : "Pruefungsrhythmus"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Mobility Tool */}
      <section className="py-8 md:py-12">
        <div className="container-main">
          <div className="highlight-band">
            <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8 items-center">
              <div>
                <span className="badge mb-4">{tr.mobilityLaunchBadge}</span>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-0 mb-3">
                  {tr.mobilityLaunchTitle}
                </h2>
                <p className="text-ink-2 text-lg max-w-2xl mb-5">{tr.mobilityLaunchCopy}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="badge-solid">{tr.mobilityLaunchBullet1}</span>
                  <span className="badge-solid">{tr.mobilityLaunchBullet2}</span>
                </div>
                <div className="flex gap-3 flex-wrap">
                  <Link href={`${base}/tools#last-train-weekend-escape`} className="btn btn-primary">
                    {tr.mobilityLaunchCta}
                  </Link>
                  <Link href={`${base}/tools`} className="btn btn-secondary">
                    {tr.mobilityLaunchSecondary}
                  </Link>
                </div>
              </div>
              <div className="content-shell text-left">
                <p className="text-xs uppercase tracking-[0.1em] text-ink-3 font-bold mt-0 mb-2">
                  {l === "en" ? "Best for" : "Ideal fuer"}
                </p>
                <ul className="m-0 pl-5 text-sm text-ink-2 leading-relaxed space-y-2">
                  <li>{l === "en" ? "Students planning late returns after events." : "Studierende mit spaeter Heimfahrt nach Events."}</li>
                  <li>{l === "en" ? "Young professionals optimizing weekend plans." : "Young Professionals mit smarten Wochenendplaenen."}</li>
                  <li>{l === "en" ? "Locals comparing trip quality before booking." : "Locals, die vor der Buchung Optionen vergleichen."}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Maps Section */}
      <section className="py-16 md:py-20">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
                {tr.germanyInMaps}
              </h2>
              <p className="text-ink-2 mb-6 max-w-lg">{tr.mapsSubtitle}</p>
              <Link href={`${base}/start-here`} className="btn btn-secondary">
                {tr.buildYourRoute}
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: tr.arrivalMap, desc: tr.arrivalMapDesc },
                { title: tr.moneyMap, desc: tr.moneyMapDesc },
                { title: tr.housingMap, desc: tr.housingMapDesc },
                { title: tr.mobilityMap, desc: tr.mobilityMapDesc },
              ].map((card) => (
                <div key={card.title} className="glass-card-link rounded-xl p-5 relative">
                  <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-accent rounded-full shadow-[0_0_0_4px_rgba(220,38,38,0.12)]" />
                  <strong className="block text-xs uppercase tracking-[0.1em] mb-2">{card.title}</strong>
                  <span className="text-sm text-ink-2">{card.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="py-16 md:py-20">
        <div className="container-main">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
            {tr.roadmapTitle}
          </h2>
          <p className="text-ink-2 mb-8 max-w-2xl">{tr.roadmapSubtitle}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {(Object.entries(pillars) as [PillarKey, (typeof pillars)[PillarKey]][]).map(
              ([key, data]) => {
                const entry = data[l];
                return (
                  <Link
                    key={key}
                    href={`${base}/guides/${key}`}
                    className="card !p-0 flex flex-col no-underline group"
                  >
                    <div className="pillar-card-image">
                      <Image
                        src={pillarImages[key]}
                        alt={entry.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2">
                        <span className="text-lg">{pillarIcons[key]}</span>
                        <span className="text-[0.65rem] uppercase tracking-[0.14em] text-white/80 font-bold">
                          {tr.pillar}
                        </span>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col gap-2 flex-1">
                      <h3 className="text-base font-bold m-0">{entry.title}</h3>
                      <p className="text-sm text-ink-2 m-0">{entry.summary}</p>
                      <span className="mt-auto pt-2 text-xs font-semibold text-accent-2 group-hover:text-accent transition-colors">
                        {tr.openGuides} &rarr;
                      </span>
                    </div>
                  </Link>
                );
              }
            )}
          </div>
        </div>
      </section>

      {/* Newsroom + Popular */}
      <section className="py-16 md:py-20">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="highlight-band">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-3 mt-0">
                {tr.builtLikeNewsroom}
              </h2>
              <p className="text-ink-2 mb-5">{tr.newsroomDesc}</p>
              <Link href={`${base}/editorial-standards`} className="btn btn-secondary">
                {tr.seeStandards}
              </Link>
            </div>
            <div className="content-shell">
              <h3 className="text-sm font-bold uppercase tracking-[0.08em] mt-0 mb-4 text-ink-3">
                {tr.mostSearched}
              </h3>
              <div className="flex flex-col gap-3">
                <Link
                  href={`${base}/tools#last-train-weekend-escape`}
                  className="glass-card-link p-3.5 text-sm font-semibold no-underline text-ink hover:text-accent-2 transition-colors"
                >
                  {l === "en" ? "Last Train Home + Weekend Escape Finder" : "Last Train Home + Weekend Escape Finder"}
                </Link>
                <Link
                  href={`${base}/tips`}
                  className="glass-card-link p-3.5 text-sm font-semibold no-underline text-ink hover:text-accent-2 transition-colors"
                >
                  {l === "en" ? "Hacks & Tips Hub" : "Hacks & Tipps Hub"}
                </Link>
                <Link
                  href={`${base}/blog`}
                  className="glass-card-link p-3.5 text-sm font-semibold no-underline text-ink hover:text-accent-2 transition-colors"
                >
                  {l === "en" ? "Top Changes in Germany (2026)" : "Top-Aenderungen in Deutschland (2026)"}
                </Link>
                <Link
                  href={`${base}/guides/bureaucracy/anmeldung`}
                  className="glass-card-link p-3.5 text-sm font-semibold no-underline text-ink hover:text-accent-2 transition-colors"
                >
                  {tr.anmeldungStep}
                </Link>
                <Link
                  href={`${base}/guides/mobility/deutschlandticket`}
                  className="glass-card-link p-3.5 text-sm font-semibold no-underline text-ink hover:text-accent-2 transition-colors"
                >
                  Deutschlandticket
                </Link>
                <Link
                  href={`${base}/guides/money-taxes/rundfunkbeitrag`}
                  className="glass-card-link p-3.5 text-sm font-semibold no-underline text-ink hover:text-accent-2 transition-colors"
                >
                  Rundfunkbeitrag
                </Link>
                <Link
                  href={`${base}/guides/housing/mietkaution`}
                  className="glass-card-link p-3.5 text-sm font-semibold no-underline text-ink hover:text-accent-2 transition-colors"
                >
                  {tr.rentDeposit}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 md:py-20">
        <div className="container-main">
          <EmailCapture lang={l} />
        </div>
      </section>
    </>
  );
}
