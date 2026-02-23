import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import type { Lang, PillarKey } from "@/lib/i18n";
import { t, pillars, siteConfig } from "@/lib/i18n";
import { getGuide, getGuidesByPillar, getAllGuideSlugs } from "@/lib/guides";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import ReadingProgress from "@/components/ReadingProgress";
import GuideShareActions from "@/components/GuideShareActions";
import TrackedExternalLink from "@/components/TrackedExternalLink";
import { createSocialMetadata } from "@/lib/seo";

const TIP_GUIDE_SLUGS = new Set([
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
  "essential-germany-app-stack",
  "doctor-appointment-booking-hack",
  "sunday-shopping-survival-hack",
  "local-library-networking-hack",
  "kulturpass-maximizer-hack",
]);

type AppStackCardConfig = {
  id: string;
  matchLabel: string;
  icon: string;
  iosUrl: string;
  name: { en: string; de: string };
  purpose: { en: string; de: string };
};

type AppDirectoryItem = {
  id: string;
  icon: string;
  iosUrl: string;
  officialUrl: string;
  name: { en: string; de: string };
  purpose: { en: string; de: string };
};

type AppDirectoryCategory = {
  id: string;
  title: { en: string; de: string };
  apps: AppDirectoryItem[];
};

const ESSENTIAL_APP_STACK_CONFIG: AppStackCardConfig[] = [
  {
    id: "nora",
    matchLabel: "nora",
    icon: "/images/apps/nora.jpg",
    iosUrl: "https://apps.apple.com/de/app/nora-notruf-app/id1585173934",
    name: { en: "nora Emergency", de: "nora Notruf" },
    purpose: {
      en: "Official emergency call app for contacting police, fire and rescue.",
      de: "Offizielle Notruf-App fuer Polizei, Feuerwehr und Rettungsdienst.",
    },
  },
  {
    id: "warnwetter",
    matchLabel: "warnwetter",
    icon: "/images/apps/warnwetter.jpg",
    iosUrl: "https://apps.apple.com/de/app/dwd-warnwetter/id986420993",
    name: { en: "DWD WarnWetter", de: "DWD WarnWetter" },
    purpose: {
      en: "Official weather warnings and severe weather alerts.",
      de: "Amtliche Wetterwarnungen und Unwetter-Alerts.",
    },
  },
  {
    id: "db",
    matchLabel: "db navigator",
    icon: "/images/apps/db-navigator.jpg",
    iosUrl: "https://apps.apple.com/de/app/db-navigator/id343555245",
    name: { en: "DB Navigator", de: "DB Navigator" },
    purpose: {
      en: "Rail and transit planning with live updates.",
      de: "Bahn- und OePNV-Planung mit Live-Updates.",
    },
  },
  {
    id: "dhl",
    matchLabel: "dhl",
    icon: "/images/apps/post-dhl.jpg",
    iosUrl: "https://apps.apple.com/de/app/post-dhl/id329315203",
    name: { en: "Post & DHL", de: "Post & DHL" },
    purpose: {
      en: "Shipment tracking, pickup and parcel control.",
      de: "Sendungsverfolgung, Abholung und Paketsteuerung.",
    },
  },
  {
    id: "doctolib",
    matchLabel: "doctolib",
    icon: "/images/apps/doctolib.jpg",
    iosUrl: "https://apps.apple.com/de/app/doctolib-die-gesundheits-app/id925339063",
    name: { en: "Doctolib", de: "Doctolib" },
    purpose: {
      en: "Doctor discovery and appointment booking.",
      de: "Arztsuche und Terminbuchung.",
    },
  },
];

const GERMANY_APPS_DIRECTORY: AppDirectoryCategory[] = [
  {
    id: "safety-weather",
    title: { en: "Safety & Weather", de: "Sicherheit & Wetter" },
    apps: [
      {
        id: "nora",
        icon: "/images/apps/nora.jpg",
        iosUrl: "https://apps.apple.com/de/app/nora-notruf-app/id1585173934",
        officialUrl: "https://www.nora-notruf.de/en-en/startpage",
        name: { en: "nora Emergency", de: "nora Notruf" },
        purpose: {
          en: "Emergency contact for police, fire and rescue services.",
          de: "Notrufkontakt fuer Polizei, Feuerwehr und Rettungsdienst.",
        },
      },
      {
        id: "nina",
        icon: "/images/apps/nina.jpg",
        iosUrl: "https://apps.apple.com/de/app/nina/id949360949",
        officialUrl: "https://warnung.bund.de/meldungen/mowas/nina",
        name: { en: "NINA", de: "NINA" },
        purpose: {
          en: "Official civil protection warning app for Germany.",
          de: "Offizielle Warn-App des Bevoelkerungsschutzes.",
        },
      },
      {
        id: "warnwetter",
        icon: "/images/apps/warnwetter.jpg",
        iosUrl: "https://apps.apple.com/de/app/dwd-warnwetter/id986420993",
        officialUrl: "https://www.dwd.de/EN/ourservices/warnwetterapp/warnwetterapp.html",
        name: { en: "DWD WarnWetter", de: "DWD WarnWetter" },
        purpose: {
          en: "Official weather warnings from DWD.",
          de: "Amtliche Wetterwarnungen vom DWD.",
        },
      },
      {
        id: "windy",
        icon: "/images/apps/windy.jpg",
        iosUrl: "https://apps.apple.com/de/app/windy-com-welt-wettertracker/id1161387262",
        officialUrl: "https://www.windy.com/",
        name: { en: "Windy", de: "Windy" },
        purpose: {
          en: "High-detail wind and weather maps.",
          de: "Detaillierte Wind- und Wetterkarten.",
        },
      },
      {
        id: "regenradar",
        icon: "/images/apps/regenradar.jpg",
        iosUrl: "https://apps.apple.com/de/app/regenradar-mit-wetterwarnungen/id439839893",
        officialUrl: "https://www.wetteronline.de/regenradar",
        name: { en: "RegenRadar", de: "RegenRadar" },
        purpose: {
          en: "Rain radar for local precipitation tracking.",
          de: "Regenradar fuer lokale Niederschlagsprognosen.",
        },
      },
    ],
  },
  {
    id: "mobility",
    title: { en: "Mobility", de: "Mobilitaet" },
    apps: [
      {
        id: "deutschlandticket",
        icon: "/images/apps/deutschlandticket.jpg",
        iosUrl: "https://apps.apple.com/de/app/app-deutschlandticket-de/id1672638598",
        officialUrl: "https://www.deutschlandticket.de/",
        name: { en: "Deutschlandticket App", de: "Deutschlandticket App" },
        purpose: {
          en: "Subscription management for Deutschlandticket providers.",
          de: "Abo-Verwaltung fuer Deutschlandticket-Anbieter.",
        },
      },
      {
        id: "db-navigator",
        icon: "/images/apps/db-navigator.jpg",
        iosUrl: "https://apps.apple.com/de/app/db-navigator/id343555245",
        officialUrl: "https://www.bahn.de/service/mobile/db-navigator",
        name: { en: "DB Navigator", de: "DB Navigator" },
        purpose: {
          en: "Rail planning, tickets, and delay updates.",
          de: "Bahnplanung, Tickets und Verspaetungsupdates.",
        },
      },
      {
        id: "flixbus",
        icon: "/images/apps/flixbus.jpg",
        iosUrl: "https://apps.apple.com/de/app/flixbus-flixtrain/id778437357",
        officialUrl: "https://www.flixbus.com/",
        name: { en: "FlixBus & FlixTrain", de: "FlixBus & FlixTrain" },
        purpose: {
          en: "Long-distance bus and rail alternatives.",
          de: "Fernbus- und Fernzug-Alternativen.",
        },
      },
      {
        id: "moovit",
        icon: "/images/apps/moovit.jpg",
        iosUrl: "https://apps.apple.com/de/app/moovit-bus-bahn-%C3%B6pnv-info/id498477945",
        officialUrl: "https://moovit.com/",
        name: { en: "Moovit", de: "Moovit" },
        purpose: {
          en: "Urban transit routes across many cities.",
          de: "Stadtverkehrsrouten in vielen Staedten.",
        },
      },
      {
        id: "bvg-fahrinfo",
        icon: "/images/apps/bvg-fahrinfo.jpg",
        iosUrl: "https://apps.apple.com/de/app/bvg-fahrinfo-%C3%B6pnv-berlin/id284971745",
        officialUrl: "https://www.bvg.de/en/subscriptions-and-tickets/all-apps/fahrinfo-app",
        name: { en: "BVG Fahrinfo", de: "BVG Fahrinfo" },
        purpose: {
          en: "Berlin transit planning and route information.",
          de: "OePNV-Planung und Routeninfos fuer Berlin.",
        },
      },
      {
        id: "komoot",
        icon: "/images/apps/komoot.jpg",
        iosUrl: "https://apps.apple.com/de/app/komoot-hike-bike-run/id447374873",
        officialUrl: "https://www.komoot.com/",
        name: { en: "komoot", de: "komoot" },
        purpose: {
          en: "Hiking and cycling route planning.",
          de: "Routenplanung fuer Wandern und Radfahren.",
        },
      },
    ],
  },
  {
    id: "housing-daily",
    title: { en: "Housing & Daily Life", de: "Wohnen & Alltag" },
    apps: [
      {
        id: "immoscout24",
        icon: "/images/apps/immoscout24.jpg",
        iosUrl: "https://apps.apple.com/de/app/immoscout24-immobilien/id344176018",
        officialUrl: "https://www.immobilienscout24.de/",
        name: { en: "ImmoScout24", de: "ImmoScout24" },
        purpose: {
          en: "Apartment and house search with alerts.",
          de: "Wohnungs- und Haussuche mit Alerts.",
        },
      },
      {
        id: "immowelt",
        icon: "/images/apps/immowelt.jpg",
        iosUrl: "https://apps.apple.com/de/app/immowelt-immobilien-suche/id354119842",
        officialUrl: "https://www.immowelt.de/",
        name: { en: "immowelt", de: "immowelt" },
        purpose: {
          en: "Alternative housing search portal.",
          de: "Alternatives Wohnungsportal fuer Suche und Vergleich.",
        },
      },
      {
        id: "wg-gesucht",
        icon: "/images/apps/wg-gesucht.jpg",
        iosUrl: "https://apps.apple.com/de/app/wg-gesucht-wohnungen-wgs/id1084293678",
        officialUrl: "https://www.wg-gesucht.de/",
        name: { en: "WG-Gesucht", de: "WG-Gesucht" },
        purpose: {
          en: "Flatshare and temporary room listings.",
          de: "WG- und Zwischenmietangebote.",
        },
      },
      {
        id: "bring",
        icon: "/images/apps/bring.jpg",
        iosUrl: "https://apps.apple.com/de/app/bring-einkaufsliste-rezepte/id580669177",
        officialUrl: "https://www.getbring.com/",
        name: { en: "Bring!", de: "Bring!" },
        purpose: {
          en: "Shared grocery list and planning.",
          de: "Geteilte Einkaufsliste und Planung.",
        },
      },
      {
        id: "rewe",
        icon: "/images/apps/rewe.jpg",
        iosUrl: "https://apps.apple.com/de/app/rewe-supermarkt/id714121079",
        officialUrl: "https://www.rewe.de/service/rewe-app/",
        name: { en: "REWE", de: "REWE" },
        purpose: {
          en: "Digital offers and grocery shopping flow.",
          de: "Digitale Angebote und Einkaufsplanung.",
        },
      },
      {
        id: "lieferando",
        icon: "/images/apps/lieferando.jpg",
        iosUrl: "https://apps.apple.com/de/app/lieferando-de/id419724490",
        officialUrl: "https://www.lieferando.de/apps",
        name: { en: "Lieferando", de: "Lieferando" },
        purpose: {
          en: "Food ordering and delivery logistics.",
          de: "Essensbestellung und Lieferlogistik.",
        },
      },
      {
        id: "too-good-to-go",
        icon: "/images/apps/too-good-to-go.jpg",
        iosUrl: "https://apps.apple.com/de/app/too-good-to-go-essen-retten/id1060683933",
        officialUrl: "https://www.toogoodtogo.com/de",
        name: { en: "Too Good To Go", de: "Too Good To Go" },
        purpose: {
          en: "Discounted surplus food from local shops.",
          de: "Guenstiges Restessen aus lokalen Laeden.",
        },
      },
    ],
  },
  {
    id: "health-admin",
    title: { en: "Healthcare & Admin", de: "Gesundheit & Verwaltung" },
    apps: [
      {
        id: "doctolib",
        icon: "/images/apps/doctolib.jpg",
        iosUrl: "https://apps.apple.com/de/app/doctolib-die-gesundheits-app/id925339063",
        officialUrl: "https://www.doctolib.de/",
        name: { en: "Doctolib", de: "Doctolib" },
        purpose: {
          en: "Doctor booking and follow-up appointments.",
          de: "Arzttermine buchen und nachverfolgen.",
        },
      },
      {
        id: "jameda",
        icon: "/images/apps/jameda.jpg",
        iosUrl: "https://apps.apple.com/de/app/jameda-%C3%A4rzte-finden-buchen/id1635293480",
        officialUrl: "https://www.jameda.de/",
        name: { en: "jameda", de: "jameda" },
        purpose: {
          en: "Doctor search and specialty filtering.",
          de: "Arztsuche mit Fachbereichsfiltern.",
        },
      },
      {
        id: "post-dhl",
        icon: "/images/apps/post-dhl.jpg",
        iosUrl: "https://apps.apple.com/de/app/post-dhl/id329315203",
        officialUrl: "https://www.dhl.de/de/privatkunden/kampagnenseiten/dhl-app.html",
        name: { en: "Post & DHL", de: "Post & DHL" },
        purpose: {
          en: "Parcel, letter and pickup management.",
          de: "Paket-, Brief- und Abholmanagement.",
        },
      },
      {
        id: "fax-plus",
        icon: "/images/apps/fax-plus.jpg",
        iosUrl: "https://apps.apple.com/de/app/fax-plus-send-online-fax-app/id1170782544",
        officialUrl: "https://www.fax.plus/",
        name: { en: "Fax.Plus", de: "Fax.Plus" },
        purpose: {
          en: "Send official documents by fax when required.",
          de: "Dokumente per Fax versenden, wenn gefordert.",
        },
      },
    ],
  },
  {
    id: "marketplaces-cars",
    title: { en: "Marketplaces & Cars", de: "Marktplaetze & Autos" },
    apps: [
      {
        id: "kleinanzeigen",
        icon: "/images/apps/kleinanzeigen.jpg",
        iosUrl: "https://apps.apple.com/de/app/kleinanzeigen-jetzt-ohne-ebay/id382596778",
        officialUrl: "https://www.kleinanzeigen.de/",
        name: { en: "Kleinanzeigen", de: "Kleinanzeigen" },
        purpose: {
          en: "Used goods and local classified deals.",
          de: "Gebrauchtwaren und lokale Kleinanzeigen.",
        },
      },
      {
        id: "vinted",
        icon: "/images/apps/vinted.jpg",
        iosUrl: "https://apps.apple.com/de/app/vinted-secondhand-marktplatz/id632064380",
        officialUrl: "https://www.vinted.de/",
        name: { en: "Vinted", de: "Vinted" },
        purpose: {
          en: "Secondhand fashion marketplace.",
          de: "Secondhand-Marktplatz fuer Kleidung.",
        },
      },
      {
        id: "ebay",
        icon: "/images/apps/ebay.jpg",
        iosUrl: "https://apps.apple.com/de/app/ebay-kaufen-verkaufen/id282614216",
        officialUrl: "https://www.ebay.de/",
        name: { en: "eBay", de: "eBay" },
        purpose: {
          en: "General marketplace for buying and selling.",
          de: "Allgemeiner Marktplatz fuer Kauf und Verkauf.",
        },
      },
      {
        id: "momox",
        icon: "/images/apps/momox.jpg",
        iosUrl: "https://apps.apple.com/de/app/momox-second-hand-verkaufen/id414543719",
        officialUrl: "https://www.momox.de/",
        name: { en: "momox", de: "momox" },
        purpose: {
          en: "Sell used books, media and clothes quickly.",
          de: "Gebrauchte Buecher, Medien und Kleidung verkaufen.",
        },
      },
      {
        id: "mobile-de",
        icon: "/images/apps/mobile-de.jpg",
        iosUrl: "https://apps.apple.com/de/app/mobile-de-autos-kaufen-mehr/id378563358",
        officialUrl: "https://www.mobile.de/",
        name: { en: "mobile.de", de: "mobile.de" },
        purpose: {
          en: "Used and new car marketplace listings.",
          de: "Fahrzeugmarkt fuer Gebraucht- und Neuwagen.",
        },
      },
      {
        id: "autoscout24",
        icon: "/images/apps/autoscout24.jpg",
        iosUrl: "https://apps.apple.com/de/app/autoscout24-auto-kaufen/id311785642",
        officialUrl: "https://www.autoscout24.de/",
        name: { en: "AutoScout24", de: "AutoScout24" },
        purpose: {
          en: "Car search with dealer and private listings.",
          de: "Autosuche mit Haendler- und Privatangeboten.",
        },
      },
    ],
  },
];

export async function generateStaticParams() {
  return getAllGuideSlugs().map((g) => ({
    lang: g.lang,
    pillar: g.pillar,
    slug: g.slug,
  }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; pillar: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, pillar, slug } = await params;
  const l = lang as Lang;
  const p = pillar as PillarKey;
  const guide = getGuide(l, slug);
  if (!guide || !pillars[p] || guide.frontmatter.pillar !== p) return {};
  const fm = guide.frontmatter;
  const social = createSocialMetadata({
    title: fm.title,
    description: fm.summary,
    badge: l === "en" ? "Guide" : "Guide",
  });

  return {
    title: fm.title,
    description: fm.summary,
    alternates: {
      canonical: `${siteConfig.domain}/${lang}/guides/${pillar}/${slug}`,
      languages: {
        en: `${siteConfig.domain}/en/guides/${pillar}/${slug}`,
        de: `${siteConfig.domain}/de/guides/${pillar}/${slug}`,
      },
    },
    openGraph: {
      ...social.openGraph,
      url: `${siteConfig.domain}/${lang}/guides/${pillar}/${slug}`,
      type: "article",
      publishedTime: fm.updated,
      modifiedTime: fm.updated,
    },
    twitter: social.twitter,
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ lang: string; pillar: string; slug: string }>;
}) {
  const { lang, pillar, slug } = await params;
  const l = lang as Lang;
  const p = pillar as PillarKey;
  const guide = getGuide(l, slug);

  if (!guide || !pillars[p] || guide.frontmatter.pillar !== p) notFound();

  const fm = guide.frontmatter;
  const tr = t[l].guide;
  const trTips = t[l].tips;
  const trGuides = t[l].guides;
  const base = `/${l}`;
  const pillarEntry = pillars[p][l];
  const isTipGuide = TIP_GUIDE_SLUGS.has(slug);
  const canonicalUrl = `${siteConfig.domain}/${l}/guides/${pillar}/${slug}`;

  // Get related guides from same pillar
  const manualRelated = new Set(fm.relatedGuides ?? []);
  const inPillar = getGuidesByPillar(l, p).filter((g) => g.frontmatter.slug !== slug);
  const relatedByFrontmatter = inPillar.filter((g) => manualRelated.has(g.frontmatter.slug));
  const relatedFallback = inPillar.filter((g) => !manualRelated.has(g.frontmatter.slug));
  const related = [...relatedByFrontmatter, ...relatedFallback];
  const isEn = l === "en";
  const quickSteps = fm.steps.slice(0, Math.min(3, fm.steps.length));
  const totalWords =
    fm.summary.split(/\s+/).length +
    fm.steps.join(" ").split(/\s+/).length +
    fm.facts.join(" ").split(/\s+/).length +
    fm.mistakes.join(" ").split(/\s+/).length +
    guide.content.split(/\s+/).length;
  const estimatedReadMinutes = Math.max(4, Math.round(totalWords / 180));

  const appStackCards =
    slug === "essential-germany-app-stack"
      ? ESSENTIAL_APP_STACK_CONFIG.map((item) => {
          const source = fm.sources.find((src) =>
            src.label.toLowerCase().includes(item.matchLabel)
          );
          if (!source) return null;
          return {
            ...item,
            sourceUrl: source.url,
            sourceLabel: source.label,
          };
        }).filter((item): item is NonNullable<typeof item> => item !== null)
      : [];
  const appDirectoryCategories =
    slug === "essential-germany-app-stack" ? GERMANY_APPS_DIRECTORY : [];

  const flowLabels = isEn
    ? {
        howToUse: "Read this page in order",
        quickStart: "Quick Start",
        stepPlan: "Step-by-step plan",
        context: "Key context",
        deepDive: "Detailed walkthrough",
        mistakes: "Risk checks",
        sources: "Official sources",
        offers: "Recommended offers",
        affiliateDisclosure:
          "Commercial transparency: links in this section are editorially selected. If partner links are activated in the future, they are clearly labeled.",
        next: "Next action",
        estimatedRead: "Estimated read time",
        sourceRefresh: "Source refresh",
        startNow: "Start now",
        todayPlan:
          "Follow these first actions before reading the full guide. Most users resolve 80% of confusion with these steps.",
        atGlance: "At a glance",
        appStack: "Recommended App Stack",
        appStackDesc:
          "Install these core apps first. Icons below are the actual app icons so users can identify them instantly.",
        appDirectory: "Apps DE Directory",
        appDirectoryDesc:
          "Expanded app list from Life Hacks DE Apps DE page, grouped by real use cases in Germany.",
        openOfficial: "Official page",
        openIos: "iOS App",
      }
    : {
        howToUse: "So liest du diese Seite",
        quickStart: "Schnellstart",
        stepPlan: "Schritt-fuer-Schritt Plan",
        context: "Wichtiger Kontext",
        deepDive: "Detaillierte Erklaerung",
        mistakes: "Risikopruefung",
        sources: "Offizielle Quellen",
        offers: "Empfohlene Angebote",
        affiliateDisclosure:
          "Kommerzielle Transparenz: Links in diesem Abschnitt sind redaktionell ausgewaehlt. Falls spaeter Partnerlinks aktiviert werden, werden sie klar gekennzeichnet.",
        next: "Naechste Aktion",
        estimatedRead: "Geschaetzte Lesezeit",
        sourceRefresh: "Quellen-Update",
        startNow: "Jetzt starten",
        todayPlan:
          "Fuehre zuerst diese Kernschritte aus. Bei den meisten Nutzern loesen sie den groessten Teil der Unsicherheit.",
        atGlance: "Auf einen Blick",
        appStack: "Empfohlener App-Stack",
        appStackDesc:
          "Installiere zuerst diese Kern-Apps. Die Icons unten sind die echten App-Icons fuer schnelle Wiedererkennung.",
        appDirectory: "Apps-DE Verzeichnis",
        appDirectoryDesc:
          "Erweiterte App-Liste aus der Life Hacks DE Apps-DE Seite, nach realen Anwendungsfaellen gruppiert.",
        openOfficial: "Offizielle Seite",
        openIos: "iOS App",
      };

  const sectionLinks = [
    { id: "quick-start", label: flowLabels.quickStart },
    { id: "step-plan", label: flowLabels.stepPlan },
    ...(appStackCards.length > 0 ? [{ id: "app-stack", label: flowLabels.appStack }] : []),
    ...(appDirectoryCategories.length > 0
      ? [{ id: "app-directory", label: flowLabels.appDirectory }]
      : []),
    { id: "context", label: flowLabels.context },
    ...(guide.content.trim().length > 0 ? [{ id: "deep-dive", label: flowLabels.deepDive }] : []),
    { id: "mistakes", label: flowLabels.mistakes },
    ...(fm.offers && fm.offers.length > 0 ? [{ id: "offers", label: flowLabels.offers }] : []),
    { id: "sources", label: flowLabels.sources },
    { id: "next", label: flowLabels.next },
  ];

  // Build FAQ from mistakes + facts
  const faqs = [
    ...fm.facts.map((fact) => ({
      q: l === "en"
        ? `What should I know about: ${fact.replace(/\.$/, "")}?`
        : `Was sollte ich wissen zu: ${fact.replace(/\.$/, "")}?`,
      a: fact,
    })),
    ...fm.mistakes.map((m) => ({
      q: l === "en"
        ? `How can I avoid this mistake: ${m}?`
        : `Wie vermeide ich diesen Fehler: ${m}?`,
      a: l === "en"
        ? `Avoid this by following the step-by-step process in this guide and checking the official source links before submitting documents.`
        : `Vermeide das, indem du die Schrittfolge im Guide befolgst und die offiziellen Quellen vor Einreichung pruefst.`,
    })),
  ];

  return (
    <>
      <ReadingProgress />
      <JsonLd
        type="article"
        lang={l}
        data={{
          title: fm.title,
          summary: fm.summary,
          updated: fm.updated,
          url: canonicalUrl,
        }}
      />
      <JsonLd
        type="howto"
        lang={l}
        data={{
          title: fm.title,
          summary: fm.summary,
          steps: fm.steps,
          costs: fm.costs,
        }}
      />
      <JsonLd type="faq" lang={l} data={{ faqs }} />
      <JsonLd
        type="breadcrumb"
        lang={l}
        data={{
          items: isTipGuide
            ? [
                { name: l === "en" ? "Home" : "Start", url: `${siteConfig.domain}/${l}` },
                { name: trTips.title, url: `${siteConfig.domain}/${l}/tips` },
                { name: fm.title, url: `${siteConfig.domain}/${l}/guides/${pillar}/${slug}` },
              ]
            : [
                { name: l === "en" ? "Home" : "Start", url: `${siteConfig.domain}/${l}` },
                { name: trGuides.title, url: `${siteConfig.domain}/${l}/guides` },
                { name: pillarEntry.title, url: `${siteConfig.domain}/${l}/guides/${pillar}` },
                { name: fm.title, url: `${siteConfig.domain}/${l}/guides/${pillar}/${slug}` },
              ],
        }}
      />

      <Breadcrumbs
        lang={l}
        items={
          isTipGuide
            ? [
                { label: trTips.title, href: `${base}/tips` },
                { label: fm.title },
              ]
            : [
                { label: trGuides.title, href: `${base}/guides` },
                { label: pillarEntry.title, href: `${base}/guides/${pillar}` },
                { label: fm.title },
              ]
        }
      />

      <section className="py-14 md:py-16">
        <div className="container-main">
          <span className="badge mb-5">{tr.verifiedGuide}</span>
          <h1 className="text-3xl md:text-4xl lg:text-[2.8rem] font-black leading-[1.08] tracking-tight mb-4 max-w-4xl">
            {fm.title}
          </h1>
          <p className="text-lg text-ink-2 leading-relaxed mb-4 max-w-3xl">
            {fm.summary}
          </p>
          <GuideShareActions lang={l} title={fm.title} url={canonicalUrl} />
        </div>
      </section>

      <section className="pb-20">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-[290px_minmax(0,1fr)] gap-8 items-start">
            <aside className="lg:sticky lg:top-24">
              <div className="content-shell guide-rail-shell">
                <h2 className="text-base font-black tracking-tight mt-0 mb-3">
                  {flowLabels.howToUse}
                </h2>
                <nav className="guide-anchor-nav mb-5">
                  {sectionLinks.map((item) => (
                    <a key={item.id} href={`#${item.id}`} className="guide-anchor-link">
                      {item.label}
                    </a>
                  ))}
                </nav>
                <div className="guide-rail-meta">
                  <p className="text-xs uppercase tracking-[0.1em] font-bold text-ink-3 mb-1">
                    {flowLabels.atGlance}
                  </p>
                  <p className="text-sm text-ink-2 m-0 mb-2">{fm.forWho}</p>
                  <p className="text-xs text-ink-3 m-0">
                    {flowLabels.estimatedRead}: {estimatedReadMinutes} min
                  </p>
                  <p className="text-xs text-ink-3 m-0">
                    {flowLabels.sourceRefresh}: {fm.updated}
                  </p>
                </div>
                <div className="notice text-sm mt-4">{fm.disclaimer}</div>
              </div>
            </aside>

            <div className="flex flex-col gap-8">
              <section id="quick-start" className="content-shell">
                <h2 className="text-2xl font-black tracking-tight mt-0 mb-2">
                  {flowLabels.quickStart}
                </h2>
                <p className="text-ink-2 mb-6">{flowLabels.todayPlan}</p>
                <div className="guide-quick-list">
                  {quickSteps.map((step, i) => (
                    <div key={i} className="guide-quick-item">
                      <span className="guide-quick-index">{i + 1}</span>
                      <div className="text-sm leading-relaxed">{step}</div>
                    </div>
                  ))}
                </div>
              </section>

              {appStackCards.length > 0 && (
                <section id="app-stack" className="content-shell">
                  <h2 className="text-2xl font-black tracking-tight mt-0 mb-2">
                    {flowLabels.appStack}
                  </h2>
                  <p className="text-ink-2 mb-5">{flowLabels.appStackDesc}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                    {appStackCards.map((app) => (
                      <div key={app.id} className="app-card-real-icon">
                        <Image
                          src={app.icon}
                          alt={app.name[l]}
                          width={64}
                          height={64}
                          className="app-card-icon"
                        />
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold m-0 mb-1">{app.name[l]}</h3>
                          <p className="text-xs text-ink-2 m-0 mb-2 leading-relaxed">{app.purpose[l]}</p>
                          <div className="flex flex-wrap gap-2">
                            <TrackedExternalLink
                              href={app.sourceUrl}
                              lang={l}
                              guideSlug={slug}
                              context="app_official"
                              className="text-xs font-semibold text-accent-2 no-underline hover:text-accent"
                            >
                              {flowLabels.openOfficial}
                            </TrackedExternalLink>
                            <TrackedExternalLink
                              href={app.iosUrl}
                              lang={l}
                              guideSlug={slug}
                              context="app_store"
                              className="text-xs font-semibold text-accent-2 no-underline hover:text-accent"
                            >
                              {flowLabels.openIos}
                            </TrackedExternalLink>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {appDirectoryCategories.length > 0 && (
                <section id="app-directory" className="content-shell">
                  <h2 className="text-2xl font-black tracking-tight mt-0 mb-2">
                    {flowLabels.appDirectory}
                  </h2>
                  <p className="text-ink-2 mb-6">{flowLabels.appDirectoryDesc}</p>
                  <div className="flex flex-col gap-6">
                    {appDirectoryCategories.map((category) => (
                      <div key={category.id}>
                        <h3 className="text-base font-black tracking-tight mt-0 mb-3">
                          {category.title[l]}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                          {category.apps.map((app) => (
                            <div key={app.id} className="app-card-real-icon">
                              <Image
                                src={app.icon}
                                alt={app.name[l]}
                                width={64}
                                height={64}
                                className="app-card-icon"
                              />
                              <div className="min-w-0">
                                <h4 className="text-sm font-bold m-0 mb-1">{app.name[l]}</h4>
                                <p className="text-xs text-ink-2 m-0 mb-2 leading-relaxed">
                                  {app.purpose[l]}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  <TrackedExternalLink
                                    href={app.officialUrl}
                                    lang={l}
                                    guideSlug={slug}
                                    context="app_official"
                                    className="text-xs font-semibold text-accent-2 no-underline hover:text-accent"
                                  >
                                    {flowLabels.openOfficial}
                                  </TrackedExternalLink>
                                  <TrackedExternalLink
                                    href={app.iosUrl}
                                    lang={l}
                                    guideSlug={slug}
                                    context="app_store"
                                    className="text-xs font-semibold text-accent-2 no-underline hover:text-accent"
                                  >
                                    {flowLabels.openIos}
                                  </TrackedExternalLink>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <section id="step-plan" className="content-shell">
                <h2 className="text-2xl font-black tracking-tight mt-0 mb-5">
                  {flowLabels.stepPlan}
                </h2>
                <ol className="guide-timeline-list">
                  {fm.steps.map((step, i) => (
                    <li key={i} className="guide-timeline-item">
                      <span className="guide-timeline-dot">{i + 1}</span>
                      <p className="m-0 text-sm leading-relaxed">{step}</p>
                    </li>
                  ))}
                </ol>
              </section>

              <section id="context" className="content-shell">
                <h2 className="text-2xl font-black tracking-tight mt-0 mb-5">
                  {flowLabels.context}
                </h2>
                <div className="flex flex-col gap-3 mb-6">
                  {fm.facts.map((fact, i) => (
                    <div key={i} className="fact-item text-sm leading-relaxed">
                      {fact}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="glass-tile">
                    <h3 className="text-xs uppercase tracking-[0.1em] text-ink-3 mt-0 mb-2 font-bold">
                      {tr.costs}
                    </h3>
                    <p className="text-sm text-ink-2 m-0">{fm.costs}</p>
                  </div>
                  <div className="glass-tile">
                    <h3 className="text-xs uppercase tracking-[0.1em] text-ink-3 mt-0 mb-2 font-bold">
                      {tr.localNotes}
                    </h3>
                    <p className="text-sm text-ink-2 m-0">{fm.localNotes}</p>
                  </div>
                </div>
              </section>

              {guide.content.trim().length > 0 && (
                <section id="deep-dive" className="content-shell">
                  <h2 className="text-2xl font-black tracking-tight mt-0 mb-5">
                    {flowLabels.deepDive}
                  </h2>
                  <article className="guide-prose">
                    <MDXRemote
                      source={guide.content}
                      options={{
                        mdxOptions: {
                          remarkPlugins: [remarkGfm],
                        },
                      }}
                      components={{
                        a: (props) => (
                          <TrackedExternalLink
                            {...props}
                            href={props.href ?? ""}
                            lang={l}
                            guideSlug={slug}
                            context="guide_body"
                            className="text-accent-2 underline underline-offset-4 hover:text-accent"
                          />
                        ),
                      }}
                    />
                  </article>
                </section>
              )}

              <section id="mistakes" className="content-shell">
                <h2 className="text-2xl font-black tracking-tight mt-0 mb-5">
                  {flowLabels.mistakes}
                </h2>
                <div className="flex flex-col gap-3">
                  {fm.mistakes.map((mistake, i) => (
                    <div key={i} className="mistake-item text-sm">
                      <span className="text-accent font-black text-xs mt-0.5">!</span>
                      <span>{mistake}</span>
                    </div>
                  ))}
                </div>
              </section>

              {fm.offers && fm.offers.length > 0 && (
                <section id="offers" className="content-shell">
                  <h2 className="text-2xl font-black tracking-tight mt-0 mb-5">
                    {flowLabels.offers}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {fm.offers.map((offer, i) => (
                      <TrackedExternalLink
                        key={i}
                        href={offer.url}
                        lang={l}
                        guideSlug={slug}
                        context="guide_offer"
                        sponsored={Boolean(offer.sponsored)}
                        className="glass-card-link p-4 text-sm font-semibold text-accent-2 transition-colors no-underline"
                      >
                        <span>{offer.label}</span>
                        {offer.note && (
                          <span className="block text-ink-3 text-xs mt-1 font-medium">
                            {offer.note}
                          </span>
                        )}
                      </TrackedExternalLink>
                    ))}
                  </div>
                  <p className="text-xs text-ink-3 mt-4">{flowLabels.affiliateDisclosure}</p>
                </section>
              )}

              <section id="sources" className="content-shell">
                <h2 className="text-2xl font-black tracking-tight mt-0 mb-5">
                  {flowLabels.sources}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {fm.sources.map((source, i) => (
                    <TrackedExternalLink
                      key={i}
                      href={source.url}
                      lang={l}
                      guideSlug={slug}
                      context="guide_source"
                      className="glass-card-link p-4 text-sm font-semibold text-accent-2 transition-colors no-underline flex items-center gap-2"
                    >
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <span>{source.label}</span>
                    </TrackedExternalLink>
                  ))}
                </div>
                <p className="text-xs text-ink-3 mt-4 flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-accent-4" />
                  {tr.sourceUpdate}
                </p>
              </section>

              <section id="next" className="content-shell">
                {related.length > 0 && (
                  <>
                    <h2 className="text-xl font-black tracking-tight mt-0 mb-4">
                      {tr.relatedGuides}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                      {related.slice(0, 4).map((g) => (
                        <Link
                          key={g.frontmatter.slug}
                          href={`${base}/guides/${g.frontmatter.pillar}/${g.frontmatter.slug}`}
                          className="glass-card-link p-4 transition-colors no-underline text-ink group"
                        >
                          <span className="font-bold text-sm group-hover:text-accent-2 transition-colors">
                            {g.frontmatter.title}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </>
                )}

                <h2 className="text-2xl font-black tracking-tight mb-3">
                  {tr.continueNext}
                </h2>
                <p className="text-ink-2 mb-6">{tr.continueDesc}</p>
                <div className="flex gap-3 flex-wrap">
                  {isTipGuide ? (
                    <Link href={`${base}/tips`} className="btn btn-secondary">
                      {trTips.backToTips}
                    </Link>
                  ) : (
                    <Link href={`${base}/guides/${pillar}`} className="btn btn-secondary">
                      {tr.backToPillar}
                    </Link>
                  )}
                  <Link href={`${base}/tools`} className="btn btn-primary">
                    Tools
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
