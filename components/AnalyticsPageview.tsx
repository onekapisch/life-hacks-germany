"use client";

import { useEffect } from "react";
import { useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

type AnalyticsProvider = "plausible" | "umami" | "ga4";

declare global {
  interface Window {
    plausible?: (eventName: string, options?: { props?: Record<string, string | number | boolean> }) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

export default function AnalyticsPageview({
  provider,
  ga4MeasurementId,
}: {
  provider: AnalyticsProvider;
  ga4MeasurementId?: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const didRunOnce = useRef(false);
  const lastGa4PathRef = useRef<string | null>(null);

  useEffect(() => {
    const query = searchParams.toString();
    const pathWithQuery = query ? `${pathname}?${query}` : pathname;

    if (provider === "plausible" && typeof window.plausible === "function") {
      if (!didRunOnce.current) {
        didRunOnce.current = true;
        return;
      }
      window.plausible("pageview");
      return;
    }

    if (provider === "ga4" && ga4MeasurementId && typeof window.gtag === "function") {
      if (lastGa4PathRef.current === pathWithQuery) return;
      window.gtag("event", "page_view", {
        page_path: pathWithQuery,
        page_location: window.location.href,
        send_to: ga4MeasurementId,
      });
      lastGa4PathRef.current = pathWithQuery;
      return;
    }

    if (provider === "ga4" && ga4MeasurementId) {
      let attempts = 0;
      const maxAttempts = 20;
      const intervalId = window.setInterval(() => {
        attempts += 1;

        if (typeof window.gtag === "function") {
          if (lastGa4PathRef.current !== pathWithQuery) {
            window.gtag("event", "page_view", {
              page_path: pathWithQuery,
              page_location: window.location.href,
              send_to: ga4MeasurementId,
            });
            lastGa4PathRef.current = pathWithQuery;
          }
          window.clearInterval(intervalId);
          return;
        }

        if (attempts >= maxAttempts) {
          window.clearInterval(intervalId);
        }
      }, 150);

      return () => window.clearInterval(intervalId);
    }
  }, [ga4MeasurementId, pathname, provider, searchParams]);

  return null;
}
