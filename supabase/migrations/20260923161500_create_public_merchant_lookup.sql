-- Narrowly-scoped public merchant lookup for /r/{slug}.
-- Returns only branding fields a customer review page needs — never
-- user_id, email, or any other private field. RLS on public.merchants
-- is unchanged (still owner-only); this function is the sole public door.
create function public.get_merchant_public_by_slug(p_slug text)
returns table (
  id uuid,
  business_name text,
  slug text,
  logo_url text,
  brand_color text
)
language sql
security definer
set search_path = ''
stable
as $$
  select m.id, m.business_name, m.slug, m.logo_url, m.brand_color
  from public.merchants m
  where m.slug = p_slug
  limit 1;
$$;

revoke all on function public.get_merchant_public_by_slug(text) from public;
grant execute on function public.get_merchant_public_by_slug(text) to anon, authenticated;
