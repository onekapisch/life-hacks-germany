# AGENTS.md

Use this file as the source of truth for how this repository actually works today.

## Project Summary

Life Hacks Germany is a bilingual (`en` / `de`) editorial utility product built on Next.js. It combines MDX-backed guides and blog posts with interactive calculators, a custom search system, legal pages, and a live mobility finder that queries third-party transport and weather APIs.

## Actual Tech Stack

- Framework: Next.js `16.1.6` App Router
- UI runtime: React `19.2.3`
- Language: TypeScript with `strict: true`, `allowJs: true`, `moduleResolution: "bundler"`
- Styling: Tailwind CSS v4 through PostCSS, plus custom global CSS in [`app/globals.css`](./app/globals.css)
- Fonts at runtime: `Cormorant_Garamond` and `Manrope` via `next/font/google` in [`app/[lang]/layout.tsx`](./app/[lang]/layout.tsx)
- Markdown/content: local MDX files, `gray-matter`, `next-mdx-remote/rsc`, `remark-gfm`
- Metadata/SEO: built-in Next metadata, JSON-LD helper, sitemap, robots, RSS, OG image route
- Analytics: consent-gated Plausible, Umami, or GA4
- Testing: Node test runner with `tsx`
- Package manager in repo: `npm`
- Deployment: Vercel-oriented, with standalone Node output enabled

## Rendering And Routing

- `/` redirects to `/en` in [`proxy.ts`](./proxy.ts).
- All primary pages live under `app/[lang]`.
- The app statically generates language, pillar, guide, blog, offer, about, legal, and tool pages where possible.
- Dynamic routes currently include:
  - `app/[lang]/search/page.tsx`
  - `app/[lang]/rss.xml/route.ts`
  - `app/api/search/route.ts`
  - `app/api/newsletter/route.ts`
  - `app/api/mobility-finder/route.ts`
  - `app/api/og/route.tsx`
- `app/api/og/route.tsx` uses the Edge runtime.

## Content Model

### Guides

Guide files live in `content/guides/{en,de}`. The current inventory is:

- 39 English guides
- 39 German guides
- Pillar distribution per language:
  - `bureaucracy`: 9
  - `money-taxes`: 9
  - `housing`: 6
  - `mobility`: 4
  - `everyday`: 11

Guide frontmatter fields in use:

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
- Optional: `offers`, `relatedGuides`, `draft`

Guide loading happens in [`lib/guides.ts`](./lib/guides.ts).

### Blog

Blog files live in `content/blog/{en,de}`. The current inventory is:

- 4 English posts
- 4 German posts

Blog frontmatter fields in use:

- `title`
- `summary`
- `slug`
- `published`
- `updated`
- `audience`
- `highlights`
- `sources`

Blog loading happens in [`lib/blog.ts`](./lib/blog.ts).

### Offers

Offers are code-backed, not MDX-backed. They live in [`lib/offers.ts`](./lib/offers.ts) and currently expose 24 ranked entries with localized copy and a shared verification timestamp constant.

## Design System

### Color Tokens

Defined in [`app/globals.css`](./app/globals.css) with light and dark overrides:

| Token | Light | Dark |
| --- | --- | --- |
| `--color-paper` | `#ffffff` | `#0a0f1a` |
| `--color-paper-2` | `#f8fafc` | `#111827` |
| `--color-paper-3` | `#f1f5f9` | `#1e293b` |
| `--color-ink` | `#0f172a` | `#f1f5f9` |
| `--color-ink-2` | `#475569` | `#94a3b8` |
| `--color-ink-3` | `#94a3b8` | `#64748b` |
| `--color-accent` | `#dc2626` | `#f87171` |
| `--color-accent-2` | `#1e40af` | `#60a5fa` |
| `--color-accent-3` | `#d97706` | `#fbbf24` |
| `--color-accent-4` | `#059669` | `#34d399` |

Brand direction in the active app is editorial, bright, and warm. The palette leans on off-white surfaces, slate text, red and blue action accents, and amber/green support colors.

### Typography

Actual runtime typography:

- Display/headings: Cormorant Garamond
- Body/UI: Manrope

Fallback CSS tokens in `@theme` still define:

- `--font-display`: Montserrat fallback chain
- `--font-sans`: Lato fallback chain

In practice, the `next/font/google` variables from [`app/[lang]/layout.tsx`](./app/[lang]/layout.tsx) override those tokens at runtime.

There is no dedicated project-wide mono token. Monospace text uses Tailwind utility classes such as `font-mono`.

### Layout And Surface Patterns

Common reusable classes live in [`app/globals.css`](./app/globals.css):

- `container-main`: main max-width container (`1200px`)
- `site-header`: sticky translucent header
- `site-footer`: footer shell
- `card`: standard elevated content card
- `content-shell`: main rounded content surface
- `highlight-band`: tinted highlight wrapper
- `glass-card-link`: interactive link card
- `glass-input`: standard form input shell
- `badge` / `badge-solid`: status and utility chips
- `btn`, `btn-primary`, `btn-secondary`, `btn-accent`
- `guide-prose`: MDX prose styles
- `search-modal`, `mobile-menu-drawer`, `cookie-consent-card`, `tools-*`, `sh-*`

### Motion And Interaction

Motion is subtle rather than animation-heavy:

- `surface-enter` keyframe is used for cards and shells
- buttons and cards lift slightly on hover
- the home hero includes a WebGL shader background via [`components/ui/animated-shader-hero.tsx`](./components/ui/animated-shader-hero.tsx)
- guide pages mount a reading-progress bar
- a scroll-to-top button appears after scrolling

## Component Patterns

- The codebase currently uses default exports across most components and route modules.
- Client components are used only where interactivity is required. There are currently 19 `"use client"` files.
- Shared UI patterns:
  - Header: localized nav, theme toggle, search modal, language switch, mobile drawer
  - Footer: site map, legal links, cookie preferences, freshness stamp
  - Search: modal + dedicated search page backed by `/api/search`
  - Guide pages: breadcrumbs, JSON-LD, reading progress, share actions, tracked outbound links
  - Tools: `ToolsClient` tool studio and `GrossNetCalculatorClient` landing page calculator
  - Home hero: editorial hero shell with animated background and image stage

Use [`TrackedExternalLink`](./components/TrackedExternalLink.tsx) for external links that should emit analytics events and set safe `rel` attributes.

## Data And Feature Conventions

- Guide and blog content is loaded from the filesystem at runtime/build time with synchronous reads in `lib/`.
- Search builds an in-memory index over guides, blog posts, offers, static pages, and tools with a 5-minute cache.
- Theme is stored in `localStorage` under `lhg-theme`.
- Cookie consent is stored in both `localStorage` (`lhg-cookie-consent-v1`) and a cookie (`lhg_cookie_consent`).
- There is no database, no auth system, no user account model, and no RLS layer in the current repo.
- `proxy.ts` is localization-only. It is not auth middleware.

## File Structure Conventions

Primary active source directories:

- `app/`: route modules, metadata, APIs, localized pages
- `components/`: layout, UI, analytics, tools, search, guide helpers
- `lib/`: content loading, search, analytics config, SEO, tool logic
- `content/guides/{en,de}`: guide MDX
- `content/blog/{en,de}`: blog MDX
- `public/`: icons and images
- `tests/`: unit tests
- `docs/`: runbooks and audit prompts

Legacy artifacts still in the repo but not part of the active Next.js runtime:

- `src/assets/**`
- `scripts/build.mjs`
- `dist/**`

## Commands

| Command | Use |
| --- | --- |
| `npm run dev` | Run local development server |
| `npm run build` | Build production bundle |
| `npm run start` | Start standalone production server |
| `npm run lint` | Run ESLint |
| `npx tsc --noEmit` | Run TypeScript check |
| `npm run test` | Run unit tests |
| `npm run check:editorial-tone` | Check MDX copy for blocked internal phrasing |
| `npm run check:links` | Check external links across code and content |

## Current Verified State

Verified on `2026-04-03`:

- `npm run lint` passed
- `npx tsc --noEmit` passed
- `npm run test` passed
- `npm run build` passed
- `npm run check:editorial-tone` passed
- `npm run check:links` passed with expected `403` / `429` warnings from external anti-bot systems

## Known Repo Realities

- The newsletter API exists, but the public signup component is not mounted anywhere.
- `@vercel/analytics` is installed but not used by the current app code.
- Several large route/client files mix content, layout, and business logic in a single module.
- `app/globals.css` contains active styles and some leftover unused rule groups from earlier UI iterations.
