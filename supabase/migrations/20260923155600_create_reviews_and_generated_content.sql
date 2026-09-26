-- reviews (CLAUDE.md §5)
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references public.merchants(id) on delete cascade,
  customer_name text,
  rating integer not null check (rating between 1 and 5),
  original_text text not null check (length(trim(original_text)) > 0),
  status text not null default 'submitted'
    check (status in ('submitted', 'processing', 'completed', 'failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index reviews_merchant_id_created_at_idx
  on public.reviews (merchant_id, created_at desc);

create trigger reviews_set_updated_at
  before update on public.reviews
  for each row
  execute function public.set_updated_at();

alter table public.reviews enable row level security;

-- Merchant may read only their own reviews.
create policy "reviews_select_own"
  on public.reviews for select
  to authenticated
  using (
    exists (
      select 1 from public.merchants m
      where m.id = reviews.merchant_id
        and m.user_id = (select auth.uid())
    )
  );

-- Public (unauthenticated) customer submission — insert-only, and only ever
-- as a freshly submitted review. No public select/update/delete on reviews.
create policy "reviews_public_insert"
  on public.reviews for insert
  to anon
  with check (status = 'submitted');


-- generated_content (CLAUDE.md §5)
create table public.generated_content (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null unique references public.reviews(id) on delete cascade,
  image_url text,
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'completed', 'failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger generated_content_set_updated_at
  before update on public.generated_content
  for each row
  execute function public.set_updated_at();

alter table public.generated_content enable row level security;

-- Merchant may read only generated content for their own reviews.
-- No insert/update/delete policy: only the service-role key (n8n, Phase 11)
-- writes this table, and service role bypasses RLS by design.
create policy "generated_content_select_own"
  on public.generated_content for select
  to authenticated
  using (
    exists (
      select 1 from public.reviews r
      join public.merchants m on m.id = r.merchant_id
      where r.id = generated_content.review_id
        and m.user_id = (select auth.uid())
    )
  );
