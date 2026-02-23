"use client";

declare global {
  interface Window {
    plausible?: (eventName: string, options?: { props?: Record<string, string | number | boolean> }) => void;
    umami?: { track: (eventName: string, data?: Record<string, unknown>) => void };
    gtag?: (...args: unknown[]) => void;
  }
}

type EventProps = Record<string, string | number | boolean>;

export function trackEvent(eventName: string, props: EventProps = {}) {
  if (typeof window === "undefined") return;

  const provider = process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER?.trim().toLowerCase();
  if (!provider) return;

  if (provider === "plausible" && typeof window.plausible === "function") {
    window.plausible(eventName, { props });
    return;
  }

  if (provider === "umami" && window.umami?.track) {
    window.umami.track(eventName, props);
    return;
  }

  if (provider === "ga4" && typeof window.gtag === "function") {
    window.gtag("event", eventName, props);
  }
}
