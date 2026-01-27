# Deployment Checklist (Vercel + Supabase + n8n)

- Purpose: Exact steps to deploy and verify production.
- Audience: DevOps, operators.
- Owner: Exorex
- Last updated: 2026-01-26
- Related: ./Production-Runbook.md, ./Deployment-Guide.md, ./Runbook.md
- Status: Active

## 1) Supabase (staging + prod)
- [ ] Create separate Supabase projects for staging and prod.
- [ ] Apply schema from `docs/03-Implementation/Supabase-Schema.sql`.
- [ ] Enable RLS and verify policies.
- [ ] Seed services table.
- [ ] Copy API URL + keys for each env.

## 2) Vercel (Next.js)
- [ ] Connect repo to Vercel.
- [ ] Configure env vars per environment:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `RESEND_API_KEY`
  - `EMAIL_FROM_ADDRESS`
  - `APP_BASE_URL`
- [ ] Deploy staging (preview).
- [ ] Promote to production.

## 3) n8n (staging + prod)
- [ ] Host n8n instances (staging and prod).
- [ ] Set env vars:
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `RESEND_API_KEY`
  - `TZ=Asia/Manila`
- [ ] Import workflow JSONs from `docs/03-Implementation/n8n-workflows/`.
- [ ] Activate 24h, 2h, and no-show workflows.
- [ ] Keep weekly report inactive until needed.

## 4) Verification
- [ ] Book an appointment and confirm email delivery.
- [ ] Open manage link and verify details.
- [ ] Admin login and check-in works.
- [ ] 24h and 2h workflows run (no duplicates).
- [ ] No-show workflow runs on backdated test row.
