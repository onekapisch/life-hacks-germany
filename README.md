# Life Hacks Germany

A verification-first Next.js site for expats, students, and Germans living in Germany.

## Local Development

```
npm install
npm run dev
```

## Environment

Copy `.env.example` to `.env.local` and set the required values:

- `NEXT_PUBLIC_ANALYTICS_PROVIDER` and provider variables
- `RESEND_API_KEY` and `RESEND_AUDIENCE_ID` for newsletter signup

## Quality Checks

```
npm run lint
npx tsc --noEmit
npm run test
npm run build
npm run check:links
```
