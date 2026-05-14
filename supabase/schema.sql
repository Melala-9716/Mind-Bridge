create extension if not exists "pgcrypto";

create table if not exists public.professionals (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null unique,
  password text not null,
  specialization text not null,
  hospital text not null,
  city text not null,
  languages text[] not null default '{}',
  weekly_schedule jsonb not null default '[]'::jsonb,
  rating numeric(2,1) not null default 4.8,
  created_at timestamptz not null default now()
);

create index if not exists professionals_created_at_idx
  on public.professionals(created_at desc);

-- Keep in sync with supabase/migrations/* and /api/professionals/register payload.
alter table public.professionals add column if not exists bio text;

-- Older databases: ensure expected columns exist (no-op if already created above).
alter table public.professionals
  add column if not exists weekly_schedule jsonb not null default '[]'::jsonb;

alter table public.professionals
  add column if not exists languages text[] not null default '{}'::text[];

alter table public.professionals
  add column if not exists rating numeric(2, 1) not null default 4.8;

create table if not exists public.professional_reviews (
  id uuid primary key default gen_random_uuid(),
  professional_id uuid not null references public.professionals (id) on delete cascade,
  rating smallint not null check (rating >= 1 and rating <= 5),
  review_text text,
  created_at timestamptz not null default now()
);

create index if not exists professional_reviews_professional_created_idx
  on public.professional_reviews (professional_id, created_at desc);

create table if not exists public.consultation_requests (
  id uuid primary key default gen_random_uuid(),
  professional_id uuid references public.professionals (id) on delete cascade,
  full_name text,
  email text,
  phone text,
  message text,
  preferred_time text,
  contact_method text,
  preferred_languages text[],
  status text default 'pending',
  created_at timestamptz default now()
);

create index if not exists consultation_requests_professional_created_idx
  on public.consultation_requests (professional_id, created_at desc);
