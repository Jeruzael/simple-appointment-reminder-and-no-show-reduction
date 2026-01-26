# Scope

- Purpose: Define project boundaries, success criteria, and risks.
- Audience: Product owner, developers, QA, client stakeholders.
- Owner: Exorex
- Last updated: 2026-01-26
- Related: ../02-Design/Architecture.md, ../07-Project-Management/Decision-Log.md
- Status: Active

## In scope
- Customer booking flow for services and time slots
- Tokenized manage booking links (confirm, cancel, reschedule)
- Admin login and today view with check-in
- Automated reminders (24h and 2h) via n8n and Resend email
- No-show marking after start time + 15 minutes
- Weekly summary report (optional)

## Out of scope
- Payments
- Multi-location scheduling
- Staff shift management
- Deep analytics dashboard
- Mobile app

## Success criteria
- 24h and 2h reminders deliver for >= 95% of eligible appointments
- No-show rate reduced compared to baseline
- Admin can check in appointments in under 2 clicks

## Assumptions and constraints
- Single location MVP
- Services have fixed durations
- Email only for MVP via Resend; SMS optional later
- Supabase is the system of record
- Business hours 10:00-20:00 Asia/Manila
- 15-minute slot increments with a 5-minute buffer
- Customer reschedule/cancel allowed until 3 hours before start

## Risks and mitigations
- Risk: Reminder delivery failures. Mitigation: retry logic and alerting in n8n.
- Risk: Scheduling overlap. Mitigation: server-side validation on booking and reschedule.
- Risk: Incorrect no-show marking. Mitigation: admin check-in overrides and grace period.
