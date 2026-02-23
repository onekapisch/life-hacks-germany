import type { Lang } from "./i18n";
import { pillars } from "./i18n";
import { getAllGuides } from "./guides";
import { getAllBlogPosts } from "./blog";

export type SearchKind = "guide" | "blog" | "tool" | "page" | "pillar";

export interface SearchItem {
  title: string;
  summary: string;
  href: string;
  kind: SearchKind;
  section?: string;
}

type SearchIndexItem = SearchItem & {
  searchText: string;
  titleNorm: string;
  summaryNorm: string;
  textNorm: string;
};

type StaticSearchEntry = SearchItem & {
  keywords: string;
};

const CACHE_TTL_MS = 5 * 60 * 1000;
const indexCache = new Map<Lang, { expiresAt: number; items: SearchIndexItem[] }>();

const STATIC_PAGES = {
  en: [
    {
      title: "Start Here",
      summary: "Personalized route for expats, students, and residents.",
      href: "/en/start-here",
      kind: "page" as const,
      section: "onboarding",
      keywords: "start here checklist route onboarding germany newcomer expat student local",
    },
    {
      title: "All Guides",
      summary: "Browse all verified step-by-step guides by pillar.",
      href: "/en/guides",
      kind: "page" as const,
      section: "guides",
      keywords: "guides bureaucracy money taxes housing mobility everyday life",
    },
    {
      title: "Tips & Hacks",
      summary: "Short tactical workflows and quick wins for Germany.",
      href: "/en/tips",
      kind: "page" as const,
      section: "tips",
      keywords: "tips hacks quick wins shortcuts",
    },
    {
      title: "Top Changes in Germany",
      summary: "Monthly updates that affect expats, students, and locals.",
      href: "/en/blog",
      kind: "page" as const,
      section: "blog",
      keywords: "blog updates monthly changes germany 2026 law price visa tax transport",
    },
    {
      title: "Tools & Calculators",
      summary: "Interactive calculators for salary, rent, tax, and planning.",
      href: "/en/tools",
      kind: "page" as const,
      section: "tools",
      keywords:
        "tools calculators gross net salary city cost of living rent ratio tax estimator permit timeline blocked account emergency fund",
    },
    {
      title: "About Life Hacks Germany",
      summary: "Mission, methodology, and verification approach.",
      href: "/en/about",
      kind: "page" as const,
      section: "about",
      keywords: "about mission methodology verification",
    },
    {
      title: "Editorial Standards",
      summary: "How facts are sourced, verified, and updated.",
      href: "/en/editorial-standards",
      kind: "page" as const,
      section: "editorial",
      keywords: "editorial standards verification official sources updates",
    },
    {
      title: "Privacy",
      summary: "Privacy policy, analytics, and newsletter data usage.",
      href: "/en/legal/privacy",
      kind: "page" as const,
      section: "legal",
      keywords: "privacy policy analytics cookies personal data newsletter",
    },
    {
      title: "Impressum",
      summary: "Legal contact and publisher information.",
      href: "/en/legal/impressum",
      kind: "page" as const,
      section: "legal",
      keywords: "impressum legal contact publisher",
    },
  ],
  de: [
    {
      title: "Start hier",
      summary: "Personalisierter Weg fuer Expats, Studierende und Residents.",
      href: "/de/start-here",
      kind: "page" as const,
      section: "onboarding",
      keywords: "start hier checklist route onboarding deutschland neuankunft expat studium",
    },
    {
      title: "Alle Guides",
      summary: "Alle verifizierten Schritt-fuer-Schritt Guides nach Themen.",
      href: "/de/guides",
      kind: "page" as const,
      section: "guides",
      keywords: "guides buerokratie geld steuern wohnen mobilitaet alltag",
    },
    {
      title: "Tipps & Hacks",
      summary: "Kurze, praktische Workflows fuer den Alltag in Deutschland.",
      href: "/de/tips",
      kind: "page" as const,
      section: "tips",
      keywords: "tipps hacks quick wins",
    },
    {
      title: "Top-Aenderungen in Deutschland",
      summary: "Monatliche Updates fuer Expats, Studierende und Locals.",
      href: "/de/blog",
      kind: "page" as const,
      section: "blog",
      keywords: "blog updates monatliche aenderungen deutschland 2026 gesetz preis visum steuer verkehr",
    },
    {
      title: "Tools & Rechner",
      summary: "Interaktive Rechner fuer Gehalt, Miete, Steuer und Planung.",
      href: "/de/tools",
      kind: "page" as const,
      section: "tools",
      keywords:
        "tools rechner brutto netto gehalt stadt kosten miete steuer sperrkonto notfallfonds aufenthalt",
    },
    {
      title: "Ueber uns",
      summary: "Mission, Arbeitsweise und Verifizierungsansatz.",
      href: "/de/about",
      kind: "page" as const,
      section: "about",
      keywords: "ueber uns mission verifizierung",
    },
    {
      title: "Redaktionelle Standards",
      summary: "Wie Fakten recherchiert, verifiziert und aktualisiert werden.",
      href: "/de/editorial-standards",
      kind: "page" as const,
      section: "editorial",
      keywords: "redaktion standards verifizierung offizielle quellen",
    },
    {
      title: "Datenschutz",
      summary: "Datenschutzerklaerung, Analyse und Newsletterdaten.",
      href: "/de/legal/privacy",
      kind: "page" as const,
      section: "legal",
      keywords: "datenschutz analytics cookies personenbezogene daten newsletter",
    },
    {
      title: "Impressum",
      summary: "Rechtliche Angaben und Kontakt.",
      href: "/de/legal/impressum",
      kind: "page" as const,
      section: "legal",
      keywords: "impressum rechtliches kontakt",
    },
  ],
} as const;

const TOOL_ENTRIES: Record<Lang, StaticSearchEntry[]> = {
  en: [
    {
      title: "Last Train Home + Weekend Escape Finder",
      summary: "Find late return trains and rank weekend escapes by duration, weather, and fare fit.",
      href: "/en/tools#last-train-weekend-escape",
      kind: "tool",
      section: "tools",
      keywords:
        "last train home weekend escape finder germany db train late night return city trip weather budget",
    },
    {
      title: "Gross-to-Net + City Surplus Calculator",
      summary: "Estimate net salary and compare monthly surplus across two German cities.",
      href: "/en/tools#gross-net-city-surplus",
      kind: "tool",
      section: "tools",
      keywords:
        "gross net salary calculator city cost of living berlin munich hamburg frankfurt cologne tax class",
    },
    {
      title: "Warmmiete Ratio Calculator",
      summary: "Check if your warm rent is in a healthy range for your monthly net income.",
      href: "/en/tools#warmmiete-ratio",
      kind: "tool",
      section: "tools",
      keywords: "warmmiete rent ratio rent affordability housing budget",
    },
    {
      title: "Ticket Cost Comparison",
      summary: "Compare single tickets vs monthly pass to find the cheaper commute option.",
      href: "/en/tools#ticket-cost-comparison",
      kind: "tool",
      section: "tools",
      keywords: "deutschlandticket monthly pass transport ticket comparison",
    },
    {
      title: "Tax Return Savings Estimator",
      summary: "Estimate potential tax refund based on income, commute distance, and deductions.",
      href: "/en/tools#tax-return-savings",
      kind: "tool",
      section: "tools",
      keywords: "tax return refund steuererklaerung elster deductions",
    },
    {
      title: "Move-In Budget Planner",
      summary: "Plan upfront housing costs including deposit, first rent, and setup expenses.",
      href: "/en/tools#move-in-budget",
      kind: "tool",
      section: "tools",
      keywords: "move in budget kaution deposit first rent setup costs",
    },
    {
      title: "Blocked Account Planner",
      summary: "Calculate blocked account required amount and your current funding gap.",
      href: "/en/tools#blocked-account",
      kind: "tool",
      section: "tools",
      keywords: "blocked account sperrkonto student visa funding",
    },
    {
      title: "Emergency Fund Runway",
      summary: "See how many months your savings can cover essential monthly spending.",
      href: "/en/tools#emergency-fund-runway",
      kind: "tool",
      section: "tools",
      keywords: "emergency fund runway savings monthly expenses buffer",
    },
    {
      title: "Permit Timeline Planner",
      summary: "Set your latest safe start date for residence permit renewal.",
      href: "/en/tools#permit-timeline",
      kind: "tool",
      section: "tools",
      keywords: "permit renewal residence title aufenthalt extension deadline",
    },
  ],
  de: [
    {
      title: "Last Train Home + Weekend Escape Finder",
      summary: "Spaete Heimfahrten finden und Wochenendtrips nach Dauer, Wetter und Preis-Fit sortieren.",
      href: "/de/tools#last-train-weekend-escape",
      kind: "tool",
      section: "tools",
      keywords:
        "letzter zug heimweg wochenendtrip finder deutschland bahn spaet nacht rueckfahrt wetter budget",
    },
    {
      title: "Brutto-Netto + Stadt-Ueberschuss Rechner",
      summary: "Nettogehalt schaetzen und Monatsplus in zwei deutschen Staedten vergleichen.",
      href: "/de/tools#gross-net-city-surplus",
      kind: "tool",
      section: "tools",
      keywords:
        "brutto netto rechner stadt lebenshaltungskosten berlin muenchen hamburg frankfurt koeln steuerklasse",
    },
    {
      title: "Warmmiete-Quote Rechner",
      summary: "Pruefen, ob deine Warmmiete in einem gesunden Bereich liegt.",
      href: "/de/tools#warmmiete-ratio",
      kind: "tool",
      section: "tools",
      keywords: "warmmiete quote mietbelastung wohnen budget",
    },
    {
      title: "Ticket-Kostenvergleich",
      summary: "Einzeltickets und Monatsabo vergleichen fuer den guenstigeren Pendelweg.",
      href: "/de/tools#ticket-cost-comparison",
      kind: "tool",
      section: "tools",
      keywords: "deutschlandticket abo oepnv ticket vergleich",
    },
    {
      title: "Steuererstattungs-Schaetzer",
      summary: "Moegliche Rueckerstattung aus Einkommen, Pendelweg und Absetzungen abschaetzen.",
      href: "/de/tools#tax-return-savings",
      kind: "tool",
      section: "tools",
      keywords: "steuererklaerung rueckerstattung elster absetzungen",
    },
    {
      title: "Einzugsbudget-Planer",
      summary: "Startkosten fuer Wohnung inklusive Kaution, erste Miete und Einrichtung planen.",
      href: "/de/tools#move-in-budget",
      kind: "tool",
      section: "tools",
      keywords: "einzug budget kaution erste miete umzugskosten",
    },
    {
      title: "Sperrkonto-Planer",
      summary: "Benoetigte Sperrkonto-Summe und Finanzierungsluecke berechnen.",
      href: "/de/tools#blocked-account",
      kind: "tool",
      section: "tools",
      keywords: "sperrkonto studienvisum finanzierung",
    },
    {
      title: "Notfallfonds-Reichweite",
      summary: "Berechnen, wie viele Monate deine Ersparnisse die Fixkosten decken.",
      href: "/de/tools#emergency-fund-runway",
      kind: "tool",
      section: "tools",
      keywords: "notfallfonds reichweite ersparnisse fixkosten puffer",
    },
    {
      title: "Aufenthaltstitel-Zeitplaner",
      summary: "Spaetesten sicheren Starttermin fuer Verlaengerung festlegen.",
      href: "/de/tools#permit-timeline",
      kind: "tool",
      section: "tools",
      keywords: "aufenthaltstitel verlaengerung frist termin",
    },
  ],
};

const TOKEN_EXPANSIONS: Record<string, string[]> = {
  anmeldung: ["registration", "address registration", "wohnsitzanmeldung"],
  registration: ["anmeldung", "address registration"],
  steuern: ["tax", "taxes", "steuer", "steuererklaerung"],
  steuer: ["tax", "taxes", "steuern", "steuererklaerung"],
  tax: ["steuer", "steuern", "steuererklaerung", "elster"],
  taxid: ["steuer-id", "steuer id", "tax id"],
  "tax-id": ["steuer-id", "steuer id", "tax id"],
  miete: ["rent", "warmmiete", "kaltmiete"],
  rent: ["miete", "warmmiete", "kaltmiete"],
  krankenversicherung: ["health insurance", "gkv", "pkv"],
  health: ["krankenversicherung", "gkv", "pkv"],
  bank: ["konto", "girokonto", "bank account"],
  konto: ["bank", "girokonto", "bank account"],
  sperrkonto: ["blocked account"],
  blocked: ["sperrkonto", "blocked account"],
  deutschlandticket: ["ticket", "oepnv", "transport", "db"],
  ticket: ["deutschlandticket", "oepnv", "transport", "bahn"],
  visa: ["visum", "blue card", "aufenthalt"],
  visum: ["visa", "aufenthalt", "blue card"],
};

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/ß/g, "ss")
    .toLowerCase();
}

function tokenize(value: string): string[] {
  return normalizeText(value)
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

function expandTokens(tokens: string[]): string[] {
  const out = new Set<string>(tokens);
  for (const token of tokens) {
    const expansions = TOKEN_EXPANSIONS[token];
    if (!expansions) continue;
    for (const synonym of expansions) {
      for (const expanded of tokenize(synonym)) {
        out.add(expanded);
      }
    }
  }
  return [...out];
}

function staticItemsFor(lang: Lang): SearchIndexItem[] {
  const baseEntries: StaticSearchEntry[] = [...STATIC_PAGES[lang], ...TOOL_ENTRIES[lang]];

  const items = baseEntries.map((entry) => {
    const text = `${entry.title} ${entry.summary} ${entry.keywords}`;
    return {
      title: entry.title,
      summary: entry.summary,
      href: entry.href,
      kind: entry.kind,
      section: entry.section,
      searchText: text,
      titleNorm: normalizeText(entry.title),
      summaryNorm: normalizeText(entry.summary),
      textNorm: normalizeText(text),
    };
  });

  const pillarItems = (Object.keys(pillars) as Array<keyof typeof pillars>).map((pillarKey) => {
    const pillar = pillars[pillarKey][lang];
    const href = `/${lang}/guides/${pillarKey}`;
    const text = `${pillar.title} ${pillar.summary} ${String(pillarKey)}`;
    return {
      title: pillar.title,
      summary: pillar.summary,
      href,
      kind: "pillar" as const,
      section: String(pillarKey),
      searchText: text,
      titleNorm: normalizeText(pillar.title),
      summaryNorm: normalizeText(pillar.summary),
      textNorm: normalizeText(text),
    };
  });

  return [...items, ...pillarItems];
}

function buildSearchIndex(lang: Lang): SearchIndexItem[] {
  const cached = indexCache.get(lang);
  if (cached && cached.expiresAt > Date.now()) return cached.items;

  const guideItems = getAllGuides(lang).map((guide) => {
    const fm = guide.frontmatter;
    const searchText = [
      fm.title,
      fm.summary,
      fm.forWho,
      fm.costs,
      fm.localNotes,
      fm.disclaimer,
      ...fm.steps,
      ...fm.facts,
      ...fm.mistakes,
      ...(fm.sources ?? []).map((source) => source.label),
      ...(fm.offers ?? []).map((offer) => `${offer.label} ${offer.note ?? ""}`),
      guide.content,
    ].join(" ");

    return {
      title: fm.title,
      summary: fm.summary,
      href: `/${lang}/guides/${fm.pillar}/${fm.slug}`,
      kind: "guide" as const,
      section: fm.pillar,
      searchText,
      titleNorm: normalizeText(fm.title),
      summaryNorm: normalizeText(fm.summary),
      textNorm: normalizeText(searchText),
    };
  });

  const blogItems = getAllBlogPosts(lang).map((post) => {
    const fm = post.frontmatter;
    const searchText = [
      fm.title,
      fm.summary,
      fm.audience,
      ...fm.highlights,
      ...(fm.sources ?? []).map((source) => source.label),
      post.content,
    ].join(" ");

    return {
      title: fm.title,
      summary: fm.summary,
      href: `/${lang}/blog/${fm.slug}`,
      kind: "blog" as const,
      section: "blog",
      searchText,
      titleNorm: normalizeText(fm.title),
      summaryNorm: normalizeText(fm.summary),
      textNorm: normalizeText(searchText),
    };
  });

  const items = [...staticItemsFor(lang), ...guideItems, ...blogItems];
  indexCache.set(lang, { expiresAt: Date.now() + CACHE_TTL_MS, items });
  return items;
}

function kindBoost(kind: SearchKind): number {
  switch (kind) {
    case "guide":
      return 8;
    case "blog":
      return 6;
    case "tool":
      return 7;
    case "page":
      return 3;
    case "pillar":
      return 2;
    default:
      return 0;
  }
}

function scoreItem(item: SearchIndexItem, queryNorm: string, tokens: string[]): number {
  let score = kindBoost(item.kind);
  let matchedTokens = 0;

  if (item.titleNorm.includes(queryNorm)) score += 120;
  if (item.summaryNorm.includes(queryNorm)) score += 60;
  if (item.textNorm.includes(queryNorm)) score += 30;

  for (const token of tokens) {
    let tokenScore = 0;
    if (item.titleNorm.includes(token)) tokenScore = 30;
    else if (item.summaryNorm.includes(token)) tokenScore = 16;
    else if (item.textNorm.includes(token)) tokenScore = 8;

    if (tokenScore > 0) matchedTokens += 1;
    score += tokenScore;
  }

  if (matchedTokens === 0) return 0;
  if (matchedTokens === tokens.length) score += 40;
  return score;
}

function dedupeByHref(items: SearchItem[]): SearchItem[] {
  const map = new Map<string, SearchItem>();
  for (const item of items) {
    map.set(item.href, item);
  }
  return [...map.values()];
}

export function getDefaultSearchItems(lang: Lang, limit = 8): SearchItem[] {
  const index = buildSearchIndex(lang);
  const suggestions = index
    .filter((item) => item.kind === "page" || item.kind === "tool" || item.kind === "guide")
    .slice(0, Math.max(limit * 2, limit))
    .map(({ title, summary, href, kind, section }) => ({
      title,
      summary,
      href,
      kind,
      section,
    }));
  return dedupeByHref(suggestions).slice(0, limit);
}

export function getSearchSuggestions(lang: Lang, limit = 8): SearchItem[] {
  return getDefaultSearchItems(lang, limit);
}

export function searchSite(lang: Lang, query: string, limit = 20): SearchItem[] {
  const trimmed = query.trim();
  if (!trimmed) return getDefaultSearchItems(lang, limit);

  const queryNorm = normalizeText(trimmed);
  const baseTokens = tokenize(trimmed);
  const tokens = expandTokens(baseTokens);

  const scored = buildSearchIndex(lang)
    .map((item) => ({
      item,
      score: scoreItem(item, queryNorm, tokens),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
    .slice(0, Math.max(limit * 2, limit))
    .map(({ item }) => ({
      title: item.title,
      summary: item.summary,
      href: item.href,
      kind: item.kind,
      section: item.section,
    }));

  return dedupeByHref(scored).slice(0, limit);
}
