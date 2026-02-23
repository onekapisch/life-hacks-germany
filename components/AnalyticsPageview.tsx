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
      window.gtag("config", ga4MeasurementId, {
        page_path: pathWithQuery,
        page_location: window.location.href,
      });
    }
  }, [ga4MeasurementId, pathname, provider, searchParams]);

  return null;
}
