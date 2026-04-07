import type { Lang } from "@/lib/i18n";
import { siteConfig } from "@/lib/i18n";

const PUBLISHER = {
  "@type": "Organization",
  name: "Life Hacks Germany",
  url: "https://www.lifehacksgermany.com",
  logo: {
    "@type": "ImageObject",
    url: "https://www.lifehacksgermany.com/icons/logo.svg",
    width: 600,
    height: 60,
  },
};

const DEFAULT_AUTHOR = {
  "@type": "Person",
  name: "Life Hacks Germany Editorial Team",
  url: "https://www.lifehacksgermany.com/en/about",
};

interface JsonLdProps {
  type:
    | "website"
    | "article"
    | "newsarticle"
    | "faq"
    | "breadcrumb"
    | "organization"
    | "itemlist";
  lang: Lang;
  data?: Record<string, unknown>;
}

function getWebsiteSchema(lang: Lang) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.domain,
    description:
      lang === "en"
        ? "Verified, practical guidance for living well in Germany."
        : "Verifizierte, praktische Hilfe für ein gutes Leben in Deutschland.",
    inLanguage: lang === "en" ? "en-US" : "de-DE",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.domain}/${lang}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.domain,
    logo: {
      "@type": "ImageObject",
      url: `${siteConfig.domain}/icons/logo.svg`,
      width: 600,
      height: 60,
    },
    email: siteConfig.email,
    publishingPrinciples: `${siteConfig.domain}/en/editorial-standards`,
    contactPoint: {
      "@type": "ContactPoint",
      email: siteConfig.email,
      contactType: "customer service",
    },
    sameAs: [],
  };
}

function buildEstimatedCost(costs: unknown): Record<string, unknown> | null {
  if (!costs) return null;
  const raw = String(costs).trim();
  // Treat "free", "0", "kostenlos", empty, or "€0" as zero-cost
  if (
    raw === "" ||
    raw === "0" ||
    /^(free|kostenlos|gratis|€\s*0)$/i.test(raw)
  ) {
    return { "@type": "MonetaryAmount", value: 0, currency: "EUR" };
  }
  // Try to parse a numeric value (with optional € prefix or suffix)
  const numeric = parseFloat(raw.replace(/[€,\s]/g, ""));
  if (!Number.isNaN(numeric)) {
    return { "@type": "MonetaryAmount", value: numeric, currency: "EUR" };
  }
  // Prose description — omit rather than emit invalid schema
  return null;
}

function getArticleSchema(
  lang: Lang,
  data: Record<string, unknown>,
  articleType: "Article" | "NewsArticle" = "Article"
) {
  const image = data.image || `${siteConfig.domain}/icons/logo.svg`;
  const published = data.published || data.updated;

  const steps = data.steps as string[] | undefined;
  const hasPart =
    steps && steps.length > 0
      ? steps.map((step, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: `Step ${i + 1}`,
          text: step,
        }))
      : undefined;

  return {
    "@context": "https://schema.org",
    "@type": articleType,
    headline: data.title,
    description: data.summary,
    datePublished: published,
    dateModified: data.updated,
    image,
    isAccessibleForFree: true,
    author: DEFAULT_AUTHOR,
    publisher: PUBLISHER,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": data.url,
    },
    inLanguage: lang === "en" ? "en-US" : "de-DE",
    ...(hasPart ? { hasPart } : {}),
  };
}

function getFaqSchema(data: Record<string, unknown>) {
  const faqs = (data.faqs as { q: string; a: string }[]) || [];
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}

function getBreadcrumbSchema(data: Record<string, unknown>) {
  const items = (data.items as { name: string; url: string }[]) || [];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

function getItemListSchema(data: Record<string, unknown>) {
  const items = (data.items as { name: string; url: string }[]) || [];
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

export default function JsonLd({ type, lang, data = {} }: JsonLdProps) {
  let schema: Record<string, unknown>;

  switch (type) {
    case "website":
      schema = getWebsiteSchema(lang);
      break;
    case "organization":
      schema = getOrganizationSchema();
      break;
    case "article":
      schema = getArticleSchema(lang, data, "Article");
      break;
    case "newsarticle":
      schema = getArticleSchema(lang, data, "NewsArticle");
      break;
    case "faq":
      schema = getFaqSchema(data);
      break;
    case "breadcrumb":
      schema = getBreadcrumbSchema(data);
      break;
    case "itemlist":
      schema = getItemListSchema(data);
      break;
    default:
      schema = {};
  }

  const serialized = JSON.stringify(schema).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serialized }}
    />
  );
}

// Re-export helper for callers that need to build estimatedCost outside this module
export { buildEstimatedCost };
