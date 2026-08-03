import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import type { Lang, PillarKey } from "@/lib/i18n";
import { t, pillars, siteConfig } from "@/lib/i18n";
import { getAllGuides } from "@/lib/guides";
import { getFeaturedOffers } from "@/lib/offers";
import JsonLd from "@/components/JsonLd";
import TrackedExternalLink from "@/components/TrackedExternalLink";
import { createSocialMetadata } from "@/lib/seo";
import { AnimatedShaderBackground } from "@/components/ui/animated-shader-hero";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const l = lang as Lang;
  const metaTitle = l === "en"
    ? "Life Hacks Germany 2026: Anmeldung, Taxes, Housing & More"
    : "Life Hacks Germany 2026: Anmeldung, Steuern, Wohnen & mehr";
  const metaDescription = l === "en"
    ? "August 2026 verified Germany updates plus practical guides for Anmeldung, ELSTER taxes, rent rules, transport, Kindergeld, and decision tools."
    : "August-2026-verifizierte Deutschland-Updates plus praktische Guides zu Anmeldung, ELSTER, Mietregeln, Mobilität, Kindergeld und Entscheidungstools.";
  const social = createSocialMetadata({
    title: metaTitle,
    description: metaDescription,
    badge: l === "en" ? "Start Here" : "Start hier",
  });
  return {
    title: metaTitle,
    description: metaDescription,
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

type SmartLifeTool = {
  name: string;
  href: string;
  utmContent: string;
  kicker: string;
  features: string[];
  outcome: string;
};

type SmartLifeSectionCopy = {
  badge: string;
  title: string;
  intro: string;
  fuelWatch: {
    badge: string;
    title: string;
    body: string;
    stats: string[];
    lastChecked: string;
    sourcePrimary: { label: string; href: string };
    sourceSecondary: { label: string; href: string };
    cta: string;
  };
  tools: SmartLifeTool[];
  benefitsTitle: string;
  benefits: { title: string; body: string }[];
  blogCta: string;
  toolsCta: string;
  disclosure: string;
};

type WeeklyQuickRoute = {
  href: string;
  title: string;
  note: string;
};

function getSmartLifeSectionCopy(lang: Lang): SmartLifeSectionCopy {
  if (lang === "de") {
    return {
      badge: "Featured Smart-Life Tools",
      title: "Smart-Life Stack: schneller handeln, sauberer entscheiden, Kosten senken",
      intro:
        "Drei fokussierte Tools, die den Deutschland-Alltag praktischer machen: KI-Workflows, Spritkosten-Optimierung und präzise Standorthilfe.",
      fuelWatch: {
        badge: "Spritpreis-Watch",
        title: "Deutschland: Spritpreise zum Sommerreiseverkehr wieder über zwei Euro",
        body:
          "Die ADAC-Auswertung vom 16. Juli nennt im Bundesmittel 2,083 Euro je Liter Super E10 und 2,070 Euro je Liter Diesel. Preise vor Ort live vergleichen; seit April ist kurz vor 12 Uhr meist der günstigste Zeitpunkt.",
        stats: ["Super E10: 2,083 Euro/Liter", "Diesel: 2,070 Euro/Liter"],
        lastChecked: "16. Juli 2026",
        sourcePrimary: {
          label: "ADAC Spritpreis-Update (16.07.2026)",
          href: "https://www.adac.de/news/aktueller-spritpreis/",
        },
        sourceSecondary: {
          label: "ADAC: neue Spritpreis-Regeln seit April 2026",
          href: "https://www.adac.de/verkehr/tanken-kraftstoff-antrieb/tipps-zum-tanken/spritpreise-tagesverlauf/",
        },
        cta: "Tank Alert Preisalarm setzen",
      },
      tools: [
        {
          name: "T-Minus AI",
          href: "https://www.tminusai.com",
          utmContent: "tminusai-card",
          kicker: "KI-Workflows für Behörden, Jobsuche und Alltagsplanung",
          features: [
            "Prompt-Frameworks für Mails, Checklisten und Formulare",
            "Modellauswahl nach Aufgabentyp statt Zufall",
            "Wiederverwendbare Arbeitsroutinen für wiederkehrende Prozesse",
          ],
          outcome: "Spart vor allem bei wiederkehrender Adminarbeit mehrere Stunden pro Woche.",
        },
        {
          name: "Tank Alert",
          href: "https://www.tankalert.de",
          utmContent: "tankalert-card",
          kicker: "Live-Spritpreise, Alerts und Kostenrechner für Autofahrer",
          features: [
            "Stationen vergleichen und Preisalarme setzen",
            "Detour-Rechner für echte Nettoersparnis",
            "Bessere Tank-Entscheidungen für Pendelroutinen",
          ],
          outcome: "Hilft, vermeidbare Mobilitätskosten im Alltag sichtbar zu senken.",
        },
        {
          name: "SkyLocation",
          href: "https://www.skylocation.app",
          utmContent: "skylocation-card",
          kicker: "Offline GPS für iPhone: Koordinaten überall, auch im Flugzeug",
          features: [
            "Präzise GPS-Koordinaten ohne Internet, SIM oder Roaming",
            "In-Flight Tracking mit Position, Höhe und Ground Speed",
            "SOS-orientierte Koordinatenfreigabe für Notfälle",
          ],
          outcome:
            "Hilft bei Reisen, Outdoor und Notfällen mit offline verfügbaren Positionsdaten; Pro als Einmalkauf ohne Abo.",
        },
      ],
      benefitsTitle: "Wie dir das konkret hilft",
      benefits: [
        {
          title: "Mehr Zeit",
          body: "Weniger Leerlauf bei Formularen, E-Mails und Terminvorbereitung.",
        },
        {
          title: "Weniger Kosten",
          body: "Bessere Entscheidungen bei Mobilität, Abos und Alltagsausgaben.",
        },
        {
          title: "Weniger Fehler",
          body: "Klarere Prozesse, bessere Vorbereitung, weniger frustrierende Rückfragen.",
        },
      ],
      blogCta: "AI-Anwendungsfälle für Expats lesen",
      toolsCta: "Alle Smart-Life Tools ansehen",
      disclosure:
        "Hinweis: Diese Featured Tools werden vom gleichen Publisher betrieben und sind hier als praktische Helfer integriert.",
    };
  }

  return {
    badge: "Featured Smart-Life Tools",
    title: "Smart-Life Stack: move faster, decide better, spend less",
    intro:
      "Three focused tools for day-to-day life in Germany: AI workflows, fuel-cost optimization, and precise location support.",
    fuelWatch: {
      badge: "Fuel Price Watch",
      title: "Germany: summer-travel fuel prices are back above two euros",
      body:
        "ADAC's July 16 update lists national averages of EUR 2.083/liter for Super E10 and EUR 2.070/liter for diesel. Compare local prices live; under the rules in force since April, shortly before noon is usually cheapest.",
      stats: ["Super E10: EUR 2.083/liter", "Diesel: EUR 2.070/liter"],
      lastChecked: "July 16, 2026",
      sourcePrimary: {
        label: "ADAC fuel-price update (July 16, 2026)",
        href: "https://www.adac.de/news/aktueller-spritpreis/",
      },
      sourceSecondary: {
        label: "ADAC: fuel-price timing rules since April 2026",
        href: "https://www.adac.de/verkehr/tanken-kraftstoff-antrieb/tipps-zum-tanken/spritpreise-tagesverlauf/",
      },
      cta: "Set Tank Alert price alarms",
    },
    tools: [
      {
        name: "T-Minus AI",
        href: "https://www.tminusai.com",
        utmContent: "tminusai-card",
        kicker: "AI workflows for bureaucracy, job search, and daily planning",
        features: [
          "Prompt frameworks for emails, checklists, and forms",
          "Model guidance by task type instead of guesswork",
          "Reusable workflows for recurring Germany admin tasks",
        ],
        outcome: "Saves significant time each week on repetitive admin and planning work.",
      },
      {
        name: "Tank Alert",
        href: "https://www.tankalert.de",
        utmContent: "tankalert-card",
        kicker: "Live fuel prices, alerts, and cost calculators for drivers",
        features: [
          "Compare stations and set price alerts",
          "Detour calculator to protect real net savings",
          "Better refuel decisions for commute routines",
        ],
        outcome: "Helps reduce avoidable transport spend in everyday driving.",
      },
      {
        name: "SkyLocation",
        href: "https://www.skylocation.app",
        utmContent: "skylocation-card",
        kicker: "Offline GPS for iPhone: coordinates anywhere, even in-flight",
        features: [
          "Precise GPS coordinates without internet, SIM, or roaming",
          "In-flight tracking with position, altitude, and ground speed",
          "SOS-ready coordinate sharing for emergency situations",
        ],
        outcome:
          "Useful for travel, outdoor routes, and safety scenarios where offline coordinates matter; Pro is one-time, no subscription.",
      },
    ],
    benefitsTitle: "What this helps you do",
    benefits: [
      {
        title: "Save Time",
        body: "Less friction in forms, emails, and appointment preparation.",
      },
      {
        title: "Save Money",
        body: "Stronger day-to-day decisions on mobility and recurring costs.",
      },
      {
        title: "Reduce Errors",
        body: "Clearer workflows and better prep before you submit anything important.",
      },
    ],
    blogCta: "Read AI use cases for expats",
    toolsCta: "Explore all smart-life tools",
    disclosure:
      "Disclosure: these featured tools are operated by the same publisher and are integrated here as practical helpers.",
  };
}

function getWeeklyQuickRoutes(lang: Lang): WeeklyQuickRoute[] {
  if (lang === "de") {
    return [
      {
        href: "/de/blog/top-changes-germany-august-2026",
        title: "August 2026: neue Deutschland-Änderungen",
        note: "Ganztagsbetreuung, KI-Transparenz, Verpackungsregeln und geprüfte Basiswerte",
      },
      {
        href: "/de/guides/bureaucracy/anmeldung",
        title: "Anmeldung Schritt-für-Schritt",
        note: "Fristen, Unterlagen, Wohnungsgeberbestätigung",
      },
      {
        href: "/de/guides/money-taxes/elster",
        title: "ELSTER in der Praxis",
        note: "Steuerkonto aufsetzen und erste Erklärung vorbereiten",
      },
      {
        href: "/de/guides/everyday/family-benefits-kindergeld-elterngeld",
        title: "Kindergeld & Elterngeld",
        note: "Anspruch prüfen und Antragstaktik verstehen",
      },
      {
        href: "/de/guides/everyday/learn-german-in-germany",
        title: "Deutsch lernen in Deutschland",
        note: "Alltagsfähig von Null bis B1 statt in App-Chaos stecken zu bleiben",
      },
    ];
  }

  return [
    {
      href: "/en/blog/top-changes-germany-august-2026",
      title: "August 2026 Germany Changes",
      note: "All-day care, AI transparency, packaging rules, and verified baseline values",
    },
    {
      href: "/en/guides/bureaucracy/anmeldung",
      title: "Anmeldung Step-by-Step",
      note: "Deadlines, documents, and landlord confirmation flow",
    },
    {
      href: "/en/guides/money-taxes/elster",
      title: "ELSTER Made Practical",
      note: "Set up your tax account and avoid first-return mistakes",
    },
    {
      href: "/en/guides/everyday/family-benefits-kindergeld-elterngeld",
      title: "Kindergeld + Elterngeld",
      note: "Check eligibility and sequence your applications correctly",
    },
    {
      href: "/en/guides/everyday/learn-german-in-germany",
      title: "Learn German In Germany",
      note: "A survival-first route from zero to B1 for real daily-life use",
    },
  ];
}

function withSmartLifeUtm(
  url: string,
  lang: Lang,
  content: string,
  campaign = "smart-life-featured"
): string {
  try {
    const nextUrl = new URL(url);
    nextUrl.searchParams.set("utm_source", "lifehacksgermany.com");
    nextUrl.searchParams.set("utm_medium", "referral");
    nextUrl.searchParams.set("utm_campaign", campaign);
    nextUrl.searchParams.set("utm_content", content);
    nextUrl.searchParams.set("utm_term", lang);
    return nextUrl.toString();
  } catch {
    return url;
  }
}

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
  const featuredOffers = getFeaturedOffers(l);
  const heroOffersWidget = l === "en"
    ? {
        eyebrow: "Verified picks",
        title: "Check out latest Top offers in Germany",
        copy: "24 practical savings picks for groceries, transport, family, apps, and everyday spend.",
        cta: "Open Top Offers",
      }
    : {
        eyebrow: "Geprüfte Auswahl",
        title: "Aktuelle Top-Angebote in Deutschland ansehen",
        copy: "24 praktische Spar-Tipps für Supermarkt, Mobilität, Familie, Apps und Alltag.",
        cta: "Top-Angebote öffnen",
      };
  const guideCount = guides.length;
  const smartLife = getSmartLifeSectionCopy(l);
  const weeklyQuickRoutes = getWeeklyQuickRoutes(l);

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
                : "Du musst deine Adresse innerhalb von zwei Wochen nach dem Einzug anmelden, gemäß dem Bundesmeldegesetz (BMG).",
            },
            {
              q: l === "en" ? "How much does the Deutschlandticket cost?" : "Wie viel kostet das Deutschlandticket?",
              a: l === "en"
                ? "The Deutschlandticket list price is EUR 63 per month and covers regional and local transport."
                : "Der Listenpreis des Deutschlandtickets beträgt 63 Euro pro Monat und gilt im Regional- und Nahverkehr.",
            },
            {
              q: l === "en" ? "What is the Rundfunkbeitrag?" : "Was ist der Rundfunkbeitrag?",
              a: l === "en"
                ? "The Rundfunkbeitrag is currently EUR 18.36 per household per month and is generally mandatory for households in Germany."
                : "Der Rundfunkbeitrag beträgt derzeit 18,36 Euro pro Haushalt und Monat und ist in Deutschland grundsätzlich verpflichtend.",
            },
          ],
        }}
      />

      {/* Hero */}
      <section className="hero-stage relative py-20 md:py-28 overflow-hidden">
        <div className="hero-shader-bg absolute left-[2.2rem] right-[2.2rem] top-[1.2rem] bottom-[1.6rem] z-0 overflow-hidden rounded-[34px]">
          <AnimatedShaderBackground />
        </div>
        <div className="hero-glow hero-glow-right" />
        <div className="hero-glow hero-glow-left" />
        <div className="container-main relative z-[2]">
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

              <div className="space-y-4">
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

                <Link
                  href={`${base}/offers`}
                  className="group block rounded-2xl border border-[rgba(180,138,51,0.28)] bg-[linear-gradient(135deg,rgba(255,251,235,0.94),rgba(255,255,255,0.82))] p-4 no-underline text-ink shadow-[0_16px_40px_rgba(15,23,42,0.10)] transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(180,138,51,0.5)] hover:shadow-[0_20px_52px_rgba(15,23,42,0.16)]"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <span className="mb-2 inline-flex rounded-full border border-[rgba(180,138,51,0.35)] bg-accent-3/10 px-2.5 py-1 text-[0.64rem] font-black uppercase tracking-[0.14em] text-accent-3">
                        {heroOffersWidget.eyebrow}
                      </span>
                      <h2 className="m-0 text-lg font-black leading-tight tracking-tight group-hover:text-accent-2 transition-colors">
                        {heroOffersWidget.title}
                      </h2>
                      <p className="mt-1.5 mb-0 text-xs leading-relaxed text-ink-2">
                        {heroOffersWidget.copy}
                      </p>
                    </div>
                    <span className="inline-flex shrink-0 items-center justify-center rounded-full bg-ink px-3.5 py-2 text-xs font-black uppercase tracking-[0.08em] text-paper shadow-[0_10px_24px_rgba(15,23,42,0.22)] transition-colors group-hover:bg-accent-2">
                      {heroOffersWidget.cta} &rarr;
                    </span>
                  </div>
                </Link>
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
                <span className="text-[0.65rem] text-ink-3">{l === "en" ? "Review cadence" : "Prüfungsrhythmus"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Start In 60 Seconds */}
      <section className="py-7 md:py-9">
        <div className="container-main">
          <div className="highlight-band">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6">
              <div className="max-w-3xl">
                <span className="badge mb-3">
                  {l === "en" ? "Start in 60 seconds" : "In 60 Sekunden starten"}
                </span>
                <h2 className="text-2xl md:text-3xl font-black tracking-tight mt-0 mb-2">
                  {l === "en"
                    ? "Most useful first clicks this week"
                    : "Die nützlichsten ersten Klicks diese Woche"}
                </h2>
                <p className="text-ink-2 m-0">
                  {l === "en"
                    ? "Pick one high-impact route now, then continue from the guide's next-action block."
                    : "Wähle jetzt einen hochrelevanten Einstieg und gehe dann im Guide direkt zu den nächsten Schritten."}
                </p>
              </div>
              <Link href={`${base}/guides`} className="btn btn-primary">
                {l === "en" ? "Open all guides" : "Alle Guides öffnen"}
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
              {weeklyQuickRoutes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className="glass-card-link p-4 no-underline text-ink group"
                >
                  <p className="text-sm font-black tracking-tight mt-0 mb-2 group-hover:text-accent-2 transition-colors">
                    {route.title}
                  </p>
                  <p className="text-xs text-ink-2 m-0 leading-relaxed">{route.note}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Smart-Life Tools */}
      <section className="py-8 md:py-12">
        <div className="container-main">
          <div className="highlight-band">
            <div className="mb-7">
              <span className="badge mb-4">{smartLife.badge}</span>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-0 mb-3">
                {smartLife.title}
              </h2>
              <p className="text-ink-2 text-lg max-w-3xl m-0">{smartLife.intro}</p>
            </div>

            <div className="content-shell !p-5 md:!p-6 mb-6 border border-[rgba(15,23,42,0.12)]">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="badge">{smartLife.fuelWatch.badge}</span>
                <span className="badge-solid text-[0.7rem]">
                  {l === "en" ? "Last checked" : "Zuletzt geprüft"}: {smartLife.fuelWatch.lastChecked}
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black tracking-tight mt-0 mb-2">
                {smartLife.fuelWatch.title}
              </h3>
              <p className="text-sm md:text-base text-ink-2 mt-0 mb-4">{smartLife.fuelWatch.body}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {smartLife.fuelWatch.stats.map((stat) => (
                  <span key={stat} className="badge-solid">{stat}</span>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <TrackedExternalLink
                  href={withSmartLifeUtm(
                    "https://www.tankalert.de",
                    l,
                    "fuel-watch-cta",
                    "fuel-price-watch"
                  )}
                  lang={l}
                  context="app_official"
                  className="btn btn-primary"
                >
                  {smartLife.fuelWatch.cta}
                </TrackedExternalLink>
                <TrackedExternalLink
                  href={smartLife.fuelWatch.sourcePrimary.href}
                  lang={l}
                  context="app_official"
                  className="text-xs font-semibold text-accent-2 hover:underline"
                >
                  {smartLife.fuelWatch.sourcePrimary.label}
                </TrackedExternalLink>
                <TrackedExternalLink
                  href={smartLife.fuelWatch.sourceSecondary.href}
                  lang={l}
                  context="app_official"
                  className="text-xs font-semibold text-accent-2 hover:underline"
                >
                  {smartLife.fuelWatch.sourceSecondary.label}
                </TrackedExternalLink>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {smartLife.tools.map((tool) => (
                <TrackedExternalLink
                  key={tool.name}
                  href={withSmartLifeUtm(tool.href, l, tool.utmContent)}
                  lang={l}
                  context="app_official"
                  className="glass-card-link no-underline text-ink rounded-2xl p-5 h-full flex flex-col"
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span className="badge">{tool.name}</span>
                    <span className="text-[0.65rem] font-bold uppercase tracking-[0.1em] text-accent-2">
                      {l === "en" ? "Open" : "Öffnen"}
                    </span>
                  </div>
                  <h3 className="text-xl font-black leading-[1.12] tracking-tight m-0 mb-2">
                    {tool.kicker}
                  </h3>
                  <ul className="m-0 pl-5 text-sm text-ink-2 leading-relaxed space-y-1.5">
                    {tool.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                  <p className="mt-4 mb-0 text-sm font-semibold text-accent-2">{tool.outcome}</p>
                </TrackedExternalLink>
              ))}
            </div>

            <div className="mt-7">
              <p className="text-xs uppercase tracking-[0.1em] text-ink-3 font-bold mt-0 mb-3">
                {smartLife.benefitsTitle}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {smartLife.benefits.map((item) => (
                  <div key={item.title} className="content-shell !p-4 text-left">
                    <h3 className="text-base font-black tracking-tight mt-0 mb-1.5">{item.title}</h3>
                    <p className="text-sm text-ink-2 m-0">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link href={`${base}/blog/ai-for-expats-germany-time-money`} className="btn btn-primary">
                {smartLife.blogCta}
              </Link>
              <Link href={`${base}/tools`} className="btn btn-secondary">
                {smartLife.toolsCta}
              </Link>
            </div>

            <p className="mt-4 mb-0 text-xs text-ink-3">
              {smartLife.disclosure}
            </p>
          </div>
        </div>
      </section>

      {/* Featured Offers */}
      <section className="py-8 md:py-12">
        <div className="container-main">
          <div className="highlight-band">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-6">
              <div className="max-w-3xl">
                <span className="badge mb-4">{tr.offersBadge}</span>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-0 mb-3">
                  {tr.offersTitle}
                </h2>
                <p className="text-ink-2 text-lg m-0">{tr.offersCopy}</p>
              </div>
              <Link href={`${base}/offers`} className="btn btn-secondary">
                {tr.offersCta}
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredOffers.map((offer) => (
                <Link
                  key={offer.id}
                  href={`${base}/offers#${offer.id}`}
                  className="content-shell no-underline text-ink hover:border-[rgba(15,23,42,0.16)] transition-colors"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="badge-solid">#{offer.rank}</span>
                    <span className="badge">{offer.brand}</span>
                  </div>
                  <h3 className="text-xl font-black leading-[1.12] tracking-tight m-0 mb-2">
                    {offer.title}
                  </h3>
                  <p className="text-sm text-ink-2 m-0">{offer.benefit}</p>
                </Link>
              ))}
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
                  href={`${base}/guides/everyday/family-benefits-kindergeld-elterngeld`}
                  className="glass-card-link p-3.5 text-sm font-semibold no-underline text-ink hover:text-accent-2 transition-colors"
                >
                  {l === "en" ? "Family benefits: Kindergeld + Elterngeld" : "Familienleistungen: Kindergeld + Elterngeld"}
                </Link>
                <Link
                  href={`${base}/guides/everyday/offline-gps-safety-hack`}
                  className="glass-card-link p-3.5 text-sm font-semibold no-underline text-ink hover:text-accent-2 transition-colors"
                >
                  {l === "en" ? "Offline GPS safety guide" : "Offline-GPS Sicherheitsguide"}
                </Link>
                <Link
                  href={`${base}/guides/money-taxes/elster`}
                  className="glass-card-link p-3.5 text-sm font-semibold no-underline text-ink hover:text-accent-2 transition-colors"
                >
                  {l === "en" ? "ELSTER setup and first filing" : "ELSTER einrichten und erste Abgabe"}
                </Link>
                <Link
                  href={`${base}/guides/housing/kuendigungsfrist-miete`}
                  className="glass-card-link p-3.5 text-sm font-semibold no-underline text-ink hover:text-accent-2 transition-colors"
                >
                  {l === "en" ? "Rent notice period in Germany" : "Kündigungsfrist der Miete in Deutschland"}
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

    </>
  );
}
