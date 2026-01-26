# Automation Flows

- Purpose: Document automation workflows and operational details.
- Audience: Developers, QA, operators.
- Owner: Exorex
- Last updated: 2026-01-26
- Related: ../02-Design/Architecture.md, ../05-Deployment-and-Ops/Runbook.md
- Status: Active

## Flow: 24h reminder
- Trigger: Cron every 5-10 minutes
- Inputs: appointments table
- Steps:
  1) Query appointments where status in booked, confirmed
  2) start_time within now+23h55m and now+24h05m
  3) reminder_24h_sent_at is null
  4) Send reminder message
  5) Update reminder_24h_sent_at to now
- External dependencies: Resend email credentials
- Time zone: Asia/Manila for window calculation
- Retries and error handling: retry on provider errors, log failures
- Logging: workflow run log + provider response
- Test procedure: create appointment 24h ahead and verify send
- Safe edit rules: do not widen window without confirming duplicate sends

## Flow: 2h reminder
- Trigger: Cron every 5-10 minutes
- Inputs: appointments table
- Steps:
  1) Query appointments where status in booked, confirmed
  2) start_time within now+1h55m and now+2h05m
  3) reminder_2h_sent_at is null
  4) Send reminder message
  5) Update reminder_2h_sent_at to now
- External dependencies: Resend email credentials
- Time zone: Asia/Manila for window calculation
- Retries and error handling: retry on provider errors, log failures
- Logging: workflow run log + provider response
- Test procedure: create appointment 2h ahead and verify send
- Safe edit rules: avoid duplicate sends

## Flow: No-show marker
- Trigger: Cron every 5-10 minutes
- Inputs: appointments table
- Steps:
  1) Query appointments where status in booked, confirmed
  2) now > start_time + 15 minutes
  3) Update status to no_show
  4) Send follow-up message with rebook link
- External dependencies: Resend email credentials
- Time zone: Asia/Manila for window calculation
- Retries and error handling: retry status update then send follow-up
- Logging: workflow run log + update result
- Test procedure: create appointment in the past and verify status change
- Safe edit rules: ensure attended status is excluded

## Flow: Weekly report (optional)
- Trigger: Weekly cron
- Inputs: appointments table
- Steps:
  1) Aggregate totals by status
  2) Email summary to owner
- External dependencies: messaging provider credentials
- Retries and error handling: retry on send failure
- Logging: workflow run log
- Test procedure: run manual execution and verify email
- Safe edit rules: validate timeframe and time zone
