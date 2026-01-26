# Deployment Guide

- Purpose: Step-by-step deployment instructions and verification.
- Audience: Developers, DevOps, client operators.
- Owner: Exorex
- Last updated: 2026-01-26
- Related: ../02-Design/Architecture.md, ./Runbook.md, ../06-Security-and-Privacy/Secrets-Handling.md
- Status: Active

## Environments
- Dev: local Next.js, Supabase dev project, n8n dev
- Staging: Vercel preview deployment, Supabase staging project, n8n staging
- Prod: Vercel production, Supabase prod project, n8n prod

## Prerequisites
- Vercel account with project linked
- Supabase projects for dev, staging, prod
- n8n instance(s) for staging and prod
- Resend account and API key

## Deployment steps
1) Configure env vars in Vercel for staging and prod.
2) Migrate Supabase schema to staging and prod.
3) Deploy Next.js to Vercel.
4) Configure n8n credentials and activate workflows.
5) Run post-deploy verification.

## Rollback plan
- Revert Vercel deployment to previous build.
- Restore previous Supabase schema if needed.
- Disable n8n workflows during rollback.

## Migrations
- Use Supabase SQL editor or migration tooling.
- Apply the same schema to all environments.

## Post-deploy verification checklist
- Create a test appointment in staging
- Confirm manage link works
- Trigger reminder test in n8n
- Verify admin login and check-in
- Confirm reminders are computed in Asia/Manila time

## Secrets rotation (high level)
- Rotate provider keys in Supabase/Vercel and n8n
- Verify reminders still send after rotation
