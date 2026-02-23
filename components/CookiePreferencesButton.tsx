"use client";

import type { Lang } from "@/lib/i18n";
import { openCookieConsent } from "@/lib/cookieConsent";

export default function CookiePreferencesButton({ lang }: { lang: Lang }) {
  return (
    <button
      type="button"
      onClick={openCookieConsent}
      className="footer-link transition-colors text-left p-0 bg-transparent border-0 cursor-pointer"
    >
      {lang === "de" ? "Cookie-Einstellungen" : "Cookie settings"}
    </button>
  );
}

