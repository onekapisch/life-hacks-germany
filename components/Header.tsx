"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Lang } from "@/lib/i18n";
import { t, siteConfig, languages } from "@/lib/i18n";
import ThemeToggle from "@/components/ThemeToggle";
import SearchModal from "@/components/SearchModal";

export default function Header({ lang }: { lang: Lang }) {
  const pathname = usePathname();
  const tr = t[lang].nav;
  const base = `/${lang}`;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navItems = [
    { label: tr.home, href: `${base}`, match: `${base}` },
    { label: tr.startHere, href: `${base}/start-here`, match: `${base}/start-here` },
    { label: tr.guides, href: `${base}/guides`, match: `${base}/guides` },
    { label: tr.tips, href: `${base}/tips`, match: `${base}/tips` },
    { label: tr.blog, href: `${base}/blog`, match: `${base}/blog` },
    { label: tr.tools, href: `${base}/tools`, match: `${base}/tools` },
    { label: tr.about, href: `${base}/about`, match: `${base}/about` },
  ];

  const altLang = lang === "en" ? "de" : "en";
  const altPath = pathname.replace(`/${lang}`, `/${altLang}`);

  const isActive = (match: string) => {
    if (match === base) return pathname === match || pathname === match + "/";
    return pathname === match || pathname.startsWith(match + "/");
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <>
      <header className="site-header gradient-border-top">
        <div className="container-main">
          <div className="flex items-center justify-between py-3 gap-4">
            <Link
              href={base}
              className="header-brand-link flex items-center gap-2.5 font-black tracking-wide text-lg uppercase no-underline shrink-0"
            >
              <span className="brand-mark w-[30px] h-[30px] rounded-md inline-block" />
              <span className="hidden sm:inline text-base">{siteConfig.name}</span>
              <span className="sm:hidden text-base">LHG</span>
            </Link>

            <nav className="hidden lg:flex gap-1 text-[0.8rem] font-medium">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-pill no-underline ${isActive(item.match) ? "nav-pill-active" : ""}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="header-search-btn flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer"
                aria-label="Search"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="hidden md:inline text-xs">Search</span>
                <kbd className="header-hotkey hidden md:inline text-[0.6rem] px-1.5 py-0.5 rounded font-mono">{"\u2318"}K</kbd>
              </button>

              <ThemeToggle lang={lang} />

              <div className="lang-switch">
                {(Object.entries(languages) as [Lang, { label: string }][]).map(
                  ([code, data]) => {
                    const isCurrent = code === lang;
                    const href = code === lang ? pathname : altPath;
                    return (
                      <Link
                        key={code}
                        href={href}
                        aria-current={isCurrent ? "page" : undefined}
                        aria-label={data.label}
                        title={data.label}
                        className={`lang-pill no-underline ${isCurrent ? "lang-pill-active" : ""}`}
                      >
                        {code.toUpperCase()}
                      </Link>
                    );
                  }
                )}
              </div>

              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="header-mobile-btn lg:hidden flex items-center justify-center w-9 h-9 rounded-lg transition-colors cursor-pointer"
                aria-label="Open menu"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div className={`mobile-menu-overlay ${mobileOpen ? "open" : ""}`} onClick={closeMobile} />
      <div className={`mobile-menu-drawer ${mobileOpen ? "open" : ""}`}>
        <div className="mobile-drawer-head flex items-center justify-between p-4">
          <span className="font-bold text-sm uppercase tracking-wide">{siteConfig.name}</span>
          <button
            type="button"
            onClick={closeMobile}
            className="mobile-close-btn w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="p-4 flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMobile}
              className={`mobile-nav-link block px-4 py-3 rounded-lg text-sm font-medium no-underline transition-colors ${
                isActive(item.match)
                  ? "mobile-nav-link-active font-bold"
                  : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mobile-drawer-footer px-4 pt-2 pb-4 mt-2">
          <div className="flex items-center gap-3">
            <ThemeToggle lang={lang} />
            <div className="lang-switch">
              {(Object.entries(languages) as [Lang, { label: string }][]).map(
                ([code, data]) => {
                  const isCurrent = code === lang;
                  const href = code === lang ? pathname : altPath;
                  return (
                    <Link
                      key={code}
                      href={href}
                      onClick={closeMobile}
                      aria-current={isCurrent ? "page" : undefined}
                      aria-label={data.label}
                      title={data.label}
                      className={`lang-pill no-underline ${isCurrent ? "lang-pill-active" : ""}`}
                    >
                      {code.toUpperCase()}
                    </Link>
                  );
                }
              )}
            </div>
          </div>
        </div>
      </div>

      {searchOpen && <SearchModal lang={lang} onClose={() => setSearchOpen(false)} />}
    </>
  );
}
