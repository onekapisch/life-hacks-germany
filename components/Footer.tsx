import Link from "next/link";
import type { Lang } from "@/lib/i18n";
import { t, siteConfig } from "@/lib/i18n";
import CookiePreferencesButton from "@/components/CookiePreferencesButton";

export default function Footer({ lang }: { lang: Lang }) {
  const tr = t[lang].footer;
  const base = `/${lang}`;

  return (
    <footer className="site-footer pt-16 pb-10">
      <div className="container-main">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 footer-grid">
          <div>
            <div className="flex items-center gap-3 font-black tracking-wide text-sm uppercase footer-brand">
              <span className="brand-mark footer-mark w-[28px] h-[28px] rounded-md inline-block" />
              <span>{siteConfig.name}</span>
            </div>
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
            {t[lang].home.lastVerification}: 2026-02-08
          </p>
        </div>
      </div>
    </footer>
  );
}
