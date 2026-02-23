import type { Metadata } from "next";
import "./globals.css";
import { createOgImageUrl } from "@/lib/seo";

const defaultOgImage = createOgImageUrl({
  title: "Life Hacks Germany",
  subtitle: "Verified guides for living in Germany",
  badge: "Verified Guides",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lifehacksgermany.com"),
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
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
