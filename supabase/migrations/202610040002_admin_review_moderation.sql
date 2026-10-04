create table if not exists public.review_moderation_logs (
  id bigint generated always as identity primary key,
  review_id uuid,
  admin_user_id uuid not null,
  action text not null check (action in ('approved', 'rejected', 'restored', 'verified', 'unverified', 'deleted')),
  previous_status text check (previous_status is null or previous_status in ('pending', 'approved', 'rejected')),
  new_status text check (new_status is null or new_status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create index if not exists review_moderation_logs_review_idx
  on public.review_moderation_logs (review_id, created_at desc);

alter table public.review_moderation_logs enable row level security;

create or replace function public.get_admin_review_stats()
returns table (
  total_reviews bigint,
  pending_reviews bigint,
  approved_reviews bigint,
  rejected_reviews bigint,
  average_approved_rating numeric
)
language sql
stable
security definer
set search_path = public
as $$
  select
    count(*),
    count(*) filter (where status = 'pending'),
    count(*) filter (where status = 'approved'),
    count(*) filter (where status = 'rejected'),
    coalesce(round(avg(rating) filter (where status = 'approved')::numeric, 1), 0)
  from public.reviews;
$$;

revoke all on function public.get_admin_review_stats() from public;
grant execute on function public.get_admin_review_stats() to service_role;

-- No public policies are created. Both the audit log and statistics RPC remain
-- accessible only through the server-side service role.
