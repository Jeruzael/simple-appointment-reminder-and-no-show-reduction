# Secrets Handling

- Purpose: Define secret management and privacy practices.
- Audience: Developers, DevOps.
- Owner: Exorex
- Last updated: 2026-01-26
- Related: ../05-Deployment-and-Ops/Deployment-Guide.md
- Status: Active

## Rules
- No secrets in code, repos, screenshots, or logs.
- Use environment variables or a secrets manager.

## Secret names (no values)
- SUPABASE_SERVICE_ROLE_KEY
- RESEND_API_KEY
- N8N_ENCRYPTION_KEY

## Auth model
- Admin uses Supabase Auth (magic link or email+password)
- Customers use tokenized manage links

## Access control summary
- RLS for appointments and services
- Admin-only access to check-in endpoints

## PII handling
- Store only name and contact method
- Avoid logging full contact details

## Minimal threat model (top risks)
- Token leakage: ensure tokens are long and random
- Unauthorized admin access: enforce strong auth
- Reminder spam: rate limit workflows
