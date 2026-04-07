# Full SEO Audit Report — lifehacksgermany.com
**Audit Date:** 2026-04-07
**Scope:** Full bilingual site (EN + DE), 88 indexed URLs
**Stack:** Next.js 16.1.6 / React 19 / Tailwind CSS 4 / Vercel (fra1)

---

## Overall SEO Health Score: 69 / 100

| Category | Weight | Score | Weighted |
|---|---|---|---|
| Technical SEO | 22% | 74 | 16.3 |
| Content Quality | 23% | 68 | 15.6 |
| On-Page SEO | 20% | 70 | 14.0 |
| Schema / Structured Data | 10% | 72 | 7.2 |
| Performance (CWV) | 10% | 70 | 7.0 |
| AI Search Readiness | 10% | 61 | 6.1 |
| Images | 5% | 70 | 3.5 |
| **Total** | | | **69.7 / 100** |

---

## Business Type Detected
**Expat information & utility publisher** — bilingual editorial site serving international residents in Germany. Primary content type: procedural guides, financial tools, legal deadline trackers. No brick-and-mortar or local service component. YMYL-adjacent (tax, health insurance, visa categories).

---

## Top 5 Critical Issues

1. **Draft guides are indexed and crawlable** — 4+ pages with `draft: true` return HTTP 200 + `index, follow`, polluting Google's quality signals
2. **Root redirect is temporary (307)** — all backlinks to `lifehacksgermany.com/` lose PageRank; not cached by browser or Vercel CDN
3. **`llms.txt` returns HTTP 500** — AI crawlers have no machine-readable site directory; a server error is visible to every AI crawler
4. **FAQPage schema is auto-generated boilerplate** — "What should I know about: [statement]?" pattern never triggers rich results or AI citations
5. **No named authors anywhere** — critical E-E-A-T gap for YMYL-adjacent content covering taxes, visas, and health insurance

## Top 5 Quick Wins

1. Change `permanent: false` → `permanent: true` in `next.config.ts` (1 char, fixes 307 redirect)
2. Add `if (fm.draft) { return { robots: { index: false, follow: false } } }` in `generateMetadata` (5 lines, fixes indexed draft pages)
3. Create `/public/llms.txt` with guide directory (2-4 hours, massive GEO impact)
4. Add `"x-default"` to hreflang in `generateMetadata` and `sitemap.ts` (15 minutes)
5. Trim all meta descriptions to ≤155 chars (audit `summary` frontmatter field lengths)

---

## Technical SEO — Score: 74/100

### CRITICAL

**C-1: Draft guides are publicly indexed**
File: `app/[lang]/guides/[pillar]/[slug]/page.tsx`
Pages affected: `kulturpass-maximizer-hack`, `local-library-networking-hack`, `offline-gps-safety-hack`, `sunday-shopping-survival-hack` — all returning HTTP 200 + `index, follow`. The sitemap generator correctly skips drafts but the page template never emits `noindex` for them. `/en/guides/everyday/offline-gps-safety-hack` is actively linked from the homepage, creating a direct crawl path to an unfinished page.

**Fix:**
```ts
// In generateMetadata inside [slug]/page.tsx
if (fm.draft) {
  return { robots: { index: false, follow: false } };
}
```

**C-2: Root redirect is 307 (Temporary), not 301/308**
File: `next.config.ts` line 73: `permanent: false`
A 307 is non-cacheable. All backlinks to `lifehacksgermany.com/` lose PageRank and each visit hits the origin rather than the Vercel edge cache. Observed live: `HTTP/2 307` on root.

**Fix:** Change `permanent: false` → `permanent: true`

### HIGH

**H-1: x-default hreflang missing everywhere**
Neither HTML `<head>` link elements nor the sitemap `<xhtml:link>` entries declare `hreflang="x-default"`. Since `/` redirects to `/en`, the English version is the de facto default and must be explicitly declared.

**Fix:** In `generateMetadata` (`[lang]/layout.tsx`), add `"x-default": "https://www.lifehacksgermany.com/en/..."` to the `alternates.languages` object. Mirror in `sitemap.ts`.

**H-2: Sitemap gap — 88 live URLs vs. stated inventory**
Live sitemap contains 88 `<loc>` entries (44 EN + 44 DE). If 5 draft guides are excluded (correct), expected count is 68 guide URLs + other static/blog pages. Audit `getAllGuides('en')` at build time to verify no silent drops.

**H-3: article:published_time = article:modified_time on all guides**
Guides lack a separate `published` frontmatter field — `updated` is used for both timestamps. Creates inaccurate freshness signals.

**Fix:** Add `published` field to guide frontmatter; use it for `publishedTime`, `updated` for `modifiedTime`.

**H-4: No preconnect for Google Fonts (verify)**
`next/font/google` self-hosts WOFF2 files so this may be already correct. Verify via DevTools that no requests hit `fonts.googleapis.com` at runtime.

### MEDIUM

**M-1: CSP includes `'unsafe-inline'` for `script-src`**
Neutralises XSS protection for inline scripts. Replace with nonces (Next.js 14+ supports CSP nonces via middleware) or hashes.

**M-2: HSTS missing `includeSubDomains` and `preload`**
Current: `max-age=63072000`. Should be: `max-age=63072000; includeSubDomains; preload`. Then submit to hstspreload.org.

**M-3: `og:locale:alternate` not declared**
English pages don't declare `de_DE` as an alternate locale and vice versa. Fix in `generateMetadata` `openGraph` config.

**M-4: IndexNow not implemented**
Supported by Bing, Yandex, Naver. Generate key, place at `/public/{key}.txt`, ping on deployment.

**M-5: LCP hero image missing `fetchpriority="high"`**
The `<Image>` component has a `<link rel="preload">` but the `fetchpriority` attribute is missing from the `<img>` element. Ensure `priority` prop is set on the hero `<Image>`.

### LOW

**L-1: `<meta name="keywords">` tag present on all guide pages** — Google has ignored this since 2009. Remove.

**L-2: `application-name`, `creator`, `publisher` meta tags** — no ranking value. Remove from `createPublisherMetadata()` in `lib/seo.ts`.

**L-3: `Host:` directive in robots.txt** — Yandex-only, ignored by Google/Bing. Remove.

**L-4: `priority` and `changefreq` in sitemap** — Google ignores both. Remove to reduce payload.

---

## Content Quality — Score: 68/100

### E-E-A-T Breakdown
| Dimension | Score |
|---|---|
| Experience | 45/100 — No named authors, no first-person signals |
| Expertise | 72/100 — Strong legal citations and 2026 quantitative values |
| Authoritativeness | 50/100 — Editorial standards page is good; no external recognition |
| Trustworthiness | 78/100 — Impressum, Privacy, HTTPS, disclaimers; @gmx.de email hurts |

### CRITICAL: Thin Content Cluster

| File | Body Words | Issue |
|---|---|---|
| `essential-germany-app-stack.mdx` | 146 | Critically thin — mostly frontmatter |
| `freelancer-registration.mdx` | 324 | High-stakes topic missing Kleinunternehmerregelung, VAT cadence, Gewerbesteuer |
| `driving-license-conversion.mdx` | 395 | Complex multi-country rules need 1,000+ words |
| `rental-contract-checklist.mdx` | 374 | Checklist without explanatory depth |

### HIGH

**H-1: No named authors anywhere**
About page describes "a small team" with no names. Guide pages, Article schema, and the About page all use Organization-level attribution. Full anonymity is a QRG trust risk for YMYL-adjacent content.

**H-2: Draft guides may appear in `relatedGuides` of live guides**
Creates live internal links pointing to 404 pages. Audit every `relatedGuides` array against `draft: true` status.

**H-3: FAQPage auto-generated from `facts` with "What should I know about: [statement]?" pattern**
Not natural-language questions. Does not trigger rich results and suppresses AI citation eligibility.

### MEDIUM

**M-1: Meta descriptions exceed 160 chars on all sampled pages** — `summary` frontmatter appears to be the source; add character limit validation or separate `metaDescription` field.

**M-2: `hrefLang` attribute uses camelCase in rendered HTML** — HTML spec requires lowercase `hreflang`. Minor parsing inconsistency across some crawlers.

**M-3: DE guide content systematically 30-40% shorter than EN equivalents** — Anmeldung DE: 419 words vs EN: 601. DE-language users receive a thinner product.

**M-4: Contact email is `@gmx.de`** — free provider domain on a site advising on official German processes reduces trust perception. Use `contact@lifehacksgermany.com`.

### LOW

**L-1: Homepage title is 87 characters** — SERP display threshold is ~60-65 chars. Will truncate.

---

## Schema / Structured Data — Score: 72/100

### Schema Stack Per Page Type

| Page | Schemas |
|---|---|
| Homepage | WebSite, Organization, FAQPage |
| Guide pages | WebSite, Organization, Article, HowTo, FAQPage, BreadcrumbList |
| Blog index | WebSite, Organization, BreadcrumbList, ItemList |
| Blog posts | WebSite, Organization, Article, BreadcrumbList |

### CRITICAL

**C-1: HowTo schema is a deprecated Google rich result type**
HowTo rich results were permanently retired by Google in September 2023. All guide pages emit dead `HowTo` JSON-LD that consumes script weight with zero SERP benefit.

**Fix:** Remove the `type: "howto"` `JsonLd` call from guide page templates. Fold step content into `Article` using `hasPart` with `HowToStep` objects.

**C-2: FAQPage questions are auto-generated boilerplate**
Questions formatted as "What should I know about: [statement]?" will not trigger Google FAQ rich results or AI snippet citations. Replace with manually authored, natural-language question/answer pairs in a new `faqs` frontmatter array.

### HIGH

**H-1: Article `publisher` block missing `logo` ImageObject**
Google's Article rich result spec requires `publisher.logo` as an `ImageObject`. Current publisher block has no logo — fails Rich Results Test.

**Fix:**
```json
"publisher": {
  "@type": "Organization",
  "name": "Life Hacks Germany",
  "url": "https://www.lifehacksgermany.com",
  "logo": {
    "@type": "ImageObject",
    "url": "https://www.lifehacksgermany.com/icons/logo.svg",
    "width": 600,
    "height": 60
  }
}
```

**H-2: `Organization.logo` is a plain string URL, not `ImageObject`**
Same fix pattern as above applies to `getOrganizationSchema()`.

**H-3: `estimatedCost.value` is a prose sentence, not a numeric value**
`MonetaryAmount.value` should be `0` for free processes, not a descriptive sentence.

### MEDIUM

**M-1: `Organization.sameAs` missing** — Add social profile URLs for entity disambiguation.

**M-2: `Organization.publishingPrinciples` hardcoded to `/en/` on DE homepage** — DE locale emits an EN-only URL. Consider locale-aware editorial standards page.

**M-3: Blog posts use generic `Article` instead of `NewsArticle`** — The "Top Changes in Germany" posts are news-adjacent; `NewsArticle` enables Top Stories carousel eligibility.

---

## Performance (CWV) — Score: 70/100

**Baseline metrics (fra1 Vercel edge):**
- TTFB: ~87ms (Excellent — well under 200ms threshold)
- HTML payload: 15.2 KB Brotli / 93.9 KB uncompressed
- Vercel cache: HIT (ISR functioning correctly)
- JS chunks: ~196 KB gzipped (acceptable)

### CRITICAL

**C-1: Root 307 redirect adds 80–160ms latency to LCP** — See Technical C-2.

### HIGH

**H-1: WebGL shader hero runs an unbounded `requestAnimationFrame` loop**
File: `components/ui/animated-shader-hero.tsx`
The shader loop fires every ~16ms forever while mounted, competing with the main thread on every frame. On mid-range mobile this pushes event latency above the 200ms INP threshold. No `IntersectionObserver` pause guard exists. `prefers-reduced-motion` is entirely ignored.

**Fix (priority order):**
1. Add `IntersectionObserver` to pause/resume the rAF loop when canvas is off-screen
2. Cap render rate to 30fps on mobile using `performance.now()` delta gating
3. Add `prefers-reduced-motion` CSS animation fallback
4. Add `document.hidden` listener to pause when tab is backgrounded

**H-2: Hero image is 347.9 KB JPEG — no native AVIF/WebP source**
File: `public/images/hero/berlin-brandon-gate.jpg`
Next.js transcodes on-demand but first-hit cold edge requests are slow. Convert and commit as AVIF (target ≤80 KB) and WebP (target ≤120 KB).

**H-3: Font stack mismatch — `globals.css` overrides `next/font` variables**
`globals.css` `@theme` defines `--font-sans: "Lato"` and `--font-display: "Montserrat"` — fonts that are never loaded. The Google Fonts loaded via `next/font` (Cormorant Garamond, Manrope) may not be applied. Hardcoded font names need to be removed; `next/font` class variables should own those tokens.

### MEDIUM

**M-1: HTML `cache-control: max-age=0, must-revalidate`** — Browser doesn't cache HTML locally; every navigation triggers conditional revalidation. Consider short `max-age` for non-personalised pages.

**M-2: Analytics component hydration cost** — Two `useEffect` / state cycles fire on every page load even for non-consenting users. Migrate cookie consent to a server-readable cookie to eliminate the hydration round-trip.

**M-3: `@vercel/analytics` listed in dependencies but not imported** — Confirm it is tree-shaken via bundle analysis; remove if unused.

### LOW

**L-1: Global `scroll-behavior: smooth`** — Interferes with browser scroll optimisations and INP. Apply only to specific scroll containers.

---

## AI Search Readiness (GEO) — Score: 61/100

| Platform | Score |
|---|---|
| Google AI Overviews | 58/100 |
| ChatGPT web search | 52/100 |
| Perplexity | 64/100 |
| Bing Copilot | 61/100 |

### CRITICAL

**C-1: `llms.txt` returns HTTP 500** — No machine-readable site directory for AI systems. The 500 error suggests a server-side issue beyond just a missing file.

**Create `/public/llms.txt`:**
```
# Life Hacks Germany
> Verification-first guides for expats and locals living in Germany.
> Languages: English (EN) and German (DE)
> Contact: golifehacks@gmx.de

## Guides
- [Anmeldung: Register Your Address](https://www.lifehacksgermany.com/en/guides/bureaucracy/anmeldung)
- [ELSTER: German Tax Portal](https://www.lifehacksgermany.com/en/guides/money-taxes/elster)
[... all 39 guides ...]
```

### HIGH

**H-1: robots.txt uses only wildcard — no explicit AI crawler rules**
Named explicit rules are more reliable than implicit wildcard coverage for emerging AI crawlers.

**Fix in `app/robots.ts`:**
```ts
rules: [
  {
    userAgent: ["GPTBot", "OAI-SearchBot", "ClaudeBot", "PerplexityBot"],
    allow: "/",
  },
  { userAgent: "*", allow: "/", disallow: ["/api/"] },
]
```

**H-2: Section headings are human-readable, not query-format**
AI systems and Google AIO preferentially cite passages where the heading matches a natural-language query. Convert H2/H3 headings on top-10 guides to question format.

| Current | Recommended |
|---|---|
| "Legal timing: what the two-week rule means" | "How long do I have to complete Anmeldung after moving in?" |
| "Document set that prevents rework" | "What documents do I need for Anmeldung?" |
| "What ELSTER actually is" | "What is ELSTER and what can I use it for?" |
| "The two-system model in practice" | "What is the difference between GKV and PKV?" |

**H-3: No named author entity weakens AI citation eligibility for YMYL topics**
See Content H-1. Replace `"@type": "Organization"` author with `"@type": "Person"` in `getArticleSchema()`.

**H-4: No YouTube or Reddit presence**
YouTube presence has the highest measured correlation (~0.737) with AI citation frequency. Reddit mention signals are second. Both are currently zero.

### MEDIUM

**M-1: FAQ content exists only in JSON-LD, not in visible page HTML**
Google AIO prefers when FAQ Q&A appears visibly on page, not just in schema.

**M-2: Passage lengths average 90-120 words** — Slightly below the 134-167 word optimal AI citation range.

**What's already working well:**
Government-source citations (`gesetze-im-internet.de`, `bundesregierung.de`) carry high authority signals. SSR architecture ensures full content accessibility for AI crawlers. Editorial standards page with `publishingPrinciples` in Organization schema is a meaningful E-E-A-T signal. 2026 fact currency (specific EUR thresholds, named legislation) differentiates content from generic guides.

---

## Sitemap — Score: 74/100

**Live sitemap:** 88 URLs (44 EN + 44 DE)
**Structure:** Valid XML 1.0 UTF-8, correct `urlset` namespace, `xhtml` namespace declared

### MEDIUM

**M-1: `x-default` hreflang missing from all 88 entries** — Add to `sitemap.ts`.

**M-2: Uniform `lastmod` on all 26 static pages** — All show `2026-04-02` from `getLatestSiteUpdateDate()`. Google treats uniform dates as unreliable, undermining the accurate per-guide dates. Replace with accurate per-page dates or omit `lastmod` for static pages.

### LOW

**L-1: `<priority>` and `<changefreq>` on all 88 URLs** — Google ignores both. Remove.

**L-2: EN/DE guide `lastmod` dates differ by 1 day for 8 guides** — Verify these reflect actual edit dates, not a translation batch artefact.

**All 15 sampled URLs returned HTTP 200** — no orphaned or 404 URLs.

---

## Visual / Mobile — Score: 78/100

### Screenshots captured
- `screenshots/desktop_home.png` — Desktop 1920×1080 homepage
- `screenshots/mobile_home.png` — Mobile 375×812 homepage
- `screenshots/desktop_guide.png` — Desktop Anmeldung guide
- `screenshots/mobile_guide.png` — Mobile Anmeldung guide
- `screenshots/tablet_home.png` — Tablet 768×1024 homepage
- `screenshots/og_image.png` — OG image

### H1 above fold: PASS on all viewports (267px on desktop, 221px on mobile)

### MEDIUM

**M-1: Cookie banner covers primary CTAs on mobile (375px)**
The consent banner is 282px tall and obscures the "START HERE" / "BROWSE GUIDES" hero CTAs on first visit. Redesign as a slim bottom bar (max 80-90px) — satisfies GDPR while preserving above-fold CTA visibility.

### LOW

**L-1: Theme toggle and language switch touch targets under 48px** — Utility nav controls at 35×34px and 37×22px. Increase padding to meet WCAG 2.5.5 minimum.

**L-2: Guide pages contain zero images** — No inline images, diagrams, or screenshots. Misses image search visibility and increases bounce risk on long-form pages.

**L-3: Cookie banner may contribute to CLS** — Verify CLS score in PageSpeed Insights.

### PASS
- No horizontal scroll at 375px
- All images have alt text
- OG image: HTTP 200, 189 KB, dynamically generated per page — excellent
- 6-schema stack on guide pages confirmed
- Body font 18px, H1 36px on mobile — readable without zoom
- No layout shift observed in hero area

---

## What's Already Working Well

- **Server-side rendering** — All content in initial HTML; no JS required for Googlebot or AI crawlers
- **TTFB: 87ms** from Frankfurt edge — excellent baseline
- **Hreflang symmetry** — Every EN page has correct DE alternate and vice versa
- **BreadcrumbList** — Accurate, absolute URLs, correct position numbering
- **Vercel ISR cache** — HIT on all sampled pages, ages 14-19 hours
- **Security headers** — CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy all present
- **Legal compliance** — Impressum, Privacy page, HTTPS, disclaimers on every guide
- **Government source citations** — Tier-1 German authority sources cited with section-level precision
- **OG image** — Dynamically generated per page, correctly sized, strong social sharing UX
- **39 verified guides** — Consistent update cadence with real `lastmod` dates on guide and blog pages
- **GA4 consent-gated** — `afterInteractive` strategy; no analytics blocks render
