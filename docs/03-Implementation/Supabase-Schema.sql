-- Supabase schema + RLS policies for appointment reminders (Asia/Manila scheduling)

-- Extensions
create extension if not exists "pgcrypto";

-- Enum types
do $$
begin
  if not exists (select 1 from pg_type where typname = 'appointment_status') then
    create type appointment_status as enum (
      'booked',
      'confirmed',
      'cancelled',
      'rescheduled',
      'attended',
      'no_show'
    );
  end if;
end $$;

-- Updated-at trigger
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Tables
create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  duration_minutes integer not null check (duration_minutes > 0),
  price_cents integer,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists staff (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references services(id),
  staff_id uuid references staff(id),
  customer_name text not null,
  customer_phone text,
  customer_email text,
  start_time timestamptz not null,
  end_time timestamptz not null,
  status appointment_status not null default 'booked',
  confirm_token text not null unique,
  manage_token text not null unique,
  reminder_24h_sent_at timestamptz,
  reminder_2h_sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_time > start_time)
);

create table if not exists audit_log (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid references appointments(id) on delete cascade,
  action text not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- Indexes for reminder queries and admin views
create index if not exists appointments_start_time_idx on appointments (start_time);
create index if not exists appointments_status_idx on appointments (status);
create index if not exists appointments_start_time_status_idx on appointments (start_time, status);

-- Updated-at triggers
drop trigger if exists services_set_updated_at on services;
create trigger services_set_updated_at
before update on services
for each row execute procedure set_updated_at();

drop trigger if exists staff_set_updated_at on staff;
create trigger staff_set_updated_at
before update on staff
for each row execute procedure set_updated_at();

drop trigger if exists appointments_set_updated_at on appointments;
create trigger appointments_set_updated_at
before update on appointments
for each row execute procedure set_updated_at();

-- RLS
alter table services enable row level security;
alter table staff enable row level security;
alter table appointments enable row level security;
alter table audit_log enable row level security;

-- Services: public read, admin write
drop policy if exists services_select_public on services;
create policy services_select_public
on services for select
using (true);

drop policy if exists services_admin_write on services;
create policy services_admin_write
on services for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

-- Staff: admin-only
drop policy if exists staff_admin_access on staff;
create policy staff_admin_access
on staff for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

-- Appointments: admin-only (service role bypasses RLS for server actions)
drop policy if exists appointments_admin_access on appointments;
create policy appointments_admin_access
on appointments for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

-- Audit log: admin-only
drop policy if exists audit_log_admin_access on audit_log;
create policy audit_log_admin_access
on audit_log for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');
