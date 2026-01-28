# Release Checklist

- Purpose: One-page checklist for safe releases.
- Audience: DevOps, operators.
- Owner: Exorex
- Last updated: 2026-01-28
- Related: ./Deployment-Checklist.md, ./Production-Runbook.md, ../04-Testing/Test-Plan.md
- Status: Active

## Before release
- [ ] `npm run predeploy` passes locally
- [ ] E2E tests pass (`npm run test:e2e`)
- [ ] Supabase schema up to date in prod
- [ ] Env vars verified (APP_BASE_URL, RESEND_API_KEY, SUPABASE keys)
- [ ] n8n workflows imported and configured

## Release
- [ ] Deploy to staging and run smoke tests
- [ ] Promote to production
- [ ] Verify `barber.exorex.org` and `n8n.exorex.org` are reachable

## After release
- [ ] Run production smoke tests
- [ ] Monitor logs for 30 minutes
- [ ] Confirm no failed n8n executions
