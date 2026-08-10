import type { Metadata } from "next";
import Link from "next/link";
import type { Lang } from "@/lib/i18n";
import { siteConfig } from "@/lib/i18n";
import Breadcrumbs from "@/components/Breadcrumbs";
import GrossNetCalculatorClient from "@/components/GrossNetCalculatorClient";
import { createSocialMetadata } from "@/lib/seo";

const content = {
  en: {
    badge: "Free Tool",
    title: "Germany Gross-Net Salary Calculator 2026",
    subtitle:
      "Estimate your monthly take-home pay after German taxes and social contributions. Compare city-by-city cost of living to see where your salary may go furthest.",
    metaDescription:
      "Free Germany gross-net salary calculator 2026. Calculate your monthly net income after income tax, social insurance, and compare costs in Berlin, Munich, Hamburg, Frankfurt, and Cologne.",
    intro: `
Germany has one of the most comprehensive social insurance systems in the world — and one of the most complex tax structures for newcomers to understand. Your gross salary and your actual take-home pay can differ by 35 to 45 percent depending on your tax class, health insurance choice, and whether you pay church tax.

This calculator walks through all the deductions that affect your net income: pension contributions, unemployment insurance, health insurance, long-term care insurance, and income tax. It also lets you compare how that net income translates into a monthly surplus in two German cities, after accounting for typical costs like rent, transport, groceries, and utilities.

Use this as a planning tool when negotiating a job offer, evaluating a city move, or building your first German budget.
    `,
    taxClassExplainer: `
**German tax classes (Steuerklassen) explained**

Germany assigns every employed resident a tax class that affects how much income tax is withheld from your paycheck:

- **Class I** — Single, no children, standard withholding (most common for unmarried employees)
- **Class II** — Single parent with child allowance (reduced withholding)
- **Class III** — Married, partner in Class V; significantly lower withholding (higher-earning spouse)
- **Class IV** — Married, both partners have similar income; standard withholding for both
- **Class V** — Married, partner in Class III; higher withholding (lower-earning spouse)
- **Class VI** — Second or additional employment; highest withholding rate

When you start your first job in Germany, you are typically assigned Class I. To change your class, submit a request through ELSTER or your local tax office (Finanzamt). Class III/V split is common for married couples where one partner earns significantly more.
    `,
    socialInsuranceExplainer: `
**Germany's four social insurance contributions**

Every employed person in Germany pays four mandatory social insurance contributions from their gross salary. These are shared between employee and employer (you pay half, your employer pays half of the combined rate):

- **Pension insurance (Rentenversicherung):** 18.6% total rate → you pay 9.3%
- **Unemployment insurance (Arbeitslosenversicherung):** 2.6% total → you pay 1.3%
- **Health insurance (Krankenversicherung):** 14.6% base + insurer-specific additional contribution (Zusatzbeitrag) — you pay half
- **Long-term care insurance (Pflegeversicherung):** 3.4% if you have children, 4.4% if childless → you pay half (1.8% or 2.4%)

For 2026, the GKV contribution ceiling is EUR 5,812.50/month — if you earn more, contributions are capped at this income level.
    `,
    faqTitle: "Frequently asked questions",
    faqs: [
      {
        q: "How accurate is this calculator?",
        a: "This calculator uses a simplified model of German income tax and provides orientation-level estimates. The actual tax withheld by your employer is calculated using official government payroll tables and may differ, especially at certain income levels, with special deductions, or with tax prepayments. Use this for planning and job offer comparison, not for official tax filings.",
      },
      {
        q: "What is the Grundfreibetrag (tax-free allowance) in 2026?",
        a: "The Grundfreibetrag is the amount of annual taxable income covered by the basic tax-free allowance. For 2026, it is EUR 12,348. This calculator uses that amount inside a simplified orientation model. Actual payroll withholding can differ.",
      },
      {
        q: "What is the Solidaritätszuschlag (solidarity surcharge)?",
        a: "The solidarity surcharge (Soli) was originally introduced to fund German reunification. As of 2021, it was abolished for most employees. It now only applies if your income tax liability exceeds approximately EUR 18,130 per year — which corresponds to high earners. This calculator includes the Soli only when applicable.",
      },
      {
        q: "How do I find out my actual tax class?",
        a: "Your tax class is shown on your German payslip (Gehaltsabrechnung) under 'Steuerklasse'. If you are newly arrived, you are typically assigned Class I unless you have submitted a change request. You can also check via ELSTER (Germany's official tax portal) or your local Finanzamt.",
      },
      {
        q: "What is the difference between Kaltmiete and Warmmiete?",
        a: "Kaltmiete is the base rent without utilities. Warmmiete (warm rent) includes utilities like heating, water, and building maintenance costs. When budgeting, always plan with Warmmiete. City cost presets in this calculator use Warmmiete estimates.",
      },
      {
        q: "Can I use this calculator for freelancer income?",
        a: "No — this calculator is designed for employees (Arbeitnehmer) who receive a salary and have taxes withheld at source (Lohnsteuer). For freelancers and self-employed people, the tax calculation works differently: you pay taxes in advance (Einkommensteuervorauszahlung) and file an annual return. Use this only for employment income planning.",
      },
    ],
    relatedGuides: "Related guides",
    viewAllTools: "View all tools",
  },
  de: {
    badge: "Kostenloses Tool",
    title: "Brutto-Netto-Rechner Deutschland 2026",
    subtitle:
      "Schätze dein monatliches Nettoeinkommen nach deutschen Steuern und Sozialabgaben. Vergleiche die Lebenshaltungskosten nach Stadt.",
    metaDescription:
      "Kostenloser Brutto-Netto-Rechner für Deutschland 2026. Berechne dein Nettoeinkommen nach Einkommensteuer und Sozialversicherung und vergleiche Kosten in Berlin, München, Hamburg, Frankfurt und Köln.",
    intro: `
Deutschland hat eines der umfassendsten Sozialversicherungssysteme der Welt – und eine der komplexesten Steuerstrukturen für Neuankömmlinge. Dein Bruttogehalt und dein tatsächliches Nettoeinkommen können sich je nach Steuerklasse, Krankenkassenwahl und Kirchensteuerpflicht um 35 bis 45 Prozent unterscheiden.

Dieser Rechner führt durch alle Abzüge, die dein Nettoeinkommen beeinflussen: Rentenbeitrag, Arbeitslosenversicherung, Krankenversicherung, Pflegeversicherung und Einkommensteuer. Außerdem lässt er sich verwenden, um zu vergleichen, wie sich das Nettoeinkommen als monatlicher Überschuss in zwei deutschen Städten darstellt – nach typischen Kosten wie Miete, Transport, Lebensmittel und Nebenkosten.

Nutze diesen Rechner für die Gehaltsverhandlung, einen Stadtvergleich oder deinen ersten deutschen Budgetplan.
    `,
    taxClassExplainer: `
**Deutsche Steuerklassen erklärt**

Jeder beschäftigte Einwohner Deutschlands erhält eine Steuerklasse, die bestimmt, wie viel Lohnsteuer vom Gehalt einbehalten wird:

- **Klasse I** – Ledig, keine Kinder, Standardabzug (häufigste Klasse für unverheiratete Beschäftigte)
- **Klasse II** – Alleinerziehend mit Kinderfreibetrag (reduzierter Abzug)
- **Klasse III** – Verheiratet, Partner in Klasse V; deutlich niedrigerer Abzug (besserverdienender Ehepartner)
- **Klasse IV** – Verheiratet, beide Partner mit ähnlichem Einkommen; Standardabzug für beide
- **Klasse V** – Verheiratet, Partner in Klasse III; höherer Abzug (geringerverdienender Ehepartner)
- **Klasse VI** – Zweites oder weiteres Beschäftigungsverhältnis; höchster Abzug

Wer in Deutschland erstmals beschäftigt wird, erhält in der Regel Klasse I. Änderungsantrag über ELSTER oder das lokale Finanzamt stellen.
    `,
    socialInsuranceExplainer: `
**Deutschlands vier Sozialversicherungsbeiträge**

Alle Beschäftigten zahlen vier Pflichtbeiträge zur Sozialversicherung. Sie werden aufgeteilt zwischen Arbeitnehmer und Arbeitgeber (du zahlst die Hälfte):

- **Rentenversicherung:** 18,6% Gesamtbeitrag → du zahlst 9,3%
- **Arbeitslosenversicherung:** 2,6% Gesamtbeitrag → du zahlst 1,3%
- **Krankenversicherung:** 14,6% Grundbeitrag + kassenspezifscher Zusatzbeitrag – du zahlst die Hälfte
- **Pflegeversicherung:** 3,4% mit Kindern, 4,4% kinderlos → du zahlst die Hälfte (1,8% oder 2,4%)

Für 2026 gilt als GKV-Beitragsbemessungsgrenze EUR 5.812,50/Monat – bei höherem Einkommen werden Beiträge auf dieser Höhe gekappt.
    `,
    faqTitle: "Häufig gestellte Fragen",
    faqs: [
      {
        q: "Wie genau ist dieser Rechner?",
        a: "Dieser Rechner verwendet ein vereinfachtes Modell der deutschen Einkommensteuer und liefert Orientierungsschätzungen. Die tatsächliche Lohnsteuer, die dein Arbeitgeber einbehält, wird nach offiziellen Lohnsteuertabellen berechnet und kann abweichen – insbesondere bei bestimmten Einkommen, Sonderabzügen oder Steuervorauszahlungen. Für Planung und Gehaltsvergleich geeignet, nicht für offizielle Steuererklärungen.",
      },
      {
        q: "Was ist der Grundfreibetrag 2026?",
        a: "Der Grundfreibetrag deckt einen Grundbetrag des jährlich zu versteuernden Einkommens ab. Für 2026 beträgt er EUR 12.348. Der Rechner verwendet diesen Betrag in einem vereinfachten Orientierungsmodell. Der tatsächliche Lohnsteuerabzug kann abweichen.",
      },
      {
        q: "Was ist der Solidaritätszuschlag?",
        a: "Der Solidaritätszuschlag (Soli) wurde ursprünglich zur Finanzierung der deutschen Wiedervereinigung eingeführt. Seit 2021 gilt er für die meisten Arbeitnehmer nicht mehr. Er fällt nur noch an, wenn die Einkommensteuerlast ca. EUR 18.130/Jahr übersteigt – also bei Topverdienenden. Dieser Rechner berücksichtigt den Soli nur bei Zutreffen.",
      },
      {
        q: "Wie finde ich meine tatsächliche Steuerklasse heraus?",
        a: "Die Steuerklasse steht auf der Gehaltsabrechnung unter 'Steuerklasse'. Bei Neuankommenden wird in der Regel Klasse I zugeteilt, solange kein Änderungsantrag gestellt wurde. Prüfbar auch über ELSTER oder das lokale Finanzamt.",
      },
      {
        q: "Was ist der Unterschied zwischen Kaltmiete und Warmmiete?",
        a: "Kaltmiete ist die Grundmiete ohne Nebenkosten. Warmmiete umfasst Heizung, Wasser und Gebäudenebenkosten. Für die Budgetplanung immer mit Warmmiete rechnen. Die Stadtkosten-Presets in diesem Rechner verwenden Warmmiete-Schätzungen.",
      },
      {
        q: "Kann ich diesen Rechner für Freiberufler-Einkommen nutzen?",
        a: "Nein – dieser Rechner ist für Arbeitnehmer ausgelegt, die Lohnsteuer direkt vom Gehalt abführen. Für Freiberufler und Selbstständige funktioniert die Steuerberechnung anders: Einkommensteuervorauszahlungen und jährliche Steuererklärung. Nur für Beschäftigungsplanung geeignet.",
      },
    ],
    relatedGuides: "Verwandte Guides",
    viewAllTools: "Alle Tools anzeigen",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const l = lang as Lang;
  const c = content[l];
  const social = createSocialMetadata({
    title: c.title,
    description: c.metaDescription,
    badge: l === "en" ? "Free Tool" : "Kostenloses Tool",
  });

  return {
    title: c.title,
    description: c.metaDescription,
    alternates: {
      canonical: `${siteConfig.domain}/${lang}/tools/gross-net-salary-calculator`,
      languages: {
        en: `${siteConfig.domain}/en/tools/gross-net-salary-calculator`,
        de: `${siteConfig.domain}/de/tools/gross-net-salary-calculator`,
      },
    },
    ...social,
  };
}

export default async function GrossNetCalculatorPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const l = lang as Lang;
  const c = content[l];
  const base = `/${l}`;

  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: c.title,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    description: c.metaDescription,
    url: `${siteConfig.domain}/${l}/tools/gross-net-salary-calculator`,
    inLanguage: l === "en" ? "en-US" : "de-DE",
    author: { "@type": "Organization", name: siteConfig.name, url: siteConfig.domain },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: c.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }}
      />

      <Breadcrumbs
        lang={l}
        items={[
          { label: l === "en" ? "Tools" : "Tools", href: `${base}/tools` },
          { label: c.title },
        ]}
      />

      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="container-main max-w-4xl mx-auto text-center">
          <span className="badge mb-5">{c.badge}</span>
          <h1 className="text-4xl md:text-5xl font-black leading-[1.05] tracking-tight mb-4">
            {c.title}
          </h1>
          <p className="text-lg text-ink-2 leading-relaxed max-w-2xl mx-auto">{c.subtitle}</p>
        </div>
      </section>

      {/* Intro prose */}
      <section className="pb-8">
        <div className="container-main max-w-3xl mx-auto">
          <div className="content-shell">
            <div className="guide-prose">
              {c.intro.trim().split("\n\n").map((para, i) => (
                <p key={i}>{para.trim()}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section className="pb-8">
        <div className="container-main max-w-5xl mx-auto">
          <GrossNetCalculatorClient lang={l} />
        </div>
      </section>

      {/* Tax class explainer */}
      <section className="pb-8">
        <div className="container-main max-w-3xl mx-auto">
          <div className="content-shell">
            <div className="guide-prose">
              {c.taxClassExplainer.trim().split("\n\n").map((block, i) => {
                if (block.startsWith("**") && block.endsWith("**")) {
                  return <h2 key={i}>{block.replace(/\*\*/g, "")}</h2>;
                }
                if (block.includes("- **")) {
                  return (
                    <ul key={i}>
                      {block.split("\n").filter(Boolean).map((line, j) => (
                        <li key={j} dangerouslySetInnerHTML={{
                          __html: line.replace(/^- /, "").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
                        }} />
                      ))}
                    </ul>
                  );
                }
                return <p key={i}>{block.trim()}</p>;
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Social insurance explainer */}
      <section className="pb-8">
        <div className="container-main max-w-3xl mx-auto">
          <div className="content-shell">
            <div className="guide-prose">
              {c.socialInsuranceExplainer.trim().split("\n\n").map((block, i) => {
                if (block.startsWith("**") && block.endsWith("**")) {
                  return <h2 key={i}>{block.replace(/\*\*/g, "")}</h2>;
                }
                if (block.includes("- **")) {
                  return (
                    <ul key={i}>
                      {block.split("\n").filter(Boolean).map((line, j) => (
                        <li key={j} dangerouslySetInnerHTML={{
                          __html: line.replace(/^- /, "").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
                        }} />
                      ))}
                    </ul>
                  );
                }
                return <p key={i}>{block.trim()}</p>;
              })}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="pb-8">
        <div className="container-main max-w-3xl mx-auto">
          <h2 className="text-2xl font-black tracking-tight mb-6 text-center">{c.faqTitle}</h2>
          <div className="flex flex-col gap-4">
            {c.faqs.map((faq, i) => (
              <div key={i} className="content-shell">
                <h3 className="text-base font-black tracking-tight mt-0 mb-2">{faq.q}</h3>
                <p className="text-sm text-ink-2 leading-relaxed m-0">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related guides */}
      <section className="pb-20">
        <div className="container-main max-w-3xl mx-auto">
          <h2 className="text-xl font-black tracking-tight mb-5 text-center">{c.relatedGuides}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href={`${base}/guides/money-taxes/freelancer-registration`}
              className="card text-center hover:border-accent-3/40 transition-colors"
            >
              <p className="text-sm font-black m-0">
                {l === "en" ? "Freelancer Tax Setup" : "Freiberufler Steuer"}
              </p>
            </Link>
            <Link
              href={`${base}/guides/money-taxes/german-bank-account-comparison`}
              className="card text-center hover:border-accent-3/40 transition-colors"
            >
              <p className="text-sm font-black m-0">
                {l === "en" ? "Bank Account Comparison" : "Girokonto-Vergleich"}
              </p>
            </Link>
            <Link
              href={`${base}/guides/everyday/health-insurance-basics`}
              className="card text-center hover:border-accent-3/40 transition-colors"
            >
              <p className="text-sm font-black m-0">
                {l === "en" ? "Health Insurance Basics" : "Krankenversicherung"}
              </p>
            </Link>
          </div>
          <div className="mt-8 text-center">
            <Link href={`${base}/tools`} className="btn btn-secondary">
              {c.viewAllTools}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
