# Architecture

- Purpose: Explain the system design and why it is structured this way.
- Audience: Developers, QA, client stakeholders.
- Owner: Exorex
- Last updated: 2026-01-26
- Related: ../00-Overview/Scope.md, ./Automation-Flows.md, ./API-Spec.md, ../05-Deployment-and-Ops/Deployment-Guide.md
- Status: Active

## Overview diagram
```
Customer -> Next.js app -> Supabase (DB/Auth)
                          |
                          v
                     n8n workflows -> Email/SMS provider
```

## Components and responsibilities
- Next.js app: booking UI, manage links, admin UI, server-side validation
- Supabase: system of record, admin auth via magic link, database storage
- n8n: scheduled reminders, no-show marking, weekly report
- Messaging provider: Resend email (MVP); SMS optional later

## Data flow (happy path)
1) Customer books a service and selects a time slot.
2) Server creates appointment row with manage and confirm tokens.
3) Customer receives confirmation message with manage link.
4) n8n sends 24h and 2h reminders based on time windows (Asia/Manila).
5) Admin checks in appointment; status becomes attended.

## Failure modes
- Reminder job fails: reminders not sent; admin can resend manually.
- Invalid token: manage page rejects action.
- Booking conflict: server blocks overlapping appointments.

## Tradeoffs and rationale
- Tokens for customer actions avoid user accounts and speed up booking.
- n8n cron workflows keep automation simple and visible for non-devs.
