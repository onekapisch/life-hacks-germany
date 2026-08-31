# TODO

Audit date: `2026-08-31`

No inline `TODO` / `FIXME` / `XXX` markers were found in the active app code. The items below come from the current implementation, runtime behavior, and stale or partially wired features.

## Critical

- None found in source logic. In restricted-network sandboxes, `build`/`link-check` can fail due external fetch limits rather than repo regressions.

## High

- Add durable rate limiting to the public APIs in [`app/api/mobility-finder/route.ts`](./app/api/mobility-finder/route.ts) and [`app/api/search/route.ts`](./app/api/search/route.ts), and replace the in-memory `Map` limiter in [`app/api/newsletter/route.ts`](./app/api/newsletter/route.ts) with a shared store. The current limiter resets per process and does not protect multi-instance deployments.
- Wrap the outbound Resend request in [`app/api/newsletter/route.ts`](./app/api/newsletter/route.ts) in a `try/catch`. Right now, a network-level `fetch` failure can bypass the route’s structured `502` handling and bubble into an unhandled server error.
- Resolve the partial newsletter implementation. [`components/EmailCapture.tsx`](./components/EmailCapture.tsx) exists, the home-page copy still references a newsletter, and [`app/api/newsletter/route.ts`](./app/api/newsletter/route.ts) is live, but the signup component is not mounted anywhere in the actual route tree.

## Medium

- Make the API CORS policy explicit. None of the public API routes in [`app/api/search/route.ts`](./app/api/search/route.ts), [`app/api/newsletter/route.ts`](./app/api/newsletter/route.ts), [`app/api/mobility-finder/route.ts`](./app/api/mobility-finder/route.ts), or [`app/api/og/route.tsx`](./app/api/og/route.tsx) set `Access-Control-*` headers.
- Move time-sensitive homepage and offer freshness data out of route code. [`app/[lang]/page.tsx`](./app/[lang]/page.tsx) still hardcodes a weekly fuel-price snapshot, and [`lib/offers.ts`](./lib/offers.ts) applies one shared verification timestamp to all offer entries.
- Add a weekly source-health report for official and offer URLs so `403/429` anti-bot responses are separated from true link rot before publishing editorial updates.
- Split the largest mixed-responsibility files. The heaviest current modules are:
  - [`app/[lang]/guides/[pillar]/[slug]/page.tsx`](./app/%5Blang%5D/guides/%5Bpillar%5D/%5Bslug%5D/page.tsx) at 1128 lines
  - [`app/[lang]/tools/ToolsClient.tsx`](./app/%5Blang%5D/tools/ToolsClient.tsx) at 987 lines
  - [`app/[lang]/work-relocation/page.tsx`](./app/%5Blang%5D/work-relocation/page.tsx) at 871 lines
  - [`components/LastTrainEscapeFinder.tsx`](./components/LastTrainEscapeFinder.tsx) at 840 lines
  - [`app/[lang]/page.tsx`](./app/%5Blang%5D/page.tsx) at 830 lines
- Bring the analytics runbook back in sync with the code. [`docs/analytics-health-check.md`](./docs/analytics-health-check.md) still references Vercel Analytics, but the current app mounts only the custom analytics layer in [`components/Analytics.tsx`](./components/Analytics.tsx).

## Low

- Remove or archive legacy static-site artifacts that are not part of the active Next.js runtime:
  - [`src/assets/css/styles.css`](./src/assets/css/styles.css)
  - [`src/assets/js/app.js`](./src/assets/js/app.js)
  - [`scripts/build.mjs`](./scripts/build.mjs)
  - `dist/`
- Remove unused demo and dependency leftovers:
  - [`components/ui/demo.tsx`](./components/ui/demo.tsx) is not imported anywhere
  - `@vercel/analytics` is installed but unused in application code
- Add a dedicated `type-check` script to [`package.json`](./package.json). The current repo relies on `npx tsc --noEmit`, which is easy to miss in docs and CI.
- Clean unused CSS carried over from earlier UI iterations. `route-*` blocks in [`app/globals.css`](./app/globals.css) no longer appear in the active component tree.
- Remove the remaining placeholder legal-copy string embedded in the unused legacy build script [`scripts/build.mjs`](./scripts/build.mjs).
