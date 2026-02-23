import Link from "next/link";
import type { Metadata } from "next";
import type { Lang } from "@/lib/i18n";
import { siteConfig } from "@/lib/i18n";
import Breadcrumbs from "@/components/Breadcrumbs";
import { createSocialMetadata } from "@/lib/seo";

const impressumContent = {
  title: "Impressum",
  company: "Aeon GbR",
  representatives: "vertretungsberechtigte Gesellschafter: Sophia Schmieder & Kapish Bhardwaj",
  address: ["Brünnleinsweg 126", "90768 Fürth", "Deutschland"],
  email: "golifehacks@gmx.de",
  odrGerman: [
    "Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit, die Sie hier finden:",
    "Zur Teilnahme an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle sind wir nicht verpflichtet und nicht bereit.",
  ],
  odrEnglish: [
    "The European Commission provides for an Online Dispute Resolution Platform, which you can access here:",
    "Please see the following link for the nationally appointed Alternative Dispute Resolution bodies contact details:",
  ],
  links: {
    odr: "https://ec.europa.eu/consumers/odr/",
    adr: "https://ec.europa.eu/consumers/odr/main/?event=main.adr.show",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const l = lang as Lang;
  const social = createSocialMetadata({
    title: impressumContent.title,
    description:
      l === "en"
        ? "Legal disclosure and contact details for Life Hacks Germany."
        : "Rechtliche Angaben und Kontaktdaten fuer Life Hacks Germany.",
    badge: l === "en" ? "Legal" : "Rechtliches",
  });

  return {
    title: impressumContent.title,
    alternates: {
      canonical: `${siteConfig.domain}/${lang}/legal/impressum`,
      languages: {
        en: `${siteConfig.domain}/en/legal/impressum`,
        de: `${siteConfig.domain}/de/legal/impressum`,
      },
    },
    ...social,
  };
}

export default async function ImpressumPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const l = lang as Lang;
  const tr = impressumContent;

  return (
    <>
      <Breadcrumbs
        lang={l}
        items={[
          { label: l === "en" ? "Legal" : "Rechtliches", href: undefined },
          { label: tr.title },
        ]}
      />

      <section className="py-16 md:py-24">
        <div className="container-main max-w-3xl mx-auto">
          <h1 className="text-4xl font-black tracking-tight mb-6">{tr.title}</h1>

          <div className="content-shell flex flex-col gap-4">
            <p className="text-ink text-lg font-black m-0">{tr.company}</p>
            <p className="text-ink-2 leading-relaxed m-0">{tr.representatives}</p>
            {tr.address.map((line) => (
              <p key={line} className="text-ink-2 leading-relaxed m-0">
                {line}
              </p>
            ))}

            <p className="text-ink-2 leading-relaxed m-0">
              Mail:{" "}
              <a href={`mailto:${tr.email}`} className="text-accent-2 font-semibold hover:underline">
                {tr.email}
              </a>
            </p>

            <h2 className="text-lg font-black tracking-tight mt-4 mb-0">
              {l === "en" ? "Dispute resolution (DE)" : "Streitbeilegung"}
            </h2>
            <p className="text-ink-2 leading-relaxed m-0">{tr.odrGerman[0]}</p>
            <p className="m-0">
              <Link
                href={tr.links.odr}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-2 font-semibold hover:underline break-all"
              >
                {tr.links.odr}
              </Link>
            </p>
            <p className="text-ink-2 leading-relaxed m-0">{tr.odrGerman[1]}</p>

            <h2 className="text-lg font-black tracking-tight mt-4 mb-0">
              {l === "en" ? "Dispute resolution (EN)" : "Streitbeilegung (EN)"}
            </h2>
            <p className="text-ink-2 leading-relaxed m-0">{tr.odrEnglish[0]}</p>
            <p className="m-0">
              <Link
                href={tr.links.odr}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-2 font-semibold hover:underline break-all"
              >
                {tr.links.odr}
              </Link>
            </p>
            <p className="text-ink-2 leading-relaxed m-0">{tr.odrEnglish[1]}</p>
            <p className="m-0">
              <Link
                href={tr.links.adr}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-2 font-semibold hover:underline break-all"
              >
                {tr.links.adr}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
