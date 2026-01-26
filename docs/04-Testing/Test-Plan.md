# Test Plan

- Purpose: Define testing scope, types, and acceptance.
- Audience: Developers, QA.
- Owner: Exorex
- Last updated: 2026-01-26
- Related: ../00-Overview/Scope.md
- Status: Active

## Scope
- Booking creation and validation
- Manage link actions (confirm, cancel, reschedule)
- Admin login and check-in
- Reminder workflows and no-show logic

## Test types
- Unit: validation and date window logic
- Integration: API endpoints with Supabase
- E2E: booking -> reminder -> check-in

## Test environment needs
- Supabase dev project
- n8n dev instance with test credentials

## Pass/fail criteria
- All acceptance criteria in `docs/01-Requirements/User-Stories.md`
- No duplicate reminders in test runs

## Regression checklist
- Booking creation
- Manage link actions
- Reminder sends
- No-show marking
