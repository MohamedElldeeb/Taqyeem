-- Narrowly-scoped public read for the Wall of Love (/w/{slug}).
-- A review appears once it exists as a submitted review — generation
-- failure never hides the underlying (real, immutable) customer text.
-- image_url is surfaced only when generation actually completed; the raw
-- generated_content.status string itself is never exposed. No merchant
-- user_id or any other private field is reachable through this function.
create function public.get_public_testimonials_by_slug(p_slug text)
returns table (
  id uuid,
  customer_name text,
  rating integer,
  original_text text,
  created_at timestamptz,
  image_url text
)
language sql
security definer
set search_path = ''
stable
as $$
  select
    r.id,
    r.customer_name,
    r.rating,
    r.original_text,
    r.created_at,
    case when gc.status = 'completed' then gc.image_url else null end as image_url
  from public.reviews r
  join public.merchants m on m.id = r.merchant_id
  left join public.generated_content gc on gc.review_id = r.id
  where m.slug = p_slug
  order by r.created_at desc;
$$;

revoke all on function public.get_public_testimonials_by_slug(text) from public;
grant execute on function public.get_public_testimonials_by_slug(text) to anon, authenticated;
