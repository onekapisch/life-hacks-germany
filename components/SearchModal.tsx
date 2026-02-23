"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import type { Lang } from "@/lib/i18n";

type SearchKind = "guide" | "blog" | "tool" | "page" | "pillar";

interface SearchItem {
  title: string;
  summary: string;
  href: string;
  kind: SearchKind;
}

interface SearchApiResponse {
  items?: SearchItem[];
}

export default function SearchModal({
  lang,
  onClose,
}: {
  lang: Lang;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const trimmedQuery = query.trim();

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 200);
    return () => window.clearTimeout(handle);
  }, [query]);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    async function loadResults() {
      setIsLoading(true);
      setHasError(false);
      try {
        const params = new URLSearchParams({
          lang,
          limit: "8",
        });
        if (debouncedQuery) {
          params.set("q", debouncedQuery);
        }
        const res = await fetch(`/api/search?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!active) return;
        if (!res.ok) {
          setHasError(true);
          setResults([]);
          return;
        }
        const data: SearchApiResponse = await res.json();
        if (!active) return;
        setResults(Array.isArray(data.items) ? data.items : []);
      } catch (error) {
        if (active && (error as Error).name !== "AbortError") {
          setHasError(true);
          setResults([]);
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }
    void loadResults();
    return () => {
      active = false;
      controller.abort();
    };
  }, [debouncedQuery, lang]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const kindLabel = (kind: SearchKind): string => {
    if (lang === "de") {
      if (kind === "guide") return "Guide";
      if (kind === "blog") return "Blog";
      if (kind === "tool") return "Tool";
      if (kind === "pillar") return "Bereich";
      return "Seite";
    }
    if (kind === "guide") return "Guide";
    if (kind === "blog") return "Blog";
    if (kind === "tool") return "Tool";
    if (kind === "pillar") return "Pillar";
    return "Page";
  };

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[rgba(15,23,42,0.06)]">
          <svg className="w-5 h-5 text-ink-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={lang === "en" ? "Search guides, tools, tips..." : "Guides, Tools, Tipps suchen..."}
            className="flex-1 bg-transparent text-ink text-sm outline-none placeholder:text-ink-3"
          />
          <kbd
            className="text-[0.6rem] px-1.5 py-0.5 rounded bg-paper-3 text-ink-3 font-mono cursor-pointer"
            onClick={onClose}
          >
            ESC
          </kbd>
        </div>

        <div className="overflow-y-auto flex-1 max-h-[50vh]">
          {isLoading && (
            <div className="px-5 py-8 text-center text-sm text-ink-3">
              {lang === "en" ? "Searching..." : "Suche laeuft..."}
            </div>
          )}
          {!isLoading && hasError && (
            <div className="px-5 py-8 text-center text-sm text-ink-3">
              {lang === "en" ? "Search is temporarily unavailable." : "Suche ist voruebergehend nicht verfuegbar."}
            </div>
          )}
          {!isLoading && !hasError && results.length === 0 && (
            <div className="px-5 py-8 text-center text-sm text-ink-3">
              {lang === "en" ? "No results found" : "Keine Ergebnisse gefunden"}
            </div>
          )}
          {!isLoading && !hasError && results.length > 0 && (
            <div className="py-2">
              {results.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="flex flex-col gap-0.5 px-5 py-3 hover:bg-paper-2 transition-colors no-underline"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[0.62rem] px-2 py-0.5 rounded-full bg-paper-3 text-ink-3 uppercase tracking-[0.08em] font-bold">
                      {kindLabel(item.kind)}
                    </span>
                    <span className="text-sm font-semibold text-ink">{item.title}</span>
                  </div>
                  <span className="text-xs text-ink-3 line-clamp-1">{item.summary}</span>
                </Link>
              ))}
            </div>
          )}

          {trimmedQuery.length > 0 && (
            <div className="px-5 pb-4 pt-2 border-t border-[rgba(15,23,42,0.06)]">
              <Link
                href={`/${lang}/search?q=${encodeURIComponent(trimmedQuery)}`}
                onClick={onClose}
                className="text-xs font-semibold text-accent-2 no-underline hover:underline"
              >
                {lang === "en" ? "View all results" : "Alle Ergebnisse anzeigen"} &rarr;
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
