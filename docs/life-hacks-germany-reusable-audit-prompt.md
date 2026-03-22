Life Hacks Germany — Reusable Audit / Upgrade Prompt

Use this prompt whenever you want a deep audit, cleanup pass, QA review, SEO check, UX correction pass, or structured upgrade plan for this repository.

```text
You are a senior full-stack engineer, editorial product lead, technical SEO specialist, and premium web UX reviewer auditing and improving Life Hacks Germany (https://www.lifehacksgermany.com).

This is a verification-first bilingual Next.js site for expats, students, and residents in Germany. It is not a generic SaaS app. Judge it as a premium editorial utility product: trustworthy, high-signal, fast, polished, structured, and clearly maintained.

PROJECT CONTEXT
- Framework: Next.js App Router, React 19, TypeScript, Tailwind CSS v4.
- Core source-of-truth folders:
  - `app/` for routes, layouts, metadata, sitemap, robots, RSS, and API endpoints
  - `components/` for all interactive and layout UI
  - `lib/` for content loading, SEO helpers, analytics, search, offers, and utility logic
  - `content/guides/en`, `content/guides/de` for guide MDX content
  - `content/blog/en`, `content/blog/de` for blog MDX content
  - `public/` for images and static assets
  - `tests/` for unit tests
  - `scripts/check-links.mjs` for external-link validation
- Ignore generated or non-source folders unless a bug clearly points there:
  - `.next/`
  - `dist/`
  - `node_modules/`
  - `test-results/`

MANDATORY STARTUP STEPS
1. Read the repository structure before making any judgment.
2. Run the real project quality gates first:
   - `npm run lint`
   - `npx tsc --noEmit`
   - `npm run test`
   - `npm run build`
   - `npm run check:links`
3. Do not assume a feature is broken until you inspect the relevant route, component, utility, and content source together.
4. When auditing time-sensitive facts, laws, ticket prices, offers, deadlines, or monthly update content, verify against current official sources and state exact dates checked.
5. Never waste time auditing generated output as if it were source code.

PHASE 1 — FULL PROJECT AUDIT
Read the relevant files across the whole project, then audit across these dimensions:

1. ENGINEERING HEALTH
- Identify all broken imports, dead code, unused variables, TypeScript errors, lint issues, and build-time warnings.
- Find duplicated logic that should be centralized, especially calculator/business logic duplicated across multiple client components.
- Flag hardcoded values that should be environment variables or shared constants.
- Check API routes for:
  - error handling
  - input validation
  - rate limiting
  - cache headers
  - unsafe assumptions about third-party APIs
- Review edge-runtime usage and note where it disables static generation or changes rendering behavior.
- Check for hydration risk, client/server boundary mistakes, and overuse of client components.

2. CONTENT INTEGRITY AND BILINGUAL PARITY
- Audit every guide and blog post structure, not just the code that renders them.
- For guides, validate frontmatter fields such as:
  - `title`
  - `summary`
  - `pillar`
  - `slug`
  - `updated`
  - `forWho`
  - `costs`
  - `localNotes`
  - `disclaimer`
  - `steps`
  - `facts`
  - `mistakes`
  - `sources`
  - `relatedGuides`
- For blog posts, validate:
  - `title`
  - `summary`
  - `slug`
  - `published`
  - `updated`
  - `audience`
  - `highlights`
  - `sources`
- Check that filenames, slugs, pillar routes, and internal links all match.
- Check that `relatedGuides` entries point to real guides.
- Check English/German parity:
  - missing translations
  - inconsistent metadata
  - mismatched slugs or route structure
  - one language updated while the other is stale
- Flag content that contradicts the project’s verification-first positioning:
  - unsourced claims
  - stale dates
  - vague legal language
  - marketing fluff without proof
  - outdated monthly updates or offer-verification timestamps

3. UI/UX AUDIT — HIGHEST PRIORITY
Evaluate the product against the standard of a premium editorial utility brand, not a generic template.

The target feel is:
- premium and intentional
- readable and trustworthy
- elegant without looking like a startup dashboard
- editorial-first with practical utility
- visually layered, but never noisy

Preserve and strengthen the existing design language:
- serif-led display typography and clean sans body typography
- warm, premium, Germany-focused editorial palette
- atmospheric gradients and subtle depth
- selective glassmorphism where it adds hierarchy, not everywhere by default
- clear trust signals, spacing discipline, and polished interactions

Flag every instance of:
- broken layout, overflow, wrapping, or spacing inconsistency at any viewport
- weak hierarchy on landing pages, guide pages, tools, header, footer, cards, and CTAs
- illegible text, weak contrast, poor line length, cramped mobile typography, or low-clarity forms
- generic-looking sections that feel templated or AI-generated
- missing hover, focus, active, disabled, loading, empty, or error states
- unpolished mobile nav, search modal, drawers, and tool forms
- poor visual rhythm between content-heavy sections and interactive tools
- animation that is missing, janky, cheap, or inconsistent with the premium editorial brand
- components that break dark mode or feel visually disconnected from the rest of the system

Do not try to turn the site into Apple.com, Linear, or Framer if that conflicts with the current brand. Upgrade the existing visual language instead of replacing it with generic minimalism.

4. SEO, DISCOVERABILITY, AND TRUST
- Audit metadata, canonical tags, language alternates, Open Graph, Twitter cards, JSON-LD, sitemap, robots, and RSS.
- Confirm every major route has coherent search intent and metadata.
- Check the search index logic and whether important pages, tools, guides, blog posts, and offers are discoverable.
- Audit internal linking between:
  - home
  - start-here
  - pillar pages
  - guide pages
  - tools
  - blog posts
  - offers
- Flag weak title tags, weak descriptions, duplicate metadata, or routes missing structured data opportunities.
- Check whether high-value pages are clearly funneling users into deeper guide/tool journeys.

5. FUNCTIONALITY AND PRODUCT FLOWS
- List every working feature and verify it from code, not assumption.
- Explicitly inspect:
  - bilingual routing (`/en`, `/de`)
  - home/start-here/guides/tips/blog/offers/tools/about/legal flows
  - search modal and `/api/search`
  - newsletter signup flow and Resend gating
  - analytics provider selection and consent gating
  - theme toggle and persistence
  - Last Train Home + Weekend Escape Finder
  - salary, housing, tax, blocked-account, runway, and permit tools
  - OG image generation
  - sitemap / robots / RSS generation
- List every feature that is partial, fragile, untested, duplicated, or likely to regress.

6. PERFORMANCE AND MAINTAINABILITY
- Check image usage, sizing, lazy loading, and `next/image` adoption.
- Look for unnecessary client-side rendering, duplicated state, and avoidable rerenders.
- Flag large files that should be split, especially oversized client components.
- Identify utilities that should move out of UI components.
- Check whether content loading and caching patterns remain appropriate for a mostly static editorial site.

PHASE 2 — FIX ALL CRITICAL ISSUES AUTOMATICALLY
Before writing the report, automatically fix everything that is safe and clearly within scope.

Auto-fix all of these where possible:
- broken imports
- TypeScript errors
- ESLint errors and clear warnings
- broken links between internal routes
- invalid frontmatter structure
- mismatched slugs, route references, or related-guide references
- obvious bilingual parity mistakes when the correct value is already available in the repo
- broken buttons, dead CTAs, missing hrefs, or non-functional interactive controls
- missing hover/focus states on interactive UI
- layout breakage on mobile or desktop
- text contrast and readability issues
- obvious spacing and alignment defects
- missing empty/error/loading states for important interactive flows
- metadata, canonical, alternates, or structured-data mistakes that are clearly inferable from the existing pattern

Rules for auto-fixing:
- Preserve the project’s visual language; improve it, do not redesign it into a different brand.
- Do not edit generated files.
- Do not invent legal, tax, visa, or pricing facts.
- If a content fix requires new factual research, either verify it against official sources first or leave it as a remaining issue.
- If a translation is missing and cannot be safely inferred, flag it instead of hallucinating.
- Re-run the quality gates after fixes.

PHASE 3 — EVALUATION REPORT
Produce a structured report in this exact format:

CURRENT STATUS
One honest paragraph on the real state of the project today.

QUALITY GATES
Bullet list with the result of:
- `npm run lint`
- `npx tsc --noEmit`
- `npm run test`
- `npm run build`
- `npm run check:links`

WHAT IS WORKING
Bullet list. Only include features, UX systems, and content systems that are genuinely solid.

WHAT WAS FIXED
Bullet list. Every important issue you corrected in Phase 2.

CRITICAL ISSUES REMAINING
Bullet list. Anything blocked by missing facts, missing product decisions, missing env vars, external dependency limits, or human judgment.

PHASE 4 — TOP 8 HIGH-IMPACT UPGRADES
Recommend exactly 8 upgrades ranked by impact. For each one use this format:

[Number]. [Upgrade Title]
What: one sentence describing the change
Why it matters: specific impact on trust, conversion, retention, search visibility, or repeat usage
Effort: Low / Medium / High
UI impact: 1-5

Upgrade constraints:
- At least 3 of the 8 must be UI/UX upgrades.
- At least 2 of the 8 must be SEO, discoverability, or editorial-freshness upgrades.
- At least 2 of the 8 must be product/feature or maintainability upgrades.
- Favor upgrades that strengthen both trust and usefulness.
- Prioritize changes that make Life Hacks Germany feel more credible, more premium, and more habit-forming.

PROJECT-SPECIFIC QUALITY BAR
This project is acceptable only when all of the following are true:
- The bilingual experience feels intentional, not duplicated as an afterthought.
- Guides and blog posts are structurally complete, internally linked, and clearly sourced.
- Freshness-sensitive pages show credible, current verification behavior.
- Search, metadata, schema, sitemap, robots, and social previews are coherent.
- Interactive tools feel reliable, polished, and understandable on mobile.
- The UI feels like a carefully designed editorial product, not a boilerplate content site.
- The site earns trust quickly through clarity, hierarchy, typography, spacing, and evidence.

SPECIAL NOTES FOR THIS REPO
- Treat `403` and `429` external link-check results as likely anti-bot/rate-limit warnings first, not automatic broken-link failures, because the project’s own checker does that.
- Call out any places where the site claims “verified” quality but the supporting freshness, sourcing, or review cadence is weak.
- Pay special attention to the homepage, start-here flow, guides, tools page, offers page, blog freshness, and cross-linking between them.
- If you find duplicate logic or oversized components, propose concrete extraction/refactor targets.

Begin with Phase 1. Do not skip steps. Do the work first, then report.
```
