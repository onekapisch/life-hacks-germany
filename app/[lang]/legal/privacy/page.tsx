import type { Metadata } from "next";
import type { Lang } from "@/lib/i18n";
import { siteConfig } from "@/lib/i18n";
import Breadcrumbs from "@/components/Breadcrumbs";
import { createSocialMetadata } from "@/lib/seo";

type PrivacySection = {
  heading?: string;
  paragraphs: string[];
  list?: string[];
};

const privacyContent = {
  en: {
    title: "Privacy Policy",
    intro: [
      "Life Hacks Germany website is owned by Aeon GbR, which is a data controller of your personal data.",
      "We have adopted this Privacy Policy, which determines how we are processing the information collected by Life Hacks Germany, which also provides the reasons why we must collect certain personal data about you. Therefore, you must read this Privacy Policy before using Life Hacks Germany website.",
      "We take care of your personal data and undertake to guarantee its confidentiality and security.",
    ],
    sections: [
      {
        heading: "Personal information we collect",
        paragraphs: [
          "When you visit the Life Hacks Germany, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the installed cookies on your device. Additionally, as you browse the Site, we collect information about the individual web pages or products you view, what websites or search terms referred you to the Site, and how you interact with the Site. We refer to this automatically-collected information as \"Device Information.\" Moreover, we might collect the personal data you provide to us (including but not limited to Name, Surname, Address, payment information, etc.) during registration to be able to fulfill the agreement.",
        ],
      },
      {
        heading: "Why do we process your data?",
        paragraphs: [
          "Our top priority is customer data security, and, as such, we may process only minimal user data, only as much as it is absolutely necessary to maintain the website. Information collected automatically is used only to identify potential cases of abuse and establish statistical information regarding website usage. This statistical information is not otherwise aggregated in such a way that it would identify any particular user of the system.",
          "You can visit the website without telling us who you are or revealing any information, by which someone could identify you as a specific, identifiable individual. If, however, you wish to use some of the website's features, or you wish to receive our newsletter or provide other details by filling a form, you may provide personal data to us, such as your email, first name, last name, city of residence, organization, telephone number. You can choose not to provide us with your personal data, but then you may not be able to take advantage of some of the website's features. For example, you won't be able to receive our Newsletter or contact us directly from the website. Users who are uncertain about what information is mandatory are welcome to contact us via golifehacks@gmx.de.",
        ],
      },
      {
        heading: "Your rights",
        paragraphs: [
          "If you are a European resident, you have the following rights related to your personal data:",
        ],
        list: [
          "The right to be informed.",
          "The right of access.",
          "The right to rectification.",
          "The right to erasure.",
          "The right to restrict processing.",
          "The right to data portability.",
          "The right to object.",
          "Rights in relation to automated decision-making and profiling.",
        ],
      },
      {
        paragraphs: [
          "If you would like to exercise this right, please contact us through the contact information below.",
          "Additionally, if you are a European resident, we note that we are processing your information in order to fulfill contracts we might have with you (for example, if you make an order through the Site), or otherwise to pursue our legitimate business interests listed above. Additionally, please note that your information might be transferred outside of Europe, including Canada and the United States.",
        ],
      },
      {
        heading: "Links to other websites",
        paragraphs: [
          "Our website may contain links to other websites that are not owned or controlled by us. Please be aware that we are not responsible for such other websites or third parties' privacy practices. We encourage you to be aware when you leave our website and read the privacy statements of each website that may collect personal information.",
        ],
      },
      {
        heading: "Information security",
        paragraphs: [
          "We secure information you provide on computer servers in a controlled, secure environment, protected from unauthorized access, use, or disclosure. We keep reasonable administrative, technical, and physical safeguards to protect against unauthorized access, use, modification, and personal data disclosure in its control and custody. However, no data transmission over the Internet or wireless network can be guaranteed.",
        ],
      },
      {
        heading: "Legal disclosure",
        paragraphs: [
          "We will disclose any information we collect, use or receive if required or permitted by law, such as to comply with a subpoena or similar legal process, and when we believe in good faith that disclosure is necessary to protect our rights, protect your safety or the safety of others, investigate fraud, or respond to a government request.",
        ],
      },
      {
        heading: "Contact information",
        paragraphs: [
          "If you would like to contact us to understand more about this Policy or wish to contact us concerning any matter relating to individual rights and your Personal Information, you may send an email to golifehacks@gmx.de.",
        ],
      },
    ] as PrivacySection[],
  },
  de: {
    title: "Datenschutzerklärung",
    intro: [
      "Die Webseite Life Hacks Germany ist Eigentum der Aeon GbR, die für die Verarbeitung Ihrer personenbezogenen Daten verantwortlich ist.",
      "Wir haben diese Datenschutzerklärung verabschiedet, die festlegt, wie wir die von Life Hacks Germany gesammelten Informationen verarbeiten und die auch die Gründe angibt, warum wir bestimmte personenbezogene Daten über Sie sammeln müssen. Daher müssen Sie diese Datenschutzerklärung lesen, bevor Sie die Webseite Life Hacks Germany nutzen.",
      "Wir kümmern uns um Ihre personenbezogenen Daten und verpflichten uns, deren Vertraulichkeit und Sicherheit zu gewährleisten.",
    ],
    sections: [
      {
        heading: "Von uns erfasste personenbezogene Daten",
        paragraphs: [
          "Wenn Sie Life Hacks Germany besuchen, erfassen wir automatisch bestimmte Informationen über Ihr Gerät, einschließlich Informationen über Ihren Webbrowser, Ihre IP-Adresse, Ihre Zeitzone und einige der auf Ihrem Gerät installierten Cookies. Wenn Sie auf der Webseite surfen, erfassen wir außerdem Informationen über die einzelnen Webseiten oder Produkte, die Sie sich ansehen, welche Webseiten oder Suchbegriffe Sie auf die Webseite geführt haben und wie Sie mit der Webseite interagieren. Wir bezeichnen diese automatisch gesammelten Informationen als „Geräteinformationen“. Darüber hinaus können wir die personenbezogenen Daten erfassen, die Sie uns während der Registrierung zur Verfügung stellen (einschließlich, aber nicht beschränkt auf Name, Nachname, Adresse, Zahlungsinformationen usw.), um den Vertrag erfüllen zu können.",
        ],
      },
      {
        heading: "Warum verarbeiten wir Ihre Daten?",
        paragraphs: [
          "Unsere oberste Priorität ist die Sicherheit der Kundendaten, und daher verarbeiten wir möglicherweise nur minimale Benutzerdaten, nur so viel, wie es für den Betrieb der Webseite unbedingt erforderlich ist. Automatisch gesammelte Informationen werden nur verwendet, um potenzielle Missbrauchsfälle zu identifizieren und statistische Informationen über die Nutzung der Webseite zu erstellen. Diese statistischen Informationen werden ansonsten nicht so aggregiert, dass ein bestimmter Benutzer des Systems identifiziert werden könnte.",
          "Sie können die Webseite besuchen, ohne uns mitzuteilen, wer Sie sind, oder Informationen preiszugeben, anhand derer jemand Sie als eine bestimmte, identifizierbare Person identifizieren könnte. Wenn Sie jedoch einige Funktionen der Webseite nutzen möchten oder unseren Newsletter erhalten oder andere Angaben durch Ausfüllen eines Formulars machen möchten, können Sie uns personenbezogene Daten wie Ihre E-Mail-Adresse, Ihren Vornamen, Nachnamen, Wohnort, Ihre Organisation und Telefonnummer zur Verfügung stellen. Sie können sich dafür entscheiden, uns Ihre personenbezogenen Daten nicht zur Verfügung zu stellen, aber dann können Sie möglicherweise einige Funktionen der Webseite nicht nutzen. Beispielsweise können Sie unseren Newsletter nicht erhalten oder uns nicht direkt von der Webseite aus kontaktieren. Benutzer, die unsicher sind, welche Informationen obligatorisch sind, können uns gerne über golifehacks@gmx.de kontaktieren.",
        ],
      },
      {
        heading: "Ihre Rechte",
        paragraphs: [
          "Wenn Sie ein europäischer Einwohner sind, haben Sie die folgenden Rechte in Bezug auf Ihre personenbezogenen Daten:",
        ],
        list: [
          "Das Recht auf Information.",
          "Das Auskunftsrecht.",
          "Das Recht auf Berichtigung.",
          "Das Recht auf Löschung.",
          "Das Recht auf Einschränkung der Verarbeitung.",
          "Das Recht auf Datenübertragbarkeit.",
          "Das Widerspruchsrecht.",
          "Rechte im Zusammenhang mit automatisierter Entscheidungsfindung und Profiling.",
        ],
      },
      {
        paragraphs: [
          "Wenn Sie dieses Recht ausüben möchten, kontaktieren Sie uns bitte über die unten stehenden Kontaktinformationen.",
          "Wenn Sie ein europäischer Einwohner sind, weisen wir außerdem darauf hin, dass wir Ihre Informationen verarbeiten, um Verträge zu erfüllen, die wir möglicherweise mit Ihnen geschlossen haben (z. B. wenn Sie eine Bestellung über die Webseite aufgeben), oder um anderweitig unsere oben aufgeführten legitimen Geschäftsinteressen zu verfolgen. Bitte beachten Sie außerdem, dass Ihre Informationen möglicherweise außerhalb Europas übertragen werden, einschließlich Kanada und den Vereinigten Staaten.",
        ],
      },
      {
        heading: "Links zu anderen Webseiten",
        paragraphs: [
          "Unsere Webseite kann Links zu anderen Webseiten enthalten, die nicht unser Eigentum sind oder von uns kontrolliert werden. Bitte beachten Sie, dass wir nicht für solche anderen Webseiten oder die Datenschutzpraktiken Dritter verantwortlich sind. Wir empfehlen Ihnen, beim Verlassen unserer Webseite darauf zu achten und die Datenschutzerklärungen jeder Webseite zu lesen, die möglicherweise personenbezogene Daten sammelt.",
        ],
      },
      {
        heading: "Informationssicherheit",
        paragraphs: [
          "Wir sichern die von Ihnen bereitgestellten Informationen auf Computerservern in einer kontrollierten, sicheren Umgebung, die vor unbefugtem Zugriff, Verwendung oder Offenlegung geschützt ist. Wir unterhalten angemessene administrative, technische und physische Sicherheitsvorkehrungen zum Schutz vor unbefugtem Zugriff, Verwendung, Änderung und Offenlegung personenbezogener Daten in unserer Kontrolle und Obhut. Es kann jedoch keine Datenübertragung über das Internet oder ein drahtloses Netzwerk garantiert werden.",
        ],
      },
      {
        heading: "Rechtliche Offenlegung",
        paragraphs: [
          "Wir werden alle Informationen, die wir sammeln, verwenden oder erhalten, offenlegen, wenn dies gesetzlich vorgeschrieben oder erlaubt ist, beispielsweise um einer Vorladung oder einem ähnlichen rechtlichen Verfahren nachzukommen, und wenn wir nach Treu und Glauben der Ansicht sind, dass eine Offenlegung zum Schutz unserer Rechte, zum Schutz Ihrer Sicherheit oder der Sicherheit anderer, zur Untersuchung von Betrug oder zur Beantwortung einer behördlichen Anfrage erforderlich ist.",
        ],
      },
      {
        heading: "Kontaktinformationen",
        paragraphs: [
          "Wenn Sie uns kontaktieren möchten, um mehr über diese Richtlinie zu erfahren oder uns bezüglich einer Angelegenheit im Zusammenhang mit individuellen Rechten und Ihren personenbezogenen Daten kontaktieren möchten, können Sie eine E-Mail an golifehacks@gmx.de senden.",
        ],
      },
    ] as PrivacySection[],
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
    title: privacyContent[l].title,
    description: privacyContent[l].intro[0],
    badge: l === "en" ? "Legal" : "Rechtliches",
  });

  return {
    title: privacyContent[l].title,
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
  const tr = privacyContent[l];

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
        <div className="container-main max-w-4xl mx-auto">
          <h1 className="text-4xl font-black tracking-tight mb-6">{tr.title}</h1>

          <div className="content-shell flex flex-col gap-6">
            {tr.intro.map((paragraph) => (
              <p key={paragraph} className="text-ink-2 leading-relaxed m-0">
                {paragraph}
              </p>
            ))}

            {tr.sections.map((section) => (
              <div key={section.heading ?? section.paragraphs[0]} className="flex flex-col gap-3">
                {section.heading && (
                  <h2 className="text-lg font-black tracking-tight mb-0 mt-1">{section.heading}</h2>
                )}

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
