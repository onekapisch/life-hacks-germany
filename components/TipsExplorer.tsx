"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Lang, PillarKey } from "@/lib/i18n";

type TipItem = {
  slug: string;
  href: string;
  title: string;
  summary: string;
  updated: string;
  pillar: PillarKey;
  pillarTitle: string;
  toolCount: number;
};

type TipsExplorerProps = {
  lang: Lang;
  tips: TipItem[];
  openTipLabel: string;
};

type GroupedCategory = {
  key: PillarKey;
  label: string;
  items: TipItem[];
};

const pillarOrder: PillarKey[] = [
  "bureaucracy",
  "money-taxes",
  "housing",
  "mobility",
  "everyday",
];

function dateToTimestamp(value: string): number {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
}

function sortTips(items: TipItem[]): TipItem[] {
  return [...items].sort((a, b) => {
    const byDate = dateToTimestamp(b.updated) - dateToTimestamp(a.updated);
    if (byDate !== 0) return byDate;
    return a.title.localeCompare(b.title);
  });
}

function formatDate(value: string, lang: Lang): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "de-DE", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(parsed);
}

function getToolBadgeText(toolCount: number, lang: Lang): string {
  if (lang === "en") {
    return toolCount === 1 ? "1 tool suggestion" : `${toolCount} tool suggestions`;
  }

  return toolCount === 1 ? "1 Tool-Hinweis" : `${toolCount} Tool-Hinweise`;
}

function copyForLang(lang: Lang) {
  if (lang === "de") {
    return {
      filterHeading: "Nach Kategorie filtern",
      filterHint: "Waehle einen Bereich, um nur relevante Tipps zu sehen.",
      allCategories: "Alle Kategorien",
      showingPrefix: "Angezeigt:",
      showingSuffix: "Tipps",
      tipsLabel: "Tipps",
      noResults:
        "Keine Tipps in dieser Kategorie gefunden. Waehle eine andere Kategorie.",
    };
  }

  return {
    filterHeading: "Filter by category",
    filterHint: "Choose a category to focus only on the most relevant tips.",
    allCategories: "All categories",
    showingPrefix: "Showing:",
    showingSuffix: "tips",
    tipsLabel: "tips",
    noResults: "No tips found for this category. Pick another category.",
  };
}

function TipCard({
  tip,
  lang,
  openTipLabel,
}: {
  tip: TipItem;
  lang: Lang;
  openTipLabel: string;
}) {
  return (
    <Link
      href={tip.href}
      className="card no-underline text-ink flex flex-col gap-3 h-full !p-5 text-center"
    >
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <span className="badge-solid">{tip.pillarTitle}</span>
        <span className="text-[0.65rem] uppercase tracking-[0.14em] text-ink-3">
          {formatDate(tip.updated, lang)}
        </span>
      </div>

      <h3 className="text-[1.28rem] md:text-[1.42rem] leading-[1.2] tracking-tight font-black m-0">
        {tip.title}
      </h3>

      <p
        className="text-sm text-ink-2 m-0 leading-relaxed"
        style={{
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 3,
          overflow: "hidden",
        }}
      >
        {tip.summary}
      </p>

      <div className="mt-auto pt-2 flex items-center justify-center gap-3 flex-wrap">
        {tip.toolCount > 0 ? (
          <span className="text-[0.68rem] uppercase tracking-[0.13em] text-ink-3">
            {getToolBadgeText(tip.toolCount, lang)}
          </span>
        ) : (
          <span />
        )}

        <span className="text-xs font-bold uppercase tracking-[0.12em] text-accent-2">
          {openTipLabel} &rarr;
        </span>
      </div>
    </Link>
  );
}

export default function TipsExplorer({
  lang,
  tips,
  openTipLabel,
}: TipsExplorerProps) {
  const copy = copyForLang(lang);
  const [activeCategory, setActiveCategory] = useState<"all" | PillarKey>("all");

  const groupedCategories = useMemo<GroupedCategory[]>(() => {
    return pillarOrder
      .map((pillar) => {
        const items = sortTips(tips.filter((tip) => tip.pillar === pillar));
        if (items.length === 0) return null;

        return {
          key: pillar,
          label: items[0].pillarTitle,
          items,
        };
      })
      .filter((entry): entry is GroupedCategory => entry !== null);
  }, [tips]);

  const visibleTips = useMemo(
    () =>
      sortTips(
        tips.filter((tip) => activeCategory === "all" || tip.pillar === activeCategory)
      ),
    [activeCategory, tips]
  );

  return (
    <div className="space-y-8">
      <div className="content-shell !p-5 md:!p-6">
        <div className="flex flex-col gap-3 items-center text-center">
          <div className="max-w-2xl">
            <p className="m-0 text-[0.72rem] uppercase tracking-[0.14em] text-ink-3 font-bold">
              {copy.filterHeading}
            </p>
            <p className="m-0 mt-2 text-sm text-ink-2">{copy.filterHint}</p>
          </div>

          <p className="m-0 text-sm text-ink-3">
            {copy.showingPrefix}{" "}
            <strong className="text-ink font-black">{visibleTips.length}</strong>{" "}
            {copy.showingSuffix}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            className={`px-4 py-2 rounded-full text-xs md:text-sm font-bold border transition-colors ${
              activeCategory === "all"
                ? "bg-ink text-paper border-ink"
                : "bg-paper text-ink-2 border-ink/10 hover:bg-paper-2"
            }`}
            onClick={() => setActiveCategory("all")}
            aria-pressed={activeCategory === "all"}
          >
            {copy.allCategories} ({tips.length})
          </button>

          {groupedCategories.map((category) => {
            const isActive = activeCategory === category.key;
            return (
              <button
                key={category.key}
                type="button"
                className={`px-4 py-2 rounded-full text-xs md:text-sm font-bold border transition-colors ${
                  isActive
                    ? "bg-ink text-paper border-ink"
                    : "bg-paper text-ink-2 border-ink/10 hover:bg-paper-2"
                }`}
                onClick={() => setActiveCategory(category.key)}
                aria-pressed={isActive}
              >
                {category.label} ({category.items.length})
              </button>
            );
          })}
        </div>
      </div>

      {visibleTips.length === 0 ? (
        <div className="content-shell text-center !py-12">
          <p className="m-0 text-ink-2">{copy.noResults}</p>
        </div>
      ) : activeCategory === "all" ? (
        <div className="space-y-10">
          {groupedCategories.map((category) => (
            <section key={category.key} className="space-y-4">
              <div className="flex flex-col items-center justify-center text-center gap-2">
                <h2 className="text-2xl md:text-[2rem] leading-none font-black tracking-tight m-0">
                  {category.label}
                </h2>
                <span className="badge">
                  {category.items.length} {copy.tipsLabel}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.items.map((tip) => (
                  <TipCard
                    key={tip.slug}
                    tip={tip}
                    lang={lang}
                    openTipLabel={openTipLabel}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visibleTips.map((tip) => (
            <TipCard
              key={tip.slug}
              tip={tip}
              lang={lang}
              openTipLabel={openTipLabel}
            />
          ))}
        </div>
      )}
    </div>
  );
}
