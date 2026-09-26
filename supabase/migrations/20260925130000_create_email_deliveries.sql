-- Email delivery is a separate concern from generation status.
-- One row per review (unique review_id) — retries update the same row
-- in place rather than creating new attempts, which combined with the
-- atomic claim in the Edge Function guarantees at most one successful
-- send per review.
create table public.email_deliveries (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null unique references public.reviews(id) on delete cascade,
  merchant_id uuid not null references public.merchants(id) on delete cascade,
  status text not null default 'pending'
    check (status in ('pending', 'sending', 'sent', 'failed')),
  provider_message_id text,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index email_deliveries_merchant_id_idx on public.email_deliveries (merchant_id);

create trigger email_deliveries_set_updated_at
  before update on public.email_deliveries
  for each row
  execute function public.set_updated_at();

alter table public.email_deliveries enable row level security;

-- Merchant may read their own delivery records (not required by any UI
-- this phase, but harmless and consistent with generated_content's own
-- pattern). No insert/update/delete policy for anon or authenticated —
-- only the service-role Edge Function writes this table.
create policy "email_deliveries_select_own"
  on public.email_deliveries for select
  to authenticated
  using (
    exists (
      select 1 from public.merchants m
      where m.id = email_deliveries.merchant_id
        and m.user_id = (select auth.uid())
    )
  );
