-- Consultation requests submitted by users, scoped to a professional.
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
