# SEO Action Plan — lifehacksgermany.com
**Generated:** 2026-04-07 | **Overall Score:** 69/100
**Reference:** See `FULL-AUDIT-REPORT.md` for full findings and code examples

---

## CRITICAL — Fix Immediately

### 1. Noindex draft guide pages
**File:** `app/[lang]/guides/[pillar]/[slug]/page.tsx` — `generateMetadata`
**Impact:** Stops thin/unfinished content from polluting Google's quality signals for the entire domain
**Effort:** 30 minutes

Add early return in `generateMetadata`:
```ts
if (fm.draft) {
  return { robots: { index: false, follow: false } };
}
```
Also remove any homepage links to draft guide slugs.

---

### 2. Change root redirect from 307 to 308 (permanent)
**File:** `next.config.ts` line ~73
**Impact:** Passes full PageRank from backlinks to `/en`; eliminates redirect latency for repeat visitors; enables CDN caching of redirect
**Effort:** 5 minutes

```ts
// Change:
permanent: false,
// To:
permanent: true,
```

---

### 3. Create `/public/llms.txt`
**Impact:** Makes 39 guides discoverable to ChatGPT, Perplexity, and Bing Copilot without requiring a full crawl; the HTTP 500 currently returned is visible to every AI crawler
**Effort:** 2-4 hours

Minimum viable file at `/public/llms.txt`:
```
# Life Hacks Germany
> Verification-first guides for expats and locals living in Germany.
> Languages: English (EN), German (DE)
> Contact: golifehacks@gmx.de

## Guides
- [Anmeldung](https://www.lifehacksgermany.com/en/guides/bureaucracy/anmeldung)
- [ELSTER](https://www.lifehacksgermany.com/en/guides/money-taxes/elster)
- [Health Insurance Basics](https://www.lifehacksgermany.com/en/guides/everyday/health-insurance-basics)
[... all 39 EN guides ...]
[... all 39 DE guides ...]
```

---

### 4. Remove deprecated HowTo schema from guide pages
**File:** `components/JsonLd.tsx` + guide page template
**Impact:** Eliminates dead schema weight; replaces with valid Article `hasPart` pattern
**Effort:** 2 hours

Remove `type="howto"` JsonLd calls from guide pages. Fold steps into Article schema using `hasPart: [{ "@type": "HowToStep", "position": 1, ... }]`.

---

### 5. Expand 4 critically thin guides
**Priority order:**
1. `content/guides/en/freelancer-registration.mdx` (324 words) — add Kleinunternehmerregelung threshold, VAT Voranmeldung cadence, Gewerbesteuer applicability, EU vs. non-EU paths
2. `content/guides/en/driving-license-conversion.mdx` (395 words) — add country-specific paths, timeline by license origin, cost breakdown
3. `content/guides/en/essential-germany-app-stack.mdx` (146 words) — body is critically short; expand with rationale, alternatives, and setup guidance per app
4. `content/guides/en/rental-contract-checklist.mdx` (374 words) — add explanatory context for each checklist item

**Target:** 800-1,000+ words each with worked examples, specific values, edge-case coverage
**Effort:** 1-2 days per guide

---

## HIGH — Fix Within 1 Week

### 6. Fix Article publisher logo (required for Google Rich Results Test)
**File:** `components/JsonLd.tsx` — `getArticleSchema()` and `getOrganizationSchema()`
**Effort:** 1 hour

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
Apply same pattern to `Organization.logo`.

---

### 7. Add `x-default` hreflang everywhere
**Files:** `app/[lang]/layout.tsx` (generateMetadata) + `app/sitemap.ts`
**Effort:** 30 minutes

In `generateMetadata`, add to `alternates.languages`:
```ts
"x-default": `https://www.lifehacksgermany.com/en${path}`,
```
In `sitemap.ts`, add the x-default entry to each URL's `alternates.languages` map.

---

### 8. Rewrite FAQPage schema to use natural-language questions
**File:** `app/[lang]/guides/[pillar]/[slug]/page.tsx` + guide frontmatter
**Effort:** 1 day for schema change + 30 min per guide to add `faqs` frontmatter

Add `faqs` array to guide frontmatter (example for anmeldung):
```yaml
faqs:
  - q: "How long do I have to register my address in Germany after moving in?"
    a: "You have 14 days after moving in, as required by Section 17 BMG."
  - q: "Is Anmeldung free in Germany?"
    a: "Yes, registration itself is free in most cities."
  - q: "What documents do I need for Anmeldung?"
    a: "A valid passport or national ID, a completed registration form, and a Wohnungsgeberbestätigung from your landlord."
```
Update `getFaqSchema()` to consume `faqs` array when present; fall back to existing pattern otherwise.

---

### 9. Add named author — introduce editorial byline
**Files:** `app/[lang]/about/page.tsx`, `components/JsonLd.tsx`, guide page template
**Effort:** Half day

- Add at least one named author persona to the About page with credentials
- Surface a byline on guide pages above the content
- Update Article schema `author` from `"@type": "Organization"` to `"@type": "Person"` with `name`, `url`, and optionally `sameAs`

---

### 10. Audit and fix `relatedGuides` references to draft content
**Effort:** 1 hour (scripted check)

Run across all live guide frontmatter and remove/replace any `relatedGuides` slug that points to a `draft: true` file. Prevents live internal links 404ing.

---

### 11. Convert hero image to AVIF/WebP
**File:** `public/images/hero/berlin-brandenburg-gate.jpg` (347.9 KB)
**Effort:** 30 minutes

```bash
# Using sharp CLI:
npx sharp-cli -i berlin-brandenburg-gate.jpg -o berlin-brandenburg-gate.avif -f avif
npx sharp-cli -i berlin-brandenburg-gate.jpg -o berlin-brandon-gate.webp -f webp
```
Target: AVIF ≤80 KB, WebP ≤120 KB. Update `<Image>` src accordingly.

---

### 12. Fix font stack mismatch
**File:** `app/globals.css`
**Effort:** 30 minutes

Remove hardcoded font names from `@theme` block:
```css
/* Remove these lines: */
--font-sans: "Lato", "Segoe UI", system-ui, -apple-system, sans-serif;
--font-display: "Montserrat", "Avenir Next", "Lato", system-ui, sans-serif;
```
Let `next/font` class variables own `--font-sans` and `--font-display` exclusively. Add metric-matched fallbacks via `next/font`'s `fallback` option to minimise CLS during font swap.

---

### 13. Add explicit AI crawler rules to `app/robots.ts`
**Effort:** 15 minutes

```ts
rules: [
  {
    userAgent: ["GPTBot", "OAI-SearchBot", "ClaudeBot", "PerplexityBot"],
    allow: "/",
  },
  {
    userAgent: "*",
    allow: "/",
    disallow: ["/api/"],
  },
],
```

---

### 14. Convert section headings to question format on top 10 guides
**Effort:** 30 minutes per guide

Priority guides: anmeldung, elster, health-insurance-basics, blocked-account-comparison, tax-return-setup, first-14-days, blue-card-work-permit, german-bank-account, health-insurance-provider-comparison, driving-license-conversion

Convert H2/H3 headings to natural-language questions matching user intent (see `FULL-AUDIT-REPORT.md` for example transformations).

---

### 15. Resize cookie consent banner on mobile
**File:** relevant cookie consent component
**Effort:** 1 hour

Redesign as a slim bottom bar (max 80-90px height) rather than a full floating card. The current 282px banner obscures primary CTAs on 375px mobile viewports.

---

## MEDIUM — Fix Within 1 Month

### 16. Add IntersectionObserver pause guard to WebGL shader hero
**File:** `components/ui/animated-shader-hero.tsx`
**Effort:** Half day

Pause the `requestAnimationFrame` loop when the canvas is off-screen; resume when visible. Add `prefers-reduced-motion` check to skip WebGL entirely and use a CSS gradient fallback. Add `document.hidden` listener to pause when tab is backgrounded.

---

### 17. Add `published` frontmatter field to all guides
**Effort:** 1-2 hours (scripted)

Add `published:` date to each guide's frontmatter (the original publication date, not the last update). Use in Article schema `datePublished` and OG `article:published_time`, freeing `updated` to be the true `dateModified`.

---

### 18. Trim all meta descriptions to ≤155 characters
**Effort:** Half day

Add a lint rule or character limit check to the `summary` frontmatter field. Write a short `metaDescription` field (≤155 chars) that focuses on the differentiated CTA — "official sources, real numbers" — that currently gets truncated.

---

### 19. Fix `estimatedCost.value` in HowTo/Article schema
**File:** `components/JsonLd.tsx`
**Effort:** 30 minutes

For free processes, use `{ "@type": "MonetaryAmount", "value": 0, "currency": "EUR" }` or omit the field. Do not pass prose sentences as the `value` property.

---

### 20. Fix uniform lastmod on static sitemap pages
**File:** `app/sitemap.ts`
**Effort:** 1 hour

Replace the sitewide `getLatestSiteUpdateDate()` for static pages with either:
- Accurate per-page dates hardcoded for stable pages (about, legal, editorial-standards)
- Omit `lastmod` entirely for static pages that change rarely

---

### 21. Add `og:locale:alternate` to bilingual pages
**File:** `app/[lang]/layout.tsx` — `generateMetadata`
**Effort:** 30 minutes

For `/en` pages add `alternateLocale: ["de_DE"]`; for `/de` pages add `alternateLocale: ["en_US"]` to the `openGraph` object.

---

### 22. Update `Organization.sameAs` with social profile URLs
**File:** `components/JsonLd.tsx` — `getOrganizationSchema()`
**Effort:** 30 minutes

Add real social profile URLs (LinkedIn, Twitter/X, etc.) to the `sameAs` array.

---

### 23. Upgrade blog posts to `NewsArticle` schema
**File:** `components/JsonLd.tsx` + blog post page template
**Effort:** 1 hour

Change `@type` from `"Article"` to `"NewsArticle"` on `"Top Changes in Germany"` posts. Enables Top Stories carousel eligibility.

---

### 24. Implement HSTS preloading
**File:** `next.config.ts` headers config
**Effort:** 15 minutes + preload submission

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```
Then submit to hstspreload.org.

---

### 25. Implement IndexNow
**Effort:** Half day

Generate key, place at `/public/{key}.txt`, integrate a ping in the Vercel deployment pipeline or a GitHub Action that triggers on guide/blog content changes.

---

### 26. Add domain email address
**Effort:** Email configuration (external)

Replace `golifehacks@gmx.de` with `contact@lifehacksgermany.com` across all contact points: footer, Organization schema, Impressum. Improves trust perception for a site advising on official German processes.

---

## LOW — Backlog

### 27. Remove `<meta name="keywords">` from all pages
**File:** `app/[lang]/guides/[pillar]/[slug]/page.tsx` + `lib/seo.ts`
Google has ignored since 2009; telegraphs keyword targets to competitors.

### 28. Remove noise meta tags (`application-name`, `creator`, `publisher`)
**File:** `lib/seo.ts` — `createPublisherMetadata()`

### 29. Remove `Host:` directive from robots.txt
**File:** `app/robots.ts` — Yandex-only, ignored by Google/Bing.

### 30. Remove `<priority>` and `<changefreq>` from sitemap
**File:** `app/sitemap.ts` — Google ignores both; reduces XML payload.

### 31. Add images to guide pages
Start with the 5 highest-traffic guides. One instructional image per guide (Bürgeramt photo, sample document) with keyword-rich alt text. Improves image search visibility and reduces bounce on long-form content.

### 32. Increase touch target sizes for nav utility controls
Theme toggle and language switcher are below 48×48px. Add padding to bring them to WCAG 2.5.5 minimum.

### 33. Add `scroll-behavior: smooth` only where needed
**File:** `app/globals.css` — Remove global `html { scroll-behavior: smooth }`. Apply to specific scroll containers.

### 34. Audit `@vercel/analytics` bundle inclusion
Run `@next/bundle-analyzer` to confirm it is tree-shaken on the homepage. Remove from `package.json` if unused.

### 35. Establish a Reddit community presence
Participate genuinely in r/germany, r/ExpatGermany, r/AskEurope. Reddit mention signals have high correlation with AI citation frequency and cannot be automated — requires sustained genuine participation.

### 36. Fix homepage title length (87 → ≤65 chars)
Current: "Life Hacks Germany 2026: Anmeldung, Taxes, Housing, Daily Systems | Life Hacks Germany"
Trim the pipe + brand name or shorten the descriptor.

---

## Summary Priority Matrix

| # | Action | Priority | Effort | Impact |
|---|---|---|---|---|
| 1 | Noindex draft pages | Critical | 30 min | Blocks quality dilution |
| 2 | 307 → 308 redirect | Critical | 5 min | PageRank + LCP |
| 3 | Create llms.txt | Critical | 2-4 hrs | AI discoverability |
| 4 | Remove deprecated HowTo schema | Critical | 2 hrs | Schema validity |
| 5 | Expand 4 thin guides | Critical | 4-8 days | Content quality |
| 6 | Fix Article publisher logo | High | 1 hr | Rich results eligibility |
| 7 | Add x-default hreflang | High | 30 min | International SEO |
| 8 | Rewrite FAQPage schema | High | 1 day | Rich results + AI citation |
| 9 | Add named author | High | Half day | E-E-A-T |
| 10 | Audit relatedGuides for drafts | High | 1 hr | Crawl health |
| 11 | Convert hero to AVIF/WebP | High | 30 min | LCP |
| 12 | Fix font stack mismatch | High | 30 min | CLS + render fidelity |
| 13 | AI crawler rules in robots.txt | High | 15 min | GEO |
| 14 | Question-format H2/H3 headings | High | 30 min/guide | AI citation |
| 15 | Slim cookie banner on mobile | High | 1 hr | CRO + CLS |
| 16 | IntersectionObserver on WebGL | Medium | Half day | INP |
| 17 | Add `published` frontmatter | Medium | 1-2 hrs | Schema accuracy |
| 18 | Trim meta descriptions | Medium | Half day | CTR |
| 19 | Fix estimatedCost schema | Medium | 30 min | Schema validity |
| 20 | Fix sitemap uniform lastmod | Medium | 1 hr | Crawl trust |
| 21-26 | Remaining medium items | Medium | Various | Incremental |
| 27-36 | Backlog items | Low | Various | Polish |
