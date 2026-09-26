-- Drop pre-existing tables from a prior/unrelated project (explicitly authorized by user).
drop table if exists public.reviews cascade;
drop table if exists public.rate_limits cascade;
drop table if exists public.stores cascade;

-- Taqyeem merchants table (CLAUDE.md §5).
create table public.merchants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  business_name text not null,
  slug text not null unique,
  logo_url text,
  brand_color text not null default '#087F5B',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index merchants_slug_idx on public.merchants (slug);

-- Keep updated_at current on every row update.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger merchants_set_updated_at
  before update on public.merchants
  for each row
  execute function public.set_updated_at();

alter table public.merchants enable row level security;

-- A merchant may read only their own row (Phase 6 scope: auth-owner access only;
-- public read for /r/{slug} and /w/{slug} is added in Phase 7/8 when those pages
-- move off mock data).
create policy "merchants_select_own"
  on public.merchants for select
  to authenticated
  using (auth.uid() = user_id);

create policy "merchants_insert_own"
  on public.merchants for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "merchants_update_own"
  on public.merchants for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
