# Analytics Health Check (GA4 + Vercel)

Use this checklist when traffic looks flat in GA4 or Vercel Analytics.

## 30-second check

1. Open the live site in an incognito window.
2. Click `Accept analytics` in the cookie banner.
3. Navigate to 2-3 pages.
4. In GA4 Realtime, confirm at least 1 active user appears within ~30-60 seconds.
5. In Vercel Analytics, confirm visitors/pageviews appear after a short delay.

## Expected behavior

- Before consent:
  - GA4 script is not loaded.
  - GA4 events are not sent.
  - Vercel Analytics script may still load.
- After consent:
  - `https://www.googletagmanager.com/gtag/js?id=G-V4VKJJQHPF` should load.
  - `https://region1.google-analytics.com/g/collect...` requests should be sent.

## Quick browser checks (DevTools)

1. Open DevTools -> Network.
2. Filter for `gtag` and `collect`.
3. After accepting analytics, verify:
   - `gtag/js?id=G-V4VKJJQHPF` returns 200.
   - `google-analytics.com/g/collect` requests appear.

## Common causes when GA4 shows 0

- Consent was declined and persisted in browser storage.
- Ad/tracker blockers prevent GA requests.
- Wrong GA4 property or stream selected.
- GA4 data filters exclude test/internal traffic.
- Very low traffic and short date range.

## Reset consent locally for retesting

In DevTools Console:

```js
localStorage.removeItem("lhg-cookie-consent-v1");
document.cookie = "lhg_cookie_consent=; Path=/; Max-Age=0; SameSite=Lax";
location.reload();
```

## Code locations

- Analytics component:
  - `components/Analytics.tsx`
- Consent storage:
  - `lib/cookieConsent.ts`
- Analytics config and fallback measurement ID:
  - `lib/analyticsConfig.ts`
- Vercel Analytics mount:
  - `app/[lang]/layout.tsx`

