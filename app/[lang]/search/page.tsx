import Link from "next/link";
import type { Metadata } from "next";
import type { Lang } from "@/lib/i18n";
import { siteConfig } from "@/lib/i18n";
import { getDefaultSearchItems, searchSite, type SearchKind } from "@/lib/search";
import Breadcrumbs from "@/components/Breadcrumbs";
import { createSocialMetadata } from "@/lib/seo";

function normalizeQuery(raw?: string): string {
  if (!raw) return "";
  return raw.trim().replace(/\s+/g, " ");
}

function kindLabel(lang: Lang, kind: SearchKind): string {
  if (lang === "de") {
    if (kind === "guide") return "Guide";
    if (kind === "blog") return "Blog-Update";
    if (kind === "tool") return "Tool";
    if (kind === "pillar") return "Bereich";
    return "Seite";
  }
  if (kind === "guide") return "Guide";
  if (kind === "blog") return "Blog update";
  if (kind === "tool") return "Tool";
  if (kind === "pillar") return "Pillar";
  return "Page";
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const l = lang as Lang;
  const { q } = await searchParams;
  const normalizedQuery = normalizeQuery(q);
  const title = normalizedQuery
    ? l === "en"
      ? `Search results for "${normalizedQuery}"`
      : `Suchergebnisse fuer "${normalizedQuery}"`
    : l === "en"
      ? "Search"
      : "Suche";
  const description = l === "en"
    ? "Search verified guides for living in Germany."
    : "Suche in verifizierten Guides fuer das Leben in Deutschland.";
  const social = createSocialMetadata({
    title,
    description,
    badge: l === "en" ? "Search" : "Suche",
  });

  return {
    title,
    description,
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical: `${siteConfig.domain}/${lang}/search${normalizedQuery ? `?q=${encodeURIComponent(normalizedQuery)}` : ""}`,
      languages: {
        en: `${siteConfig.domain}/en/search${normalizedQuery ? `?q=${encodeURIComponent(normalizedQuery)}` : ""}`,
        de: `${siteConfig.domain}/de/search${normalizedQuery ? `?q=${encodeURIComponent(normalizedQuery)}` : ""}`,
      },
    },
    ...social,
  };
}

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { lang } = await params;
  const l = lang as Lang;
  const base = `/${l}`;
  const { q } = await searchParams;
  const normalizedQuery = normalizeQuery(q);
  const hasQuery = normalizedQuery.length > 0;

  const results = hasQuery
    ? searchSite(l, normalizedQuery, 50)
    : getDefaultSearchItems(l, 12);

  const heading = l === "en" ? "Search guides" : "Guides durchsuchen";
  const subtitle = l === "en"
    ? "Search across guides, tips, tools, pages, and monthly Germany updates."
    : "Suche ueber Guides, Tipps, Tools, Seiten und monatliche Deutschland-Updates.";

  return (
    <>
      <Breadcrumbs
        lang={l}
        items={[
          { label: heading },
        ]}
      />

      <section className="py-14 md:py-20">
        <div className="container-main max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3">{heading}</h1>
          <p className="text-ink-2 mb-6">{subtitle}</p>

          <form action={`${base}/search`} method="get" className="flex flex-col sm:flex-row gap-2 mb-8">
            <input
              type="text"
              name="q"
              defaultValue={normalizedQuery}
              placeholder={l === "en" ? "Try: tax return, anmeldung, deutschlandticket..." : "Z. B. steuererklaerung, anmeldung, deutschlandticket..."}
              className="w-full rounded-lg border border-[rgba(15,23,42,0.15)] bg-paper px-3.5 py-2.5 text-sm text-ink outline-none focus:border-accent-2"
            />
            <button type="submit" className="btn btn-primary whitespace-nowrap">
              {l === "en" ? "Search" : "Suchen"}
            </button>
          </form>

          <div className="content-shell">
            {!hasQuery ? (
              <p className="text-sm text-ink-3 mt-0 mb-4">
                {l === "en" ? "Quick links" : "Schnellzugriff"}
              </p>
            ) : (
              <p className="text-sm text-ink-3 mt-0 mb-4">
                {results.length} {l === "en" ? "result(s)" : "Ergebnis(se)"} {l === "en" ? "for" : "fuer"} &quot;{normalizedQuery}&quot;
              </p>
            )}

            {results.length === 0 ? (
              <div className="notice text-sm">
                {l === "en"
                  ? "No matches found. Try broader keywords."
                  : "Keine Treffer gefunden. Versuche allgemeinere Begriffe."}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {results.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="glass-card-link p-4 no-underline text-ink"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[0.65rem] uppercase tracking-[0.1em] text-ink-3 font-bold">
                        {kindLabel(l, item.kind)}
                      </span>
                    </div>
                    <h2 className="text-base font-bold m-0 mb-1">{item.title}</h2>
                    <p className="text-sm text-ink-2 m-0">{item.summary}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
