# Production Runbook

- Purpose: Step-by-step production release checklist and rollback guide.
- Audience: DevOps, operators.
- Owner: Exorex
- Last updated: 2026-01-26
- Related: ./Deployment-Guide.md, ./Runbook.md, ../03-Implementation/Environment-Setup.md
- Status: Active

## Environments and URLs
- Staging:
  - Web app: Vercel preview or `https://staging.exorex.org`
  - n8n: `https://n8n-staging.exorex.org`
  - Supabase: separate staging project
- Production:
  - Web app: `https://exorex.org` (or `https://app.exorex.org`)
  - n8n: `https://n8n.exorex.org`
  - Supabase: separate production project

## Pre-release checklist
- [ ] Supabase schema up to date (services, appointments, audit_log, no_show_followup_sent_at)
- [ ] RLS enabled and policies verified
- [ ] Resend domain verified and sender active
- [ ] n8n workflows imported and configured
- [ ] Env vars set in Vercel and n8n:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `RESEND_API_KEY`
  - `EMAIL_FROM_ADDRESS`
  - `APP_BASE_URL`
- [ ] n8n time zone configured (`TZ=Asia/Manila`)

## Release steps
1) Deploy staging from main branch.
2) Run smoke tests in staging.
3) Promote to production in Vercel.
4) Update `APP_BASE_URL` to production URL in Vercel and n8n.
5) Enable n8n workflows in production.
6) Run production smoke tests.

## VPS deployment (optional)
If hosting the web app on VPS, use the GitHub Actions deploy workflow (`.github/workflows/deploy.yml`).

## Rollback plan
- Revert Vercel deployment to previous build.
- Disable n8n workflows.
- Restore previous Supabase schema if needed.

## Post-release verification
- Create a test booking and verify confirmation email.
- Admin login works.
- Reminder workflows run with expected windows.

## Observability and alerting
- n8n:
  - Enable workflow error notifications (email or webhook).
  - Watch failed executions dashboard daily.
- Resend:
  - Monitor delivery and bounce rates.
  - Alert on API errors (429/4xx).
- Supabase:
  - Monitor auth errors and database logs.
- Vercel:
  - Review function logs for 500s on `/api/appointments`.
