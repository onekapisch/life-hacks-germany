import Link from "next/link";
import type { Metadata } from "next";
import type { Lang } from "@/lib/i18n";
import { siteConfig, t } from "@/lib/i18n";
import { formatOfferVerification, getAllOffers, type Offer } from "@/lib/offers";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { createSocialMetadata } from "@/lib/seo";

function getCategoryLabel(lang: Lang, category: Offer["category"]): string {
  const tr = t[lang].offers;

  switch (category) {
    case "food":
      return tr.categoryFood;
    case "groceries":
      return tr.categoryGroceries;
    case "shopping":
      return tr.categoryShopping;
    case "travel":
      return tr.categoryTravel;
    case "family":
      return tr.categoryFamily;
    default:
      return category;
  }
}

function getStatusLabel(lang: Lang, status: Offer["status"]): string {
  return status === "limited"
    ? t[lang].offers.statusLimited
    : t[lang].offers.statusOngoing;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const l = lang as Lang;
  const tr = t[l].offers;
  const social = createSocialMetadata({
    title: tr.title,
    description: tr.subtitle,
    badge: l === "en" ? "Offers" : "Angebote",
  });

  return {
    title: tr.title,
    description: tr.subtitle,
    alternates: {
      canonical: `${siteConfig.domain}/${lang}/offers`,
      languages: {
        en: `${siteConfig.domain}/en/offers`,
        de: `${siteConfig.domain}/de/offers`,
      },
    },
    ...social,
  };
}

export default async function OffersPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const l = lang as Lang;
  const tr = t[l].offers;
  const offers = getAllOffers(l);

  return (
    <>
      <JsonLd
        type="breadcrumb"
        lang={l}
        data={{
          items: [
            { name: l === "en" ? "Home" : "Start", url: `${siteConfig.domain}/${l}` },
            { name: tr.title, url: `${siteConfig.domain}/${l}/offers` },
          ],
        }}
      />
      <JsonLd
        type="itemlist"
        lang={l}
        data={{
          items: offers.map((offer) => ({
            name: `${offer.rank}. ${offer.title}`,
            url: `${siteConfig.domain}/${l}/offers#${offer.id}`,
          })),
        }}
      />

      <Breadcrumbs lang={l} items={[{ label: tr.title }]} />

      <section className="py-16 md:py-20">
        <div className="container-main max-w-5xl mx-auto text-center">
          <span className="badge mb-5">{tr.badge}</span>
          <h1 className="text-4xl md:text-5xl font-black leading-[1.05] tracking-tight mb-4">
            {tr.title}
          </h1>
          <p className="text-lg text-ink-2 max-w-4xl mx-auto mb-8">{tr.subtitle}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="content-shell">
              <p className="text-xs uppercase tracking-[0.1em] text-ink-3 font-bold mt-0 mb-2">
                {tr.introTitle}
              </p>
              <p className="text-sm text-ink-2 m-0">{tr.introBody}</p>
            </div>
            <div className="content-shell md:col-span-2">
              <p className="text-xs uppercase tracking-[0.1em] text-ink-3 font-bold mt-0 mb-3">
                {tr.rankingTitle}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-ink-2">
                <p className="m-0">1. {tr.ranking1}</p>
                <p className="m-0">2. {tr.ranking2}</p>
                <p className="m-0">3. {tr.ranking3}</p>
                <p className="m-0">4. {tr.ranking4}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-main max-w-6xl mx-auto">
          <div className="content-shell mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <p className="m-0 text-sm text-ink-2">{tr.allOffersVerified}</p>
              <p className="m-0 text-sm text-ink-2">{tr.disclaimer}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {offers.map((offer) => (
              <article
                key={offer.id}
                id={offer.id}
                className="content-shell scroll-mt-28 border-[rgba(15,23,42,0.12)]"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="badge-solid">#{offer.rank}</span>
                      <span className="badge">{getCategoryLabel(l, offer.category)}</span>
                      <span className="badge">{getStatusLabel(l, offer.status)}</span>
                    </div>
                    <p className="text-xs uppercase tracking-[0.11em] text-ink-3 font-bold mt-0 mb-2">
                      {offer.brand}
                    </p>
                    <h2 className="text-2xl font-black leading-[1.12] tracking-tight m-0 mb-2">
                      {offer.title}
                    </h2>
                    <p className="text-ink-2 m-0">{offer.summary}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  <div className="glass-card-link p-4 rounded-xl">
                    <p className="text-[0.7rem] uppercase tracking-[0.11em] text-ink-3 font-bold mt-0 mb-2">
                      {tr.verifiedLabel}
                    </p>
                    <p className="m-0 text-sm font-semibold text-ink">
                      {formatOfferVerification(offer.verifiedAt, l)}
                    </p>
                  </div>
                  <div className="glass-card-link p-4 rounded-xl">
                    <p className="text-[0.7rem] uppercase tracking-[0.11em] text-ink-3 font-bold mt-0 mb-2">
                      {tr.benefitLabel}
                    </p>
                    <p className="m-0 text-sm font-semibold text-ink">{offer.benefit}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-[0.7rem] uppercase tracking-[0.11em] text-ink-3 font-bold mt-0 mb-2">
                      {tr.eligibilityLabel}
                    </p>
                    <p className="m-0 text-sm text-ink-2">{offer.eligibility}</p>
                  </div>
                  <div>
                    <p className="text-[0.7rem] uppercase tracking-[0.11em] text-ink-3 font-bold mt-0 mb-2">
                      {tr.whyLabel}
                    </p>
                    <p className="m-0 text-sm text-ink-2">{offer.whyItMatters}</p>
                  </div>
                  <div>
                    <p className="text-[0.7rem] uppercase tracking-[0.11em] text-ink-3 font-bold mt-0 mb-2">
                      {tr.watchoutsLabel}
                    </p>
                    <ul className="m-0 pl-5 text-sm text-ink-2 leading-relaxed space-y-1.5">
                      {offer.watchouts.map((watchout) => (
                        <li key={watchout}>{watchout}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-black/5">
                  <Link
                    href={offer.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                  >
                    {tr.officialLink}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
