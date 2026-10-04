create extension if not exists pgcrypto;

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  name varchar(80) not null,
  company varchar(120),
  job_title varchar(120),
  email varchar(254),
  avatar_url text,
  rating smallint not null check (rating between 1 and 5),
  review varchar(1200) not null check (char_length(review) between 40 and 1200),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  approved_at timestamptz,
  constraint approved_review_has_timestamp check (status <> 'approved' or approved_at is not null)
);

create index if not exists reviews_public_order_idx
  on public.reviews (status, approved_at desc)
  where status = 'approved';

create table if not exists public.review_submission_attempts (
  id bigint generated always as identity primary key,
  ip_hash char(64) not null,
  created_at timestamptz not null default now()
);

create index if not exists review_attempts_rate_limit_idx
  on public.review_submission_attempts (ip_hash, created_at desc);

alter table public.reviews enable row level security;
alter table public.review_submission_attempts enable row level security;

create or replace function public.get_review_summary()
returns table (review_count bigint, average_rating numeric)
language sql
stable
security definer
set search_path = public
as $$
  select count(*), coalesce(round(avg(rating)::numeric, 1), 0)
  from public.reviews
  where status = 'approved';
$$;

revoke all on function public.get_review_summary() from public;
grant execute on function public.get_review_summary() to service_role;

-- No public RLS policies are created. Only the server-side service role can read or write.
-- Moderate reviews in the Supabase dashboard. When approving, set both:
-- status = 'approved' and approved_at = now(). Email is never selected by the public API.
