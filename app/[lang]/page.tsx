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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const l = lang as Lang;
  const metaTitle = l === "en"
    ? "Life Hacks Germany 2026: Anmeldung, Taxes, Housing, Daily Systems"
    : "Life Hacks Germany 2026: Anmeldung, Steuern, Wohnen, Alltagssysteme";
  const metaDescription = l === "en"
    ? "Verification-first Germany guides for expats and locals: Anmeldung, ELSTER taxes, rent rules, transport, and practical decision tools."
    : "Verifizierte Deutschland-Guides fuer Expats und Einheimische: Anmeldung, ELSTER, Mietregeln, Mobilitaet und praktische Entscheidungstools.";
  const social = createSocialMetadata({
    title: metaTitle,
    description: metaDescription,
    badge: l === "en" ? "Start Here" : "Start hier",
  });
  return {
    title: metaTitle,
    description: metaDescription,
    keywords:
      l === "en"
        ? [
            "Germany life hacks",
            "Anmeldung guide",
            "ELSTER tax setup",
            "housing Germany guide",
            "Deutschlandticket",
          ]
        : [
            "Deutschland Life Hacks",
            "Anmeldung Guide",
            "ELSTER Steuer",
            "Wohnen Deutschland",
            "Deutschlandticket",
          ],
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
        "Drei fokussierte Tools, die den Deutschland-Alltag praktischer machen: KI-Workflows, Spritkosten-Optimierung und praezise Standorthilfe.",
      fuelWatch: {
        badge: "Spritpreis-Watch",
        title: "Deutschland: deutlicher Preissprung in der letzten Erhebungswoche",
        body:
          "Laut ADAC-Update sind die Preise zuletzt spuerbar gestiegen. Gerade jetzt helfen Stationsvergleich und Preisalarme, damit du nicht zur teuersten Zeit tankst.",
        stats: ["Super E10: +12,1 Cent/Liter", "Diesel: +17,7 Cent/Liter"],
        lastChecked: "10. Maerz 2026",
        sourcePrimary: {
          label: "ADAC Presse (04.03.2026)",
          href: "https://presse.adac.de/meldungen/adac-ev/verkehr/kraftstoffpreise-springen-stark-nach-oben.html",
        },
        sourceSecondary: {
          label: "ADAC Presse (02.03.2026)",
          href: "https://presse.adac.de/meldungen/adac-ev/verkehr/benzin-und-diesel-im-februar-teurer-als-im-vormonat.html",
        },
        cta: "Tank Alert Preisalarm setzen",
      },
      tools: [
        {
          name: "T-Minus AI",
          href: "https://www.tminusai.com",
          utmContent: "tminusai-card",
          kicker: "KI-Workflows fuer Behoerden, Jobsuche und Alltagsplanung",
          features: [
            "Prompt-Frameworks fuer Mails, Checklisten und Formulare",
            "Modellauswahl nach Aufgabentyp statt Zufall",
            "Wiederverwendbare Arbeitsroutinen fuer wiederkehrende Prozesse",
          ],
          outcome: "Spart vor allem bei wiederkehrender Adminarbeit mehrere Stunden pro Woche.",
        },
        {
          name: "Tank Alert",
          href: "https://www.tankalert.de",
          utmContent: "tankalert-card",
          kicker: "Live-Spritpreise, Alerts und Kostenrechner fuer Autofahrer",
          features: [
            "Stationen vergleichen und Preisalarme setzen",
            "Detour-Rechner fuer echte Nettoersparnis",
            "Bessere Tank-Entscheidungen fuer Pendelroutinen",
          ],
          outcome: "Hilft, vermeidbare Mobilitaetskosten im Alltag sichtbar zu senken.",
        },
        {
          name: "SkyLocation",
          href: "https://www.skylocation.app",
          utmContent: "skylocation-card",
          kicker: "Offline GPS fuer iPhone: Koordinaten ueberall, auch im Flugzeug",
          features: [
            "Praezise GPS-Koordinaten ohne Internet, SIM oder Roaming",
            "In-Flight Tracking mit Position, Hoehe und Ground Speed",
            "SOS-orientierte Koordinatenfreigabe fuer Notfaelle",
          ],
          outcome:
            "Hilft bei Reisen, Outdoor und Notfaellen mit offline verfuetbaren Positionsdaten; Pro als Einmalkauf ohne Abo.",
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
          body: "Bessere Entscheidungen bei Mobilitaet, Abos und Alltagsausgaben.",
        },
        {
          title: "Weniger Fehler",
          body: "Klarere Prozesse, bessere Vorbereitung, weniger frustrierende Rueckfragen.",
        },
      ],
      blogCta: "AI-Anwendungsfaelle fuer Expats lesen",
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
      title: "Germany: notable week-on-week fuel jump",
      body:
        "Recent ADAC reporting shows sharp weekly increases. Right now, station comparison and price alarms are the easiest way to reduce overpaying at the pump.",
      stats: ["Super E10: +12.1 cents/liter", "Diesel: +17.7 cents/liter"],
      lastChecked: "March 10, 2026",
      sourcePrimary: {
        label: "ADAC press (March 4, 2026)",
        href: "https://presse.adac.de/meldungen/adac-ev/verkehr/kraftstoffpreise-springen-stark-nach-oben.html",
      },
      sourceSecondary: {
        label: "ADAC press (March 2, 2026)",
        href: "https://presse.adac.de/meldungen/adac-ev/verkehr/benzin-und-diesel-im-februar-teurer-als-im-vormonat.html",
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
        href: "/de/guides/bureaucracy/anmeldung",
        title: "Anmeldung Schritt-fuer-Schritt",
        note: "Fristen, Unterlagen, Wohnungsgeberbestaetigung",
      },
      {
        href: "/de/guides/money-taxes/elster",
        title: "ELSTER in der Praxis",
        note: "Steuerkonto aufsetzen und erste Erklaerung vorbereiten",
      },
      {
        href: "/de/guides/everyday/family-benefits-kindergeld-elterngeld",
        title: "Kindergeld & Elterngeld",
        note: "Anspruch pruefen und Antragstaktik verstehen",
      },
      {
        href: "/de/guides/everyday/offline-gps-safety-hack",
        title: "Offline-GPS Sicherheits-Hack",
        note: "Koordinaten nutzen, auch ohne Internet oder Roaming",
      },
    ];
  }

  return [
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
      href: "/en/guides/everyday/offline-gps-safety-hack",
      title: "Offline GPS Safety Hack",
      note: "Get coordinates even without data, SIM, or roaming",
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
                : "Du musst deine Adresse innerhalb von zwei Wochen nach dem Einzug anmelden, gemaess dem Bundesmeldegesetz (BMG).",
            },
            {
              q: l === "en" ? "How much does the Deutschlandticket cost?" : "Wie viel kostet das Deutschlandticket?",
              a: l === "en"
                ? "The Deutschlandticket list price is EUR 63 per month and covers regional and local transport."
                : "Der Listenpreis des Deutschlandtickets betraegt 63 Euro pro Monat und gilt im Regional- und Nahverkehr.",
            },
            {
              q: l === "en" ? "What is the Rundfunkbeitrag?" : "Was ist der Rundfunkbeitrag?",
              a: l === "en"
                ? "The Rundfunkbeitrag is currently EUR 18.36 per household per month and is generally mandatory for households in Germany."
                : "Der Rundfunkbeitrag betraegt derzeit 18,36 Euro pro Haushalt und Monat und ist in Deutschland grundsaetzlich verpflichtend.",
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
                    : "Die nuetzlichsten ersten Klicks diese Woche"}
                </h2>
                <p className="text-ink-2 m-0">
                  {l === "en"
                    ? "Pick one high-impact route now, then continue from the guide's next-action block."
                    : "Waehle jetzt einen hochrelevanten Einstieg und gehe dann im Guide direkt zu den naechsten Schritten."}
                </p>
              </div>
              <Link href={`${base}/guides`} className="btn btn-primary">
                {l === "en" ? "Open all guides" : "Alle Guides oeffnen"}
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
                  {l === "en" ? "Last checked" : "Zuletzt geprueft"}: {smartLife.fuelWatch.lastChecked}
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
                      {l === "en" ? "Open" : "Oeffnen"}
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
                  {l === "en" ? "Rent notice period in Germany" : "Kuendigungsfrist der Miete in Deutschland"}
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
