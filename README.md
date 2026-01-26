# README

## What this system does
A simple appointment reminder and no-show reduction system for salons and barbershops. Customers book appointments, confirm or reschedule via secure links, and receive time-based reminders. Staff use an admin view to check in clients and track no-shows.

## Tech stack
- Next.js (App Router)
- Supabase (Postgres + Auth)
- n8n (scheduled reminder automation)
- Resend (all outbound email)

## How to run locally
1) Install dependencies: `npm install`
2) Copy env vars: create `.env.local` (see `docs/03-Implementation/Environment-Setup.md`)
3) Run dev server: `npm run dev`

## Supabase setup (schema + RLS)
1) Open Supabase SQL editor for your project.
2) Paste and run `docs/03-Implementation/Supabase-Schema.sql`.
3) Verify tables and policies were created successfully.

## Key docs
- Scope: `docs/00-Overview/Scope.md`
- Architecture: `docs/02-Design/Architecture.md`
- API spec: `docs/02-Design/API-Spec.md`
- Automation flows: `docs/02-Design/Automation-Flows.md`
- Deployment: `docs/05-Deployment-and-Ops/Deployment-Guide.md`
- Handover: `docs/08-Handovers/Client-Handover.md`

## Environments
- Dev: local Next.js + Supabase dev project + n8n dev instance
- Staging: hosted preview deployment + Supabase staging project + n8n staging
- Prod: live deployment + Supabase prod project + n8n prod

## Troubleshooting
- Missing Supabase env vars: verify `.env.local` matches `docs/03-Implementation/Environment-Setup.md`
- Booking fails: check Supabase RLS policies and table schema
- Reminders not sending: check n8n workflow runs and Resend credentials
