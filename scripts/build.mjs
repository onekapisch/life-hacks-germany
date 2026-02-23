import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist');
const ASSETS_SRC = path.join(ROOT, 'src', 'assets');

const today = '2026-02-08';

const site = {
  name: 'Life Hacks Germany',
  tagline: 'Verified, practical guidance for living well in Germany.',
  taglineDe: 'Verifizierte, praktische Hilfe fuer ein gutes Leben in Deutschland.',
  description:
    'Life Hacks Germany is a verification-first guide for expats, students, and Germans living in Germany. Step-by-step guides, tools, and checklists built on official sources.',
  descriptionDe:
    'Life Hacks Germany ist ein verifizierter Leitfaden fuer Expats, Studierende und Deutsche in Deutschland. Schritt-fuer-Schritt-Guides, Tools und Checklisten mit offiziellen Quellen.',
  languages: {
    en: { label: 'English', prefix: '/en' },
    de: { label: 'Deutsch', prefix: '/de' }
  }
};

const navItems = {
  en: [
    { label: 'Home', href: '/en/' },
    { label: 'Start Here', href: '/en/start-here/' },
    { label: 'Guides', href: '/en/guides/' },
    { label: 'Tools', href: '/en/tools/' },
    { label: 'Editorial', href: '/en/editorial-standards/' }
  ],
  de: [
    { label: 'Start', href: '/de/' },
    { label: 'Start hier', href: '/de/start-here/' },
    { label: 'Guides', href: '/de/guides/' },
    { label: 'Tools', href: '/de/tools/' },
    { label: 'Redaktion', href: '/de/editorial-standards/' }
  ]
};

const pillars = {
  'money-taxes': {
    en: {
      title: 'Money & Taxes',
      summary: 'Taxes, banking basics, fees, and how to keep more of your money.'
    },
    de: {
      title: 'Geld & Steuern',
      summary: 'Steuern, Banking-Grundlagen, Gebuehren und wie du mehr behaeltst.'
    }
  },
  mobility: {
    en: {
      title: 'Mobility',
      summary: 'Public transport, tickets, and commuting strategies that save time.'
    },
    de: {
      title: 'Mobilitaet',
      summary: 'OePNV, Tickets und Pendelstrategien, die Zeit sparen.'
    }
  },
  housing: {
    en: {
      title: 'Housing & Utilities',
      summary: 'Rent, deposits, and tenant rights you should know before signing.'
    },
    de: {
      title: 'Wohnen & Nebenkosten',
      summary: 'Miete, Kaution und Mieterrechte, die du vor dem Unterschreiben kennst.'
    }
  },
  bureaucracy: {
    en: {
      title: 'Bureaucracy & Admin',
      summary: 'Registration, documents, and the steps that unlock everything else.'
    },
    de: {
      title: 'Buerokratie & Verwaltung',
      summary: 'Anmeldung, Dokumente und die Schritte, die alles andere freischalten.'
    }
  },
  everyday: {
    en: {
      title: 'Everyday Life',
      summary: 'Health insurance, essentials, and the costs that show up monthly.'
    },
    de: {
      title: 'Alltag',
      summary: 'Krankenversicherung, Essentials und laufende Kosten.'
    }
  }
};

const guideSources = {
  anmeldung: [
    {
      label: 'Bundesmeldegesetz Section 17 (Anmeldefrist)',
      url: 'https://www.gesetze-im-internet.de/bmg/__17.html'
    },
    {
      label: 'Bundesmeldegesetz Section 19 (Wohnungsgeberbestaetigung)',
      url: 'https://www.gesetze-im-internet.de/bmg/__19.html'
    }
  ],
  onlineAnmeldung: [
    {
      label: 'Online-Wohnsitzanmeldung (Bundesportal)',
      url: 'https://wohnsitzanmeldung.gov.de/leistungsbeschreibung-643104'
    }
  ],
  wohnungsgeber: [
    {
      label: 'Bundesmeldegesetz Section 19 (Wohnungsgeberbestaetigung)',
      url: 'https://www.gesetze-im-internet.de/bmg/__19.html'
    }
  ],
  mietkaution: [
    {
      label: 'BGB Section 551 (Mietsicherheit)',
      url: 'https://www.gesetze-im-internet.de/bgb/__551.html'
    }
  ],
  kuendigungsfrist: [
    {
      label: 'BGB Section 573c (Kuendigungsfristen)',
      url: 'https://www.gesetze-im-internet.de/bgb/__573c.html'
    }
  ],
  deutschlandticket: [
    {
      label: 'Bundesregierung FAQ zum Deutschlandticket',
      url: 'https://www.bundesregierung.de/breg-de/service/fragen-und-anworten/deutschlandticket-2134074'
    },
    {
      label: 'Deutsche Bahn: Deutschlandticket',
      url: 'https://www.bahn.de/angebot/pendler/deutschlandticket'
    }
  ],
  rundfunkbeitrag: [
    {
      label: 'Rundfunkbeitrag: Zahlen & Beitragskonto',
      url: 'https://www.rundfunkbeitrag.de/buergerinnen_und_buerger/informationen_ueber_den_rundfunkbeitrag/beitrag_zahlen/index_ger.html'
    }
  ],
  taxDeadlines: [
    {
      label: 'AO Section 149 (Abgabefristen)',
      url: 'https://www.gesetze-im-internet.de/ao_1977/__149.html'
    },
    {
      label: 'Finanzamt NRW: Abgabefristen Beispiel',
      url: 'https://www.finanzamt.nrw.de/steuerinfos/weitere-themen/steuererklaerung/abgabepflichten-und-fristen'
    }
  ],
  elster: [
    {
      label: 'ELSTER Portal (Mein ELSTER)',
      url: 'https://www.elster.de'
    }
  ],
  taxId: [
    {
      label: 'BZSt: Steuerliche Identifikationsnummer',
      url: 'https://www.bzst.de/DE/Privatpersonen/Identifikationsnummer/identifikationsnummer_node.html'
    }
  ],
  healthInsurance: [
    {
      label: 'BMG: Gesetzliche Krankenversicherung (GKV)',
      url: 'https://www.bundesgesundheitsministerium.de/gkv'
    }
  ],
  first14days: [
    {
      label: 'Bundesmeldegesetz Section 17 (Anmeldefrist)',
      url: 'https://www.gesetze-im-internet.de/bmg/__17.html'
    },
    {
      label: 'Bundesmeldegesetz Section 19 (Wohnungsgeberbestaetigung)',
      url: 'https://www.gesetze-im-internet.de/bmg/__19.html'
    },
    {
      label: 'BZSt: Steuerliche Identifikationsnummer',
      url: 'https://www.bzst.de/DE/Privatpersonen/Identifikationsnummer/identifikationsnummer_node.html'
    }
  ],
  rentalChecklist: [
    {
      label: 'BGB Section 551 (Mietsicherheit)',
      url: 'https://www.gesetze-im-internet.de/bgb/__551.html'
    },
    {
      label: 'BGB Section 573c (Kuendigungsfristen)',
      url: 'https://www.gesetze-im-internet.de/bgb/__573c.html'
    }
  ],
  taxReturnSetup: [
    {
      label: 'AO Section 149 (Abgabefristen)',
      url: 'https://www.gesetze-im-internet.de/ao_1977/__149.html'
    },
    {
      label: 'ELSTER Portal (Mein ELSTER)',
      url: 'https://www.elster.de'
    }
  ],
  transportDecision: [
    {
      label: 'Bundesregierung FAQ zum Deutschlandticket',
      url: 'https://www.bundesregierung.de/breg-de/service/fragen-und-anworten/deutschlandticket-2134074'
    },
    {
      label: 'Deutsche Bahn: Deutschlandticket',
      url: 'https://www.bahn.de/angebot/pendler/deutschlandticket'
    }
  ]
};

const guides = [
  {
    id: 'anmeldung',
    pillar: 'bureaucracy',
    slug: 'anmeldung',
    updated: today,
    en: {
      title: 'Anmeldung in Germany: Register Your Address',
      summary:
        'Registering your address unlocks tax ID delivery, official letters, and most contracts. The law sets a deadline after moving in.',
      forWho: 'Anyone moving to a new address in Germany (expats, students, Germans).',
      steps: [
        'Book an appointment at your local registration office (Meldebehoerde) or check if your city offers online registration.',
        'Prepare ID documents (passport or ID card) and your Wohnungsgeberbestaetigung from the landlord.',
        'Attend the appointment or finish the online process and keep your confirmation (Meldebestaetigung).'
      ],
      facts: [
        'The Federal Registration Act (BMG) sets a two-week deadline for registering after moving in.',
        'Your landlord must provide a Wohnungsgeberbestaetigung with key details about the move-in.'
      ],
      mistakes: [
        'Waiting until you need the tax ID or other documents.',
        'Arriving without the Wohnungsgeberbestaetigung or with incomplete data.'
      ],
      costs: 'Registration itself is typically free. Some cities charge for extra certificates.',
      localNotes: 'Rules are federal, but appointment availability and online services vary by city.',
      disclaimer:
        'This is practical guidance, not legal advice. Always confirm requirements with your local Meldebehoerde.'
    },
    de: {
      title: 'Anmeldung in Deutschland: Adresse registrieren',
      summary:
        'Die Anmeldung deiner Adresse schaltet Steuer-ID, offizielle Briefe und viele Vertraege frei. Das Gesetz setzt eine Frist nach dem Einzug.',
      forWho: 'Alle, die in Deutschland umziehen oder neu ankommen.',
      steps: [
        'Termin beim Buergeramt/Meldebehoerde buchen oder pruefen, ob die Online-Anmeldung verfuegbar ist.',
        'Ausweisdokumente und die Wohnungsgeberbestaetigung vom Vermieter vorbereiten.',
        'Termin wahrnehmen oder Online-Vorgang abschliessen und die Meldebestaetigung sichern.'
      ],
      facts: [
        'Das Bundesmeldegesetz (BMG) setzt eine Zwei-Wochen-Frist nach dem Einzug.',
        'Der Vermieter muss eine Wohnungsgeberbestaetigung mit den relevanten Angaben ausstellen.'
      ],
      mistakes: [
        'Zu lange warten, bis die Steuer-ID gebraucht wird.',
        'Ohne Wohnungsgeberbestaetigung oder mit unvollstaendigen Angaben erscheinen.'
      ],
      costs: 'Die Anmeldung ist meist kostenlos. Zusatzbescheinigungen koennen gebuehrenpflichtig sein.',
      localNotes: 'Die Regeln sind bundesweit, Termine und Online-Angebote unterscheiden sich je Stadt.',
      disclaimer:
        'Dies ist praktische Hilfe, keine Rechtsberatung. Bitte Anforderungen lokal pruefen.'
    },
    sources: guideSources.anmeldung
  },
  {
    id: 'online-anmeldung',
    pillar: 'bureaucracy',
    slug: 'online-anmeldung',
    updated: today,
    en: {
      title: 'Online Wohnsitzanmeldung: When It Works',
      summary:
        'Germany now offers online residence registration for participating municipalities. It saves time but needs specific tech setup.',
      forWho: 'People with a German ID card/eID and a city that supports the online service.',
      steps: [
        'Check if your municipality offers the online service and follow the federal portal entry point.',
        'Use your eID and the AusweisApp to identify yourself and submit your address change.',
        'Download the confirmation and keep it with your important documents.'
      ],
      facts: [
        'The federal portal lists requirements and participating municipalities for online registration.',
        'You need a compatible ID and the AusweisApp to complete identification.'
      ],
      mistakes: [
        'Assuming every city supports the service (availability varies).',
        'Starting the process without eID activation or PIN.'
      ],
      costs: 'Online registration is typically free. Local services may charge for extra certificates.',
      localNotes: 'Participation depends on your city. Always verify on the portal.',
      disclaimer: 'This is practical guidance, not legal advice.'
    },
    de: {
      title: 'Online-Wohnsitzanmeldung: Wann sie funktioniert',
      summary:
        'Die Online-Wohnsitzanmeldung spart Zeit, ist aber nur in teilnehmenden Kommunen verfuegbar und braucht die passende Technik.',
      forWho: 'Menschen mit aktiviertem Online-Ausweis und Kommune mit Online-Service.',
      steps: [
        'Im Bundesportal pruefen, ob deine Kommune teilnimmt.',
        'Mit Online-Ausweis und AusweisApp identifizieren und den Vorgang abschliessen.',
        'Bestaetigung herunterladen und aufbewahren.'
      ],
      facts: [
        'Das Bundesportal listet Voraussetzungen und teilnehmende Kommunen.',
        'Ein kompatibler Ausweis und die AusweisApp sind erforderlich.'
      ],
      mistakes: [
        'Annahme, dass jede Stadt den Service anbietet.',
        'Ohne aktivierte eID oder PIN starten.'
      ],
      costs: 'Meist kostenlos. Zusatzbescheinigungen koennen gebuehrenpflichtig sein.',
      localNotes: 'Teilnahme ist kommunal unterschiedlich. Immer im Portal pruefen.',
      disclaimer: 'Praktische Hilfe, keine Rechtsberatung.'
    },
    sources: guideSources.onlineAnmeldung
  },
  {
    id: 'wohnungsgeberbestaetigung',
    pillar: 'housing',
    slug: 'wohnungsgeberbestaetigung',
    updated: today,
    en: {
      title: 'Wohnungsgeberbestaetigung: What It Must Contain',
      summary:
        'Your landlord confirmation is mandatory for registration. The law defines which details must be included.',
      forWho: 'Tenants registering a new address in Germany.',
      steps: [
        'Ask your landlord for the Wohnungsgeberbestaetigung right after signing the lease.',
        'Check that the confirmation includes move-in date, address, and the landlord\'s details.',
        'Bring it to your Anmeldung appointment or upload it for online registration.'
      ],
      facts: [
        'The Federal Registration Act (BMG) lists the required information for the confirmation.',
        'You cannot complete Anmeldung without it.'
      ],
      mistakes: [
        'Showing up with only a rental contract (not sufficient on its own).',
        'Using an outdated or incomplete confirmation.'
      ],
      costs: 'The confirmation itself should be free.',
      localNotes: 'Some cities accept digital copies; check your municipality\'s rules.',
      disclaimer: 'This is practical guidance, not legal advice.'
    },
    de: {
      title: 'Wohnungsgeberbestaetigung: Diese Angaben sind Pflicht',
      summary:
        'Die Wohnungsgeberbestaetigung ist fuer die Anmeldung zwingend. Das Gesetz legt die Pflichtangaben fest.',
      forWho: 'Mieterinnen und Mieter bei der Anmeldung einer neuen Adresse.',
      steps: [
        'Direkt nach Vertragsabschluss die Bestaetigung beim Vermieter anfordern.',
        'Pruefen, dass Einzugsdatum, Adresse und Vermieterangaben enthalten sind.',
        'Zum Termin mitnehmen oder fuer die Online-Anmeldung hochladen.'
      ],
      facts: [
        'Das Bundesmeldegesetz definiert die Pflichtangaben.',
        'Ohne Bestaetigung ist die Anmeldung nicht moeglich.'
      ],
      mistakes: [
        'Nur den Mietvertrag mitbringen (reicht nicht).',
        'Veraltete oder unvollstaendige Angaben verwenden.'
      ],
      costs: 'Die Bestaetigung sollte kostenlos sein.',
      localNotes: 'Manche Stadte akzeptieren digitale Kopien. Lokal pruefen.',
      disclaimer: 'Praktische Hilfe, keine Rechtsberatung.'
    },
    sources: guideSources.wohnungsgeber
  },
  {
    id: 'mietkaution',
    pillar: 'housing',
    slug: 'mietkaution',
    updated: today,
    en: {
      title: 'Rent Deposit (Mietkaution) Rules',
      summary:
        'German law caps the rent deposit and allows payment in installments. Use this to protect your cash flow.',
      forWho: 'Anyone renting a flat or room in Germany.',
      steps: [
        'Confirm the deposit amount (max three months of cold rent).',
        'If needed, pay in three equal monthly installments, starting at the beginning of the lease.',
        'Keep proof of payment and ensure the deposit is separated from the landlord\'s assets.'
      ],
      facts: [
        'The deposit cannot exceed three months of cold rent (without operating costs).',
        'Tenants may pay in three equal monthly installments.'
      ],
      mistakes: [
        'Paying the full deposit before move-in if you need installment rights.',
        'Not keeping proof of payment.'
      ],
      costs: 'Up to three months of cold rent, depending on the contract.',
      localNotes: 'Deposit rules are federal and apply nationwide.',
      disclaimer: 'This is practical guidance, not legal advice.'
    },
    de: {
      title: 'Mietkaution: Regeln & Grenzen',
      summary:
        'Das Gesetz begrenzt die Mietkaution und erlaubt Ratenzahlung. Nutze das fuer deinen Cashflow.',
      forWho: 'Alle, die in Deutschland eine Wohnung oder ein Zimmer mieten.',
      steps: [
        'Kautionshoehe pruefen (maximal drei Monatskaltmieten).',
        'Falls noetig, in drei gleichen Monatsraten zahlen, beginnend zu Mietbeginn.',
        'Zahlungsnachweise aufbewahren und getrennte Anlage pruefen.'
      ],
      facts: [
        'Die Kaution darf drei Monatskaltmieten nicht uebersteigen.',
        'Mieter durfen in drei gleichen Monatsraten zahlen.'
      ],
      mistakes: [
        'Die komplette Kaution vor Einzug zahlen, obwohl Ratenzahlung moeglich ist.',
        'Keine Zahlungsnachweise sichern.'
      ],
      costs: 'Bis zu drei Monatskaltmieten, je nach Vertrag.',
      localNotes: 'Bundesweit einheitlich geregelt.',
      disclaimer: 'Praktische Hilfe, keine Rechtsberatung.'
    },
    sources: guideSources.mietkaution
  },
  {
    id: 'kuendigungsfrist',
    pillar: 'housing',
    slug: 'kuendigungsfrist-miete',
    updated: today,
    en: {
      title: 'Tenant Notice Period (Kuendigungsfrist)',
      summary:
        'Know when you can cancel a lease and how notice timing works under German law.',
      forWho: 'Tenants planning to move out or renegotiate their lease.',
      steps: [
        'Check your contract for special clauses (but the legal default still applies).',
        'Submit your written notice by the third working day of the month to leave after the next month.',
        'Keep delivery proof (registered letter or signed handover).'
      ],
      facts: [
        'The legal tenant notice period is generally three months.',
        'The notice must reach the landlord by the third working day of a month.'
      ],
      mistakes: [
        'Email-only cancellation without proof of delivery.',
        'Missing the third working day deadline and losing a full month.'
      ],
      costs: 'No fee for giving notice, but you owe rent through the notice period.',
      localNotes: 'Landlord notice periods can be longer; tenant rules are fixed by law.',
      disclaimer: 'This is practical guidance, not legal advice.'
    },
    de: {
      title: 'Kuendigungsfrist fuer Mieter',
      summary:
        'So funktioniert die gesetzliche Kuendigungsfrist und wie du richtig fristest.',
      forWho: 'Mieterinnen und Mieter, die ausziehen oder neu verhandeln wollen.',
      steps: [
        'Vertrag auf Sonderklauseln pruefen (gesetzliche Frist gilt weiterhin).',
        'Schriftliche Kuendigung bis zum dritten Werktag des Monats zustellen.',
        'Zustellung nachweisen (Einschreiben oder Empfangsbestaetigung).'
      ],
      facts: [
        'Die gesetzliche Kuendigungsfrist fuer Mieter betraegt in der Regel drei Monate.',
        'Die Kuendigung muss bis zum dritten Werktag eingehen.'
      ],
      mistakes: [
        'Nur per E-Mail kundigen ohne Zustellnachweis.',
        'Frist verpassen und einen weiteren Monat zahlen.'
      ],
      costs: 'Keine Gebuehr fuer die Kuendigung, aber Mietzahlung bis Fristende.',
      localNotes: 'Vermieterfristen sind laenger; Mieterfristen sind gesetzlich fix.',
      disclaimer: 'Praktische Hilfe, keine Rechtsberatung.'
    },
    sources: guideSources.kuendigungsfrist
  },
  {
    id: 'deutschlandticket',
    pillar: 'mobility',
    slug: 'deutschlandticket',
    updated: today,
    en: {
      title: 'Deutschlandticket: Price, Validity, and Limits',
      summary:
        'The Deutschlandticket is a monthly subscription for local transport across Germany. Know what it includes and what it does not.',
      forWho: 'Commuters, students, and anyone using regional or city transport regularly.',
      steps: [
        'Choose a provider (local transport authority or Deutsche Bahn).',
        'Subscribe monthly and keep your ticket in the provider app or as a card.',
        'Use it on regional trains, buses, trams, and U-Bahn/S-Bahn where covered.'
      ],
      facts: [
        'The monthly price is listed at EUR 63 as of January 2026.',
        'It is valid on local and regional transport, not long-distance ICE/IC/EC trains.'
      ],
      mistakes: [
        'Assuming it covers long-distance trains.',
        'Missing provider-specific cancellation rules.'
      ],
      costs: 'EUR 63 per month (current list price).',
      localNotes: 'Cancellation rules vary by provider; always check before subscribing.',
      disclaimer: 'Check your provider terms for detailed conditions.'
    },
    de: {
      title: 'Deutschlandticket: Preis, Gueltigkeit, Grenzen',
      summary:
        'Das Deutschlandticket ist ein Monatsabo fuer den Nahverkehr in ganz Deutschland. Hier steht, was drin ist und was nicht.',
      forWho: 'Pendler, Studierende und alle, die regelmaessig regional fahren.',
      steps: [
        'Anbieter waehlen (Verkehrsverbund oder Deutsche Bahn).',
        'Monatsabo abschliessen und Ticket in App oder als Karte nutzen.',
        'Im Regional- und Nahverkehr nutzen (Bus, Tram, U-/S-Bahn).'
      ],
      facts: [
        'Der Preis liegt laut offizieller Stellen bei 63 Euro pro Monat (seit Januar 2026).',
        'Im Fernverkehr (ICE/IC/EC) ist das Ticket nicht gueltig.'
      ],
      mistakes: [
        'Fernverkehr als inklusive Leistung annehmen.',
        'Anbieter-Fristen fuer die Kuendigung uebersehen.'
      ],
      costs: '63 Euro pro Monat (aktueller Listenpreis).',
      localNotes: 'Kuendigungsregeln variieren je Anbieter.',
      disclaimer: 'Details immer beim Anbieter pruefen.'
    },
    sources: guideSources.deutschlandticket
  },
  {
    id: 'rundfunkbeitrag',
    pillar: 'money-taxes',
    slug: 'rundfunkbeitrag',
    updated: today,
    en: {
      title: 'Rundfunkbeitrag: What You Pay and How to Manage It',
      summary:
        'Every household in Germany pays the broadcasting contribution. Set it up early to avoid late fees.',
      forWho: 'Anyone renting or owning a home in Germany.',
      steps: [
        'Register your household with the Beitragsservice or wait for their letter after Anmeldung.',
        'Choose your payment rhythm (monthly, quarterly, or annually).',
        'Apply for exemptions or reductions if you qualify.'
      ],
      facts: [
        'The standard contribution is EUR 18.36 per household per month.',
        'Payment is managed centrally by the Beitragsservice (rundfunkbeitrag.de).'
      ],
      mistakes: [
        'Ignoring the first letter and accumulating late fees.',
        'Paying twice when sharing a household.'
      ],
      costs: 'EUR 18.36 per household per month.',
      localNotes: 'Exemptions are tied to specific benefits and must be applied for.',
      disclaimer: 'Always check the official Beitragsservice site for the latest rules.'
    },
    de: {
      title: 'Rundfunkbeitrag: Zahlen und richtig verwalten',
      summary:
        'Jeder Haushalt zahlt den Rundfunkbeitrag. Wer frueh organisiert, vermeidet Mahngebuehren.',
      forWho: 'Alle, die in Deutschland wohnen oder mieten.',
      steps: [
        'Haushalt beim Beitragsservice anmelden oder auf das Schreiben nach der Anmeldung warten.',
        'Zahlungsrhythmus waehlen (monatlich, quartalsweise, jaehrlich).',
        'Befreiung oder Ermaessigung beantragen, falls berechtigt.'
      ],
      facts: [
        'Der Standardbeitrag betraegt 18,36 Euro pro Haushalt und Monat.',
        'Die Zahlung wird zentral ueber den Beitragsservice organisiert.'
      ],
      mistakes: [
        'Erstes Schreiben ignorieren und Mahngebuehren riskieren.',
        'Doppelt zahlen, obwohl ein Haushalt reicht.'
      ],
      costs: '18,36 Euro pro Haushalt und Monat.',
      localNotes: 'Befreiungen sind an bestimmte Leistungen gebunden und muessen beantragt werden.',
      disclaimer: 'Aktuelle Regeln immer beim Beitragsservice pruefen.'
    },
    sources: guideSources.rundfunkbeitrag
  },
  {
    id: 'tax-deadlines',
    pillar: 'money-taxes',
    slug: 'tax-return-deadlines',
    updated: today,
    en: {
      title: 'Tax Return Deadlines: The Core Rule',
      summary:
        'The German tax code sets the general deadline based on the end of the calendar year. Special extensions can apply.',
      forWho: 'Anyone filing a German tax return (mandatory or voluntary).',
      steps: [
        'Determine the tax year you are filing for.',
        'Use the legal deadline rule (7 months after year-end) as your baseline.',
        'If you use a tax advisor, confirm the extended deadline in the law and any special rules.'
      ],
      facts: [
        'The general deadline is seven months after the end of the tax year.',
        'Tax advisor filings have a later statutory deadline.'
      ],
      mistakes: [
        'Assuming the deadline is the same every year without checking extensions.',
        'Filing late without requesting an extension.'
      ],
      costs: 'There is no fee to file, but late submission can trigger penalties.',
      localNotes:
        'Finanzamt guidance may publish specific dates for each tax year. Check your state page.',
      disclaimer: 'This is practical guidance, not tax advice.'
    },
    de: {
      title: 'Steuerfristen: Die Grundregel',
      summary:
        'Die Abgabenordnung legt die Grundfrist fest. Sonderfristen und Verlanderungen sind moeglich.',
      forWho: 'Alle, die eine Steuererklaerung abgeben (pflichtig oder freiwillig).',
      steps: [
        'Steuerjahr festlegen, fuer das du abgibst.',
        'Grundfrist nutzen (7 Monate nach Jahresende).',
        'Bei Steuerberater die gesetzliche Verlaengerung pruefen.'
      ],
      facts: [
        'Die allgemeine Abgabefrist liegt sieben Monate nach Jahresende.',
        'Mit Steuerberater gilt eine spatere gesetzliche Frist.'
      ],
      mistakes: [
        'Annehmen, dass die Frist immer gleich bleibt.',
        'Zu spat abgeben ohne Fristverlangerung.'
      ],
      costs: 'Abgabe ist kostenfrei, Verspatung kann zu Zuschlagen fuhren.',
      localNotes: 'Finanzamter nennen oft konkrete Daten pro Steuerjahr.',
      disclaimer: 'Praktische Hilfe, keine Steuerberatung.'
    },
    sources: guideSources.taxDeadlines
  },
  {
    id: 'elster',
    pillar: 'money-taxes',
    slug: 'elster',
    updated: today,
    en: {
      title: 'ELSTER: The Official Tax Portal',
      summary:
        'ELSTER (Mein ELSTER) is the official online portal for filing German taxes and other forms.',
      forWho: 'Anyone filing tax returns or communicating digitally with the tax office.',
      steps: [
        'Create a free account on the official ELSTER portal.',
        'Verify your identity and activate your account.',
        'Use ELSTER for tax returns, certificates, and messages with the Finanzamt.'
      ],
      facts: [
        'ELSTER is the official portal for online tax filing.',
        'Account creation is free.'
      ],
      mistakes: [
        'Using unofficial websites that mimic ELSTER.',
        'Waiting until the last week to register (verification can take time).'
      ],
      costs: 'Free to use.',
      localNotes: 'ELSTER is nationwide and applies to all federal states.',
      disclaimer: 'For complex cases, consider professional tax advice.'
    },
    de: {
      title: 'ELSTER: Das offizielle Steuerportal',
      summary:
        'ELSTER (Mein ELSTER) ist das offizielle Online-Portal fuer Steuererklaerungen und Finanzamtsformulare.',
      forWho: 'Alle, die digital mit dem Finanzamt arbeiten wollen.',
      steps: [
        'Kostenloses Konto im offiziellen ELSTER-Portal anlegen.',
        'Identitat verifizieren und Konto aktivieren.',
        'ELSTER fuer Steuererklaerungen, Bescheinigungen und Nachrichten nutzen.'
      ],
      facts: [
        'ELSTER ist das offizielle Portal fuer die Online-Steuerabgabe.',
        'Die Registrierung ist kostenlos.'
      ],
      mistakes: [
        'Inoffizielle Webseiten nutzen, die ELSTER nachahmen.',
        'Zu spat registrieren, obwohl die Freischaltung Zeit braucht.'
      ],
      costs: 'Kostenlos nutzbar.',
      localNotes: 'Bundesweit gueltig.',
      disclaimer: 'Bei komplexen Fallen professionelle Hilfe erwagen.'
    },
    sources: guideSources.elster
  },
  {
    id: 'tax-id',
    pillar: 'bureaucracy',
    slug: 'steuer-id',
    updated: today,
    en: {
      title: 'Tax ID (IdNr): What It Is and How to Get It',
      summary:
        'Your tax identification number is permanent and used for tax and employment processes.',
      forWho: 'Anyone living in Germany who needs to work or file taxes.',
      steps: [
        'After Anmeldung, the tax ID is sent by letter to your registered address.',
        'If it does not arrive, request it directly from the Federal Central Tax Office (BZSt).',
        'Keep the number safe and share it only with trusted institutions.'
      ],
      facts: [
        'The tax ID is permanent and does not change with address changes.',
        'BZSt is the official authority for issuing and re-sending the tax ID.'
      ],
      mistakes: [
        'Expecting the tax ID by email (it is sent by letter).',
        'Sharing the ID widely or on insecure forms.'
      ],
      costs: 'Free.',
      localNotes: 'Processing times vary; request early if you need it for payroll.',
      disclaimer: 'This is practical guidance, not legal advice.'
    },
    de: {
      title: 'Steuer-ID: Bedeutung und Erhalt',
      summary:
        'Die steuerliche Identifikationsnummer ist dauerhaft und wichtig fuer Arbeit und Steuern.',
      forWho: 'Alle, die in Deutschland leben, arbeiten oder Steuern zahlen.',
      steps: [
        'Nach der Anmeldung kommt die Steuer-ID per Brief an die Meldeadresse.',
        'Falls sie nicht ankommt, bei BZSt neu anfordern.',
        'Nummer sicher aufbewahren und nur mit vertrauenswurdigen Stellen teilen.'
      ],
      facts: [
        'Die Steuer-ID ist dauerhaft und bleibt auch bei Umzug gleich.',
        'BZSt ist die zustandige Stelle fuer Ausgabe und Zusendung.'
      ],
      mistakes: [
        'Steuer-ID per E-Mail erwarten (sie kommt per Brief).',
        'Nummer zu breit teilen oder unsicher speichern.'
      ],
      costs: 'Kostenlos.',
      localNotes: 'Bearbeitungszeiten variieren, frueh anfordern wenn benotigt.',
      disclaimer: 'Praktische Hilfe, keine Rechtsberatung.'
    },
    sources: guideSources.taxId
  },
  {
    id: 'health-insurance',
    pillar: 'everyday',
    slug: 'health-insurance-basics',
    updated: today,
    en: {
      title: 'Health Insurance Basics: GKV and PKV',
      summary:
        'Germany has statutory (GKV) and private (PKV) health insurance systems. Most residents are in GKV.',
      forWho: 'New residents, employees, and students choosing a health insurance provider.',
      steps: [
        'Check whether you are required or eligible to join statutory or private insurance.',
        'Compare providers based on coverage, service, and contribution rates.',
        'Register with your chosen provider and provide your insurance details to your employer or university.'
      ],
      facts: [
        'Germany operates a statutory health insurance system (GKV).',
        'Private insurance is available under specific conditions.'
      ],
      mistakes: [
        'Assuming all private plans are better without checking coverage.',
        'Delaying health insurance registration after arrival.'
      ],
      costs: 'Contributions depend on income and insurance type.',
      localNotes: 'Rules can differ for students, self-employed, and employees.',
      disclaimer: 'This is practical guidance, not medical or legal advice.'
    },
    de: {
      title: 'Krankenversicherung: Grundlagen GKV und PKV',
      summary:
        'Deutschland hat gesetzliche (GKV) und private (PKV) Krankenversicherung. Die meisten sind in der GKV.',
      forWho: 'Neuankommlinge, Beschaeftigte und Studierende bei der Wahl der Krankenkasse.',
      steps: [
        'Pruefen, ob GKV oder PKV fuer dich gilt.',
        'Anbieter nach Leistung, Service und Beitrag vergleichen.',
        'Bei der gewaehlten Kasse anmelden und Daten an Arbeitgeber oder Uni geben.'
      ],
      facts: [
        'Deutschland hat ein System der gesetzlichen Krankenversicherung.',
        'Private Versicherung ist unter bestimmten Bedingungen moeglich.'
      ],
      mistakes: [
        'Private Tarife ohne Leistungspruefung waehlen.',
        'Anmeldung zu lange verschieben.'
      ],
      costs: 'Beitraege haengen von Einkommen und Versicherungsart ab.',
      localNotes: 'Regeln unterscheiden sich fuer Studierende, Selbststaendige und Beschaeftigte.',
      disclaimer: 'Praktische Hilfe, keine medizinische Beratung.'
    },
    sources: guideSources.healthInsurance
  },
  {
    id: 'first-14-days',
    pillar: 'bureaucracy',
    slug: 'first-14-days',
    updated: today,
    en: {
      title: 'First 14 Days in Germany: Starter Checklist',
      summary:
        'A simple sequence to register your address, receive your tax ID, and unlock the basics.',
      forWho: 'New arrivals and recent movers in Germany.',
      steps: [
        'Secure housing and request the Wohnungsgeberbestaetigung immediately.',
        'Book your Anmeldung appointment or check for online registration in your city.',
        'Register within the legal deadline and keep the Meldebestaetigung.',
        'Wait for your tax ID letter or request it from BZSt if needed.',
        'Use your tax ID for payroll, banking, and official forms.'
      ],
      facts: [
        'The registration deadline is two weeks after moving in.',
        'The tax ID is issued by the Federal Central Tax Office (BZSt) and sent by letter.'
      ],
      mistakes: [
        'Delaying registration until a contract requires it.',
        'Expecting the tax ID by email or phone.'
      ],
      costs: 'Registration is typically free; extra certificates may have local fees.',
      localNotes: 'Appointment availability and online services vary by city.',
      disclaimer: 'This is practical guidance, not legal advice.'
    },
    de: {
      title: 'Erste 14 Tage in Deutschland: Starter-Checkliste',
      summary:
        'Eine klare Reihenfolge fuer Anmeldung, Steuer-ID und die wichtigsten Grundlagen.',
      forWho: 'Neuankommlinge und frisch Umgezogene in Deutschland.',
      steps: [
        'Wohnung sichern und sofort die Wohnungsgeberbestaetigung anfordern.',
        'Anmeldungstermin buchen oder Online-Anmeldung pruefen.',
        'Innerhalb der Frist anmelden und die Meldebestaetigung sichern.',
        'Auf den Steuer-ID-Brief warten oder bei Bedarf beim BZSt anfordern.',
        'Steuer-ID fuer Arbeitgeber, Banking und Formulare nutzen.'
      ],
      facts: [
        'Die Anmeldefrist betraegt zwei Wochen nach Einzug.',
        'Die Steuer-ID wird vom BZSt vergeben und per Brief versendet.'
      ],
      mistakes: [
        'Anmeldung zu lange verschieben.',
        'Steuer-ID per E-Mail oder Telefon erwarten.'
      ],
      costs: 'Die Anmeldung ist meist kostenlos; Zusatzbescheinigungen koennen kostenpflichtig sein.',
      localNotes: 'Termine und Online-Angebote unterscheiden sich je Stadt.',
      disclaimer: 'Praktische Hilfe, keine Rechtsberatung.'
    },
    sources: guideSources.first14days
  },
  {
    id: 'rental-contract-checklist',
    pillar: 'housing',
    slug: 'rental-contract-checklist',
    updated: today,
    en: {
      title: 'Rental Contract Checklist (Before You Sign)',
      summary:
        'Make sure the deposit and notice rules match German law before you commit.',
      forWho: 'Tenants signing a new lease or renewing a contract.',
      steps: [
        'Confirm the deposit amount and payment plan (maximum three months of cold rent).',
        'Check the notice period and termination clause in writing.',
        'Clarify what is included in rent (cold vs warm components).',
        'Store the signed contract and payment proofs safely.'
      ],
      facts: [
        'The deposit cap and installment rights are defined in the German Civil Code.',
        'Tenant notice periods are defined by law.'
      ],
      mistakes: [
        'Paying the full deposit immediately when installments are allowed.',
        'Overlooking the written notice period in the contract.'
      ],
      costs: 'Deposit can be up to three months of cold rent.',
      localNotes: 'Federal law applies nationwide.',
      disclaimer: 'This is practical guidance, not legal advice.'
    },
    de: {
      title: 'Mietvertrag-Checkliste (vor der Unterschrift)',
      summary:
        'Pruefe Kaution und Kuendigungsregeln, bevor du den Vertrag unterschreibst.',
      forWho: 'Mieterinnen und Mieter vor Vertragsabschluss oder Verlaengerung.',
      steps: [
        'Kautionshoehe und Zahlungsplan pruefen (maximal drei Monatskaltmieten).',
        'Kuendigungsfrist und Klauseln schriftlich bestaetigen.',
        'Klaeren, was in der Miete enthalten ist (kalt vs warm).',
        'Vertrag und Zahlungsnachweise sicher ablegen.'
      ],
      facts: [
        'Kaution und Ratenzahlung sind im BGB geregelt.',
        'Kuendigungsfristen fuer Mieter sind gesetzlich festgelegt.'
      ],
      mistakes: [
        'Kaution komplett zahlen, obwohl Ratenzahlung moeglich ist.',
        'Kuendigungsfristen im Vertrag uebersehen.'
      ],
      costs: 'Kaution bis zu drei Monatskaltmieten.',
      localNotes: 'Bundesrecht gilt deutschlandweit.',
      disclaimer: 'Praktische Hilfe, keine Rechtsberatung.'
    },
    sources: guideSources.rentalChecklist
  },
  {
    id: 'tax-return-setup',
    pillar: 'money-taxes',
    slug: 'tax-return-setup',
    updated: today,
    en: {
      title: 'Tax Return Setup: What to Do Before Filing',
      summary:
        'Set up ELSTER early and align with the statutory deadline before you file.',
      forWho: 'Anyone planning to file a German tax return.',
      steps: [
        'Create and verify your ELSTER account well before the deadline.',
        'Collect income statements, insurance documents, and receipts.',
        'Track the statutory deadline (seven months after year end).',
        'If using an advisor, confirm the extended deadline early.'
      ],
      facts: [
        'ELSTER is the official portal for online tax filing.',
        'The statutory deadline is defined in the tax code.'
      ],
      mistakes: [
        'Waiting until the last week to activate ELSTER.',
        'Missing the deadline without requesting an extension.'
      ],
      costs: 'ELSTER is free; advisors charge separate fees.',
      localNotes: 'Deadlines can shift with special legislation, so verify annually.',
      disclaimer: 'This is practical guidance, not tax advice.'
    },
    de: {
      title: 'Steuererklaerung vorbereiten: So startest du richtig',
      summary:
        'ELSTER frueh einrichten und die gesetzliche Frist im Blick behalten.',
      forWho: 'Alle, die eine Steuererklaerung abgeben wollen.',
      steps: [
        'ELSTER-Konto fruehzeitig erstellen und verifizieren.',
        'Lohnsteuerbescheinigungen, Versicherungen und Belege sammeln.',
        'Gesetzliche Frist im Kalender blocken (sieben Monate nach Jahresende).',
        'Bei Steuerberatung die verlaengerte Frist vorab klaeren.'
      ],
      facts: [
        'ELSTER ist das offizielle Portal fuer die Online-Steuerabgabe.',
        'Die gesetzliche Abgabefrist steht in der Abgabenordnung.'
      ],
      mistakes: [
        'ELSTER-Aktivierung zu spaet starten.',
        'Frist versaeumen ohne Verlaengerung.'
      ],
      costs: 'ELSTER ist kostenlos; Steuerberatung kostet extra.',
      localNotes: 'Sonderregelungen koennen Fristen verschieben. Jaehrlich pruefen.',
      disclaimer: 'Praktische Hilfe, keine Steuerberatung.'
    },
    sources: guideSources.taxReturnSetup
  },
  {
    id: 'public-transport-decision',
    pillar: 'mobility',
    slug: 'public-transport-decision',
    updated: today,
    en: {
      title: 'Public Transport Decision: Is Deutschlandticket Right?',
      summary:
        'A quick decision framework based on price, coverage, and your monthly usage.',
      forWho: 'Commuters, students, and anyone budgeting for transit.',
      steps: [
        'Estimate your monthly spend using single tickets or local passes.',
        'Compare the total to the Deutschlandticket price.',
        'Confirm coverage (regional and local transport, not long-distance).',
        'Pick a provider and review cancellation rules.'
      ],
      facts: [
        'The Deutschlandticket is priced as a monthly subscription.',
        'It is valid on regional and local transport, not ICE/IC/EC.'
      ],
      mistakes: [
        'Comparing only one-way fares instead of a full month of trips.',
        'Assuming it covers long-distance travel.'
      ],
      costs: 'Compare your monthly total to the subscription price.',
      localNotes: 'Cancellation rules differ by provider.',
      disclaimer: 'Check provider terms for final conditions.'
    },
    de: {
      title: 'OePNV-Entscheidung: Lohnt sich das Deutschlandticket?',
      summary:
        'Ein schneller Vergleich von Preis, Geltung und deinem Monatsverbrauch.',
      forWho: 'Pendler, Studierende und alle mit regelmaessigen Fahrten.',
      steps: [
        'Monatskosten mit Einzeltickets oder lokalen Paessen schaetzen.',
        'Mit dem Deutschlandticket-Preis vergleichen.',
        'Geltung pruefen (Nah- und Regionalverkehr, kein ICE/IC/EC).',
        'Anbieter waehlen und Kuendigungsregeln lesen.'
      ],
      facts: [
        'Das Deutschlandticket ist ein Monatsabo.',
        'Es gilt im Regional- und Nahverkehr, nicht im Fernverkehr.'
      ],
      mistakes: [
        'Nur Einzelfahrten vergleichen statt Monatskosten.',
        'Fernverkehr als inklusive Leistung annehmen.'
      ],
      costs: 'Monatskosten mit dem Abo-Preis vergleichen.',
      localNotes: 'Kuendigungsregeln unterscheiden sich je Anbieter.',
      disclaimer: 'Details immer beim Anbieter pruefen.'
    },
    sources: guideSources.transportDecision
  }
];

const tools = [
  {
    id: 'rent',
    titleEn: 'Warmmiete Ratio',
    titleDe: 'Warmmiete-Quote',
    summaryEn: 'Check how much of your net income goes to warm rent.',
    summaryDe: 'Pruefe, wie viel deines Nettoeinkommens fuer Warmmiete draufgeht.'
  },
  {
    id: 'ticket',
    titleEn: 'Ticket Cost Comparison',
    titleDe: 'Ticket-Kostenvergleich',
    summaryEn: 'Compare single-ticket costs with a monthly subscription.',
    summaryDe: 'Vergleiche Einzeltickets mit einem Monatsabo.'
  }
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function cleanDist() {
  fs.rmSync(DIST, { recursive: true, force: true });
  ensureDir(DIST);
}

function copyDir(src, dest) {
  ensureDir(dest);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function renderHead({ lang, title, description, canonical, altLangPath }) {
  const alt = altLangPath
    ? `\n<link rel="alternate" hreflang="${lang === 'en' ? 'de' : 'en'}" href="${altLangPath}">`
    : '';
  return `
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${canonical}">${alt}
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${canonical}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="stylesheet" href="/assets/css/styles.css">
</head>`;
}

function renderHeader(lang, activePath, currentPath, altLangPath) {
  const items = navItems[lang]
    .map((item) => {
      const active = activePath === item.href ? 'active' : '';
      return `<a href="${item.href}" class="${active}">${item.label}</a>`;
    })
    .join('');

  const langLinks = Object.entries(site.languages)
    .map(([code, data]) => {
      const href = code === lang ? currentPath : altLangPath || data.prefix + '/';
      const current = code === lang ? 'current' : '';
      return `<a href="${href}" class="${current}">${data.label}</a>`;
    })
    .join('');

  return `
<header>
  <div class="container navbar">
    <a class="logo" href="/${lang}/">
      <span class="logo-mark"></span>
      <span>${site.name}</span>
    </a>
    <nav class="nav-links">${items}</nav>
    <div class="lang-switch">${langLinks}</div>
  </div>
</header>`;
}

function renderFooter(lang) {
  const base = lang === 'en' ? '/en' : '/de';
  return `
<footer class="footer">
  <div class="container footer-grid">
    <div>
      <div class="logo"><span class="logo-mark"></span> ${site.name}</div>
      <small>${lang === 'en' ? site.tagline : site.taglineDe}</small>
    </div>
    <div>
      <strong>${lang === 'en' ? 'Explore' : 'Entdecken'}</strong>
      <div><a href="${base}/guides/">${lang === 'en' ? 'Guides' : 'Guides'}</a></div>
      <div><a href="${base}/tools/">${lang === 'en' ? 'Tools' : 'Tools'}</a></div>
      <div><a href="${base}/editorial-standards/">${lang === 'en' ? 'Editorial Standards' : 'Redaktion'}</a></div>
    </div>
    <div>
      <strong>${lang === 'en' ? 'Legal' : 'Rechtliches'}</strong>
      <div><a href="${base}/legal/privacy/">${lang === 'en' ? 'Privacy' : 'Datenschutz'}</a></div>
      <div><a href="${base}/legal/impressum/">Impressum</a></div>
    </div>
    <div>
      <strong>${lang === 'en' ? 'Contact' : 'Kontakt'}</strong>
      <div>hello@lifehacksgermany.com</div>
      <small>${lang === 'en' ? 'Replace with your official contact.' : 'Bitte mit offizieller Kontaktadresse ersetzen.'}</small>
    </div>
  </div>
</footer>`;
}

function renderLayout({ lang, title, description, canonical, altLangPath, activePath, currentPath, body }) {
  return `<!doctype html>
<html lang="${lang}">
${renderHead({ lang, title, description, canonical, altLangPath })}
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  ${renderHeader(lang, activePath, currentPath, altLangPath)}
  <main id="main">${body}</main>
  ${renderFooter(lang)}
  <script src="/assets/js/app.js" defer></script>
</body>
</html>`;
}

function renderHome(lang) {
  const isEn = lang === 'en';
  const base = isEn ? '/en' : '/de';
  const heroTitle = isEn
    ? 'Smart Living: Your Guide to Life Hacks in Germany'
    : 'Smart Living: Dein Guide fuer Life Hacks in Deutschland';
  const heroCopy = isEn
    ? 'Simplify life in Germany with verified steps for money, taxes, housing, and daily systems.'
    : 'Vereinfache dein Leben in Deutschland mit verifizierten Schritten fuer Geld, Steuern, Wohnen und Alltag.';

  const pillarCards = Object.entries(pillars)
    .map(([key, data]) => {
      const entry = data[lang];
      return `
      <div class="card">
        <div class="tag">${isEn ? 'Pillar' : 'Bereich'}</div>
        <h3>${entry.title}</h3>
        <p>${entry.summary}</p>
        <a href="${base}/guides/${key}/">${isEn ? 'Open guides' : 'Guides ansehen'}</a>
      </div>`;
    })
    .join('');

  return `
<section class="hero">
  <div class="container hero-grid">
    <div>
      <span class="badge">${isEn ? 'Verification-first' : 'Verifizierung zuerst'}</span>
      <h1>${heroTitle}</h1>
      <p>${heroCopy}</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="${base}/start-here/">${isEn ? 'Start here' : 'Jetzt starten'}</a>
        <a class="btn btn-secondary" href="${base}/guides/">${isEn ? 'Browse guides' : 'Guides entdecken'}</a>
      </div>
      <div class="hero-stats">
        <div class="stat"><strong>${isEn ? 'Verified' : 'Verifiziert'}</strong>${isEn ? 'official sources' : 'offizielle Quellen'}</div>
        <div class="stat"><strong>5</strong>${isEn ? 'core pillars' : 'Kernbereiche'}</div>
        <div class="stat"><strong>${today}</strong>${isEn ? 'last verification' : 'letzte Pruefung'}</div>
      </div>
    </div>
    <div class="hero-card">
      <h3>${isEn ? 'Smart wins today' : 'Schnellgewinne heute'}</h3>
      <ul class="inline-list">
        <li>${isEn ? 'Know your Anmeldung deadline and get the landlord confirmation.' : 'Anmeldefrist kennen und Wohnungsgeberbestaetigung sichern.'}</li>
        <li>${isEn ? 'Check if your city supports online registration.' : 'Pruefen, ob Online-Anmeldung verfuegbar ist.'}</li>
        <li>${isEn ? 'Set up Rundfunkbeitrag early to avoid late fees.' : 'Rundfunkbeitrag frueh regeln, Mahngebuehren vermeiden.'}</li>
      </ul>
      <p class="stamp-line">${isEn ? 'Lets be a bit smarter than yesterday.' : 'Lass uns heute ein bisschen schlauer sein als gestern.'}</p>
      <p class="meta-line">${isEn ? 'All tips linked to official sources.' : 'Alle Tipps mit offiziellen Quellen.'}</p>
    </div>
  </div>
</section>

<section class="section map-section">
  <div class="container grid-2">
    <div>
      <h2 class="section-title">${isEn ? 'Germany in Maps' : 'Deutschland in Karten'}</h2>
      <p class="section-subtitle">${isEn ? 'We translate complex systems into simple routes you can follow. Start with the area that matters most to you.' : 'Wir uebersetzen komplexe Systeme in klare Wege. Starte mit dem Bereich, der dir am wichtigsten ist.'}</p>
      <div class="hero-actions">
        <a class="btn btn-secondary" href="${base}/start-here/">${isEn ? 'Build your route' : 'Deinen Weg starten'}</a>
      </div>
    </div>
    <div class="map-grid">
      <div class="map-card">
        <strong>${isEn ? 'Arrival map' : 'Ankunftskarte'}</strong>
        <span>${isEn ? 'Anmeldung, tax ID, health basics' : 'Anmeldung, Steuer-ID, Gesundheitsbasis'}</span>
      </div>
      <div class="map-card">
        <strong>${isEn ? 'Money map' : 'Geldkarte'}</strong>
        <span>${isEn ? 'Taxes, fees, and cost controls' : 'Steuern, Gebuehren, Kostenkontrolle'}</span>
      </div>
      <div class="map-card">
        <strong>${isEn ? 'Housing map' : 'Wohnkarte'}</strong>
        <span>${isEn ? 'Contracts, deposits, notice rules' : 'Vertraege, Kaution, Kuendigungsfristen'}</span>
      </div>
      <div class="map-card">
        <strong>${isEn ? 'Mobility map' : 'Mobilitaetskarte'}</strong>
        <span>${isEn ? 'Tickets, passes, daily routes' : 'Tickets, Abos, Tageswege'}</span>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2 class="section-title">${isEn ? 'Your roadmap by topic' : 'Dein Weg nach Thema'}</h2>
    <p class="section-subtitle">${isEn ? 'Navigate Germany with confidence. Each pillar includes step-by-step guides, verified facts, and tools.' : 'Navigiere Deutschland mit Klarheit. Jeder Bereich hat Schritt-fuer-Schritt-Guides, Fakten und Tools.'}</p>
    <div class="cards">${pillarCards}</div>
  </div>
</section>

<section class="section">
  <div class="container grid-2">
    <div class="highlight-band">
      <h2 class="section-title">${isEn ? 'Built like a newsroom' : 'Wie eine Redaktion gebaut'}</h2>
      <p>${isEn ? 'We track every fact with a source, a verification date, and a refresh cadence. If a rule changes, the guide updates within 72 hours.' : 'Jede Aussage hat Quelle, Datum und Aktualisierungsrhythmus. Bei Regelaenderungen aktualisieren wir binnen 72 Stunden.'}</p>
      <a class="btn btn-secondary" href="${base}/editorial-standards/">${isEn ? 'See our standards' : 'Redaktionsstandards'}</a>
    </div>
    <div class="content-shell">
      <h3>${isEn ? 'Most searched guides' : 'Beliebteste Guides'}</h3>
      <ul class="inline-list">
        <li><a href="${base}/guides/bureaucracy/anmeldung/">${isEn ? 'Anmeldung step-by-step' : 'Anmeldung Schritt-fuer-Schritt'}</a></li>
        <li><a href="${base}/guides/mobility/deutschlandticket/">Deutschlandticket</a></li>
        <li><a href="${base}/guides/money-taxes/rundfunkbeitrag/">Rundfunkbeitrag</a></li>
        <li><a href="${base}/guides/housing/mietkaution/">${isEn ? 'Rent deposit rules' : 'Mietkaution Regeln'}</a></li>
      </ul>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="content-shell">
      <h2>${isEn ? 'Newsletter: Germany in plain language' : 'Newsletter: Deutschland klar erklaert'}</h2>
      <p>${isEn ? 'A weekly update on money, bureaucracy, and deadlines. No spam.' : 'Woechentliches Update zu Geld, Behoerden und Fristen. Kein Spam.'}</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="${base}/start-here/">${isEn ? 'Join the list' : 'Eintragen'}</a>
        <a class="btn btn-secondary" href="${base}/guides/">${isEn ? 'Read guides' : 'Guides lesen'}</a>
      </div>
    </div>
  </div>
</section>`;
}

function renderStartHere(lang) {
  const isEn = lang === 'en';
  const base = isEn ? '/en' : '/de';
  return `
<section class="hero">
  <div class="container hero-grid">
    <div>
      <span class="badge">${isEn ? 'Personalized routes' : 'Persoenliche Wege'}</span>
      <h1>${isEn ? 'Start here: pick your path' : 'Start hier: waehl deinen Weg'}</h1>
      <p>${isEn ? 'Choose your situation to get the most relevant guides and tools in the right order.' : 'Waehle deine Situation, um die wichtigsten Guides und Tools in der richtigen Reihenfolge zu sehen.'}</p>
    </div>
    <div class="hero-card">
      <h3>${isEn ? 'What you will get' : 'Was du bekommst'}</h3>
      <ul class="inline-list">
        <li>${isEn ? 'A step-by-step checklist.' : 'Eine Schritt-fuer-Schritt-Checkliste.'}</li>
        <li>${isEn ? 'Verified links and deadlines.' : 'Verifizierte Links und Fristen.'}</li>
        <li>${isEn ? 'Tools to estimate costs.' : 'Tools zur Kostenschaetzung.'}</li>
      </ul>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2 class="section-title">${isEn ? 'Choose your profile' : 'Profil auswaehlen'}</h2>
    <div class="persona-grid">
      <button data-persona-btn="expat">${isEn ? 'Expat' : 'Expat'}</button>
      <button data-persona-btn="student">${isEn ? 'Student' : 'Studierende'}</button>
      <button data-persona-btn="local">${isEn ? 'German resident' : 'Deutsche'}</button>
    </div>

    <div class="persona-result" data-persona-result="expat">
      <h3>${isEn ? 'Expat starter pack' : 'Expat Starter-Paket'}</h3>
      <ul class="inline-list">
        <li><a href="${base}/guides/bureaucracy/anmeldung/">${isEn ? 'Anmeldung checklist' : 'Anmeldung Checkliste'}</a></li>
        <li><a href="${base}/guides/bureaucracy/steuer-id/">${isEn ? 'Get your Tax ID' : 'Steuer-ID erhalten'}</a></li>
        <li><a href="${base}/guides/everyday/health-insurance-basics/">${isEn ? 'Health insurance basics' : 'Krankenversicherung Grundlagen'}</a></li>
      </ul>
    </div>

    <div class="persona-result hidden" data-persona-result="student">
      <h3>${isEn ? 'Student essentials' : 'Studenten Essentials'}</h3>
      <ul class="inline-list">
        <li><a href="${base}/guides/mobility/deutschlandticket/">Deutschlandticket</a></li>
        <li><a href="${base}/guides/housing/mietkaution/">${isEn ? 'Rent deposit rules' : 'Mietkaution Regeln'}</a></li>
        <li><a href="${base}/guides/money-taxes/elster/">${isEn ? 'ELSTER setup' : 'ELSTER Setup'}</a></li>
      </ul>
    </div>

    <div class="persona-result hidden" data-persona-result="local">
      <h3>${isEn ? 'Local optimization' : 'Optimierung fuer Einheimische'}</h3>
      <ul class="inline-list">
        <li><a href="${base}/guides/money-taxes/rundfunkbeitrag/">Rundfunkbeitrag</a></li>
        <li><a href="${base}/guides/housing/kuendigungsfrist-miete/">${isEn ? 'Notice period rules' : 'Kuendigungsfrist'}</a></li>
        <li><a href="${base}/guides/money-taxes/tax-return-deadlines/">${isEn ? 'Tax deadlines' : 'Steuerfristen'}</a></li>
      </ul>
    </div>
  </div>
</section>

<section class="section">
  <div class="container highlight-band">
    <h2 class="section-title">${isEn ? 'Next: build your personal checklist' : 'Als naechstes: deine Checkliste'}</h2>
    <p>${isEn ? 'We will keep expanding this onboarding. For now, follow your chosen path and save the guides you need.' : 'Wir bauen dieses Onboarding weiter aus. Folge deinem Pfad und speichere relevante Guides.'}</p>
    <a class="btn btn-secondary" href="${base}/guides/">${isEn ? 'Browse all guides' : 'Alle Guides'}</a>
  </div>
</section>`;
}

function renderGuidesIndex(lang) {
  const isEn = lang === 'en';
  const base = isEn ? '/en' : '/de';
  const cards = Object.entries(pillars)
    .map(([key, data]) => {
      const entry = data[lang];
      return `
      <div class="card">
        <div class="tag">${isEn ? 'Pillar' : 'Bereich'}</div>
        <h3>${entry.title}</h3>
        <p>${entry.summary}</p>
        <a href="${base}/guides/${key}/">${isEn ? 'Open guides' : 'Guides ansehen'}</a>
      </div>`;
    })
    .join('');

  return `
<section class="hero">
  <div class="container hero-grid">
    <div>
      <span class="badge">${isEn ? 'Structured learning' : 'Strukturierter Einstieg'}</span>
      <h1>${isEn ? 'Guides by pillar' : 'Guides nach Bereichen'}</h1>
      <p>${isEn ? 'Start with a pillar, then drill down into step-by-step guides and checklists.' : 'Starte mit einem Bereich und gehe dann in Schritt-fuer-Schritt-Guides.'}</p>
    </div>
    <div class="hero-card">
      <h3>${isEn ? 'How we organize' : 'So strukturieren wir'}</h3>
      <ul class="inline-list">
        <li>${isEn ? 'Pillars = big topics.' : 'Bereiche = grobe Themen.'}</li>
        <li>${isEn ? 'Guides = step-by-step.' : 'Guides = Schritt-fuer-Schritt.'}</li>
        <li>${isEn ? 'Tools = calculators and checklists.' : 'Tools = Rechner und Checklisten.'}</li>
      </ul>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="cards">${cards}</div>
  </div>
</section>`;
}

function renderPillar(lang, pillarKey) {
  const isEn = lang === 'en';
  const base = isEn ? '/en' : '/de';
  const pillar = pillars[pillarKey][lang];
  const guidesInPillar = guides
    .filter((guide) => guide.pillar === pillarKey)
    .map((guide) => {
      const title = guide[lang].title;
      return `<li><a href="${base}/guides/${pillarKey}/${guide.slug}/">${title}</a></li>`;
    })
    .join('');

  const quickWins = guides
    .filter((guide) => guide.pillar === pillarKey)
    .slice(0, 3)
    .map((guide) => `<li>${guide[lang].summary}</li>`)
    .join('');

  return `
<section class="hero">
  <div class="container hero-grid">
    <div>
      <span class="badge">${isEn ? 'Pillar guide' : 'Bereich'}</span>
      <h1>${pillar.title}</h1>
      <p>${pillar.summary}</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="${base}/start-here/">${isEn ? 'Start here' : 'Starten'}</a>
        <a class="btn btn-secondary" href="${base}/tools/">${isEn ? 'See tools' : 'Tools ansehen'}</a>
      </div>
    </div>
    <div class="hero-card">
      <h3>${isEn ? 'Quick wins' : 'Schnellgewinne'}</h3>
      <ul class="inline-list">${quickWins}</ul>
    </div>
  </div>
</section>

<section class="section">
  <div class="container content-shell">
    <h2>${isEn ? 'Guides in this pillar' : 'Guides in diesem Bereich'}</h2>
    <ul class="inline-list">${guidesInPillar}</ul>
  </div>
</section>`;
}

function renderGuide(lang, guide) {
  const isEn = lang === 'en';
  const entry = guide[lang];
  const base = isEn ? '/en' : '/de';
  const steps = entry.steps.map((step, index) => `<div class="step"><span>${index + 1}</span><div>${step}</div></div>`).join('');
  const facts = entry.facts.map((fact) => `<div class="fact">${fact}</div>`).join('');
  const mistakes = entry.mistakes.map((item) => `<li>${item}</li>`).join('');
  const sources = guide.sources
    .map((source) => `<li><a href="${source.url}">${source.label}</a></li>`)
    .join('');

  return `
<section class="hero">
  <div class="container hero-grid">
    <div>
      <span class="badge">${isEn ? 'Verified guide' : 'Verifizierter Guide'}</span>
      <h1>${entry.title}</h1>
      <p>${entry.summary}</p>
      <p class="meta-line">${isEn ? 'Last verified' : 'Letzte Pruefung'}: ${guide.updated}</p>
    </div>
    <div class="hero-card">
      <h3>${isEn ? 'Who this is for' : 'Fur wen das gilt'}</h3>
      <p>${entry.forWho}</p>
      <div class="notice">${entry.disclaimer}</div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container grid-2">
    <div class="content-shell">
      <h2>${isEn ? 'Steps' : 'Schritte'}</h2>
      <div class="steps">${steps}</div>
    </div>
    <div class="content-shell">
      <h2>${isEn ? 'Verified facts' : 'Verifizierte Fakten'}</h2>
      <div class="facts">${facts}</div>
      <h3>${isEn ? 'Costs' : 'Kosten'}</h3>
      <p>${entry.costs}</p>
      <h3>${isEn ? 'Local notes' : 'Lokale Hinweise'}</h3>
      <p>${entry.localNotes}</p>
    </div>
  </div>
</section>

<section class="section">
  <div class="container grid-2">
    <div class="content-shell">
      <h2>${isEn ? 'Common mistakes' : 'Haufige Fehler'}</h2>
      <ul class="inline-list">${mistakes}</ul>
    </div>
    <div class="content-shell sources">
      <h2>${isEn ? 'Official sources' : 'Offizielle Quellen'}</h2>
      <ul class="inline-list">${sources}</ul>
      <p class="meta-line">${isEn ? 'We update this guide within 72 hours of official changes.' : 'Wir aktualisieren innerhalb von 72 Stunden nach offiziellen Aenderungen.'}</p>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="highlight-band">
      <h2>${isEn ? 'Continue with the next guide' : 'Weiter mit dem naechsten Guide'}</h2>
      <p>${isEn ? 'Browse the full pillar or jump to tools.' : 'Wechsle in den Bereich oder zu den Tools.'}</p>
      <div class="hero-actions">
        <a class="btn btn-secondary" href="${base}/guides/${guide.pillar}/">${isEn ? 'Back to pillar' : 'Zuruck zum Bereich'}</a>
        <a class="btn btn-primary" href="${base}/tools/">${isEn ? 'Tools' : 'Tools'}</a>
      </div>
    </div>
  </div>
</section>`;
}

function renderTools(lang) {
  const isEn = lang === 'en';
  const rentTitle = tools[0][isEn ? 'titleEn' : 'titleDe'];
  const rentSummary = tools[0][isEn ? 'summaryEn' : 'summaryDe'];
  const ticketTitle = tools[1][isEn ? 'titleEn' : 'titleDe'];
  const ticketSummary = tools[1][isEn ? 'summaryEn' : 'summaryDe'];

  return `
<section class="hero">
  <div class="container hero-grid">
    <div>
      <span class="badge">${isEn ? 'Practical tools' : 'Praktische Tools'}</span>
      <h1>${isEn ? 'Calculators and checklists' : 'Rechner und Checklisten'}</h1>
      <p>${isEn ? 'Quick tools to estimate costs and make decisions faster. We keep assumptions transparent.' : 'Schnelle Tools fuer Kosten und Entscheidungen. Annahmen sind transparent.'}</p>
    </div>
    <div class="hero-card">
      <h3>${isEn ? 'Built for speed' : 'Fur Tempo gebaut'}</h3>
      <ul class="inline-list">
        <li>${isEn ? 'No logins required.' : 'Kein Login erforderlich.'}</li>
        <li>${isEn ? 'Clear assumptions.' : 'Klare Annahmen.'}</li>
        <li>${isEn ? 'Export your notes.' : 'Notizen exportieren.'}</li>
      </ul>
    </div>
  </div>
</section>

<section class="section">
  <div class="container tools-grid">
    <div class="tool-card">
      <h3>${rentTitle}</h3>
      <p>${rentSummary}</p>
      <label>${isEn ? 'Monthly net income (EUR)' : 'Monatliches Nettoeinkommen (EUR)'}</label>
      <input type="number" min="0" data-tool-input="rent-income">
      <label>${isEn ? 'Warmmiete (EUR)' : 'Warmmiete (EUR)'}</label>
      <input type="number" min="0" data-tool-input="rent-warm">
      <button data-tool-submit="rent">${isEn ? 'Calculate ratio' : 'Quote berechnen'}</button>
      <div class="tool-output" data-tool-output="rent"></div>
    </div>
    <div class="tool-card">
      <h3>${ticketTitle}</h3>
      <p>${ticketSummary}</p>
      <label>${isEn ? 'Single ticket price (EUR)' : 'Einzelticket-Preis (EUR)'}</label>
      <input type="number" min="0" data-tool-input="ticket-single">
      <label>${isEn ? 'Trips per month' : 'Fahrten pro Monat'}</label>
      <input type="number" min="0" data-tool-input="ticket-trips">
      <button data-tool-submit="ticket">${isEn ? 'Compare costs' : 'Kosten vergleichen'}</button>
      <div class="tool-output" data-tool-output="ticket"></div>
    </div>
  </div>
</section>`;
}

function renderEditorial(lang) {
  const isEn = lang === 'en';
  return `
<section class="hero">
  <div class="container hero-grid">
    <div>
      <span class="badge">${isEn ? 'Editorial standards' : 'Redaktionsstandards'}</span>
      <h1>${isEn ? 'Verification-first publishing' : 'Verifizierung vor Veroeffentlichung'}</h1>
      <p>${isEn ? 'Every guide is built on official sources, labeled with a verification date, and reviewed on a schedule.' : 'Jeder Guide basiert auf offiziellen Quellen, hat ein Pruefdatum und wird regelmaessig aktualisiert.'}</p>
    </div>
    <div class="hero-card">
      <h3>${isEn ? 'Update cadence' : 'Update-Rhythmus'}</h3>
      <ul class="inline-list">
        <li>${isEn ? 'High volatility: monthly' : 'Hohe Dynamik: monatlich'}</li>
        <li>${isEn ? 'Medium volatility: quarterly' : 'Mittel: quartalsweise'}</li>
        <li>${isEn ? 'Low volatility: annually' : 'Niedrig: jaehrlich'}</li>
      </ul>
    </div>
  </div>
</section>

<section class="section">
  <div class="container content-shell">
    <h2>${isEn ? 'Our verification checklist' : 'Unsere Verifizierungs-Checkliste'}</h2>
    <ul class="inline-list">
      <li>${isEn ? 'Primary sources only for legal, tax, and health topics.' : 'Primarquellen fuer Recht, Steuern und Gesundheit.'}</li>
      <li>${isEn ? 'Every factual claim links to a source.' : 'Jede Tatsachenbehauptung hat eine Quelle.'}</li>
      <li>${isEn ? 'Each page shows a last verified date.' : 'Jede Seite zeigt das Pruefdatum.'}</li>
      <li>${isEn ? 'Changes are logged with a short summary.' : 'Aenderungen werden kurz protokolliert.'}</li>
    </ul>
  </div>
</section>`;
}

function renderLegal(lang, type) {
  const isEn = lang === 'en';
  if (type === 'privacy') {
    return `
<section class="hero">
  <div class="container hero-grid">
    <div>
      <span class="badge">${isEn ? 'Privacy' : 'Datenschutz'}</span>
      <h1>${isEn ? 'Privacy policy' : 'Datenschutzerklarung'}</h1>
      <p>${isEn ? 'We keep data collection minimal and transparent.' : 'Wir halten Datenerfassung minimal und transparent.'}</p>
    </div>
  </div>
</section>

<section class="section">
  <div class="container content-shell">
    <h2>${isEn ? 'Data we process' : 'Verarbeitete Daten'}</h2>
    <p>${isEn ? 'This site does not use cookies or tracking by default. If analytics are added later, this policy will be updated.' : 'Diese Website nutzt standardmaessig keine Cookies oder Tracking. Falls Analytics hinzugefuegt werden, aktualisieren wir diese Erklaerung.'}</p>
    <h2>${isEn ? 'Contact' : 'Kontakt'}</h2>
    <p>hello@lifehacksgermany.com</p>
    <p class="notice">${isEn ? 'Replace this placeholder with your official legal contact and privacy details.' : 'Bitte durch offizielle Kontaktdaten und rechtliche Angaben ersetzen.'}</p>
  </div>
</section>`;
  }

  return `
<section class="hero">
  <div class="container hero-grid">
    <div>
      <span class="badge">Impressum</span>
      <h1>Impressum</h1>
      <p>${isEn ? 'Required legal information for Germany.' : 'Rechtlich notwendige Angaben fuer Deutschland.'}</p>
    </div>
  </div>
</section>

<section class="section">
  <div class="container content-shell">
    <p>${isEn ? 'Please provide your official business name, address, and contact details here.' : 'Bitte hier den offiziellen Namen, Adresse und Kontaktdaten eintragen.'}</p>
    <p class="notice">${isEn ? 'Impressum details are mandatory for German websites.' : 'Impressum-Angaben sind fuer deutsche Websites verpflichtend.'}</p>
  </div>
</section>`;
}

function renderAbout(lang) {
  const isEn = lang === 'en';
  return `
<section class="hero">
  <div class="container hero-grid">
    <div>
      <span class="badge">${isEn ? 'About' : 'Ueber uns'}</span>
      <h1>${isEn ? 'A field guide for modern Germany' : 'Ein Field Guide fuer Deutschland'}</h1>
      <p>${isEn ? 'Life Hacks Germany exists to translate bureaucracy and daily life into clear, verified steps.' : 'Life Hacks Germany uebersetzt Buerokratie und Alltag in klare, verifizierte Schritte.'}</p>
    </div>
    <div class="hero-card">
      <h3>${isEn ? 'What we believe' : 'Woran wir glauben'}</h3>
      <ul class="inline-list">
        <li>${isEn ? 'Clarity beats complexity.' : 'Klarheit schlaegt Komplexitaet.'}</li>
        <li>${isEn ? 'Trust requires sources.' : 'Vertrauen braucht Quellen.'}</li>
        <li>${isEn ? 'People deserve practical answers.' : 'Menschen verdienen praktische Antworten.'}</li>
      </ul>
    </div>
  </div>
</section>`;
}

function renderRoot() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${site.name}</title>
  <meta name="description" content="${site.description}">
  <link rel="stylesheet" href="/assets/css/styles.css">
</head>
<body>
  <main class="hero">
    <div class="container hero-grid">
      <div>
        <span class="badge">Welcome</span>
        <h1>${site.name}</h1>
        <p>${site.description}</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="/en/">English</a>
          <a class="btn btn-secondary" href="/de/">Deutsch</a>
        </div>
      </div>
      <div class="hero-card">
        <h3>Choose your language</h3>
        <p>English is the primary edition. Deutsche Version folgt.</p>
      </div>
    </div>
  </main>
</body>
</html>`;
}

function writePage(outputPath, html) {
  const fullPath = path.join(DIST, outputPath);
  ensureDir(path.dirname(fullPath));
  fs.writeFileSync(fullPath, html);
}

function buildPages() {
  // Root selector
  writePage('index.html', renderRoot());

  for (const lang of ['en', 'de']) {
    const base = `/${lang}`;
    const canonicalBase = `https://lifehacksgermany.com${base}`;
    const metaDescription = lang === 'en' ? site.description : site.descriptionDe;

    const homeHtml = renderLayout({
      lang,
      title: `${site.name} | ${lang === 'en' ? 'Verified guidance for Germany' : 'Verifizierte Hilfe fuer Deutschland'}`,
      description: metaDescription,
      canonical: `${canonicalBase}/`,
      altLangPath: lang === 'en' ? 'https://lifehacksgermany.com/de/' : 'https://lifehacksgermany.com/en/',
      activePath: `${base}/`,
      currentPath: `${base}/`,
      body: renderHome(lang)
    });
    writePage(`${lang}/index.html`, homeHtml);

    const startHtml = renderLayout({
      lang,
      title: `${site.name} | ${lang === 'en' ? 'Start Here' : 'Start hier'}`,
      description: metaDescription,
      canonical: `${canonicalBase}/start-here/`,
      altLangPath: lang === 'en' ? 'https://lifehacksgermany.com/de/start-here/' : 'https://lifehacksgermany.com/en/start-here/',
      activePath: `${base}/start-here/`,
      currentPath: `${base}/start-here/`,
      body: renderStartHere(lang)
    });
    writePage(`${lang}/start-here/index.html`, startHtml);

    const guidesIndexHtml = renderLayout({
      lang,
      title: `${site.name} | ${lang === 'en' ? 'Guides' : 'Guides'}`,
      description: metaDescription,
      canonical: `${canonicalBase}/guides/`,
      altLangPath: lang === 'en' ? 'https://lifehacksgermany.com/de/guides/' : 'https://lifehacksgermany.com/en/guides/',
      activePath: `${base}/guides/`,
      currentPath: `${base}/guides/`,
      body: renderGuidesIndex(lang)
    });
    writePage(`${lang}/guides/index.html`, guidesIndexHtml);

    for (const pillarKey of Object.keys(pillars)) {
      const pillarHtml = renderLayout({
        lang,
        title: `${site.name} | ${pillars[pillarKey][lang].title}`,
        description: pillars[pillarKey][lang].summary,
        canonical: `${canonicalBase}/guides/${pillarKey}/`,
        altLangPath:
          lang === 'en'
            ? `https://lifehacksgermany.com/de/guides/${pillarKey}/`
            : `https://lifehacksgermany.com/en/guides/${pillarKey}/`,
        activePath: `${base}/guides/`,
        currentPath: `${base}/guides/${pillarKey}/`,
        body: renderPillar(lang, pillarKey)
      });
      writePage(`${lang}/guides/${pillarKey}/index.html`, pillarHtml);
    }

    for (const guide of guides) {
      const guideHtml = renderLayout({
        lang,
        title: `${site.name} | ${guide[lang].title}`,
        description: guide[lang].summary,
        canonical: `${canonicalBase}/guides/${guide.pillar}/${guide.slug}/`,
        altLangPath:
          lang === 'en'
            ? `https://lifehacksgermany.com/de/guides/${guide.pillar}/${guide.slug}/`
            : `https://lifehacksgermany.com/en/guides/${guide.pillar}/${guide.slug}/`,
        activePath: `${base}/guides/`,
        currentPath: `${base}/guides/${guide.pillar}/${guide.slug}/`,
        body: renderGuide(lang, guide)
      });
      writePage(`${lang}/guides/${guide.pillar}/${guide.slug}/index.html`, guideHtml);
    }

    const toolsHtml = renderLayout({
      lang,
      title: `${site.name} | ${lang === 'en' ? 'Tools' : 'Tools'}`,
      description: metaDescription,
      canonical: `${canonicalBase}/tools/`,
      altLangPath: lang === 'en' ? 'https://lifehacksgermany.com/de/tools/' : 'https://lifehacksgermany.com/en/tools/',
      activePath: `${base}/tools/`,
      currentPath: `${base}/tools/`,
      body: renderTools(lang)
    });
    writePage(`${lang}/tools/index.html`, toolsHtml);

    const editorialHtml = renderLayout({
      lang,
      title: `${site.name} | ${lang === 'en' ? 'Editorial Standards' : 'Redaktion'}`,
      description: metaDescription,
      canonical: `${canonicalBase}/editorial-standards/`,
      altLangPath:
        lang === 'en'
          ? 'https://lifehacksgermany.com/de/editorial-standards/'
          : 'https://lifehacksgermany.com/en/editorial-standards/',
      activePath: `${base}/editorial-standards/`,
      currentPath: `${base}/editorial-standards/`,
      body: renderEditorial(lang)
    });
    writePage(`${lang}/editorial-standards/index.html`, editorialHtml);

    const aboutHtml = renderLayout({
      lang,
      title: `${site.name} | ${lang === 'en' ? 'About' : 'Ueber uns'}`,
      description: metaDescription,
      canonical: `${canonicalBase}/about/`,
      altLangPath: lang === 'en' ? 'https://lifehacksgermany.com/de/about/' : 'https://lifehacksgermany.com/en/about/',
      activePath: `${base}/about/`,
      currentPath: `${base}/about/`,
      body: renderAbout(lang)
    });
    writePage(`${lang}/about/index.html`, aboutHtml);

    const privacyHtml = renderLayout({
      lang,
      title: `${site.name} | ${lang === 'en' ? 'Privacy' : 'Datenschutz'}`,
      description: metaDescription,
      canonical: `${canonicalBase}/legal/privacy/`,
      altLangPath:
        lang === 'en'
          ? 'https://lifehacksgermany.com/de/legal/privacy/'
          : 'https://lifehacksgermany.com/en/legal/privacy/',
      activePath: `${base}/legal/privacy/`,
      currentPath: `${base}/legal/privacy/`,
      body: renderLegal(lang, 'privacy')
    });
    writePage(`${lang}/legal/privacy/index.html`, privacyHtml);

    const impressumHtml = renderLayout({
      lang,
      title: `${site.name} | Impressum`,
      description: metaDescription,
      canonical: `${canonicalBase}/legal/impressum/`,
      altLangPath:
        lang === 'en'
          ? 'https://lifehacksgermany.com/de/legal/impressum/'
          : 'https://lifehacksgermany.com/en/legal/impressum/',
      activePath: `${base}/legal/impressum/`,
      currentPath: `${base}/legal/impressum/`,
      body: renderLegal(lang, 'impressum')
    });
    writePage(`${lang}/legal/impressum/index.html`, impressumHtml);
  }
}

function buildSitemap() {
  const urls = [];
  const base = 'https://lifehacksgermany.com';
  const pushUrl = (url) => urls.push(`<url><loc>${url}</loc></url>`);

  pushUrl(`${base}/`);
  for (const lang of ['en', 'de']) {
    const prefix = `${base}/${lang}`;
    pushUrl(`${prefix}/`);
    pushUrl(`${prefix}/start-here/`);
    pushUrl(`${prefix}/guides/`);
    pushUrl(`${prefix}/tools/`);
    pushUrl(`${prefix}/editorial-standards/`);
    pushUrl(`${prefix}/about/`);
    pushUrl(`${prefix}/legal/privacy/`);
    pushUrl(`${prefix}/legal/impressum/`);
    for (const pillarKey of Object.keys(pillars)) {
      pushUrl(`${prefix}/guides/${pillarKey}/`);
    }
    for (const guide of guides) {
      pushUrl(`${prefix}/guides/${guide.pillar}/${guide.slug}/`);
    }
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`;
  writePage('sitemap.xml', sitemap);
  writePage('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`);
}

function build() {
  cleanDist();
  copyDir(ASSETS_SRC, path.join(DIST, 'assets'));
  buildPages();
  buildSitemap();
}

build();
