import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";
const scriptSrc = ["'self'", "'unsafe-inline'"];
const analyticsProviderRaw = process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER?.trim().toLowerCase();
const ga4MeasurementId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID?.trim() || "G-V4VKJJQHPF";
const analyticsProvider =
  analyticsProviderRaw === "none" || analyticsProviderRaw === "off" || analyticsProviderRaw === "disabled"
    ? null
    : analyticsProviderRaw || (ga4MeasurementId ? "ga4" : null);

function pushOriginIfValid(target: string[], rawUrl?: string) {
  if (!rawUrl) return;
  try {
    const { origin } = new URL(rawUrl);
    if (!target.includes(origin)) {
      target.push(origin);
    }
  } catch {
    // Ignore invalid URLs to avoid breaking startup due to env typos.
  }
}

if (analyticsProvider === "plausible") {
  pushOriginIfValid(
    scriptSrc,
    process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL || "https://plausible.io/js/script.js"
  );
}

if (analyticsProvider === "umami") {
  pushOriginIfValid(scriptSrc, process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL);
}

if (analyticsProvider === "ga4" && ga4MeasurementId) {
  scriptSrc.push("https://www.googletagmanager.com");
}

if (isDev) {
  scriptSrc.push("'unsafe-eval'");
}

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "img-src 'self' data: https:",
  "font-src 'self' data: https://fonts.gstatic.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  `script-src ${scriptSrc.join(" ")}`,
  "connect-src 'self' https:",
  "form-action 'self' mailto:",
].join("; ");

const legacyRedirects = [
  { source: "/facts-de", destination: "/de/editorial-standards" },
  { source: "/en/facts-de", destination: "/de/editorial-standards" },
  { source: "/de/facts-de", destination: "/de/editorial-standards" },
  { source: "/hacks-de", destination: "/de/tips" },
  { source: "/en/hacks-de", destination: "/de/tips" },
  { source: "/de/hacks-de", destination: "/de/tips" },
  { source: "/life-hacks-", destination: "/en/tips" },
  { source: "/en/life-hacks-", destination: "/en/tips" },
  { source: "/de/life-hacks-", destination: "/en/tips" },
];

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: process.cwd(),
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      ...legacyRedirects.map(({ source, destination }) => ({
        source,
        destination,
        permanent: true,
      })),
      {
        source: "/",
        destination: "/en",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
    ];
  },
};

export default nextConfig;
