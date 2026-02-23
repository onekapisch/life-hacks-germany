import { NextResponse } from "next/server";
import { getDefaultSearchItems, searchSite } from "@/lib/search";
import type { Lang } from "@/lib/i18n";

const SUPPORTED_LANGS = new Set<Lang>(["en", "de"]);
const DEFAULT_LIMIT = 8;
const MAX_LIMIT = 50;

function parseLimit(rawLimit: string | null): number {
  if (!rawLimit) return DEFAULT_LIMIT;
  const parsed = Number.parseInt(rawLimit, 10);
  if (!Number.isFinite(parsed)) return DEFAULT_LIMIT;
  return Math.min(Math.max(parsed, 1), MAX_LIMIT);
}

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requestedLang = searchParams.get("lang");
  const query = (searchParams.get("q") ?? "").trim();
  const limit = parseLimit(searchParams.get("limit"));
  const lang = (requestedLang ?? "en") as Lang;

  if (!SUPPORTED_LANGS.has(lang)) {
    return NextResponse.json(
      { error: "Unsupported language." },
      { status: 400 }
    );
  }

  const items = query
    ? searchSite(lang, query, limit)
    : getDefaultSearchItems(lang, limit);

  return NextResponse.json(
    { query, items },
    {
      headers: {
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=86400",
      },
    }
  );
}
