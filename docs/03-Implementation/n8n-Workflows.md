# n8n Workflows (Phase 2)

- Purpose: Step-by-step reminder workflows for n8n using Supabase + Resend.
- Audience: Developers, operators.
- Owner: Exorex
- Last updated: 2026-01-26
- Related: ../02-Design/Automation-Flows.md, ../02-Design/Architecture.md, ../05-Deployment-and-Ops/Runbook.md
- Status: Active

## Shared setup
- Supabase REST base URL: `https://<project-ref>.supabase.co/rest/v1`
- Supabase service role key: use as `apikey` and `Authorization: Bearer <key>`
- Resend API base URL: `https://api.resend.com`
- Timezone: Asia/Manila (compute windows in Manila, store UTC)
- If using plain JS Date in Code nodes, set `TZ=Asia/Manila` in your n8n container.
- Importable workflows: see `docs/03-Implementation/n8n-workflows/`

### Import instructions (n8n)
1) Open n8n and go to Workflows.
2) Click “Import from file”.
3) Import:
   - `docs/03-Implementation/n8n-workflows/24h-reminder.json`
   - `docs/03-Implementation/n8n-workflows/2h-reminder.json`
   - `docs/03-Implementation/n8n-workflows/no-show-marker.json`
   - `docs/03-Implementation/n8n-workflows/weekly-report.json` (leave inactive)
4) Set env vars in n8n:
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RESEND_API_KEY`

### Node: Function (compute window)
Use this in both 24h and 2h workflows:

```javascript
const { DateTime } = require("luxon");

const timezone = "Asia/Manila";
const now = DateTime.now().setZone(timezone);

const windowMinutes = $json.windowMinutes; // 1440 for 24h, 120 for 2h
const start = now.plus({ minutes: windowMinutes - 5 });
const end = now.plus({ minutes: windowMinutes + 5 });

return [
  {
    windowStartUtc: start.toUTC().toISO(),
    windowEndUtc: end.toUTC().toISO(),
  },
];
```

## Workflow: 24h reminder
1) Cron: every 5-10 minutes
2) Function: set `windowMinutes = 1440`
3) HTTP Request (Supabase query):
   - Method: GET
   - URL: `https://<project-ref>.supabase.co/rest/v1/appointments`
   - Query params:
     - `select`: `id,customer_name,customer_email,start_time,manage_token`
     - `status=in.(booked,confirmed)`
     - `reminder_24h_sent_at=is.null`
     - `start_time=gte.{{$json.windowStartUtc}}`
     - `start_time=lte.{{$json.windowEndUtc}}`
   - Headers:
     - `apikey: <service_role_key>`
     - `Authorization: Bearer <service_role_key>`
4) IF: only continue when `customer_email` exists
5) HTTP Request (Resend):
   - Method: POST
   - URL: `https://api.resend.com/emails`
   - Headers: `Authorization: Bearer <resend_api_key>`
   - Body (JSON):
     - `from`: `no-reply@exorex.org`
     - `to`: `{{$json.customer_email}}`
     - `subject`: `Appointment reminder`
     - `html`: include manage link: `{{$json.manage_token}}`
6) HTTP Request (Supabase update):
   - Method: PATCH
   - URL: `https://<project-ref>.supabase.co/rest/v1/appointments?id=eq.{{$json.id}}`
   - Headers: `apikey`, `Authorization`, `Content-Type: application/json`
   - Body: `{ "reminder_24h_sent_at": "{{$now.toISO()}}" }`

## Workflow: 2h reminder
Same as 24h, but:
- `windowMinutes = 120`
- Update `reminder_2h_sent_at`
- Subject: `Your appointment is in 2 hours`

## Workflow: No-show marker
1) Cron: every 5-10 minutes
2) HTTP Request (Supabase query):
   - Method: GET
   - URL: `https://<project-ref>.supabase.co/rest/v1/appointments`
   - Query params:
     - `select`: `id,customer_name,customer_email,start_time,manage_token,status`
     - `status=in.(booked,confirmed)`
     - `no_show_followup_sent_at=is.null`
     - `start_time=lte.{{$now.minus({minutes: 15}).toISO()}}`
   - Headers: `apikey`, `Authorization`
3) HTTP Request (Supabase update):
   - Method: PATCH
   - URL: `https://<project-ref>.supabase.co/rest/v1/appointments?id=eq.{{$json.id}}`
   - Body: `{ "status": "no_show" }`
4) HTTP Request (Resend):
   - Send a follow-up email with a rebook link.
5) HTTP Request (Supabase update):
   - Body: `{ "no_show_followup_sent_at": "<now>" }`
6) HTTP Request (Supabase insert):
   - Insert audit log row with action `no_show_marked`.

## Workflow: Weekly report (optional)
1) Cron: weekly
2) HTTP Request (Supabase SQL via `rpc` or query view)
3) Email summary to owner via Resend

## Notes
- Ensure workflows are idempotent by checking the reminder_*_sent_at fields.
- Use Asia/Manila when computing reminder windows.
