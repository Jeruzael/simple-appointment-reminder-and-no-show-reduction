# RLS Policies

- Purpose: Document Row Level Security policies and access rules.
- Audience: Developers, security reviewers.
- Owner: Exorex
- Last updated: 2026-01-28
- Related: ./Secrets-Handling.md, ../03-Implementation/Supabase-Schema.sql
- Status: Active

## Summary
- RLS is enabled on all tables.
- Admin access uses Supabase Auth (authenticated role).
- Server-side tasks use the Supabase **service role** key (bypasses RLS).

## Table: services
- **Select:** public (anyone can read active services)
- **Insert/Update/Delete:** authenticated users only

Policy names:
- `services_select_public`
- `services_admin_write`

## Table: staff
- **Select/Insert/Update/Delete:** authenticated users only

Policy name:
- `staff_admin_access`

## Table: appointments
- **Select/Insert/Update/Delete:** authenticated users only

Policy name:
- `appointments_admin_access`

## Table: audit_log
- **Select/Insert/Update/Delete:** authenticated users only

Policy name:
- `audit_log_admin_access`

## Notes
- Customer-facing flows use server-side routes with the service role key.
- If you later expose public appointment endpoints, add a dedicated policy and restrict by token.
