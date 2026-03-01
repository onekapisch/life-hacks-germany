import type { Lang } from "@/lib/i18n";
import { siteConfig } from "@/lib/i18n";

interface JsonLdProps {
  type:
    | "website"
    | "article"
    | "howto"
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
        : "Verifizierte, praktische Hilfe fuer ein gutes Leben in Deutschland.",
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
    logo: `${siteConfig.domain}/icons/logo.svg`,
    email: siteConfig.email,
    publishingPrinciples: `${siteConfig.domain}/en/editorial-standards`,
    contactPoint: {
      "@type": "ContactPoint",
      email: siteConfig.email,
      contactType: "customer service",
    },
  };
}

function getArticleSchema(
  lang: Lang,
  data: Record<string, unknown>
) {
  const image = data.image || `${siteConfig.domain}/icons/logo.svg`;
  const published = data.published || data.updated;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.title,
    description: data.summary,
    datePublished: published,
    dateModified: data.updated,
    image,
    isAccessibleForFree: true,
    author: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.domain,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.domain,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": data.url,
    },
    inLanguage: lang === "en" ? "en-US" : "de-DE",
  };
}

function getHowToSchema(
  lang: Lang,
  data: Record<string, unknown>
) {
  const steps = (data.steps as string[]) || [];
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: data.title,
    description: data.summary,
    step: steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      text: step,
    })),
    ...(data.costs ? { estimatedCost: { "@type": "MonetaryAmount", value: data.costs, currency: "EUR" } } : {}),
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
      schema = getArticleSchema(lang, data);
      break;
    case "howto":
      schema = getHowToSchema(lang, data);
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
