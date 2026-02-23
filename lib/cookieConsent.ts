"use client";

export type CookieConsentChoice = "accepted" | "declined";

type CookieConsentRecord = {
  choice: CookieConsentChoice;
  updatedAt: string;
};

export const COOKIE_CONSENT_STORAGE_KEY = "lhg-cookie-consent-v1";
export const COOKIE_CONSENT_COOKIE_KEY = "lhg_cookie_consent";
export const COOKIE_CONSENT_CHANGED_EVENT = "lhg-cookie-consent-changed";
export const COOKIE_CONSENT_OPEN_EVENT = "lhg-cookie-consent-open";

export function readCookieConsent(): CookieConsentRecord | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CookieConsentRecord>;
    if (parsed.choice !== "accepted" && parsed.choice !== "declined") return null;
    if (typeof parsed.updatedAt !== "string") return null;
    return {
      choice: parsed.choice,
      updatedAt: parsed.updatedAt,
    };
  } catch {
    return null;
  }
}

export function hasAnalyticsConsent(): boolean {
  return readCookieConsent()?.choice === "accepted";
}

export function writeCookieConsent(choice: CookieConsentChoice): void {
  if (typeof window === "undefined") return;

  const record: CookieConsentRecord = {
    choice,
    updatedAt: new Date().toISOString(),
  };

  try {
    window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(record));
  } catch {
    // Ignore storage write failures; cookie write below still gives best-effort persistence.
  }

  document.cookie = `${COOKIE_CONSENT_COOKIE_KEY}=${choice}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_CHANGED_EVENT, { detail: record }));
}

export function openCookieConsent(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_OPEN_EVENT));
}

