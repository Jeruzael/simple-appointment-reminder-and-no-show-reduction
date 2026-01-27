# Environment Setup

- Purpose: Enable developers to set up locally quickly.
- Audience: Developers.
- Owner: Exorex
- Last updated: 2026-01-26
- Related: ../00-Overview/Scope.md, ../05-Deployment-and-Ops/Deployment-Guide.md
- Status: Active

## Prerequisites
- Node.js 20.x
- npm 10.x
- Supabase project and keys
- Resend account and API key
- Time zone reference: Asia/Manila

## Environment variables (names only)
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- APP_BASE_URL
- EMAIL_FROM_ADDRESS
- RESEND_API_KEY

## Local run steps
1) Create `.env.local` and set values.
2) `npm install`
3) `npm run dev`

## Tests
- `npm run test:e2e` (Playwright)

### E2E test env vars (optional)
- `TEST_SERVICE_ID` (required for manage-link E2E test)
- `TEST_CUSTOMER_EMAIL` (optional override for test email)
- Use `.env.test` for Playwright (`.env.test.example` provided).

## Lint/format
- `npm run lint`

## Common issues
- 401 from Supabase: verify keys and project URL
- Booking insert denied: verify RLS policies
