# Client Handover

- Purpose: Document what was delivered and how to operate it.
- Audience: Client owner/operators.
- Owner: Exorex
- Last updated: 2026-01-26
- Related: ../05-Deployment-and-Ops/Deployment-Guide.md, ../05-Deployment-and-Ops/Runbook.md
- Status: Active

## What was delivered
- Booking UI and manage links
- Admin today view with check-in
- Supabase database and auth
- n8n reminder workflows

## Admin access and management
- Admin users managed in Supabase Auth
- Admin UI accessible at /admin/login

## Day-to-day operations
- Check today view and confirm attendance
- Monitor n8n workflow runs

## Safe updates
- Use staging for changes
- Confirm reminders in staging before prod

## Support boundaries
- Exorex maintains code and workflows
- Client handles daily operations

## Known issues and future improvements
- SMS reminders not enabled by default
- Multi-staff scheduling not implemented

## Backup and restore overview
- Supabase automatic backups
- n8n workflow export stored in repo or backup location
