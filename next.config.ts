import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";
const scriptSrc = ["'self'", "'unsafe-inline'"];
const analyticsProvider = process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER?.trim().toLowerCase();

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

if (analyticsProvider === "ga4") {
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
      {
        source: "/",
        destination: "/en",
        permanent: false,
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
        ],
      },
    ];
  },
};

export default nextConfig;
