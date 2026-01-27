# Runbook

- Purpose: Operational playbook for incidents and recovery.
- Audience: Operators, DevOps.
- Owner: Exorex
- Last updated: 2026-01-26
- Related: ./Deployment-Guide.md
- Status: Active

## Common incidents and responses
- Reminders not sending: check n8n status and Resend credentials.
- Booking failures: check Supabase RLS policies and logs.
- Admin login issues: verify Supabase Auth settings.

## Logs
- Vercel logs for Next.js
- Supabase logs for database and auth
- n8n execution logs

## Metrics and alerts
- Reminder send success rate
- No-show rate per week
- Booking conversion rate
- n8n workflow failure count
- Resend API error rate

## Safe restart procedure
- Pause n8n workflows
- Restart services
- Resume workflows after checks

## Recovery validation
- Create a test appointment and run a manual reminder

## Backups
- Supabase automated backups enabled (verify in project settings)
- Export n8n workflows weekly and store in repo or backup location
