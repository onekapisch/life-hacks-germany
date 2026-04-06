import type { Metadata } from "next";
import type { Lang } from "@/lib/i18n";
import { siteConfig } from "@/lib/i18n";
import Breadcrumbs from "@/components/Breadcrumbs";
import { createSocialMetadata } from "@/lib/seo";

const businessAddress = ["Brünnleinsweg 126", "90768 Fürth", "Deutschland"];

function getImpressumContent(lang: Lang) {
  return {
    title: lang === "en" ? "Legal Notice (Impressum)" : "Impressum",
    intro:
      lang === "en"
        ? "Information pursuant to Section 5 DDG."
        : "Angaben gemäß Section 5 DDG.",
    company: "Aeon GbR",
    representatives:
      lang === "en"
        ? "Represented by the managing partners Sophia Schmieder and Kapish Bhardwaj."
        : "Vertreten durch die Gesellschafter Sophia Schmieder und Kapish Bhardwaj.",
    editorial:
      lang === "en"
        ? "Responsible for editorial content pursuant to Section 18(2) MStV: Sophia Schmieder and Kapish Bhardwaj, address as above."
        : "Verantwortlich für journalistisch-redaktionelle Inhalte gemäß Section 18(2) MStV: Sophia Schmieder und Kapish Bhardwaj, Anschrift wie oben.",
    disputeHeading:
      lang === "en"
        ? "Consumer dispute resolution"
        : "Verbraucherstreitbeilegung",
    disputeParagraphs:
      lang === "en"
        ? [
            "We are neither obliged nor willing to participate in dispute resolution proceedings before a consumer arbitration board.",
            "The former EU Online Dispute Resolution platform was discontinued on July 20, 2025.",
          ]
        : [
            "Wir sind weder verpflichtet noch bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.",
            "Die frühere EU-Online-Streitbeilegungsplattform wurde am 20. Juli 2025 eingestellt.",
          ],
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const l = lang as Lang;
  const content = getImpressumContent(l);
  const social = createSocialMetadata({
    title: content.title,
    description:
      l === "en"
        ? "Legal disclosure and contact details for Life Hacks Germany."
        : "Rechtliche Angaben und Kontaktdaten für Life Hacks Germany.",
    badge: l === "en" ? "Legal" : "Rechtliches",
  });

  return {
    title: content.title,
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
  const content = getImpressumContent(l);

  return (
    <>
      <Breadcrumbs
        lang={l}
        items={[
          { label: l === "en" ? "Legal" : "Rechtliches", href: undefined },
          { label: content.title },
        ]}
      />

      <section className="py-16 md:py-24">
        <div className="container-main max-w-3xl mx-auto">
          <h1 className="text-4xl font-black tracking-tight mb-3">{content.title}</h1>
          <p className="text-sm text-ink-3 mb-6">{content.intro}</p>

          <div className="content-shell flex flex-col gap-4">
            <p className="text-ink text-lg font-black m-0">{content.company}</p>
            <p className="text-ink-2 leading-relaxed m-0">{content.representatives}</p>
            {businessAddress.map((line) => (
              <p key={line} className="text-ink-2 leading-relaxed m-0">
                {line}
              </p>
            ))}

            <p className="text-ink-2 leading-relaxed m-0">
              E-Mail:{" "}
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-accent-2 font-semibold hover:underline"
              >
                {siteConfig.email}
              </a>
            </p>

            <p className="text-ink-2 leading-relaxed m-0">{content.editorial}</p>

            <h2 className="text-lg font-black tracking-tight mt-4 mb-0">
              {content.disputeHeading}
            </h2>
            {content.disputeParagraphs.map((paragraph) => (
              <p key={paragraph} className="text-ink-2 leading-relaxed m-0">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
