import type { Metadata } from "next";
import "./globals.css";
import { createOgImageUrl, createPublisherMetadata } from "@/lib/seo";

const defaultOgImage = createOgImageUrl({
  title: "Life Hacks Germany",
  subtitle: "Verified guides for living in Germany",
  badge: "Verified Guides",
});

const verification =
  process.env.GOOGLE_SITE_VERIFICATION || process.env.BING_SITE_VERIFICATION
    ? {
        verification: {
          google: process.env.GOOGLE_SITE_VERIFICATION,
          ...(process.env.BING_SITE_VERIFICATION
            ? {
                other: {
                  "msvalidate.01": process.env.BING_SITE_VERIFICATION,
                },
              }
            : {}),
        },
      }
    : {};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.lifehacksgermany.com"),
  title: {
    default: "Life Hacks Germany | Verified Guides for Living in Germany",
    template: "%s | Life Hacks Germany",
  },
  description:
    "Verified, practical guidance for expats, students, and Germans. Step-by-step guides, tools, and checklists built on official sources.",
  openGraph: {
    type: "website",
    siteName: "Life Hacks Germany",
    locale: "en",
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: "Life Hacks Germany",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [defaultOgImage],
  },
  ...createPublisherMetadata(),
  ...verification,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
