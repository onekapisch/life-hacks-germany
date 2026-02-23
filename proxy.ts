import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SUPPORTED_LANGS = ["en", "de"] as const;
const NON_LOCALIZED_EXACT_PATHS = new Set([
  "/",
  "/favicon.ico",
  "/icon",
  "/apple-icon",
  "/opengraph-image",
  "/twitter-image",
  "/manifest.json",
  "/robots.txt",
  "/sitemap.xml",
]);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip Next internals, API routes, static assets, and metadata files.
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/icons") ||
    pathname.includes(".") ||
    NON_LOCALIZED_EXACT_PATHS.has(pathname)
  ) {
    return NextResponse.next();
  }

  const pathnameHasLang = SUPPORTED_LANGS.some(
    (lang) => pathname === `/${lang}` || pathname.startsWith(`/${lang}/`)
  );
  if (pathnameHasLang) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/en${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
