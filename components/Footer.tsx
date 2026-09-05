import Link from "next/link";
import Image from "next/image";
import type { Lang } from "@/lib/i18n";
import { t, siteConfig } from "@/lib/i18n";
import { getLatestSiteUpdateDate } from "@/lib/siteFreshness";
import CookiePreferencesButton from "@/components/CookiePreferencesButton";
import { withOwnedReferral } from "@/lib/ownedReferral";

export default function Footer({ lang }: { lang: Lang }) {
  const tr = t[lang].footer;
  const base = `/${lang}`;
  const latestVerification = getLatestSiteUpdateDate();
  const studioPortfolioHref = withOwnedReferral(
    "https://www.onekapisch.com/",
    {
      targetProduct: "onekapisch-portfolio",
      surface: "global-footer",
      content: "studio-signature",
    }
  );

  return (
    <footer className="site-footer pt-16 pb-10">
      <div className="container-main">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 footer-grid">
          <div>
            <div className="flex items-center gap-3 font-black tracking-wide text-sm uppercase footer-brand">
              <span className="brand-mark footer-mark w-[28px] h-[28px] rounded-md inline-block" />
              <span>{siteConfig.name}</span>
            </div>
            <a
              href={studioPortfolioHref}
              aria-label="A OneKapisch product — explore the studio"
              className="group mt-3.5 inline-flex min-h-11 items-center gap-2.5 text-[13px] leading-[1.25] text-[#cfbf98] no-underline transition-colors duration-200 hover:text-[#fff2d2] focus-visible:rounded-[3px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d5bb74] focus-visible:ring-offset-2 focus-visible:ring-offset-[#10141c] active:opacity-[.72]"
            >
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-[7px] bg-[#f6ebd2]" aria-hidden="true">
                <Image src="/brand/onekapisch-signature-mark.png" alt="" width={16} height={16} className="h-4 w-4 object-contain" />
              </span>
              <span>A <strong className="font-semibold text-[#f6ebd2]">OneKapisch</strong> product</span>
              <span className="-ml-[5px] text-xs text-[#f6ebd2]/70 transition-transform duration-200 group-hover:translate-x-px group-hover:-translate-y-px motion-reduce:transform-none motion-reduce:transition-none" aria-hidden="true">↗</span>
            </a>
            <p className="mt-3 text-sm leading-relaxed footer-copy">{t[lang].tagline}</p>
            <p className="mt-2 text-xs footer-copy-dim">{tr.madeWith}</p>
          </div>

          <div>
            <h4 className="footer-heading font-bold text-sm uppercase tracking-wide mb-3">
              {tr.explore}
            </h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link href={`${base}/guides`} className="footer-link transition-colors">
                {t[lang].nav.guides}
              </Link>
              <Link href={`${base}/tips`} className="footer-link transition-colors">
                {tr.tips}
              </Link>
              <Link href={`${base}/blog`} className="footer-link transition-colors">
                {tr.blog}
              </Link>
              <Link href={`${base}/offers`} className="footer-link transition-colors">
                {tr.offers}
              </Link>
              <Link href={`${base}/tools`} className="footer-link transition-colors">
                {t[lang].nav.tools}
              </Link>
              <Link
                href={`${base}/editorial-standards`}
                className="footer-link transition-colors"
              >
                {tr.editorialStandards}
              </Link>
              <Link href={`${base}/about`} className="footer-link transition-colors">
                {t[lang].nav.about}
              </Link>
            </div>
          </div>

          <div>
            <h4 className="footer-heading font-bold text-sm uppercase tracking-wide mb-3">
              {tr.legal}
            </h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link
                href={`${base}/legal/privacy`}
                className="footer-link transition-colors"
              >
                {tr.privacy}
              </Link>
              <Link
                href={`${base}/legal/impressum`}
                className="footer-link transition-colors"
              >
                {tr.impressum}
              </Link>
              <CookiePreferencesButton lang={lang} />
            </div>
          </div>

          <div>
            <h4 className="footer-heading font-bold text-sm uppercase tracking-wide mb-3">
              {tr.contact}
            </h4>
            <p className="text-sm footer-copy">{siteConfig.email}</p>
          </div>
        </div>

        <div className="footer-meta mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.name}. {tr.copyright}
          </p>
          <p className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-accent-4 animate-pulse" />
            {t[lang].home.lastVerification}: {latestVerification}
          </p>
        </div>
      </div>
    </footer>
  );
}
