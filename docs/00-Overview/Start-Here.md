# Start Here

- Purpose: Quick onboarding for non-technical or first-time users.
- Audience: New team members, operators, beginners.
- Owner: Exorex
- Last updated: 2026-01-28
- Related: ./Scope.md, ../03-Implementation/Environment-Setup.md, ../05-Deployment-and-Ops/Deployment-Checklist.md
- Status: Active

## 1) What you need
- A Supabase account
- A Resend account
- Node.js 20.x installed
- Git installed

## 2) Clone and install
```bash
git clone <REPO_URL>
cd simp_appointment_reminder_no-show-reduc
npm install
```

## 3) Set environment variables
Copy `.env.local.example` to `.env.local` and fill in:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `EMAIL_FROM_ADDRESS`
- `APP_BASE_URL=http://localhost:3000`

## 4) Set up the database
Run the schema in Supabase:
- `docs/03-Implementation/Supabase-Schema.sql`

Seed services (example):
```sql
insert into services (name, duration_minutes, active)
values ('Haircut', 30, true), ('Haircut + Shave', 45, true), ('Hair Color', 60, true);
```

## 5) Start the app
```bash
npm run dev
```

Open:
- `http://localhost:3000/book`

## 6) E2E tests (optional)
Create `.env.test` from `.env.test.example`, set `TEST_SERVICE_ID`, then:
```bash
npx playwright install
npm run test:e2e
```

## 7) Need production?
See:
- `docs/05-Deployment-and-Ops/Deployment-Checklist.md`
- `docs/05-Deployment-and-Ops/Production-Runbook.md`
