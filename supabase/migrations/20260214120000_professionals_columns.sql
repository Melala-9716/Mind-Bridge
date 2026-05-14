-- Run in Supabase SQL Editor or via Supabase CLI (`supabase db push` / migration apply).
-- Fixes: "Could not find the 'bio' column of 'professionals' in the schema cache"
-- and aligns older databases with the app’s expected columns.

alter table public.professionals
  add column if not exists bio text;

alter table public.professionals
  add column if not exists weekly_schedule jsonb not null default '[]'::jsonb;

alter table public.professionals
  add column if not exists languages text[] not null default '{}'::text[];

alter table public.professionals
  add column if not exists rating numeric(2, 1) not null default 4.8;
