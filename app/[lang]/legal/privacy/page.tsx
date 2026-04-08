import type { Metadata } from "next";
import type { Lang } from "@/lib/i18n";
import { siteConfig } from "@/lib/i18n";
import {
  analyticsUsesCookies,
  getAnalyticsProvider,
  getAnalyticsProviderLabel,
} from "@/lib/analyticsConfig";
import Breadcrumbs from "@/components/Breadcrumbs";
import { createSocialMetadata } from "@/lib/seo";

type PrivacySection = {
  heading: string;
  paragraphs: string[];
  list?: string[];
};

function getPrivacyContent(lang: Lang) {
  const provider = getAnalyticsProvider();
  const providerLabel = getAnalyticsProviderLabel(provider);
  const usesCookies = analyticsUsesCookies(provider);

  const analyticsSection: PrivacySection =
    provider === "ga4"
      ? {
          heading:
            lang === "en" ? "Optional analytics" : "Optionale Webanalyse",
          paragraphs:
            lang === "en"
              ? [
                  "We currently use Google Analytics 4 only after you actively consent via the cookie banner or footer preferences link. Before consent, the analytics script is not loaded.",
                  "If you consent, Google may process page-view, device, browser, and approximate location data and may use cookies or similar technologies on your device. Legal basis: Article 6(1)(a) GDPR together with Section 25(1) TDDDG.",
                  "Google Analytics can involve processing outside the EEA. We rely on Google's current contractual and transfer mechanisms where required. You can withdraw consent at any time via the cookie preferences button in the footer.",
                ]
              : [
                  "Wir nutzen derzeit Google Analytics 4 nur dann, wenn du im Cookie-Banner oder über die Cookie-Einstellungen aktiv zustimmst. Vor der Zustimmung wird das Analyse-Skript nicht geladen.",
                  "Bei Zustimmung kann Google Seitenaufrufe, Geräte-, Browser- und ungefähre Standortdaten verarbeiten und dabei Cookies oder ähnliche Technologien auf deinem Gerät verwenden. Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO in Verbindung mit Section 25(1) TDDDG.",
                  "Bei Google Analytics kann es zu Verarbeitungen außerhalb des EWR kommen. Soweit erforderlich, stützen wir uns auf die aktuellen Vertrags- und Transfermechanismen von Google. Deine Zustimmung kannst du jederzeit über die Cookie-Einstellungen im Footer widerrufen.",
                ],
        }
      : provider
        ? {
            heading:
              lang === "en" ? "Optional analytics" : "Optionale Webanalyse",
            paragraphs:
              lang === "en"
                ? [
                    `We currently use ${providerLabel} only after you actively consent. Before consent, the analytics script is not loaded.`,
                    `If you consent, ${providerLabel} may process the page-view, browser, and device data needed for aggregate usage measurement.${usesCookies ? " Cookies or similar technologies may be used on your device." : ""} Legal basis: Article 6(1)(a) GDPR together with Section 25 TDDDG where device access is required.`,
                  ]
                : [
                    `Wir nutzen derzeit ${providerLabel} nur nach aktiver Zustimmung. Vor der Zustimmung wird das Analyse-Skript nicht geladen.`,
                    `Bei Zustimmung kann ${providerLabel} die für aggregierte Nutzungsstatistiken erforderlichen Seitenaufrufs-, Browser- und Gerätedaten verarbeiten.${usesCookies ? " Dabei können Cookies oder ähnliche Technologien auf deinem Gerät eingesetzt werden." : ""} Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO in Verbindung mit Section 25 TDDDG, soweit ein Zugriff auf dein Endgerät erforderlich ist.`,
                  ],
          }
        : {
            heading: lang === "en" ? "Optional analytics" : "Optionale Webanalyse",
            paragraphs:
              lang === "en"
                ? [
                    "We do not currently load any optional analytics tool on the live site. If this changes, this policy will be updated before rollout.",
                  ]
                : [
                    "Wir laden auf der Live-Seite derzeit kein optionales Analyse-Tool. Falls sich das ändert, aktualisieren wir diese Datenschutzerklärung vor dem Rollout.",
                  ],
          };

  return {
    title: lang === "en" ? "Privacy Policy" : "Datenschutzerklärung",
    intro:
      lang === "en"
        ? [
            "This policy describes what personal data Life Hacks Germany processes in its current launch state.",
            "Life Hacks Germany is an editorial content website. We do not offer user accounts, checkout, or public comments on the live site at this time.",
          ]
        : [
            "Diese Erklärung beschreibt, welche personenbezogenen Daten Life Hacks Germany im aktuellen Launch-Zustand verarbeitet.",
            "Life Hacks Germany ist eine redaktionelle Inhaltsseite. Auf der Live-Seite bieten wir derzeit keine Nutzerkonten, keinen Checkout und keine öffentlichen Kommentare an.",
          ],
    sections: [
      {
        heading:
          lang === "en" ? "Controller and contact" : "Verantwortlicher und Kontakt",
        paragraphs:
          lang === "en"
            ? [
                `Controller: Aeon GbR, Brünnleinsweg 126, 90768 Fürth, Germany. Email: ${siteConfig.email}.`,
              ]
            : [
                `Verantwortlicher: Aeon GbR, Brünnleinsweg 126, 90768 Fürth, Deutschland. E-Mail: ${siteConfig.email}.`,
              ],
      },
      {
        heading:
          lang === "en"
            ? "Technical server and hosting data"
            : "Technische Server- und Hostingdaten",
        paragraphs:
          lang === "en"
            ? [
                "When you visit the site, our hosting and delivery infrastructure necessarily processes technical request data such as IP address, date and time, requested URL, referrer, status code, and user-agent information.",
                "We use this data to deliver the site securely, defend against abuse, and troubleshoot incidents. Legal basis: Article 6(1)(f) GDPR.",
              ]
            : [
                "Beim Aufruf der Seite verarbeitet unsere Hosting- und Auslieferungsinfrastruktur technisch notwendige Request-Daten wie IP-Adresse, Datum und Uhrzeit, aufgerufene URL, Referrer, Statuscode und User-Agent.",
                "Wir nutzen diese Daten, um die Seite sicher bereitzustellen, Missbrauch abzuwehren und Störungen zu analysieren. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO.",
              ],
      },
      {
        heading:
          lang === "en"
            ? "Local settings stored on your device"
            : "Lokale Einstellungen auf deinem Gerät",
        paragraphs:
          lang === "en"
            ? [
                "We store your theme preference in localStorage (`lhg-theme`) so the site can remember light or dark mode.",
                "We also store your analytics preference in localStorage (`lhg-cookie-consent-v1`) and in a cookie (`lhg_cookie_consent`) so we can remember whether optional analytics may load. Legal basis: Article 6(1)(f) GDPR for preference persistence and Article 6(1)(a) GDPR where the consent choice controls optional analytics.",
              ]
            : [
                "Wir speichern deine Theme-Auswahl in localStorage (`lhg-theme`), damit die Seite den Light- oder Dark-Mode merken kann.",
                "Außerdem speichern wir deine Analyse-Einstellung in localStorage (`lhg-cookie-consent-v1`) und in einem Cookie (`lhg_cookie_consent`), damit wir merken können, ob optionale Analyse geladen werden darf. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO für die Speicherung von Präferenzen sowie Art. 6 Abs. 1 lit. a DSGVO, soweit die Einwilligung optionale Analyse steuert.",
              ],
      },
      analyticsSection,
      {
        heading:
          lang === "en"
            ? "Mobility tool data providers"
            : "Datenanbieter der Mobilitäts-Tools",
        paragraphs:
          lang === "en"
            ? [
                "Some tools on this site use live third-party data to return station, journey, fare, and weather information.",
                "The mobility tools currently use transport.rest (`v6.db.transport.rest`) for station and journey data and Open-Meteo (`api.open-meteo.com`) for weather forecast data.",
                "When you use these tools, our server sends the request data needed to retrieve the result you asked for, such as station names, station IDs, travel date and time, and route parameters. These providers may also receive technical request data from our server infrastructure that is needed to deliver their response.",
                "We use these providers only to generate the mobility results you request. Legal basis: Article 6(1)(b) GDPR where the request is necessary to provide the tool output you asked for, or Article 6(1)(f) GDPR for the reliable operation of the site’s utility features.",
              ]
            : [
                "Einige Tools auf dieser Seite nutzen Live-Daten von Drittanbietern, um Stations-, Verbindungs-, Preis- und Wetterinformationen bereitzustellen.",
                "Die Mobilitäts-Tools nutzen derzeit transport.rest (`v6.db.transport.rest`) für Stations- und Verbindungsdaten sowie Open-Meteo (`api.open-meteo.com`) für Wettervorhersagen.",
                "Wenn du diese Tools nutzt, sendet unser Server die für das gewünschte Ergebnis erforderlichen Request-Daten, etwa Stationsnamen, Stations-IDs, Reisezeitpunkt und Routenparameter. Diese Anbieter können außerdem technische Request-Daten aus unserer Server-Infrastruktur erhalten, soweit dies für die Antwort erforderlich ist.",
                "Wir nutzen diese Anbieter ausschließlich, um die von dir angeforderten Mobilitäts-Ergebnisse zu erzeugen. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO, soweit die Anfrage zur Bereitstellung des gewünschten Tool-Ergebnisses erforderlich ist, oder Art. 6 Abs. 1 lit. f DSGVO für den zuverlässigen Betrieb dieser Nutzwert-Funktionen.",
              ],
      },
      {
        heading:
          lang === "en"
            ? "Email contact and newsletter status"
            : "E-Mail-Kontakt und Newsletter-Status",
        paragraphs:
          lang === "en"
            ? [
                "If you email us directly, we process your email address and the contents of your message in order to respond. Legal basis is Article 6(1)(f) GDPR or Article 6(1)(b) GDPR where your request relates to a pre-contractual matter.",
                "A public newsletter signup is not currently enabled on the live site. If we launch it later, this policy will be updated before public rollout.",
              ]
            : [
                "Wenn du uns direkt per E-Mail kontaktierst, verarbeiten wir deine E-Mail-Adresse und den Inhalt deiner Nachricht, um zu antworten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO oder Art. 6 Abs. 1 lit. b DSGVO, wenn es um vorvertragliche Anfragen geht.",
                "Ein öffentliches Newsletter-Formular ist auf der Live-Seite derzeit nicht aktiviert. Falls wir es später starten, aktualisieren wir diese Datenschutzerklärung vor dem öffentlichen Rollout.",
              ],
      },
      {
        heading: lang === "en" ? "Retention periods" : "Speicherdauer",
        paragraphs:
          lang === "en"
            ? [
                "We keep technical logs only as long as needed for security and operations. Stored device preferences remain until you clear them or overwrite them. Email correspondence is kept as long as needed to handle the request and any follow-up obligations.",
              ]
            : [
                "Technische Logs speichern wir nur so lange, wie sie für Sicherheit und Betrieb erforderlich sind. Lokal gespeicherte Präferenzen bleiben bestehen, bis du sie löschst oder überschreibst. E-Mail-Korrespondenz speichern wir nur so lange, wie dies für die Bearbeitung der Anfrage und etwaige Anschlussfragen erforderlich ist.",
              ],
      },
      {
        heading: lang === "en" ? "External links" : "Externe Links",
        paragraphs:
          lang === "en"
            ? [
                "Many pages link to official German authorities and third-party services. Once you leave this site, the privacy policy of the external provider applies.",
              ]
            : [
                "Viele Seiten verlinken auf deutsche Behörden und Drittanbieter. Sobald du diese Seite verlässt, gilt die Datenschutzerklärung des jeweiligen externen Anbieters.",
              ],
      },
      {
        heading: lang === "en" ? "Your rights" : "Deine Rechte",
        paragraphs:
          lang === "en"
            ? [
                "Under the GDPR, you generally have the right of access, rectification, erasure, restriction of processing, objection, and data portability, where applicable.",
                `If you want to exercise a right or ask a privacy question, contact us at ${siteConfig.email}. You also have the right to lodge a complaint with a competent data protection authority.`,
              ]
            : [
                "Nach der DSGVO hast du grundsätzlich das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Widerspruch und Datenübertragbarkeit, soweit die jeweiligen Voraussetzungen vorliegen.",
                `Wenn du ein Recht ausüben oder eine Datenschutzfrage stellen möchtest, kontaktiere uns unter ${siteConfig.email}. Außerdem hast du das Recht, dich bei einer zuständigen Datenschutzaufsichtsbehörde zu beschweren.`,
              ],
        list:
          lang === "en"
            ? [
                "Access to stored personal data",
                "Correction of inaccurate data",
                "Deletion where retention is no longer required",
                "Withdrawal of analytics consent at any time",
              ]
            : [
                "Auskunft über gespeicherte personenbezogene Daten",
                "Berichtigung unrichtiger Daten",
                "Löschung, soweit keine Aufbewahrungspflicht mehr besteht",
                "Widerruf einer Analyse-Einwilligung jederzeit",
              ],
      },
    ] satisfies PrivacySection[],
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const l = lang as Lang;
  const content = getPrivacyContent(l);
  const social = createSocialMetadata({
    title: content.title,
    description: content.intro[0],
    badge: l === "en" ? "Legal" : "Rechtliches",
  });

  return {
    title: content.title,
    alternates: {
      canonical: `${siteConfig.domain}/${lang}/legal/privacy`,
      languages: {
        en: `${siteConfig.domain}/en/legal/privacy`,
        de: `${siteConfig.domain}/de/legal/privacy`,
      },
    },
    ...social,
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const l = lang as Lang;
  const content = getPrivacyContent(l);

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
        <div className="container-main max-w-4xl mx-auto">
          <h1 className="text-4xl font-black tracking-tight mb-6">{content.title}</h1>

          <div className="content-shell flex flex-col gap-6">
            {content.intro.map((paragraph) => (
              <p key={paragraph} className="text-ink-2 leading-relaxed m-0">
                {paragraph}
              </p>
            ))}

            {content.sections.map((section) => (
              <div key={section.heading} className="flex flex-col gap-3">
                <h2 className="text-lg font-black tracking-tight mb-0 mt-1">
                  {section.heading}
                </h2>

                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-ink-2 leading-relaxed m-0">
                    {paragraph}
                  </p>
                ))}

                {section.list && (
                  <ul className="m-0 pl-5 text-ink-2 leading-relaxed">
                    {section.list.map((item) => (
                      <li key={item} className="mb-1">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
