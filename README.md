# Life Hacks Germany

Life Hacks Germany is a bilingual editorial utility site for people navigating life in Germany. The current app ships verified MDX guides, monthly blog updates, practical planning tools, a custom search experience, localized legal pages, and a live transport/weather-powered mobility finder.

The homepage also contains a restrained owned-product layer: a contextual Tank Alert fuel-price action and one SkyLocation travel companion. The footer places the OneKapisch Editorial Monogram directly below the Life Hacks Germany lockup, using the official K mark and a same-tab studio link. These links use the shared Studio attribution contract and explicitly distinguish Kapisch Bhardwaj's maker role from Aeon GbR's operation of Tank Alert.

## What Is In The Repo

- Next.js 16 App Router site with `/en` and `/de` routes
- 78 MDX guides total: 39 English, 39 German
- 8 MDX blog posts total: 4 English, 4 German
- 24 curated offer cards sourced from official brand pages
- Interactive tools for salary, rent, tax, blocked account, emergency fund, permit timing, and rail-trip planning
- Dynamic OG image generation, sitemap, robots, RSS, JSON-LD, and on-site search

## Actual Stack

- Framework: Next.js `16.1.6`
- UI: React `19.2.3`
- Language: TypeScript with `strict: true` and `allowJs: true`
- Styling: Tailwind CSS v4 via `@import "tailwindcss"` plus custom CSS tokens in [`app/globals.css`](./app/globals.css)
- Fonts: `next/font/google` with Cormorant Garamond and Manrope
- Content: local MDX files parsed with `gray-matter` and rendered with `next-mdx-remote/rsc`
- Markdown plugins: `remark-gfm`
- Image/OG generation: `@vercel/og`
- Analytics options: Plausible, Umami, or GA4 behind cookie consent
- Package manager in use: `npm` (`package-lock.json` is present)
- Deployment target: Vercel-first, with `output: "standalone"` enabled for Node self-hosting

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the example env file:

```bash
cp .env.example .env.local
```

3. Fill only the variables you actually need.

4. Start the dev server:

```bash
npm run dev
```

5. Open `http://localhost:3000`. The root path redirects to `/en`.

## Environment Variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_ANALYTICS_PROVIDER` | Optional | Analytics mode: `ga4`, `plausible`, `umami`, or `none`. |
| `NEXT_PUBLIC_GA4_MEASUREMENT_ID` | Optional | Overrides the built-in GA4 fallback measurement ID. |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Only if using Plausible | Domain passed to the Plausible script. |
| `NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL` | Optional | Plausible script URL override. |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | Only if using Umami | Required for Umami tracking. |
| `NEXT_PUBLIC_UMAMI_SCRIPT_URL` | Only if using Umami | Required for Umami script loading. |
| `GOOGLE_SITE_VERIFICATION` | Optional | Adds Google Search Console verification metadata. |
| `BING_SITE_VERIFICATION` | Optional | Adds Bing Webmaster verification metadata. |
| `NEWSLETTER_SIGNUP_ENABLED` | Optional | Enables the newsletter API route when set to `1`. |
| `RESEND_API_KEY` | Only if newsletter API is enabled | Server-side Resend API key. |
| `RESEND_AUDIENCE_ID` | Only if newsletter API is enabled | Resend audience ID for contact creation. |

Notes:

- The app does not currently mount the public newsletter form component, even though the API route exists.
- `NEXT_PUBLIC_*` variables are intentionally public and must not contain secrets.
- `.env.local` is gitignored.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js development server. |
| `npm run build` | Create the production build. |
| `npm run start` | Run the generated standalone server from `.next/standalone/server.js`. |
| `npm run lint` | Run ESLint with the Next.js core-web-vitals and TypeScript configs. |
| `npx tsc --noEmit` | Run the TypeScript check. There is no dedicated `type-check` script yet. |
| `npm run test` | Run the Node test suite in `tests/**/*.test.ts`. |
| `npm run check:editorial-tone` | Scan MDX content for blocked SEO or creator-language phrases. |
| `npm run check:links` | Validate external links across app, content, docs, and README files. |

## Current Verification State

Verified on `2026-04-03`:

- `npm run lint` passed
- `npx tsc --noEmit` passed
- `npm run test` passed
- `npm run build` passed
- `npm run check:editorial-tone` passed
- `npm run check:links` passed

The link check reported expected anti-bot warnings for a few external sites returning `403` or `429`, but the script completed successfully by design.

## Content And Route Model

- Localized route tree lives under `app/[lang]`.
- The root path is redirected to `/en` by [`proxy.ts`](./proxy.ts).
- Guides live in `content/guides/{en,de}` and are loaded by [`lib/guides.ts`](./lib/guides.ts).
- Blog posts live in `content/blog/{en,de}` and are loaded by [`lib/blog.ts`](./lib/blog.ts).
- Search indexes guides, blog posts, offers, static pages, and tool entries in memory via [`lib/search.ts`](./lib/search.ts).
- Offer data is code-backed in [`lib/offers.ts`](./lib/offers.ts), not MDX-backed.

## Deployment

### Vercel

1. Import the repository into Vercel.
2. Set the same environment variables listed above in the target environment.
3. Deploy normally. [`vercel.json`](./vercel.json) already declares the framework as `nextjs`.

### Standalone Node Hosting

1. Install dependencies with `npm install`.
2. Set the required environment variables.
3. Build the app:

```bash
npm run build
```

4. Start the standalone server:

```bash
npm run start
```

Notes:

- The app is configured with `output: "standalone"` in [`next.config.ts`](./next.config.ts).
- The OG route at [`app/api/og/route.tsx`](./app/api/og/route.tsx) uses the Edge runtime. Validate that behavior on non-Vercel infrastructure before relying on it in production.

## Known Repo Quirks

- [`components/EmailCapture.tsx`](./components/EmailCapture.tsx) exists but is not mounted anywhere.
- [`src/assets`](./src/assets) and [`scripts/build.mjs`](./scripts/build.mjs) are legacy static-site artifacts and are not part of the active Next.js runtime.
- `@vercel/analytics` is installed but not mounted anywhere in the app.
