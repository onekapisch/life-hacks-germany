"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import AnalyticsPageview from "@/components/AnalyticsPageview";
import { COOKIE_CONSENT_CHANGED_EVENT, hasAnalyticsConsent } from "@/lib/cookieConsent";

type AnalyticsProvider = "plausible" | "umami" | "ga4";

function getProvider(): AnalyticsProvider | null {
  const raw = process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER?.trim().toLowerCase();
  if (raw === "plausible" || raw === "umami" || raw === "ga4") return raw;
  return null;
}

export default function Analytics() {
  const provider = getProvider();
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => {
      setEnabled(hasAnalyticsConsent());
      setReady(true);
    };

    sync();

    const onStorage = () => sync();
    const onConsentChanged = () => sync();
    window.addEventListener("storage", onStorage);
    window.addEventListener(COOKIE_CONSENT_CHANGED_EVENT, onConsentChanged);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(COOKIE_CONSENT_CHANGED_EVENT, onConsentChanged);
    };
  }, []);

  if (!provider) return null;
  if (!ready || !enabled) return null;

  if (provider === "plausible") {
    const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN?.trim();
    const scriptSrc = process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL?.trim() || "https://plausible.io/js/script.js";
    if (!domain) return null;

    return (
      <>
        <Script
          defer
          data-domain={domain}
          src={scriptSrc}
          strategy="afterInteractive"
        />
        <AnalyticsPageview provider="plausible" />
      </>
    );
  }

  if (provider === "umami") {
    const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID?.trim();
    const scriptSrc = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL?.trim();
    if (!websiteId || !scriptSrc) return null;

    return (
      <Script
        defer
        data-website-id={websiteId}
        src={scriptSrc}
        strategy="afterInteractive"
      />
    );
  }

  const ga4MeasurementId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID?.trim();
  if (!ga4MeasurementId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${ga4MeasurementId}`}
        strategy="afterInteractive"
      />
      <Script
        id="ga4-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${ga4MeasurementId}', { send_page_view: false });
          `,
        }}
      />
      <AnalyticsPageview provider="ga4" ga4MeasurementId={ga4MeasurementId} />
    </>
  );
}
