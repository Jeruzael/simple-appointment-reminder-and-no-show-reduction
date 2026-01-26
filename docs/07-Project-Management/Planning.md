# Planning

- Purpose: Consolidate North Star, roadmap, and execution plans in one place.
- Audience: Product, developers, QA, operators.
- Owner: Exorex
- Last updated: 2026-01-26
- Related: ../00-Overview/Scope.md, ../01-Requirements/User-Stories.md, ../02-Design/Architecture.md, ../04-Testing/Test-Plan.md, ../05-Deployment-and-Ops/Deployment-Guide.md
- Status: Active

## North Star (Product planning)
- System name: Simple Appointment Reminder + No-Show Reduction
- Reference business: Salon/barbershop
- Primary user: Salon customers booking services
- Paying customer: Salon owner/manager
- Problem statement: No-shows and late cancellations hurt revenue and make schedules unreliable; current reminders are manual or inconsistent.
- MVP promise: Customers can book and manage appointments with automated email reminders that reduce no-shows.
- Success metrics:
  - Show rate: +10% improvement within 4 weeks
  - No-show rate: -20% within 4 weeks
  - Reminder delivery: >= 95% of eligible reminders sent
- Constraints:
  - Timezone: Asia/Manila (UTC+8)
  - Messaging provider: Resend email only (MVP)
  - Budget: MVP-grade hosting (Supabase + Vercel + n8n)

## MVP scope (MoSCoW)
- Must:
  - Booking flow with 15-minute slot increments within 10:00-20:00 Asia/Manila
  - Tokenized manage link (confirm/cancel/reschedule)
  - Resend emails for confirmation and reminders
  - Admin login (magic link) and today view with check-in
  - No-show marking after start+15 minutes if not checked-in
  - RLS enabled on Supabase tables
- Should:
  - Weekly summary email report
  - Basic filtering in admin today view
- Could:
  - SMS reminders
  - Multi-staff scheduling
- Won't:
  - Payments, deposits, or analytics dashboard in MVP

## Roadmap (Delivery planning)
**Phase 0 — Foundations**
- Exit criteria:
  - DB schema created (services, appointments)
  - RLS enabled + policies added
  - Env vars and secrets documented
  - Basic logging in app and n8n

**Phase 1 — Slice 1: Booking → DB → Confirmation**
- Exit criteria:
  - Customer can book a service
  - Appointment saved with correct timestamps (Asia/Manila rendering)
  - Confirmation email sent via Resend
  - Manage link works

**Phase 2 — Slice 2: Reminders (24h + 2h)**
- Exit criteria:
  - Reminder jobs run on schedule
  - Selection windows correct in Asia/Manila
  - Idempotent sends (no duplicates)

**Phase 3 — Slice 3: Admin + Check-in**
- Exit criteria:
  - Admin login works (magic link)
  - Today view lists appointments by status
  - Check-in sets status attended

**Phase 4 — Slice 4: No-show automation + Follow-up**
- Exit criteria:
  - No-show rule triggers after start+15m if not checked-in
  - Follow-up email sent

**Phase 5 — Hardening + Deploy**
- Exit criteria:
  - Monitoring for failed jobs
  - Backup plan documented
  - Smoke test checklist
  - Deployed to production

## Technical planning highlights
- Timestamps stored as timestamptz (UTC), all scheduling windows computed in Asia/Manila.
- Slot rules: 15-minute increments; end_time = start_time + service duration + 5-minute buffer.
- Reschedule/cancel allowed until 3 hours before start_time.
- Single resource scheduling (no overlaps).
- Reminder idempotency via reminder_24h_sent_at and reminder_2h_sent_at.

## Execution backlog (task template)
Each task is 2-6 hours with acceptance criteria and test steps.

### Backlog
- T-001: Supabase schema + RLS
  - Objective: Create services and appointments tables with policies.
  - Files/modules: Supabase SQL editor
  - Acceptance criteria: Inserts/updates allowed only via expected roles; RLS enabled.
  - Test steps: Insert appointment; confirm manage token update allowed.

- T-002: Booking UI + API
  - Objective: Build booking form and create appointment endpoint.
  - Files/modules: `app/`, API route handlers
  - Acceptance criteria: Booking creates appointment with correct start/end times.
  - Test steps: Book sample time slot and validate DB row.

- T-003: Manage link actions
  - Objective: Confirm/cancel/reschedule endpoints using tokens.
  - Acceptance criteria: Token actions update status and enforce 3-hour cutoff.
  - Test steps: Try reschedule within 3 hours and confirm rejection.

- T-004: Resend email templates
  - Objective: Configure Resend and templates for confirmation/reminders.
  - Acceptance criteria: Emails sent on booking and reminders.
  - Test steps: Trigger booking and verify emails.

- T-005: Reminder workflows in n8n
  - Objective: Cron workflows for 24h and 2h reminders.
  - Acceptance criteria: Reminders sent once per appointment.
  - Test steps: Create appointment 24h ahead and run workflow.

- T-006: Admin today view + check-in
  - Objective: Build admin login and today view with status filters.
  - Acceptance criteria: Check-in sets status attended.
  - Test steps: Check-in and verify status.

- T-007: No-show workflow
  - Objective: Mark no-show after start+15m if not checked-in.
  - Acceptance criteria: Status updates and follow-up email sent.
  - Test steps: Create past appointment and run workflow.

- T-008: Deployment and verification
  - Objective: Deploy to staging and prod with checks.
  - Acceptance criteria: Post-deploy checklist passes.
  - Test steps: Full smoke test run.

## QA planning
- Test matrix (sample)
  - Booking: valid slot, invalid slot, outside business hours
  - Manage link: confirm, cancel, reschedule, invalid token
  - Reminders: 24h and 2h windows, idempotent behavior
  - Admin: login, today view, check-in
- UAT script: book → confirm → receive reminder → admin check-in → verify no-show not set

## Production rollout planning
- Environments: dev, staging, prod with separate Supabase and n8n instances
- Go-live checklist:
  - Resend API key configured
  - n8n workflows active
  - RLS enabled
  - Timezone set to Asia/Manila in code and workflows
- Rollback plan: revert Vercel deployment, disable workflows, restore schema if needed

## Operations planning
- Alerts: failed reminder job, high error rates, Resend send failures
- Backups: Supabase automated backups; test restore quarterly
- Support: operator runbook in `docs/05-Deployment-and-Ops/Runbook.md`

## Risk planning
| Risk | Severity | Likelihood | Mitigation | Owner |
| --- | --- | --- | --- | --- |
| Reminder not sent | High | Medium | Idempotent jobs + monitoring | Engineering |
| Wrong timezone window | High | Medium | Use Asia/Manila consistently; tests | Engineering |
| Token leakage | Medium | Low | Random tokens + short-lived links (future) | Engineering |
| Booking overlaps | Medium | Medium | Server-side validation | Engineering |

## Business / go-to-market planning
- Pilot plan: onboard 1-3 salons for initial feedback
- Onboarding checklist: set services, set hours, send test booking, verify reminders
- Pricing tiers (draft):
  - Basic: email reminders
  - Pro: email + SMS
  - Premium: deposits + analytics
