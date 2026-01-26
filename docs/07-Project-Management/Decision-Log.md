# Decision Log

- Purpose: Record major decisions and rationale.
- Audience: Developers, stakeholders.
- Owner: Exorex
- Last updated: 2026-01-26
- Related: ../02-Design/Architecture.md
- Status: Active

## Decision: Use Supabase + n8n + Next.js
- Date: 2026-01-26
- Context: Need a fast MVP with reliable scheduling and reminders.
- Options: Custom backend, Supabase, Firebase
- Decision drivers: speed, maintainability, simple automation
- Outcome: Supabase for DB/Auth, n8n for scheduled reminders, Next.js for UI
- Consequences: RLS policies required; n8n hosting must be maintained
