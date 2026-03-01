export type AnalyticsProvider = "plausible" | "umami" | "ga4";

export function getAnalyticsProvider(
  rawValue = process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER
): AnalyticsProvider | null {
  const raw = rawValue?.trim().toLowerCase();
  if (raw === "plausible" || raw === "umami" || raw === "ga4") return raw;
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
