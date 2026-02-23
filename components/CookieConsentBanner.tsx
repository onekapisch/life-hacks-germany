"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import type { Lang } from "@/lib/i18n";
import {
  COOKIE_CONSENT_CHANGED_EVENT,
  COOKIE_CONSENT_OPEN_EVENT,
  readCookieConsent,
  writeCookieConsent,
} from "@/lib/cookieConsent";

export default function CookieConsentBanner({ lang }: { lang: Lang }) {
  const [forcedOpen, setForcedOpen] = useState(false);

  const copy = useMemo(
    () =>
      lang === "de"
        ? {
            badge: "Datenschutz & Analyse",
            title: "Cookie-Einstellungen",
            body:
              "Wir nutzen optionale Analyse-Cookies (Google Analytics), um Seitenaufrufe und Nutzungsmuster zu verstehen. Notwendige Funktionen laufen auch ohne Zustimmung.",
            accept: "Analyse akzeptieren",
            decline: "Nur notwendige",
            privacy: "Datenschutz ansehen",
          }
        : {
            badge: "Privacy & Analytics",
            title: "Cookie preferences",
            body:
              "We use optional analytics cookies (Google Analytics) to understand page views and usage patterns. Core site features work without this consent.",
            accept: "Accept analytics",
            decline: "Only necessary",
            privacy: "View privacy policy",
          },
    [lang]
  );

  const hasSavedChoice = useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === "undefined") return () => undefined;
      const handleChange = () => onStoreChange();
      window.addEventListener("storage", handleChange);
      window.addEventListener(COOKIE_CONSENT_CHANGED_EVENT, handleChange);
      return () => {
        window.removeEventListener("storage", handleChange);
        window.removeEventListener(COOKIE_CONSENT_CHANGED_EVENT, handleChange);
      };
    },
    () => (typeof window !== "undefined" ? Boolean(readCookieConsent()) : true),
    () => true
  );

  useEffect(() => {
    const onOpen = () => setForcedOpen(true);
    window.addEventListener(COOKIE_CONSENT_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(COOKIE_CONSENT_OPEN_EVENT, onOpen);
  }, []);

  const isVisible = forcedOpen || !hasSavedChoice;
  if (!isVisible) return null;

  const base = `/${lang}`;

  return (
    <div
      className="fixed inset-x-3 bottom-3 z-[70] sm:inset-x-5 sm:bottom-5"
      role="dialog"
      aria-modal="false"
      aria-label={copy.title}
    >
      <div className="cookie-consent-card mx-auto max-w-4xl rounded-2xl p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="flex items-start gap-3">
            <div
              aria-hidden="true"
              className="cookie-consent-orb mt-0.5 h-11 w-11 shrink-0 rounded-xl grid place-items-center"
            >
              <span className="text-lg">◌</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="cookie-consent-badge inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold tracking-[0.12em] uppercase">
                {copy.badge}
              </div>
              <h3 className="mt-2 text-base sm:text-lg font-black tracking-tight leading-tight">
                {copy.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-2">
                {copy.body}{" "}
                <Link
                  href={`${base}/legal/privacy`}
                  className="font-semibold text-accent-2 hover:underline"
                >
                  {copy.privacy}
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2">
            <button
              type="button"
              onClick={() => {
                writeCookieConsent("declined");
                setForcedOpen(false);
              }}
              className="cookie-consent-btn cookie-consent-btn-secondary w-full sm:w-auto"
            >
              {copy.decline}
            </button>

            <button
              type="button"
              onClick={() => {
                writeCookieConsent("accepted");
                setForcedOpen(false);
              }}
              className="cookie-consent-btn cookie-consent-btn-primary w-full sm:w-auto"
            >
              {copy.accept}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
