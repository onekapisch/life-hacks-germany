export type AnalyticsProvider = "plausible" | "umami" | "ga4";

const GA4_FALLBACK_MEASUREMENT_ID = "G-V4VKJJQHPF";

export function getGa4MeasurementId(
  rawValue = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID
): string | null {
  const raw = rawValue?.trim();
  if (raw) return raw;
  return GA4_FALLBACK_MEASUREMENT_ID;
}

export function getAnalyticsProvider(
  rawValue = process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER
): AnalyticsProvider | null {
  const raw = rawValue?.trim().toLowerCase();
  if (raw === "plausible" || raw === "umami" || raw === "ga4") return raw;
  if (raw === "none" || raw === "off" || raw === "disabled") return null;
  if (getGa4MeasurementId()) return "ga4";
  return null;
}

export function getAnalyticsProviderLabel(
  provider = getAnalyticsProvider()
): string | null {
  if (provider === "plausible") return "Plausible";
  if (provider === "umami") return "Umami";
  if (provider === "ga4") return "Google Analytics 4";
  return null;
}

export function analyticsUsesCookies(
  provider = getAnalyticsProvider()
): boolean {
  return provider === "ga4";
}
