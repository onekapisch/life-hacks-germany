import Link from "next/link";
import type { Metadata } from "next";
import type { Lang } from "@/lib/i18n";
import { siteConfig } from "@/lib/i18n";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { createSocialMetadata } from "@/lib/seo";

type QuickIssue = {
  title: string;
  body: string;
};

type TimelineStep = {
  title: string;
  window: string;
  summary: string;
  items: string[];
  links: { label: string; href: string }[];
};

type Checklist = {
  title: string;
  intro: string;
  items: string[];
};

type LinkCard = {
  title: string;
  body: string;
  href: string;
};

type FaqItem = {
  q: string;
  a: string;
};

type WorkRelocationCopy = {
  title: string;
  metaTitle: string;
  metaDescription: string;
  badge: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
  panelTitle: string;
  panelItems: string[];
  disclaimer: string;
  frictionBadge: string;
  frictionTitle: string;
  frictionIntro: string;
  frictionPoints: QuickIssue[];
  timelineBadge: string;
  timelineTitle: string;
  timelineIntro: string;
  timeline: TimelineStep[];
  payslipBadge: string;
  payslipTitle: string;
  payslipIntro: string;
  payslipChecks: QuickIssue[];
  questionsBadge: string;
  questionsTitle: string;
  questionsIntro: string;
  questions: Checklist[];
  toolsBadge: string;
  toolsTitle: string;
  toolsIntro: string;
  tools: LinkCard[];
  guidesBadge: string;
  guidesTitle: string;
  guidesIntro: string;
  guides: LinkCard[];
  finalTitle: string;
  finalBody: string;
  finalPrimaryCta: string;
  finalSecondaryCta: string;
  faqs: FaqItem[];
};

function getCopy(lang: Lang): WorkRelocationCopy {
  const base = `/${lang}`;

  if (lang === "de") {
    return {
      title: "Job-Relocation nach Deutschland",
      metaTitle: "Job-Relocation nach Deutschland: erste 30 Tage, Gehaltscheck, Familie",
      metaDescription:
        "Unabhaengige Orientierung fuer employer-sponsored Relocations und interne Transfers: erste 30 Tage, erste Gehaltsabrechnung, Familien-Setup und die richtigen Fragen fuer HR oder Payroll.",
      badge: "Fuer employer-sponsored Umzuege",
      subtitle:
        "Diese Route ist fuer Menschen gedacht, die wegen eines Jobs nach Deutschland gekommen sind. Nicht generisch, nicht policy-lastig, sondern fokussiert auf die Momente, in denen Corporate Expats Zeit verlieren, Geld falsch einschaetzen oder intern die falsche Frage stellen.",
      primaryCta: "Start hier fuer Job-Relocation",
      secondaryCta: "Checkliste erste 14 Tage",
      panelTitle: "Nutze diese Seite, wenn ...",
      panelItems: [
        "dein Arbeitgeber Teile des Umzugs organisiert hat, aber nicht die deutschen Detailprozesse.",
        "deine erste deutsche Gehaltsabrechnung ungewohnt aussieht.",
        "dein Partner oder deine Familie parallel mitziehen und eigene To-dos haben.",
        "du fuer HR, Mobility oder Payroll die naechste saubere Frage brauchst.",
      ],
      disclaimer:
        "Unabhaengige Orientierung von Life Hacks Germany. Kein Arbeitgeber-Portal, keine Rechts- oder Steuerberatung, keine Aussage ueber interne Siemens Prozesse.",
      frictionBadge: "Wo Corporate Relocations oft haengen",
      frictionTitle: "Die vier Reibungspunkte, die bei Job-Umzuegen wirklich zaehlen",
      frictionIntro:
        "Corporate Expats scheitern selten am Basiswissen. Der Engpass ist meist Sequenz, Verantwortung und Timing zwischen dir, dem Arbeitgeber und den deutschen Stellen.",
      frictionPoints: [
        {
          title: "Adresse und Anmeldung",
          body: "Temporaires Wohnen, fehlende Wohnungsgeberbestaetigung oder knappe Termine bremsen alles Weitere aus.",
        },
        {
          title: "Erste Gehaltsabrechnung",
          body: "Tax class, Krankenversicherung, fehlende Steuer-ID oder Einmalzahlungen erzeugen schnell falsche Netto-Erwartungen.",
        },
        {
          title: "Familien-Setup",
          body: "Partner, Kinder, Kita, Kindergeld und Versicherung laufen selten automatisch mit deinem eigenen Prozess mit.",
        },
        {
          title: "Arbeitgeber-Koordination",
          body: "Oft ist unklar, was HR, Payroll, Mobility Provider oder du selbst liefern muessen.",
        },
      ],
      timelineBadge: "Erste 30 Tage",
      timelineTitle: "Die richtige Reihenfolge fuer die ersten 30 Tage",
      timelineIntro:
        "Nutze die Route unten nicht als starre Liste, sondern als Priorisierung. Jede Phase soll das naechste Problem entsperren.",
      timeline: [
        {
          title: "Phase 1",
          window: "Tag 1 bis 7",
          summary: "Adresse absichern, Anmeldung vorbereiten, Versicherungs- und Arbeitgeber-Basis aufsetzen.",
          items: [
            "Pruefe, ob deine Wohnsituation fuer Anmeldung taugt und fordere die Wohnungsgeberbestaetigung sofort an.",
            "Buche den Termin direkt oder pruefe die Online-Anmeldung deiner Stadt.",
            "Waehle die Krankenversicherung und gib den Nachweis an Arbeitgeber oder Hochschule weiter.",
            "Klaere mit HR oder Mobility, welche Dokumente intern noch fuer Payroll oder Permit fehlen.",
          ],
          links: [
            { label: "Erste 14 Tage", href: `${base}/guides/bureaucracy/first-14-days` },
            { label: "Anmeldung", href: `${base}/guides/bureaucracy/anmeldung` },
          ],
        },
        {
          title: "Phase 2",
          window: "Tag 8 bis 21",
          summary: "Bank, Steuer-ID Status, Permit-Pfad und erste echte Kostenkontrolle aufbauen.",
          items: [
            "Richte dein deutsches Konto ein und gib die IBAN an Payroll weiter.",
            "Dokumentiere, dass die Steuer-ID noch unterwegs ist, wenn sie vor dem ersten Payroll-Lauf nicht da ist.",
            "Klaere fuer Blue Card oder Arbeitserlaubnis, welche Unterlagen und Fristen fuer deinen Fall gelten.",
            "Vergleiche dein erwartetes Netto und deine Stadtkosten, bevor du Miet- oder Familienentscheidungen triffst.",
          ],
          links: [
            { label: "Blue Card und Arbeitserlaubnis", href: `${base}/guides/bureaucracy/blue-card-work-permit` },
            { label: "Brutto-Netto Rechner", href: `${base}/tools/gross-net-salary-calculator` },
          ],
        },
        {
          title: "Phase 3",
          window: "Tag 22 bis 30",
          summary: "Die erste Gehaltsabrechnung lesen, Familien-To-dos sauber sequenzieren und Folgefehler vermeiden.",
          items: [
            "Pruefe auf der ersten Abrechnung Tax class, Kirchensteuer, Krankenversicherung und auffaellige Einmalposten.",
            "Stelle offene Fragen an Payroll sofort mit konkreten Posten, nicht nur mit dem Satz 'mein Netto wirkt falsch'.",
            "Wenn Partner oder Kinder mitgezogen sind: Krankenversicherung, Kindergeld, Betreuung und Bank/Adresse separat mitdenken.",
            "Plane jetzt schon Permit-Fristen, Einzugsbudget und laufende Fixkosten fuer Monat zwei und drei.",
          ],
          links: [
            { label: "Familienleistungen", href: `${base}/guides/everyday/family-benefits-kindergeld-elterngeld` },
            { label: "Move-in Budget Tool", href: `${base}/tools#move-in-budget` },
          ],
        },
      ],
      payslipBadge: "Erste Gehaltsabrechnung",
      payslipTitle: "Was du vor Panik zuerst auf der ersten Gehaltsabrechnung pruefen solltest",
      payslipIntro:
        "Die erste deutsche Abrechnung fuehlt sich oft niedriger und komplizierter an als erwartet. Die richtige Reaktion ist nicht Raten, sondern systematischer Abgleich.",
      payslipChecks: [
        {
          title: "Tax class passt sie zu deinem Fall?",
          body: "Pruefe zuerst, ob die eingetragene Steuerklasse zu Familienstand und Meldestatus passt.",
        },
        {
          title: "Steuer-ID fehlt noch?",
          body: "Wenn die ID noch nicht vorlag, kann Payroll vorlaeufig mit unguenstigerem Setup laufen.",
        },
        {
          title: "Krankenversicherung richtig uebernommen?",
          body: "Ein falscher oder fehlender Versicherungsstatus veraendert Netto und Nachfragen an HR deutlich.",
        },
        {
          title: "Kirchensteuer oder Einmalzahlung?",
          body: "Auffaellige Netto-Abweichungen kommen oft durch Kirchensteuer-Flag oder einmalige Relocation- und Bonusposten.",
        },
      ],
      questionsBadge: "Fragen statt Raten",
      questionsTitle: "Mit diesen Fragen wirst du fuer HR, Payroll und Mobility deutlich schneller",
      questionsIntro:
        "Starke interne Fragen sparen Wochen. Gute Relocation-Unterstuetzung funktioniert nur, wenn klar ist, welche Stelle was beantworten soll.",
      questions: [
        {
          title: "HR oder Mobility fragen",
          intro: "Diese Punkte loesen Zustands- und Dokumentfragen.",
          items: [
            "Kann ich mich an der aktuellen temporaeren Adresse anmelden oder brauche ich eine andere Wohnbestaetigung?",
            "Welche Unterlagen erwartet ihr fuer den Permit- oder Blue-Card-Prozess noch von mir?",
            "Wer hilft bei spouse oder family setup, falls Partner spaeter nachzieht?",
            "Gibt es Fristen oder interne Deadlines vor dem ersten Payroll-Lauf?",
          ],
        },
        {
          title: "Payroll fragen",
          intro: "Hier geht es um konkrete Netto- und Abrechnungsthemen.",
          items: [
            "Mit welcher Steuerklasse und welchem Versicherungsstatus wurde meine erste Abrechnung verarbeitet?",
            "Wie wurde mein Fall behandelt, falls die Steuer-ID beim ersten Lauf noch nicht vorlag?",
            "Welche Posten sind einmalige Relocation- oder Bonusbestandteile und welche laufen dauerhaft weiter?",
            "Welche Position erklaert den groessten Unterschied zwischen meinem erwarteten und dem ausgezahlten Netto?",
          ],
        },
        {
          title: "Familie und Alltag mitdenken",
          intro: "Das wird oft zu spaet geplant, obwohl es den groessten Reibungsverlust erzeugt.",
          items: [
            "Ist dein Partner in einem eigenen Verwaltungs- und Versicherungsprozess oder in deinem mitabgedeckt?",
            "Welche Unterlagen brauchst du fuer Kindergeld, Elterngeld oder Kita-Anmeldung realistisch zuerst?",
            "Welche Kosten kommen in Monat eins und zwei parallel zur Miete noch auf dich zu?",
            "Ist das aktuelle Stadt- und Wohnkostenmodell mit deinem echten Netto ueberhaupt tragfaehig?",
          ],
        },
      ],
      toolsBadge: "Tools fuer Corporate Expats",
      toolsTitle: "Die drei nuetzlichsten Tools fuer diese Zielgruppe",
      toolsIntro:
        "Diese Tools helfen dir nicht beim Erklaeren deutscher Regeln, sondern bei Entscheidungen, die du trotz Arbeitgeber-Support selbst treffen musst.",
      tools: [
        {
          title: "Brutto-Netto + Stadtplus",
          body: "Nutze den Gehaltsrechner, um Netto-Erwartung und Stadtkosten vor Wohn- oder Familienentscheidungen sauber zu vergleichen.",
          href: `${base}/tools/gross-net-salary-calculator`,
        },
        {
          title: "Move-in Budget Planner",
          body: "Plane Kaution, erste Miete, Einrichtung und Nebenkosten, bevor dein Relocation-Paket endet oder private Kosten starten.",
          href: `${base}/tools#move-in-budget`,
        },
        {
          title: "Permit Timeline Planner",
          body: "Setze frueh deine eigenen Fristen, statt dich nur auf den naechsten Termin oder interne Erinnerungen zu verlassen.",
          href: `${base}/tools#permit-timeline`,
        },
      ],
      guidesBadge: "Beste Anschluss-Guides",
      guidesTitle: "Was Corporate Expats als Naechstes wirklich brauchen",
      guidesIntro:
        "Diese Guides decken die Folgeprobleme ab, die nach dem eigentlichen Umzug schnell relevant werden.",
      guides: [
        {
          title: "Erste 14 Tage in Deutschland",
          body: "Die Grundsequenz fuer Anmeldung, Steuer-ID und die ersten operativen Freischaltungen.",
          href: `${base}/guides/bureaucracy/first-14-days`,
        },
        {
          title: "Anmeldung Schritt fuer Schritt",
          body: "Wenn Adresse, Frist oder Dokumente der erste Bottleneck sind, beginnt alles hier.",
          href: `${base}/guides/bureaucracy/anmeldung`,
        },
        {
          title: "Krankenversicherung Grundlagen",
          body: "Der schnellste Ueberblick, wenn du den deutschen Versicherungsrahmen fuer Arbeit und Familie verstehen musst.",
          href: `${base}/guides/everyday/health-insurance-basics`,
        },
        {
          title: "Deutsch lernen in Deutschland",
          body: "Relevant, wenn Sprache zum naechsten Bottleneck bei Terminen, Wohnung, Arzt oder Job-Alltag wird.",
          href: `${base}/guides/everyday/learn-german-in-germany`,
        },
        {
          title: "Blue Card und Arbeitserlaubnis",
          body: "Hilft bei Eligibility, Dokumentenlogik und typischen Verzoegerungen im Permit-Prozess.",
          href: `${base}/guides/bureaucracy/blue-card-work-permit`,
        },
        {
          title: "Deutsches Konto vergleichen",
          body: "Relevant fuer den ersten Payroll-Lauf, Mietzahlungen und den Umstieg von Uebergangsloesungen.",
          href: `${base}/guides/money-taxes/german-bank-account-comparison`,
        },
        {
          title: "Kindergeld und Elterngeld",
          body: "Wichtig fuer Familien, die parallel zu Job und Umzug noch die deutsche Familienlogik aufsetzen muessen.",
          href: `${base}/guides/everyday/family-benefits-kindergeld-elterngeld`,
        },
      ],
      finalTitle: "Nutze diese Route als Arbeitsflaeche, nicht nur als Leseseite",
      finalBody:
        "Die beste Nutzung ist simpel: erst deine naechste Phase waehlen, dann die offenen Fragen fuers interne Gespraech notieren, dann mit den richtigen Guides und Tools tiefergehen.",
      finalPrimaryCta: "Zu Start hier",
      finalSecondaryCta: "Alle Guides ansehen",
      faqs: [
        {
          q: "Ist diese Seite offizielles HR- oder Siemens-Material?",
          a: "Nein. Das ist eine unabhaengige praktische Route von Life Hacks Germany und keine Aussage ueber interne Arbeitgeberprozesse.",
        },
        {
          q: "Fuer wen ist diese Route gedacht?",
          a: "Fuer Menschen, die wegen Arbeit nach Deutschland gezogen sind, zum Beispiel bei internen Transfers, employer-sponsored Relocations oder Blue-Card Setups.",
        },
        {
          q: "Ersetzt diese Seite Rechts-, Steuer- oder Payroll-Beratung?",
          a: "Nein. Sie hilft dir, schneller zu verstehen, was du zuerst klaeren solltest und welche Fragen du an die richtige Stelle gibst.",
        },
        {
          q: "Was sollte ich vor meiner ersten deutschen Gehaltsabrechnung klaeren?",
          a: "Pruefe Steuerklasse, Status der Steuer-ID, Krankenversicherung, IBAN-Uebergabe und auffaellige Einmalposten wie Relocation- oder Bonuszahlungen.",
        },
      ],
    };
  }

  return {
    title: "Work relocation to Germany",
    metaTitle: "Work Relocation to Germany: First 30 Days, Payslip, Family Setup",
    metaDescription:
      "Independent orientation for employer-sponsored moves and internal transfers: first 30 days, first German payslip, family setup, and the questions to take to HR, payroll, or mobility support.",
    badge: "Built for employer-sponsored moves",
    subtitle:
      "This route is for people who moved to Germany because of a job. It focuses on the moments where corporate expats lose time, misread their first net salary, or ask the wrong internal team for help.",
    primaryCta: "Start Here for work relocation",
    secondaryCta: "First 14 days checklist",
    panelTitle: "Use this page when ...",
    panelItems: [
      "your employer handled part of the move, but not the German admin detail.",
      "your first German payslip feels unfamiliar or lower than expected.",
      "your spouse or family is moving on a parallel timeline and needs its own setup path.",
      "you need the next sharp question for HR, payroll, or mobility support.",
    ],
    disclaimer:
      "Independent orientation from Life Hacks Germany. Not an employer portal, not legal or tax advice, and not a statement of Siemens internal policy.",
    frictionBadge: "Where work relocations break",
    frictionTitle: "The four friction points that matter most in work relocations",
    frictionIntro:
      "Corporate expats rarely struggle because they lack generic newcomer advice. The real problem is sequence, ownership, and timing between you, your employer, and German institutions.",
    frictionPoints: [
      {
        title: "Address and registration",
        body: "Temporary housing, landlord-confirmation gaps, and scarce appointments can block everything else.",
      },
      {
        title: "First payslip and deductions",
        body: "Tax class, health insurance, missing tax ID, or one-off payments can make net income feel wrong fast.",
      },
      {
        title: "Family setup",
        body: "Spouse, children, insurance, and benefits rarely move in sync with your own onboarding unless you plan them deliberately.",
      },
      {
        title: "Employer coordination",
        body: "The biggest delays often come from not knowing what HR, payroll, mobility support, or you personally need to deliver.",
      },
    ],
    timelineBadge: "First 30 days",
    timelineTitle: "The right sequence for your first 30 days",
    timelineIntro:
      "Use this route as prioritization, not a rigid script. Each phase should unlock the next one cleanly.",
    timeline: [
      {
        title: "Phase 1",
        window: "Day 1 to 7",
        summary: "Stabilize your address, prepare Anmeldung, and get insurance and employer basics moving.",
        items: [
          "Confirm your housing setup is registration-ready and request the landlord confirmation immediately.",
          "Book the appointment right away or check whether your city supports online registration.",
          "Choose health insurance and send the proof to your employer or university.",
          "Clarify with HR or mobility support which documents are still missing for payroll or permit handling.",
        ],
        links: [
          { label: "First 14 Days", href: `${base}/guides/bureaucracy/first-14-days` },
          { label: "Anmeldung", href: `${base}/guides/bureaucracy/anmeldung` },
        ],
      },
      {
        title: "Phase 2",
        window: "Day 8 to 21",
        summary: "Set up your bank account, track tax-ID status, lock in your permit path, and model your real net position.",
        items: [
          "Open your German bank account and pass the IBAN to payroll.",
          "Document that your tax ID is still pending if it will miss the first payroll run.",
          "Clarify which permit or Blue Card documents and deadlines apply to your case.",
          "Compare expected net income against real city costs before making housing or family commitments.",
        ],
        links: [
          { label: "Blue Card and work permit", href: `${base}/guides/bureaucracy/blue-card-work-permit` },
          { label: "Gross-to-net calculator", href: `${base}/tools/gross-net-salary-calculator` },
        ],
      },
      {
        title: "Phase 3",
        window: "Day 22 to 30",
        summary: "Read your first payslip, sequence family setup cleanly, and prevent avoidable month-two mistakes.",
        items: [
          "Check the first payslip for tax class, church tax, health insurance, and unusual one-off line items.",
          "Ask payroll about exact line items instead of only saying the net figure feels off.",
          "If spouse or children moved too, treat insurance, benefits, childcare, and registration as separate workstreams.",
          "Set permit deadlines, move-in budget, and recurring fixed costs now before month two starts.",
        ],
        links: [
          { label: "Family benefits", href: `${base}/guides/everyday/family-benefits-kindergeld-elterngeld` },
          { label: "Move-in budget tool", href: `${base}/tools#move-in-budget` },
        ],
      },
    ],
    payslipBadge: "First German payslip",
    payslipTitle: "What to check on your first payslip before you panic",
    payslipIntro:
      "The first German salary slip often feels lower and more complex than expected. The right move is not guessing. It is structured comparison.",
    payslipChecks: [
      {
        title: "Is the tax class right for your case?",
        body: "Start by checking whether the recorded tax class matches your family and registration status.",
      },
      {
        title: "Was the tax ID still pending?",
        body: "If payroll did not have your tax ID yet, the first run may use a less favorable temporary setup.",
      },
      {
        title: "Was health insurance mapped correctly?",
        body: "A missing or wrong insurance status can materially change the net result and trigger follow-up questions.",
      },
      {
        title: "Is church tax or a one-off payment involved?",
        body: "Many surprising net drops come from church tax flags or one-time relocation, bonus, or correction items.",
      },
    ],
    questionsBadge: "Questions beat guessing",
    questionsTitle: "These are the questions that make HR, payroll, and mobility support useful",
    questionsIntro:
      "Good internal questions save weeks. Relocation support only works well when the right team owns the right answer.",
    questions: [
      {
        title: "Ask HR or mobility support",
        intro: "Use these for status and document questions.",
        items: [
          "Can I register at my current temporary address, or do I need a different housing confirmation?",
          "Which permit or Blue Card documents are still expected from me?",
          "Who supports spouse or family setup if my partner arrives later?",
          "Are there deadlines or internal cutoffs before the first payroll run?",
        ],
      },
      {
        title: "Ask payroll",
        intro: "Use these for concrete net-pay and line-item questions.",
        items: [
          "Which tax class and insurance status were used for my first payslip?",
          "How was my case processed if the tax ID was not available yet?",
          "Which line items are one-off relocation or bonus payments versus recurring deductions?",
          "Which single line item explains the biggest difference between expected and paid net income?",
        ],
      },
      {
        title: "Ask for yourself and your family",
        intro: "These are usually planned too late even though they create the most friction.",
        items: [
          "Is your spouse in a separate admin and insurance path, or covered through yours?",
          "Which documents do you realistically need first for benefits or childcare applications?",
          "Which month-one and month-two costs sit on top of rent and relocation support?",
          "Is your current city and housing plan actually sustainable on your real net income?",
        ],
      },
    ],
    toolsBadge: "High-value tools",
    toolsTitle: "The three most useful tools for this audience",
    toolsIntro:
      "These tools are less about explaining Germany and more about helping you make the decisions that still sit with you even after employer support.",
    tools: [
      {
        title: "Gross-to-Net + City Surplus",
        body: "Use the salary calculator to compare expected net income and city costs before housing or family decisions lock in.",
        href: `${base}/tools/gross-net-salary-calculator`,
      },
      {
        title: "Move-In Budget Planner",
        body: "Plan deposit, first rent, setup costs, and early recurring expenses before your relocation package ends.",
        href: `${base}/tools#move-in-budget`,
      },
      {
        title: "Permit Timeline Planner",
        body: "Set your own deadline discipline early instead of relying only on the next appointment or internal reminder.",
        href: `${base}/tools#permit-timeline`,
      },
    ],
    guidesBadge: "Best next guides",
    guidesTitle: "What corporate expats usually need next",
    guidesIntro:
      "These guides cover the follow-on problems that become urgent right after the move itself is done.",
    guides: [
      {
        title: "First 14 Days in Germany",
        body: "The core sequence for Anmeldung, tax ID, and your first practical unlocks.",
        href: `${base}/guides/bureaucracy/first-14-days`,
      },
      {
        title: "Anmeldung step-by-step",
        body: "Start here when address proof, deadline pressure, or appointment scarcity is your main bottleneck.",
        href: `${base}/guides/bureaucracy/anmeldung`,
      },
      {
        title: "Health insurance basics",
        body: "The fastest overview when you need to understand the German insurance setup for work and family.",
        href: `${base}/guides/everyday/health-insurance-basics`,
      },
      {
        title: "Learn German in Germany",
        body: "Use this when language becomes the next bottleneck in appointments, housing, healthcare, or work life.",
        href: `${base}/guides/everyday/learn-german-in-germany`,
      },
      {
        title: "Blue Card and work permit",
        body: "Useful for eligibility, document logic, and common delay points in the permit process.",
        href: `${base}/guides/bureaucracy/blue-card-work-permit`,
      },
      {
        title: "German bank account comparison",
        body: "Relevant for first payroll, rent setup, and moving off temporary payment workarounds.",
        href: `${base}/guides/money-taxes/german-bank-account-comparison`,
      },
      {
        title: "Kindergeld and Elterngeld",
        body: "Important for families handling benefits in parallel with work relocation.",
        href: `${base}/guides/everyday/family-benefits-kindergeld-elterngeld`,
      },
    ],
    finalTitle: "Use this route like a working surface, not just a read-once page",
    finalBody:
      "Pick the phase you are in, write down the open internal questions, then move into the right guide or tool with less noise and less avoidable delay.",
    finalPrimaryCta: "Go to Start Here",
    finalSecondaryCta: "Browse all guides",
    faqs: [
      {
        q: "Is this official HR or Siemens guidance?",
        a: "No. This is an independent practical route from Life Hacks Germany and not a statement of internal employer processes.",
      },
      {
        q: "Who is this route for?",
        a: "People who moved to Germany for work, including internal transfers, employer-sponsored relocations, and Blue Card setups.",
      },
      {
        q: "Does this replace legal, tax, or payroll advice?",
        a: "No. It helps you understand what to clarify first and which questions belong with which team.",
      },
      {
        q: "What should I clarify before my first German payslip?",
        a: "Check tax class, tax-ID status, health insurance, IBAN handoff, and whether any one-off relocation or bonus items affect the first net result.",
      },
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
  const copy = getCopy(l);
  const social = createSocialMetadata({
    title: copy.metaTitle,
    description: copy.metaDescription,
    badge: l === "en" ? "Work Relocation" : "Job-Relocation",
  });

  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    keywords:
      l === "en"
        ? [
            "work relocation Germany",
            "corporate expat Germany",
            "first German payslip",
            "internal transfer Germany",
            "expat payroll Germany",
          ]
        : [
            "Job Relocation Deutschland",
            "Corporate Expat Deutschland",
            "erste Gehaltsabrechnung Deutschland",
            "interner Transfer Deutschland",
            "Payroll Deutschland Expat",
          ],
    alternates: {
      canonical: `${siteConfig.domain}/${lang}/work-relocation`,
      languages: {
        en: `${siteConfig.domain}/en/work-relocation`,
        de: `${siteConfig.domain}/de/work-relocation`,
      },
    },
    ...social,
  };
}

export default async function WorkRelocationPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const l = lang as Lang;
  const copy = getCopy(l);
  const base = `/${l}`;

  return (
    <>
      <JsonLd
        type="faq"
        lang={l}
        data={{ faqs: copy.faqs }}
      />
      <JsonLd
        type="breadcrumb"
        lang={l}
        data={{
          items: [
            { name: l === "en" ? "Home" : "Start", url: `${siteConfig.domain}/${l}` },
            { name: copy.title, url: `${siteConfig.domain}/${l}/work-relocation` },
          ],
        }}
      />
      <JsonLd
        type="itemlist"
        lang={l}
        data={{
          items: copy.guides.slice(0, 4).map((item) => ({
            name: item.title,
            url: `${siteConfig.domain}${item.href}`,
          })),
        }}
      />

      <Breadcrumbs lang={l} items={[{ label: copy.title }]} />

      <section className="py-16 md:py-24">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)] gap-8 items-start">
            <div>
              <span className="badge mb-5">{copy.badge}</span>
              <h1 className="text-4xl md:text-5xl font-black leading-[1.03] tracking-tight mb-4 max-w-4xl">
                {copy.title}
              </h1>
              <p className="text-lg text-ink-2 leading-relaxed max-w-3xl mb-6">
                {copy.subtitle}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href={`${base}/start-here`} className="btn btn-primary">
                  {copy.primaryCta}
                </Link>
                <Link href={`${base}/guides/bureaucracy/first-14-days`} className="btn btn-secondary">
                  {copy.secondaryCta}
                </Link>
              </div>
            </div>

            <aside className="content-shell">
              <p className="text-xs uppercase tracking-[0.12em] text-ink-3 font-bold mt-0 mb-3">
                {copy.panelTitle}
              </p>
              <div className="flex flex-col gap-3">
                {copy.panelItems.map((item) => (
                  <div key={item} className="glass-tile text-sm text-ink-2 leading-relaxed">
                    {item}
                  </div>
                ))}
              </div>
              <p className="text-xs text-ink-3 leading-relaxed mt-4 mb-0">
                {copy.disclaimer}
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section className="pb-10">
        <div className="container-main">
          <div className="highlight-band">
            <div className="max-w-3xl mb-6">
              <span className="badge mb-3">{copy.frictionBadge}</span>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight mt-0 mb-2">
                {copy.frictionTitle}
              </h2>
              <p className="text-ink-2 m-0">{copy.frictionIntro}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {copy.frictionPoints.map((item) => (
                <article key={item.title} className="content-shell !p-5">
                  <h3 className="text-lg font-black tracking-tight mt-0 mb-2">{item.title}</h3>
                  <p className="text-sm text-ink-2 leading-relaxed m-0">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-12">
        <div className="container-main">
          <div className="max-w-3xl mb-6">
            <span className="badge mb-3">{copy.timelineBadge}</span>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight mt-0 mb-2">
              {copy.timelineTitle}
            </h2>
            <p className="text-ink-2 m-0">{copy.timelineIntro}</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            {copy.timeline.map((step) => (
              <article key={step.window} className="content-shell h-full flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <span className="badge-solid">{step.title}</span>
                  <span className="text-xs uppercase tracking-[0.1em] text-ink-3 font-bold">
                    {step.window}
                  </span>
                </div>
                <h3 className="text-xl font-black tracking-tight mt-0 mb-2">{step.summary}</h3>
                <div className="flex flex-col gap-2 text-sm text-ink-2 leading-relaxed">
                  {step.items.map((item) => (
                    <p key={item} className="m-0">
                      {item}
                    </p>
                  ))}
                </div>
                <div className="mt-5 flex flex-col gap-2">
                  {step.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="glass-card-link p-3.5 no-underline text-ink text-sm font-semibold group"
                    >
                      <span className="flex items-center justify-between gap-3">
                        <span>{link.label}</span>
                        <span className="text-accent-2 group-hover:translate-x-1 transition-transform">
                          &rarr;
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-12">
        <div className="container-main">
          <div className="max-w-3xl mb-6">
            <span className="badge mb-3">{copy.payslipBadge}</span>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight mt-0 mb-2">
              {copy.payslipTitle}
            </h2>
            <p className="text-ink-2 m-0">{copy.payslipIntro}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {copy.payslipChecks.map((item) => (
              <article key={item.title} className="card">
                <h3 className="text-lg font-black tracking-tight mt-0 mb-2">{item.title}</h3>
                <p className="text-sm text-ink-2 leading-relaxed m-0">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-12">
        <div className="container-main">
          <div className="highlight-band">
            <div className="max-w-3xl mb-6">
              <span className="badge mb-3">{copy.questionsBadge}</span>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight mt-0 mb-2">
                {copy.questionsTitle}
              </h2>
              <p className="text-ink-2 m-0">{copy.questionsIntro}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {copy.questions.map((block) => (
                <article key={block.title} className="content-shell !p-5">
                  <h3 className="text-lg font-black tracking-tight mt-0 mb-2">{block.title}</h3>
                  <p className="text-sm text-ink-2 mt-0 mb-4">{block.intro}</p>
                  <div className="flex flex-col gap-2 text-sm text-ink-2 leading-relaxed">
                    {block.items.map((item) => (
                      <p key={item} className="m-0">
                        {item}
                      </p>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-12">
        <div className="container-main">
          <div className="max-w-3xl mb-6">
            <span className="badge mb-3">{copy.toolsBadge}</span>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight mt-0 mb-2">
              {copy.toolsTitle}
            </h2>
            <p className="text-ink-2 m-0">{copy.toolsIntro}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {copy.tools.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="glass-card-link no-underline text-ink rounded-2xl p-5 h-full flex flex-col group"
              >
                <span className="badge mb-3 w-fit">{l === "en" ? "Tool" : "Tool"}</span>
                <h3 className="text-xl font-black leading-[1.12] tracking-tight m-0 mb-2 group-hover:text-accent-2 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-ink-2 m-0 leading-relaxed">{item.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="container-main">
          <div className="max-w-3xl mb-6">
            <span className="badge mb-3">{copy.guidesBadge}</span>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight mt-0 mb-2">
              {copy.guidesTitle}
            </h2>
            <p className="text-ink-2 m-0">{copy.guidesIntro}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {copy.guides.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="content-shell no-underline text-ink hover:border-[rgba(15,23,42,0.16)] transition-colors"
              >
                <h3 className="text-lg font-black tracking-tight mt-0 mb-2">{item.title}</h3>
                <p className="text-sm text-ink-2 m-0 leading-relaxed">{item.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-main">
          <div className="highlight-band text-center py-8">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight mt-0 mb-3">
              {copy.finalTitle}
            </h2>
            <p className="text-ink-2 max-w-3xl mx-auto mb-6">{copy.finalBody}</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href={`${base}/start-here`} className="btn btn-primary">
                {copy.finalPrimaryCta}
              </Link>
              <Link href={`${base}/guides`} className="btn btn-secondary">
                {copy.finalSecondaryCta}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
