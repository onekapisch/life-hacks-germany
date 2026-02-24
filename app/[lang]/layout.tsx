import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import JsonLd from "@/components/JsonLd";
import Analytics from "@/components/Analytics";
import CookieConsentBanner from "@/components/CookieConsentBanner";
import type { Lang } from "@/lib/i18n";
import { t, siteConfig } from "@/lib/i18n";
import { createSocialMetadata } from "@/lib/seo";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "de" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const l = lang as Lang;
  const tr = t[l];
  const social = createSocialMetadata({
    title: siteConfig.name,
    description: tr.description,
    badge: l === "en" ? "Verified Guides" : "Verifizierte Guides",
  });

  return {
    title: {
      default: `${siteConfig.name} | ${tr.tagline}`,
      template: `%s | ${siteConfig.name}`,
    },
    description: tr.description,
    alternates: {
      canonical: `${siteConfig.domain}/${lang}`,
      languages: {
        en: `${siteConfig.domain}/en`,
        de: `${siteConfig.domain}/de`,
      },
    },
    openGraph: {
      ...social.openGraph,
      url: `${siteConfig.domain}/${lang}`,
      siteName: siteConfig.name,
      locale: lang === "en" ? "en_US" : "de_DE",
      type: "website",
    },
    twitter: social.twitter,
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const l = lang as Lang;

  return (
    <html lang={l} className={`${cormorant.variable} ${manrope.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
  try {
    const stored = localStorage.getItem("lhg-theme");
    const theme = stored === "dark" || stored === "light"
      ? stored
      : "light";
    document.documentElement.dataset.theme = theme;
  } catch (_) {}
})();`,
          }}
        />
        <JsonLd type="website" lang={l} />
        <JsonLd type="organization" lang={l} />
      </head>
      <body>
        <a
          href="#main"
          className="absolute left-[-999px] top-3 bg-ink text-white py-2 px-4 rounded-full z-10 focus:left-4"
        >
          Skip to content
        </a>
        <Header lang={l} />
        <main id="main">{children}</main>
        <Footer lang={l} />
        <ScrollToTop />
        <CookieConsentBanner lang={l} />
        <Analytics />
      </body>
    </html>
  );
}
