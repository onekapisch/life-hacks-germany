# SECURITY

## Current Security Posture

This repository is currently a public editorial website, not a logged-in application. There is no database, no user account system, no checkout flow, and no authenticated app area in the active codebase.

## How Secrets And Environment Variables Are Handled

Server-side only:

- `RESEND_API_KEY`
- `RESEND_AUDIENCE_ID`

Public by design:

- `NEXT_PUBLIC_ANALYTICS_PROVIDER`
- `NEXT_PUBLIC_GA4_MEASUREMENT_ID`
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`
- `NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL`
- `NEXT_PUBLIC_UMAMI_WEBSITE_ID`
- `NEXT_PUBLIC_UMAMI_SCRIPT_URL`

Operational metadata:

- `GOOGLE_SITE_VERIFICATION`
- `BING_SITE_VERIFICATION`
- `NEWSLETTER_SIGNUP_ENABLED`

Notes:

- The only true secret in current use is the Resend API key.
- The repo includes `.env.example` and ignores `.env*` through `.gitignore`, so `.env.local` should stay out of version control.
- The code does not expose the Resend key to the client.

## What Data Is Stored And Where

### In The Repository

- Guide content is stored in `content/guides/{en,de}`.
- Blog content is stored in `content/blog/{en,de}`.
- Offer definitions are stored in `lib/offers.ts`.
- There is no application database.

### In The Browser

- Theme preference in `localStorage` under `lhg-theme`
- Cookie-consent state in:
  - `localStorage` under `lhg-cookie-consent-v1`
  - cookie `lhg_cookie_consent`

### In Third-Party Systems

- If the newsletter API is enabled and called, subscriber emails are sent to Resend Audience Contacts via [`app/api/newsletter/route.ts`](./app/api/newsletter/route.ts).
- Analytics data may be sent to Plausible, Umami, or GA4, but only after consent.

### Not Persisted By The App

- Search queries are processed in memory and returned immediately.
- Mobility-finder requests are proxied to third-party APIs and not stored locally.
- Tool inputs such as salary, rent, blocked-account values, and permit dates are computed client-side and not persisted by the app.

## Third-Party Services Connected Today

- Resend: newsletter audience contact creation
- Google Analytics 4: optional analytics after consent
- Plausible: optional analytics after consent
- Umami: optional analytics after consent
- `transport.rest` (`https://v6.db.transport.rest`): live rail/station data for the mobility finder
- Open-Meteo (`https://api.open-meteo.com/v1/forecast`): weather data for the mobility finder
- Google Search Console / Bing Webmaster verification: optional metadata values
- Google Fonts via `next/font/google`: Cormorant Garamond and Manrope
- `@vercel/og`: OG image rendering

`@vercel/analytics` is installed but not used by the current app code.

## Current Headers And Browser Protections

Configured globally in [`next.config.ts`](./next.config.ts):

- `Content-Security-Policy`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

Relevant CSP behavior:

- Scripts default to `'self'`
- Optional analytics origins are added only for the selected provider
- Images allow `'self'`, `data:`, and `https:`
- `form-action` is restricted to `'self'` and `mailto:`

Outbound content links frequently use [`components/TrackedExternalLink.tsx`](./components/TrackedExternalLink.tsx), which adds `noopener noreferrer` and optional `sponsored` rel values.

Owned-product referrals append campaign and placement metadata only. They do not include user identifiers, page inputs, search terms, or other personal data.
The footer Editorial Monogram uses the same fixed same-tab outbound-link contract and adds no script, browser storage, or separate tracking event.

## Auth, Middleware, And RLS

- Auth: none
- Session middleware: none
- Database: none
- RLS policies: none, because there is no database layer
- [`proxy.ts`](./proxy.ts) is not an auth layer. It only redirects non-localized page routes to `/en/...`.

## Public API Surface

### `GET /api/search`

- Source: [`app/api/search/route.ts`](./app/api/search/route.ts)
- Behavior: returns cached site-search results from local content and offer data
- Auth: none
- Rate limit: none
- CORS headers: none
- Cache: `public, s-maxage=600, stale-while-revalidate=86400`

### `POST /api/newsletter`

- Source: [`app/api/newsletter/route.ts`](./app/api/newsletter/route.ts)
- Behavior: validates email and creates a Resend audience contact if enabled
- Auth: none
- Rate limit: in-memory `Map`, 5 requests per 10 minutes per IP-ish key
- CORS headers: none
- Cache: `no-store`

### `GET /api/mobility-finder`

- Source: [`app/api/mobility-finder/route.ts`](./app/api/mobility-finder/route.ts)
- Behavior: station lookup, last-train lookup, and weekend-trip recommendations
- Auth: none
- Rate limit: none
- CORS headers: none
- Cache: short public cache headers, depending on mode

### `GET /api/og`

- Source: [`app/api/og/route.tsx`](./app/api/og/route.tsx)
- Behavior: dynamic OG image generation
- Auth: none
- Rate limit: none
- CORS headers: none

## Known Security Gaps

- Public APIs do not define an explicit CORS policy. They currently rely on same-origin usage, but that policy is implicit rather than declared.
- Only the newsletter route has rate limiting, and that limiter is in-memory. It will not hold across multiple instances or cold starts.
- The search and mobility-finder APIs have no rate limiting.
- The newsletter route validates input manually rather than with a schema validator and does not wrap the outbound Resend `fetch` in a `try/catch`.
- There is no auth model, so every public API route is unauthenticated by design.
- The app defaults to a built-in GA4 measurement ID fallback if analytics are not explicitly disabled. That ID is public, not secret, but it is still operationally significant.
- The analytics runbook in `docs/` mentions Vercel Analytics even though the current runtime does not mount it.

## Data Retention Reality

- The app itself stores no user profiles or server-side account records.
- Theme and consent persistence remain in the browser until the user clears them or overwrites them.
- Newsletter addresses, when submitted through the enabled API, are retained by Resend according to that service’s audience/contact behavior.
- Hosting-layer request logs may exist at the platform layer, but this repository does not implement a custom log store.

## Practical Rules For Future Work

- Keep all secret values server-side only.
- Do not introduce `NEXT_PUBLIC_*` variables for secrets.
- If a database is added later, this file must be updated with storage, auth, and RLS details immediately.
- If the newsletter UI is mounted, re-check rate limiting, outbound failure handling, and privacy-policy wording in the same change.
