"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import {
  analyticsUsesCookies,
  getAnalyticsProvider,
  getAnalyticsProviderLabel,
} from "@/lib/analyticsConfig";
import type { Lang } from "@/lib/i18n";
import {
  COOKIE_CONSENT_CHANGED_EVENT,
  COOKIE_CONSENT_OPEN_EVENT,
  readCookieConsent,
  writeCookieConsent,
} from "@/lib/cookieConsent";

export default function CookieConsentBanner({ lang }: { lang: Lang }) {
  const [forcedOpen, setForcedOpen] = useState(false);
  const provider = getAnalyticsProvider();
  const providerLabel = getAnalyticsProviderLabel(provider);
  const usesCookies = analyticsUsesCookies(provider);

  const copy = useMemo(
    () =>
      lang === "de"
        ? {
            badge: "Datenschutz & Analyse",
            title: "Cookie-Einstellungen",
            body:
              `Wir nutzen optionale ${
                usesCookies ? "Analyse-Cookies" : "Analyse-Skripte"
              }${providerLabel ? ` (${providerLabel})` : ""}, um Seitenaufrufe und Nutzungsmuster zu verstehen. Diese werden erst nach deiner Zustimmung geladen.`,
            accept: "Analyse akzeptieren",
            decline: "Nur notwendige",
            privacy: "Datenschutz ansehen",
          }
        : {
            badge: "Privacy & Analytics",
            title: "Cookie preferences",
            body:
              `We use optional ${
                usesCookies ? "analytics cookies" : "analytics scripts"
              }${providerLabel ? ` (${providerLabel})` : ""} to understand page views and usage patterns. They load only after you accept.`,
            accept: "Accept analytics",
            decline: "Only necessary",
            privacy: "View privacy policy",
          },
    [lang, providerLabel, usesCookies]
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

  if (!provider) return null;

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
      <div className="cookie-consent-card mx-auto max-w-4xl rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <p className="min-w-0 flex-1 text-xs sm:text-sm leading-snug text-ink-2">
            <span className="font-semibold text-ink">{copy.title}: </span>
            {copy.body}{" "}
            <Link
              href={`${base}/legal/privacy`}
              className="font-semibold text-accent-2 hover:underline"
            >
              {copy.privacy}
            </Link>
            .
          </p>

          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                writeCookieConsent("declined");
                setForcedOpen(false);
              }}
              className="cookie-consent-btn cookie-consent-btn-secondary"
            >
              {copy.decline}
            </button>

            <button
              type="button"
              onClick={() => {
                writeCookieConsent("accepted");
                setForcedOpen(false);
              }}
              className="cookie-consent-btn cookie-consent-btn-primary"
            >
              {copy.accept}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
